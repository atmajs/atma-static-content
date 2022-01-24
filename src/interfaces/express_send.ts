import { class_EventEmitter, obj_defaults } from 'atma-utils';
import { responder_create } from '../utils/responder';
import { send_toHttpError } from '../utils/send';


export function interface_express_send (req, url, settings) {
    return new Express(req, url, settings);
};


class Express extends class_EventEmitter {
    settings = null
    appConfig = null
    responder = null
    req = null;

    constructor (req, url, settings) {
        super();

        if (req.url !== url) {
            req.url = url;
        }

        this.req = req;
        this.settings = obj_defaults(settings ?? {}, { maxAge: 0 });
        this.appConfig = convertSettings(this.settings);
        this.responder = responder_create(this.settings);
    }
    maxage (ms) {
        if (Infinity === ms) {
            ms = 60 * 60 * 24 * 365 * 1000;
        }
        this.settings.maxAge = ms / 1000 | 0;
        return this;
    }
    pipe (res) {

        this.settings.handleDirectory = !has(this, 'directory');
        this.settings.handleErrors = !has(this, 'error');

        this
            .responder(this.req, res, this.appConfig)
            .fail((error) => {
                if (error.code === 'EISDIR') {
                    this.trigger('directory', error);
                    return;
                }
                error = send_toHttpError(error);
                error.status = error.code;
                this.trigger('error', error);

            });

        return null;
    }
};

function has(emitter, event) {
    var arr = emitter._listeners[event];
    return arr != null && arr.length > 0;
}
function convertSettings(settings) {
    var config = {
        base: settings.root,
        index: settings.index
    };
    return config;
}
