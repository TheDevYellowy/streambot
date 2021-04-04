const Command = require("../../base/Command.js");
const Discord = require("discord.js");

module.exports = class Queue extends Command {

	constructor (client) {
		super(client, {
			name: "queue",
			dirname: __dirname,
			enabled: true,
			aliases: [ "q" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			ownerOnly: false
		});
	}

	async run (message, args) {
        let queue = this.client.player.getQueue(message);
		let embed = new Discord.MessageEmbed();

		if(queue){
			embed.setTitle("Queue");
			embed.setColor(this.client.config.embed.color)
			embed.setDescription(`${queue.songs.map((song, i) => {
				return `${i === 0 ? `Now Playing` : `#${i+1}`} - ${song.name} | ${song.author}`
			}).join("\n")}`);
		} else {
			return message.channel.send("There is no queue for this server");
		}

		if(embed.length > 6000){
			return message.channel.send(`The queue is to large to fit in an embed with ${queue.songs.length} songs, please use the nowplaying (np) command`);
		}

		message.channel.send(embed);
    }
}