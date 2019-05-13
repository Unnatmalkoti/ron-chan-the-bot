module.exports = {
	name: 'set_random_wack',
	aliases: ["setrandomwack"],

	execute(message, args, data) {
		
		if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.has(data.mod_role_id))
        {
            message.channel.send("You don't have ~~big enuf balls~~ permission to execute this command.");
            return;
		}

		if(args[0] === "help")
        {
			message.channel.send("Syntax: `ron set_random_wack <Random_wack_width>`\r\naliases: setrandomwack");
			return;
        }
		
		;
		if(args.length != 1)
		{
			message.channel.send("That's not how we do it bruh");
			return;
        }
        data.random_wack_width = parseInt(args[0],10);
		message.channel.send(`Random Wack set to ${data.random_wack_width}`);		
		return data;
		
	},
};