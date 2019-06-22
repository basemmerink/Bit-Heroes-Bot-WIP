const fs = require('fs');
const xml2js = require('xml2js');

class XMLFactory {
    constructor() {
        this.parser = new xml2js.Parser();
    }

    async init() {
        let books = ['AbilityBook', 'ConsumableBook', 'CraftBook', 'DungeonBook', 'EncounterBook', 'EquipmentBook', 'FamiliarBook', 'NPCBook', 'ShopBook'];

        let parseBook = async function(book) {
            require('../books/' + book).init(await this.parse(book));
        };

        await Promise.all(books.map(parseBook.bind(this)));

        console.log('All books initialized');

        const ZoneBook = require('../books/ZoneBook');

        let parseZone = async function(id) {
            let book = await this.parse('Zone_' + id);
            ZoneBook.addBook(id, book);
        };
        await Promise.all([1, 2, 3, 4, 5, 6, 7, 8].map(parseZone.bind(this)));

        console.log('All zones initialized');
    }

    async parse(xml) {
        let that = this;
        return new Promise((resolve, reject) => {
            fs.readFile('./xmls/' + xml + '.xml', function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                that.parser.parseString(data, function (err2, result) {
                    if (err2) {
                        reject(err2);
                    } else {
                        resolve(result.data);
                    }
                });
            });
        });
    }

}

module.exports = new XMLFactory();