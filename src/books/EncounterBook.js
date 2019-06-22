class EncounterBook {

    init(xmlData) {
        console.log('init encounter book');

        this.encounter = xmlData.encounter;
    }
}

module.exports = new EncounterBook();