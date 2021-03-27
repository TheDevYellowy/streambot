const Command = require("../../base/Command.js");

module.exports = class Reload extends Command {

	constructor (client) {
		super(client, {
			name: "reload",
			dirname: __dirname,
			enabled: true,
			aliases: [ "rl" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			ownerOnly: true
		});
	}

	async run (message, args) {
        const command = args[0];
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if(!cmd) return;

        await this.client.unloadCommand(cmd.conf.location, cmd.help.name);
        await this.client.loadCommand(cmd.conf.location, cmd.help.name);

        message.channel.send(`Reloaded ${cmd.help.name}`);
    }
}