const DiscordAPI = require('../DiscordAPI');

const DALC_ID = 6;

class LeaderboardDalc extends require('./Dalc') {

    constructor() {
        super(DALC_ID);
        this.actions = {
            1: this.handleLeaderboard
        }
    }

    handleLeaderboard(client, recv) {
        let type = recv.getProperty("lea0");
        switch (type) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                this.handleLeaderboardDalcLevel(recv.getProperty("lea4"));
                break;
        }
    }

    handleLeaderboardDalcLevel(playerArray) {
        DiscordAPI.sendLeaderboard(playerArray.map(player => {
            return {
                rank: player.getProperty("lea2"),
                guild: player.getProperty("gui3"),
                name: player.getProperty("lea7"),
                level: player.getProperty("lea3")
            }
        }))
    }

    requestLeaderboard(client, type) {
        let packet = this.createPacket(client, 1);
        let message = packet.getMessage();

        message.setProperty("lea0", new SFSInt(type));

        client.send(packet);
    }

}

module.exports = new LeaderboardDalc();