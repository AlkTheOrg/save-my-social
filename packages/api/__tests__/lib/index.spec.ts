import { ActiveApp, FeaturesOfSocialAppExport } from '../../src/controllers/types.js';
import { concatWithEmptySpace, encodeURIOptions, getAppExportFeatureKey } from '../../src/lib/index.js';

describe('lib', () => {
  test('encodeURIOptions', () => {
    const options: Record<string, string> = {
      client_id: '123',
      redirect_uri: 'http://localhost:3000/callback',
      scope:
        'playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-library-modify user-library-read',
      response_type: 'code',
      show_dialog: 'true',
      state: 'my state',
    };

    const expected =
      'client_id=123&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=playlist-read-collaborative%20playlist-modify-public%20playlist-read-private%20playlist-modify-private%20user-library-modify%20user-library-read&response_type=code&show_dialog=true&state=my%20state';

    expect(encodeURIOptions(options)).toBe(expected);
  });

  test('concatWithEmptySpace', () => {
    const arr = ['a', 'b', 'c'];
    const expected = 'a b c';
    expect(arr.reduce(concatWithEmptySpace)).toBe(expected);
  });
  
  test('getAppExportFeatureKey', () => {
    const exportProps: FeaturesOfSocialAppExport = {
      twitter: {
        bookmarks: {
          paginationToken: undefined,
        }
      }
    };
    const appName: ActiveApp = 'twitter';
    expect(getAppExportFeatureKey(exportProps, appName)).toEqual('bookmarks');
  })
});
