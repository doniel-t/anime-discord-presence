import express, { Express, Request, Response } from "express";
import cors from "cors";
import { rpc, setPresenceAndScheduleReset } from "./discord-presence";
import * as dotenv from "dotenv";
dotenv.config();

const clientId = `${process.env.CLIENT_ID}`;

const app: Express = express();
app.use(express.json());
app.use(cors());

const port = 42069;

app.post("/animeData", (req: Request, res: Response) => {
  const { animeTitle, episodeNumber, episodeURL } = req.body;
  console.log(`${animeTitle} - ${episodeNumber}`);
  setPresenceAndScheduleReset(animeTitle, episodeNumber, episodeURL);
  res.json({ message: `Got ${animeTitle}!}`, status: 200 });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

rpc.on("ready", () => {
  console.log("Connected to Discord RPC");
});

rpc.login({ clientId }).catch(console.error);
