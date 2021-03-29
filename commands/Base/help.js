const Command = require("../../base/Command.js");
const Discord = require("discord.js");

module.exports = class Help extends Command {

	constructor (client) {
		super(client, {
			name: "help",
			dirname: __dirname,
			enabled: true,
			aliases: [ "h" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			ownerOnly: false
		});
	}

	async run (message, args, data) {
        if(args[0]){
            //do tings
        } else {
            const categories = [];
            const commands = this.client.commands;

            commands.forEach((command) => {
                if(!categories.includes(command.help.category)){
                    if(command.help.category === "Owner" && message.author.id !== this.client.config.ownerID){
                        return;
                    }
                    categories.push(command.help.category);
                }
            });

            const embed = new Discord.MessageEmbed()
                .setDescription(`● to get a help on a specific command type ${data.guild.prefix}help <command>`);
            
            categories.sort().forEach((cat) => {
                const tCommands = commands.filter((cmd) => cmd.help.category === cat);
                embed.addField(`${cat} - (${tCommands.size})`, tCommands.map((cmd) => "`"+cmd.help.name+"`").join(", "));
            });

            embed.setAuthor(`${this.client.user.username} | Commands`, this.client.user.displayAvatarURL());
            return message.channel.send(embed);
        }
    }
}