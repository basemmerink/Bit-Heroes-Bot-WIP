const GameDalc = require('../dalcs/GameDalc');
const CharacterDalc = require('../dalcs/CharacterDalc');
const UserDalc = require('../dalcs/UserDalc');
const LeaderboardDalc = require('../dalcs/LeaderboardDalc');
const MerchantDalc = require('../dalcs/MerchantDalc');
const ChatDalc = require('../dalcs/ChatDalc');
const GuildDalc = require('../dalcs/GuildDalc');
const GvgDalc = require('../dalcs/GvgDalc');

class DalcHandler {

    constructor() {
        this.dalcs = {
            0: GameDalc,
            1: CharacterDalc,
            4: UserDalc,
            6: LeaderboardDalc,
            7: MerchantDalc,
            8: ChatDalc,
            9: GuildDalc,
            13: GvgDalc,
        };
    }

    handle(client, message) {
        let dalc = message.getProperty("p");
        let dalcId = dalc.getProperty("dal0");
        let dalcAction = dalc.getProperty("act0");

        if (this.dalcs[dalcId]) {
            this.dalcs[dalcId].handle(client, dalc, dalcAction);
        }
    }
}

module.exports = new DalcHandler();