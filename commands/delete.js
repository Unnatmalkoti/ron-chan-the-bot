const  {database} = require("../database");
module.exports = {
    name: 'delete_notif',
    aliases: ["deletenotif","delete"],
	async execute(message, args) {
        let config = await database.getConfig().then(x=>x);	
        if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.has(config.mod_role_id) && message.author.id != config.god_father_id)
        {
            message.channel.send("You don't have ~~big enuf balls~~ permission to execute this command.");
            return;
		}
        if(args.length !=1){
            message.channel.send("Wrong syntax buddy. Try `ron delete_notif help`");
            return;
        }
        if(args[0] ==='help')
        {
            message.channel.send("`ron delete_notif <Comic_Code>`\r\naliases: deletenotif, delete");
            return;
        }

        await database.deleteNotification({"code" : args[0].toUpperCase()}); 
        
        message.channel.send(`Removed ${args[0].toUpperCase()} if there was any.`);
        
	},
};
