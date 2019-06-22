const {SFSObject, SFSString, SFSArray, SFSBoolean, SFSInt, SFSFloat, SFSLong, SFSByteArray, SFSBooleanArray, SFSIntArray, SFSLongArray} = require('../data/DataTypes');

const EnchantData = require('./EnchantData');
const MountData = require('./MountData');

const EquipmentFactory = require('../factories/EquipmentFactory');
const AbilityBook = require('../books/AbilityBook');

class Character extends SFSObject {

    constructor(client) {
        super();

        this.client = client;
        this.attacks = 0;
        this.online = false;
    }

    getSFSObject() {
        return new SFSObject({
            cha1: new SFSInt(this.id),
            cha2: new SFSString(this.name),
            cha4: new SFSInt(this.level),
            cha5: new SFSLong(this.exp),
            cha6: new SFSInt(this.power),
            cha7: new SFSInt(this.stamina),
            cha8: new SFSInt(this.agility),
            cha9: new SFSInt(this.gold),
            cha10: new SFSInt(this.gems),
            cha11: new SFSBooleanArray(this.tutorial),
            cha12: new SFSString(this.gender),
            //cha13: new SFSArray(this.getSFSFriends()),
            //cha14: new SFSArray(this.getSFSFriendRequests()),
            cha15: new SFSBoolean(this.admin),
            cha16: new SFSArray(this.getSFSInventory()),
            cha17: new SFSIntArray(this.equipment),
            cha19: new SFSInt(this.statpoints),
            cha20: new SFSInt(this.hair),
            cha21: new SFSInt(this.hairColor),
            cha22: new SFSInt(this.skinColor),
            cha23: new SFSArray(this.zones),
            cha24: new SFSInt(this.zoneId),
            cha25: new SFSInt(this.dailyRewardId),
            cha26: new SFSString(this.dailyRewardDate),
            cha27: new SFSInt(this.energy),
            cha28: new SFSLong(this.energyMilliseconds),
            cha29: new SFSInt(this.tickets),
            cha30: new SFSLong(this.ticketMilliseconds),
            cha31: new SFSInt(this.platform),
            cha32: new SFSBoolean(this.autopilot),
            cha33: new SFSArray(this.getSFSModifiers()),
            cha34: new SFSBoolean(this.moderator),
            cha35: new SFSBoolean(this.chatEnabled),
            cha36: new SFSInt(this.chatChannel),
            cha37: new SFSArray(this.chatIgnores),
            cha38: new SFSInt(this.chatMuteTime),
            cha39: new SFSInt(this.chatMuteReason),
            cha40: new SFSBoolean(this.friendRequestsEnabled),
            cha41: new SFSInt(this.shopRotationId),
            cha42: new SFSLong(this.shopRotationMilliseconds),
            cha44: new SFSLong(this.loginMilliseconds),
            cha48: new SFSBoolean(this.showHelm),
            cha49: new SFSInt(this.chatMutes),
            cha50: new SFSInt(this.pveWins),
            cha51: new SFSInt(this.pveLosses),
            cha52: new SFSInt(this.pvpWins),
            cha53: new SFSInt(this.pvpLosses),
            cha54: new SFSInt(this.dungeonsCompleted),
            cha55: new SFSInt(this.raidsCompleted),
            cha56: new SFSLong(this.damageGiven),
            cha57: new SFSLong(this.damageReceived),
            cha58: new SFSLong(this.healingGiven),
            cha59: new SFSLong(this.healingReceived),
            cha60: new SFSInt(this.consumablesUsed),
            cha61: new SFSInt(this.enemiesKilled),
            cha62: new SFSArray(this.teams),
            cha63: new SFSLong(this.loginSeconds),
            cha64: new SFSIntArray(this.cosmetics),
            cha65: new SFSLong(this.adMilliseconds),
            cha67: new SFSInt(this.shards),
            cha68: new SFSLong(this.shardsMilliseconds),
            cha69: new SFSInt(this.duelWins),
            cha70: new SFSInt(this.duelLosses),
            cha71: new SFSInt(this.tokens),
            cha72: new SFSLong(this.tokensMilliseconds),
            cha73: new SFSBoolean(this.chatMuted),
            cha74: new SFSIntArray(this.platforms),
            cha75: new SFSString(this.nbpDate),
            cha76: new SFSString(this.createDate),
            cha77: new SFSString(this.loginDate),
            cha78: new SFSInt(this.creditsPurchased),
            cha79: new SFSInt(this.creditsSpent),
            cha80: new SFSInt(this.dollarsSpent),
            cha82: new SFSBoolean(this.duelRequestsEnabled),
            cha83: new SFSInt(this.badges),
            cha84: new SFSLong(this.badgesMilliseconds),
            cha85: new SFSInt(this.gvgWins),
            cha86: new SFSInt(this.gvgLosses),
            cha87: new SFSInt(this.gauntletsCompleted),
            cha88: new SFSInt(this.trialsCompleted),
            cha90: new SFSInt(this.invasionsCompleted),
            cha91: new SFSLong(this.updateMilliseconds),
            cha92: new SFSBoolean(this.banned),
            cha93: new SFSBoolean(this.showMount),
            cha94: new SFSInt(this.zoneCompleted),
            //cha95: new SFSObject(this.lockedItems),
            cha96: new SFSString(this.dailyFishingDate)
        });
    }

    getCharacterData() {
        return new SFSObject({
            cha1: new SFSInt(this.id),
            cha2: new SFSString(this.name),
            cha4: new SFSInt(this.level),
            cha6: new SFSInt(this.power),
            cha7: new SFSInt(this.stamina),
            cha8: new SFSInt(this.agility),
            cha12: new SFSString(this.gender),
            cha17: new SFSIntArray(this.equipment),
            cha20: new SFSInt(this.hair),
            cha21: new SFSInt(this.hairColor),
            cha22: new SFSInt(this.skinColor),
            cha48: new SFSBoolean(this.showHelm),
            cha64: new SFSIntArray(this.cosmetics),
            cha93: new SFSBoolean(this.showMount),
            cha94: new SFSInt(this.zoneCompleted),
            run0: new SFSIntArray(this.runes),

            ench0: this.enchantData,
            moun0: this.mountData,
            gui0: new SFSInt(this.guildId),
            gui2: new SFSString(this.guildName),
            gui3: new SFSString(this.guildTag)
        });
    }

    getSFSInventory() {
        return Object.keys(this.inventory).reduce((arr, type) => {
            Object.keys(this.inventory[type]).forEach(item => {
                arr.push(new SFSObject({
                    ite0: new SFSInt(item),
                    ite1: new SFSInt(type),
                    ite2: new SFSInt(this.inventory[type][item])
                }));
            });
            return arr;
        }, []);
    }

    getSFSModifiers() {
        return this.consumableModifiers.map(modifier => new SFSObject({
            ite0: new SFSInt(modifier[0]),
            ite7: new SFSLong(modifier[1] - (Date.now() - modifier[2]))
        }));
    }

    async save() {
        let ret = await this.model.save();
        return ret;
    }

    init(model) {
        this.model = model;
        this.runes = [0, 0, 0, 0, 0, 0, 0];
        this.enchantData = new EnchantData();
        this.mountData = new MountData();
        this.guildId = 1;
        this.guildName = "Developers";
        this.guildTag = "DEV";
        this.instanceTile = 2000;//1348; // 1 = 1348, 0 = 1500
        this.instanceSpeedMultiplier = 0;
        this.instanceFlipped = false;

        if (model) {
            this._id = model._id;
            Object.keys(model.toObject()).forEach(key => {
                if (key.startsWith('_')) {
                    return;
                }
                Object.defineProperty(this, key, {
                    get: function() {
                        return this.model[key];
                    },
                    set: function(val) {
                        this.model[key] = val;
                    }
                });
            });
        }

        this.updateEquipment();
    }

    isOnline() {
        return this.online;
    }

    updateEquipment() {
        this.updateTS();
        this.updateAbilities();
    }

    updateTS() {
        this.equipStats = [0, 0, 0];
        for (let i = 0; i < 6; i++) {
            let equip = EquipmentFactory.getEquip(this.equipment[i]);
            if (equip) {
                this.equipStats[0] += parseInt(equip.$.power || 0);
                this.equipStats[1] += parseInt(equip.$.stamina || 0);
                this.equipStats[2] += parseInt(equip.$.agility || 0);
            }
        }

        this.ts =
            this.getPower() +
            this.getStamina() +
            this.getAgility();
    }

    updateAbilities() {
        if (this.equipment[0] == 0) {
            this.abilities = [0];
            return;
        }
        let weapon = EquipmentFactory.getBaseEquip(this.equipment[0]);
        let abilities = AbilityBook.abilities.filter(a=>a.$.link == weapon.$.abilities)[0].$.links.split(',');
        let ability = AbilityBook.ability;
        this.abilities = [];
        for (let i = 0; i < ability.length; i++) {
            if (abilities.indexOf(ability[i].$.link) > -1) {
                this.abilities.push(i);
            }
        }
    }

    getPower() {
        return 1 + this.power + this.equipStats[0];
    }

    getStamina() {
        return 1 + this.stamina + this.equipStats[1];
    }

    getAgility() {
        return 1 + this.agility + this.equipStats[2];
    }

    hasItem(id, type, quantity) {
        type = this.translateItemType(type);
        if (type == 3) {
            return this.hasCurrency(id, quantity);
        }

        this.initInventory(type, id);
        return this.inventory[type][id] >= quantity;
    }

    giveItem(id, type, quantity) {
        type = this.translateItemType(type);
        if (type == 3) {
            this.addCurrency(id, quantity);
        } else {
            this.initInventory(type, id);
            this.inventory[type][id] += +quantity;

            this.model.markModified('inventory');
        }

        return new SFSObject({
            ite0: new SFSInt(id),
            ite1: new SFSInt(type),
            ite2: new SFSInt(Math.abs(quantity)) // always positive, even when taking items
        });
    }

    hasCurrency(type, quantity) {
        switch(type) {
            case 1:
                return this.gold >= quantity;
            case 2:
                return this.gems > quantity;
            case 3:
                return this.exp >= quantity;
            case 4:
                return this.energy >= quantity;
            case 5:
                return this.tickets >= quantity;
            case 6:
                return this.statpoints >= quantity;
            case 7:
                //return this.guildHonor >= quantity;
                break;
            case 8:
                return this.shards >= quantity;
            case 9:
                return this.tokens >= quantity;
            case 10:
                return this.badges >= quantity;
            case 11:
                //return this.guildPoints >= quantity;
                break;
        }
        return false;
    }

    addCurrency(type, quantity) {
        switch(type) {
            case 1:
                this.gold += quantity;
                break;
            case 2:
                this.gems += quantity;
                break;
            case 3:
                this.exp += quantity;
                break;
            case 4:
                this.energy += quantity;
                break;
            case 5:
                this.tickets += quantity;
                break;
            case 6:
                this.statpoints += quantity;
                break;
            case 7:
                //this.guildHonor += quantity;
                break;
            case 8:
                this.shards += quantity;
                break;
            case 9:
                this.tokens += quantity;
                break;
            case 10:
                this.badges += quantity;
                break;
            case 11:
                //this.guildPoints += quantity;
                break;
        }
    }

    initInventory(type, id) {
        if (!this.inventory[type]) {
            this.inventory[type] = {};
        }
        if (!this.inventory[type][id]) {
            this.inventory[type][id] = 0;
        }
    }

    addModifier(item, duration) {
        this.consumableModifiers.push([item, duration, Date.now()]);
        return new SFSObject({
            ite0: new SFSInt(item),
            ite7: new SFSLong(duration)
        })
    }

    translateItemType(type) {
        switch (type) {
            case 'equipment':
                return 1;
            case 'material':
                return 2;
            case 'currency':
                return 3;
            case 'consumable':
                return 4;
        }

        return type;
    }

}

module.exports = Character;