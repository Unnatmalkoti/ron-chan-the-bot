const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
        name: 'config',
        aliases: ["config_file","configfile"],

	execute(message, args, data) {
        if(!message.member.hasPermission("ADMINISTRATOR"))
        {
            return;
        }
        if(args.length === 0)
        {
            const buffer = fs.readFileSync("./config.json");
            message.channel.sendFile(buffer, "config.json");
        }
        if(args[0] === "restart")
        {
            message.channel.send("Restarting my lord...").then(x=>{
            process.exit();
            });
        }

        if(args[0] === "logs")
        {
            const buffer = fs.readFileSync("./log.txt");
            message.channel.sendFile(buffer, "config.txt");
        }
        
        
	},
};
