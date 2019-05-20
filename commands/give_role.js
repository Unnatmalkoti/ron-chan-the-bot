const  {database} = require("../database");
module.exports = {
    name: 'i_like',
    aliases: ["ilike","gimme","iwant","i_want"],

	async execute(message, args) {   
        console.log(args);
        let notifications = await database.getAllNotifications().then(x=>x);
        let config = await database.getConfig().then(x=>x);

        if(args.length!= 1)
        {
            message.reply("You've got the syntax wrong buddy.Try `ron i_like <Comic_Code>`");
            return;
        }
        if(args[0] === "help")
        {
            message.channel.send("Syntax: `ron i_like <Comic_Code>` \r\naliases: ilike, gimme, iwant, i_want");
            return;
        }

        if(args[0].toUpperCase() === "ALL")
        {
            message.member.addRole(message.guild.roles.get(config.all_role));
            message.reply("So you wanna know about everything... Noice");
            return;
        }
        
        if(!getSeries(args[0], notifications))
        {
            message.reply("BEEP! Wrong Comic Code.");
            return;
        }
          
            

        let series = getSeries(args[0], notifications);
        let role = message.guild.roles.get(series.role_id);
        message.member.addRole(role);
        message.reply("Aye! I'll tell ya when the next chapter of " +role.name + " comes out");
        


        function getSeries(code, notifications)
        {
            code    = code.toUpperCase();
            return notifications.find(manga => {
                    return manga.code === code; 
                
            });

        }
    
	},
};