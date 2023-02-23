import { Response } from "express";
import { ActiveApp,  FeaturesOfSocialAppExport } from "../controllers/types.js";

const htmlHead = (title = 'Authorization') => `<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
`;

export const htmlPage = (body: string) => `
<!DOCTYPE html>
<html lang="en">
${htmlHead()}
<body>
${body}
</body>
</html>
`

export const encodeURIOptions = (options: Record<string, string>): string => {
  return Object.keys(options)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(options[key]),
    )
    .join('&');
};

export const concatWithEmptySpace = (prev: string, cur: string) =>
  prev + ' ' + cur;

export const getWindowMessagePosterHTML = (
  message: Record<string, string>,
  targetOrigin = '*',
) => htmlPage(`
  <script>
    window.opener.postMessage(${JSON.stringify(message)}, '${targetOrigin}');
    window.opener.postMessage({ source: 'save-my-social', type: 'closeOrder' }, '${targetOrigin}');
  </script>
`)

export const getWindowAccessTokenInfoPosterHTML = (
  accessTokenIsSet: boolean,
  targetOrigin = '*',
) =>
  getWindowMessagePosterHTML(
    {
      accessTokenIsSet: String(accessTokenIsSet),
      source: 'save-my-social',
      type: 'accessToken',
    },
    targetOrigin,
  );

export const getWindowErrorPosterHTML = (error: string, targetOrigin = '*') =>
  getWindowMessagePosterHTML(
    {
      error,
      source: 'save-my-social',
      type: 'error',
    },
    targetOrigin,
  );

export const sendMsgResponse = (
  res: Response,
  status: number,
  msg: string,
) => res.status(status).send({ msg });

// get the export feature (saved, playlist etc.) that is made from the app
export const getAppExportFeatureKey = (
  exportProps: FeaturesOfSocialAppExport,
  appName: ActiveApp
): string => {
  const propertiesOfAppExport = exportProps[appName];
  const featureKey = 
    Object.keys(propertiesOfAppExport).length < 1
      ? null // no feature object found in this app's export props
      : Object.keys(propertiesOfAppExport)[0]; // get the first found feature
  // if featureKey is null or an unsupported feature, it will considered invalid
  return featureKey;
};
