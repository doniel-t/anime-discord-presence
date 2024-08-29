import { getAniwaveAnimeName, getAniwaveThumbnail, getAniwaveEpisodeNumber, getAniwaveDuration } from "./utils/aniwave";
import { getKickassAnimeTitle, getKickassAnimeImageURL, getKickassAnimeEpisodeNumber, getKickassAnimeDuration } from "./utils/kickassanime";


const LOCAL_PORT = 42069;
const LOCAL_URL = "http://localhost";
const LOCAL_ENDPOINT = "/animeData";

const PAGE_LOAD_DELAY_MS = 10 * 1000;
const DISCORD_RPC_INTERVAL_MS = 1000;
const TITLE_KEY = "title";
const IMAGE_URL_KEY = "imageURL";
const EPISODE_NUMBER_KEY = "episodeNumber";
const TIMEOUT_IN_MINUTES_KEY = "timeoutInMinutes";


//cache url to check for changes
let url = window.location.href;


const metadataQueryFunctionsMap = {
    "aniwave": {
        [TITLE_KEY]: getAniwaveAnimeName,
        [IMAGE_URL_KEY]: getAniwaveThumbnail,
        [EPISODE_NUMBER_KEY]: getAniwaveEpisodeNumber,
        [TIMEOUT_IN_MINUTES_KEY]: getAniwaveDuration,
    },
    "kickassanime": {
        [TITLE_KEY]: getKickassAnimeTitle,
        [IMAGE_URL_KEY]: getKickassAnimeImageURL,
        [EPISODE_NUMBER_KEY]: getKickassAnimeEpisodeNumber,
        [TIMEOUT_IN_MINUTES_KEY]: getKickassAnimeDuration,
    }
}

async function queryAnimeMetadata(website) {
    //wait for page to load, eg for the image to hydrate
    await new Promise(r => setTimeout(r, PAGE_LOAD_DELAY_MS));

    const metadataQueryFuncs = metadataQueryFunctionsMap[website];
    const metadata = {
        [TITLE_KEY]: metadataQueryFuncs[TITLE_KEY](),
        [IMAGE_URL_KEY]: metadataQueryFuncs[IMAGE_URL_KEY](),
        "options": {
            [EPISODE_NUMBER_KEY]: metadataQueryFuncs[EPISODE_NUMBER_KEY](),
            [TIMEOUT_IN_MINUTES_KEY]: metadataQueryFuncs[TIMEOUT_IN_MINUTES_KEY](),
            "buttonURL": url,
            "buttonLabel": "Watch along!",
        }
    };

    console.log({ metadata })
    return metadata;
}


async function postMetadata(animeDataJSON) {
    const res = await fetch(`${LOCAL_URL}:${LOCAL_PORT}${LOCAL_ENDPOINT}`, {
        method: "POST",
        body: animeDataJSON,
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) throw new Error(`Response not ok, status: ${res.status}`);
};


function isValidPayload(metadataPayload) {
    return metadataPayload.title && metadataPayload.imageURL;
}

async function logToServer(message) {
    const res = await fetch(`${LOCAL_URL}:${LOCAL_PORT}/log`, {
        method: "POST",
        body: JSON.stringify({ message: message }),
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) throw new Error(`Response not ok, status: ${res.status}`);
}

function isContentSite() {
    const urlToCheck = window.location.href;
    const urlSplits = urlToCheck.split("/");
    const lastElement = urlSplits.at(-1);
    const hasTrailingID = lastElement !== '' && lastElement.length > 0;

    return hasTrailingID;
}

async function postAnimeMetadataToBackend(websiteString) {
    if (!isContentSite()) {
        console.log("Not a content site, not sending to backend");
        return;
    }
    const animeDataObj = await queryAnimeMetadata(websiteString);

    if (!isValidPayload(animeDataObj)) {
        console.log("Invalid payload, not sending to backend");
        return;
    }

    const animeDataJSON = JSON.stringify(animeDataObj);
    console.log(`Got: ${animeDataJSON}`);
    await postMetadata(animeDataJSON);
};


async function postMetadataOnURLChange(websiteString) {
    const urlChanged = url !== window.location.href;
    const isWantedSite = window.location.href.includes(websiteString);
    if (urlChanged && isWantedSite) {
        url = window.location.href;
        await postAnimeMetadataToBackend(websiteString);
    }
};

async function clearActivity() {
    const res = await fetch(`${LOCAL_URL}:${LOCAL_PORT}/clear`, {
        method: "GET",
    });

    if (!res.ok) throw new Error(`Response not ok when clearing activity, status: ${res.status}`);
}

(async () => {
    const animeWebsite = url.split(".")[1];
    await logToServer(`Website: ${animeWebsite}`);
    //on initial page load
    await postAnimeMetadataToBackend(animeWebsite);

    //check if episode changed
    setInterval(async () => await postMetadataOnURLChange(animeWebsite), DISCORD_RPC_INTERVAL_MS);
})()