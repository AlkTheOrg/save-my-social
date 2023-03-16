# Save My Social &middot; ![Github Action](https://github.com/AlkTheOrg/save-my-social/actions/workflows/node.js.yml/badge.svg) &middot; [![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

**Easily and securely automate the export of your sensitive data while ensuring 100% privacy.**

Unfortunately the app is not deployed to web in order to make it both free and secure. So you need to [run the app by yourself](#running-the-app).

## Supported Flows
Export:
- Reddit Saved Posts/Comments
- Spotify Playlists
- Twitter Bookmarks
- Youtube Playlists (Soon)

Into:
- Notion
- Google Sheets
- Local as a JSON file.

## Running the App
- Install [Node.JS](https://nodejs.org/en/download/) (at least v16)
- Install [pnpm](https://pnpm.io/installation)
- Clone the repo (or download, but using git will allow you to pull new changes easily)
- Provide your api credentials:
    - Rename `packages/api/.env-default` to `.env`
    - Follow [this](RETRIEVING_CREDS.md) guide to add credentials for the apps that you will be exporting or importing data
    - Save the file. If you update this file, you need to restart the app first if it is already running
- Open a terminal and `cd` into the project's path (where this README file is located)
- Run `pnpm install && pnpm --filter sms-api --filter sms-frontend install`
- Run `pnpm run start`
- Wait until you see below outputs in your terminal:
    ```
    sms-api
    .
    .
    .
     | Server is running on port 5000

    sms-frontend
    .
    .
    .
     | You can now view sms-frontend in the browser.
     |
     |   Local:            http://localhost:3000
     |   On Your Network:  http://192.168.141.1:3000
    ```
- A new tab should be opened in your browser. If not, open http://loclahost:3000
- Selecting an app will open an authorization window, so allow app to open a new popup
- If you encounter an error please check at least one of the folowings before opening an issue: Browser console, network response, terminal.
- When you log in with Notion, you will be asked to grant access to at least one Notion page. Any new pages the app creates will be added to the page that was last edited.

## Development
- Always use `pnpm`
- `pnpm install && pnpm --filter sms-api --filter sms-frontend install`
- `pnpm run start`
- Switched to Zod recently. Try to write new types with it
- If adding support for a new app, write its importers/exporters in a reusable way
- Make `isDevMode` `true` in `index.tsx`.

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg