# Kickassanime Discord Rich Presence Chrome Extension 🚀
Updates your rich presence to what Anime / Episode you are currently watching 👀\
\
![image](https://img.shields.io/github/languages/top/doniel-t/aniwave-discord-presence)
![GitHub language count](https://img.shields.io/github/languages/count/doniel-t/aniwave-discord-presence?color=%23FF0A52)
![GitHub Release Date - Published_At](https://img.shields.io/github/release-date/doniel-t/aniwave-discord-presence)
![GitHub](https://img.shields.io/github/license/doniel-t/aniwave-discord-presence)


![image](https://github.com/doniel-t/aniwave-discord-presence/assets/56281274/91fa23b7-9905-46a5-b617-52dae1cfa046)

## **How To Run** ⚙️
- Download the corresponding Extension for your Browser from the Releases Tab and install it in your Browser - Chrome Extension works for all Chromium based Browsers like Edge, Chrome, Opera...
- install [NodeJS](https://nodejs.org/en) on your machine
- Download the RPC-Server binary from the Releases Tab and run it
- ---
- `optional` schedule the Server binary to run on launch

## **How to Develop** 🤗
- ## Server
  - Make changes
  - Test with `npm run dev`
  - Bundle the app with `npm run build`
  - Compile to executable with `npm run compile_to_exe`
    - You can change the target for your own OS 

- ## Chrome
  - Make changes then 
  - Create the bundled dist/index.js with `npm run build`
  - pack the extension in [chrome](chrome://extensions) or create extensions from unpacked and select the directory

  - [Chrome extensions API ref sheet](https://developer.chrome.com/docs/extensions/reference/api)

- ## Firefox
  - After you've made changes to firefox extension
  - run `npm run build` to create the bundled dist/index.js file
  - run `web-ext build` to create the zip file for the extensions
  - install it in **Firefox nightly** or the **dev versions** 
  - [Firefox extensions API ref sheet](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)
