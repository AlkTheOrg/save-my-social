import axios from "axios";
import { SPOTIFY_BACEND } from "../../constants/apiEndpoints";
import {
  FetchAuthURLResponse,
  FetchPlaylistTracksReponse,
  GetPlaylistsResponse,
} from "./endpointTypes";

export const fetchAuthURL = () =>
  axios.get<FetchAuthURLResponse>(`${SPOTIFY_BACEND}/auth-url`);

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
