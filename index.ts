const config = require('./config');

import { AttSimple } from 'js-tale/dist/Helpers';

import att from 'js-tale/dist';
import discord, { Message } from 'discord.js';

var discordBot:discord.Client;
var attBot:AttSimple;

init();

async function init()
{ 
    discordBot  = new discord.Client();
    discordBot.login(config.discord);

    discordBot.on('message', handleDiscordMessage);
    
    await new Promise<void>(resolve => discordBot.once('ready', () => resolve()));

    attBot = new AttSimple(config, serverConnected);    
};

function handleDiscordMessage(message:discord.Message)
{
    var content = message.content;
    
    if (content.startsWith('!'))
    {
        var space = content.indexOf(' ', 2);

        if (space > 0)
        {
            var command = content.substr(1, space - 1).trim();
        }
        else
        {
            var command = content.substr(1);
        }

        var handler = discordHandler[command];

        if (!!handler)
        {
            handler(message, content.substr(space + 1));   
        }
        else
        {
            message.reply("Unknown command: " + command);
        }
    }
}

var discordHandler : {[command:string]:(message:Message, args?:string)=>void} = 
{
    'ping' : message => message.reply('pong'),

    'players' : async (message) =>
    {
        if (!attBot.connection)
        {
            message.reply("Server is not online");
            return;
        }

        var response = await attBot.connection.send(`player list`);

        message.reply(response.Result.map((item:any) => item.username).join('\n'));
    },

    'where' : async (message, player) => 
    {
        if (!attBot.connection)
        {
            message.reply("Server is not online");
            return;
        }

        var response = await attBot.connection.send(`player detailed ${player}`);

        message.reply(`${player} is at ${response.Result.Chunk}`);
    }
}


function serverConnected(connection:att.ServerConnection)
{
    connection.subscribe('PlayerJoined', playerJoined);
}

function playerJoined(player:any)
{
    
}