const FamiliarBook = require('../books/FamiliarBook');
const Dungeon = require('../model/Dungeon');

class FamiliarFactory {

    constructor() {
        this.familiars = [];
    }

    getFamiliar(id) {
        if (!this.familiars[id]) {
            this.generateFamiliar(id);
        }
        return this.familiars[id];
    }

    generateFamiliar(id) {
        let familiarMetadata = this.getFamiliarMetadata(id);

        this.familiars[id] = familiarMetadata;
    }

    getFamiliarMetadata(id) {
        let familiars = FamiliarBook.familiar;
        return familiars.filter(f=>f.$.id == id)[0].$;
    }

}

module.exports = new FamiliarFactory();