module.exports = class {
	constructor (client) {
		this.client = client;
	}

	async run (message) {

		const data = {};

		if(message.author.bot){
			return;
		}

		if(message.guild && !message.member){
			await message.guild.members.fetch(message.author.id);
		}

		const client = this.client;
		data.config = client.config;
    
		if(message.guild){
			const guild = await client.findOrCreateGuild({ id: message.guild.id });
			message.guild.data = data.guild = guild;
		}

		if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
			if(message.guild){
				return message.channel.send(`My prefix for this server is ${data.guild.prefix}`)
			}
		}

		const prefix = client.helpers.getPrefix(message, data);
		if(!prefix){
			return;
		}

		const args = message.content.slice((typeof prefix === "string" ? prefix.length : 0)).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
		
		if(!cmd && message.guild) return;
		else if (!cmd && !message.guild) {
			return message.sendT("misc:HELLO_DM", {
				username: message.author.username
			});
		}

		if(message.guild && data.guild.ignoredChannels.includes(message.channel.id) && !message.member.hasPermission("MANAGE_MESSAGES")){
			message.delete();
			message.author.send(message.translate("misc:RESTRICTED_CHANNEL", {
				channel: message.channel.toString()
			}));
			return;
		}

		if (customCommandAnswer) {
			return message.channel.send(customCommandAnswer);
		}

		if(cmd.conf.guildOnly && !message.guild){
			return message.error("misc:GUILD_ONLY");
		}

		if(message.guild){
			let neededPermissions = [];
			if(!cmd.conf.botPermissions.includes("EMBED_LINKS")){
				cmd.conf.botPermissions.push("EMBED_LINKS");
			}
			cmd.conf.botPermissions.forEach((perm) => {
				if(!message.channel.permissionsFor(message.guild.me).has(perm)){
					neededPermissions.push(perm);
				}
			});
			if(neededPermissions.length > 0){
				return message.error("misc:MISSING_BOT_PERMS", {
					list: neededPermissions.map((p) => `\`${p}\``).join(", ")
				});
			}
			neededPermissions = [];
			cmd.conf.memberPermissions.forEach((perm) => {
				if(!message.channel.permissionsFor(message.member).has(perm)){
					neededPermissions.push(perm);
				}
			});
			if(neededPermissions.length > 0){
				return message.error("misc:MISSING_MEMBER_PERMS", {
					list: neededPermissions.map((p) => `\`${p}\``).join(", ")
				});
			}
			if(!message.channel.permissionsFor(message.member).has("MENTION_EVERYONE") && (message.content.includes("@everyone") || message.content.includes("@here"))){
				return message.error("misc:EVERYONE_MENTION");
			}
			if(!message.channel.nsfw && cmd.conf.nsfw){
				return message.error("misc:NSFW_COMMAND");
			}
		}

		if(!cmd.conf.enabled){
			return message.error("misc:COMMAND_DISABLED");
		}

		if(cmd.conf.ownerOnly && message.author.id !== client.config.owner.id){
			return message.error("misc:OWNER_ONLY");
		}

		let uCooldown = cmdCooldown[message.author.id];
		if(!uCooldown){
			cmdCooldown[message.author.id] = {};
			uCooldown = cmdCooldown[message.author.id];
		}
		const time = uCooldown[cmd.help.name] || 0;
		if(time && (time > Date.now())){
			return message.error("misc:COOLDOWNED", {
				seconds: Math.ceil((time-Date.now())/1000)
			});
		}
		cmdCooldown[message.author.id][cmd.help.name] = Date.now() + cmd.conf.cooldown;

		client.logger.log(`${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");

		const log = new this.client.logs({
			commandName: cmd.help.name,
			author: { username: message.author.username, discriminator: message.author.discriminator, id: message.author.id },
			guild: { name: message.guild ? message.guild.name : "dm", id: message.guild ? message.guild.id : "dm" }
		});
		log.save();

		if(!data.userData.achievements.firstCommand.achieved){
			data.userData.achievements.firstCommand.progress.now = 1;
			data.userData.achievements.firstCommand.achieved = true;
			data.userData.markModified("achievements.firstCommand");
			await data.userData.save();
			await message.channel.send({ files: [
				{
					name: "unlocked.png",
					attachment: "./assets/img/achievements/achievement_unlocked2.png"
				}
			]});
		}

		try {
			cmd.run(message, args, data);
			if(cmd.help.category === "Moderation" && data.guild.autoDeleteModCommands){
				message.delete();
			}
		} catch(e){
			console.error(e);
			return message.error("misc:ERR_OCCURRED");
		}
	}
};