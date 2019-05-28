const Discord = require('discord.js');
const { prefixes } = require('./config.json');
const fs = require('fs');
const client = new Discord.Client();
const {database} = require("./database");



client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
process.env.DISCORD_TOKEN="NTcyMzMwODQ3NzgxMjU3MjI4.XMavaA.M4M-CR2STVLGuMPkqxc09kqojoc"




for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

let i = 10; 

client.once('ready', () => {
    module.exports.discordClient =client;
    notify = require("./notifier").notify;
    console.log("ready"); 
    //console.log(data.release_channel_id);
    //notify();
       
})


client.login(process.env.DISCORD_TOKEN);


client.on('message', message => {
    //console.log(`\n${message.author.username} : \n${message.content}\n`);
    try{
        if (message.content.toLowerCase().search("unnati") != -1)
         message.delete(0);
    }
   catch(err)
   {
       console.log(err);
   }


    if (message.author.bot) return;
    //i = randomWack(i, message, data.random_wack_width);              //randomWack setup

    if ((!message.content.startsWith(prefixes[0]) && !message.content.startsWith(prefixes[1]))) return;

    const args = message.content.slice(prefixes[0].length).split(/ +/);
    const commandName = args.shift().toLowerCase();

	
    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
        command.execute(message, args);

    }


    catch (error) {
        console.error(error);
        message.reply('You get an error and lots of love from me.');
    }


    console.log(args);
});

function log(logString)
{
    var logStream = fs.createWriteStream("log.txt", {flags:'a'});
    logStream.write(getDateTime() + " :: :: " +logString + "\r\n\r\n");
    logStream.end();

}

function randomWack(messageThreshold, message, width)
{
    try
    {
        if (messageThreshold <= 0) {
            
            const min = 1000;
            messageThreshold = Math.floor((Math.random()*width) + min);
            message.channel.send("Wack!");
        }
    }
    catch
    {}
    
    return messageThreshold-1;
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}
