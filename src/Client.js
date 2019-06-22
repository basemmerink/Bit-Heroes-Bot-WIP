const net = require('net');
const zlib = require('zlib');
const http = require('http');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();


const ReceivePacket = require('./data/ReceivePacket');
const SendPacket = require('./data/SendPacket');
const SystemController = require('./SystemController');

const LOG_ALL = false;
const PORT = 9933; // default BH port

class Client {

    constructor() {
        this.socket = null;
        this.pendingPacket = null;
        this.connected = false;
    }

    start() {
        this.findIPAddress(this.connect.bind(this));
    }

    findIPAddress(callback) {
        let antiCache = Math.ceil(Math.random() * 100000); // prevent caching

        // search for the bit heroes IP address
        http.request('http://web.bitheroesgame.com/Server1.xml?v=' + antiCache, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                parser.parseString(Buffer.from(chunk), (err, ret) => {
                    callback(ret.SmartFoxConfig.ip[0]);
                });
            });
        }).end();
    }

    connect(ip) {
        this.socket = new net.Socket();

        this.socket.on('data', function(data) {
            if (data.length < 3) {
                return; // faulty message
            }

            if (this.isPending()) {
                this.appendPacket(data);
            } else {
                this.messageReceived(data);
            }
        }.bind(this));

        this.socket.on('close', () => {
            this.connected = false;
        });

        this.socket.connect(PORT, ip, () => {
            this.connected = true;
            this.write(Buffer.from("<policy-file-request/>\0"));
        });
    }

    isPending() {
        return this.pendingPacket !== null;
    }

    appendPacket(data) {
        this.pendingPacket.data = Buffer.concat([this.pendingPacket.data, data]);
        let packet = this.pendingPacket.data;
        let expectedLen = this.pendingPacket.length;

        if (packet.length === expectedLen) {
            this.messageReceived(Buffer.concat([this.pendingPacket.header, packet]));
        } else if (packet.length > expectedLen) {
            let leftover = packet.slice(expectedLen);
            this.messageReceived(Buffer.concat([this.pendingPacket.header, packet.slice(0, expectedLen)]));
            this.messageReceived(leftover);
        }
    }

    messageReceived(data) {
        this.pendingPacket = null;

        let mode = data[0];
        let length;
        let offset = 3;

        if (mode === 0x3C) { // policy
            this.write(Buffer.from([128, 0, 45, 18, 0, 3, 0, 1, 99, 2, 0, 0, 1, 112, 18, 0, 2, 0, 2, 99, 108, 8, 0, 5, 70, 108, 97, 115, 104, 0, 3, 97, 112, 105, 8, 0, 5, 49, 46, 55, 46, 52, 0, 1, 97, 3, 0, 0]));
            return;
        }

        if ((mode & 8) > 0) { // bigsized
            length = (data[1] << 24) + (data[2] << 16) + (data[3] << 8) + data[4];
            offset = 5;
        } else {
            length = (data[1] << 8) + data[2];
        }

        let header = data.slice(0, offset);
        let content = data.slice(offset);

        if (length != data.length - offset) {
            this.pendingPacket = {
                length: length,
                header: header,
                data: content
            };
            return;
        }

        if ((mode & 16) > 0) { // bluebox

        }

        if ((mode & 32) > 0) { // compressed
            zlib.inflate(content, function(err, buffer) {
                if (err) {
                    throw err;
                }
                this.handlePacket(buffer, header);
            }.bind(this));
            return;
        }

        if ((mode & 64) > 0) { // encrypted

        }

        this.handlePacket(content, header);
    }

    handlePacket(data, header) {
        let rp = new ReceivePacket(Buffer.concat([header, data]));

        if (LOG_ALL) {
            console.log(rp.content.toString()); // PRINT PACKET
            console.log('\n');
        }

        SystemController.handle(this, rp);
    }

    createPacket(controller, action) {
        return new SendPacket(controller, action);
    }

    createDalcPacket(dalcId, action) {
        let packet = this.createPacket(1, 13);

        let obj = new SFSObject();
        obj.setProperty("dal0", new SFSInt(dalcId));
        obj.setProperty("act0", new SFSInt(action));

        packet.setProperty("p", obj);
        packet.setProperty("c", new SFSString("ServerExtension"));

        return packet;
    }

    sendCompressed(packet) {
        zlib.deflateRaw(Buffer.from(packet.serialize()), (e,buf) => {
            let len = buf.length;
            let header = [0xA0, (len >> 8) & 0xFF, len & 0xFF];
            if (len > 0xFFFF) {
                header = [0xA8, (len >> 24) & 0xFF, (len >> 16) & 0xFF, (len >> 8) & 0xFF, len & 0xFF]
            }
            let packet = Buffer.from(header.concat([...buf]));
            this.write(packet);
        })
    }

    send(packet) {
        let data = packet.serialize();
        let len = data.length;
        let header = [0x80, (len >> 8) & 0xFF, len & 0xFF];
        if (len > 0xFFFF) {
            header = [0x88, (len >> 24) & 0xFF, (len >> 16) & 0xFF, (len >> 8) & 0xFF, len & 0xFF]
        }
        this.write(Buffer.from(header.concat(data)));
    }

    write(buf) {
        this.socket.write(buf);
    }


}

module.exports = new Client();