const path = require("path");

module.exports = class Command {
	constructor(client, {
		name = null,
		dirname = false,
		enabled = true,
		aliases = new Array(),
		botPermissions = new Array(),
		memberPermissions = new Array(),
		ownerOnly = false
	})
	{
		const category = (dirname ? dirname.split(path.sep)[parseInt(dirname.split(path.sep).length-1, 10)] : "Other");
		this.client = client;
		this.conf = { enabled, memberPermissions, botPermissions, ownerOnly};
		this.help = { name, category, aliases };
	}
};