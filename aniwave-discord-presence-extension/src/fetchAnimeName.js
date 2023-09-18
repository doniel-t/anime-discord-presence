const LOCAL_PORT = 42069;

let url = window.location.href;

const queryForAnimeName = () => {
    const classNames = "title d-title";
    const elements = document.getElementsByClassName(classNames);
    const animeName = elements[0].innerText ?? "Anime";
    return animeName;
}

const sendAnimeName = (animeName) => {
    const episodeNumber = url.at(-1);
    console.log(JSON.stringify({ animeTitle: animeName, episodeNumber: episodeNumber, episodeURL: url }));
    fetch(`http://localhost:${LOCAL_PORT}/animeData`, {
        method: "POST",
        body: JSON.stringify({ animeTitle: animeName, episodeNumber: episodeNumber, episodeURL: url }),
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

