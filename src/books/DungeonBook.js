class DungeonBook {

    init(xmlData) {
        console.log('init dungeon book');

        this.dungeon = xmlData.dungeon;
    }
}

module.exports = new DungeonBook();