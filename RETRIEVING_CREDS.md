# Retrieving Credentials for Your Acounts
These credentials are necessary for setting up an authorization flow that enables the app to retrieve an access token for reading and writing your data once you have logged in.
## Reddit
- Go to https://www.reddit.com/prefs/apps
- Click on `create another app...`
- Enter a name
- Choose `web app`
- Paste http://localhost:5000/reddit/logged into `redirect uri`
- `Create app`
- Copy `clint id` that is near the app's icon and also the `secret`
- Open `packages/api/.env` file
- Paste the client id and secret into their respective places:
    ```
    REDDIT_CLIENT_ID="123myclientid456here"
    REDDIT_SECRET="123mysecretid456here"
    ```
- Save the file

## Twitter
- Go to https://developer.twitter.com
- Click on `Developer Portal`
- Answer the questions to enable your dev account.
- Go to `Projects & Apps`
- Create a new `Standalone App`
- Go to app settings
- Under `User authentication settings` click on `Set up`
- Select `Read and write` (for now write is not necessary, so feel free to choose `Read`)
- Choose `Web App`
- Paste http://127.0.0.1:5000/twitter/logged into `Callback URI`
- You can paste a public link to a Notion page into "Website URL", if you wish
- Click `Save`
- Copy the `Client ID` and `Clint Secret`
- Open `packages/api/.env` file
- Paste the client id and secret into their respective places:
    ```
    TWITTER_CLIENT_ID="123myclientid456here"
    TWITTER_SECRET="123mysecretid456here"
    ```
- Save the file
## Spotify
- Go to https://developer.spotify.com/dashboard/login
- Login and `Create an App`
- Copy the `Client ID` and `Client Secret`
- Open `packages/api/.env` file
- Paste the client id and secret into their respective places:
    ```
    SPOTIFY_CLIENT_ID="123myclientid456here"
    SPOTIFY_SECRET="123mysecretid456here"
    ```
- Save the file

## Google
- Go to https://console.cloud.google.com
- `Select a project` (or name of your previous project will appear at the dropdown)
- Create a new project
- Select the created project
- `Explore and enable APIs`
- `+ ENABLE APIS AND SERVICES`
- Enable `Google Sheets API` and `Youtube Data API V3`
- Go to `Credentials` tab
- `+ CREATE CREDENTIAL` > `OAuth client ID`
- Configure the consent screen
    - External
    - Fill required fields > `Save and Continue`
    - Add `.../auth/spreadsheets` and `.../auth/youtube` scopes to sensitive scopes
    - Add the emails of the users that will use this app
- Go to OAuth2 credential creation screen again
- Web app
- Add http://localhost:5000/google/logged to `Authorized redirect URIs`
- Get your client id and secret
- Open `packages/api/.env` file
- Paste the client id and secret into their respective places:
    ```
    GOOGLE_CLIENT_ID="123myclientid456here"
    GOOGLE_SECRET="123mysecretid456here"
    ```
- Save the file

## Notion
- Go to https://developers.notion.com/
- `View my integrations`
- `+ New Integration`
- Give it a name
- User capabilities: `Read user information without email addresses`
- Submit
- `Integration type` => `Public integration`
- OAuth Domain & URIs
    - Redirect URIs: http://localhost:5000/notion/logged
    - Enter a Company name
    - Create a public Notion and paste its link into `Website`, `Privacy policy`, `Terms of use`.
    - Add a support email
    - Save changes
- Go to top. Copy the `OAuth client ID` and `OAuth client secret`
- Open `packages/api/.env` file
- Paste the client id and secret into their respective places:
    ```
    NOTION_CLIENT_ID="123myclientid456here"
    NOTION_SECRET="123mysecretid456here"
    ```
- Save the file
