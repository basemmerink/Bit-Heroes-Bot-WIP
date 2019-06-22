class SFSStringArray {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSStringArray(value);
    }

    static deserialize(packet) {
        let arr = [];
        let len = packet.readShort();
        for (let i = 0; i < len; i++) {
            arr.push(packet.readString());
        }
        return new SFSStringArray(arr);
    }

    serialize() {
        let len = this.value.length;
        let ret = [
            this.constructor.getType(),
            (len >> 8) & 0xFF,
            len & 0xFF
        ];
        for (let i = 0; i < this.value.length; i++) {
            ret = ret.concat(this.value[i].serialize());
        }
        return ret;
    }

    static getType() {
        return 16;
    }

    toString() {
        let ret = "(stringarray) [";
        for (let i = 0; i < this.value.length; i++) {
            ret += this.value[i].toString() + ", ";
        }
        return ret.substring(0, ret.length-2) + "]";
    }
}

module.exports = SFSStringArray;