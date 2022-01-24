import { class_EventEmitter } from 'atma-utils';
export declare function interface_express_send(req: any, url: any, settings: any): Express;
declare class Express extends class_EventEmitter {
    settings: any;
    appConfig: any;
    responder: any;
    req: any;
    constructor(req: any, url: any, settings: any);
    maxage(ms: any): this;
    pipe(res: any): any;
}
export {};
