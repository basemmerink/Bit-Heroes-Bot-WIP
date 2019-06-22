class SFSDouble {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSDouble(value);
    }

    static deserialize(packet) {
        let val = packet.readLong();
        return new SFSDouble(val);
    }

    serialize() {
        return [
            this.constructor.getType(),
            (this.value >> 56) & 0xFF,
            (this.value >> 48) & 0xFF,
            (this.value >> 40) & 0xFF,
            (this.value >> 32) & 0xFF,
            (this.value >> 24) & 0xFF,
            (this.value >> 16) & 0xFF,
            (this.value >> 8) & 0xFF,
            this.value & 0xFF
        ];
    }

    static getType() {
        return 7;
    }

    toString() {
        return "(double) " + this.value;
    }
}

module.exports = SFSDouble;