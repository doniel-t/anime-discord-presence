import express, { Express, Request, Response } from "express";
import cors from "cors";
import { resetPresence, rpc, setPresenceAndScheduleReset, PresenceOptions } from "./discord-presence";
import * as dotenv from "dotenv";
dotenv.config();

const clientId = `${process.env.CLIENT_ID}`;

const app: Express = express();
app.use(express.json());
app.use(cors());

const port = 42069;

type RequestBody = {
  title: string;
  imageURL: string;
  options?: PresenceOptions;
};

app.post("/animeData", (req: Request, res: Response) => {
  const presenceData: RequestBody = req.body;
  function fixTitle(title: string, episodeNumber: number | undefined) {
    if (episodeNumber) title = `${title} - EP ${episodeNumber}`;

    if (title.length > 50) {
      return title.slice(0, 50) + "...";
    }
    return title;
  }

  const fixedTitle = fixTitle(presenceData.title, presenceData.options?.episodeNumber);
  setPresenceAndScheduleReset(fixedTitle, presenceData.imageURL, presenceData.options);
  res.json({ message: `Got ${presenceData.title}!}`, status: 200 });
});

app.get("/clear", (req: Request, res: Response) => {
  resetPresence();
  res.json({ message: "Cleared presence!", status: 200 });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running on http://localhost:${port}`);
});

rpc.on("ready", () => {
  console.log("Connected to Discord RPC");
});

rpc.login({ clientId })
  .catch(async (err) => {
    console.error(err);
    await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
    rpc.login({ clientId });
  });
