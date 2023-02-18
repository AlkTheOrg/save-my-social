import { FetchSavedModelsResponse, ProcessedSavedModel, SavedModel } from './types.js';
import snoowrap from 'snoowrap';
import { ClientCredentials } from '../../controllers/types.js';
import Snoowrap from 'snoowrap';

export const processSavedChildren = (models: SavedModel[]): ProcessedSavedModel[] =>
  models.map((child) => ({
    id: child.id,
    kind: child.name.split('_')[0] === 't1' ? 'Comment' : 'Post',
    kindID: child.name,
    subreddit: child.subreddit.display_name,
    title: child.title || child.link_title || 'Title not found',
    over_18: child.over_18,
    permalink: child.permalink,
    link: 'https://reddit.com' + child.permalink,
  }));

export const redditSavedModelColumnNames: {
  [P in keyof ProcessedSavedModel]: any;
} = {
  id: 1,
  kind: 1,
  kindID: 1,
  subreddit: 1,
  title: 1,
  over_18: 1,
  permalink: 1,
  link: 1,
};

const getSnoowrapClient = (credentials: ClientCredentials) => new snoowrap({
    userAgent: 'nodejs',
    clientId: credentials.CLIENT_ID,
    clientSecret: credentials.SECRET,
    username: credentials.USERNAME,
    password: credentials.PASSWORD
  });

const snoowrap_getSavedModels = async (
  client: Snoowrap,
  lastQueried: string | undefined | null = undefined,
) => {
  const options = {
    limit: 100,
    after: lastQueried,
  };
  const res = client.getMe().getSavedContent(options)
    .then(x => x)
    .catch(e => {
      console.log(e);
      throw new Error('An error occured while fetching saved models. Please check the log from your terminal.')
    })
  return res;
}

export const fetchSavedModels = async (
  credentials: ClientCredentials,
  after?: string,
): Promise<FetchSavedModelsResponse> => {
  const result = {
    models: [],
    lastQueried: '',
  } as FetchSavedModelsResponse;

  const r = getSnoowrapClient(credentials);
  const models = await snoowrap_getSavedModels(r, after);

  result.models.push(...processSavedChildren(models as unknown as SavedModel[]));

  const lastModel = result.models[result.models.length - 1] || null;
  if (lastModel && lastModel.id) {
    result.lastQueried = lastModel.kindID;
  }
  return result;
};
