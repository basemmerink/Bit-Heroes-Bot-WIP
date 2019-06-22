
const Client = require('./Client');
const DiscordAPI = require('./DiscordAPI');
const SystemController = require("./SystemController");

class FakeClient extends Client {

    constructor(ip, port) {
        super(null);
        this.ip = ip;
        this.port = port;

        DiscordAPI.setClient(this);
    }

    connect() {
        this.socket = new net.Socket();

        this.socket.on('data', function(data) {
            if (data.length < 3) {
                return; // faulty message
            }

            let callback = function(packet) {
                this.handleFakePacket(packet);
            }.bind(this);

            if (this.isPending()) {
                this.appendPacket(data, callback);
            } else {
                this.messageReceived(data, callback);
            }
        }.bind(this));

        this.socket.on('close', () => {
            console.log('connection closed');
            setTimeout(this.connect.bind(this), 5000);
        });

        this.socket.connect(this.port, this.ip, this.connectedHandler.bind(this));
    }



    handleFakePacket(packet, data) {
        SystemController.handle(this, packet);
    }

}

module.exports = FakeClient;