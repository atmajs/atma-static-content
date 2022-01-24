/// <reference types="node" />
import { ServerResponse, IncomingMessage } from 'http';
import { class_Dfr } from 'atma-utils';
export declare abstract class File_Static extends class_Dfr {
    path: any;
    mimeType: any;
    modified: any;
    etag: any;
    maxAge: number;
    size: any;
    gzip: any;
    content: any;
    abstract statsCompleted(stats: any): any;
    constructor(path: string, mimeType: string, req: IncomingMessage);
    write(req: IncomingMessage, res: ServerResponse, settings: any): void;
    writeBody(res: any, encoding: any, settings?: any): void;
    getStats(req: any, cb: any): void;
    private getStatsResult;
    getFilename(): any;
    getEncoding(req: any): string;
    getLength(encoding: any): any;
    isNotModified(req: any): boolean;
}
