import { entry_cache_state, entry_cache_remove } from './Entry/entry';
import { interface_express_send } from './interfaces/express_send';
import { path_fromUrl } from './utils/path';
import { responder_sendResource } from './utils/responder';
export declare const StaticContent: {
    create: typeof createMiddleware;
    respond: (req: any, res: any, next: any) => void;
    sendResource: typeof responder_sendResource;
    send: typeof interface_express_send;
    Cache: {
        state: typeof entry_cache_state;
        remove: typeof entry_cache_remove;
    };
    on: any;
    off: any;
    utils: {
        resolvePath: typeof path_fromUrl;
    };
};
declare function createMiddleware(settings?: any): (req: any, res: any, next: any) => void;
export {};
