"use strict";
exports.__esModule = true;
var url_toolkit_1 = require("url-toolkit");
var LevelKey = /** @class */ (function () {
    function LevelKey(baseURI, relativeURI) {
        this._uri = null;
        this.method = null;
        this.key = null;
        this.iv = null;
        this.baseuri = baseURI;
        this.reluri = relativeURI;
    }
    Object.defineProperty(LevelKey.prototype, "uri", {
        get: function () {
            if (!this._uri && this.reluri) {
                this._uri = url_toolkit_1.buildAbsoluteURL(this.baseuri, this.reluri, { alwaysNormalize: true });
            }
            return this._uri;
        },
        enumerable: true,
        configurable: true
    });
    return LevelKey;
}());
exports["default"] = LevelKey;
