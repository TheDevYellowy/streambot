const readdir = require("util").promisify(require("fs").readdir);
const chalk = require("chalk");
const mongoose = require("mongoose");

const config = require("./config/config");
const Dashboard = require("discord-bot-dashboard");
const { dash } = require("./config/config");

const Bot = require("./base/Bot"),
    client = new Bot();

const dashboard = new Dashboard(client, {
	port: 8080,
	clientSecret: client.config.dash.clientSecret,
	redirectURI: client.config.dash.redirectURI
});

const init = async() => {

    const directories = await readdir("./commands");
    client.logger.log(`loading a total of ${directories.length} directories`, "CMD", "bgGreen");
	client.logger.log(`Loading a total of ${client.commands.size} command(s).`, "CMD", "bgGreen");
    directories.forEach(async (dir) => {
		const commands = await readdir("./commands/"+dir+"/");
		commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
			const response = client.loadCommand("./commands/"+dir, cmd);
			if(response){
				client.logger.log(response, "error");
			}
		});
	});

    const evtFiles = await readdir("./events/");
	client.logger.log(`Loading a total of ${evtFiles.length} events.`, "Event");
	evtFiles.forEach((file) => {
		const eventName = file.split(".")[0];
		client.logger.log(`Loading Event: ${eventName}`);
		const event = new (require(`./events/${file}`))(client);
		client.on(eventName, (...args) => event.run(...args));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
    
	client.login(config.token);

    mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
		client.logger.log("Connected to the Mongodb database.", "Mongoose");
	}).catch((err) => {
		client.logger.err(`Unable to connect to the Mongodb database. Error: ${err}`, "Mongoose");
	});

};

init();

client.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
	.on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
	.on("error", (e) => client.logger.log(e, "error"))
	.on("warn", (info) => client.logger.log(info, "warn"))
	.on("ready", () => dashboard.run());

process.on("unhandledRejection", (err) => {
    console.error(err);
});