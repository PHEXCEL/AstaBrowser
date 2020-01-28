"use strict";
exports.__esModule = true;
function getSelfScope() {
    // see https://stackoverflow.com/a/11237259/589493
    if (typeof window === 'undefined') {
        /* eslint-disable-next-line no-undef */
        return this;
    }
    else {
        return window;
    }
}
exports.getSelfScope = getSelfScope;
