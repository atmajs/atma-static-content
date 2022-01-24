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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File_Stream = void 0;
var File_Static_1 = require("./File_Static");
var fs_1 = __importDefault(require("fs"));
var File_Stream = /** @class */ (function (_super) {
    __extends(File_Stream, _super);
    function File_Stream() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.maxAge = 60 * 30;
        _this.statsCompleted = null;
        return _this;
    }
    File_Stream.prototype.write = function (req, res, settings) {
        var range = Range.tryGet(this, req);
        if (range != null) {
            Range.write(this, range, res);
            return;
        }
        res.setHeader('Accept-Ranges', 'bytes');
        _super.prototype.write.call(this, req, res, settings);
    };
    File_Stream.prototype.writeBody = function (res, encoding, settings) {
        var options = {
            flags: 'r',
            start: null,
            end: null,
        };
        if (settings != null && settings.start != null) {
            var range = Range.toRange(settings.start, settings.end, this.size);
            if (range[1] >= range[0]) {
                options.start = range[0];
                options.end = range[1];
            }
        }
        var stream = fs_1.default.createReadStream(this.path, options);
        var streamDispose = stream.destroy.bind(stream);
        var resDispose = res.destroy.bind(res);
        stream
            .on('close', resDispose)
            .on('error', resDispose)
            .pipe(res)
            .on('close', streamDispose)
            .on('error', streamDispose);
    };
    return File_Stream;
}(File_Static_1.File_Static));
exports.File_Stream = File_Stream;
;
var Range;
(function (Range) {
    function tryGet(file, req) {
        var range = req.headers.range;
        if (range == null)
            return null;
        var ifRange = req.headers['if-range'];
        if (ifRange != null && isModified(ifRange, file))
            return null;
        var parts = /bytes=(\d+)?-(\d+)?$/.exec(range);
        if (parts == null)
            return null;
        return this.toRange(+parts[1], +parts[2], file.size);
    }
    Range.tryGet = tryGet;
    ;
    function toRange(start, end, size) {
        if (isNaN(start)) {
            if (isNaN(end) === false) {
                start = size - end;
                end = size - 1;
            }
            else {
                start = 0;
            }
        }
        if (isNaN(end))
            end = size - 1;
        if (end > size - 1) {
            //- end = -1; not an error, adjust range:
            end = size - 1;
        }
        if (end < start)
            end = -1;
        return [start, end];
    }
    Range.toRange = toRange;
    function write(file, range, res) {
        if (range[1] === -1) {
            res.writeHead(416, {
                'Content-Type': 'text/plain',
                'Content-Range': 'bytes */' + file.size
            });
            res.end('Requested Range Not Satisfiable');
            return;
        }
        var start = range[0], end = range[1];
        var size = end - start + 1, headers = {
            'Connection': 'keep-alive',
            'Cache-Control': 'public; max-age=' + file.maxAge,
            'Content-Type': file.mimeType,
            'Content-Transfer-Encoding': 'binary',
            'Content-Length': size,
            'Content-Disposition': 'inline; filename=' + file.getFilename() + ';',
            'Status': '206 Partial Content',
            'Accept-Ranges': 'bytes',
            'Content-Range': 'bytes ' + start + '-' + end + '/' + file.size
        };
        if (this.etag != null)
            headers['ETag'] = this.etag;
        if (this.modified != null)
            headers['Last-Modified'] = this.modified.toUTCString();
        res.writeHead(206, headers);
        if (start > 0 && file.mimeType === 'video/x-flv')
            res.write('FLV' + pack('CCNN', 1, 5, 9, 9));
        fs_1.default
            .createReadStream(file.path, {
            flags: 'r',
            start: start,
            end: end
        })
            .pipe(res);
    }
    Range.write = write;
    ;
    function isModified(mix, file) {
        var isETag = mix.indexOf('"') !== -1;
        if (isETag && file.etag != null)
            return file.etag.indexOf(mix) === -1;
        if (!isETag && file.modified != null) {
            return Date.parse(file.modified) > Date.parse(mix);
        }
        return true;
    }
    // A tiny subset of http://phpjs.org/functions/pack:880
    function pack(format) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var result = '';
        var fromCode = String.fromCharCode;
        var imax = args.length;
        var i = -1;
        while (++i < imax) {
            if (format[i] === 'N') {
                result += fromCode(args[i] >> 24 & 0xFF)
                    + fromCode(args[i] >> 16 & 0xFF)
                    + fromCode(args[i] >> 8 & 0xFF)
                    + fromCode(args[i] & 0xFF);
                continue;
            }
            result += fromCode(args[i]);
        }
        return result;
    }
})(Range || (Range = {}));
;
