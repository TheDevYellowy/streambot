const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const { Utils } = require("discord-music-player");

module.exports = class NP extends Command {

	constructor (client) {
		super(client, {
			name: "nowplaying",
			dirname: __dirname,
			enabled: true,
			aliases: [ "np" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			ownerOnly: false
		});
	}

	async run (message, args) {
        const song = this.client.player.nowPlaying(message);
        const embed = new Discord.MessageEmbed();
        const progressBar = this.client.player.createProgressBar(message, { timecodes: true });

        if(song){
            embed.setTitle(`${message.guild.name}`);
            embed.setThumbnail(song.thumbnail);
			embed.setColor(this.client.config.embed.color)
            embed.addField("Song Name", `${song.name}`);
            embed.addField("Song Progress", `${progressBar}`);
        }

        message.channel.send(embed);
    }
}