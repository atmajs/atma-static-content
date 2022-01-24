import { str_escape } from './str';


export function send_toHttpError(mix: number | Error, message?: string) {
    if (typeof mix === 'number') {
        return fromStatusCode(mix, message);
    }
    return fromError(mix);
};
export function send_error(res, error) {
    let httpError = fromError(error);

    res.writeHead(httpError.code, {
        'Content-Type': 'text/plain'
    });
    res.end(httpError.message);
};
export function send_headersWritable(res) {
    let sent = res._headerSent;
    if (typeof sent === 'boolean')
        return sent === false;

    return trySet(res, 'X-Powered-By', 'AtmaNode');
};
export function send_redirect(res, path) {
    res.statusCode = 301;
    res.setHeader('Location', path);
    res.end('Redirecting to ' + str_escape(path));
};

interface IError extends Error {
    code?: number
}

function fromStatusCode(code, message?) {
    if (message == null) {
        if (STATUS_CODES == null)
            STATUS_CODES = require('http').STATUS_CODES;

        message = STATUS_CODES[code];
    }
    let error: IError = new Error(message);
    error.code = code;
    return error;
}
function fromError(error) {
    if (typeof error === 'number')
        return fromStatusCode(error);

    let code = error.code,
        message = error.message;
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
    } catch (error) {
        return false;
    }
}

let STATUS_CODES;
