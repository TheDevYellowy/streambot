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
        const song = this.player.nowPlaying(message);
        const embed = new Discord.MessageEmbed();
        const progressBar = this.player.createProgressBar(message, {
            size: 15,
            block: "=",
            arrow: ">"
        });

        if(song){
            embed.setTitle(`${message.guild.name}`);
            embed.addField("Song Name", `${song.name}`);
            embed.addField("\s", `${progressBar}`);
        }
    }
}