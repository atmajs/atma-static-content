import { ServerResponse, IncomingMessage } from 'http'
import { MimeTypes } from '../MimeTypes'
import { file_stats } from '../utils/file'
import { res_writeHeaders } from '../utils/res'
import { File } from '../dependency'
import { class_Dfr } from 'atma-utils'

export abstract class File_Static extends class_Dfr {
    path = null
    mimeType = null
    modified = null
    etag = null
    maxAge = 60
    size = null
    /*
     * Is implemented only in File_String
     */
    gzip = null
    content = null

    abstract statsCompleted(stats)

    constructor(path: string, mimeType: string, req: IncomingMessage) {

        super();
        this.path = path;
        this.mimeType = mimeType;

        let onStatsInnerCompleted = this.statsCompleted == null
            ? null
            : stats => this.statsCompleted(stats);

        this.getStats(req, onStatsInnerCompleted);
    }

    write(req: IncomingMessage, res: ServerResponse, settings) {

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
        var encoding = this.getEncoding(req),
            length = this.getLength(encoding)
            ;
        if (encoding != null) {
            res.setHeader('Content-Encoding', encoding);
            res.setHeader('X-Decompressed-Content-Length', this.getLength(null));
        }
        if (settings.headers != null) {
            res_writeHeaders(res, settings.headers);
        }
        if (this.isNotModified(req)) {
            res.statusCode = 304;
            res.end();
            return;
        }
        MimeTypes.writeHead(res, this.mimeType);
        res.setHeader('Content-Length', length);

        if (req.method === 'HEAD') {
            res.end();
            return;
        }
        this.writeBody(res, encoding, settings);
    }
    writeBody(res, encoding, settings?) {

        var data = encoding === 'gzip'
            ? this.gzip
            : this.content
            ;
        res.end(data);
    }

    getStats(req, cb) {

        file_stats(this.path, (error, stat) => {
            this.getStatsResult(error, stat, cb, req);
        });
    }

    protected getStatsResult (error, stat, cb, req) {
        if (error) {
            if (error.code === 'ENOENT') {
                var virtual = File
                    .getFactory()
                    .resolveHandler('file://' + this.path);
                if (virtual != null) {
                    if (cb) {
                        return cb(this, {}, req);
                    }
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

        if (cb) {
            cb(this, stat, req);
            return;
        }
        this.resolve(this);
    }

    getFilename() {
        var slash = this.path.lastIndexOf('/');
        return slash === -1
            ? this.path
            : this.path.substring(slash + 1)
            ;
    }
    getEncoding(req) {
        if (this.gzip == null)
            return null;

        var accept = req.headers['accept-encoding'];
        return accept && /\bgzip\b/.test(accept)
            ? 'gzip'
            : null
            ;
    }
    getLength(encoding) {
        if (encoding === 'gzip')
            return this.gzip.length;

        if (this.content == null)
            return this.size || 0;

        if (typeof this.content === 'string')
            return Buffer.byteLength(this.content, 'utf8');

        // assume Buffer or BufferLike content
        return this.content.length;
    }
    isNotModified(req) {
        var etag = req.headers['if-none-match'],
            utc = req.headers['if-modified-since'];

        if (this.etag != null && etag)
            return this.etag === etag;

        if (this.modified != null && utc)
            return this.modified <= Date.parse(utc);

        return false;
    }
};


var calcETag;
(function () {
    calcETag = function (path, stat) {
        var base64,
            tag = stat.mtime.getTime()
                + ':'
                + stat.size
                + ':'
                + path
            ;
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
