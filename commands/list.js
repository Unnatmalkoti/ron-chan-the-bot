const Discord = require('discord.js');
module.exports = {
	name: 'list_notif',
	execute(message, args, data) {
        let ctr = 0;
        let embed = new Discord.RichEmbed()
            .setTitle("Notification list");

    
        data.series.forEach(manga => {
            if(ctr === 3){
                message.channel.send(embed);
                embed = new Discord.RichEmbed();
                ctr=0;                
            } 

            else          
            ctr = ctr+1;

            let role = message.guild.roles.get(manga.role_id);
            embed = embed.addBlankField()
            .addField('Manga ID', manga.manga_id,true)
            .addField('Code', manga.code, true)
            .addField('Role', role, true)
            .addField('Following',getFollowers(role, message), true);

            
           
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

