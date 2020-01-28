"use strict";
exports.__esModule = true;
/**
 * `type` property values for this loaders' context object
 * @enum
 *
 */
var PlaylistContextType;
(function (PlaylistContextType) {
    PlaylistContextType["MANIFEST"] = "manifest";
    PlaylistContextType["LEVEL"] = "level";
    PlaylistContextType["AUDIO_TRACK"] = "audioTrack";
    PlaylistContextType["SUBTITLE_TRACK"] = "subtitleTrack";
})(PlaylistContextType = exports.PlaylistContextType || (exports.PlaylistContextType = {}));
/**
 * @enum {string}
 */
var PlaylistLevelType;
(function (PlaylistLevelType) {
    PlaylistLevelType["MAIN"] = "main";
    PlaylistLevelType["AUDIO"] = "audio";
    PlaylistLevelType["SUBTITLE"] = "subtitle";
})(PlaylistLevelType = exports.PlaylistLevelType || (exports.PlaylistLevelType = {}));
