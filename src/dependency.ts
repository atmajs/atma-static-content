import { class_EventEmitter } from 'atma-utils';
import { File as LocalFile } from 'atma-io'


declare var global;

export const __eventStream = new class_EventEmitter();
export const File: typeof LocalFile = global.io?.File ?? LocalFile;
