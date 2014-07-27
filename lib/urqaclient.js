
/**

 비 동기 방식으로 처리 되므로, 큐잉 로직이 들어가야 할 듯 ~~!!
 브라우져 종료도 인지 해야 하고... ^^;;
 쿠키를 사용해서 세션 유지도 확인 해야 하고 ~~ 할일이 많구만 ~~!

*/

var urqa = function(){

	var URQA_URL = "http://www.urqa.io";
	var api_key = "";
	var version= "";
	var session_key = "";
	var wrapping_server = null;

	var ret = {};

	// Translate
	var converToJavaTypeException = function( trace ){
		var ret = trace.join('\n\t');
		try{
			var msg = "";
			for( var i in trace ){
				var tmp = trace[i].split('@');
				tmp[0] = tmp[0].replace( '()', '' );
				msg = msg + '\tat ' + tmp[0] + '(' + tmp[1] + ')' + '\n';
			}
			return msg;
		}catch(err){}

		return ret;
	};


	var callUrQA = function( uri, data ){

		if( null == wrapping_server ){
			alert( "Not Support Direct Connect.\nPlease use a wrapping server.");
		}else{

			$.post( wrapping_server, {
				    data_type:'json',
				    data: { uri:uri ,data:data }
				}, function( data ) {
					//console.log("test " + data );
					session_key = data.idsession;
					//console.log("session key " + session_key );
				});	
		}

	};

	// createSession
	var linkToUrQAServer = function( ) {
		var url = URQA_URL + "/urqa/client/connect";
		var reqobj = '{"apikey":"' + api_key + '", "appversion":"'+version+'"}' ;
		callUrQA( url, reqobj );
	};


	// 초기화
	/**
	 *
	 * @param _apikey
	 * @param _version
	 * @param _wrapping_server
	 */
	ret.init = function( _apikey, _version, _wrapping_server ){
		api_key = _apikey;
		version = _version;

		if( !( _wrapping_server == null || _wrapping_server == undefined ) ){
			wrapping_server = _wrapping_server;
		}

		linkToUrQAServer();
	};

	// Exception 전송
	ret.send_exception = function( err ){
		var trace = printStackTrace({e: err});
		console.log(converToJavaTypeException( trace ));
	};

	return ret;

}();