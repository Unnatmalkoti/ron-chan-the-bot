const Discord = require('discord.js');
module.exports = {
        name: 'help',
        aliases: ["elp"],

	execute(message, args, data) {
        const helpText = "**List of Commands**" + "\r\n"
        +"`create_notif` : To create a notification\r\n"
        +"`delete_notif` : To delete a notification\r\n"
        +"`help` : do i need to explain this?\r\n"
        +"`list_notif` : Lists all the notification\r\n"
        +"`refresh_time` : To Change the time interval after which bot looks for new chapter   *I didn't make it yet*\r\n"
        +"`i_like` : To add notification role for your fav series\r\n"
        +"`i_no_like` : To remove notification role of a series you are not good enough for\r\n"
        +"`set_random_wack` : To set the width of Random Wacking //*You asked for it*"
        message.channel.send(helpText);		
	},
};
