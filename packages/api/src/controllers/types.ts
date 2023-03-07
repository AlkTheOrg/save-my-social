//* DEFINE NEW TYPES WITH "ZOD" AS MUCH AS POSSIBLE
import { Request } from 'express';
import { z } from 'zod';

export interface RequestWithAT extends Request {
  accessToken: string
}

export interface CustomRequestWithAT<T> extends RequestWithAT {
  body: T
}

export type ScopeVariables = string[];

// One Time Token Request Options
export type OTTReqOptions = {
  client_id: string,
  redirect_uri: string,
  scope: string,
  response_type: 'code',
  show_dialog: 'true' | 'false',
  state: string,
}

export interface OTTReqNotionOptions extends Omit<OTTReqOptions, 'scope'> {
  owner: "user";
}

export interface OTTReqTwitterOptions extends Omit<OTTReqOptions, 'scope'> {
  code_challenge: 'challenge',
  code_challenge_method: 'plain' | 's256',
}

// Access Token request configuration
export interface AccessTokenReqConfig {
  url: string,
  form: {
    code: string,
    redirect_uri: string,
    grant_type: 'authorization_code',
  },
  axiosConfig: {
    headers: {
      Accept?: string,
      Authorization?: string,
      'Content-Type': 'application/x-www-form-urlencoded' | 'application/json',
    },
    auth?: {
      username: string,
      password: string,
    }
  }
}

export interface AccessTokenResponse {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,
  scope: string,
}

export const SmsApp = z.enum(['reddit', 'spotify', 'twitter', 'notion', 'sheets', 'youtube', 'download']);
export type SmsApp = z.infer<typeof SmsApp>;

export const ActiveApp = z.enum(['reddit', 'spotify', 'twitter', 'notion', 'sheets']);
export type ActiveApp = z.infer<typeof ActiveApp>;

export type ExportFrom = Exclude<
  SmsApp,
  "notion" | "sheets" | "download"
>;
export type ExportTo = SmsApp;

// REDDIT
type RedditSavedModelsExport = {
  saved: {
    lastItemID: string,
  }
}
export type FeaturesOfRedditExport = {
  reddit: RedditSavedModelsExport
}

// SPOTIFY
type SpotifyPlaylistExport = {
  playlist: {
    id: string,
    offset: number,
  }
};

export type FeaturesOfSpotifyExport = {
  spotify: SpotifyPlaylistExport
}

// YOUTUBE
type YoutubePlaylistExport = {
  playlist: {
    id: string,
    lastVideoID: string,
  }
}
export type FeaturesOfYoutubeExport = {
  youtube: YoutubePlaylistExport
}

// TWITTER
type TwitterBookmarkExport = {
  bookmarks: {
    paginationToken?: string,
  }
}
export type FeaturesOfTwitterExport = {
  twitter: TwitterBookmarkExport
}

export type FeaturesOfSocialAppExport =
  | FeaturesOfRedditExport
  | FeaturesOfSpotifyExport
  | FeaturesOfTwitterExport;
  // | FeaturesOfYoutubeExport

export interface ReqBodyWithExportProps {
  exportProps: FeaturesOfSocialAppExport
};

export interface ReqBodyOfGetPlaylistTracks {
  playlistId: string,
  offset?: number,
}
