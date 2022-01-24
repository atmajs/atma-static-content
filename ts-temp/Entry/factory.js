"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entry_factory = void 0;
var MimeTypes_1 = require("../MimeTypes");
var File_Stream_1 = require("./File_Stream");
var File_String_1 = require("./File_String");
function entry_factory(path, mimeType, req, config) {
    var Ctor = MimeTypes_1.MimeTypes.isString(mimeType)
        ? File_String_1.File_String
        : File_Stream_1.File_Stream;
    return new Ctor(path, mimeType, req);
}
exports.entry_factory = entry_factory;
