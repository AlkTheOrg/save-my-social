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

export type Track = {
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

export type GetPlaylistTracksResponse = {
  body: {
    items: Array<{
      track: Track,
      added_at: string
    }>,
    next: string
  }
}
