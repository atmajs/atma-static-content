/// <reference types="node" />
import fs from 'fs';
export declare function file_stats(path: string, cb: (err: NodeJS.ErrnoException | null, stats: fs.Stats) => void): void;
export declare function file_gzip(content: string | Buffer, cb: (buffer: Buffer) => void): void;
