import { Router } from "express";
import SpotifyRoutes from "../routes/spotifyRoutes.js"
const router = Router();

router.use('/spotify', SpotifyRoutes);

export default router;
