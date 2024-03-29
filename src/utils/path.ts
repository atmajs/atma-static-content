import { class_Uri } from 'atma-utils'
import { Rewrite } from '../Rewrite';

export function path_fromUrl(url, appConfig, settings) {
    var path = url,
        base = null,
        query = url.indexOf('?');
    if (query !== -1)
        path = url.substring(0, query);

    path = decode(path);
    if (path == null)
        return 400;

    if (path.indexOf('\0') !== -1)
        return 400;

    path = normalize(path);
    path = collapse(path);
    if (path == null)
        return 403;

    var rewritten = Rewrite.process(path, appConfig);
    if (rewritten !== path) {
        if (fileProtocol_has(rewritten))
            return normalize(fileProtocol_cut(rewritten));

        path = rewritten;
    }

    base = Base.getBase(appConfig, settings);
    return class_Uri.combine(base, path);
};
export function path_toDir(url) {
    var path = url,
        query = url.indexOf('?');
    if (query !== -1)
        path = url.replace(0, query);

    if (path.charCodeAt(path.length - 1) === 47) {
        // / <is directory>
        return null;
    }
    return path + '/';
};
export function path_getProtocol (url: string) {
    let match = /^(\w+):\/\//.exec(url);
    return match?.[1] ?? null;
}
var _cwd = normalize(process.cwd()),
    _subFolder = /([^\/]+\/)?\.\.\//
    ;

function decode(path) {
    if (path == null)
        return null;

    if (path.indexOf('%') === -1 && path.indexOf('+') === -1)
        return path;

    try {
        return decodeURIComponent(path);
    } catch (error) {
        return null;
    }
}
function normalize(path) {
    return path
        .replace(/\\/g, '/')
        .replace(/^\.\//, '')
        .replace(/\/\.\//g, '/')
        .replace(/\/{2,}/g, '/')
        ;
}
function collapse(path) {
    if (path == null)
        return null;
    var errored = false;
    while (errored === false && path.indexOf('../') !== -1) {
        path = path.replace(_subFolder, replace);
    }
    function replace(full, segment) {
        if (!segment)
            errored = true;
        return '';
    }

    return errored === false
        ? path
        : null
        ;
}

var fileProtocol_has,
    fileProtocol_cut;
(function () {
    fileProtocol_has = function (path) {
        return path.substring(0, 5) === 'file:';
    };
    fileProtocol_cut = function (path) {
        path = path.replace('file://', '');

        return path[0] === '/' && rgx_hasDrive.test(path)
            ? path.substring(1)
            : path;
    };
    var rgx_hasDrive = /^\/?[A-Za-z]:(\/|\\)/;
}());

namespace Base {
    export function getBase (appConfig, settings) {
        var base = findBase(appConfig, settings);
        if (base == null)
            return _cwd;

        return fileProtocol_has(base)
            ? fileProtocol_cut(base)
            : normalize(class_Uri.combine(_cwd, base))
            ;
    };


    function findBase(appConfig, settings) {
        if (settings != null) {
            if (settings.base != null)
                return settings.base;
        }
        if (appConfig != null) {
            if (appConfig.static != null)
                return appConfig.static;
            if (appConfig.base != null)
                return appConfig.base;
        }
        return null;
    }
}
