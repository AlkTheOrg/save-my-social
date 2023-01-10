type FeaturesOfRedditExport = {
  reddit: {
    saved: {
      lastItemID: string,
    }
  }
}

type FeaturesOfSpotifyExport = {
  spotify: {
    playlist: {
      id: string,
      lastTrackID: string,
    },
    likedSongs: {
      lastTrackID: string,
    }
  }
}

type FeaturesOfYoutubeExport = {
  youtube: {
    playlist: {
      id: string,
      lastVideoID: string,
    }
  }
}

type FeaturesOfTwitterExport = {
  twitter: {
    bookmarks: {
      lastTweetID: string,
    }
  }
}

export type FeaturesOfSocialAppExport =
  | FeaturesOfRedditExport
  | FeaturesOfSpotifyExport
  | FeaturesOfYoutubeExport
  | FeaturesOfTwitterExport;
