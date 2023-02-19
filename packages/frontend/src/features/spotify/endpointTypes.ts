export type GetPlaylistsResponse = string[];

export type FetchAuthURLResponse = {
  url: string,
};

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

export type FetchPlaylistTracksReponse = {
  tracks: Array<MappedTrackItem>,
  newOffset: number,
  next: string | null,
}
