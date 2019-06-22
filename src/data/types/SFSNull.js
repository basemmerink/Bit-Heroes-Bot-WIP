class SFSNull {
    constructor() {
        this.value = null;
    }

    static create(value) {
        return new SFSNull(value);
    }

    static deserialize(packet) {
        return new SFSNull();
    }

    serialize() {
        return [
            this.constructor.getType()
        ];
    }

    static getType() {
        return 0;
    }

    toString() {
        return "(null) " + this.value;
    }
}

module.exports = SFSNull;