const {DataTypes, SFSObject, SFSString, SFSArray, SFSBoolean, SFSInt, SFSLong, SFSByteArray, SFSBooleanArray, SFSIntArray, SFSLongArray} = require('../data/DataTypes');

const ConsumableBook = require('../books/ConsumableBook');
const CraftBook = require('../books/CraftBook');
const EquipmentFactory = require('../factories/EquipmentFactory');

const DALC_ID = 7;
const actions = {
    SHOP_PURCHASE: 1,
    ITEM_CONTENTS: 3,
    ITEM_UPGRADE: 4,
    EXCHANGE_ITEM: 5,
};

class MerchantDalc extends require('./Dalc') {

    constructor() {
        super(DALC_ID);
        this.actions = {
            1: this.handleShopPurchase,
            3: this.itemContents,
            4: this.itemUpgrade,
            5: this.exchangeItem
        }
    }

    handleShopPurchase(client, recv) {
        let packet = this.createPacket(client, actions.SHOP_PURCHASE);
        let message = packet.getMessage();

        let itemId = recv.getProperty("ite0"); // 177, 4, 1
        let type = recv.getProperty("ite1");
        let qty = recv.getProperty("ite2");

        let consumable = ConsumableBook.consumable.filter(c=>c.$.id == itemId)[0];
        let item;

        let char = client.character;

        if (consumable.$.type == 'loot') {
            item = char.giveItem(549, 1, 1);
        } else {
            item = char.giveItem(itemId, type, qty);
        }

        message.setProperty("ite3", new SFSArray([
            item
        ]));
        message.setProperty("ite0", new SFSInt(itemId));
        message.setProperty("ite1", new SFSInt(type));

        client.send(packet);
    }

    itemContents(client, recv) {
        let packet = this.createPacket(client, actions.ITEM_CONTENTS);
        let message = packet.getMessage();

        client.send(packet);
    }

    itemUpgrade(client, recv) {
        let packet = this.createPacket(client, actions.ITEM_UPGRADE);
        let message = packet.getMessage();

        let id = recv.getProperty("ite0");
        let type = recv.getProperty("ite1");
        let craftIndex = recv.getProperty("cra0");

        if (type == 1) { // equip
            let equip = EquipmentFactory.getEquip(id);
            let metaData = equip.upgrade[craftIndex].$;

            let newEquip = parseInt(metaData.id);
            let requirements = CraftBook.getUpgradeRequirements(metaData.link);

            if (requirements.every(req => client.character.hasItem(req.id, req.type, req.quantity))) {
                let equipIndex = client.character.equipment.indexOf(id);
                if (equipIndex > -1) {
                    client.character.equipment[equipIndex] = newEquip;
                    message.setProperty("cha17", new SFSIntArray(client.character.equipment));
                    message.setProperty("cha64", new SFSIntArray(client.character.cosmetics));
                }
                message.setProperty("ite4", new SFSObject({
                    ite3: new SFSArray([client.character.giveItem(newEquip, type, 1)])
                }));
                message.setProperty("ite5", new SFSObject({
                    ite3: new SFSArray([
                        client.character.giveItem(id, type, -1),
                        ...requirements.map(req => client.character.giveItem(req.id, req.type, -req.quantity))
                    ])
                }));
            } else {
                console.log(requirements.map(req => client.character.hasItem(req.id, req.type, req.quantity)));
                message.setProperty("err0", new SFSInt(98));
            }
        } else {
            console.log('no equip?');
            message.setProperty("err0", new SFSInt(98));
        }

        client.send(packet);
    }

    exchangeItem(client, recv) {
        let packet = this.createPacket(client, actions.EXCHANGE_ITEM);
        let message = packet.getMessage();

        let items = recv.getProperty("ite3");
        let materials = {};

        let char = client.character;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            let id = item.getProperty("ite0");
            let type = item.getProperty("ite1");
            let quantity = item.getProperty("ite2");
            char.giveItem(id, type, -quantity);

            let amount = Math.round(Math.random() * quantity) + 2 * quantity;
            switch (EquipmentFactory.getBaseEquip(id).$.rarity) {
                case "generic":
                    materials[4] = materials[4] || 0;
                    materials[4]++;
                    break;
                case "common":
                    materials[4] = materials[4] || 0;
                    materials[4] += amount;
                    break;
                case "rare":
                    materials[5] = materials[5] || 0;
                    materials[5] += amount;
                    break;
                case "epic":
                    materials[6] = materials[6] || 0;
                    materials[6] += quantity;
                    break;
                default:
                    console.log(EquipmentFactory.getEquip(id));
            }
        }

        message.setProperty("ite4", new SFSObject({
            ite3: new SFSArray(Object.keys(materials).map(mat => char.giveItem(mat, 2, materials[mat])))
        }));
        message.setProperty("ite5", new SFSObject({
            ite3: recv.getProperty("ite3", true)
        }));

        client.send(packet);
    }

}

module.exports = new MerchantDalc();