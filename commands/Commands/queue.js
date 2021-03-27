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
			embed.setDescription(`${queue.songs.map((song, i) => {
				return `${i === 0 ? `Now Playing` : `#${i+1}`} - ${song.name} | ${song.author}`
			}).join("\n")}`);
		} else {
			return message.channel.send("There is no queue for this server");
		}

		message.channel.send(embed);
    }
}