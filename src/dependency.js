var __fs = require('fs');
var __eventStream;

var File,
	Utils,
	Uri;
	
(function(){
	Utils = require('atma-utils');
	Uri = Utils.class_Uri;
	File = global.io && global.io.File || require('atma-io').File;
}());
	
__eventStream = new Utils.class_EventEmitter;