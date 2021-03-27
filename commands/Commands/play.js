const Command = require("../../base/Command.js");

module.exports = class Play extends Command {
	constructor (client) {
		super(client, {
			name: "play",
			dirname: __dirname,
			enabled: true,
			aliases: [ "p" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			ownerOnly: false
		});
	}

	async run (message, args) {
        const name = args.join(" ");
        if(!name){
            message.channel.send("You need to specify a name or url");
        }

        const voice = message.member.voice.channel;
        if(!voice){
            message.channel.send("You need to be in a voice channel");
        }

        const perms = voice.permissionsFor(this.client.user);
        if(!perms.has("CONNECT") || !perms.has("SPEAK")){
            message.channel.send("Please make sure I have the correct permissions (Connect / Speak).");
        }

        if(this.client.player.isPlaying(message)){
            await this.client.player.addToQueue(message, args.join(" "));
        } else {
            await this.client.player.play(message, args.join(" "));
        }
        
    }
}