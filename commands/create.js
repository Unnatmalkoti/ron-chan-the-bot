module.exports = {
	name: 'create_notif',
	aliases: ["createnotif","create"],

	execute(message, args, data) {
		
		if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.has(data.mod_role_id) && message.author.id!= "525685822515707914")
        {
            message.channel.send("You don't have ~~big enuf balls~~ permission to execute this command.");
            return;
		}

		if(args[0] === "help")
        {
			message.channel.send("Syntax: `ron create_notif <Comic_Code> <Comic_ID> @Role` \r\naliases : createnotif, create");
			return;
        }
		
		const role = message.mentions.roles.first();
		if(args.length != 3 || !role)
		{
			message.channel.send("That's not how we do it bruh");
			return;
		}
		message.channel.send("Created... maybe");		
		data.series.push(manga = { 'role_id': role.id, 'manga_id': args[1], "code":args[0].toUpperCase()});
		return data;
		
	},
};

