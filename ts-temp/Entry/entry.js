"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entry_cache_watch = exports.entry_cache_remove = exports.entry_cache_state = exports.entry_get = void 0;
var MimeTypes_1 = require("../MimeTypes");
var dependency_1 = require("../dependency");
var factory_1 = require("./factory");
function entry_get(path, req, config) {
    if (Cache.hasOwnProperty(path)) {
        return Cache[path];
    }
    var mimeType = MimeTypes_1.MimeTypes.resolveByPath(path);
    var file = (0, factory_1.entry_factory)(path, mimeType, req, config);
    if (CacheEnabled === false) {
        return file;
    }
    return (Cache[path] = file);
}
exports.entry_get = entry_get;
;
function entry_cache_state(state) {
    if (state === false) {
        Cache = {};
    }
    dependency_1.File[state && 'enableCache' || 'disableCache']();
    CacheEnabled = state;
}
exports.entry_cache_state = entry_cache_state;
;
function entry_cache_remove(path) {
    delete Cache[path];
    dependency_1.File.clearCache(path);
}
exports.entry_cache_remove = entry_cache_remove;
;
function entry_cache_watch(state) {
    CacheWatch = state;
}
exports.entry_cache_watch = entry_cache_watch;
;
var Cache = {};
var CacheEnabled = true;
var CacheWatch = true;
