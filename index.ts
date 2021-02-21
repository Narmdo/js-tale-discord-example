const config = require('./config');

import att from 'js-tale/dist';
import discord from 'discord.js';

var discordBot:discord.Client;
var attBot:att.Client;

var connection:undefined|att.ServerConnection;

init();

async function init()
{ 
    discordBot  = new discord.Client();
    discordBot.login(config.discord);

    discordBot.on('message', handleDiscordMessage);
    
    await new Promise<void>(resolve => discordBot.once('ready', () => resolve()));

    attBot = new att.Client();
    await attBot.init(config);
    
    var group = await attBot.groupManager.groups.get(config.groupId);

    group.automaticConsole(serverConnected);
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

var discordHandler : {[command:string]:(message:discord.Message, args?:string)=>void} = 
{
    'ping' : message => message.reply('pong'),

    'players' : async (message) =>
    {
        if (!connection)
        {
            message.reply("Server is not online");
            return;
        }

        var response = await connection.send(`player list`);

        message.reply(response.Result.map((item:any) => item.username).join('\n'));
    },

    'where' : async (message, player) => 
    {
        if (!connection)
        {
            message.reply("Server is not online");
            return;
        }

        var response = await connection.send(`player detailed ${player}`);

        message.reply(`${player} is at ${response.Result.Chunk}`);
    }
}


function serverConnected(newConnection:att.ServerConnection)
{
    console.log(`Connected to ${newConnection.server.info.name}`);

    connection = newConnection;

    newConnection.on('closed', () => 
    { 
        console.log(`Connection to ${newConnection.server.info.name} closed`);

        if (connection == newConnection)
        {
            connection = undefined;
        }
    });
}

function playerJoined(player:any)
{
    console.log(`${player.name} joined the server.`);
}