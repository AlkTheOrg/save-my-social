import axios from "axios";
import { SPOTIFY_BACEND } from "../../constants/apiEndpoints";
import {
  FetchPlaylistTracksReponse,
  GetPlaylistsResponse,
} from "./endpointTypes";

export const fetchPlaylists = async () =>
  axios.post<GetPlaylistsResponse>(
    `${SPOTIFY_BACEND}/playlists`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

export const fetchPlaylistTracks = async (
  playlistId: string,
  offset = 0,
) => axios.post<FetchPlaylistTracksReponse>(
  `${SPOTIFY_BACEND}/playlistTracks`,
  { playlistId, offset },
  {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
);
