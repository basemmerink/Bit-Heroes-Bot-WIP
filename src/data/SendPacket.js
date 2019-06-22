let {SFSObject, SFSByte, SFSShort} = require('./DataTypes');

class SendPacket {
    constructor(controller, action) {
        this.content = new SFSObject();

        this.content.setProperty("c", new SFSByte(controller));
        this.content.setProperty("a", new SFSShort(action));
        this.content.setProperty("p", new SFSObject());
    }

    serialize() {
        return this.content.serialize();
    }

    getMessage() {
        return this.getProperty("p");
    }

    getProperty(key) {
        return this.content.getProperty("p").getProperty(key);
    }

    setProperty(key, value) {
        this.content.getProperty("p").setProperty(key, value);
    }

}

module.exports = SendPacket;