import { Response } from 'express';
import { fetchSavedModels } from '../lib/reddit/index.js';
import { ReqWithItemAfter } from '../lib/reddit/types.js';

const getSavedModels = async (req: ReqWithItemAfter, res: Response) => {
  const credentials = req.credentials;
  const { after } = req.body;
  try {
    const result = await fetchSavedModels(credentials, after);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
};

export default {
  getSavedModels,
};
