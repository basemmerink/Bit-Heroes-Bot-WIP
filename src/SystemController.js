const HandshakeHandler = require('./handlers/HandshakeHandler');
const LoginHandler = require('./handlers/LoginHandler');
const DalcHandler = require('./handlers/DalcHandler');

const handlers = {
    0: HandshakeHandler,
    1: LoginHandler,
    13: DalcHandler
}

class SystemController {

    handle(client, packet) {
        let handler = handlers[packet.action];
        if (handler) {
            handler.handle(client, packet.getMessage());
        }
    }
}

module.exports = new SystemController();