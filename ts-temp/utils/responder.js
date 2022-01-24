"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responder_sendResource = exports.responder_create = void 0;
var atma_utils_1 = require("atma-utils");
var entry_1 = require("../Entry/entry");
var MimeTypes_1 = require("../MimeTypes");
var path_1 = require("./path");
var send_1 = require("./send");
var dependency_1 = require("../dependency");
function responder_create(settings) {
    if (settings.mimeTypes)
        MimeTypes_1.MimeTypes.registerMimeTypes(settings.mimeTypes);
    if (settings.extensions)
        MimeTypes_1.MimeTypes.registerExtensions(settings.extensions);
    if (settings.defaultMimeType)
        MimeTypes_1.MimeTypes.setDefault(settings.defaultMimeType);
    return function (req, res, appConfig) {
        var mix = (0, path_1.path_fromUrl)(req.url, appConfig, settings);
        if (typeof mix === 'number') {
            var dfr = new atma_utils_1.class_Dfr;
            return resp_reject(settings, req.url, req, res, dfr, { code: mix });
        }
        var path = mix;
        return respFile(path, req, res, settings, appConfig);
    };
}
exports.responder_create = responder_create;
;
function responder_sendResource(path, req, res) {
    var _a;
    var protocol = (_a = (0, path_1.path_getProtocol)(path)) !== null && _a !== void 0 ? _a : 'file';
    if (protocol === 'file') {
        var uri = new dependency_1.File(path).uri.toString();
        return respFile(uri, req, res);
    }
    throw new Error('Other protocols are not supported yet.');
}
exports.responder_sendResource = responder_sendResource;
;
function respFile(path, req, res, settings, appConfig) {
    var dfr = new atma_utils_1.class_Dfr;
    if (res.writable === false || res.finished === true) {
        return resp_reject(settings, path, req, res, dfr, Error('Stream is not writable'));
    }
    if ((0, send_1.send_headersWritable)(res) === false) {
        return resp_reject(settings, path, req, res, dfr, Error("Can't set headers after they are sent."));
    }
    (0, entry_1.entry_get)(path, req)
        .done(function (entry) {
        entry.write(req, res, settings);
        dfr.resolve();
    })
        .fail(function (error) {
        if (error.code === 'EISDIR') {
            resp_rejectDirectory(settings, path, req, res, dfr, error);
            return;
        }
        resp_reject(settings, path, req, res, dfr, error);
    });
    return dfr;
}
function resp_rejectDirectory(settings, path, req, res, dfr, error) {
    if (settings.handleDirectory) {
        path = (0, path_1.path_toDir)(req.url);
        if (path != null) {
            // /
            (0, send_1.send_redirect)(res, path);
            dfr.resolve();
            return;
        }
        resp_reject(settings, path, req, res, dfr, 403);
        return;
    }
    resp_reject(settings, path, req, res, dfr, error);
}
function resp_reject(settings, path, req, res, dfr, error) {
    if (settings.handleErrors) {
        (0, send_1.send_error)(res, error);
        return dfr.resolve();
    }
    return dfr.reject(error);
}
