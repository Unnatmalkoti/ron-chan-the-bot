const  {database} = require("../database");
const Discord = require('discord.js');
module.exports = {
    name: 'list_notif',
    aliases: ['listnotif',"list","show"],

	async execute(message, args) {
        let ctr = 0;
        let embed = new Discord.RichEmbed()
            .setTitle("Notification list");
        let description = "";

        let notifications = await database.getAllNotifications().then(x=>x);
        let config = await database.getConfig().then(x=>x);
 

    
        notifications.forEach(manga => {

         
            if(ctr === 10){
                message.channel.send(embed);
                embed = new Discord.RichEmbed();
                description = "";
                ctr=0;                
            } 

            else          
            ctr = ctr+1;

            let role = message.guild.roles.get(manga.role_id);
            description += `${role}           \r\nId: ${manga.manga_id}     |   Code: ${manga.code}     |   Followers: ${getFollowers(role,message)}\r\n\r\n` 
            // embed = embed
            // .addField('Manga ID', manga.manga_id,true)
            // .addField('Code', manga.code, true)
            // .addField('Role', role, true)
            // .addField('Following',getFollowers(role, message), true)
            // .addBlankField();
            embed = embed.setDescription(description);
           
        });
        message.channel.send(embed);	
        
        function getFollowers(role,message)
            {
                let i=0;
                 message.guild.members.filter(member=>{

                    if(member.roles.has(role.id))
                        i=i+1;
                    
                });

                return i;
                
            }	
    },
    
    
};

