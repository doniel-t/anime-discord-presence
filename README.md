# Aniwave Discord Rich Presence Chrome Extension 🚀
Updates your rich presence to what Anime / Episode you are currently watching 👀\
\
![image](https://img.shields.io/github/languages/top/doniel-t/aniwave-discord-presence)
![GitHub language count](https://img.shields.io/github/languages/count/doniel-t/aniwave-discord-presence?color=%23FF0A52)
![GitHub Release Date - Published_At](https://img.shields.io/github/release-date/doniel-t/aniwave-discord-presence)
![GitHub](https://img.shields.io/github/license/doniel-t/aniwave-discord-presence)


![image](https://github.com/doniel-t/aniwave-discord-presence/assets/56281274/91fa23b7-9905-46a5-b617-52dae1cfa046)

## **How To Run** ⚙️
- Download the corresponding Extension for your Browser from the Releases Tab and install it in your Browser - Chrome Extension works for all Chromium based Browsers like Edge, Chrome, Opera...
- clone repo `git clone https://github.com/doniel-t/aniwave-discord-presence.git`
- install [NodeJS](https://nodejs.org/en) on your machine
- create a Discord Application [here](https://discord.com/developers/applications) - the Application name will be what you are "playing on Discord" for example `Playing Anime`
- create a file called .env in the `server` directory of the repo
- write `CLIENT_ID=<your client id from the Discord Application>` into the .env file, you can find the CLIENT_ID as the Application ID in the Discord Dev portal or you can go to OAuth2 in the Dev Portal and get the ClientID from there
- run `npm i` in the server directory and run the server with `npm run dev`
- ---
- `optional` change the CD directory of the startup script to the path where the server directory lies, and add the script to windows task scheduler

