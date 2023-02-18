import { ReqWithCredentials } from "../../controllers/types";

export type SavedModel = {
  name: string;
  id: string;
  title?: string;
  link_title?: string;
  over_18: boolean;
  permalink: string;
  subreddit: {
    display_name: string
  };
};

export type ProcessedSavedModel = {
  id: string,
  kind: 'Comment' | 'Post',
  kindID: string,
  subreddit: string,
  title: string,
  over_18: boolean,
  permalink: string,
  link: string,
};

export type FetchSavedModelsResponse = {
  models: ProcessedSavedModel[],
  lastQueried: string,
}

export type AuthHeaders = {
  Authorization: string,
  Accept: string,
  'Content-Type': string,
  'User-Agent'?: string,
}

export interface ReqWithItemAfter extends ReqWithCredentials {
  body: {
    after: string,
  }
}
