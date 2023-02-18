import { Request } from 'express';

export interface RequestWithAT extends Request {
  accessToken: string
}

export interface CustomRequest<T> extends Request {
  body: T
}

export interface CustomRequestWithAT<T> extends CustomRequest<T> {
  accessToken: string
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

export type SmsApp =
  | "reddit"
  | "spotify"
  | "twitter"
  | "youtube"
  | "notion"
  | "sheets"
  | "download";

export type ActiveApp = Exclude<SmsApp, "download" | "twitter" | "youtube">;

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
    lastTrackID: string,
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
    lastTweetID: string,
  }
}
export type FeaturesOfTwitterExport = {
  twitter: TwitterBookmarkExport
}

export type FeaturesOfSocialAppExport =
  | FeaturesOfRedditExport
  | FeaturesOfSpotifyExport
  // | FeaturesOfYoutubeExport
  // | FeaturesOfTwitterExport; // Inactive apps

export interface ReqBodyWithAccessToken {
  accessToken: string,
};

export interface ReqBodyWithExportProps_Deprecated extends ReqBodyWithAccessToken {
  exportProps: FeaturesOfSocialAppExport,
};

export interface ReqBodyWithExportProps {
  exportProps: FeaturesOfSocialAppExport
};
