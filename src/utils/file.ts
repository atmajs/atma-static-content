import * as fs from 'fs';


export function file_stats (path: string, cb: (err: NodeJS.ErrnoException | null, stats: fs.Stats) => void){
    fs.stat(path, cb);
};

export function file_gzip (content: string | Buffer, cb: (buffer: Buffer) => void) {
    if (_zlib == null)  {
        _zlib = require('zlib');
    }

    _zlib.gzip(content, function(error, gzip){
        cb(gzip);
    });
};

let _zlib;
