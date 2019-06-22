class SFSInt {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSInt(value);
    }

    static deserialize(packet) {
        let val = packet.readInt();
        return new SFSInt(val);
    }

    serialize() {
        return [
            this.constructor.getType(),
            (this.value >> 24) & 0xFF,
            (this.value >> 16) & 0xFF,
            (this.value >> 8) & 0xFF,
            this.value & 0xFF
        ];
    }

    static getType() {
        return 4;
    }

    toString() {
        return "(int) " + this.value;
    }
}

module.exports = SFSInt;