const {SFSObject, SFSArray, SFSLongArray} = require('./../data/DataTypes');

class EnchantData extends SFSObject {
    constructor() {
        super();
        this.enchantIds = [0, 0, 0, 0, 0, 0];
        this.enchants = [];
    }

    get enchants() {
        return this.getProperty("ench7");
    }

    set enchants(_enchants) {
        let enchants = new SFSArray(_enchants);
        this.setProperty("ench7", enchants);
    }

    get enchantIds() {
        return this.getProperty("ench8");
    }

    set enchantIds(_enchantIds) {
        let enchantIds = new SFSLongArray(_enchantIds);
        this.setProperty("ench8", enchantIds);
    }
}

module.exports = EnchantData;