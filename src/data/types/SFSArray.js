class SFSArray {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSArray(value);
    }

    static deserialize(packet) {
        let size = packet.readShort();
        let arr = [];
        for (let i = 0; i < size; i++) {
            let obj = packet.readProperty();
            arr.push(obj);
        }
        return new SFSArray(arr);
    }

    serialize() {
        let len = this.value.length;
        let ret = [
            this.constructor.getType(),
            (len >> 8) & 0xFF,
            len & 0xFF
        ];
        for (let i = 0; i < len; i++) {
            ret = ret.concat(this.value[i].serialize());
        }
        return ret;
    }

    get isObject() {
        return false;
    }

    static getType() {
        return 17;
    }

    toString(i) {
        i = i || 1;
        let ret = "(sfsarray) {\n";
        for (let n in this.value) {
            let val = this.value[n];
            ret += "\t".repeat(i);
            ret += val.toString(i+1);
            ret += "\n";
        }
        return ret + "\t".repeat(i-1) + "}";
    }
}

module.exports = SFSArray;