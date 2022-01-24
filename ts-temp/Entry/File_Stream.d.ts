import { File_Static } from './File_Static';
export declare class File_Stream extends File_Static {
    maxAge: number;
    statsCompleted: any;
    write(req: any, res: any, settings: any): void;
    writeBody(res: any, encoding: any, settings: any): void;
}
