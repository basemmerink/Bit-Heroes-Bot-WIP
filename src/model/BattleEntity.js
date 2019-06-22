const {SFSObject, SFSString, SFSArray, SFSBoolean, SFSInt, SFSFloat, SFSLong, SFSByteArray, SFSBooleanArray, SFSIntArray, SFSLongArray} = require('../data/DataTypes');

class BattleEntity extends SFSObject {
    constructor(attacker, dungeonEntity, index, controller) {
        super();

        this.attacker = attacker;
        this.index = index;

        this.dungeonEntity = dungeonEntity;
        this.id = dungeonEntity.id;
        this.type = dungeonEntity.type;
        this.power = dungeonEntity.power || 10;
        this.stamina = dungeonEntity.stamina || 10;
        this.agility = dungeonEntity.agility || 10;
        this.health = dungeonEntity.health || 100;
        this.maxHealth = dungeonEntity.maxHealth || 100;
        this.sp = dungeonEntity.sp || 0;
        this.consumables = dungeonEntity.consumables || 0;
        this.shield = dungeonEntity.shield || 0;
        this.maxShield = dungeonEntity.maxShield || 50;
        this.enrage = dungeonEntity.enrage || 0;

        if (this.type == 2) {
            this.familiarId = dungeonEntity.familiarId;
        }

        if (typeof controller !== "undefined") {
            this.controller = controller.id;
        }

        this.cooldown = 0;
        this.abilityData = [];
    }

    getTurnrate() {
        return Math.pow((this.agility + this.power) / 2, 2) / (100 * this.power);
    }

    set attacker(_attacker) {
        let attacker = new SFSBoolean(_attacker);
        this.setProperty("bat14", attacker);
    }

    get id() {
        return this.getProperty("bat5");
    }

    set id(_id) {
        let id = new SFSInt(_id);
        this.setProperty("bat5", id);
    }

    get type() {
        return this.getProperty("bat6");
    }

    set type(_type) {
        let type = new SFSInt(_type);
        this.setProperty("bat6", type);
    }

    get index() {
        return this.getProperty("bat7");
    }

    set index(_index) {
        let index = new SFSInt(_index);
        this.setProperty("bat7", index);
    }

    get power() {
        return this.getProperty("bat8");
    }

    set power(_power) {
        let power = new SFSInt(_power);
        this.setProperty("bat8", power);
    }

    get stamina() {
        return this.getProperty("bat9");
    }

    set stamina(_stamina) {
        let stamina = new SFSInt(_stamina);
        this.setProperty("bat9", stamina);
    }

    get agility() {
        return this.getProperty("bat10");
    }

    set agility(_agility) {
        let agility = new SFSInt(_agility);
        this.setProperty("bat10", agility);
    }

    get health() {
        return this.getProperty("bat11");
    }

    set health(_health) {
        let health = new SFSInt(_health);
        this.setProperty("bat11", health);
        this.dungeonEntity.health = _health;
    }

    get maxHealth() {
        return this.getProperty("bat12");
    }

    set maxHealth(_maxHealth) {
        let maxHealth = new SFSInt(_maxHealth);
        this.setProperty("bat12", maxHealth);
    }

    get cooldown() {
        return this.getProperty("bat15");
    }

    set cooldown(_cooldown) {
        let cooldown = new SFSLong(_cooldown);
        this.setProperty("bat15", cooldown);
    }

    get abilities() {
        return this.getProperty("bat27");
    }

    set abilities(_abilities) {
        let abilities = new SFSIntArray(_abilities);
        this.setProperty("bat27", abilities);
    }

    get controller() {
        return this.getProperty("bat28");
    }

    set controller(_controller) {
        let controller = new SFSInt(_controller); // attacker team == player id
        this.setProperty("bat28", controller);
    }

    get sp() { // 10000 sp is 1 sp
        return this.getProperty("bat30");
    }

    set sp(_sp) {
        let sp = new SFSInt(_sp);
        this.setProperty("bat30", sp);
        this.dungeonEntity.sp = _sp;
    }

    get consumables() {
        return this.getProperty("bat32");
    }

    set consumables(_consumables) {
        let consumables = new SFSInt(_consumables);
        this.setProperty("bat32", consumables);
        this.dungeonEntity.consumables = _consumables;
    }

    get familiarId() {
        return this.getProperty("bat35");
    }

    set familiarId(_familiarId) {
        let familiarId = new SFSInt(_familiarId);
        this.setProperty("bat35", familiarId);
    }

    get shield() {
        return this.getProperty("bat51");
    }

    set shield(_shield) {
        let shield = new SFSInt(_shield);
        this.setProperty("bat51", shield);
        this.dungeonEntity.shield = shield;
    }

    get maxShield() {
        return this.getProperty("bat52");
    }

    set maxShield(_maxShield) {
        let maxShield = new SFSInt(_maxShield);
        this.setProperty("bat52", maxShield);
    }

    get enrage() {
        return this.getProperty("bat56");
    }

    set enrage(_enrage) {
        let enrage = new SFSInt(_enrage);
        this.setProperty("bat56", enrage);
        this.dungeonEntity.enrage = _enrage;
    }

    set abilityData(_abilityData) {
        let abilityData = new SFSArray(_abilityData);
        this.setProperty("bat59", abilityData);
    }

    /*
        bat59: new SFSArray([
            new SFSObject({
                bat22: new SFSInt(1), // id
                bat60: new SFSInt(0) // uses (for mounts)
            })
        ])// battle ability data list
     */
}

module.exports = BattleEntity;