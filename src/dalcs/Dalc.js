const {SFSInt, SFSString, SFSObject} = require('../data/DataTypes');

class Dalc {
    constructor(id) {
        this.id = id;
        this.actions = {};
    }

    getId() {
        return this.id;
    }

    createPacket(client, action) {
        let packet = client.createPacket(1, 13);

        let obj = new SFSObject();
        obj.setProperty("dal0", new SFSInt(this.getId()));
        obj.setProperty("act0", new SFSInt(action));

        packet.setProperty("c", new SFSString("ServerExtension"));
        packet.setProperty("r", new SFSInt(-1)); // room id, looks like -1 works just fine
        packet.setProperty("p", obj);

        return packet;
    }

    handle(client, recv, action) {
        if (this.actions[action]) {
            this.actions[action].call(this, client, recv);
        }
    }

}

module.exports = Dalc;