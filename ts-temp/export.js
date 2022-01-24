"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticContent = void 0;
var dependency_1 = require("./dependency");
var entry_1 = require("./Entry/entry");
var express_send_1 = require("./interfaces/express_send");
var path_1 = require("./utils/path");
var responder_1 = require("./utils/responder");
var send_1 = require("./utils/send");
exports.StaticContent = {
    create: createMiddleware,
    respond: createMiddleware(),
    sendResource: responder_1.responder_sendResource,
    send: express_send_1.interface_express_send,
    Cache: {
        state: entry_1.entry_cache_state,
        remove: entry_1.entry_cache_remove
    },
    on: dependency_1.__eventStream.on.bind(dependency_1.__eventStream),
    off: dependency_1.__eventStream.off.bind(dependency_1.__eventStream),
    utils: {
        /* (url, config, ?settings) */
        resolvePath: path_1.path_fromUrl
    }
};
/*
 * staticContentSettings {
   mimeTypes: { mimeType: extensions }
   extensions: {
       extension: mimeTypeString || {
           mimeType: string
           encoding: string
           cacheControl: Number
           maxAge: Number
       }
   },
   defaultMimeType: string,

   // do not send errors on 404, but continue the middleware pipeline
   silentNotFound: Boolean
 }
*/
function createMiddleware(settings) {
    if (settings === void 0) { settings = {}; }
    var responder = (0, responder_1.responder_create)(settings);
    return function (req, res, next) {
        // make it connectjs middleware compatible
        var config = arguments.length > 3
            ? arguments[3]
            : null;
        responder(req, res, config)
            .fail(function (error) {
            if (next != null) {
                error = (0, send_1.send_toHttpError)(error);
                if (error.code === 404 && settings.silentNotFound !== false)
                    error = null;
                next(error);
                return;
            }
            (0, send_1.send_error)(res, error);
        });
    };
}
