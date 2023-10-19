const LOCAL_PORT = 42069;
const LOCAL_URL = "http://localhost";
const LOCAL_ENDPOINT = "animeData";

//cache url to check for changes
let url = window.location.href;

const animeDataFetcher = {
    getAnimeName() {
        const classNames = "title d-title";
        const elements = document.getElementsByClassName(classNames);
        const animeName = elements[0]?.innerText ?? "Anime";
        return animeName;
    },


    getDuration() {
        try {
            const duration = document.getElementsByClassName("meta")[2].children[1].innerText.split(" ")[1];
            const parsed = parseInt(duration);
            if (!parsed) throw new Error("Duration not found");
            return parsed; 
        }catch {
            //typical anime episode duration
            return 23;
        }
    },

    getAnimeThumbnail() {
        try {
            const classNames = "poster";
            const poster = document.getElementsByClassName(classNames)[0]?.children[0]?.firstChild;
            const animePoster = poster.src ?? "aniwave_image";
            return animePoster;
        } catch {
            return "aniwave_image";
        }
    },


    getEpisodeNumber() {
        try {
            //url structure: aniwave.to/watch/anime-name<hash>/ep-<episode-number>
            return url.split("/").at(-1).split("-").at(-1);
        } catch {
            return "";
        }
    },


    queryAnimeMetadata() {
        return {
            title: this.getAnimeName(),
            imageURL: this.getAnimeThumbnail(),
            options: {
                episodeNumber: this.getEpisodeNumber(),
                buttonURL: window.location.href,
                buttonLabel: "Watch Along!",
                timeoutInMinutes: this.getDuration(),
            },
        };
    },
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

function postAnimeMetadataToBackend() {
    const animeDataObj = animeDataFetcher.queryAnimeMetadata();
    const animeDataJSON = JSON.stringify(animeDataObj);
    console.log(`Got: ${animeDataJSON}`);
    postMetadata(animeDataJSON);
};


function postMetadataOnURLChange() {
    const urlChanged = url !== window.location.href;
    const isAniwave = window.location.href.includes("https://aniwave.to/watch");
    if (urlChanged && isAniwave) {
        url = window.location.href;
        postAnimeMetadataToBackend();
    }
};

//on initial page load
postAnimeMetadataToBackend();

//check if episode changed
setInterval(postMetadataOnURLChange, 1000);

