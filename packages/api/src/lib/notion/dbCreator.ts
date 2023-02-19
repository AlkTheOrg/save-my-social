import { Client } from '@notionhq/client';
import {
  CheckBoxProp,
  CreateDBPropArguments,
  DBPropType,
  DBPropTypeName,
  NumberFormat,
  NumberProp,
  ParentPageID,
  RichTextProp,
  SelectOptions,
  SelectProp,
  SocialAppToDBPropsMapping,
  Title,
  TitleProp,
  URLProp,
} from './types.js';

const DBCreator = () => {
  const createParentIDObj = (parentPageID: string): ParentPageID => ({
    page_id: parentPageID,
    type: 'page_id',
  });

  const createTitle = (title: string): Title => ([{
    type: 'text',
    text: { content: title },
  }]);

  const propCreators: Record<
    DBPropTypeName,
    (args: undefined | NumberFormat | SelectOptions) => DBPropType
  > = {
    title: (): TitleProp => ({
      type: 'title',
      title: {},
    }),
    number: (numberFormat: NumberFormat): NumberProp => ({
      type: 'number',
      number: {
        format: numberFormat, // we will be using "number" most of the times
      },
    }),
    rich_text: (): RichTextProp => ({
      type: 'rich_text',
      rich_text: {},
    }),
    checkbox: (): CheckBoxProp => ({
      type: 'checkbox',
      checkbox: {},
    }),
    select: (options: SelectOptions): SelectProp => ({
      type: 'select',
      select: {
        options
      },
    }),
    url: (): URLProp => ({
      url: {},
      type: 'url',
    }),
  };

  const createDBProp = ({ type, key, args }: CreateDBPropArguments) => ({
    [key]: propCreators[type](args),
  });

  const createDB = (
    notion: Client,
    parentPageID: string,
    title: string,
    properties: Array<CreateDBPropArguments>,
  ) => {
    return notion.databases.create({
      parent: createParentIDObj(parentPageID),
      title: createTitle(title),
      properties: properties.reduce((prev, curArgs) => ({
        ...prev,
        ...createDBProp(curArgs)
      }), {}),
    });
  };

  return {
    createDBProp,
    createDB
  }
};

export const socialAppToDBPropsMapping: SocialAppToDBPropsMapping = {
  reddit: {
    reddit_saved: {
      properties: [
        // {
        //   type: 'number',
        //   key: 'Count',
        //   args: 'number',
        // },
        {
          type: 'title',
          key: 'Title',
          args: undefined,
        },
        {
          type: 'rich_text',
          key: 'ID',
          args: undefined,
        },
        {
          type: 'rich_text',
          key: 'Subreddit',
          args: undefined,
        },
        {
          type: 'checkbox',
          key: 'Over 18',
          args: undefined,
        },
        {
          type: 'select',
          key: 'Type',
          args: [
            {
              name: 'Comment',
              color: 'brown',
            },
            {
              name: 'Post',
              color: 'orange',
            },
          ],
        },
        {
          type: 'url',
          key: 'Link',
          args: undefined,
        },
      ]
    }
  },
  spotify: {
    spotify_playlist: {
      properties: [
        {
          type: 'rich_text',
          key: 'ID',
          args: undefined,
        },
        {
          type: 'title',
          key: 'Name',
          args: undefined,
        },
        {
          type: 'rich_text',
          key: 'Artists',
          args: undefined,
        },
        {
          type: 'rich_text',
          key: 'Album',
          args: undefined,
        },
        {
          type: 'url',
          key: 'Link',
          args: undefined,
        },
        {
          type: 'rich_text',
          key: 'Duration',
          args: undefined,
        },
        {
          type: 'number',
          key: 'Popularity',
          args: undefined,
        },
        {
          type: 'checkbox',
          key: 'Explicit',
          args: undefined,
        },
        {
          type: 'rich_text',
          key: 'Preview URL',
          args: undefined,
        },
        {
          type: 'rich_text',
          key: 'Album Cover',
          args: undefined,
        },
        {
          type: 'rich_text',
          key: 'Added At',
          args: undefined,
        }
      ]
    }
  },
  twitter: {
    twitter_playlist: {
      properties: []
    }
  },
  youtube: {
    youtube_playlist: {
      properties: []
    }
  }
};

export default DBCreator;
