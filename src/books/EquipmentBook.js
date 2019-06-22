class EquipmentBook {

    init(xmlData) {
        console.log('init equipment book');

        this.equipment = xmlData.equipment;
    }
}

module.exports = new EquipmentBook();