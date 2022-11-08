import { Router } from "express";
import notionController from "../controllers/notionController.js";
import { requireAccessToken } from "../middlewares/index.js";

const router = Router();
router.get('/login', notionController.login);
router.get('/logged', notionController.logged);
router.get('/lastEditedPageID', requireAccessToken, notionController.lastEditedPageID);
router.get('/importItems', requireAccessToken, notionController.importItems);

export default router;
