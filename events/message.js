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

		if(message.guild){
			const member = await client.findOrCreateMember({ id: message.author.id, guildID: message.guild.id });
			data.member = member;
		}

		if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
			if(message.guild){
				return message.channel.send(`My prefix for this server is ${data.guild.prefix}`);
			} else {
				return message.channel.send(`This bot doesn't work in dms please use me in a server`);
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

		if (!cmd && !message.guild) {
			return message.channel.send(`This bot doesn't work in dms please use me in a server`);
		}

		if(cmd.conf.guildOnly && !message.guild){
			return message.channel.send("I don't work in dms please use me in a server")
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
				return message.channel.send(neededPermissions.map((p) => `\`${p}\``).join(", "));
			}
			neededPermissions = [];
			cmd.conf.memberPermissions.forEach((perm) => {
				if(!message.channel.permissionsFor(message.member).has(perm)){
					neededPermissions.push(perm);
				}
			});
			if(neededPermissions.length > 0){
				return message.channel.send(`you need the following permissions to use this command ${neededPermissions.map((p) => `\`${p}\``).join(", ")}`);
			}
		}

		if(!cmd.conf.enabled){
			return;
		}

		if(cmd.conf.ownerOnly && message.author.id !== client.config.ownerID){
			return message.channle.send("Only the owner has access to this command");
		}

		let int = false

		//client.logger.log(`${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");

		try {
			data.member.commandsRun = data.member.commandsRun + 1;
			await data.member.save();
			cmd.run(message, args, data, int);
		} catch(e){
			console.error(e);
			return message.channel.send("An error has occured please try this command again if the probelm persists my developer will look at the logs and fix the bot\nPlease do not spam the command");
		}
	}
};