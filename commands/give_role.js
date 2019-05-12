module.exports = {
	name: 'i_like',
	execute(message, args, data) {   
        console.log(args);

        if(args.length!= 1)
        {
            message.reply("You've got the syntax wrong buddy.Try `ron i_like <Comic_Code>`");
            return;
        }
        if(args[0] === "help")
        {
            message.channel.send("Syntax: `ron i_like <Comic_Code>`");
        }
        if(!getSeries(args[0], data))
        {
            message.reply("BEEP! Wrong Comic Code.");
            return;
        }
          
            

        let series = getSeries(args[0], data);
        let role = message.guild.roles.get(series.role_id);
        message.member.addRole(role);
        message.reply("Aye! I'll tell ya when the next chapter of " +role.name + " comes out");
        


        function getSeries(code, data)
        {
           return data.series.find(manga => {
                    return manga.code === code; 
                
            });

        }
    
	},
};