"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.res_writeHeaders = exports.res_hasWritableHeaders = void 0;
function res_hasWritableHeaders(res) {
    var sent = res._headerSent;
    if (typeof sent === 'boolean')
        return sent === false;
    return trySet(res, 'X-Powered-By', 'AtmaNode');
}
exports.res_hasWritableHeaders = res_hasWritableHeaders;
;
function res_writeHeaders(res, headers) {
    for (var key in headers) {
        var val = headers[key];
        if (val != null) {
            res.setHeader(key, val);
        }
    }
}
exports.res_writeHeaders = res_writeHeaders;
;
function trySet(res, name, val) {
    try {
        res.setHeader(name, val);
        return true;
    }
    catch (error) {
        return false;
    }
}
