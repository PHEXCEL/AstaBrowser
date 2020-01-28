"use strict";
exports.__esModule = true;
var Level = /** @class */ (function () {
    function Level(baseUrl) {
        // Please keep properties in alphabetical order
        this.endCC = 0;
        this.endSN = 0;
        this.fragments = [];
        this.initSegment = null;
        this.live = true;
        this.needSidxRanges = false;
        this.startCC = 0;
        this.startSN = 0;
        this.startTimeOffset = null;
        this.targetduration = 0;
        this.totalduration = 0;
        this.type = null;
        this.url = baseUrl;
        this.version = null;
    }
    Object.defineProperty(Level.prototype, "hasProgramDateTime", {
        get: function () {
            return !!(this.fragments[0] && Number.isFinite(this.fragments[0].programDateTime));
        },
        enumerable: true,
        configurable: true
    });
    return Level;
}());
exports["default"] = Level;
