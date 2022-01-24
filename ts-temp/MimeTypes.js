"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MimeTypes = void 0;
exports.MimeTypes = {
    resolveByPath: function (path) {
        var dot = path.lastIndexOf('.');
        if (dot === -1)
            return _defaultMime;
        return this.resolveByExt(path.substring(dot + 1));
    },
    resolveByExt: function (ext) {
        return _mimes[ext] || _defaultMime;
    },
    isString: function (mimeType) {
        if (mimeType.indexOf('text/') === 0)
            return true;
        if (mimeType.indexOf('xml') !== -1)
            return true;
        return _stringMimes.hasOwnProperty(mimeType);
    },
    writeHead: function (res, mimeType) {
        var str = mimeType + (this.isString(mimeType)
            ? '; charset=UTF-8'
            : '');
        res.setHeader('Content-Type', str);
    },
    setDefault: function (mimeType) {
        _defaultMime = mimeType;
    },
    /* { MimeTypeString: ExtensionString || [ExtensionString] } */
    registerMimeTypes: function (mimeTypes) {
        var val, mimeType;
        for (mimeType in mimeTypes) {
            val = mimeTypes[mimeType];
            if (typeof val === 'string') {
                _mimes[val] = mimeType;
                continue;
            }
            if (Array.isArray(val)) {
                var i = -1, imax = val.length;
                while (++i < imax) {
                    _mimes[val[i]] = mimeType;
                }
            }
        }
    },
    /* { ExtensionString: MimeTypeString || {mimeType: MimeTypeString, encoding: } } */
    registerExtensions: function (extensions) {
        var val, ext;
        for (ext in extensions) {
            val = extensions[ext];
            if (typeof val === 'string') {
                _mimes[ext] = val;
                continue;
            }
            if (val == null || typeof val !== 'object')
                continue;
            if (val.mimeType) {
                _mimes[ext] = val.mimeType;
                if (val.encoding && /utf\-?8/i.test(val.encoding))
                    _stringMimes[val.mimeType] = 1;
            }
        }
    }
};
//== private
var _defaultMime = 'application/octet-stream';
var _mimes = [
//import data/MimeTypes.yml
][0];
var _stringMimes = {
    'application/javascript': 1,
    'application/x-javascript': 1,
    'application/json': 1
};
