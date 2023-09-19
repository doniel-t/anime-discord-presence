import { queryAnimeMetadata } from "./queryAnimeMetadata.js";

const LOCAL_PORT = 42069;
const LOCAL_URL = "http://localhost";
const LOCAL_ENDPOINT = "animeData";

//cache url to check for changes
let url = window.location.href;


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


export function postAnimeMetadataToBackend() {
    const animeDataObj = queryAnimeMetadata();
    const animeDataJSON = JSON.stringify(animeDataObj);
    console.log(`Got: ${animeDataJSON}`);
    postMetadata(animeDataJSON);
};


export function postMetadataOnURLChange() {
    const urlChanged = url !== window.location.href;
    const isAniwave = window.location.href.includes("https://aniwave.to/watch");
    if (urlChanged && isAniwave) {
        url = window.location.href;
        postAnimeMetadataToBackend();
    }
};