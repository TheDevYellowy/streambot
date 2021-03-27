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
        
    }
}