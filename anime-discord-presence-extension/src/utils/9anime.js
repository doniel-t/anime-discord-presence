export function get9AnimeName() {
    const classNames = "film-name dynamic-name";
    const elements = document.getElementsByClassName(classNames);
    const animeName = elements[0]?.innerText ?? "Anime";
    return animeName;
}

export function get9AnimeDuration() {
    try {
        const className = "item-title";
        const duration = Array.from(document.getElementsByClassName(className)).find(e => e.innerText.includes("Duration"))
        const parsed = parseInt(duration);
        if (!parsed) throw new Error("Duration not found");
        return parsed;
    } catch {
        //typical anime episode duration
        return 23;
    }
}

export function get9AnimeThumbnail() {
    try {
        const classNames = "film-poster-img";
        const poster = document.getElementsByClassName(classNames)[0];
        const animePoster = poster.src ?? "aniwave_image";
        return animePoster;
    } catch {
        return "aniwave_image";
    }
}

export function get9AnimeEpisodeNumber() {
    try {
        const classNames = "item ep-item active";
        const epCount = document.getElementsByClassName(classNames)[0].firstChild.innerText;
        return epCount;
    } catch {
        return "";
    }
}