const Command = require("../../base/Command.js");
const { MessageEmbed } = require("discord.js");

module.exports = class Profile extends Command {

	constructor (client) {
		super(client, {
			name: "profile",
			dirname: __dirname,
			enabled: true,
			aliases: [],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			ownerOnly: false
		});
	}

	async run (message, args, data) {
        const config = require("../../config/config");
        
        const embed = new MessageEmbed()
            .setAuthor(`${message.author.username} profile`, message.author.displayAvatarURL({ dynamic: true }))
            .addField("Commands Run (in this server)", data.member.commandsRun)
            .addField("Commands Run (Total)", data.user.commandsRun)
            .addField("\u200b", config.embed.links.join('\n'))
            .setColor(config.embed.color)
            .setTimestamp();
        
        message.channel.send(embed);
    }
}