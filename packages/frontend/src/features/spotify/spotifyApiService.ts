import axios from "axios";
import { SPOTIFY_BACEND } from "../../constants/apiEndpoints";
import { FetchAuthURLResponse, GetPlaylistsResponse } from "./endpointTypes";

export const fetchAuthURL = () =>
  axios.get<FetchAuthURLResponse>(`${SPOTIFY_BACEND}/auth-url`);

export const getPlaylists = async (accessToken: string) =>
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
