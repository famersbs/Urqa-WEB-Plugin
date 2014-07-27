
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

		var url = URQA_URL + "/urqa/client/send/exception";
		var reqobj = '{' +
						'"sdkversion": "unknown", '+  	// 나중에 브라우져 버전? 
						'"errorname": "aaaa", '+
						'"function": "0x0000000", '+
						'"appversion": "' + version + '",  '+		// Android Application App Version
						'"osversion": "unknown", '+ 	// 나중엔 브라우져?? 버전
						'"msfromstart": 0 '+ // init 부터 지금까지의 시간을 재면 된다.
						'"tag": "", '+
						'"rank": 2, '+
						'"callstack": "' + trace +'", '+
						'"apikey": "'+api_key+'", '+
						'"architecture":"", '+
						'"datetime": "20140728000000", '+
						'"device": "chrome", '+
						'"country": "korea", '+ //지역
						'"locale": "korean", '+ //언어
						'"carrier": "internet", '+ //통신사업자
						'"exename": "test_app", '+
						'"buildid": "unknown", '+
						'"build_uuid": "unknown" '+
						'"gpson": 0, '+ // GPS on(value 1), off(value 0) 
						'"wifion": 1, '+ // WiFi on(value 1), off(value 0) 
						'"mobileon": 0, '+ // MobileNetwor(3G) on(value 1), off(value 0) 
						'"Jailbreak": 0, '+ // (true 1, false 0)
						'"Cracked": 0, '+ // (true 1, false 0)
						'"appmemtotal": 0, '+ // iOS Memory total
						'"appmemfree": 0, '+ // iOS Memory free
						'"appmemusage": 0, '+ // iOS Memory usage
						'"eventpaths": [{  '+// Event Paths
							'"datetime": "000000000000", '+
							'"prettyfunction": "test", '+ // class name
							'"line": "111", '+ // method name
							'"label": "hahaha", '+
						'}], '+
						'"console_log" : { '+
							'"data" : "" '+ // Android Console Log
						'} '+
					 '}';

		callUrQA( url, reqobj );
	};

	return ret;

}();