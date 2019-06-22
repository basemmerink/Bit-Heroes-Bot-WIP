class CraftBook {

    init(xmlData) {
        console.log('init craft book');

        this.upgrades = xmlData.upgrades;
        this.reforges = xmlData.reforges;
        this.rerolls = xmlData.rerolls;
        this.trades = xmlData.trades;
    }

    getUpgradeRequirements(link) {
        return this.upgrades[0]
            .upgrade.filter(upgrade => upgrade.$.link == link)[0]
            .requirements[0]
            .item.map(item => {
                return {
                    id: parseInt(item.$.id),
                    type: item.$.type,
                    quantity: parseInt(item.$.qty)
                }
            });
    }
}

module.exports = new CraftBook();