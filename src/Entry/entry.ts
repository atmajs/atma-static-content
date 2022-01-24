import { MimeTypes } from '../MimeTypes';
import { File } from '../dependency'
import { entry_factory } from './factory';
import { type File_Static } from './File_Static';


export function entry_get(path: string, req, config?): File_Static {
    if (Cache.hasOwnProperty(path)) {
        return Cache[path];
    }
    let mimeType = MimeTypes.resolveByPath(path);
    let file = entry_factory(path, mimeType, req, config);

    if (CacheEnabled === false) {
        return file;
    }
    return (Cache[path] = file);
};
export function entry_cache_state(state) {
    if (state === false) {
        Cache = {};
    }
    File[
        state && 'enableCache' || 'disableCache'
    ]();
    CacheEnabled = state;
};
export function entry_cache_remove(path) {
    delete Cache[path];
    File.clearCache(path);
};
export function entry_cache_watch(state) {
    CacheWatch = state;
};

let Cache = {};
let CacheEnabled = true;
let CacheWatch = true;
