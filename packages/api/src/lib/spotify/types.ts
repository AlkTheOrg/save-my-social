export type Playlist = {
  id: string,
  name: string,
  owner: {
    id: string,
  },
  tracks: {
    total: number,
  },
  description: string,
  uri: string,
  images: Array<{ url: string }>
}

type Track = {
  id: string,
  name: string,
  artists: Array<{ name: string }>,
  album: {
    name: string,
    images: Array<{ url: string }>
  },
  uri: string,
  duration_ms: number,
  explicit: boolean,
  popularity: number,
  preview_url: string,
  external_urls: {
    spotify: string
  }
}

export type TrackItem = {
  track: Track,
  added_at: string
}

export type MappedTrackItem = {
    id: string,
    name: string,
    artists: string,
    album: string,
    url: string,
    duration: number,
    explicit: boolean,
    popularity: number,
    preview_url: string,
    album_cover: string,
    added_at: string,
    // is_local: string,
}

export type GetPlaylistTracksResponse = {
  body: {
    items: Array<TrackItem>,
    next: string
  }
}

export type FetchPlaylistTracksReponse = {
  tracks: Array<MappedTrackItem>,
  newOffset: number,
  next: string | null,
}

export type GetPlaylistReponse = {
  body: {
      collaborative: false,
    description: string,
    external_urls: {
      spotify: string,
    },
    href: string,
    id: string,
    // images: [ [Object] ],
    name: string,
    owner: {
      display_name: string,
      // external_urls: [Object],
      href: string
      id: string
      type: string
      uri: string
    },
    primary_color: string,
    public: boolean,
    snapshot_id: 'MTY3MzAzNDExOCwwMDAwMDAwMGNjYjE2YmZiNGM5YTJjMTRiNTZjMTk1ZTMzNjQ0ZDc3',
    tracks: {
      href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DWXRqgorJj26U/tracks?offset=0&limit=100',
        // items: [Array],
        limit: number,
      // next: string, or null?
      offset: number,
      // previous: null,
      total: number
    },
    type: string,
    uri: string,
  }
};

export type SpotifyApi = {
  getPlaylist: (id: string) => Promise<GetPlaylistReponse>;
  getPlaylistTracks: (playlistId: string, options: {
    limit: number,
    offset?: number,
  }) => Promise<GetPlaylistTracksResponse>;
  getUserPlaylists: (options: { limit: number, offset?: number, }) => {
    body: {
      items: Array<Playlist>,
      next: unknown,
    }
  };
}
