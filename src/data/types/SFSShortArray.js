class SFSShortArray {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSShortArray(value);
    }

    static deserialize(packet) {
        let arr = [];
        let len = packet.readShort();
        for (let i = 0; i < len; i++) {
            arr.push(packet.readShort());
        }
        return new SFSShortArray(arr);
    }

    serialize() {
        let len = this.value.length;
        let ret = [
            this.constructor.getType(),
            (len >> 8) & 0xFF,
            len & 0xFF
        ];
        for (let i = 0; i < this.value.length; i++) {
            ret.push((this.value[i] >> 8) & 0xFF);
            ret.push(this.value[i] & 0xFF);
        }
        return ret;
    }

    static getType() {
        return 11;
    }

    toString() {
        let ret = "(shortarray) [";
        for (let i = 0; i < this.value.length; i++) {
            ret += this.value[i].toString() + ", ";
        }
        return ret.substring(0, ret.length-2) + "]";
    }
}

module.exports = SFSShortArray;