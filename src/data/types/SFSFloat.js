class SFSFloat {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSFloat(value);
    }

    static deserialize(packet) {
        let val = packet.readFloat();
        return new SFSFloat(val);
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
        return 6;
    }

    toString() {
        return "(float) " + this.value;
    }
}

module.exports = SFSFloat;