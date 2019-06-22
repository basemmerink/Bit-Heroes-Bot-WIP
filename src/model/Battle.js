const {SFSObject, SFSString, SFSArray, SFSBoolean, SFSInt, SFSFloat, SFSLong, SFSByteArray, SFSBooleanArray, SFSIntArray, SFSLongArray} = require('../data/DataTypes');

const AbilityBook = require('../books/AbilityBook');

const CharacterFactory = require('../factories/CharacterFactory');
const BattleEntity = require('./BattleEntity');

class Battle extends SFSObject {
    constructor() {
        super();
        this.id = Math.floor(Math.random() * 100000);
        this.replay = false;
        this.active = true;
        this.allowSwitch = true;
        this.attackerData = [1, 1];
        this.defenderData = [1, 1];

        this.attackers = [];
        this.defenders = [];
        this.entities = [];

        this.queue = [];
    }

    addAttacker(dungeonEntity, controller) {
        let entity = new BattleEntity(true, dungeonEntity, controller.id, [0]);
        if (entity.type == 1) {
            let player = CharacterFactory.getCharacterById(entity.id);
            entity.inherit(player.getCharacterData());
            entity.abilities = player.abilities;
        }
        this.attackers.push(entity);
        this.entities.push(entity);
    }

    addDefender(npc) {
        let entity = new BattleEntity(false, npc, 0, [0]);
        this.defenders.push(entity);
        this.entities.push(entity);
    }

    addEntity(dungeonEntity, index, controller) {
        let attacker = typeof controller !== "undefined";
        let entity = new BattleEntity(attacker, dungeonEntity, index, controller);
        switch (dungeonEntity.type) {
            case 1: // player
                let player = CharacterFactory.getCharacterById(entity.id);
                entity.inherit(player.getCharacterData());
                entity.abilities = player.abilities;
                break;
            case 2: // npc
            case 3: // fam
                entity.abilities = [0];
                break;
        }
        this.entities.push(entity);

        if (attacker) {
            this.attackers.push(entity);
        } else {
            this.defenders.push(entity);
        }
    }

    calculateTurnCounter() {
        this.turnCounter = 0;
        this.entities.forEach(entity => this.turnCounter += entity.getTurnrate());
    }

    getFirstAttacker() {
        let fastestEntity = this.entities.reduce((a,b) => a.getTurnrate() > b.getTurnrate() ? a : b);

        this.turn = fastestEntity;

        return fastestEntity.index;
    }

    emptyQueue() {
        this.queue = [];
    }

    ability(abilityId, targetIndex) {
        let index = this.turn.index;

        this.queueAbility(index, abilityId, this.entities[index].sp);

        let ability = AbilityBook.ability[abilityId];
        let action = ability.action[0].$;

        let power = Math.ceil(this.entities[index].power * action.value / 100); // power * ability modifier (100% for 0sp attack)

        let targets = this.getTargetsForSkill(action.target, targetIndex);

        for (let i = 0; i < targets.length; i++) {
            let target = targets[i];
            let dmg = Math.ceil(power * (0.9 + (Math.random() * 0.2))); // 90% - 110%

            target.health = Math.max(0, target.health - dmg);
            this.queueHealthChange(target.index, target.health, -dmg, dmg);

            if (target.health == 0) {
                this.queueRemoveEntity(target.index);
            }
        }

        this.queueTurnEnd(index);

        if (this.getAlive(false).length == 0) {
            this.queueComplete();
        }
    }

    queueAbility(entityIndex, ability, newSP) {
        this.queue.push(new SFSObject({
            act0: new SFSInt(6), // ability
            bat7: new SFSInt(entityIndex),
            bat22: new SFSInt(ability),
            // bat30: new SFSInt(newSP),
            bat30: new SFSInt(40000),
            bat31: new SFSBoolean(false) // proc
        }));
    }

    queueHealthChange(entityIndex, newHealth, healthChange, value) {
        this.queue.push(new SFSObject({
            act0: new SFSInt(2), // health change
            bat7: new SFSInt(entityIndex), // index
            bat11: new SFSInt(newHealth), // health
            bat13: new SFSInt(healthChange), // health change
            bat16: new SFSInt(value), // entity value? (the text that will show up)
            bat51: new SFSInt(0), // shield
            bat53: new SFSInt(0), // shield change
        }));
    }

    queueRemoveEntity(entityIndex) {
        this.queue.push(new SFSObject({
            act0: new SFSInt(18), // remove entities
            bat2: new SFSIntArray([entityIndex])
        }));
    }

    queueTurnEnd(entityIndex) {
        this.queue.push(new SFSObject({
            act0: new SFSInt(8), // turn end
            bat7: new SFSInt(entityIndex), // index
            bat62: new SFSBoolean(false), // turn completed
        }));
    }

    queueComplete() {
        this.queue.push(new SFSObject({
            act0: new SFSInt(10) // complete
        }));
    }

    queueVictory(character, items) {
        this.queue.push(new SFSObject({
            act0: new SFSInt(11), // victory
            bat5: new SFSInt(character.id),
            cha5: new SFSLong(character.exp),
            cha9: new SFSInt(character.gold),
            cha4: new SFSInt(character.level),
            cha19: new SFSInt(character.statpoints),
            ite3: new SFSArray(items)
        }));
    }

    queueQuit(character) {
        this.queue.push(new SFSObject({
            act0: new SFSInt(12), // defeat
            bat5: new SFSInt(character.id)
        }));
    }

    getQueue() {
        return this.queue;
    }

    getAlive(attackingTeam) {
        let team = attackingTeam ? this.attackers : this.defenders;
        return team.filter(member => member.health > 0);
    }

    getTargetsForSkill(target, targetIndex) {
        switch(target) {
            case 'enemyteam':
                return this.defenders;
            case 'selfteam':
                return this.attackers;
            case 'select':
                return [this.entities[targetIndex]];
            case 'enemyweakest':
                return [this.getWeakestTarget(false)];
            case 'enemystrongest':
                return [this.getStrongestTarget(false)];
            case 'enemyfront':
                return [this.getFrontTarget(false)];
            case 'enemyback':
                return [this.getBackTarget(false)];
            default:
                console.log('UNKNOWN BATTLE TARGET ' + target, targetIndex);
                return [this.getFrontTarget(false)];
        }
    }

    getFrontTarget(attackingTeam) {
        let alive = this.getAlive(attackingTeam);
        if (attackingTeam) {
            return alive[alive.length - 1];
        } else {
            return alive[0];
        }
    }

    getBackTarget(attackingTeam) {
        let alive = this.getAlive(attackingTeam);
        if (attackingTeam) {
            return alive[0];
        } else {
            return alive[alive.length - 1];
        }
    }

    getWeakestTarget(attackingTeam) {
        let alive = this.getAlive(attackingTeam);
        let weakest;
        let weakestHealth = 1e9;
        for (let i = 0; i < alive.length; i++) {
            if (weakestHealth > alive[i].health) {
                weakestHealth = alive[i].health;
                weakest = alive[i];
            }
        }
        return weakest;
    }

    getStrongestTarget(attackingTeam) {
        let alive = this.getAlive(attackingTeam);
        let strongest;
        let strongestHealth = -1;
        for (let i = 0; i < alive.length; i++) {
            if (strongestHealth < alive[i].health) {
                strongestHealth = alive[i].health;
                strongest = alive[i];
            }
        }
        return strongest;
    }




    set id(_id) {
        let id = new SFSInt(_id);
        this.setProperty("bat0", id);
    }

    get type() {
        return this.getProperty("bat1");
    }

    set type(_type) {
        let type = new SFSInt(_type);
        this.setProperty("bat1", type);
    }

    get entities() {
        return this.getProperty("bat2");
    }

    set entities(_entities) {
        let entities = new SFSArray(_entities);
        this.setProperty("bat2", entities);
    }

    get queue() {
        return this.getProperty("bat3");
    }

    set queue(_queue) {
        let queue = new SFSArray(_queue);
        this.setProperty("bat3", queue);
    }

    set replay(_replay) {
        let replay = new SFSBoolean(_replay);
        this.setProperty("bat20", replay);
    }

    set active(_active) {
        let active = new SFSBoolean(_active);
        this.setProperty("bat29", active);
    }

    set isBoss(_isBoss) {
        let isBoss = new SFSBoolean(_isBoss);
        this.setProperty("bat37", isBoss);
    }

    get allowSwitch() {
        return this.getProperty("bat39");
    }

    set allowSwitch(_allowSwitch) {
        let allowSwitch = new SFSBoolean(_allowSwitch);
        this.setProperty("bat39", allowSwitch);
    }

    get attackerData() {
        let data = this.getProperty("bat42");
        return [data.getProperty("bat45"), data.getProperty("bat46")];
    }

    set attackerData(_attackerData) {
        this.setProperty("bat42", new SFSObject({
            bat44: new SFSBoolean(true),
            bat45: new SFSInt(_attackerData[0]),
            bat46: new SFSInt(_attackerData[1])
        }));
    }

    get defenderData() {
        let data = this.getProperty("bat43");
        return [data.getProperty("bat45"), data.getProperty("bat46")];
    }

    set defenderData(_attackerData) {
        this.setProperty("bat43", new SFSObject({
            bat44: new SFSBoolean(false),
            bat45: new SFSInt(_attackerData[0]),
            bat46: new SFSInt(_attackerData[1])
        }));
    }

    /*
        message.setProperty("bat2", new SFSArray([entityPlayer, entityBoss])); // battle entities
        message.setProperty("bat3", new SFSArray([
            new SFSObject({
                act0: new SFSInt(7), // action (7=turn start)
                bat7: new SFSInt(0), // entity index
            }),
        ])); // battle queue
     */
}


module.exports = Battle;