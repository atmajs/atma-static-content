"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.File_String = void 0;
var file_1 = require("../utils/file");
var File_Static_1 = require("./File_Static");
var dependency_1 = require("../dependency");
var File_String = /** @class */ (function (_super) {
    __extends(File_String, _super);
    function File_String() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    File_String.prototype.statsCompleted = function (stats) {
        var _this = this;
        dependency_1.File
            .readAsync('file://' + this.path, { encoding: 'buffer' })
            .then(function (content, file) {
            dependency_1.__eventStream.trigger('file', file || _this);
            if (content != null
                && typeof content === 'object'
                && Buffer.isBuffer(content) === false) {
                content = serialize(content);
            }
            _this.content = content;
            if (content.length < 100) {
                _this.resolve(_this);
                return;
            }
            (0, file_1.file_gzip)(content, function (gzip) {
                if (gzip != null && gzip.length < stats.size)
                    this.gzip = gzip;
                this.resolve(this);
            });
        }, function (error) { return _this.reject(error); });
    };
    return File_String;
}(File_Static_1.File_Static));
exports.File_String = File_String;
;
function serialize(obj) {
    try {
        return JSON.stringify(obj);
    }
    catch (error) {
        return error.message;
    }
}
var _obj_toString = Object.prototype.toString;
