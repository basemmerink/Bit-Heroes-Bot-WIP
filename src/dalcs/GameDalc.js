const {DataTypes, SFSObject, SFSString, SFSArray, SFSBoolean, SFSInt, SFSLong, SFSByteArray, SFSBooleanArray, SFSIntArray, SFSLongArray} = require('../data/DataTypes');

const Dalc = require('./Dalc');
const GuildDalc = require('./GuildDalc');

const DALC_ID = 0;

class GameDalc extends Dalc {

    constructor() {
        super(DALC_ID);
        this.actions = {
            2: this.enterInstance,
            7: this.requestPlayersOnline
        }
    }

    enterInstance(client, recv) {
        GuildDalc.requestContribution(client);
    }

    requestPlayersOnline(client, recv) {
        let packet = this.createPacket(client, 7);
        let message = packet.getMessage();

        message.setProperty("act4", new SFSBoolean(true));
        message.setProperty("use2", new SFSInt(4));
        message.setProperty("use3", new SFSString(process.env.BH_USERID));
        message.setProperty("use4", new SFSString(process.env.BH_PASSWORD_TOKEN));
        message.setProperty("use7", new SFSString("Mac OS 10.13.4")); // does this even matter lol
        message.setProperty("use9", new SFSString(""));
        message.setProperty("cha31", new SFSInt(4));

        client.send(packet);
    }

}

module.exports = new GameDalc();