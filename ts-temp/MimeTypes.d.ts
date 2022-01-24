export declare const MimeTypes: {
    resolveByPath(path: any): any;
    resolveByExt(ext: any): any;
    isString(mimeType: any): boolean;
    writeHead(res: any, mimeType: any): void;
    setDefault(mimeType: any): void;
    registerMimeTypes(mimeTypes: any): void;
    registerExtensions(extensions: any): void;
};
