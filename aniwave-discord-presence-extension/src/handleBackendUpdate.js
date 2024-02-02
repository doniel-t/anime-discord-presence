import { getAniwaveAnimeName, getAniwaveThumbnail, getAniwaveEpisodeNumber, getAniwaveDuration } from "./utils/aniwave";
import { getKickassAnimeTitle, getKickassAnimeImageURL, getKickassAnimeEpisodeNumber, getKickassAnimeDuration } from "./utils/kickassanime";


const LOCAL_PORT = 42069;
const LOCAL_URL = "http://localhost";
const LOCAL_ENDPOINT = "animeData";

const PAGE_LOAD_DELAY_MS = 10 * 1000;
const DISCORD_RPC_INTERVAL_MS = 1000;
const TITLE_KEY = "title";
const IMAGE_URL_KEY = "imageURL";
const EPISODE_NUMBER_KEY = "episodeNumber";
const TIMEOUT_IN_MINUTES_KEY = "timeoutInMinutes";

const SUPPORTED_WEBSITES = ["aniwave.to/watch", "kickassanime.mx"];

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

    const metadata = {};
    const metadataQueryFuncs = metadataQueryFunctionsMap[website];

    metadata[TITLE_KEY] = metadataQueryFuncs[TITLE_KEY]();
    metadata[IMAGE_URL_KEY] = metadataQueryFuncs[IMAGE_URL_KEY]();
    metadata["options"] = {};
    metadata["options"][EPISODE_NUMBER_KEY] = metadataQueryFuncs[EPISODE_NUMBER_KEY]();
    metadata["options"][TIMEOUT_IN_MINUTES_KEY] = metadataQueryFuncs[TIMEOUT_IN_MINUTES_KEY]();
    metadata["options"]["buttonURL"] = url;
    metadata["options"]["buttonLabel"] = "Watch along!";

    console.log({ metadata })
    return metadata;
}


function postMetadata(animeDataJSON) {
    fetch(`${LOCAL_URL}:${LOCAL_PORT}/${LOCAL_ENDPOINT}`, {
        method: "POST",
        body: animeDataJSON,
        headers: {
            "Content-Type": "application/json",
        }
    }).then((res) => {
        if (!res.ok) throw new Error(`Response not ok, status: ${res.status}`);
        console.log(res);
    }).catch((err) => {
        console.log("Error sending anime name to local server")
        console.log(err);
    });
};

async function postAnimeMetadataToBackend(websiteString) {
    const animeDataObj = await queryAnimeMetadata(websiteString);
    if (!isValidPayload(animeDataObj)) {
        console.log("Invalid payload, not sending to backend");
        return;
    }
    const animeDataJSON = JSON.stringify(animeDataObj);
    console.log(`Got: ${animeDataJSON}`);
    postMetadata(animeDataJSON);
};


async function postMetadataOnURLChange(websiteString) {
    const urlChanged = url !== window.location.href;
    const isWantedSite = ["https://aniwave.to/watch", "https://kickassanime.mx/"].some(site => window.location.href.includes(site));
    if (urlChanged && isWantedSite) {
        url = window.location.href;
        await postAnimeMetadataToBackend(websiteString);
    }
};


function isValidPayload(metadataPayload) {
    return metadataPayload.title && metadataPayload.imageURL;
}


(async () => {
    SUPPORTED_WEBSITES.forEach(async (siteURL) => {
        if (url.includes(siteURL)) {
            const website = siteURL.split(".")[0];
            //on initial page load
            await postAnimeMetadataToBackend(website);

            //check if episode changed
            setInterval(async () => await postMetadataOnURLChange(website), DISCORD_RPC_INTERVAL_MS);
        }
    });
})()