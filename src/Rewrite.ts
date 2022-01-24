import { rewrite_reference } from './rewrite/reference';

export const Rewrite = {
    process(path, config) {
        if (_rewrites.hasOwnProperty(path)) {
            return _rewrites[path];
        }
        if (path.charCodeAt(path.length - 1) === 47) {
            // /
            path += config?.index ?? 'index.html';
        }
        // .reference
        if (path.indexOf('.reference') !== -1) {
            return rewrite_reference(path);
        }
        return path;
    }
};

const _rewrites = {};
