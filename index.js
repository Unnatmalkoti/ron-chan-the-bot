const Discord = require('discord.js');
const request = require('request');
const { prefixes } = require('./config.json');
const fs = require('fs');
const client = new Discord.Client();



client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//datastreams



for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
readData();

let i = 10; 


function readData() {
    fs.readFile("./config.json", 'utf8', (err, jsonString) => {
        console.log("Reading file");
        log("Reading file..");
        if (err) {
            console.log("Failed to read", err)
            log("Failed to read" + err.toString());
            return;
        }
        try {
            data = JSON.parse(jsonString);
            data.release_channel_id = process.env.CHANNEL_ID;
        }
        catch (err) {

        }
        //console.log(data);

    });

}

function updateDatabase()
{
    const jsonString = JSON.stringify(data)
    // fs.writeFile('./config.json', jsonString, err => {
    //     if (err) {
    //         console.log('Error writing file', err)
    //         log('Error writing file' + err.toString())
    //     } else {
    //         console.log('Successfully wrote file')
    //         log('Successfully wrote file');
    //     }
    // })

    var configStream = fs.createWriteStream("./config.json");
    configStream.write(jsonString);
    configStream.end();

}

client.once('ready', () => {
    console.log("ready"); 
    //console.log(data);
    console.log(data.release_channel_id);
    setInterval(function(){getAllChapters(); console.log("Checked!")}, data.refresh_time);    
})

client.login(process.env.DISCORD_TOKEN);

client.on('message', message => {
    //console.log(`\n${message.author.username} : \n${message.content}\n`);

    if (message.author.bot) return;
    i = randomWack(i, message, data.random_wack_width);              //randomWack setup

    if ((!message.content.startsWith(prefixes[0]) && !message.content.startsWith(prefixes[1]))) return;

    const args = message.content.slice(prefixes[0].length).split(/ +/);
    const commandName = args.shift().toLowerCase();

	
    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
        let newdata = command.execute(message, args,data);
        if(newdata){
            data= newdata;
            updateDatabase();
        }
     
       }


    catch (error) {
        console.error(error);
        message.reply('You get an error and lots of love from me.');
    }


    console.log(args);
});

function getAllChapters() {
    try
    {
        //log("Getting all Chapters...");
        data.series.forEach(manga => {
            let currentManga;
            
            request({ url: `https://mangadex.org/api/manga/${manga.manga_id}/`, json: true }, function (err, res, json) {
            //console.log(json);        
            findNewChapters(json, manga.manga_id, manga.role_id);
            });      
        });

    }
    catch(err)
    {
        log("ERROR : "+ err.toString());
    }


    
}

function findNewChapters(manga_json, manga_id, role_id)
{
    try
    {
        for(chapter_id in manga_json.chapter)
        {
             let chapter = manga_json.chapter[chapter_id];
             if(chapter.group_id === data.group_id          || chapter.group_id_2 === data.group_id        || chapter.group_id_3 === data.group_id )
             {
                if (!data.notified_chapters.includes(chapter_id) && chapter.lang_code === 'gb')
                {
                    log("NEW CHAPTER:" + manga_json.manga.title + ` Chapter ${chapter.chapter} ID ${chapter_id} `);  
                    sendNotification(chapter, manga_json.manga, chapter_id, manga_id, role_id);
             
                }
             }
        }
    }
    catch(err)
    {
        console.log(err);
        log("ERROR : "+ err.toString());
    }

   

}

function sendNotification(newChapter, manga, chapter_id, manga_id, role_id)
{
    try
    {
        let emmbed = new Discord.RichEmbed()
            .setTitle(`Chapter ${newChapter.chapter} | ${newChapter.title}`)
            .setURL(`https:\/\/mangadex.org\/chapter\/${chapter_id}`)
            .setThumbnail(`https:\/\/mangadex.org\/${manga.cover_url}`)
            .setAuthor(manga.title,"" ,`https:\/\/mangadex.org\/title\/${manga_id}`);

        
        const release_channel = client.channels.get(data.release_channel_id)
        const all_role = release_channel.guild.roles.get(data.all_role);
        console.log(release_channel);
        release_channel.send(`${release_channel.guild.roles.get(role_id)} ${all_role}`)
        .then(message=>{

            log(`Chapter Id : ${chapter_id} Pinged`);
            release_channel.send(emmbed)
                .then(message => {
                    data.notified_chapters.push(chapter_id);
                    log(`Chapter Id : ${chapter_id} Embed sent`);
                    updateDatabase();
                })
            .catch(err=>
                {
                    log("ERROR : " + err.toString());
                });

        })            
        .catch(err=>
            {
                log("ERROR : " + err.toString());
            });;
        
           
    }

    catch(err)
    {
        console.log(err);
    }

}   

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