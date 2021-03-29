const { MessageEmbed, Util, Client, Collection } = require("discord.js");
const { Player, Utils } = require("discord-music-player");
const util = require("util");
const path = require("path");
const moment = require("moment");

module.exports = class Bot extends Client {
    constructor(options){
        super(options);
        this.config = require("../config/config");
        this.commands = new Collection();
        this.aliases = new Collection();
        this.helpers = require("../helpers/helpers");
        this.logger = require("../helpers/logger");
        this.wait = util.promisify(setTimeout);
        this.guildsData = require("./Guild");
        this.membersData = require("./Member");

        this.databaseCache = {};
        this.databaseCache.guilds = new Collection();
        this.databaseCache.members = new Collection();


        this.player = new Player(this, {
            volume: 75,
            quality: 'high',
            leaveOnEmpty: true,
        });

        this.player
		.on("queueEnd", (message, queue) => {
            message.channel.send(`Queue ended, I have left the VC`);
        })
		.on("songAdd", (message, queue, song) => {
			message.channel.send(`**${song.name} has been added to the queue**`);
		})
		.on("songFirst", (message, song) => {
			message.channel.send(`**${song.name}** is playing`);
		})
		.on("playlistAdd", (message, queue, playlist) => {
			message.channel.send(`**${playlist.title}** added to queue with ${playlist.videoCount} songs and ${queue.songs.length} total songs`);
		})

        this.player.on('error', (message, error) => {
            switch(error){
                case 'NotConnected': 
                    message.channel.send(`You need to be connected to a voice channel`);
                    break;
                case "UnableToJoin":
					message.channel.send("I can't join your voice channel make sure I have permissions");
					break;
				case "LiveVideo":
					message.channel.send(`Can't play live videos`);
					break;
				default:
					message.channel.send(`Error Occured`);
					this.logger.err(error, "Music");
					break;
            }
        });

    }

    loadCommand(cmdPath, cmdName){
        try {
            const props = new (require(`.${cmdPath}${path.sep}${cmdName}`))(this);
            this.logger.log(`Loading Command: ${props.help.name}`, "CMD", "bgGreen", false);
            props.conf.location = cmdPath;
            if (props.init){
                props.init(this);
            }
            this.commands.set(props.help.name, props);
            props.help.aliases.forEach((alias) => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return this.logger.err(`Unable to load command ${cmdName}: ${e}`, "Command");
        }
    }

    async unloadCommand (cmdPath, cmdName) {
		let command;
		if(this.commands.has(cmdName)) {
			command = this.commands.get(cmdName);
		} else if(this.aliases.has(cmdName)){
			command = this.commands.get(this.aliases.get(cmdName));
		}
		if(!command){
			return `The command \`${cmdName}\` doesn't seem to exist, nor is it an alias. Try again!`;
		}
		if(command.shutdown){
			await command.shutdown(this);
		}
		delete require.cache[require.resolve(`.${cmdPath}${path.sep}${cmdName}.js`)];
		return false;
	}

	async findOrCreateGuild({ id: guildID }, isLean){
		if(this.databaseCache.guilds.get(guildID)){
			return isLean ? this.databaseCache.guilds.get(guildID).toJSON() : this.databaseCache.guilds.get(guildID);
		} else {
			let guildData = (isLean ? await this.guildsData.findOne({ id: guildID }).populate("members").lean() : await this.guildsData.findOne({ id: guildID }).populate("members"));
			if(guildData){
				if(!isLean) this.databaseCache.guilds.set(guildID, guildData);
				return guildData;
			} else {
				guildData = new this.guildsData({ id: guildID });
				await guildData.save();
				this.databaseCache.guilds.set(guildID, guildData);
				return isLean ? guildData.toJSON() : guildData;
			}
		}
	}

    async findOrCreateMember({ id: memberID, guildID }, isLean){
		if(this.databaseCache.members.get(`${memberID}${guildID}`)){
			return isLean ? this.databaseCache.members.get(`${memberID}${guildID}`).toJSON() : this.databaseCache.members.get(`${memberID}${guildID}`);
		} else {
			let memberData = (isLean ? await this.membersData.findOne({ guildID, id: memberID }).lean() : await this.membersData.findOne({ guildID, id: memberID }));
			if(memberData){
				if(!isLean) this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return memberData;
			} else {
				memberData = new this.membersData({ id: memberID, guildID: guildID });
				await memberData.save();
				const guild = await this.findOrCreateGuild({ id: guildID });
				if(guild){
					guild.members.push(memberData._id);
					await guild.save();
				}
				this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return isLean ? memberData.toJSON() : memberData;
			}
		}
	}

    
}