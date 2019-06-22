class SFSDoubleArray {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSDoubleArray(value);
    }

    static deserialize(packet) {
        let arr = [];
        let len = packet.readShort();
        for (let i = 0; i < len; i++) {
            arr.push(packet.readDouble());
        }
        return new SFSDoubleArray(arr);
    }

    serialize() {
        let len = this.value.length;
        let ret = [
            this.constructor.getType(),
            (len >> 8) & 0xFF,
            len & 0xFF
        ];
        for (let i = 0; i < this.value.length; i++) {
            ret.push((this.value[i] >> 56) & 0xFF);
            ret.push((this.value[i] >> 48) & 0xFF);
            ret.push((this.value[i] >> 40) & 0xFF);
            ret.push((this.value[i] >> 32) & 0xFF);
            ret.push((this.value[i] >> 24) & 0xFF);
            ret.push((this.value[i] >> 16) & 0xFF);
            ret.push((this.value[i] >> 8) & 0xFF);
            ret.push(this.value[i] & 0xFF);
        }
        return ret;
    }

    static getType() {
        return 15;
    }

    toString() {
        let ret = "(doublearray) [";
        for (let i = 0; i < this.value.length; i++) {
            ret += this.value[i].toString() + ", ";
        }
        return ret.substring(0, ret.length-2) + "]";
    }
}

module.exports = SFSDoubleArray;