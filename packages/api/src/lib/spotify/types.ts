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
    uri: string,
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
  lastQueried: string,
}
