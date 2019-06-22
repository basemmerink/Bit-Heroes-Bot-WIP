class ShopBook {

    init(xmlData) {
        console.log('init shop book');

        this.promos = xmlData.promos;
        this.sales = xmlData.sales;
    }
}

module.exports = new ShopBook();