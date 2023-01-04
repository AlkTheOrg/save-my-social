// import SpotifyWebApi from 'spotify-web-api-node';
import { GetPlaylistTracksResponse, Playlist, Track } from './types.js';
// const spptifyApi = new SpotifyWebApi();

const spotifyTrackMapper = (track: Track) => {
  return {
    id: track.id || '',
    name: track.name,
    artists: track.artists.map((artist) => artist.name).join(", "),
    album: track.album.name,
    uri: track.uri || '',
    duration: track.duration_ms,
    explicit: track.explicit,
    popularity: track.popularity,
    preview_url: track.preview_url || '',
    album_cover: track.album.images.length ? track.album.images[0].url : '',
    // is_local: track.is_local,
  };
};

const spotifyPlaylistMapper = (playlist: Playlist) => ({
  id: playlist.id,
  name: playlist.name,
  owner: playlist.owner.id,
  numOfTracks: playlist.tracks.total,
  description: playlist.description,
  uri: playlist.uri,
  images: playlist.images.map((image) => image.url).join("|"),
});

export const getPlaylistIDs = async (spotifyApi, limit = 50, offset = 0) => {
  const { body: { items, next } } = await spotifyApi.getUserPlaylists({ limit,offset });
  const ids = [...items as Array<Playlist>].map(p => p.id)
  if (next) {
    return [...ids, ...(await getPlaylistIDs(spotifyApi, limit, offset + limit))];
  } else return ids;
};
