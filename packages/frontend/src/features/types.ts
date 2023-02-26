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
    lastTweetID: string,
  }
}
export type FeaturesOfTwitterExport = {
  twitter: TwitterBookmarkExport
}

export type FeaturesOfSocialAppExport =
  | FeaturesOfRedditExport
  | FeaturesOfSpotifyExport
  | FeaturesOfYoutubeExport
  | FeaturesOfTwitterExport;

export type UrlAndFileNameThunkResponse = {
  url: string,
  fileName: string
}
