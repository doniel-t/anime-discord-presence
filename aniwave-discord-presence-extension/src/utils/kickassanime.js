export function getKickassAnimeTitle() {
    const titleElement = Array.from(document.querySelectorAll(".text-h6")).filter(title => title.nodeName === "H1");
    const title = titleElement[0]?.innerText ?? "Anime";
    console.log(`Got title: ${title}`);
    return title;
}

export function getKickassAnimeEpisodeNumber() {
    const descriptionElements =
        Array.from(document.querySelectorAll(".text-overline"))
            .filter(element => element.innerText.includes("EPISODE"));

    if (descriptionElements.length === 0) return "Movie"
    const episodeNumber = descriptionElements[0]?.innerText.split(" ")[1] ?? "0";

    console.log(`Got episode number: ${episodeNumber}`);
    return episodeNumber;
}

export function getKickassAnimeImageURL() {
    const images = document.querySelectorAll(".v-image__image.v-image__image--cover");
    const titleImage = Array.from(images).at(-1);
    const titleImageInlineCSSText = titleImage?.style?.cssText
    const URL = titleImageInlineCSSText?.split('"')?.at(1);

    if (!URL) return "aniwave_image";
    console.log(`Image URL: ${URL}`);

    return URL;

}

export function getKickassAnimeDuration() {
    return 23;
}







