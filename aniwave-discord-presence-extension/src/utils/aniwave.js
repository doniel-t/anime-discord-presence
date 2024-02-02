export function getAniwaveAnimeName() {
    const classNames = "title d-title";
    const elements = document.getElementsByClassName(classNames);
    const animeName = elements[0]?.innerText ?? "Anime";
    return animeName;
}

export function getAniwaveDuration() {
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

export function getAniwaveThumbnail() {
    try {
        const classNames = "poster";
        const poster = document.getElementsByClassName(classNames)[0]?.children[0]?.firstChild;
        const animePoster = poster.src ?? "aniwave_image";
        return animePoster;
    } catch {
        return "aniwave_image";
    }
}

export function getAniwaveEpisodeNumber() {
    try {
        //url structure: aniwave.to/watch/anime-name<hash>/ep-<episode-number>
        return url.split("/").at(-1).split("-").at(-1);
    } catch {
        return "";
    }
}