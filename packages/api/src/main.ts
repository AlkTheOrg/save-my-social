import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import AuthRoutes from './routes/authRoutes.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(AuthRoutes);
app.use((_: Request, res: Response) =>
  res.status(404).send({ error: "Couldn't find this page" }),
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
