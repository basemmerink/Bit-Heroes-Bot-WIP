const SFSString = require('./SFSString');

class SFSObject {
    constructor(properties) {
        this.properties = properties || {};
    }

    setProperty(key, value) {
        this.properties[key] = value;
    }

    getProperty(key, getObject) {
        let property = this.properties[key];
        if (property == null) {
            return null;
        } else if (property.isObject || getObject) {
            return property;
        } else {
            return property.value;
        }
    }

    inherit(otherObject, filter) {
        for (let key in otherObject.properties) {
            if (typeof filter == "undefined" || filter.indexOf(key) > -1) {
                this.setProperty(key, otherObject.getProperty(key, true));
            }
        }
    }

    clone() {
        let clone = new SFSObject();
        Object.keys(this.properties).forEach(key => {
            clone.setProperty(key, this.properties[key]);
        });
        return clone;
    }

    static create(obj) {
        return obj;
    }

    static deserialize(packet) {
        let o = new SFSObject();

        let propertyAmount = packet.readShort();

        for (let i = 0; i < propertyAmount; i++) {
            let key = packet.readString();
            let property = packet.readProperty();
            o.setProperty(key.value, property);
        }

        return o;
    }

    serialize() {
        let len = 0;
        let content = [];

        Object.keys(this.properties).forEach(key => {
            if (!this.properties[key].serialize) {
                console.log(key, this.properties[key]);
            }
            content = content.concat(new SFSString(key).serialize().slice(1));
            content = content.concat(this.properties[key].serialize());
            len++;
        });

        let ret = [
            this.constructor.getType(),
            (len >> 8) & 0xFF,
            len & 0xFF
        ];

        return ret.concat(content);
    }

    get isObject() {
        return true;
    }

    static getType() {
        return 18;
    }

    toString(i) {
        i = i || 1;
        let ret = "(sfsobject) {\n";
        for (let key in this.properties) {
            let val = this.properties[key];
            ret += "\t".repeat(i);
            ret += key + ": ";
            ret += val.toString(i+1);
            ret += "\n";
        }
        return ret + "\t".repeat(i-1) + "}";
    }
}

module.exports = SFSObject;