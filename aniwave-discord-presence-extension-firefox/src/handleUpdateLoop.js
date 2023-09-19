import { postAnimeMetadataToBackend, postMetadataOnURLChange } from "./postAnimeMetadataToBackend.js";

//on initial page load
postAnimeMetadataToBackend();

//check if episode changed
setInterval(postMetadataOnURLChange, 1000);

