# js-tale-discord-example

A basic example of a single-server js-tale client, combined with discord.js

See the root libraries for more information about them:
- https://github.com/alta-vr/js-tale
- https://github.com/discordjs/discord.js/

Currently supports some example commands:
- ping : responds pong
- players : responds with a list of players
- where <player> : responds with the chunk the player is in 

# Installing:
- Clone the repo: `git clone https://github.com/Narmdo/js-tale-discord-example`
- Install dependencies: `npm i`
- Edit config.json. This should include an ATT client_id, client_password and group ID, and a discord bot token.
- Run! `npm start` 

# Important!
If you plan to maintain a repository for your bot, ensure you add `config.json` to the `.gitignore` file.
