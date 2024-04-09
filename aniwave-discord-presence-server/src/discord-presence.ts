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
  console.log(`timeout: ${options?.timeoutInMinutes}`);
  const timeoutInMinutes = options?.timeoutInMinutes || 23;
  console.log("🚀 Updating Discord presence...");
  console.table({ title, imageURL, options });
  const buttons = [
    {
      label: options?.buttonLabel ?? "Suffer Along!",
      url: options?.buttonURL ?? "",
    },
    { label: "Clear Presence", url: "http://localhost:42069/clear" },
  ];

  rpc.setActivity({
    state: title,
    largeImageKey: imageURL,
    largeImageText: title,
    startTimestamp: new Date(),
    buttons,
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

