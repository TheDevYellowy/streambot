const interactions = require("discord-slash-commands-client");
const Dashboard = require("discord-bot-dashboard");

module.exports = class {
    
    constructor(client){
        this.client = client;
    }

    async run() {

        const client = this.client;
        const int = new interactions.Client(client.config.token, client.user.id);

        const status = require("../config/config").ting.status;
        if(status.toLowerCase() === "streaming"){
            client.user.setActivity(`${client.config.ting.game}`, {
                type: `${status}`,
                url: `${client.config.ting.url}`
              });
        } else {
            client.user.setActivity(`${client.config.ting.game}`, { type: `${status}`});
        }

        /*int
            .createCommand({
                name: "ping",
                description: "ping pong"
            })
            .then(console.log)
            .catch(console.error);

        client.on("interactionCreate", (interaction) => {
            if(interaction.name === "ping"){
                interaction.channel.send("pong");
            }
        });*/

        /*client.api.applications(client.user.id).guilds("701429220538187876").commands.post({
            data: {
                name: "play",
                description: "plays a song from a url",

                options: [
                    {
                        name: "url",
                        description: "url of the song, it can be yt or spotify",
                        type: 3,
                        required: true
                    }
                ]
            },
            data: {
                name: "test",
                description: "testing the interaction for / commands",

                options: [
                    {
                        name: "arg1",
                        description: "First word",
                        type: 3
                    },
                    {
                        name: "arg2",
                        description: "Second word",
                        type: 3
                    }
                ]
            },
            data: {
                name: "help",
                description: "help command for the bot",

                options: [
                    {
                        name: "command",
                        description: "command",
                        type: 3,
                        optional: true
                    }
                ]
            }
        });

        client.ws.on("INTERACTION_CREATE", async interaction => {
            const command = interaction.data.name.toLowerCase();
            const args = interaction.data.options;
            let cmd = await client.commands.get(command);
            const int = true;

            if(command == "play"){
                let url = args.find(arg => arg.name.toLowerCase() == "url").value
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: `I should be playing ${url}`
                        }
                    }
                });
                console.log(interaction.message);
                client.player.play(interaction, url);
            } else if(command == "test"){
                let arg1 = args.find(arg => arg.name.toLowerCase() == "arg1").value;
                let arg2 = args.find(arg => arg.name.toLowerCase() == "arg2").value;
                console.log(interaction);
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: `${cmd = await client.commands.get("testing").run(interaction, int) ? "true" : "false"}`
                        }
                    }
                });
                cmd = await client.commands.get("testing");
                cmd.run(int, interaction);
            }else if(command == "help"){
                cmd.run(int, interaction);
            }
        });*/

        this.client.logger.ready(client);
    }
}