const Discord = require('discord.js');
module.exports = {
        name: 'hi',
        aliases:["hello","hey"],
	execute(message, args, data) {
        const Text = "Hi there, fella. I'm Ron!\r\n"
        +"My creator, Sir Unnat, created me because he was missing his friend Ron (the inferior one, I'm way better than him.)\r\n"
        +"So now, I'm here to make lives of people at Fire syndicate better."
        message.channel.send(Text);		
	},
};
