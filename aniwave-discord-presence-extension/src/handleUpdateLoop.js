import { postAnimeMetadataToBackend, postMetadataOnURLChange } from "./postAnimeMetadataToBackend.js";

//cache url to check for changes
let url = window.location.href;
//on initial page load
postAnimeMetadataToBackend();

//check if episode changed
setInterval(postMetadataOnURLChange, 1000);

