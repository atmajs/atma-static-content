"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rewrite = void 0;
var reference_1 = require("./rewrite/reference");
exports.Rewrite = {
    process: function (path, config) {
        if (_rewrites.hasOwnProperty(path))
            return _rewrites[path];
        if (path.charCodeAt(path.length - 1) === 47) {
            // /
            path += config && config.index || 'index.html';
        }
        // .reference
        if (path.indexOf('.reference') !== -1)
            return (0, reference_1.rewrite_reference)(path);
        return path;
    }
};
// import rewrite/reference.js
var _rewrites = {};
