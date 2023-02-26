import SpotifyWebApi from 'spotify-web-api-node';
import { Client } from "@notionhq/client";
import {
  AccessTokenReqConfig,
  FeaturesOfRedditExport,
  FeaturesOfSpotifyExport,
  FeaturesOfTwitterExport,
} from "../../controllers/types.js";
import { fetchSavedModels } from "../reddit/index.js";
import { ProcessedSavedChildren } from "../reddit/types.js";
import { fetchPlaylistTracks, getPlaylist } from "../spotify/index.js";
import DBCreator from "./dbCreator.js";
import PageCreator,
{ createRedditPropsForDBPage, createSpotifyTrackPropsForDBPage, createTweetPropsForDBPage } from "./pageCreator.js";
import { CreateDBPropArguments, CreatePagesFromRedditExportPropsResponse, CreatePagesFromSpotifyExportPropsResponse, CreatePagesFromTwitterExportPropsResponse } from "./types.js";
import { MappedTrackItem } from '../spotify/types.js';
import { fetchBookmarks as fetchTwitterBookmarks } from '../twitter/index.js';
import { TweetResponse } from '../twitter/types.js';

export const getAuthOptions = (
  code: string,
  redirect_uri: string,
  clientID: string,
  secret: string,
): AccessTokenReqConfig => ({
  url: 'https://api.notion.com/v1/oauth/token',
  form: {
    code,
    redirect_uri,
    grant_type: 'authorization_code',
  },
  axiosConfig: {
    headers: {
      Authorization:
        'Basic ' + Buffer.from(clientID + ':' + secret).toString('base64'),
      'Content-Type': 'application/json',
    },
  },
});

export const getLastEditedPage = async (notion: Client, query = '') => {
  const {
    results: [page],
  } = await notion.search({
    query,
    sort: {
      direction: 'descending',
      timestamp: 'last_edited_time',
    },
    filter: {
      property: 'object',
      value: 'page',
    },
  });
  return page;
};

export const updateDBTitle = (notion: Client, title: string, dbID: string) => {
  return notion.databases.update({
    database_id: dbID,
    title: [
      {
        text: {
          content: title,
        },
      },
    ],
  });
};

export const retrieveDB = (notion: Client, dbID: string) =>
  notion.databases.retrieve({ database_id: dbID });

export const retrievePage = (notion: Client, pageId: string) =>
  notion.pages.retrieve({ page_id: pageId });

export const createDB = async (
  notion: Client,
  parentPageID: string,
  title: string,
  properties: Array<CreateDBPropArguments>,
) => {
  const dbCreator = DBCreator();
  const db = await dbCreator.createDB(notion, parentPageID, title, properties);
  return db;
};

const createPagesFromRedditModels = async (
  notion: Client,
  dbID: string,
  models: ProcessedSavedChildren[],
) => {
  const pageCreator = PageCreator();
  return Promise.all(
    models.map(async (model) =>
      pageCreator.createDBPage(notion, dbID, createRedditPropsForDBPage(model)),
    ),
  );
}; 

export const createPagesFromRedditExportProps = async (
  notion: Client,
  redditAccessToken,
  dbID: string,
  exportProps: FeaturesOfRedditExport,
): CreatePagesFromRedditExportPropsResponse => {
  const { reddit: { saved: { lastItemID }}} = exportProps as FeaturesOfRedditExport;
  const { models, lastQueried } = await fetchSavedModels(redditAccessToken, lastItemID);
  await createPagesFromRedditModels(notion, dbID, models);
  return {
    numOfImportedItems: models.length,
    newExportProps: {
      reddit: {
        saved: {
          lastItemID: lastQueried
        }
      }
    }
  };
};

const createPagesFromTweets = async (
  notion: Client,
  dbID: string,
  tweets: TweetResponse[],
) => {
  const pageCreator = PageCreator();
  return Promise.all(
    tweets.map(async (tweet) =>
      pageCreator.createDBPage(notion, dbID, createTweetPropsForDBPage(tweet)),
    ),
  );
}; 

export const createPagesFromTwitterExportProps = async (
  notion: Client,
  twitterAccessToken,
  dbID: string,
  exportProps: FeaturesOfTwitterExport,
): CreatePagesFromTwitterExportPropsResponse => {
  const { twitter: { bookmarks: { paginationToken }}} = exportProps as FeaturesOfTwitterExport;
  const { nextToken, resultCount, tweets } = await fetchTwitterBookmarks(twitterAccessToken, paginationToken);
  await createPagesFromTweets(notion, dbID, tweets);
  return {
    numOfImportedItems: resultCount,
    newExportProps: {
      twitter: {
        bookmarks: {
          paginationToken: nextToken
        }
      }
    }
  };
};

const createPagesFromSpotifyTracks = async (
  notion: Client,
  dbID: string,
  tracks: MappedTrackItem[]
) => {
  const pageCreator = PageCreator();
  return Promise.all(
    tracks.map(async (track) =>
      pageCreator.createDBPage(
        notion,
        dbID,
        createSpotifyTrackPropsForDBPage(track)
      )
    )
  );
};

export const createPagesFromSpotifyExportProps = async (
  notion: Client,
  spotifyAccessToken: string,
  dbID: string,
  exportProps: FeaturesOfSpotifyExport,
): CreatePagesFromSpotifyExportPropsResponse => {
  const { spotify: { playlist: { id, offset }}} = exportProps as FeaturesOfSpotifyExport;
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(spotifyAccessToken);

  const {
    body: {
      name: playlistName,
      tracks: { total: totalNumOfTracks },
    },
  } = await getPlaylist(spotifyApi, (exportProps as FeaturesOfSpotifyExport).spotify.playlist.id);
  const { tracks, newOffset } = await fetchPlaylistTracks(spotifyApi, id, offset);

  await createPagesFromSpotifyTracks(notion, dbID, tracks);

  return {
    numOfImportedItems: tracks.length,
    playlistName,
    totalNumOfTracks,
    newExportProps: {
      spotify: {
        playlist: {
          id,
          offset: newOffset
        }
      }
    }
  };
};
