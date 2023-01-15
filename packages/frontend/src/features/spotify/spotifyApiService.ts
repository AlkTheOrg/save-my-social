import axios from "axios";
import { SPOTIFY_BACEND } from "../../constants/apiEndpoints";
import { FetchAuthURLResponse, FetchPlaylistTracksReponse, GetPlaylistsResponse } from "./endpointTypes";

export const fetchAuthURL = () =>
  axios.get<FetchAuthURLResponse>(`${SPOTIFY_BACEND}/auth-url`);

export const fetchPlaylists = async (accessToken: string) =>
  axios.post<GetPlaylistsResponse>(
    `${SPOTIFY_BACEND}/playlists`,
    { accessToken },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

export const fetchPlaylistTracks = async (
  accessToken: string,
  playlistId: string,
  offset = 0,
) => axios.post<FetchPlaylistTracksReponse>(
  `${SPOTIFY_BACEND}/playlistTracks`,
  { accessToken, playlistId, offset },
  {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
);
