class ConsumableBook {

    init(xmlData) {
        console.log('init consumable book');

        this.consumable = xmlData.consumable;
    }
}

module.exports = new ConsumableBook();