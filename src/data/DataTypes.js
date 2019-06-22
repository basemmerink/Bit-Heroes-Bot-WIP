const SFSNull = require('./types/SFSNull');
const SFSBoolean = require('./types/SFSBoolean');
const SFSByte = require('./types/SFSByte');
const SFSShort = require('./types/SFSShort');
const SFSInt = require('./types/SFSInt');
const SFSLong = require('./types/SFSLong');
const SFSFloat = require('./types/SFSFloat');
const SFSDouble = require('./types/SFSDouble');
const SFSString = require('./types/SFSString');
const SFSBooleanArray = require('./types/SFSBooleanArray');
const SFSByteArray = require('./types/SFSByteArray');
const SFSShortArray = require('./types/SFSShortArray');
const SFSIntArray = require('./types/SFSIntArray');
const SFSLongArray = require('./types/SFSLongArray');
const SFSFloatArray = require('./types/SFSFloatArray');
const SFSDoubleArray = require('./types/SFSDoubleArray');
const SFSStringArray = require('./types/SFSStringArray');
const SFSArray = require('./types/SFSArray');
const SFSObject = require('./types/SFSObject');

class DataTypes {

    static getFromType(type) {
        switch (type) {
            case DataTypes.NULL:
                return SFSNull;
            case DataTypes.BOOLEAN:
                return SFSBoolean;
            case DataTypes.BYTE:
                return SFSByte;
            case DataTypes.SHORT:
                return SFSShort;
            case DataTypes.INT:
                return SFSInt;
            case DataTypes.LONG:
                return SFSLong;
            case DataTypes.FLOAT:
                return SFSFloat;
            case DataTypes.DOUBLE:
                return SFSDouble;
            case DataTypes.STRING:
                return SFSString;
            case DataTypes.BOOLEAN_ARRAY:
                return SFSBooleanArray;
            case DataTypes.BYTE_ARRAY:
                return SFSByteArray;
            case DataTypes.SHORT_ARRAY:
                return SFSShortArray;
            case DataTypes.INT_ARRAY:
                return SFSIntArray;
            case DataTypes.LONG_ARRAY:
                return SFSLongArray;
            case DataTypes.FLOAT_ARRAY:
                return SFSFloatArray;
            case DataTypes.DOUBLE_ARRAY:
                return SFSDoubleArray;
            case DataTypes.STRING_ARRAY:
                return SFSStringArray;
            case DataTypes.SFS_ARRAY:
                return SFSArray;
            case DataTypes.SFS_OBJECT:
                return SFSObject;
        }
        throw "Unknown DataType " + type;
    }

    static create(type, value) {
        return DataTypes.getFromType(type).create(value);
    }

    static get NULL() {
        return SFSNull.getType();
    }

    static get BOOLEAN() {
        return SFSBoolean.getType();
    }

    static get BYTE() {
        return SFSByte.getType();
    }

    static get SHORT() {
        return SFSShort.getType();
    }

    static get INT() {
        return SFSInt.getType();
    }

    static get LONG() {
        return SFSLong.getType();
    }

    static get FLOAT() {//16bits
        return SFSFloat.getType();
    }

    static get DOUBLE() {//32bits
        return SFSDouble.getType();
    }

    static get STRING() {
        return SFSString.getType();
    }

    static get BOOLEAN_ARRAY() {
        return SFSBooleanArray.getType();
    }

    static get BYTE_ARRAY() {
        return SFSByteArray.getType();
    }

    static get SHORT_ARRAY() {
        return SFSShortArray.getType();
    }

    static get INT_ARRAY() {
        return SFSIntArray.getType();
    }

    static get LONG_ARRAY() {
        return SFSLongArray.getType();
    }

    static get FLOAT_ARRAY() {
        return SFSFloatArray.getType();
    }

    static get DOUBLE_ARRAY() {
        return SFSDoubleArray.getType();
    }

    static get STRING_ARRAY() {
        return SFSStringArray.getType();
    }

    static get SFS_ARRAY() {
        return SFSArray.getType();
    }

    static get SFS_OBJECT() {
        return SFSObject.getType();
    }
}

module.exports = {
    DataTypes,
    SFSNull,
    SFSBoolean,
    SFSByte,
    SFSShort,
    SFSInt,
    SFSLong,
    SFSFloat,
    SFSDouble,
    SFSString,
    SFSBooleanArray,
    SFSByteArray,
    SFSShortArray,
    SFSIntArray,
    SFSLongArray,
    SFSFloatArray,
    SFSDoubleArray,
    SFSStringArray,
    SFSArray,
    SFSObject
};