const DALC_ID = 8;

class ChatDalc extends require('./Dalc') {

    constructor() {
        super(DALC_ID);
        this.actions = {
            1: this.handleWorldChat,
        }
    }

    handleWorldChat(client, recv) {
        let chat = recv.getProperty("chat0");
        // handle world chat here
    }

}

module.exports = new ChatDalc();