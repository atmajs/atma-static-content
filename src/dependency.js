var __fs = require('fs');

var Class,
	File,
	net;
	
(function(){
	var atma = global;
	if (global.atma && atma.Class) 
		atma = global.atma;
	
	if (atma.Class == null) 
		atma = require('atma-libs/exports-dev');
	
	if (global.io && global.io.File) 
		File = global.io.File;
	
	if (File == null) 
		File = require('atma-io').File;
	
	Class = atma.Class;
	net = atma.net;
}());