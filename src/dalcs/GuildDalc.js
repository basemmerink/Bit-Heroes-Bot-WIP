const {DataTypes, SFSObject, SFSString, SFSArray, SFSBoolean, SFSInt, SFSLong, SFSByteArray, SFSBooleanArray, SFSIntArray, SFSLongArray} = require('../data/DataTypes');

const DALC_ID = 9;

class GuildDalc extends require('./Dalc') {

    constructor() {
        super(DALC_ID);
        this.actions = {
            33: this.handleContribution
        }
    }

    handleContribution(client, recv) {
        console.log(recv);
        let membersArray = recv.getProperty("gui5");
        membersArray.forEach(memberObject => {
            let name = memberObject.getProperty("cha2").toLowerCase();
            console.log(name, memberObject.getProperty("gui8"));
        });
    }

    requestContribution(client) {
        let packet = this.createPacket(client, 33);
        let message = packet.getMessage();

        message.setProperty("use8", new SFSString("en")); // language

        client.send(packet);
    }

}

module.exports = new GuildDalc();