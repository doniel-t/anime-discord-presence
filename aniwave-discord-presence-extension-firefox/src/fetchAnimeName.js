const LOCAL_PORT = 42069;

let url = window.location.href;

const queryForAnimeName = () => {
    const classNames = "title d-title";
    const elements = document.getElementsByClassName(classNames);
    const animeName = elements[0].innerText ?? "Anime";
    return animeName;
}

const queryAnimePoster = () => {
    try {
        const classNames = "poster";
        const poster = document.getElementsByClassName(classNames)[0]?.children[0]?.firstChild;
        const animePoster = poster.src ?? "aniwave_image";
        return animePoster;
    }catch{
        return "aniwave_image";
    }
}

const sendAnimeName = (animeName) => {
    //url structure: aniwave.to/watch/anime-name<hash>/ep-episode-number
    const episodeNumber = url.split("/").at(-1).split("-").at(-1);
    const imageURL = queryAnimePoster();
    const animeDataObj = { animeTitle: animeName, episodeNumber: episodeNumber, episodeURL: url, imageURL: imageURL };
    const animeDataJSON = JSON.stringify(animeDataObj);
    console.log(animeDataJSON);
    fetch(`http://localhost:${LOCAL_PORT}/animeData`, {
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
}

const animeTitle = queryForAnimeName();
console.log(`got ${animeTitle}`);
sendAnimeName(animeTitle);

setInterval(() => {
    if (url !== window.location.href && window.location.href.includes("https://aniwave.to/watch")) {
        url = window.location.href;
        const animeTitle = queryForAnimeName();
        console.log(`got ${animeTitle}`);
        sendAnimeName(animeTitle);
    }
}, 1000);

