class SFSByteArray {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSByteArray(value);
    }

    static deserialize(packet) {
        let arr = [];
        let len = packet.readInt();
        for (let i = 0; i < len; i++) {
            arr.push(packet.readByte());
        }
        return new SFSByteArray(arr);
    }

    serialize() {
        let len = this.value.length;
        let ret = [
            this.constructor.getType(),
            (len >> 24) & 0xFF,
            (len >> 16) & 0xFF,
            (len >> 8) & 0xFF,
            len & 0xFF
        ];
        return ret.concat(this.value);
    }

    static getType() {
        return 10;
    }

    toString() {
        let ret = "(bytearray) [";
        for (let i = 0; i < this.value.length; i++) {
            ret += this.value[i].toString() + ", ";
        }
        return ret.substring(0, ret.length-2) + "]";
    }
}

module.exports = SFSByteArray;