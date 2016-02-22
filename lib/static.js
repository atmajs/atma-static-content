//source /src/static.js

// source dependency.js
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
// end:source dependency.js
// source utils/str.js
var str_escape;
(function(){
	
	str_escape = function(str){
		return str
			.replace(/&(?!\w+;)/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			;
	};
}());
// end:source utils/str.js
// source utils/obj.js
var obj_defaults;
(function(){
	obj_defaults = function(target, defaults) {
		if (target == null)
			target = {};
			
		for (var key in defaults) {
			if (target[key] == null) 
				target[key] = defaults[key];
		}
		return target;
	};
}());
// end:source utils/obj.js
// source utils/file.js
var file_stats,
	file_gzip;
	
(function(){
	file_stats = function(path, cb){
		__fs.stat(path, cb);
	};
	file_gzip = function(content, cb){
		if (_zlib == null) 
			_zlib = require('zlib');
		
		_zlib.gzip(content, function(error, gzip){
			cb(gzip);
		});
	};
	
	var _zlib;
	
}());
// end:source utils/file.js
// source utils/res.js
var res_hasWritableHeaders,
	res_writeHeaders;
(function(){
	res_hasWritableHeaders = function(res){
		var sent = res._headerSent;
		if (typeof sent === 'boolean') 
			return sent === false;
		
		return trySet(res, 'X-Powered-By', 'AtmaNode');
	};
	res_writeHeaders = function(res, headers){
		for (var key in headers) {
			var val = headers[key];
			if (val != null) {
				res.setHeader(key, val);
			}
		}
	};
	function trySet(res, name, val){
		try {
			res.setHeader(name, val);
			return true;
		} catch(error){
			return false;
		}
	}
}());
// end:source utils/res.js

// source MimeTypes.js
var MimeTypes;
(function(){
	MimeTypes = {
		resolveByPath: function(path){
			var dot = path.lastIndexOf('.');
			if (dot === -1) 
				return _defaultMime;
			
			return this.resolveByExt(path.substring(dot + 1));
		},
		resolveByExt: function(ext) {
			return _mimes[ext] || _defaultMime;
		},
		isString: function(mimeType){
			if (mimeType.indexOf('text/') === 0) 
				return true;
			if (mimeType.indexOf('xml') !== -1) 
				return true;
			
			return _stringMimes.hasOwnProperty(mimeType);
		},
		writeHead: function(res, mimeType) {
			var str = mimeType + (this.isString(mimeType)
				? '; charset=UTF-8'
				: ''
			);
			res.setHeader('Content-Type', str);
		},
		setDefault: function(mimeType){
			_defaultMime = mimeType;
		},
		/* { MimeTypeString: ExtensionString || [ExtensionString] } */
		registerMimeTypes: function(mimeTypes){
			var val, mimeType;
			for(mimeType in mimeTypes) {
				val = mimeTypes[mimeType];
				if (typeof val === 'string') {
					_mimes[val] = mimeType;
					continue;
				}
				if (Array.isArray(val)) {
					var i = -1,
						imax = val.length;
					while(++i<imax){
						_mimes[val[i]] = mimeType;
					}
				}
			}
		},
		/* { ExtensionString: MimeTypeString || {mimeType: MimeTypeString, encoding: } } */
		registerExtensions: function(extensions){
			var val, ext;
			for(ext in extensions) {
				val = extensions[ext];
				if (typeof val === 'string') {
					_mimes[ext] = val;
					continue;
				}
				if (val == null || typeof val !== 'object') 
					continue;
				
				
				if (val.mimeType) {
					_mimes[ext] = val.mimeType;
					if (val.encoding && /utf\-?8/i.test(val.encoding)) 
						_stringMimes[val.mimeType] = 1;
				}
			}
		}
	};
	
	//== private
	
	var _defaultMime = 'application/octet-stream';
	var _mimes = [
		//source data/MimeTypes.yml
		{"123":"application/vnd.lotus-1-2-3","ez":"application/andrew-inset","aw":"application/applixware","atom":"application/atom+xml","atomcat":"application/atomcat+xml","atomsvc":"application/atomsvc+xml","ccxml":"application/ccxml+xml","cdmia":"application/cdmi-capability","cdmic":"application/cdmi-container","cdmid":"application/cdmi-domain","cdmio":"application/cdmi-object","cdmiq":"application/cdmi-queue","cu":"application/cu-seeme","mdp":"application/dash+xml","davmount":"application/davmount+xml","dbk":"application/docbook+xml","dssc":"application/dssc+der","xdssc":"application/dssc+xml","ecma":"application/ecmascript","emma":"application/emma+xml","epub":"application/epub+zip","exi":"application/exi","pfr":"application/font-tdpfr","gml":"application/gml+xml","gpx":"application/gpx+xml","gxf":"application/gxf","stk":"application/hyperstudio","ink":"application/inkml+xml","inkml":"application/inkml+xml","ipfix":"application/ipfix","jar":"application/java-archive","ser":"application/java-serialized-object","class":"application/java-vm","js":"application/javascript","es6":"application/javascript","coffee":"application/javascript","json":"application/json","map":"application/json","jsonml":"application/jsonml+json","lostxml":"application/lost+xml","hqx":"application/mac-binhex40","cpt":"application/mac-compactpro","mads":"application/mads+xml","mrc":"application/marc","mrcx":"application/marcxml+xml","ma":"application/mathematica","nb":"application/mathematica","mb":"application/mathematica","mathml":"application/mathml+xml","mbox":"application/mbox","mscml":"application/mediaservercontrol+xml","metalink":"application/metalink+xml","meta4":"application/metalink4+xml","mets":"application/mets+xml","mods":"application/mods+xml","m21":"application/mp21","mp21":"application/mp21","mp4s":"application/mp4","m4p":"application/mp4","doc":"application/msword","dot":"application/msword","mxf":"application/mxf","bin":"application/octet-stream","dms":"application/octet-stream","lrf":"application/octet-stream","mar":"application/octet-stream","so":"application/octet-stream","dist":"application/octet-stream","distz":"application/octet-stream","pkg":"application/octet-stream","bpk":"application/octet-stream","dump":"application/octet-stream","elc":"application/octet-stream","deploy":"application/octet-stream","buffer":"application/octet-stream","oda":"application/oda","opf":"application/oebps-package+xml","ogx":"application/ogg","omdoc":"application/omdoc+xml","onetoc":"application/onenote","onetoc2":"application/onenote","onetmp":"application/onenote","onepkg":"application/onenote","oxps":"application/oxps","xer":"application/patch-ops-error+xml","pdf":"application/pdf","pgp":"application/pgp-encrypted","asc":"application/pgp-signature","sig":"application/pgp-signature","prf":"application/pics-rules","p10":"application/pkcs10","p7m":"application/pkcs7-mime","p7c":"application/pkcs7-mime","p7s":"application/pkcs7-signature","p8":"application/pkcs8","ac":"application/pkix-attr-cert","cer":"application/pkix-cert","crl":"application/pkix-crl","pkipath":"application/pkix-pkipath","pki":"application/pkixcmp","pls":"application/pls+xml","ai":"application/postscript","eps":"application/postscript","ps":"application/postscript","cww":"application/prs.cww","pskcxml":"application/pskc+xml","rdf":"application/rdf+xml","rif":"application/reginfo+xml","rnc":"application/relax-ng-compact-syntax","rl":"application/resource-lists+xml","rld":"application/resource-lists-diff+xml","rs":"application/rls-services+xml","gbr":"application/rpki-ghostbusters","mft":"application/rpki-manifest","roa":"application/rpki-roa","rsd":"application/rsd+xml","rss":"application/rss+xml","rtf":"application/rtf","sbml":"application/sbml+xml","scq":"application/scvp-cv-request","scs":"application/scvp-cv-response","spq":"application/scvp-vp-request","spp":"application/scvp-vp-response","sdp":"application/sdp","setpay":"application/set-payment-initiation","setreg":"application/set-registration-initiation","shf":"application/shf+xml","smi":"application/smil+xml","smil":"application/smil+xml","rq":"application/sparql-query","srx":"application/sparql-results+xml","gram":"application/srgs","grxml":"application/srgs+xml","sru":"application/sru+xml","ssdl":"application/ssdl+xml","ssml":"application/ssml+xml","tei":"application/tei+xml","teicorpus":"application/tei+xml","tfi":"application/thraud+xml","tsd":"application/timestamped-data","plb":"application/vnd.3gpp.pic-bw-large","psb":"application/vnd.3gpp.pic-bw-small","pvb":"application/vnd.3gpp.pic-bw-var","tcap":"application/vnd.3gpp2.tcap","pwn":"application/vnd.3m.post-it-notes","aso":"application/vnd.accpac.simply.aso","imp":"application/vnd.accpac.simply.imp","acu":"application/vnd.acucobol","atc":"application/vnd.acucorp","acutc":"application/vnd.acucorp","air":"application/vnd.adobe.air-application-installer-package+zip","fcdt":"application/vnd.adobe.formscentral.fcdt","fxp":"application/vnd.adobe.fxp","fxpl":"application/vnd.adobe.fxp","xdp":"application/vnd.adobe.xdp+xml","xfdf":"application/vnd.adobe.xfdf","ahead":"application/vnd.ahead.space","azf":"application/vnd.airzip.filesecure.azf","azs":"application/vnd.airzip.filesecure.azs","azw":"application/vnd.amazon.ebook","acc":"application/vnd.americandynamics.acc","ami":"application/vnd.amiga.ami","apk":"application/vnd.android.package-archive","cii":"application/vnd.anser-web-certificate-issue-initiation","fti":"application/vnd.anser-web-funds-transfer-initiation","atx":"application/vnd.antix.game-component","mpkg":"application/vnd.apple.installer+xml","m3u8":"application/vnd.apple.mpegurl","swi":"application/vnd.aristanetworks.swi","iota":"application/vnd.astraea-software.iota","aep":"application/vnd.audiograph","mpm":"application/vnd.blueice.multipass","bmi":"application/vnd.bmi","rep":"application/vnd.businessobjects","cdxml":"application/vnd.chemdraw+xml","mmd":"application/vnd.chipnuts.karaoke-mmd","cdy":"application/vnd.cinderella","cla":"application/vnd.claymore","rp9":"application/vnd.cloanto.rp9","c4g":"application/vnd.clonk.c4group","c4d":"application/vnd.clonk.c4group","c4f":"application/vnd.clonk.c4group","c4p":"application/vnd.clonk.c4group","c4u":"application/vnd.clonk.c4group","c11amc":"application/vnd.cluetrust.cartomobile-config","c11amz":"application/vnd.cluetrust.cartomobile-config-pkg","csp":"application/vnd.commonspace","cdbcmsg":"application/vnd.contact.cmsg","cmc":"application/vnd.cosmocaller","clkx":"application/vnd.crick.clicker","clkk":"application/vnd.crick.clicker.keyboard","clkp":"application/vnd.crick.clicker.palette","clkt":"application/vnd.crick.clicker.template","clkw":"application/vnd.crick.clicker.wordbank","wbs":"application/vnd.criticaltools.wbs+xml","pml":"application/vnd.ctc-posml","ppd":"application/vnd.cups-ppd","car":"application/vnd.curl.car","pcurl":"application/vnd.curl.pcurl","dart":"application/vnd.dart","rdz":"application/vnd.data-vision.rdz","uvf":"application/vnd.dece.data","uvvf":"application/vnd.dece.data","uvd":"application/vnd.dece.data","uvvd":"application/vnd.dece.data","uvt":"application/vnd.dece.ttml+xml","uvvt":"application/vnd.dece.ttml+xml","uvx":"application/vnd.dece.unspecified","uvvx":"application/vnd.dece.unspecified","uvz":"application/vnd.dece.zip","uvvz":"application/vnd.dece.zip","fe_launch":"application/vnd.denovo.fcselayout-link","dna":"application/vnd.dna","mlp":"application/vnd.dolby.mlp","dpg":"application/vnd.dpgraph","dfac":"application/vnd.dreamfactory","kpxx":"application/vnd.ds-keypoint","ait":"application/vnd.dvb.ait","svc":"application/vnd.dvb.service","geo":"application/vnd.dynageo","mag":"application/vnd.ecowin.chart","nml":"application/vnd.enliven","esf":"application/vnd.epson.esf","msf":"application/vnd.epson.msf","qam":"application/vnd.epson.quickanime","slt":"application/vnd.epson.salt","ssf":"application/vnd.epson.ssf","es3":"application/vnd.eszigno3+xml","et3":"application/vnd.eszigno3+xml","ez2":"application/vnd.ezpix-album","ez3":"application/vnd.ezpix-package","fdf":"application/vnd.fdf","mseed":"application/vnd.fdsn.mseed","seed":"application/vnd.fdsn.seed","dataless":"application/vnd.fdsn.seed","gph":"application/vnd.flographit","ftc":"application/vnd.fluxtime.clip","fm":"application/vnd.framemaker","frame":"application/vnd.framemaker","maker":"application/vnd.framemaker","book":"application/vnd.framemaker","fnc":"application/vnd.frogans.fnc","ltf":"application/vnd.frogans.ltf","fsc":"application/vnd.fsc.weblaunch","oas":"application/vnd.fujitsu.oasys","oa2":"application/vnd.fujitsu.oasys2","oa3":"application/vnd.fujitsu.oasys3","fg5":"application/vnd.fujitsu.oasysgp","bh2":"application/vnd.fujitsu.oasysprs","ddd":"application/vnd.fujixerox.ddd","xdw":"application/vnd.fujixerox.docuworks","xbd":"application/vnd.fujixerox.docuworks.binder","fzs":"application/vnd.fuzzysheet","txd":"application/vnd.genomatix.tuxedo","ggb":"application/vnd.geogebra.file","ggt":"application/vnd.geogebra.tool","gex":"application/vnd.geometry-explorer","gre":"application/vnd.geometry-explorer","gxt":"application/vnd.geonext","g2w":"application/vnd.geoplan","g3w":"application/vnd.geospace","gmx":"application/vnd.gmx","kml":"application/vnd.google-earth.kml+xml","kmz":"application/vnd.google-earth.kmz","gqf":"application/vnd.grafeq","gqs":"application/vnd.grafeq","gac":"application/vnd.groove-account","ghf":"application/vnd.groove-help","gim":"application/vnd.groove-identity-message","grv":"application/vnd.groove-injector","gtm":"application/vnd.groove-tool-message","tpl":"application/vnd.groove-tool-template","vcg":"application/vnd.groove-vcard","hal":"application/vnd.hal+xml","zmm":"application/vnd.handheld-entertainment+xml","hbci":"application/vnd.hbci","les":"application/vnd.hhe.lesson-player","hpgl":"application/vnd.hp-hpgl","hpid":"application/vnd.hp-hpid","hps":"application/vnd.hp-hps","jlt":"application/vnd.hp-jlyt","pcl":"application/vnd.hp-pcl","pclxl":"application/vnd.hp-pclxl","sfd-hdstx":"application/vnd.hydrostatix.sof-data","mpy":"application/vnd.ibm.minipay","afp":"application/vnd.ibm.modcap","listafp":"application/vnd.ibm.modcap","list3820":"application/vnd.ibm.modcap","irm":"application/vnd.ibm.rights-management","sc":"application/vnd.ibm.secure-container","icc":"application/vnd.iccprofile","icm":"application/vnd.iccprofile","igl":"application/vnd.igloader","ivp":"application/vnd.immervision-ivp","ivu":"application/vnd.immervision-ivu","igm":"application/vnd.insors.igm","xpw":"application/vnd.intercon.formnet","xpx":"application/vnd.intercon.formnet","i2g":"application/vnd.intergeo","qbo":"application/vnd.intu.qbo","qfx":"application/vnd.intu.qfx","rcprofile":"application/vnd.ipunplugged.rcprofile","irp":"application/vnd.irepository.package+xml","xpr":"application/vnd.is-xpr","fcs":"application/vnd.isac.fcs","jam":"application/vnd.jam","rms":"application/vnd.jcp.javame.midlet-rms","jisp":"application/vnd.jisp","joda":"application/vnd.joost.joda-archive","ktz":"application/vnd.kahootz","ktr":"application/vnd.kahootz","karbon":"application/vnd.kde.karbon","chrt":"application/vnd.kde.kchart","kfo":"application/vnd.kde.kformula","flw":"application/vnd.kde.kivio","kon":"application/vnd.kde.kontour","kpr":"application/vnd.kde.kpresenter","kpt":"application/vnd.kde.kpresenter","ksp":"application/vnd.kde.kspread","kwd":"application/vnd.kde.kword","kwt":"application/vnd.kde.kword","htke":"application/vnd.kenameaapp","kia":"application/vnd.kidspiration","kne":"application/vnd.kinar","knp":"application/vnd.kinar","skp":"application/vnd.koan","skd":"application/vnd.koan","skt":"application/vnd.koan","skm":"application/vnd.koan","sse":"application/vnd.kodak-descriptor","lasxml":"application/vnd.las.las+xml","lbd":"application/vnd.llamagraphics.life-balance.desktop","lbe":"application/vnd.llamagraphics.life-balance.exchange+xml","apr":"application/vnd.lotus-approach","pre":"application/vnd.lotus-freelance","nsf":"application/vnd.lotus-notes","org":"application/vnd.lotus-organizer","scm":"application/vnd.lotus-screencam","lwp":"application/vnd.lotus-wordpro","portpkg":"application/vnd.macports.portpkg","mcd":"application/vnd.mcd","mc1":"application/vnd.medcalcdata","cdkey":"application/vnd.mediastation.cdkey","mwf":"application/vnd.mfer","mfm":"application/vnd.mfmp","flo":"application/vnd.micrografx.flo","igx":"application/vnd.micrografx.igx","mif":"application/vnd.mif","daf":"application/vnd.mobius.daf","dis":"application/vnd.mobius.dis","mbk":"application/vnd.mobius.mbk","mqy":"application/vnd.mobius.mqy","msl":"application/vnd.mobius.msl","plc":"application/vnd.mobius.plc","txf":"application/vnd.mobius.txf","mpn":"application/vnd.mophun.application","mpc":"application/vnd.mophun.certificate","xul":"application/vnd.mozilla.xul+xml","cil":"application/vnd.ms-artgalry","cab":"application/vnd.ms-cab-compressed","xls":"application/vnd.ms-excel","xlm":"application/vnd.ms-excel","xla":"application/vnd.ms-excel","xlc":"application/vnd.ms-excel","xlt":"application/vnd.ms-excel","xlw":"application/vnd.ms-excel","xlam":"application/vnd.ms-excel.addin.macroenabled.12","xlsb":"application/vnd.ms-excel.sheet.binary.macroenabled.12","xlsm":"application/vnd.ms-excel.sheet.macroenabled.12","xltm":"application/vnd.ms-excel.template.macroenabled.12","eot":"application/vnd.ms-fontobject","chm":"application/vnd.ms-htmlhelp","ims":"application/vnd.ms-ims","lrm":"application/vnd.ms-lrm","thmx":"application/vnd.ms-officetheme","cat":"application/vnd.ms-pki.seccat","stl":"application/vnd.ms-pki.stl","ppt":"application/vnd.ms-powerpoint","pps":"application/vnd.ms-powerpoint","pot":"application/vnd.ms-powerpoint","ppam":"application/vnd.ms-powerpoint.addin.macroenabled.12","pptm":"application/vnd.ms-powerpoint.presentation.macroenabled.12","sldm":"application/vnd.ms-powerpoint.slide.macroenabled.12","ppsm":"application/vnd.ms-powerpoint.slideshow.macroenabled.12","potm":"application/vnd.ms-powerpoint.template.macroenabled.12","mpp":"application/vnd.ms-project","mpt":"application/vnd.ms-project","docm":"application/vnd.ms-word.document.macroenabled.12","dotm":"application/vnd.ms-word.template.macroenabled.12","wps":"application/vnd.ms-works","wks":"application/vnd.ms-works","wcm":"application/vnd.ms-works","wdb":"application/vnd.ms-works","wpl":"application/vnd.ms-wpl","xps":"application/vnd.ms-xpsdocument","mseq":"application/vnd.mseq","mus":"application/vnd.musician","msty":"application/vnd.muvee.style","taglet":"application/vnd.mynfc","nlu":"application/vnd.neurolanguage.nlu","ntf":"application/vnd.nitf","nitf":"application/vnd.nitf","nnd":"application/vnd.noblenet-directory","nns":"application/vnd.noblenet-sealer","nnw":"application/vnd.noblenet-web","ngdat":"application/vnd.nokia.n-gage.data","n-gage":"application/vnd.nokia.n-gage.symbian.install","rpst":"application/vnd.nokia.radio-preset","rpss":"application/vnd.nokia.radio-presets","edm":"application/vnd.novadigm.edm","edx":"application/vnd.novadigm.edx","ext":"application/vnd.novadigm.ext","odc":"application/vnd.oasis.opendocument.chart","otc":"application/vnd.oasis.opendocument.chart-template","odb":"application/vnd.oasis.opendocument.database","odf":"application/vnd.oasis.opendocument.formula","odft":"application/vnd.oasis.opendocument.formula-template","odg":"application/vnd.oasis.opendocument.graphics","otg":"application/vnd.oasis.opendocument.graphics-template","odi":"application/vnd.oasis.opendocument.image","oti":"application/vnd.oasis.opendocument.image-template","odp":"application/vnd.oasis.opendocument.presentation","otp":"application/vnd.oasis.opendocument.presentation-template","ods":"application/vnd.oasis.opendocument.spreadsheet","ots":"application/vnd.oasis.opendocument.spreadsheet-template","odt":"application/vnd.oasis.opendocument.text","odm":"application/vnd.oasis.opendocument.text-master","ott":"application/vnd.oasis.opendocument.text-template","oth":"application/vnd.oasis.opendocument.text-web","xo":"application/vnd.olpc-sugar","dd2":"application/vnd.oma.dd2+xml","oxt":"application/vnd.openofficeorg.extension","pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation","sldx":"application/vnd.openxmlformats-officedocument.presentationml.slide","ppsx":"application/vnd.openxmlformats-officedocument.presentationml.slideshow","potx":"application/vnd.openxmlformats-officedocument.presentationml.template","xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","xltx":"application/vnd.openxmlformats-officedocument.spreadsheetml.template","docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document","dotx":"application/vnd.openxmlformats-officedocument.wordprocessingml.template","mgp":"application/vnd.osgeo.mapguide.package","dp":"application/vnd.osgi.dp","esa":"application/vnd.osgi.subsystem","pdb":"application/vnd.palm","pqa":"application/vnd.palm","oprc":"application/vnd.palm","paw":"application/vnd.pawaafile","str":"application/vnd.pg.format","ei6":"application/vnd.pg.osasli","efif":"application/vnd.picsel","wg":"application/vnd.pmi.widget","plf":"application/vnd.pocketlearn","pbd":"application/vnd.powerbuilder6","box":"application/vnd.previewsystems.box","mgz":"application/vnd.proteus.magazine","qps":"application/vnd.publishare-delta-tree","ptid":"application/vnd.pvi.ptid1","qxd":"application/vnd.quark.quarkxpress","qxt":"application/vnd.quark.quarkxpress","qwd":"application/vnd.quark.quarkxpress","qwt":"application/vnd.quark.quarkxpress","qxl":"application/vnd.quark.quarkxpress","qxb":"application/vnd.quark.quarkxpress","bed":"application/vnd.realvnc.bed","mxl":"application/vnd.recordare.musicxml","musicxml":"application/vnd.recordare.musicxml+xml","cryptonote":"application/vnd.rig.cryptonote","cod":"application/vnd.rim.cod","rm":"application/vnd.rn-realmedia","rmvb":"application/vnd.rn-realmedia-vbr","link66":"application/vnd.route66.link66+xml","st":"application/vnd.sailingtracker.track","see":"application/vnd.seemail","sema":"application/vnd.sema","semd":"application/vnd.semd","semf":"application/vnd.semf","ifm":"application/vnd.shana.informed.formdata","itp":"application/vnd.shana.informed.formtemplate","iif":"application/vnd.shana.informed.interchange","ipk":"application/vnd.shana.informed.package","twd":"application/vnd.simtech-mindmapper","twds":"application/vnd.simtech-mindmapper","mmf":"application/vnd.smaf","teacher":"application/vnd.smart.teacher","sdkm":"application/vnd.solent.sdkm+xml","sdkd":"application/vnd.solent.sdkm+xml","dxp":"application/vnd.spotfire.dxp","sfs":"application/vnd.spotfire.sfs","sdc":"application/vnd.stardivision.calc","sda":"application/vnd.stardivision.draw","sdd":"application/vnd.stardivision.impress","smf":"application/vnd.stardivision.math","sdw":"application/vnd.stardivision.writer","vor":"application/vnd.stardivision.writer","sgl":"application/vnd.stardivision.writer-global","smzip":"application/vnd.stepmania.package","sm":"application/vnd.stepmania.stepchart","sxc":"application/vnd.sun.xml.calc","stc":"application/vnd.sun.xml.calc.template","sxd":"application/vnd.sun.xml.draw","std":"application/vnd.sun.xml.draw.template","sxi":"application/vnd.sun.xml.impress","sti":"application/vnd.sun.xml.impress.template","sxm":"application/vnd.sun.xml.math","sxw":"application/vnd.sun.xml.writer","sxg":"application/vnd.sun.xml.writer.global","stw":"application/vnd.sun.xml.writer.template","sus":"application/vnd.sus-calendar","susp":"application/vnd.sus-calendar","svd":"application/vnd.svd","sis":"application/vnd.symbian.install","sisx":"application/vnd.symbian.install","xsm":"application/vnd.syncml+xml","bdm":"application/vnd.syncml.dm+wbxml","xdm":"application/vnd.syncml.dm+xml","tao":"application/vnd.tao.intent-module-archive","pcap":"application/vnd.tcpdump.pcap","cap":"application/vnd.tcpdump.pcap","dmp":"application/vnd.tcpdump.pcap","tmo":"application/vnd.tmobile-livetv","tpt":"application/vnd.trid.tpt","mxs":"application/vnd.triscape.mxs","tra":"application/vnd.trueapp","ufd":"application/vnd.ufdl","ufdl":"application/vnd.ufdl","utz":"application/vnd.uiq.theme","umj":"application/vnd.umajin","unityweb":"application/vnd.unity","uoml":"application/vnd.uoml+xml","vcx":"application/vnd.vcx","vsd":"application/vnd.visio","vst":"application/vnd.visio","vss":"application/vnd.visio","vsw":"application/vnd.visio","vis":"application/vnd.visionary","vsf":"application/vnd.vsf","wbxml":"application/vnd.wap.wbxml","wmlc":"application/vnd.wap.wmlc","wmlsc":"application/vnd.wap.wmlscriptc","wtb":"application/vnd.webturbo","nbp":"application/vnd.wolfram.player","wpd":"application/vnd.wordperfect","wqd":"application/vnd.wqd","stf":"application/vnd.wt.stf","xar":"application/vnd.xara","xfdl":"application/vnd.xfdl","hvd":"application/vnd.yamaha.hv-dic","hvs":"application/vnd.yamaha.hv-script","hvp":"application/vnd.yamaha.hv-voice","osf":"application/vnd.yamaha.openscoreformat","osfpvg":"application/vnd.yamaha.openscoreformat.osfpvg+xml","saf":"application/vnd.yamaha.smaf-audio","spf":"application/vnd.yamaha.smaf-phrase","cmp":"application/vnd.yellowriver-custom-menu","zir":"application/vnd.zul","zirz":"application/vnd.zul","zaz":"application/vnd.zzazz.deck+xml","vxml":"application/voicexml+xml","wgt":"application/widget","hlp":"application/winhlp","wsdl":"application/wsdl+xml","wspolicy":"application/wspolicy+xml","7z":"application/x-7z-compressed","abw":"application/x-abiword","ace":"application/x-ace-compressed","dmg":"application/x-apple-diskimage","aab":"application/x-authorware-bin","x32":"application/x-authorware-bin","u32":"application/x-authorware-bin","vox":"application/x-authorware-bin","aam":"application/x-authorware-map","aas":"application/x-authorware-seg","bcpio":"application/x-bcpio","torrent":"application/x-bittorrent","blb":"application/x-blorb","blorb":"application/x-blorb","bz":"application/x-bzip","bz2":"application/x-bzip2","boz":"application/x-bzip2","cbr":"application/x-cbr","cba":"application/x-cbr","cbt":"application/x-cbr","cbz":"application/x-cbr","cb7":"application/x-cbr","vcd":"application/x-cdlink","cfs":"application/x-cfs-compressed","chat":"application/x-chat","pgn":"application/x-chess-pgn","nsc":"application/x-conference","cpio":"application/x-cpio","crx":"application/x-chrome-extension","csh":"application/x-csh","deb":"application/x-debian-package","udeb":"application/x-debian-package","dgc":"application/x-dgc-compressed","dir":"application/x-director","dcr":"application/x-director","dxr":"application/x-director","cst":"application/x-director","cct":"application/x-director","cxt":"application/x-director","w3d":"application/x-director","fgd":"application/x-director","swa":"application/x-director","wad":"application/x-doom","ncx":"application/x-dtbncx+xml","dtb":"application/x-dtbook+xml","res":"application/x-dtbresource+xml","dvi":"application/x-dvi","evy":"application/x-envoy","eva":"application/x-eva","bdf":"application/x-font-bdf","gsf":"application/x-font-ghostscript","psf":"application/x-font-linux-psf","otf":"font/opentype","pcf":"application/x-font-pcf","snf":"application/x-font-snf","ttf":"application/x-font-ttf","ttc":"application/x-font-ttf","pfa":"application/x-font-type1","pfb":"application/x-font-type1","pfm":"application/x-font-type1","afm":"application/x-font-type1","woff":"application/font-woff","arc":"application/x-freearc","spl":"application/x-futuresplash","gca":"application/x-gca-compressed","ulx":"application/x-glulx","gnumeric":"application/x-gnumeric","gramps":"application/x-gramps-xml","gtar":"application/x-gtar","hdf":"application/x-hdf","install":"application/x-install-instructions","iso":"application/x-iso9660-image","jnlp":"application/x-java-jnlp-file","latex":"application/x-latex","luac":"application/x-lua-bytecode","lzh":"application/x-lzh-compressed","lha":"application/x-lzh-compressed","mie":"application/x-mie","prc":"application/x-mobipocket-ebook","mobi":"application/x-mobipocket-ebook","application":"application/x-ms-application","lnk":"application/x-ms-shortcut","wmd":"application/x-ms-wmd","wmz":"application/x-msmetafile","xbap":"application/x-ms-xbap","mdb":"application/x-msaccess","obd":"application/x-msbinder","crd":"application/x-mscardfile","clp":"application/x-msclip","exe":"application/x-msdownload","dll":"application/x-msdownload","com":"application/x-msdownload","bat":"application/x-msdownload","msi":"application/x-msdownload","mvb":"application/x-msmediaview","m13":"application/x-msmediaview","m14":"application/x-msmediaview","wmf":"application/x-msmetafile","emf":"application/x-msmetafile","emz":"application/x-msmetafile","mny":"application/x-msmoney","pub":"application/x-mspublisher","scd":"application/x-msschedule","trm":"application/x-msterminal","wri":"application/x-mswrite","nc":"application/x-netcdf","cdf":"application/x-netcdf","nzb":"application/x-nzb","p12":"application/x-pkcs12","pfx":"application/x-pkcs12","p7b":"application/x-pkcs7-certificates","spc":"application/x-pkcs7-certificates","p7r":"application/x-pkcs7-certreqresp","rar":"application/x-rar-compressed","ris":"application/x-research-info-systems","sh":"application/x-sh","shar":"application/x-shar","swf":"application/x-shockwave-flash","xap":"application/x-silverlight-app","sql":"application/x-sql","sit":"application/x-stuffit","sitx":"application/x-stuffitx","srt":"application/x-subrip","sv4cpio":"application/x-sv4cpio","sv4crc":"application/x-sv4crc","t3":"application/x-t3vm-image","gam":"application/x-tads","tar":"application/x-tar","tcl":"application/x-tcl","tex":"application/x-tex","tfm":"application/x-tex-tfm","texinfo":"application/x-texinfo","texi":"application/x-texinfo","obj":"application/x-tgif","ustar":"application/x-ustar","src":"application/x-wais-source","der":"application/x-x509-ca-cert","crt":"application/x-x509-ca-cert","fig":"application/x-xfig","xlf":"application/x-xliff+xml","xpi":"application/x-xpinstall","xz":"application/x-xz","webapp":"application/x-web-app-manifest+json","z1":"application/x-zmachine","z2":"application/x-zmachine","z3":"application/x-zmachine","z4":"application/x-zmachine","z5":"application/x-zmachine","z6":"application/x-zmachine","z7":"application/x-zmachine","z8":"application/x-zmachine","xaml":"application/xaml+xml","xdf":"application/xcap-diff+xml","xenc":"application/xenc+xml","xhtml":"application/xhtml+xml","xht":"application/xhtml+xml","xml":"application/xml","xsl":"application/xml","xsd":"application/xml","dtd":"application/xml-dtd","xop":"application/xop+xml","xpl":"application/xproc+xml","xslt":"application/xslt+xml","xspf":"application/xspf+xml","mxml":"application/xv+xml","xhvml":"application/xv+xml","xvml":"application/xv+xml","xvm":"application/xv+xml","yang":"application/yang","yin":"application/yin+xml","zip":"application/zip","adp":"audio/adpcm","au":"audio/basic","snd":"audio/basic","mid":"audio/midi","midi":"audio/midi","kar":"audio/midi","rmi":"audio/midi","mp4a":"audio/mp4","m4a":"audio/mp4","mpga":"audio/mpeg","mp2":"audio/mpeg","mp2a":"audio/mpeg","mp3":"audio/mpeg","m2a":"audio/mpeg","m3a":"audio/mpeg","oga":"audio/ogg","ogg":"audio/ogg","spx":"audio/ogg","s3m":"audio/s3m","sil":"audio/silk","uva":"audio/vnd.dece.audio","uvva":"audio/vnd.dece.audio","eol":"audio/vnd.digital-winds","dra":"audio/vnd.dra","dts":"audio/vnd.dts","dtshd":"audio/vnd.dts.hd","lvp":"audio/vnd.lucent.voice","pya":"audio/vnd.ms-playready.media.pya","ecelp4800":"audio/vnd.nuera.ecelp4800","ecelp7470":"audio/vnd.nuera.ecelp7470","ecelp9600":"audio/vnd.nuera.ecelp9600","rip":"audio/vnd.rip","weba":"audio/webm","aac":"audio/x-aac","aif":"audio/x-aiff","aiff":"audio/x-aiff","aifc":"audio/x-aiff","caf":"audio/x-caf","flac":"audio/x-flac","mka":"audio/x-matroska","m3u":"audio/x-mpegurl","wax":"audio/x-ms-wax","wma":"audio/x-ms-wma","ram":"audio/x-pn-realaudio","ra":"audio/x-pn-realaudio","rmp":"audio/x-pn-realaudio-plugin","wav":"audio/x-wav","xm":"audio/xm","cdx":"chemical/x-cdx","cif":"chemical/x-cif","cmdf":"chemical/x-cmdf","cml":"chemical/x-cml","csml":"chemical/x-csml","xyz":"chemical/x-xyz","bmp":"image/bmp","cgm":"image/cgm","g3":"image/g3fax","gif":"image/gif","ief":"image/ief","jpeg":"image/jpeg","jpg":"image/jpeg","jpe":"image/jpeg","ktx":"image/ktx","png":"image/png","btif":"image/prs.btif","sgi":"image/sgi","svg":"image/svg+xml","svgz":"image/svg+xml","tiff":"image/tiff","tif":"image/tiff","psd":"image/vnd.adobe.photoshop","uvi":"image/vnd.dece.graphic","uvvi":"image/vnd.dece.graphic","uvg":"image/vnd.dece.graphic","uvvg":"image/vnd.dece.graphic","djvu":"image/vnd.djvu","djv":"image/vnd.djvu","dwg":"image/vnd.dwg","dxf":"image/vnd.dxf","fbs":"image/vnd.fastbidsheet","fpx":"image/vnd.fpx","fst":"image/vnd.fst","mmr":"image/vnd.fujixerox.edmics-mmr","rlc":"image/vnd.fujixerox.edmics-rlc","mdi":"image/vnd.ms-modi","wdp":"image/vnd.ms-photo","npx":"image/vnd.net-fpx","wbmp":"image/vnd.wap.wbmp","xif":"image/vnd.xiff","webp":"image/webp","3ds":"image/x-3ds","ras":"image/x-cmu-raster","cmx":"image/x-cmx","fh":"image/x-freehand","fhc":"image/x-freehand","fh4":"image/x-freehand","fh5":"image/x-freehand","fh7":"image/x-freehand","ico":"image/x-icon","sid":"image/x-mrsid-image","pcx":"image/x-pcx","pic":"image/x-pict","pct":"image/x-pict","pnm":"image/x-portable-anymap","pbm":"image/x-portable-bitmap","pgm":"image/x-portable-graymap","ppm":"image/x-portable-pixmap","rgb":"image/x-rgb","tga":"image/x-tga","xbm":"image/x-xbitmap","xpm":"image/x-xpixmap","xwd":"image/x-xwindowdump","eml":"message/rfc822","mime":"message/rfc822","igs":"model/iges","iges":"model/iges","msh":"model/mesh","mesh":"model/mesh","silo":"model/mesh","dae":"model/vnd.collada+xml","dwf":"model/vnd.dwf","gdl":"model/vnd.gdl","gtw":"model/vnd.gtw","mts":"model/vnd.mts","vtu":"model/vnd.vtu","wrl":"model/vrml","vrml":"model/vrml","x3db":"model/x3d+binary","x3dbz":"model/x3d+binary","x3dv":"model/x3d+vrml","x3dvz":"model/x3d+vrml","x3d":"model/x3d+xml","x3dz":"model/x3d+xml","appcache":"text/cache-manifest","manifest":"text/cache-manifest","ics":"text/calendar","ifb":"text/calendar","css":"text/css","less":"text/css","sass":"text/css","csv":"text/csv","event-stream":"text/event-stream","html":"text/html","htm":"text/html","n3":"text/n3","txt":"text/plain","text":"text/plain","conf":"text/plain","def":"text/plain","list":"text/plain","log":"text/plain","in":"text/plain","ini":"text/plain","mask":"text/plain","dsc":"text/prs.lines.tag","rtx":"text/richtext","sgml":"text/sgml","sgm":"text/sgml","tsv":"text/tab-separated-values","t":"text/troff","tr":"text/troff","roff":"text/troff","man":"text/troff","me":"text/troff","ms":"text/troff","ttl":"text/turtle","uri":"text/uri-list","uris":"text/uri-list","urls":"text/uri-list","vcard":"text/vcard","curl":"text/vnd.curl","dcurl":"text/vnd.curl.dcurl","scurl":"text/vnd.curl.scurl","mcurl":"text/vnd.curl.mcurl","sub":"text/vnd.dvb.subtitle","fly":"text/vnd.fly","flx":"text/vnd.fmi.flexstor","gv":"text/vnd.graphviz","3dml":"text/vnd.in3d.3dml","spot":"text/vnd.in3d.spot","jad":"text/vnd.sun.j2me.app-descriptor","wml":"text/vnd.wap.wml","wmls":"text/vnd.wap.wmlscript","vtt":"text/vtt","s":"text/x-asm","asm":"text/x-asm","c":"text/x-c","cc":"text/x-c","cxx":"text/x-c","cpp":"text/x-c","h":"text/x-c","hh":"text/x-c","dic":"text/x-c","htc":"text/x-component","f":"text/x-fortran","for":"text/x-fortran","f77":"text/x-fortran","f90":"text/x-fortran","java":"text/x-java-source","lua":"text/x-lua","markdown":"text/x-markdown","md":"text/x-markdown","mkd":"text/x-markdown","nfo":"text/x-nfo","opml":"text/x-opml","p":"text/x-pascal","pas":"text/x-pascal","etx":"text/x-setext","sfv":"text/x-sfv","uu":"text/x-uuencode","vcs":"text/x-vcalendar","vcf":"text/x-vcard","3gp":"video/3gpp","3g2":"video/3gpp2","h261":"video/h261","h263":"video/h263","h264":"video/h264","jpgv":"video/jpeg","jpm":"video/jpm","jpgm":"video/jpm","mj2":"video/mj2","mjp2":"video/mj2","mp4":"video/mp4","mp4v":"video/mp4","mpg4":"video/mp4","ts":"video/MP2T","mpeg":"video/mpeg","mpg":"video/mpeg","mpe":"video/mpeg","m1v":"video/mpeg","m2v":"video/mpeg","ogv":"video/ogg","qt":"video/quicktime","mov":"video/quicktime","uvh":"video/vnd.dece.hd","uvvh":"video/vnd.dece.hd","uvm":"video/vnd.dece.mobile","uvvm":"video/vnd.dece.mobile","uvp":"video/vnd.dece.pd","uvvp":"video/vnd.dece.pd","uvs":"video/vnd.dece.sd","uvvs":"video/vnd.dece.sd","uvv":"video/vnd.dece.video","uvvv":"video/vnd.dece.video","dvb":"video/vnd.dvb.file","fvt":"video/vnd.fvt","mxu":"video/vnd.mpegurl","m4u":"video/vnd.mpegurl","pyv":"video/vnd.ms-playready.media.pyv","uvu":"video/vnd.uvvu.mp4","uvvu":"video/vnd.uvvu.mp4","viv":"video/vnd.vivo","webm":"video/webm","f4v":"video/x-f4v","fli":"video/x-fli","flv":"video/x-flv","m4v":"video/x-m4v","mkv":"video/x-matroska","mk3d":"video/x-matroska","mks":"video/x-matroska","mng":"video/x-mng","asf":"video/x-ms-asf","asx":"video/x-ms-asf","vob":"video/x-ms-vob","wm":"video/x-ms-wm","wmv":"video/x-ms-wmv","wmx":"video/x-ms-wmx","wvx":"video/x-ms-wvx","avi":"video/x-msvideo","movie":"video/x-sgi-movie","smv":"video/x-smv","ice":"x-conference/x-cooltalk"}
		//end:source data/MimeTypes.yml
	][0];
	
	var _stringMimes = {
		'application/javascript': 1,
		'application/x-javascript': 1,
		'application/json': 1
	};
	
}());
// end:source MimeTypes.js
// source Rewrite.js
var Rewrite;
(function(){
	Rewrite = {
		process: function(path, config){
			if (_rewrites.hasOwnProperty(path)) 
				return _rewrites[path];
			
			if (path.charCodeAt(path.length - 1) === 47) {
				// /
				path += config && config.index || 'index.html';
			}
			
			
			// .reference
			if (path.indexOf('.reference') !== -1) 
				return rewrite_reference(path);
			
			return path;
		}
	};
	
	// source rewrite/reference.js
	var rewrite_reference;
	(function(){
		rewrite_reference = function(path){
			if (typeof app === 'undefined' || app.config == null) 
				return path;
			
			var regexp = /\.reference\/([^\/]+)/,
				match = regexp.exec(path),
				project = match && match[1],
				projects = app.config.projects;
				
			if (projects == null)
				return path;
			
			var data = projects[project];
			if (data == null) 
				return path;
			
			var str = '.reference/' + project;
			var projectPath = typeof data === 'string'
				? data
				: data.path;
			
			if (projectPath == null) 
				return path;
			
			return Uri.combine(
				projectPath, path.substring(match.index + str.length)
			);
		};
	}());
	// end:source rewrite/reference.js
	
	var _rewrites = {};
	
}());
// end:source Rewrite.js
// source Entry/entry.js
var entry_get,
	entry_cache_state,
	entry_cache_remove,
	entry_cache_watch
	;
	
(function(){
	entry_get = function(path, req, config){
		
		if (Cache.hasOwnProperty(path)) 
			return Cache[path];
		
		var mimeType = MimeTypes.resolveByPath(path),
			file = File_Static.create(path, mimeType, req, config)
			;
		
		if (CacheEnabled === false) 
			return file;
		
		return (Cache[path] = file);	
	};
	entry_cache_state = function(state){
		if (state === false) 
			Cache = {};
		io.File[
			state && 'enableCache' || 'disableCache'
		]();
		CacheEnabled = state;
	};
	entry_cache_remove = function(path){
		delete Cache[path];
		io.File.clearCache(path);
	};
	entry_cache_watch = function(state){
		CacheWatch = state;
	};
	
	var Cache = {},
		CacheEnabled = true,
		CacheWatch = true;
	
	//source File_Static.js
	var File_Static;
	(function(){
		
		File_Static = Utils.class_create(Utils.class_Dfr, {
			path: null,
			mimeType: null,
			modified: null,
			etag: null,
			maxAge: 60,
			size: null,
			/*
			 * Is implemented only in File_String
			 */
			gzip: null,
			content: null,
			
			constructor: function(path, mimeType, req){
				this.path = path;
				this.mimeType = mimeType;
				this.getStats(req, this.statsCompleted);
			},
			
			write: function(req, res, settings){
				
				// weak caching
				if (this.etag != null) {
					res.setHeader('ETag', this.etag);
				}
				if (this.modified != null) {
					res.setHeader('Last-Modified', this.modified.toUTCString());
				}
				
				// strong caching
				var maxAge = settings.maxAge == null
					? this.maxAge
					: settings.maxAge;
				if (maxAge != null) {
					res.setHeader('Cache-Control', 'public, max-age=' + maxAge);
				}
				
				// content
				var encoding = this.getEncoding(req),
					length = this.getLength(encoding)
					;
				if (encoding != null) {
					res.setHeader('Content-Encoding', encoding);
				}
				if (settings.headers != null) {
					res_writeHeaders(res, settings.headers);
				}
				if (this.isNotModified(req)) {
					res.statusCode = 304;
					res.end();
					return;
				}
				MimeTypes.writeHead(res, this.mimeType);
				res.setHeader('Content-Length', length);
				
				if (req.method === 'HEAD') {
					res.end();
					return;
				}
				this.writeBody(res, encoding, settings);
			},
			writeBody: function(res, encoding){
				
				var data = encoding === 'gzip'
					? this.gzip
					: this.content
					;
				res.end(data);
			},
			
			getStats: function(req, cb){
				var self = this;
				file_stats(this.path, function(error, stat){
					if (error) {
						
						if (error.code === 'ENOENT') {
							var virtual = File
								.getFactory()
								.resolveHandler('file://' + self.path);
							if (virtual != null) {
								
								if (cb)
									return cb(self, {}, req);
								
								self.resolve(self);
							}
						}
						
						self.reject(error);
						return;
					}
					if (stat.isFile() === false) {
						if (stat.isDirectory()) {
							self.reject({ code: 'EISDIR' });
							return;
						}
						self.reject({ code: 'ENOTFILE' });
						return;
					}
					
					self.etag = calcETag(self.path, stat);
					self.modified = stat.mtime;
					self.size = stat.size;
					
					if (cb)
						return cb(self, stat, req);
					
					self.resolve(self);
				});
			},
			getFilename: function(){
				var slash = this.path.lastIndexOf('/');
				return slash === -1
					? this.path
					: this.path.substring(slash + 1)
					;
			},
			getEncoding: function(req){
				if (this.gzip == null) 
					return null;
				
				var accept = req.headers['accept-encoding'];
				return accept && /\bgzip\b/.test(accept)
					? 'gzip'
					: null
					;
			},
			getLength: function(encoding){
				if (encoding === 'gzip') 
					return this.gzip.length;
				
				if (this.content == null) 
					return this.size || 0;
				
				if (typeof this.content === 'string') 
					return Buffer.byteLength(this.content, 'utf8');
				
				// assume Buffer or BufferLike content
				return this.content.length;
			},
			isNotModified: function(req) {
				var etag = req.headers['if-none-match'],
					utc = req.headers['if-modified-since'];
				
				if (this.etag != null && etag) 
					return this.etag === etag;
				
				if (this.modified != null && utc) 
					return this.modified <= Date.parse(utc);
				
				return false;
			}
		});
		
		File_Static.create = function(path, mimeType, req){				
			var Ctor = MimeTypes.isString(mimeType)
				? File_String
				: File_Stream
				;
			return new Ctor(path, mimeType, req);
		};
		
		// source File_String.js
		var File_String;
		(function(){
			File_String = Utils.class_create(File_Static, {
				
				statsCompleted: function(self, stats){
					
					File
						.readAsync('file://' + self.path, { encoding: 'buffer' })
						.pipe(self, 'fail')
						.done(function(content, file){
							__eventStream.trigger('file', file || self);
							
							if (content != null
								&& typeof content === 'object'
								&& Buffer.isBuffer(content) === false) {
								
								content = serialize(content);
							}
							
							self.content = content;
							
							if (content.length < 100) {
								self.resolve(self);
								return;
							}
							
							file_gzip(content, function(gzip){
								if (gzip != null && gzip.length < stats.size) 
									self.gzip = gzip;
								
								self.resolve(self);
							});
						});
				}
			});
			
			function serialize(obj){
				try {
					return JSON.stringify(obj);
				} catch(error) {
					return error.message;
				}
			}
			var _obj_toString = Object.prototype.toString;
		}());
		// end:source File_String.js
		// source File_Stream.js
		var File_Stream;
		(function(){
			File_Stream = Utils.class_create(File_Static, {
				maxAge: 60 * 30,
				
			 
				write: function(req, res, settings){
					var range = Range.tryGet(this, req);
					if (range != null) {
						Range.write(this, range, res, settings);
						return;
					}
					
					res.setHeader('Accept-Ranges', 'bytes');
					File_Static.prototype.write.call(this, req, res, settings);
				},
			
				
				writeBody: function(res, encoding, settings) {
					var options = {
						flags: 'r'
					};
					if (settings != null && settings.start != null) {
						var range = Range.toRange(
								settings.start
								, settings.end
								, this.size
							);
						
						if (range[1] >= range[0]) {
							options.start = range[0];
							options.end = range[1];
						}
					}
					var stream = __fs.createReadStream(this.path, options);
					var streamDispose = stream.destroy.bind(stream),
						resDispose = res.destroy.bind(res);
					
					stream
						.on('close', resDispose)
						.on('error', resDispose)
						.pipe(res)
						.on('close', streamDispose)
						.on('error', streamDispose)
						;
				}
			});
			
			
			var Range;
			(function(){
				Range = {
					tryGet: function(file, req) {
						var range = req.headers.range;
						if (range == null) 
							return null;
						
						var ifRange = req.headers['if-range'];
						if (ifRange != null && isModified(ifRange, file)) 
							return null;
						
						var parts = /bytes=(\d+)?-(\d+)?$/.exec(range);
						if (parts == null) 
							return null;
						
						return this.toRange(+parts[1], +parts[2], file.size);
					},
					toRange: function(start, end, size){
						if (isNaN(start)) {
							if (isNaN(end) === false) {
								start = size - end;
								end = size - 1;
							}else {
								start = 0;
							}
						}
						if (isNaN(end))
							end = size - 1;
						if (end > size - 1) {
							//- end = -1; not an error, adjust range:
							end = size - 1;
						}
						if (end < start) 
							end = -1;
						return [start, end];
					},
					write: function(file, range, res){
						if (range[1] === -1) {
							res.writeHead(416, {
								'Content-Type': 'text/plain',
								'Content-Range': 'bytes */' + file.size
							});
							res.end('Requested Range Not Satisfiable');
							return;
						}
						
						
						var start = range[0],
							end = range[1];
						
						var size = end - start + 1,
							headers = {
							'Connection': 'keep-alive',
							'Cache-Control': 'public; max-age=' + file.maxAge,
							'Content-Type': file.mimeType,
							'Content-Transfer-Encoding': 'binary',
							'Content-Length': size,
							'Content-Disposition': 'inline; filename=' + file.getFilename() + ';',
							'Status': '206 Partial Content',
							'Accept-Ranges': 'bytes',
							'Content-Range': 'bytes ' + start + '-' + end + '/' + file.size
						};
						if (this.etag != null) 
							headers['ETag'] = this.etag;
						if (this.modified != null) 
							headers['Last-Modified'] = this.modified.toUTCString();
						
						res.writeHead(206, headers);
						
						if (start > 0 && file.mimeType === 'video/x-flv') 
							res.write('FLV' + pack('CCNN', 1, 5, 9, 9));
						
						__fs
							.createReadStream(file.path, {
								flags: 'r',
								start: start,
								end: end
							})
							.pipe(res)
							;
					},
					
				};
				
				function isModified(mix, file) {
					
					var isETag = mix.indexOf('"') !== -1;
					if (isETag && file.etag != null) 
						return file.etag.indexOf(mix) === -1;
					
					if (!isETag && file.modified != null) {
						return Date.parse(file.modified) > Date.parse(mix);
					}
					return true;
				}
				// A tiny subset of http://phpjs.org/functions/pack:880
				function pack(format) {
					var result = '',
						args = arguments,
						fromCode = String.fromCharCode,
						imax = args.length,
						i = 0;
					while ( ++i < imax) {
						if (format[i - 1] === 'N') {
							result += fromCode(args[i] >> 24 & 0xFF)
									+ fromCode(args[i] >> 16 & 0xFF)
									+ fromCode(args[i] >> 8 & 0xFF)
									+ fromCode(args[i] & 0xFF)
									;
							continue;
						} 
						result += fromCode(args[i]);
					}
					return result;
				}
			}());
		}());
		// end:source File_Stream.js
		
		var calcETag;
		(function(){
			calcETag = function (path, stat){
				var base64,
					tag = stat.mtime.getTime()
						+ ':'
						+ stat.size
						+ ':'
						+ path
					;
				if (_crypto == null) 
					_crypto = require('crypto');
				
				base64 = _crypto
					.createHash('md5')
					.update(tag, 'utf8')
					.digest('base64');
					
				return 'W/"' + base64 + '"';
			};
			var _crypto;
		}());
		
		
	}());
	//end:source File_Static.js
}());
// end:source Entry/entry.js

// source utils/path.js
var path_fromUrl,
	path_toDir;
(function(){
	
	path_fromUrl = function(url, appConfig, settings){
		var path = url,
			base = null,
			query = url.indexOf('?');
		if (query !== -1) 
			path = url.substring(0, query);
			
		path = decode(path);
		if (path == null) 
			return 400;
		
		if (path.indexOf('\0') !== -1) 
			return 400;
		
		path = normalize(path);
		path = collapse(path);
		if (path == null) 
			return 403;
		
		var rewritten = Rewrite.process(path, appConfig);
		if (rewritten !== path) {
			if (fileProtocol_has(rewritten)) 
				return normalize(fileProtocol_cut(rewritten));
			
			path = rewritten;
		}
		
		base = getBase(appConfig, settings);
		return _Uri.combine(base, path);
	};
	path_toDir = function(url){
		var path = url,
			query = url.indexOf('?');
		if (query !== -1) 
			path = url.replace(0, query);
		
		if (path.charCodeAt(path.length - 1) === 47) {
			// / <is directory>
			return null;
		}
		return path + '/';
	};
	var _Uri = Uri,
		_cwd = normalize(process.cwd()),
		_subFolder = /([^\/]+\/)?\.\.\//
		;
		
	function decode(path) {
		if (path == null) 
			return null;
		
		if (path.indexOf('%') === -1 && path.indexOf('+') === -1) 
			return path;
		
		try {
			return decodeURIComponent(path);
		} catch(error){
			return null;
		}
	}
	function normalize(path) {
		return path
			.replace(/\\/g, '/')
			.replace(/^\.\//, '')
			.replace(/\/\.\//g, '/')
			.replace(/\/{2,}/g, '/')
			;
	}
	function collapse(path) {
		if (path == null) 
			return null;
		var errored = false;
		while (errored === false && path.indexOf('../') !== -1) {
			path = path.replace(_subFolder, replace);
		}
		function replace(full, segment) {
			if (!segment) 
				errored = true;
			return '';
		}
		
		return errored === false
			? path
			: null
			;
	}
	
	var fileProtocol_has,
		fileProtocol_cut;
	(function(){
		fileProtocol_has = function(path){
			return path.substring(0, 5) === 'file:';
		};
		fileProtocol_cut = function (path) {
			path = path.replace('file://', '');
			
			return path[0] === '/' && rgx_hasDrive.test(path)
				? path.substring(1)
				: path;
		};
		var rgx_hasDrive = /^\/?[A-Za-z]:(\/|\\)/;
	}());
	
	var getBase;
	(function(){
		getBase = function (appConfig, settings){
			var base = findBase(appConfig, settings);
			if (base == null) 
				return _cwd;
			
			return fileProtocol_has(base)
				? fileProtocol_cut(base)
				: normalize(_Uri.combine(_cwd, base))
				;
		};
		
		
		function findBase(appConfig, settings) {
			if (settings != null) {
				if (settings.base != null) 
					return settings.base;
			}
			if (appConfig != null){
				if (appConfig.static != null) 
					return appConfig.static;
				if (appConfig.base != null) 
					return appConfig.base;
			}
			return null;
		}
	}());
	
}());
// end:source utils/path.js
// source utils/send.js
var send_error,
	send_toHttpError,
	send_redirect,
	send_headersWritable;
(function(){
	
	send_toHttpError = function(mix, message){
		if (typeof mix === 'number') {
			return fromStatusCode(mix, message);
		}
		return fromError(mix);
	};
	send_error = function(res, error){
		var httpError = fromError(error);
		
		res.writeHead(httpError.code, {
			'Content-Type': 'text/plain'
		});
		res.end(httpError.message);
	};
	send_headersWritable = function(res){
		var sent = res._headerSent;
		if (typeof sent === 'boolean') 
			return sent === false;
		
		return trySet(res, 'X-Powered-By', 'AtmaNode');
	};
	send_redirect = function(res, path){
		res.statusCode = 301;
		res.setHeader('Location', path);
		res.end('Redirecting to ' + str_escape(path));
	};
	
	function fromStatusCode(code, message) {
		if (message == null) {
			if (STATUS_CODES == null) 
				STATUS_CODES = require('http').STATUS_CODES;
			
			message = STATUS_CODES[code];
		}
		var error = new Error(message);
		error.code = code;
		return error;
	}
	function fromError(error) {
		if (typeof error === 'number') 
			return fromStatusCode(error);
		
		var code = error.code,
			message = error.message;
		if (code == null) 
			code = 500;
		if (typeof code === 'string') {
			switch(code){
				case 'ENOENT':
				case 'ENAMETOOLONG':
				case 'ENOTDIR':
				case 'ENOTFILE':
					code = 404;
					message = null;
					break;
				default:
					code = 500;
					break;
			}
		}
		return fromStatusCode(code, message);
	}
	function trySet(res, key, val) {
		try {
			res.setHeader(key, val);
			return true;
		} catch(error){
			return false;
		}
	}
	
	var STATUS_CODES;
}());

// end:source utils/send.js
// source utils/responder.js
var responder_create;

(function(){
	responder_create = function(settings){
		
		if (settings.mimeTypes) 
			MimeTypes.registerMimeTypes(settings.mimeTypes);
		
		if (settings.extensions) 
			MimeTypes.registerExtensions(settings.extensions);
			
		if (settings.defaultMimeType) 
			MimeTypes.setDefault(settings.defaultMimeType);
		
		return function(req, res, appConfig){
			var dfr = new Utils.class_Dfr;
			
			if (res.writable === false || res.finished === true) {
				return reject(Error('Stream is not writable'));
			}
			if (send_headersWritable(res) === false) 
				return reject(Error("Can't set headers after they are sent."));
			
			var mix = path_fromUrl(req.url, appConfig, settings);
			if (typeof mix === 'number') 
				return reject({ code: mix });
			
			var path = mix;
			
			entry_get(path, req)
				.done(function(entry){
					entry.write(req, res, settings);
					dfr.resolve();
				})
				.fail(function(error){
					if (error.code === 'EISDIR') {
						rejectDirectory(error);
						return;
					}
					reject(error);
				})
				;
			
			function rejectDirectory(error){
				if (settings.handleDirectory) {
					path = path_toDir(req.url);
					if (path != null) {
						// /
						send_redirect(res, path);
						dfr.resolve();
						return;
					}
					reject(403);
					return;
				}
				reject(error);
			}
			function reject(error) {
				if (settings.handleErrors) {
					send_error(res, error);
					return dfr.resolve();
				}
				return dfr.reject(error);
			}
			return dfr;
		};
	};
}());
// end:source utils/responder.js



// source interfaces/express_send.js
var interface_express_send;
(function(){
	interface_express_send = function(req, url, settings) {
		return new Express(req, url, settings);
	};
	
	var Express = Utils.class_create(Utils.class_EventEmitter, {
		constructor: function(req, url, settings){
			if (req.url !== url) 
				req.url = url;
			
			this.req = req;
			this.settings = obj_defaults(settings, { maxAge: 0 });
			this.appConfig = convertSettings(this.settings);
			this.responder = responder_create(this.settings);
		},
		maxage: function(ms){
			if (Infinity === ms)
				ms = 60 * 60 * 24 * 365 * 1000;
			this.settings.maxAge = ms / 1000 | 0;
			return this;
		},
		pipe: function(res){
			var self = this;
			
			this.settings.handleDirectory = !has(this, 'directory');
			this.settings.handleErrors = !has(this, 'error');
			
			this.responder(this.req, res, this.appConfig)
				.fail(function(error){
					if (error.code === 'EISDIR') {
						self.trigger('directory', error);
						return;
					}
					error = send_toHttpError(error);
					error.status = error.code;
					self.trigger('error', error);
					
				});
		}
	});
	
	function has(emitter, event){
		var arr = emitter._listeners[event];
		return arr != null && arr.length > 0;
	}
	function convertSettings(settings) {
		var config = {
			base: settings.root,
			index: settings.index
		};
		return config;
	}
}());
// end:source interfaces/express_send.js

module.exports = {
	create: createMiddleware,
	respond: createMiddleware(),
	
	send: interface_express_send,
	
	Cache: {
		state: entry_cache_state,
		remove: entry_cache_remove
	},
	
	on:  __eventStream.on.bind(__eventStream),
	off: __eventStream.off.bind(__eventStream),
	
	utils: {
		/* (url, config, ?settings) */
		resolvePath: path_fromUrl
	}
};

/*
 * staticContentSettings {
   mimeTypes: { mimeType: extensions }
   extensions: {
	   extension: mimeTypeString || {
		   mimeType: string
		   encoding: string
		   cacheControl: Number
		   maxAge: Number
	   }
   },
   defaultMimeType: string,
   
   // do not send errors on 404, but continue the middleware pipeline
   silentNotFound: Boolean
 }
*/
function createMiddleware(settings) {
	settings = settings || {};
	var responder = responder_create(settings);
	return function(req, res, next){
		// make it connectjs middleware compatible
		var config = arguments.length > 3
			? arguments[3]
			: null;
			
		responder(req, res, config)
			.fail(function(error) {
				if (next != null) {
					error = send_toHttpError(error);
					if (error.code === 404 && settings.silentNotFound !== false) 
						error = null;
					
					next(error);
					return;
				}
				send_error(res, error);
			});
	};
}
//end:source /src/static.js