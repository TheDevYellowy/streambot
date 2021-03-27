module.exports = class {
    
    constructor(client){
        this.client = client;
    }

    async run() {

        const client = this.client;

        const status = require("../config/config").ting.status;
        if(status.toLowerCase() === "streaming"){
            client.user.setActivity(`${client.config.ting.game}`, {
                type: `${status}`,
                url: `${client.config.ting.url}`
              });
        } else {
            client.user.setActivity(`${client.config.ting.game}`, { type: `${status}`});
        }

        this.client.logger.ready(client);
    }
}