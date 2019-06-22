class AbilityBook {

    init(xmlData) {
        console.log('init ability book');

        this.abilities = xmlData.abilities;
        this.ability = xmlData.ability;
    }
}

module.exports = new AbilityBook();