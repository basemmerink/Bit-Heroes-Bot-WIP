const Dalc = require('./Dalc');
const DiscordAPI = require('../DiscordAPI');

const DALC_ID = 1;

class CharacterDalc extends require('./Dalc') {

    constructor() {
        super(DALC_ID);
        this.actions = {
            9: this.getProfile
        }
    }

    getProfile(client, recv) {
        DiscordAPI.sendViewProfile({
            id: recv.getProperty("cha1"),
            name: recv.getProperty("cha2"),
            level: recv.getProperty("cha4"),
            power: recv.getProperty("cha6"),
            stamina: recv.getProperty("cha7"),
            agility: recv.getProperty("cha8"),
            guild: recv.getProperty("gui0") ?
                {
                    tag: recv.getProperty("gui3"),
                    name: recv.getProperty("gui2")
                }
                : null
        });
    }

}

module.exports = new CharacterDalc();