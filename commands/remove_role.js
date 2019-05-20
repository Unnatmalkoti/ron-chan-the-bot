const  {database} = require("../database");
module.exports = {
    name: 'i_no_like',
    aliases: ["idontlike","inolike","remove"],
	async execute(message, args) {   
        console.log(args);
        let notifications = await database.getAllNotifications().then(x=>x);
        let config = await database.getConfig().then(x=>x);

        if(args.length!= 1)
        {
            message.reply("You've got the syntax wrong buddy.Try `ron i_no_like <Comic_Code>`");
            return;
        }
        if(args[0] === "help")
        {
            message.channel.send("Syntax: `ron i_no_like <Comic_Code>` \r\n aliases: idontlike, inolike,remove");
            return;
        }
        if(args[0].toUpperCase() === "ALL")
        {
            message.member.removeRole(message.guild.roles.get(config.all_role));
            message.reply("So you don't wanna know about everything... Sed");
            return;

        }
        if(!getSeries(args[0]))
        {
            message.reply("BEEEEP! Wrong Comic Code.");
            return;
        }
          
            

        let series = getSeries(args[0], notifications);
        let role = message.guild.roles.get(series.role_id);
        message.member.removeRole(role);
        message.reply("So now,I won't be telling you when the next chapter of " + role.name + " comes out");
        


        function getSeries(code, notifications)
        {
           return notifications.find(manga => {
                    return manga.code === code; 
                
            });

        }
    
	},
};