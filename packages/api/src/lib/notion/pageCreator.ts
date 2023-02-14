import { Client } from '@notionhq/client';
import { ProcessedSavedChildren } from '../reddit/types.js';
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
  // { key: 'Count', type: 'number', value: count },
  { key: 'Title', type: 'title', value: item.title },
  { key: 'ID', type: 'rich_text', value: item.kindID },
  { key: 'Subreddit', type: 'rich_text', value: item.subreddit },
  { key: 'Over 18', type: 'checkbox', value: item.over_18 },
  { key: 'Type', type: 'select', value: item.kind },
  { key: 'Link', type: 'url', value: item.link },
];

export default PageCreator;
