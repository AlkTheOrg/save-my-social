import DBCreator from '../../src/lib/notion/dbCreator.js';
import { CreateDBPropArguments } from '../../src/lib/notion/types.js';

describe('notion', () => {
  it('should create db', () => {
    const dbCreator = DBCreator();
    const properties: Array<CreateDBPropArguments> = [
      {
        type: 'title',
        key: 'Name',
        args: undefined,
      },
      {
        type: 'number',
        key: 'ID',
        args: 'number',
      },
      {
        type: 'number',
        key: 'Count',
        args: 'number',
      },
      {
        type: 'rich_text',
        key: 'Subreddit',
        args: undefined,
      },
      {
        type: 'checkbox',
        key: 'Checked',
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
    ];

    const expectedInput = {
      parent: {
        page_id: '1',
        type: 'page_id',
      },
      title: [
        {
          type: 'text',
          text: { content: 'mytitle' },
        },
      ],
      properties: {
        Name: {
          type: 'title',
          title: {},
        },
        ID: {
          type: 'number',
          number: {
            format: 'number',
          },
        },
        Count: {
          type: 'number',
          number: {
            format: 'number',
          },
        },
        Subreddit: {
          type: 'rich_text',
          rich_text: {},
        },
        Checked: {
          type: 'checkbox',
          checkbox: {},
        },
        Type: {
          type: 'select',
          select: {
            options: [
              {
                name: 'Comment',
                color: 'brown', // "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red";
              },
              {
                name: 'Post',
                color: 'orange',
              },
            ],
          },
        },
      },
    };

  const reducedProps = properties.reduce((prev, curArgs) => ({
    ...prev,
    ...dbCreator.createDBProp(curArgs)
  }), {});

  expect(reducedProps).toStrictEqual(expectedInput.properties);
  });
});
