"use strict";
exports.__esModule = true;
var get_self_scope_1 = require("./get-self-scope");
function noop() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
}
var fakeLogger = {
    trace: noop,
    debug: noop,
    log: noop,
    warn: noop,
    info: noop,
    error: noop
};
var exportedLogger = fakeLogger;
// let lastCallTime;
// function formatMsgWithTimeInfo(type, msg) {
//   const now = Date.now();
//   const diff = lastCallTime ? '+' + (now - lastCallTime) : '0';
//   lastCallTime = now;
//   msg = (new Date(now)).toISOString() + ' | [' +  type + '] > ' + msg + ' ( ' + diff + ' ms )';
//   return msg;
// }
function formatMsg(type, msg) {
    msg = '[' + type + '] > ' + msg;
    return msg;
}
var global = get_self_scope_1.getSelfScope();
function consolePrintFn(type) {
    var func = global.console[type];
    if (func) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args[0]) {
                args[0] = formatMsg(type, args[0]);
            }
            func.apply(global.console, args);
        };
    }
    return noop;
}
function exportLoggerFunctions(debugConfig) {
    var functions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        functions[_i - 1] = arguments[_i];
    }
    functions.forEach(function (type) {
        exportedLogger[type] = debugConfig[type] ? debugConfig[type].bind(debugConfig) : consolePrintFn(type);
    });
}
exports.enableLogs = function (debugConfig) {
    // check that console is available
    if ((global.console && debugConfig === true) || typeof debugConfig === 'object') {
        exportLoggerFunctions(debugConfig, 
        // Remove out from list here to hard-disable a log-level
        // 'trace',
        'debug', 'log', 'info', 'warn', 'error');
        // Some browsers don't allow to use bind on console object anyway
        // fallback to default if needed
        try {
            exportedLogger.log();
        }
        catch (e) {
            exportedLogger = fakeLogger;
        }
    }
    else {
        exportedLogger = fakeLogger;
    }
};
exports.logger = exportedLogger;
