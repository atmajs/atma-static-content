"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = exports.__eventStream = void 0;
var atma_utils_1 = require("atma-utils");
var atma_io_1 = require("atma-io");
exports.__eventStream = new atma_utils_1.class_EventEmitter();
exports.File = (_b = (_a = global.io) === null || _a === void 0 ? void 0 : _a.File) !== null && _b !== void 0 ? _b : atma_io_1.File;
