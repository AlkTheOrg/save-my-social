import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { setMessage } from "../../app/smsSlice";
import { ThunkAPI } from "../../app/store";
import { prepareBlobURL } from "../../util";
import { UrlAndFileNameThunkResponse } from "../types";
import { MappedTrackItem } from "./endpointTypes";
import { fetchPlaylists, fetchPlaylistTracks } from "./spotifyApiService";

const recursivelyCollectTracks = async (
  tracks: MappedTrackItem[],
  playlistId: string,
  beforeFetch: (tracksLen: number) => void,
  afterFetch: (tracksLen: number, fetchedTracksLen: number) => void,
  offset = 0,
) => {
  beforeFetch(tracks.length);

  const {
    data: { tracks: fetchedTracks },
  } = await fetchPlaylistTracks(playlistId, offset);

  tracks.push(...fetchedTracks);

  // if there may be more to fetch
  if (fetchedTracks.length === 100) {
    await recursivelyCollectTracks(
      tracks,
      playlistId,
      beforeFetch,
      afterFetch,
      offset + fetchedTracks.length,
    );
  }
};

export const getPlaylists = createAsyncThunk<
  UrlAndFileNameThunkResponse,
  void,
  ThunkAPI
>("spotify/getPlaylists", async (_, { dispatch, rejectWithValue }) => {
  const { data: playlistIds } = await fetchPlaylists();

  const beforeFetch = (tracksLen: number) =>
    dispatch(
      setMessage(
        `Getting tracks from ${tracksLen} to ${tracksLen + 100}.`,
      ),
    );
  const afterFetch = (tracksLen: number, fetchedTracksLen: number) =>
    dispatch(
      setMessage(
        `Successfully imported tracks from ${tracksLen} to ${
          tracksLen + fetchedTracksLen
        }`,
      ),
    );

  try {
    // const playlists: Record<string, MappedTrackItem[]> = {};
    const playlists = [] as Array<Record<string, MappedTrackItem[]>>;
    for (let i = 0; i < playlistIds.length; i += 1) {
      const id = playlistIds[i];
      const tracks = [] as MappedTrackItem[];
      // eslint-disable-next-line no-await-in-loop
      await recursivelyCollectTracks(tracks, id, beforeFetch, afterFetch);
      playlists.push({ [id]: tracks });
    }

    const fileName = "spotify_playlists.json";
    const url = prepareBlobURL(playlists, "application/json");

    return { url, fileName };
  } catch (_err) {
    const error = _err as AxiosError;
    return rejectWithValue({
      msg: (error.response?.data as { msg: string })?.msg || error.message,
    });
  }
});

export const getImportStartedText = (
  numOfPlaylists: number,
  loopIndex = -1,
) => (loopIndex >= 0
  ? `Importing playlist ${loopIndex + 1}/${numOfPlaylists}`
  : "Started importing tracks");
