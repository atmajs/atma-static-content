import { file_gzip } from '../utils/file';
import { File_Static } from './File_Static';
import { File, __eventStream } from '../dependency'

export class File_String extends File_Static {

    statsCompleted(stats) {
        File
            .readAsync('file://' + this.path, { encoding: <any> 'buffer' })
            .then((content, file?) => {
                __eventStream.trigger('file', file || this);

                if (content != null
                    && typeof content === 'object'
                    && Buffer.isBuffer(content) === false) {

                    content = serialize(content);
                }

                this.content = content;

                if (content.length < 100) {
                    this.resolve(this);
                    return;
                }

                file_gzip(content, (gzip) => {
                    if (gzip != null && gzip.length < stats.size)
                        this.gzip = gzip;

                    this.resolve(this);
                });
            },
            error => this.reject(error));
    }
};

function serialize(obj) {
    try {
        return JSON.stringify(obj);
    } catch (error) {
        return error.message;
    }
}
var _obj_toString = Object.prototype.toString;
