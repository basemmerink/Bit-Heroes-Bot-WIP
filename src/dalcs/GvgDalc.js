const {DataTypes, SFSObject, SFSString, SFSArray, SFSBoolean, SFSInt, SFSLong, SFSByteArray, SFSBooleanArray, SFSIntArray, SFSLongArray} = require('../data/DataTypes');

const DALC_ID = 13;
const actions = {
    LOOT_EVENT: 5
};

class GvgDalc extends require('./Dalc') {

    constructor() {
        super(DALC_ID);
        this.actions = {
            5: this.lootEvent,
        }
    }

    lootEvent(client, recv) {
        let packet = this.createPacket(client, actions.LOOT_EVENT);
        let message = packet.getMessage();

        //let eventId = recv.getProperty("eve0");

        let developerFlag = new SFSObject();
        developerFlag.setProperty("ite0", new SFSInt(517)); // id
        developerFlag.setProperty("ite1", new SFSInt(1)); // type (eq is 1)
        developerFlag.setProperty("ite2", new SFSInt(1)); // qty

        message.setProperty("eve0", new SFSInt(-1));
        message.setProperty("ite3", new SFSArray([
            new SFSObject({
                ite0: new SFSInt(517), // developer flag
                ite1: new SFSInt(1), // equipment
                ite2: new SFSInt(1) // quantity
            }),
            new SFSObject({
                ite0: new SFSInt(20740), // developer flag
                ite1: new SFSInt(1), // equipment
                ite2: new SFSInt(1) // quantity
            })
        ])); // items

        client.send(packet);
    }

}

module.exports = new GvgDalc();