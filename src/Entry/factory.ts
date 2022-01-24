import { MimeTypes } from '../MimeTypes';
import { File_Stream } from './File_Stream';
import { File_String } from './File_String';

export function entry_factory (path, mimeType, req, config?) {

    const Ctor = MimeTypes.isString(mimeType)
        ? File_String
        : File_Stream
        ;
    const entry = new Ctor(path, mimeType, req);
    return entry;
}
