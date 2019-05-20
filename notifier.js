const request = require("request")
const {database} = require("./database");
const discordClient = require("./index");
const Discord = require("discord.js")

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uri = "mongodb+srv://unnat:nonstop98@ron-chan-the-bot-izi3w.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
const dbName = "ronchan";
var mongodb;
let i =1;



MongoClient.connect(uri, {  
    poolSize: 10,
    useNewUrlParser: true
    // other options can go here
  },function(err, db) {
      assert.equal(null, err);
      mongodb=db;
      }
  )


function notify() {
  
    

        console.log("connect()");
        setInterval(async function () {
            try {

                let db = mongodb.db(dbName);

                let config = await db.collection("configurations").find().toArray();

                
                let notified_chapters = await db.collection("notified_chapters").find().toArray();
                let notifications = await db.collection("notifications").find().toArray();
                console.log(`connection number : ${i++}`);



                notifications.forEach(function (manga) {

                    request({ url: `https://mangadex.org/api/manga/${manga.manga_id}/`, json: true }, function (err, res, json) {
                        findNewChapters(json, manga.manga_id, manga.role_id, config[0], notified_chapters, client);
                        //console.log(json);                    
                    })



                });

                console.log("checked!");
            }

            catch (err) {
                console.log(err);
                //console.log("ERROR : "+ err.toString());
            }

        }, 60 * 1000);

    console.log("notify()");
}

async function findNewChapters(manga, manga_id, role_id, config, notified_chapters,client)
{
    try
    {
        
                //filtering wrt group id
                let chapters=[];

                for(chapter_id in manga.chapter)
                {
                    let chapter = manga.chapter[chapter_id];
                    if( (chapter.group_id === config.group_id
                        || chapter.group_id_2 === config.group_id
                        || chapter.group_id_3 === config.group_id) && chapter.lang_code === 'gb')
                        {
                            chapter.chapter_id = chapter_id;
                            chapters.push(chapter);
                        }
                    
                }
                manga.chapter = chapters;

                //    for(chapter_id in manga.chapter)
                //     {
                //         let chapter = manga.chapter[chapter_id];
                //         if(notified_chapters.some(x=>x.chapter_id === chapter.chapter_id))
                //         {
                //             sendNotification(chapter, manga.manga, chapter.chapter_id, manga_id, role_id);
                //         }
                        
                //     } 

                    manga.chapter.forEach(chapter=>
                    {
                        if(!notified_chapters.some(x=>x.chapter_id === chapter.chapter_id))
                        {
                            console.log(chapter);
                            sendNotification(chapter, manga.manga, chapter.chapter_id, manga_id, role_id, config,client);
                        }
                    })
                

               

         

        // for(chapter_id in manga_json.chapter)
        // {
        //      let chapter = manga_json.chapter[chapter_id];
        //      if(chapter.group_id === data.group_id          || chapter.group_id_2 === data.group_id        || chapter.group_id_3 === data.group_id )
        //      {
        //         if (!data.notified_chapters.includes(chapter_id) && chapter.lang_code === 'gb')
        //         {
        //             log("NEW CHAPTER:" + manga_json.manga.title + ` Chapter ${chapter.chapter} ID ${chapter_id} `);  
        //             sendNotification(chapter, manga_json.manga, chapter_id, manga_id, role_id);
             
        //         }
        //      }
        // }



    }
    catch(err)
    {
        console.log(err);
        //log("ERROR : "+ err.toString());
    }

   

}


async function sendNotification(newChapter, manga, chapter_id, manga_id, role_id,config,client)
{
    try
    {
        let emmbed = new Discord.RichEmbed()
            .setTitle(`Chapter ${newChapter.chapter} | ${newChapter.title}`)
            .setURL(`https:\/\/mangadex.org\/chapter\/${chapter_id}`)
            .setThumbnail(`https:\/\/mangadex.org\/${manga.cover_url}`)
            .setAuthor(manga.title,"" ,`https:\/\/mangadex.org\/title\/${manga_id}`);

        
        const release_channel = discordClient.discordClient.channels.get(process.env.release_channel_id)
        const all_role = release_channel.guild.roles.get(config.all_role);
        console.log(release_channel);
        release_channel.send(`${release_channel.guild.roles.get(role_id)} ${all_role}`)
        .then(message=>{

            release_channel.send(emmbed)
                .then(message => {

                    //database.addChapter({"chapter_id": chapter_id});
                    mongodb.db(dbName).collection('notified_chapters').insertMany([{"chapter_id": chapter_id}])

                    
                })
            .catch(err=>
                {
                    console.log("ERROR : " + err.toString());
                });

        })            
        .catch(err=>
            {
                console.log("ERROR : " + err.toString());
            });;
        
           
    }

    catch(err)
    {
        console.log(err);
    }

}
   

module.exports.notify = notify;
notify();