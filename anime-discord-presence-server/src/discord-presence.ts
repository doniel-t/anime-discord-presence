import { Client } from "discord-rpc";

const rpc = new Client({ transport: "ipc" });
export let timeoutID: NodeJS.Timeout | undefined = undefined;

export type PresenceOptions = {
  buttonURL?: string;
  buttonLabel?: string;
  timeoutInMinutes?: number;
  episodeNumber?: number;
};

function setPresenceAndScheduleReset(
  title: string = "Existential Dread",
  imageURL: string = "aniwave_image",
  options?: PresenceOptions
) {
  // Clear the timeout if it exists
  handleTimout();
  console.log(`[Timeout]: ${options?.timeoutInMinutes}`);
  const timeoutInMinutes = options?.timeoutInMinutes || 23;
  console.log("🚀 Updating Discord presence...");
  console.table({ title, imageURL, options });
  const hasURLToEpisode = options?.buttonURL && options?.buttonLabel;

  const buttons = [
    { label: "Clear Presence", url: "http://localhost:42069/clear" },
  ];

  if (hasURLToEpisode) {
    buttons.push({
      label: options?.buttonLabel || "Watch Along!",
      url: options?.buttonURL || "",
    });
  }

  rpc.setActivity({
    state: title,
    largeImageKey: imageURL,
    largeImageText: title,
    startTimestamp: new Date(),
    buttons: buttons,
  });

  if (options.timeoutInMinutes) {
    timeoutID = setTimeout(resetPresence, timeoutInMinutes * 60 * 1000);
  }
}

// Function to reset the presence
function resetPresence() {
  if (timeoutID) {
    clearTimeout(timeoutID);
    timeoutID = undefined;
  }
  console.log("🍑 Clearing Discord presence...");
  rpc.clearActivity();
}

function handleTimout() {
  if (timeoutID) {
    clearTimeout(timeoutID);
    timeoutID = undefined;
  }
}

export { rpc, setPresenceAndScheduleReset, resetPresence };
