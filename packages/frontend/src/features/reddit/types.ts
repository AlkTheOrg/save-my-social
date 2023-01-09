export interface RedditState {
  name: string;
  selections: string[]; // TODO: Not implemented yet
}

export type GetSavedModelsThunkResponse = {
  url: string,
  fileName: string,
};
