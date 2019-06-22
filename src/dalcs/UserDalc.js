const fs = require('fs');
const zlib = require('zlib');

const {SFSString, SFSInt} = require('../data/DataTypes');
const GameDalc = require('./GameDalc');

const DALC_ID = 4;

class UserDalc extends require('./Dalc') {

    constructor() {
        super(DALC_ID);
        this.actions = {
            1: this.handleLogin,
            5: this.handleXMLS
        }
    }

    handleLogin(client, recv) {
        GameDalc.requestPlayersOnline(client, recv);
    }

    handleXMLS(client, recv) {
        this.saveXMLS(recv);

        let packet = this.createPacket(client, 1);
        let message = packet.getMessage();

        message.setProperty("use0", new SFSString(process.env.BH_USERNAME));
        message.setProperty("use2", new SFSInt(4));
        message.setProperty("use3", new SFSString(process.env.BH_USERID));
        message.setProperty("use4", new SFSString(process.env.BH_PASSWORD_TOKEN));
        message.setProperty("use7", new SFSString("Mac OS 10.13.4")); // does this even matter lol
        message.setProperty("use8", new SFSString("en")); // sorry all, english only :>
        message.setProperty("use9", new SFSString(""));
        message.setProperty("cha31", new SFSInt(4));

        client.send(packet);
    }

    saveXMLS(packet) {
        let books = packet.getProperty("xml0");
        let lang = packet.getProperty("xml3");
        for (let i = 0; i < books.length; i++) {
            let xmlBook = books[i];
            zlib.inflate(Buffer.from(xmlBook.getProperty("xml2")), (e, b) => {
                fs.writeFile('./xmls/' + xmlBook.getProperty("xml1"), b, a => {});
            })
        }
        zlib.inflate(Buffer.from(lang), (e, b) => {
            if (e) throw e;
            fs.writeFile('./xmls/Language_en.xml', b, a => {});
        });
    }

}

module.exports = new UserDalc();