export function getAnimeName() {
    const classNames = "title d-title";
    const elements = document.getElementsByClassName(classNames);
    const animeName = elements[0]?.innerText ?? "Anime";
    return animeName;
};


export function getAnimeThumbnail() {
    try {
        const classNames = "poster";
        const poster = document.getElementsByClassName(classNames)[0]?.children[0]?.firstChild;
        const animePoster = poster.src ?? "aniwave_image";
        return animePoster;
    } catch {
        return "aniwave_image";
    }
};


export function getEpisodeNumber() {
    try {
        //url structure: aniwave.to/watch/anime-name<hash>/ep-<episode-number>
        return url.split("/").at(-1).split("-").at(-1);
    } catch {
        return "";
    }
};


export function queryAnimeMetadata() {
    return {
        animeName: getAnimeName(),
        episodeNumber: getEpisodeNumber(),
        imageURL: getAnimeThumbnail()
    };
};
