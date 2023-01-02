import { Response } from "express";
import { ExportFrom, FeaturesOfSocialAppExport } from "../controllers/types.js";

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
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authorization</title>
</head>
<body>
  <script>
    window.opener.postMessage(${JSON.stringify(message)}, '${targetOrigin}');
    window.opener.postMessage({ source: 'save-my-social', type: 'closeOrder' }, '${targetOrigin}');
  </script>
</body>
</html>
`;

export const getWindowAccessTokenPosterHTML = (
  accessToken: string,
  targetOrigin = '*',
) =>
  getWindowMessagePosterHTML(
    {
      accessToken,
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
  appName: ExportFrom
): string => {
  const propertiesOfAppExport = exportProps[appName];
  const featureKey = 
    Object.keys(propertiesOfAppExport).length < 1
      ? null // no feature object found in this app's export props
      : Object.keys(propertiesOfAppExport)[0]; // get the first found feature for now
  // if featureKey is null or an unsupported feature, it will considered invalid
  return featureKey;
};


