import { Client } from '@notionhq/client';
import { FeaturesOfSocialAppExport } from '../../src/controllers/types.js';
import DBCreator from '../../src/lib/notion/dbCreator.js';
import {
  getAppExportFeatureKey,
  getAuthOptions,
  getLastEditedPage,
  updateDBTitle,
} from '../../src/lib/notion/index.js';
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
                color: 'brown',
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

    const reducedProps = properties.reduce(
      (prev, curArgs) => ({
        ...prev,
        ...dbCreator.createDBProp(curArgs),
      }),
      {},
    );

    expect(reducedProps).toStrictEqual(expectedInput.properties);
  });

  it('should get auth options', () => {
    const code = 'test';
    const redirect_uri = 'https://localhost:9999';
    const clientID = '123';
    const clientSecret = 'secret123';
    expect(
      getAuthOptions(code, redirect_uri, clientID, clientSecret),
    ).toStrictEqual({
      url: 'https://api.notion.com/v1/oauth/token',
      form: {
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      },
      axiosConfig: {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(clientID + ':' + clientSecret).toString('base64'),
          'Content-Type': 'application/json',
        },
      },
    });
  });

  it('should get app export feature key', () => {
    const redditExportProps: FeaturesOfSocialAppExport = {
      reddit: {
        saved: {
          lastItemID: '',
        },
      },
    };
    expect(getAppExportFeatureKey(redditExportProps, 'reddit')).toBe('saved');
  });

  it('should get last edited page', async () => {
    const notion = {} as Client;
    notion.search = jest.fn().mockImplementation(
      () =>
        new Promise((resolve, _) =>
          resolve({
            type: 'page_or_database',
            page_or_database: {},
            object: 'list',
            next_cursor: null,
            has_more: false,
            results: ['page representer string'],
          }),
        ),
    );
    const lastEditedPage = await getLastEditedPage(notion);
    expect(lastEditedPage).toBe('page representer string');
  });

  it('should update db title', async () => {
    const notion = { databases: {} } as Client;
    notion.databases.update = jest.fn().mockImplementation(
      () =>
        new Promise((resolve, _) =>
          resolve({
            object: 'database',
            id: '1',
            properties: { myprop: { id: '12', name: 'asdf', color: 'brown' } },
          }),
        ),
    );

    const updatedDBTitleRes = await updateDBTitle(notion, 'newTitle', '1');
    expect(updatedDBTitleRes.id).toBe('1');
  });
});
