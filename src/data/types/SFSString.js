const {StringDecoder} = require('string_decoder');

class SFSString {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSString(value);
    }

    static deserialize(packet) {
        let len = packet.readShort();
        let str = [];
        for (let i = 0; i < len; i++) {
            str.push(packet.readByte());
        }
        // return new SFSString(String.fromCharCode(...str));
        return new SFSString(new StringDecoder('utf8').write(Buffer.from(str)));
    }

    serialize() {
        let len = this.value.length;
        let ret = [
            this.constructor.getType(),
            (len >> 8) & 0xFF,
            len & 0xFF
        ];
        for (let i = 0; i < len; i++) {
            ret.push(this.value.charCodeAt(i));
        }
        return ret;
    }

    static getType() {
        return 8;
    }

    toString() {
        return "(string) " + this.value;
    }
}

module.exports = SFSString;