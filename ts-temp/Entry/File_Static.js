"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.File_Static = void 0;
var MimeTypes_1 = require("../MimeTypes");
var file_1 = require("../utils/file");
var res_1 = require("../utils/res");
var dependency_1 = require("../dependency");
var atma_utils_1 = require("atma-utils");
var File_Static = /** @class */ (function (_super) {
    __extends(File_Static, _super);
    function File_Static(path, mimeType, req) {
        var _this = _super.call(this) || this;
        _this.path = null;
        _this.mimeType = null;
        _this.modified = null;
        _this.etag = null;
        _this.maxAge = 60;
        _this.size = null;
        /*
         * Is implemented only in File_String
         */
        _this.gzip = null;
        _this.content = null;
        _this.path = path;
        _this.mimeType = mimeType;
        _this.getStats(req, function (stats) { var _a; return (_a = _this.statsCompleted) === null || _a === void 0 ? void 0 : _a.call(_this, stats); });
        return _this;
    }
    File_Static.prototype.write = function (req, res, settings) {
        // weak caching
        if (this.etag != null) {
            res.setHeader('ETag', this.etag);
        }
        if (this.modified != null) {
            res.setHeader('Last-Modified', this.modified.toUTCString());
        }
        // strong caching
        var maxAge = settings.maxAge == null
            ? this.maxAge
            : settings.maxAge;
        if (maxAge != null) {
            res.setHeader('Cache-Control', 'public, max-age=' + maxAge);
        }
        // content
        var encoding = this.getEncoding(req), length = this.getLength(encoding);
        if (encoding != null) {
            res.setHeader('Content-Encoding', encoding);
            res.setHeader('X-Decompressed-Content-Length', this.getLength(null));
        }
        if (settings.headers != null) {
            (0, res_1.res_writeHeaders)(res, settings.headers);
        }
        if (this.isNotModified(req)) {
            res.statusCode = 304;
            res.end();
            return;
        }
        MimeTypes_1.MimeTypes.writeHead(res, this.mimeType);
        res.setHeader('Content-Length', length);
        if (req.method === 'HEAD') {
            res.end();
            return;
        }
        this.writeBody(res, encoding, settings);
    };
    File_Static.prototype.writeBody = function (res, encoding, settings) {
        var data = encoding === 'gzip'
            ? this.gzip
            : this.content;
        res.end(data);
    };
    File_Static.prototype.getStats = function (req, cb) {
        var _this = this;
        (0, file_1.file_stats)(this.path, function (error, stat) { return _this.getStatsResult(error, stat, cb, req); });
    };
    File_Static.prototype.getStatsResult = function (error, stat, cb, req) {
        if (error) {
            if (error.code === 'ENOENT') {
                var virtual = dependency_1.File
                    .getFactory()
                    .resolveHandler('file://' + this.path);
                if (virtual != null) {
                    if (cb)
                        return cb(this, {}, req);
                    this.resolve(this);
                }
            }
            this.reject(error);
            return;
        }
        if (stat.isFile() === false) {
            if (stat.isDirectory()) {
                this.reject({ code: 'EISDIR' });
                return;
            }
            this.reject({ code: 'ENOTFILE' });
            return;
        }
        this.etag = calcETag(this.path, stat);
        this.modified = stat.mtime;
        this.size = stat.size;
        if (cb)
            return cb(this, stat, req);
        this.resolve(this);
    };
    File_Static.prototype.getFilename = function () {
        var slash = this.path.lastIndexOf('/');
        return slash === -1
            ? this.path
            : this.path.substring(slash + 1);
    };
    File_Static.prototype.getEncoding = function (req) {
        if (this.gzip == null)
            return null;
        var accept = req.headers['accept-encoding'];
        return accept && /\bgzip\b/.test(accept)
            ? 'gzip'
            : null;
    };
    File_Static.prototype.getLength = function (encoding) {
        if (encoding === 'gzip')
            return this.gzip.length;
        if (this.content == null)
            return this.size || 0;
        if (typeof this.content === 'string')
            return Buffer.byteLength(this.content, 'utf8');
        // assume Buffer or BufferLike content
        return this.content.length;
    };
    File_Static.prototype.isNotModified = function (req) {
        var etag = req.headers['if-none-match'], utc = req.headers['if-modified-since'];
        if (this.etag != null && etag)
            return this.etag === etag;
        if (this.modified != null && utc)
            return this.modified <= Date.parse(utc);
        return false;
    };
    return File_Static;
}(atma_utils_1.class_Dfr));
exports.File_Static = File_Static;
;
var calcETag;
(function () {
    calcETag = function (path, stat) {
        var base64, tag = stat.mtime.getTime()
            + ':'
            + stat.size
            + ':'
            + path;
        if (_crypto == null)
            _crypto = require('crypto');
        base64 = _crypto
            .createHash('md5')
            .update(tag, 'utf8')
            .digest('base64');
        return 'W/"' + base64 + '"';
    };
    var _crypto;
}());
