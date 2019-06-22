class SFSLong {
    constructor(value) {
        this.value = value;
    }

    static create(value) {
        return new SFSLong(value);
    }

    static deserialize(packet) {
        let val = packet.readLong();
        return new SFSLong(val);
    }

    serialize() {
        let first = 0;
        let second = 0;
        if (this.value >= 0) {
            first = this.value / 0x100000000;
            second = this.value % 0x100000000;
        } else {
            let positiveValue = Math.abs(this.value) - 1;
            first = positiveValue / 0x100000000;
            second = positiveValue % 0x100000000;
            first = ~first;
            second = ~second;
        }
        return [
            this.constructor.getType(),
            (first >> 24) & 0xFF,
            (first >> 16) & 0xFF,
            (first >> 8) & 0xFF,
            first & 0xFF,
            (second >> 24) & 0xFF,
            (second >> 16) & 0xFF,
            (second >> 8) & 0xFF,
            second & 0xFF
        ];
    }

    static getType() {
        return 5;
    }

    toString() {
        return "(long) " + this.value;
    }
}

module.exports = SFSLong;