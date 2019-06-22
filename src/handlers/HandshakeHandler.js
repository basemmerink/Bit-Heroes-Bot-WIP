let {SFSString, SFSObject} = require('../data/DataTypes');

class HandshakeHandler {
    handle(client, recv) {
        let response = client.createPacket(0, 1);
        response.setProperty("zn", new SFSString("Server"));
        response.setProperty("pw", new SFSString(""));
        response.setProperty("un", new SFSString(""));

        response.setProperty("p", new SFSObject({
            use8: new SFSString("en")
        }));

        client.send(response);
    }
}

module.exports = new HandshakeHandler();