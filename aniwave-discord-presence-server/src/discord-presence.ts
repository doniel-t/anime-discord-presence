import { Client } from 'discord-rpc';

const rpc = new Client({ transport: 'ipc' });
let timeoutID: NodeJS.Timeout | undefined = undefined;

function setPresenceAndScheduleReset({animeTitle, episodeNumber, episodeURL, imageURL}) {
  if (timeoutID) {
    clearTimeout(timeoutID);
    timeoutID = undefined;
  }
  console.log('Updating Discord presence...');
  rpc.setActivity({
    state: `${animeTitle} - EP${episodeNumber}`,
    largeImageKey: imageURL,
    startTimestamp: new Date(),
    buttons: [
      { label: 'Watch Along!', url: episodeURL }
    ]
  });

  // Schedule a reset after 23 minutes (20 minutes * 60 seconds * 1000 milliseconds)
  timeoutID = setTimeout(resetPresence, 23 * 60 * 1000);
}

// Function to reset the presence
function resetPresence() {
  console.log('Clearing Discord presence...');
  rpc.clearActivity();
}

export { rpc, setPresenceAndScheduleReset, resetPresence };
