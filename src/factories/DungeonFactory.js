const DungeonBook = require('../books/DungeonBook');
const EncounterBook = require('../books/EncounterBook');
const ZoneBook = require('../books/ZoneBook');
const Dungeon = require('../model/Dungeon');

class DungeonFactory {

    constructor() {
        this.dungeons = [];
    }

    getDungeon(zone, node, difficulty) {
        if (!this.dungeons[zone]) {
            this.dungeons[zone] = [];
        }
        if (!this.dungeons[zone][node]) {
            this.dungeons[zone][node] = [];
        }
        if (!this.dungeons[zone][node][difficulty]) {
            this.generateDungeon(zone, node, difficulty);
        }
        let dungeonMetadata = this.dungeons[zone][node][difficulty];
        return new Dungeon(dungeonMetadata);
    }

    generateDungeon(zone, node, difficulty) {
        let dungeonMetadata = this.getDungeonMetadata(zone, node, difficulty);
        let encounters = this.getEncounterMetadata(dungeonMetadata);
        let rewards = this.getRewardMetadata(zone, node, difficulty);

        this.dungeons[zone][node][difficulty] = {
            id: dungeonMetadata.id,
            dungeon: dungeonMetadata.dungeon,
            encounters: encounters,
            rewards: rewards
        };
    }

    getDungeonMetadata(zone, node, difficulty) {
        let dungeons = DungeonBook.dungeon;
        let filtered = [];
        for (let i = 0; i < dungeons.length; i++) {
            if (dungeons[i].$.link.startsWith("z" + zone + "_n" + node)) {
                filtered.push({
                    id: i,
                    dungeon: dungeons[i]
                });
            }
        }

        return filtered[difficulty];
    }

    getEncounterMetadata(dungeonMetadata) {
        let enemies = dungeonMetadata.dungeon.enemies[0].enemy;
        let encounters = EncounterBook.encounter;
        let filtered = [];

        for (let i = 0; i < enemies.length; i++) {
            let link = enemies[i].$.encounter;
            let perc = enemies[i].$.perc;
            for (let n = 0; n < encounters.length; n++) {
                if (encounters[n].$.link == link) {
                    filtered.push({
                        id: n,
                        boss: false,
                        chance: parseInt(perc),
                        npcs: encounters[n].npc.map(npc => npc.$.link)
                    });
                    break;
                }
            }
        }

        if (dungeonMetadata.dungeon.boss) {
            let bossLink = dungeonMetadata.dungeon.boss[0].$.encounter;
            for (let n = 0; n < encounters.length; n++) {
                if (encounters[n].$.link == bossLink) {
                    filtered.push({
                        id: n,
                        boss: true,
                        chance: 100,
                        npcs: encounters[n].npc.map(npc => npc.$.link)
                    });
                    break;
                }
            }
        }

        return filtered;
    }

    getRewardMetadata(zone, node, difficulty) {
        if (difficulty > 0) {
            return [];
        }
        return ZoneBook.getBook(zone).zone[0]
            .nodes[0].node[node-1]
            .difficulties[0].difficulty[0]
            .rewards[0].item.map(item => item.$);
    }
}

module.exports = new DungeonFactory();