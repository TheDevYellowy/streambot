const Command = require("../../base/Command.js");

module.exports = class Reboot extends Command {

	constructor (client) {
		super(client, {
			name: "reboot",
			dirname: __dirname,
			enabled: true,
			aliases: [ "rb" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			ownerOnly: true
		});
	}

	async run (message, args) {
        await process.exit();
    }
}