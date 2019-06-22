class ZoneBook {

    constructor() {
        this.zones = [null];
    };

    addBook(id, xmlData) {
        console.log('init zone ' + id);
        this.zones[id] = xmlData;
    }

    getBook(id) {
        return this.zones[id];
    }
}

module.exports = new ZoneBook();