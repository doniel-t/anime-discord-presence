# Aniwave Discord Rich Presence Chrome Extension
Updates your rich presence to what Anime and what episode you are currently watching 👀

![image](https://github.com/doniel-t/aniwave-discord-presence/assets/56281274/91fa23b7-9905-46a5-b617-52dae1cfa046)

## **How To Run**
- Unzip extension, install in your Browser via drag and drop
- clone repo `git clone https://github.com/doniel-t/aniwave-discord-presence.git`
- install [NodeJS](https://nodejs.org/en) on your machine
- create a Discord Application [here](https://discord.com/developers/applications) - the Application name will be what you are "playing on Discord" for example `Playing Anime`
- create a file called .env in the `server` directory of the repo
- write `CLIENT_ID=<your client id from the Discord Application>` into the .env file, you can find the CLIENT_ID as the Application ID in the Discord Dev portal or you can go to OAuth2 in the Dev Portal and get the ClientID from there
- run `npm i` in the server directory and run the server with `npm run dev`

### I recommend creating a startup script for the Server because once you do this you should never have to touch this again
