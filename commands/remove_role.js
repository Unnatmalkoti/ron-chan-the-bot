module.exports = {
	name: 'i_no_like',
	execute(message, args, data) {   
        console.log(args);



        if(args.length!= 1)
        {
            message.reply("You've got the syntax wrong buddy.Try `ron i_no_like <Comic_Code>`");
            return;
        }
        if(args[0] === "help")
        {
            message.channel.send("Syntax: `ron i_no_like <Comic_Code>`");
        }
        if(args[0] === "ALL")
        {
            message.member.removeRole(message.guild.roles.get(data.all_role));
            message.reply("So you don't wanna know about everything... Sed");
            return;

        }
        if(!getSeries(args[0], data))
        {
            message.reply("BEEEEP! Wrong Comic Code.");
            return;
        }
          
            

        let series = getSeries(args[0], data);
        let role = message.guild.roles.get(series.role_id);
        message.member.removeRole(role);
        message.reply("So now,I won't be telling you when the next chapter of " + role.name + " comes out");
        


        function getSeries(code, data)
        {
           return data.series.find(manga => {
                    return manga.code === code; 
                
            });

        }
    
	},
};