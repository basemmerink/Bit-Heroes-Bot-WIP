class NPCBook {

    init(xmlData) {
        console.log('init npc book');

        this.npc = xmlData.npc;
    }
}

module.exports = new NPCBook();