let {SFSObject, SFSString, SFSInt} = require('../data/DataTypes');

class LoginHandler {
    handle(client, recv) {
        let response = client.createPacket(1, 13);
        response.setProperty("c", new SFSString("ServerExtension"));
        response.setProperty("r", new SFSInt(-1));
        response.setProperty("p", new SFSObject({
            use8: new SFSString("en"),
            act0: new SFSInt(5),
            dal0: new SFSInt(4)
        }));

        client.send(response);
    }

}

module.exports = new LoginHandler();