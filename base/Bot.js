const { MessageEmbed, Util, Client, Collection } = require("discord.js");
const { Player } = require("discord-music-player");
const util = require("util");
const path = require("path");
const moment = require("moment");

module.exports = class Bot extends Client {
    constructor(options){
        super(options);
        this.config = require("../config");
        this.commands = new Collection();
        this.aliases = new Collection();
        this.helpers = require("../helpers/helpers");




        this.player = new Player(this, {
            volume: 75,
            quality: 'high',
            leaveOnEmpty: true,
        });

        this.player.on("queueEnd", (message, queue) => {
            message.channel.send(`Queue ended, I have left the VC`)
        });

        this.player.on('error', (message, error) => {
            switch(error){
                case 'NotConnected': 
            }
        })
    }
}