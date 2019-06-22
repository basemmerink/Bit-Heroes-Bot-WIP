const {SFSObject, SFSString, SFSArray, SFSBoolean, SFSInt, SFSFloat, SFSLong, SFSByteArray, SFSBooleanArray, SFSIntArray, SFSLongArray} = require('../data/DataTypes');
const generateMaze = require('generate-maze');

const CharacterFactory = require('../factories/CharacterFactory');
const FamiliarFactory = require('../factories/FamiliarFactory');

const Battle = require('./Battle');

class Dungeon extends SFSObject {

    constructor(metaData) {
        super();
        this.id = metaData.id;
        this.type = 1;

        this.dungeonMetadata = metaData.dungeon;
        this.encounterMetadata = metaData.encounters;
        this.rewardMetadata = metaData.rewards;

        this.visitedRows = [0];
        this.visitedColumns = [0];
    }

    generate() {
        // create a maze pattern

        // size is between 3 and 6 nodes
        let rows = Math.floor(Math.random() * (7 - 4 + 1)) + 4;
        let columns = Math.floor(Math.random() * (7 - 4 + 1)) + 4;
        // let rows = 20; // width
        // let columns = 2; // height

        this.generateNodes(rows, columns);
        this.generateBoss();
        this.generateEncounters();
        this.generateChests();
        this.generateShrines();
        this.generateLoot();
        this.generateMerchants();
    }

    generateNodes(rows, columns) {
        this.rows = rows;
        this.columns = columns;

        let maze = generateMaze(rows, columns);

        let nodes = [];
        for (let y = 0; y < columns; y++) {
            for (let x = 0; x < rows; x++) {
                let n = maze[y][x];
                let node = new Node(x, y, n.top, n.bottom, n.left, n.right);
                nodes.push(node);
            }
        }
        this.nodes = nodes;
    }

    generateBoss() {
        if (this.encounterMetadata.filter(e => e.boss).length == 1) {
            this.fillRandomEndNode({
                id: 0,
                type: 2
            });
        }
    }

    generateEncounters() {
        console.log(this.encounterMetadata);
        let enemies = this.encounterMetadata.filter(e => !e.boss);
        for (let n = 0; n < 6; n++) {
            let diceRoll = Math.random() * 100;
            let chance = 0;
            for (let i = 0; i < enemies.length; i++) {
                chance += enemies[i].chance;
                if (diceRoll < chance) {
                    this.fillRandomNode({
                        id: i,
                        type: 0 // enemy
                    });
                    break;
                }
            }
        }
    }

    generateChests() {
        let amount = 0;
        let rand = Math.random();
        amount += rand < 0.5;
        amount += rand < 0.2;

        for (let i = 0; i < amount; i++) {
            let type = 0;
            let typeRand = Math.random();
            type += typeRand < 0.1;
            type += typeRand < 0.06;

            this.fillRandomNode({
                id: type,
                type: 1
            });
        }
    }

    generateShrines() {
        let amount = 0;
        let rand = Math.random();
        amount += rand < 0.3;
        amount += rand < 0.05;

        for (let i = 0; i < amount; i++) {
            this.fillRandomNode({
                id: Math.random() < 0.5 ? 0 : 1,
                type: 3
            });
        }
    }

    generateLoot() {

    }

    generateMerchants() {

    }

    setTeam(character, teamData) {
        let index = 0;
        this.team = teamData.map(entity => {
            let id = entity.getProperty("tmts1");
            let type = entity.getProperty("tmts2");

            if (type === 1) { // player
                let player = CharacterFactory.getCharacterById(id); // assuming player is always loaded

                let power = Math.max(1, player.getPower());
                let stamina = Math.max(1, player.getStamina());
                let agility = Math.max(1, player.getAgility());

                let entity = new DungeonEntity(index++, id, 1, power, stamina, agility);
                entity.inherit(player.getCharacterData());

                return entity;
            } else if (type == 2) { // fam
                let fam = FamiliarFactory.getFamiliar(id);

                let power = Math.max(1, Math.ceil(character.ts * fam.powerMult));
                let stamina = Math.max(1, Math.ceil(character.ts * fam.staminaMult));
                let agility = Math.max(1, Math.ceil(character.ts * fam.agilityMult));

                return new DungeonEntity(index++, id, 3, power, stamina, agility);
            }
        });

        this.dungeonPlayer = character;
    }

    enterBattle(recv) {
        this.visitedRows = recv.getProperty('dun11');
        this.visitedColumns = recv.getProperty('dun12');

        let currentNode = this.getCurrentNode();

        let battle = new Battle();
        battle.type = 1; // zone
        battle.isBoss = currentNode.objectType == 2;

        let index = 0;

        for (let i = 0; i < this.team.length; i++) {
            battle.addEntity(this.team[i], index++, this.character);
        }

        battle.addEntity({id: 4, type: 2, health: 10000, maxHealth: 10000, familiarId: 20}, index++);
        battle.addEntity({id: 7, type: 2, familiarId: 30}, index++);
        battle.addEntity({id: 10, type: 2, familiarId: 40}, index++);

        battle.calculateTurnCounter();

        //let npc = XMLFactory.npcBook

            /*
            bat5: new SFSInt(4), // id (0 == gobby, 4 == booboo, 7 == batty)
            bat6: new SFSInt(2), // type (1=player,2=npc,3=fam)
            bat7: new SFSInt(3), // index
            bat8: new SFSInt(3), // power
            bat9: new SFSInt(3), // stam
            bat10: new SFSInt(3), // agility
            bat11: new SFSInt(60), // health
            bat12: new SFSInt(60), // max health
            bat15: new SFSLong(2), // cooldown
            bat27: new SFSIntArray([1]),
            bat28: new SFSInt(0), // controller
            bat30: new SFSInt(40000), // SP
            bat32: new SFSInt(0), // consumables
            bat35: new SFSInt(20), // familiar id
            bat51: new SFSInt(0), // shield
            bat52: new SFSInt(15), // shield max
            bat56: new SFSInt(0), // enrage
             */

        return battle;
    }

    fillRandomNode(obj) {
        let emptyNodes = this.nodes.filter(n => n.empty);
        let randNode = emptyNodes[Math.floor(Math.random() * emptyNodes.length)];

        this.fillNode(randNode, obj);
    }

    fillRandomEndNode(obj) {
        let emptyNodes = this.nodes.filter(n => n.empty && n.end);
        let randNode = emptyNodes[Math.floor(Math.random() * emptyNodes.length)];

        this.fillNode(randNode, obj);
    }

    fillNode(node, obj) {
        node.empty = false;
        node.objectId = obj.id;
        node.objectType = obj.type;
    }

    getCurrentNode() {
        let row = this.visitedRows[this.visitedRows.length - 1];
        let column = this.visitedColumns[this.visitedColumns.length - 1];
        return this.getNode(row, column);
    }

    getNode(row, column) {
        return this.nodes.filter(n => n.row == row && n.column == column)[0];
    }

    isCleared() {
        let nonEmptyNodes = this.nodes.filter(n => n.empty == false);
        return nonEmptyNodes.length == 1;
    }

    getMultiplier() {
        return parseFloat(this.dungeonMetadata.$.statMult);
    }

    get nodes() {
        return this.getProperty("dun0");
    }

    set nodes(_nodes) {
        let nodes = new SFSArray(_nodes);
        this.setProperty("dun0", nodes);
    }

    get dungeonPlayer() {
        return this.getProperty("dun7");
    }

    set dungeonPlayer(player) {
        this.character = player;

        let currentNode = this.getCurrentNode();
        this.setProperty("dun7", new SFSArray([
            new SFSObject({
                cha1: new SFSInt(player.id),
                dun9: new SFSInt(currentNode.row),
                dun10: new SFSInt(currentNode.column),
                dun17: new SFSArray(this.team)
            })
        ]));
    }

    get columns() {
        return this.getProperty("dun11");
    }

    set columns(_columns) {
        let columns = new SFSInt(_columns);
        this.setProperty("dun11", columns);
    }

    get rows() {
        return this.getProperty("dun12");
    }

    set rows(_rows) {
        let rows = new SFSInt(_rows);
        this.setProperty("dun12", rows);
    }

    get id() {
        return this.getProperty("dun15");
    }

    set id(_id) {
        let id = new SFSInt(_id);
        this.setProperty("dun15", id);
    }

    get type() {
        return this.getProperty("dun16");
    }

    set type(_type) {
        let type = new SFSInt(_type);
        this.setProperty("dun16", type);
    }

}

class Node extends SFSObject {
    constructor(x, y, up, down, left, right) {
        super();
        this.setProperty("dun3", new SFSBoolean(!up));
        this.setProperty("dun4", new SFSBoolean(!down));
        this.setProperty("dun5", new SFSBoolean(!left));
        this.setProperty("dun6", new SFSBoolean(!right));
        this.setProperty("dun31", new SFSBoolean(false)); // seen

        this.row = y;
        this.column = x;
        this.empty = !(x == 0 && y == 0);

        let n = 0;
        n += up;
        n += down;
        n += left;
        n += right;

        this.end = n == 3;
    }

    get row() {
        return this.getProperty("dun1");
    }

    set row(_row) {
        let row = new SFSInt(_row);
        this.setProperty("dun1", row);
    }

    get column() {
        return this.getProperty("dun2");
    }

    set column(_column) {
        let column = new SFSInt(_column);
        this.setProperty("dun2", column);
    }

    get empty() {
        return this.getProperty("dun28");
    }

    set empty(_empty) {
        let empty = new SFSBoolean(_empty);
        this.setProperty("dun28", empty);
    }

    get objectId() {
        return this.getProperty("dun13");
    }

    set objectId(_objectId) {
        let objectId = new SFSInt(_objectId);
        this.setProperty("dun13", objectId);
    }

    get objectType() {
        return this.getProperty("dun14");
    }

    set objectType(_objectType) {
        let objectType = new SFSInt(_objectType);
        this.setProperty("dun14", objectType);
    }
}

class DungeonEntity extends SFSObject {
    constructor(index, id, type, power, stamina, agility) {
        super();
        this.index = index;
        this.id = id;
        this.type = type;
        this.power = power;
        this.stamina = stamina;
        this.agility = agility;

        this.health = stamina * 10;
        this.maxHealth = stamina * 10;
        this.consumables = 1;
        this.sp = 0;
        this.shield = 0;
        this.maxShield = stamina * 5;

        this.enrage = 0;
    }

    get index() {
        return this.getProperty("dun18");
    }

    set index(_index) {
        let index = new SFSInt(_index);
        this.setProperty("dun18", index);
    }

    get id() {
        return this.getProperty("dun19");
    }

    set id(_id) {
        let id = new SFSInt(_id);
        this.setProperty("dun19", id);
    }

    get type() {
        return this.getProperty("dun20");
    }

    set type(_type) {
        let type = new SFSInt(_type);
        this.setProperty("dun20", type);
    }

    get power() {
        return this.getProperty("dun21");
    }

    set power(_power) {
        let power = new SFSInt(_power);
        this.setProperty("dun21", power);
    }

    get stamina() {
        return this.getProperty("dun22");
    }

    set stamina(_stamina) {
        let stamina = new SFSInt(_stamina);
        this.setProperty("dun22", stamina);
    }

    get agility() {
        return this.getProperty("dun23");
    }

    set agility(_agility) {
        let agility = new SFSInt(_agility);
        this.setProperty("dun23", agility);
    }

    get health() {
        return this.getProperty("dun24");
    }

    set health(_health) {
        let health = new SFSInt(_health);
        this.setProperty("dun24", health);
    }

    get maxHealth() {
        return this.getProperty("dun25");
    }

    set maxHealth(_maxHealth) {
        let maxHealth = new SFSInt(_maxHealth);
        this.setProperty("dun25", maxHealth);
    }

    get consumables() {
        return this.getProperty("dun26");
    }

    set consumables(_canUseConsumable) {
        let canUseConsumable = new SFSInt(_canUseConsumable);
        this.setProperty("dun26", canUseConsumable);
    }

    get sp() {
        return this.getProperty("dun30");
    }

    set sp(_sp) {
        let sp = new SFSInt(_sp);
        this.setProperty("dun30", sp);
    }

    get shield() {
        return this.getProperty("dun33");
    }

    set shield(_shield) {
        let shield = new SFSInt(_shield);
        this.setProperty("dun33", shield);
    }

    get maxShield() {
        return this.getProperty("dun34");
    }

    set maxShield(_maxShield) {
        let maxShield = new SFSInt(_maxShield);
        this.setProperty("dun34", maxShield);
    }

}

module.exports = Dungeon;