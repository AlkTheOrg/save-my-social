import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import AuthRoutes from './routes/authRoutes.js';
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from 'cors';
import { appRouter } from './trpc-server.js';
export type AppRouter = typeof appRouter;

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  }),
);
const port = process.env.PORT || 5000;

app.use(AuthRoutes);
app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);
app.use((_: Request, res: Response) =>
  res.status(404).send({ error: "Couldn't find this page" }),
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
