class SFSBoolean {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSBoolean(value);
    }

    static deserialize(packet) {
        return new SFSBoolean(packet.readByte() == 1);
    }

    serialize() {
        return [
            this.constructor.getType(),
            this.value ? 1 : 0
        ];
    }

    static getType() {
        return 1;
    }

    toString() {
        return this.value ? "true" : "false";
    }
}

module.exports = SFSBoolean;