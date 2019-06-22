class FamiliarBook {

    init(xmlData) {
        console.log('init familiar book');

        this.familiar = xmlData.familiar;
    }
}

module.exports = new FamiliarBook();