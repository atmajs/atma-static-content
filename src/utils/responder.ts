import { class_Dfr, class_Uri } from 'atma-utils';
import { entry_get } from '../Entry/entry';
import { MimeTypes } from '../MimeTypes';
import { path_fromUrl, path_getProtocol, path_toDir } from './path';
import { send_error, send_headersWritable, send_redirect } from './send';
import { File } from '../dependency'

export function responder_create(settings) {

    if (settings.mimeTypes)
        MimeTypes.registerMimeTypes(settings.mimeTypes);

    if (settings.extensions)
        MimeTypes.registerExtensions(settings.extensions);

    if (settings.defaultMimeType)
        MimeTypes.setDefault(settings.defaultMimeType);

    return function (req, res, appConfig) {
        let mix = path_fromUrl(req.url, appConfig, settings);
        if (typeof mix === 'number') {
            let dfr = new class_Dfr;
            return  resp_reject(settings, req.url, req, res, dfr, { code: mix });
        }

        let path: string = mix;
        return respFile(path, req, res, settings, appConfig);
    };
};

export function responder_sendResource (path, req, res) {
    let protocol = path_getProtocol(path) ?? 'file';
    if (protocol === 'file') {
        let uri = new File(path).uri.toString();
        return respFile(uri, req, res);
    }
    throw new Error('Other protocols are not supported yet.');
};

function respFile (path, req, res, settings?, appConfig?) {
    let dfr = new class_Dfr;

    if (res.writable === false || res.finished === true) {
        return  resp_reject(settings, path, req, res, dfr, Error('Stream is not writable'));
    }
    if (send_headersWritable(res) === false) {
        return  resp_reject(settings, path, req, res, dfr, Error("Can't set headers after they are sent."));
    }

    entry_get(path, req)
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
        })
        ;
    return dfr;
}

function resp_rejectDirectory(settings, path, req, res, dfr, error) {
    if (settings.handleDirectory) {
        path = path_toDir(req.url);
        if (path != null) {
            // /
            send_redirect(res, path);
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
        send_error(res, error);
        return dfr.resolve();
    }
    return dfr.reject(error);
}
