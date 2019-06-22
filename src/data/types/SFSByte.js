class SFSByte {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSByte(value);
    }

    static deserialize(packet) {
        return new SFSByte(packet.readByte());
    }

    serialize() {
        return [
            this.constructor.getType(),
            this.value
        ];
    }

    static getType() {
        return 2;
    }

    toString() {
        return "(byte) " + this.value;
    }
}

module.exports = SFSByte;