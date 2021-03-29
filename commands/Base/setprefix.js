const Command = require("../../base/Command.js");

module.exports = class setprefix extends Command {

	constructor (client) {
		super(client, {
			name: "setprefix",
			dirname: __dirname,
			enabled: true,
			aliases: [ "sp" ],
			memberPermissions: ["MANAGE_SERVER"],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			ownerOnly: false
		});
	}

	async run (message, args, data) {
        const prefix = args[0];
        if(!prefix) return;
        if(prefix.length > 5) return message.channel.send(`The prefix is to long please keep it under 5 characters`);
        
        data.guild.prefix = prefix;
        await data.guild.save();

        return message.channel.send(`The new preifx is now ${prefix}`);
    }
}