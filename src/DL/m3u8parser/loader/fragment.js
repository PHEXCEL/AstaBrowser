"use strict";
exports.__esModule = true;
var url_toolkit_1 = require("url-toolkit");
var logger_1 = require("../utils/logger");
var level_key_1 = require("./level-key");
var ElementaryStreamTypes;
(function (ElementaryStreamTypes) {
    ElementaryStreamTypes["AUDIO"] = "audio";
    ElementaryStreamTypes["VIDEO"] = "video";
})(ElementaryStreamTypes = exports.ElementaryStreamTypes || (exports.ElementaryStreamTypes = {}));
var Fragment = /** @class */ (function () {
    function Fragment() {
        var _a;
        this._url = null;
        this._byteRange = null;
        this._decryptdata = null;
        // Holds the types of data this fragment supports
        this._elementaryStreams = (_a = {},
            _a[ElementaryStreamTypes.AUDIO] = false,
            _a[ElementaryStreamTypes.VIDEO] = false,
            _a);
        // deltaPTS tracks the change in presentation timestamp between fragments
        this.deltaPTS = 0;
        this.rawProgramDateTime = null;
        this.programDateTime = null;
        this.title = null;
        this.tagList = [];
        // sn notates the sequence number for a segment, and if set to a string can be 'initSegment'
        this.sn = 0;
        this.urlId = 0;
        // level matches this fragment to a index playlist
        this.level = 0;
    }
    // setByteRange converts a EXT-X-BYTERANGE attribute into a two element array
    Fragment.prototype.setByteRange = function (value, previousFrag) {
        var params = value.split('@', 2);
        var byteRange = [];
        if (params.length === 1) {
            byteRange[0] = previousFrag ? previousFrag.byteRangeEndOffset : 0;
        }
        else {
            byteRange[0] = parseInt(params[1]);
        }
        byteRange[1] = parseInt(params[0]) + byteRange[0];
        this._byteRange = byteRange;
    };
    Object.defineProperty(Fragment.prototype, "url", {
        get: function () {
            if (!this._url && this.relurl) {
                this._url = url_toolkit_1.buildAbsoluteURL(this.baseurl, this.relurl, { alwaysNormalize: true });
            }
            return this._url;
        },
        set: function (value) {
            this._url = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fragment.prototype, "byteRange", {
        get: function () {
            if (!this._byteRange) {
                return [];
            }
            return this._byteRange;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fragment.prototype, "byteRangeStartOffset", {
        /**
         * @type {number}
         */
        get: function () {
            return this.byteRange[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fragment.prototype, "byteRangeEndOffset", {
        get: function () {
            return this.byteRange[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fragment.prototype, "decryptdata", {
        get: function () {
            if (!this.levelkey && !this._decryptdata) {
                return null;
            }
            if (!this._decryptdata && this.levelkey) {
                var sn = this.sn;
                if (typeof sn !== 'number') {
                    // We are fetching decryption data for a initialization segment
                    // If the segment was encrypted with AES-128
                    // It must have an IV defined. We cannot substitute the Segment Number in.
                    if (this.levelkey && this.levelkey.method === 'AES-128' && !this.levelkey.iv) {
                        logger_1.logger.warn("missing IV for initialization segment with method=\"" + this.levelkey.method + "\" - compliance issue");
                    }
                    /*
                    Be converted to a Number.
                    'initSegment' will become NaN.
                    NaN, which when converted through ToInt32() -> +0.
                    ---
                    Explicitly set sn to resulting value from implicit conversions 'initSegment' values for IV generation.
                    */
                    sn = 0;
                }
                this._decryptdata = this.setDecryptDataFromLevelKey(this.levelkey, sn);
            }
            return this._decryptdata;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fragment.prototype, "endProgramDateTime", {
        get: function () {
            if (this.programDateTime === null) {
                return null;
            }
            if (!Number.isFinite(this.programDateTime)) {
                return null;
            }
            var duration = !Number.isFinite(this.duration) ? 0 : this.duration;
            return this.programDateTime + (duration * 1000);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fragment.prototype, "encrypted", {
        get: function () {
            return !!((this.decryptdata && this.decryptdata.uri !== null) && (this.decryptdata.key === null));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {ElementaryStreamTypes} type
     */
    Fragment.prototype.addElementaryStream = function (type) {
        this._elementaryStreams[type] = true;
    };
    /**
     * @param {ElementaryStreamTypes} type
     */
    Fragment.prototype.hasElementaryStream = function (type) {
        return this._elementaryStreams[type] === true;
    };
    /**
     * Utility method for parseLevelPlaylist to create an initialization vector for a given segment
     * @param {number} segmentNumber - segment number to generate IV with
     * @returns {Uint8Array}
     */
    Fragment.prototype.createInitializationVector = function (segmentNumber) {
        var uint8View = new Uint8Array(16);
        for (var i = 12; i < 16; i++) {
            uint8View[i] = (segmentNumber >> 8 * (15 - i)) & 0xff;
        }
        return uint8View;
    };
    /**
     * Utility method for parseLevelPlaylist to get a fragment's decryption data from the currently parsed encryption key data
     * @param levelkey - a playlist's encryption info
     * @param segmentNumber - the fragment's segment number
     * @returns {LevelKey} - an object to be applied as a fragment's decryptdata
     */
    Fragment.prototype.setDecryptDataFromLevelKey = function (levelkey, segmentNumber) {
        var decryptdata = levelkey;
        if (levelkey && levelkey.method && levelkey.uri && !levelkey.iv) {
            decryptdata = new level_key_1["default"](levelkey.baseuri, levelkey.reluri);
            decryptdata.method = levelkey.method;
            decryptdata.iv = this.createInitializationVector(segmentNumber);
        }
        return decryptdata;
    };
    return Fragment;
}());
exports["default"] = Fragment;
