var res_hasWritableHeaders;
(function(){
	res_hasWritableHeaders = function(res){
		var sent = res._headerSent;
		if (typeof sent === 'boolean') 
			return sent === false;
		
		return trySet(res, 'X-Powered-By', 'AtmaNode');
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