"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_redirect = exports.send_headersWritable = exports.send_error = exports.send_toHttpError = void 0;
function send_toHttpError(mix, message) {
    if (typeof mix === 'number') {
        return fromStatusCode(mix, message);
    }
    return fromError(mix);
}
exports.send_toHttpError = send_toHttpError;
;
function send_error(res, error) {
    var httpError = fromError(error);
    res.writeHead(httpError.code, {
        'Content-Type': 'text/plain'
    });
    res.end(httpError.message);
}
exports.send_error = send_error;
;
function send_headersWritable(res) {
    var sent = res._headerSent;
    if (typeof sent === 'boolean')
        return sent === false;
    return trySet(res, 'X-Powered-By', 'AtmaNode');
}
exports.send_headersWritable = send_headersWritable;
;
function send_redirect(res, path) {
    res.statusCode = 301;
    res.setHeader('Location', path);
    res.end('Redirecting to ' + str_escape(path));
}
exports.send_redirect = send_redirect;
;
function fromStatusCode(code, message) {
    if (message == null) {
        if (STATUS_CODES == null)
            STATUS_CODES = require('http').STATUS_CODES;
        message = STATUS_CODES[code];
    }
    var error = new Error(message);
    error.code = code;
    return error;
}
function fromError(error) {
    if (typeof error === 'number')
        return fromStatusCode(error);
    var code = error.code, message = error.message;
    if (code == null)
        code = 500;
    if (typeof code === 'string') {
        switch (code) {
            case 'ENOENT':
            case 'ENAMETOOLONG':
            case 'ENOTDIR':
            case 'ENOTFILE':
                code = 404;
                message = null;
                break;
            default:
                code = 500;
                break;
        }
    }
    return fromStatusCode(code, message);
}
function trySet(res, key, val) {
    try {
        res.setHeader(key, val);
        return true;
    }
    catch (error) {
        return false;
    }
}
var STATUS_CODES;
function str_escape(path) {
    throw new Error('Function not implemented.');
}
