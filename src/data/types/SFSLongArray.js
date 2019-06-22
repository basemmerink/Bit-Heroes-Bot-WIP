class SFSLongArray {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSLongArray(value);
    }

    static deserialize(packet) {
        let arr = [];
        let len = packet.readShort();
        for (let i = 0; i < len; i++) {
            arr.push(packet.readLong());
        }
        return new SFSLongArray(arr);
    }

    serialize() {
        let len = this.value.length;
        let ret = [
            this.constructor.getType(),
            (len >> 8) & 0xFF,
            len & 0xFF
        ];
        for (let i = 0; i < this.value.length; i++) {
            let first = 0;
            let second = 0;
            if (this.value[i] >= 0) {
                first = this.value[i] / 0x10000;
                second = this.value[i] % 0x10000;
            } else {
                let positiveValue = Math.abs(this.value[i]) - 1;
                first = ~(positiveValue / 0x10000);
                second = ~(positiveValue % 0x10000);
            }
            ret.push((first >> 24) & 0xFF);
            ret.push((first >> 16) & 0xFF);
            ret.push((first >> 8) & 0xFF);
            ret.push(first & 0xFF);
            ret.push((second >> 24) & 0xFF);
            ret.push((second >> 16) & 0xFF);
            ret.push((second >> 8) & 0xFF);
            ret.push(second & 0xFF);
        }
        return ret;
    }

    static getType() {
        return 13;
    }

    toString() {
        let ret = "(longarray) [";
        for (let i = 0; i < this.value.length; i++) {
            ret += this.value[i].toString() + ", ";
        }
        return ret.substring(0, ret.length-2) + "]";
    }
}

module.exports = SFSLongArray;