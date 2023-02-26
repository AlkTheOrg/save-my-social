import { Client } from '@notionhq/client';
import { ProcessedSavedChildren } from '../reddit/types.js';
import { MappedTrackItem } from '../spotify/types.js';
import { TweetResponse } from '../twitter/types.js';
import {
  DBPropTypeName,
  DBPageCheckboxProp,
  DBPageNumberProp,
  DBPageRichTextProp,
  DBPageSelectProp,
  DBPageTitleProp,
  ParentDBID,
  DBPagePropType,
  CreateDBPagePropArguments,
  DBPageURLProp,
} from './types.js';

const PageCreator = () => {
  const createParentIDObj = (parentDBID: string): ParentDBID => ({
    database_id: parentDBID,
    type: 'database_id',
  });

  const propCreators: Record<
    DBPropTypeName,
    (value: string | number | null | boolean) => DBPagePropType
  > = {
    title: (title: string): DBPageTitleProp => ({
      title: [
        {
          text: {
            content: title,
          },
        },
      ],
    }),
    number: (number: number | null): DBPageNumberProp => ({
      number,
    }),
    rich_text: (text: string): DBPageRichTextProp => ({
      rich_text: [
        {
          text: {
            content: text,
          },
        },
      ],
    }),
    checkbox: (isChecked: boolean): DBPageCheckboxProp => ({
      checkbox: isChecked,
    }),
    select: (option: string): DBPageSelectProp => ({
      select: {
        name: option,
      },
    }),
    url: (url: string): DBPageURLProp => ({
      url
    })
  };

  const createDBPageProp = ({
    type,
    key,
    value,
  }: CreateDBPagePropArguments) => ({
    [key]: propCreators[type](value),
  });

  const createDBPage = (
    notion: Client,
    parentDBID: string,
    properties: Array<CreateDBPagePropArguments>,
  ) =>
    notion.pages.create({
      parent: createParentIDObj(parentDBID),
      properties: properties.reduce(
        (prev, curArgs) => ({
          ...prev,
          ...createDBPageProp(curArgs),
        }),
        {},
      ),
    });

  return {
    createDBPageProp,
    createDBPage,
  };
};

export const createRedditPropsForDBPage = (
  item: ProcessedSavedChildren,
): Array<CreateDBPagePropArguments> => [
  { key: 'Title', type: 'title', value: item.title },
  { key: 'ID', type: 'rich_text', value: item.kindID },
  { key: 'Subreddit', type: 'rich_text', value: item.subreddit },
  { key: 'Over 18', type: 'checkbox', value: item.over_18 },
  { key: 'Type', type: 'select', value: item.kind },
  { key: 'Link', type: 'url', value: item.link },
];

export const createTweetPropsForDBPage = (
  tweet: TweetResponse,
): Array<CreateDBPagePropArguments> => [
  { key: 'ID', type: 'title', value: tweet.id },
  { key: 'Text', type: 'rich_text', value: tweet.text },
  { key: 'Created At', type: 'rich_text', value: tweet.created_at },
  { key: 'Link', type: 'url', value: tweet.url },
  { key: 'Author', type: 'rich_text', value: tweet.author },
];

export const createSpotifyTrackPropsForDBPage = (
  track: MappedTrackItem,
): Array<CreateDBPagePropArguments> => [
  { key: 'ID', type: 'rich_text', value: track.id },
  { key: 'Name', type: 'title', value: track.name },
  { key: 'Artists', type: 'rich_text', value: track.artists },
  { key: 'Album', type: 'rich_text', value: track.album },
  { key: 'Link', type: 'url', value: track.url },
  { key: 'Duration', type: 'rich_text', value: String(track.duration) },
  { key: 'Popularity', type: 'number', value: track.popularity },
  { key: 'Explicit', type: 'checkbox', value: track.explicit },
  { key: 'Preview URL', type: 'rich_text', value: track.preview_url },
  { key: 'Album Cover', type: 'rich_text', value: track.album_cover },
  { key: 'Added At', type: 'rich_text', value: track.added_at },
]

export default PageCreator;
