class SFSBooleanArray {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSBooleanArray(value);
    }

    static deserialize(packet) {
        let arr = [];
        let len = packet.readShort();
        for (let i = 0; i < len; i++) {
            arr.push(packet.readByte() == 1);
        }
        return new SFSBooleanArray(arr);
    }

    serialize() {
        let len = this.value.length;
        let ret = [
            this.constructor.getType(),
            (len >> 8) & 0xFF,
            len & 0xFF
        ];
        return ret.concat(this.value.map(a=>a?1:0));
    }

    static getType() {
        return 9;
    }

    toString() {
        let ret = "(boolarray) [";
        for (let i = 0; i < this.value.length; i++) {
            ret += this.value[i].toString() + ", ";
        }
        return ret.substring(0, ret.length-2) + "]";
    }
}

module.exports = SFSBooleanArray;