const {SFSObject, SFSArray, SFSInt, SFSLong} = require('./../data/DataTypes');

class MountData extends SFSObject {
    constructor() {
        super();
        this.mountList = [];
        this.mountEquipped = 0;
        this.mountCosmetic = 0;
    }

    get mountList() {
        return this.getProperty("moun3");
    }

    set mountList(_mountList) {
        let mountList = new SFSArray(_mountList);
        this.setProperty("moun3", mountList);
    }

    get mountEquipped() {
        return this.getProperty("moun6");
    }

    set mountEquipped(_mountEquipped) {
        let mountEquipped = new SFSLong(_mountEquipped);
        this.setProperty("moun6", mountEquipped);
    }

    get mountCosmetic() {
        return this.getProperty("moun11");
    }

    set mountCosmetic(_mountCosmetic) {
        let mountCosmetic = new SFSInt(_mountCosmetic);
        this.setProperty("moun11", mountCosmetic);
    }
}

module.exports = MountData;