const Discord = require('discord.js');
const discordClient = new Discord.Client();


class DiscordAPI {

    init() {
        this.queue = [];

        discordClient.on('ready', this.ready.bind(this));
        discordClient.on('message', this.message.bind(this));
        discordClient.on('messageReactionAdd', this.messageReactionAdd.bind(this));

        discordClient.login(process.env.DISCORD_TOKEN);
    }

    ready() {
        // do nothing
    }

    message(message) {
        if (message.content.startsWith("!")) {
            this.handleCommand(message, message.content.slice(1));
        }
    }

    messageReactionAdd(messageReaction, user) {
        // do nothing (yet)
    }

    handleCommand(message, command) {
        let args = command.split(' ');

        let packet;
        switch (args[0]) {
            case "leaderboard":
                packet = this.requestLeaderboard(args);
                break;
            case "v":
                packet = this.viewProfile(args[1]);
                break;
        }

        if (packet) {
            let queuePos = this.addToQueue(message.channel.id, packet);
            discordClient.channels.get(message.channel.id).send("Added to queue at position #" + queuePos + ". Please hold on.");
        }
    }

    addToQueue(channelId, packet) {
        let pos = this.queue.push({
            channel: channelId,
            packet: packet
        });

        if (pos == 1) {
            this.handleQueue();
        }

        return pos;
    }

    handleQueue() {
        let task = this.queue[0];
        if (task) {
            this.client.send(task.packet);
        }
    }

    updateQueue(callback) {
        let task = this.queue.shift();
        if (task) {
            callback(task.channel);
            this.handleQueue();
        }
    }

    requestLeaderboard(args) {
        let leaderboardType = args.length > 1 ? parseInt(args[1]) : 0;

        let packet = this.client.createDalcPacket(6, 1);
        let message = packet.getMessage();

        message.setProperty("lea0", new SFSInt(leaderboardType));

        return packet;
    }

    sendLeaderboard(playerArray) {
        this.updateQueue(channelId => {
            let str = "\`\`\`";
            for (let i = 0; i < playerArray.length / 2; i++) {
                let player = playerArray[i];
                let add = `(${player.rank}) ${player.guild ? `[${player.guild}]` : ''} ${player.name} - ${player.level}`;
                add += " ".repeat(Math.max(34, add.length + 1) - add.length);

                player = playerArray[i+50];
                add += `(${player.rank}) ${player.guild ? `[${player.guild}]` : ''} ${player.name} - ${player.level}`;
                add += "\n";

                str += add;
                if (i % 25 == 24) {
                    discordClient.channels.get(channelId).send(str + '\`\`\`');
                    str = "\`\`\`";
                }
            }
        });

    }

    viewProfile(name) {
        if (!name) {
            return;
        }

        // TODO, view id 250836
        let packet = this.client.createDalcPacket(1, 9);
        let message = packet.getMessage();

        if (parseInt(name)) {
            message.setProperty("cha1", new SFSInt(parseInt(name)));
        } else {
            message.setProperty("cha1", new SFSInt(0));
            message.setProperty("cha2", new SFSString(name));
        }

        return packet;
    }

    sendViewProfile(data) {
        this.updateQueue(channelId => {
            let str = `**${data.name}**\nID: ${data.id}\n${data.guild ? `Guild: [${data.guild.tag}] ${data.guild.name}\n` : ''}Level: ${data.level}\nPower: ${data.power}, Stamina: ${data.stamina}, Agility: ${data.agility}`;
            discordClient.channels.get(channelId).send(str);
        });
    }

}

module.exports = new DiscordAPI();