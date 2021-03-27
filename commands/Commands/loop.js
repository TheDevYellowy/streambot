const Command = require("../../base/Command.js");

module.exports = class Loop extends Command {

	constructor (client) {
		super(client, {
			name: "loop",
			dirname: __dirname,
			enabled: true,
			aliases: [],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			ownerOnly: false
		});
	}

	async run (message, args, data) {
        const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
        const L = guildData.songData.loop;
        const status = !L;
        data.guild.songData.loop = status;
        await data.guild.save();

        await this.client.player.setRepeatMode(message, status);
        message.channel.send(`Loop set to **${status}**`);
    }
}