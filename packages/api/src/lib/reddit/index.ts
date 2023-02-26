import { default as axios } from 'axios';
import { AccessTokenReqConfig } from '../../controllers/types.js';
import { AuthHeaders, FetchSavedModelsResponse, ProcessedSavedChildren, SavedChildren } from './types.js';

export const processSavedChildren = (children: SavedChildren[]): ProcessedSavedChildren[] =>
  children.map((child) => ({
    id: child.data.id,
    kind: child.kind === 't1' ? 'Comment' : 'Post',
    kindID: `${child.kind}_${child.data.id}`,
    subreddit: child.data.subreddit,
    title: child.data.title || child.data.link_title || '',
    over_18: child.data.over_18,
    permalink: child.data.permalink,
    // url: child.data.url,
    link: 'https://reddit.com' + child.data.permalink,
    // category: child.data.category
  }));

export const redditSavedModelColumnNames: {
  [P in keyof ProcessedSavedChildren]: any;
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

export const getAuthHeaders = (accessToken: string): AuthHeaders => ({
  Authorization: `Bearer ${accessToken}`,
  Accept: "*/*",
  // "User-Agent": "axios/0.21.1",
  "Content-Type": "application/x-www-form-urlencoded",
});

export const getAuthOptions = (
  code: string,
  redirect_uri: string,
  clientID: string,
  secret: string
): AccessTokenReqConfig => ({
  url: 'https://www.reddit.com/api/v1/access_token',
  form: {
    code,
    redirect_uri,
    grant_type: 'authorization_code',
  },
  axiosConfig: {
    headers: {
      Accept: 'application/json',
      Authorization: 'Basic ' + Buffer.from(clientID + ':' + secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
});

export async function getSavedModelsRecursive(
  userURL: string,
  headers: AuthHeaders,
  lastQueried: string | undefined | null = undefined,
  resultArr: ProcessedSavedChildren[] = [],
  // maxNumOfRecursions = 2
) {
  // if (!maxNumOfRecursions) return resultArr;
  const params = {
    limit: 100,
    after: lastQueried,
  };
  const { data } = await axios.get(userURL, { headers, params });
  const { children, after } = data.data;
  resultArr.push(...processSavedChildren(children));
  if (after) {
    await getSavedModelsRecursive(userURL, headers, after, resultArr);
  }
}

export const getMe = async (headers) => {
  const {
    data: {
      subreddit: { url }, // can also return display_name, display_name_prefixed, name
    },
  } = await axios.get('https://oauth.reddit.com/api/v1/me', { headers });
  return url;
}

export const fetchSavedModels = async (
  accessToken: string,
  after?: string,
): Promise<FetchSavedModelsResponse> => {
  const headers = getAuthHeaders(accessToken);
  const result = {
    models: [],
    lastQueried: '',
  } as FetchSavedModelsResponse;
  const userURL = await getMe(headers); // /user/<username>/
  const savedEndpoint = `https://oauth.reddit.com${userURL}saved`;
  const params = { limit: 100, after }; // can also be added to the endpoint url as a query string

  const savedResponse = await axios.get(savedEndpoint, { headers, params });
  const { children } = savedResponse.data.data;
  result.models.push(...processSavedChildren(children));

  const lastModel = result.models[result.models.length - 1] || null;
  if (lastModel && lastModel.id) {
    result.lastQueried = lastModel.kindID;
  }
  return result;
};
