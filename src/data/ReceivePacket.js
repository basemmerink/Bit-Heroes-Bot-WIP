const SFSObject = require('./types/SFSObject');
const DataTypes = require('./DataTypes').DataTypes;

class ReceivePacket {
    constructor(data) {
        this.data = data;
        this.available = data.length;
        this.pos = 0;

        let big = (this.readByte() & 8) > 0;
        this.len = big ? this.readInt() : this.readShort();
        this.offset = big ? 5 : 3;
        this.content = new SFSObject();
        this.deserialize();
    }

    deserialize() {
        let type = this.readByte();
        if (type == 0x12) {
            // SFSObject
            this.content = DataTypes.getFromType(18).deserialize(this);
        } else {
            console.log("UNKNOWN TYPE (%s): %s", type, this.data);
        }
    }

    get action() {
        return this.content.getProperty("a");
    }

    get controller() {
        return this.content.getProperty("c");
    }

    getMessage() {
        return this.content.getProperty("p");
    }

    readAndShiftLeft8(amount) {
        return this.readByte() * Math.pow(256, amount);
    }

    readProperty() {
        let type = this.readByte();

        if (DataTypes.getFromType(type)) {
            let property = DataTypes.getFromType(type).deserialize(this);
            return property;
        }
    }

    readByte() {
        if (this.pos < this.available) {
            return this.data[this.pos++] & 0xFF;
        }
        return 0;
        //throw "Index out of bounds";
    }

    readShort() {
        return this.readAndShiftLeft8(1) + this.readByte();
    }

    readInt() {
        let val = this.readAndShiftLeft8(3) + this.readAndShiftLeft8(2) + this.readAndShiftLeft8(1) + this.readByte();
        if (val > 0x7FFFFFFF) {
            val -= 0x100000000;
        }
        return val;
    }

    readFloat() {
        return this.readInt();
    }

    readLong() {
        let first = this.readInt();
        let second = this.readInt();
        return first * 0x100000000 + second;
    }

    readDouble() {
        return this.readAndShiftLeft8(7) + this.readAndShiftLeft8(6) + this.readAndShiftLeft8(5) + this.readAndShiftLeft8(4) + this.readAndShiftLeft8(3) + this.readAndShiftLeft8(2) + this.readAndShiftLeft8(1) + this.readByte();
    }

    readString() {
        return DataTypes.getFromType(8).deserialize(this);
    }

    rawToString() {
        return this.data.toString('hex').replace(/(.{0,2})/g, '$1 ');
    }

    toString() {
        let hexString = "";
        let asciiString = "";
        for (let i = this.offset; i < this.data.length; i++) {
            let byte = this.data[i];
            let hex = byte.toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            hexString += hex;
            hexString += " ";

            asciiString += (byte > 31 && byte < 127)
                ? String.fromCharCode(this.data[i])
                : ".";
        }
        return hexString + "\n" + asciiString;
    }

}

module.exports = ReceivePacket;