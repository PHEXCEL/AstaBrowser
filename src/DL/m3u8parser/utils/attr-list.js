"use strict";
exports.__esModule = true;
var DECIMAL_RESOLUTION_REGEX = /^(\d+)x(\d+)$/; // eslint-disable-line no-useless-escape
var ATTR_LIST_REGEX = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g; // eslint-disable-line no-useless-escape
// adapted from https://github.com/kanongil/node-m3u8parse/blob/master/attrlist.js
var AttrList = /** @class */ (function () {
    function AttrList(attrs) {
        if (typeof attrs === 'string') {
            attrs = AttrList.parseAttrList(attrs);
        }
        for (var attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                this[attr] = attrs[attr];
            }
        }
    }
    AttrList.prototype.decimalInteger = function (attrName) {
        var intValue = parseInt(this[attrName], 10);
        if (intValue > Number.MAX_SAFE_INTEGER) {
            return Infinity;
        }
        return intValue;
    };
    AttrList.prototype.hexadecimalInteger = function (attrName) {
        if (this[attrName]) {
            var stringValue = (this[attrName] || '0x').slice(2);
            stringValue = ((stringValue.length & 1) ? '0' : '') + stringValue;
            var value = new Uint8Array(stringValue.length / 2);
            for (var i = 0; i < stringValue.length / 2; i++) {
                value[i] = parseInt(stringValue.slice(i * 2, i * 2 + 2), 16);
            }
            return value;
        }
        else {
            return null;
        }
    };
    AttrList.prototype.hexadecimalIntegerAsNumber = function (attrName) {
        var intValue = parseInt(this[attrName], 16);
        if (intValue > Number.MAX_SAFE_INTEGER) {
            return Infinity;
        }
        return intValue;
    };
    AttrList.prototype.decimalFloatingPoint = function (attrName) {
        return parseFloat(this[attrName]);
    };
    AttrList.prototype.enumeratedString = function (attrName) {
        return this[attrName];
    };
    AttrList.prototype.decimalResolution = function (attrName) {
        var res = DECIMAL_RESOLUTION_REGEX.exec(this[attrName]);
        if (res === null) {
            return undefined;
        }
        return {
            width: parseInt(res[1], 10),
            height: parseInt(res[2], 10)
        };
    };
    AttrList.parseAttrList = function (input) {
        var match, attrs = {};
        ATTR_LIST_REGEX.lastIndex = 0;
        while ((match = ATTR_LIST_REGEX.exec(input)) !== null) {
            var value = match[2], quote = '"';
            if (value.indexOf(quote) === 0 &&
                value.lastIndexOf(quote) === (value.length - 1)) {
                value = value.slice(1, -1);
            }
            attrs[match[1]] = value;
        }
        return attrs;
    };
    return AttrList;
}());
exports["default"] = AttrList;
