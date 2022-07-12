import { Router } from "express";
import notionController from "../controllers/notionController.js";

const router = Router();
router.use('/login', notionController.login);
router.use('/logged', notionController.logged);

export default router;
