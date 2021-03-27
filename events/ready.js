module.exports = class {
    
    constructor(client){
        this.client = client;
    }

    async run() {

        const client = this.client;

        client.logger.log(`Loading a total of ${client.commands.size} command(s).`, "CMD", "bgGreen");
        client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "Ready");

        const status = require("../config/config").ting.status;
        if(status.toLowerCase() === "streaming"){
            client.user.setActivity(`${client.config.ting.game}`, {
                type: `${status}`,
                url: `${client.config.ting.url}`
              });
        } else {
            client.user.setActivity(`${client.config.ting.game}`, { type: `${status}`});
        }
    }
}