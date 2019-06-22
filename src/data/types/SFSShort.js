class SFSShort {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSShort(value);
    }

    static deserialize(packet) {
        let val = packet.readShort();
        return new SFSShort(val);
    }

    serialize() {
        return [
            this.constructor.getType(),
            (this.value >> 8) & 0xFF,
            this.value & 0xFF
        ];
    }

    static getType() {
        return 3;
    }

    toString() {
        return "(short) " + this.value;
    }
}

module.exports = SFSShort;