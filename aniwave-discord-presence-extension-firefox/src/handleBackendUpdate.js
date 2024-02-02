const LOCAL_PORT = 42069;
const LOCAL_URL = "http://localhost";
const LOCAL_ENDPOINT = "animeData";

//cache url to check for changes
let url = window.location.href;

const functionMap = {
    "aniwave": {
        "title": getAniwaveAnimeName,
        "imageURL": getAniwaveThumbnail,
        "episodeNumber": getAniwaveEpisodeNumber,
        "duration": getDuration,
    },
    "kickassanime": {
        "title": getKickassAnimeTitle,
        "imageURL": getKickassAnimeImageURL,
        "episodeNumber": getKickassAnimeEpisodeNumber,
        "duration": getKickassAnimeDuration,
    }
}

function getAniwaveAnimeName() {
    const classNames = "title d-title";
    const elements = document.getElementsByClassName(classNames);
    const animeName = elements[0]?.innerText ?? "Anime";
    return animeName;
}


function getDuration() {
    try {
        const duration = document.getElementsByClassName("meta")[2].children[1].innerText.split(" ")[1];
        const parsed = parseInt(duration);
        if (!parsed) throw new Error("Duration not found");
        return parsed;
    } catch {
        //typical anime episode duration
        return 23;
    }
}

function getAniwaveThumbnail() {
    try {
        const classNames = "poster";
        const poster = document.getElementsByClassName(classNames)[0]?.children[0]?.firstChild;
        const animePoster = poster.src ?? "aniwave_image";
        return animePoster;
    } catch {
        return "aniwave_image";
    }
}


function getAniwaveEpisodeNumber() {
    try {
        //url structure: aniwave.to/watch/anime-name<hash>/ep-<episode-number>
        return url.split("/").at(-1).split("-").at(-1);
    } catch {
        return "";
    }
}

function getKickassAnimeTitle() {
    const titleElement = Array.from(document.querySelectorAll(".text-h6")).filter(title => title.nodeName === "H1");
    const title = titleElement[0]?.innerText ?? "Anime";
    console.log(`Got title: ${title}` );
    return title;
}

function getKickassAnimeEpisodeNumber() {
    const descriptionElements =
        Array.from(document.querySelectorAll(".text-overline"))
            .filter(element => element.innerText.includes("EPISODE"));

    if (descriptionElements.length === 0) return "Movie"
    const episodeNumber = descriptionElements[0]?.innerText.split(" ")[1] ?? "0";

    console.log(`Got episode number: ${episodeNumber}`);
    return episodeNumber;
}


function getKickassAnimeImageURL() {
    const images = document.querySelectorAll(".v-image__image.v-image__image--cover");
    const titleImage = Array.from(images).at(-1);
    const titleImageInlineCSSText = titleImage?.style?.cssText
    const URL = titleImageInlineCSSText?.split('"')?.at(1);

    if (!URL) return "aniwave_image";
    console.log(`Image URL: ${URL}`);

    return URL;

}

function getKickassAnimeDuration() {
    return 23;
}

async function queryAnimeMetadata(website) {
    await new Promise(r => setTimeout(r, 10000));

    const metadata = {};
    const functions = functionMap[website];

    metadata["title"] = functions["title"]();
    metadata["imageURL"] = functions["imageURL"]();
    metadata["options"] = {};
    metadata["options"]["episodeNumber"] = functions["episodeNumber"]();
    metadata["options"]["timeoutInMinutes"] = functions["duration"]();
    metadata["options"]["buttonURL"] = url;
    metadata["options"]["buttonLabel"] = "Watch along!";

    console.log({metadata})
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

    if (url.includes("aniwave.to/watch")) {
        //on initial page load
        await postAnimeMetadataToBackend("aniwave");
    
        //check if episode changed
        setInterval(async () => await postMetadataOnURLChange("aniwave"), 1000);
    }
    
    
    if (url.includes("kickassanime.mx")) {
        //on initial page load
        await postAnimeMetadataToBackend("kickassanime");
    
        //check if episode changed
        setInterval(async () => await postMetadataOnURLChange("kickassanime"), 1000);
    }

})()