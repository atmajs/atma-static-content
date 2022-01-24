"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.file_gzip = exports.file_stats = void 0;
var fs_1 = __importDefault(require("fs"));
function file_stats(path, cb) {
    fs_1.default.stat(path, cb);
}
exports.file_stats = file_stats;
;
function file_gzip(content, cb) {
    if (_zlib == null) {
        _zlib = require('zlib');
    }
    _zlib.gzip(content, function (error, gzip) {
        cb(gzip);
    });
}
exports.file_gzip = file_gzip;
;
var _zlib;
