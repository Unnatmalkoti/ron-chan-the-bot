const Discord = require('discord.js');
const request = require('request');
const { prefix, token } = require('./config.json');
const fs = require('fs');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));



for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
readData();


function readData() {
    fs.readFile("./config.json", 'utf8', (err, jsonString) => {
        console.log("Reading file");
        if (err) {
            console.log("Failed to read", err)
            return
        }
        try {
            data = JSON.parse(jsonString);
        }
        catch (err) {

        }
        //console.log(data);
    });
}

function updateDatabase()
{
    const jsonString = JSON.stringify(data)
    fs.writeFile('./config.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

client.once('ready', () => {
    console.log("ready"); 
    //console.log(data);
    setInterval(function(){getAllChapters(); console.log("Checked!")}, data.refresh_time);  
    
})

client.login(token);

client.on('message', message => {
    console.log(`\n${message.author.username} : \n${message.content}\n`);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

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
                    sendNotification(chapter, manga_json.manga, chapter_id, manga_id, role_id);
             
                }
             }
        }
    }
    catch(err)
    {
        console.log(err);
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
        if(release_channel.send(`${release_channel.guild.roles.get(role_id)} ${all_role}`))
        if(release_channel.send(emmbed))
        {
            data.notified_chapters.push(chapter_id);
            updateDatabase();
        }       
           
    }

    catch(err)
    {
        console.log(err);
    }

}   