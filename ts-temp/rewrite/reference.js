"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewrite_reference = void 0;
var atma_utils_1 = require("atma-utils");
var dependency_1 = require("../dependency");
function rewrite_reference(path) {
    if (typeof app === 'undefined' || app.config == null)
        return path;
    var regexp = /\.reference\/([^\/]+)/, match = regexp.exec(path), project = match && match[1], projects = app.config.projects;
    if (projects == null)
        return path;
    var data = projects[project];
    if (data == null)
        return path;
    var str = '.reference/' + project;
    var projectPath = typeof data === 'string'
        ? data
        : data.path;
    if (projectPath == null)
        return path;
    var url = atma_utils_1.class_Uri.combine(projectPath, path.substring(match.index + str.length));
    // fix (npm module of a project can be located in the parents node_modules)
    var rgx = /node_modules.+node_modules/;
    while (rgx.test(url) && dependency_1.File.exists(url) === false) {
        url = url.replace(rgx, 'node_modules');
    }
    return url;
}
exports.rewrite_reference = rewrite_reference;
;
