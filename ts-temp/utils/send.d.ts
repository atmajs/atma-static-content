export declare function send_toHttpError(mix: number | Error, message?: string): IError;
export declare function send_error(res: any, error: any): void;
export declare function send_headersWritable(res: any): boolean;
export declare function send_redirect(res: any, path: any): void;
interface IError extends Error {
    code?: number;
}
export {};
