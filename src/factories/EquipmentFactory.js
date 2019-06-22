const EquipmentBook = require('../books/EquipmentBook');

class EquipmentFactory {

    constructor() {
        this.equipment = {};
        this.zoneDrops = [];
        this.shopEquips = [];
        this.accessories = [];
        this.pets = [];
    }

    async init() {
        console.log('initializing equipment factory');
        let allEquips = EquipmentBook.equipment;

        for (let i = 0; i < allEquips.length; i++) {
            let equip = allEquips[i];
            this.equipment[equip.$.id] = equip;

            if (equip.$.type == "accessory") {
                this.accessories.push(equip);
                continue;
            } else if (equip.$.type == "pet") {
                this.pets.push(equip);
                continue;

            }

            if (!equip.$.tier || equip.$.assetsOverride) {
                continue;
            }

            let tier = parseInt(equip.$.tier) - 1;
            if (!this.zoneDrops[tier]) {
                this.zoneDrops[tier] = [];
            }
            if (!this.shopEquips[tier]) {
                this.shopEquips[tier] = [];
            }

            if (allEquips.filter(e => e.$.assetsSourceID == equip.$.id).length == 0 && equip.$.icon && equip.$.icon.indexOf('Balanced') == -1) {
                this.zoneDrops[tier].push(equip);
            } else {
                this.shopEquips[tier].push(equip);
            }
        }
    }

    getBaseEquip(id) {
        while (!this.equipment[id].$.type) {
            id--;
        }
        return this.equipment[id];
    }

    getEquip(id) {
        return this.equipment[id];
    }

    getZoneEquips(zoneId) {
        return this.zoneDrops[zoneId - 1];
    }
}

module.exports = new EquipmentFactory();