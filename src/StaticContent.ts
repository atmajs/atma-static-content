import { __eventStream } from './dependency';
import { entry_cache_state, entry_cache_remove } from './Entry/entry';
import { interface_express_send } from './interfaces/express_send';
import { path_fromUrl } from './utils/path';
import { responder_create, responder_sendResource } from './utils/responder';
import { send_error, send_toHttpError } from './utils/send';


export const StaticContent = {
    create: createMiddleware,
    respond: createMiddleware(),
    sendResource: responder_sendResource,

    send: interface_express_send,

    Cache: {
        state: entry_cache_state,
        remove: entry_cache_remove
    },

    on:  __eventStream.on.bind(__eventStream),
    off: __eventStream.off.bind(__eventStream),

    utils: {
        /* (url, config, ?settings) */
        resolvePath: path_fromUrl
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


function createMiddleware(settings: any = {}) {

    var responder = responder_create(settings);
    return function(req, res, next){
        // make it connectjs middleware compatible
        var config = arguments.length > 3
            ? arguments[3]
            : null;

        responder(req, res, config)
            .fail(function(error) {
                if (next != null) {
                    error = send_toHttpError(error);
                    if (error.code === 404 && settings.silentNotFound !== false)
                        error = null;

                    next(error);
                    return;
                }
                send_error(res, error);
            });
    };
}
