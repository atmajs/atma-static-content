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
exports.interface_express_send = void 0;
var atma_utils_1 = require("atma-utils");
var responder_1 = require("../utils/responder");
var send_1 = require("../utils/send");
function interface_express_send(req, url, settings) {
    return new Express(req, url, settings);
}
exports.interface_express_send = interface_express_send;
;
var Express = /** @class */ (function (_super) {
    __extends(Express, _super);
    function Express(req, url, settings) {
        var _this = _super.call(this) || this;
        _this.settings = null;
        _this.appConfig = null;
        _this.responder = null;
        _this.req = null;
        if (req.url !== url) {
            req.url = url;
        }
        _this.req = req;
        _this.settings = obj_defaults(settings, { maxAge: 0 });
        _this.appConfig = convertSettings(_this.settings);
        _this.responder = (0, responder_1.responder_create)(_this.settings);
        return _this;
    }
    Express.prototype.maxage = function (ms) {
        if (Infinity === ms) {
            ms = 60 * 60 * 24 * 365 * 1000;
        }
        this.settings.maxAge = ms / 1000 | 0;
        return this;
    };
    Express.prototype.pipe = function (res) {
        var self = this;
        this.settings.handleDirectory = !has(this, 'directory');
        this.settings.handleErrors = !has(this, 'error');
        this
            .responder(this.req, res, this.appConfig)
            .fail(function (error) {
            if (error.code === 'EISDIR') {
                self.trigger('directory', error);
                return;
            }
            error = (0, send_1.send_toHttpError)(error);
            error.status = error.code;
            self.trigger('error', error);
        });
        return null;
    };
    return Express;
}(atma_utils_1.class_EventEmitter));
;
function has(emitter, event) {
    var arr = emitter._listeners[event];
    return arr != null && arr.length > 0;
}
function convertSettings(settings) {
    var config = {
        base: settings.root,
        index: settings.index
    };
    return config;
}
function obj_defaults(settings, arg1) {
    throw new Error('Function not implemented.');
}
