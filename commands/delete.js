module.exports = {
    name: 'delete_notif',
    aliases: ["deletenotif","delete"],
	execute(message, args, data) {
        if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.has(data.mod_role_id) && message.author.id!= "525685822515707914")
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

       let newseries =  data.series.filter((value, index, arr)=>{
            console.log(value)
            console.log(value.manga_id != args[0])
            return value.code != args[0].toUpperCase();

        });
        data.series = newseries;
        message.channel.send(`Removed ${args[0]} if there was any.`);
        return data;


        
	},
};
