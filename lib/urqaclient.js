
/**

 비 동기 방식으로 처리 되므로, 큐잉 로직이 들어가야 할 듯 ~~!!
 브라우져 종료도 인지 해야 하고... ^^;;
 쿠키를 사용해서 세션 유지도 확인 해야 하고 ~~ 할일이 많구만 ~~!
*/
var urqa = function( ){
	//http://ur-qa.com/urqa/
	//var URQA_URL = "http://www.urqa.io";
	//var URQA_URL = "http://ur-qa.com";
	var URQA_URL = "http://125.209.194.101:49999";
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

			$.ajax({
			    url : wrapping_server + "?callback=?",
			    data: { uri:uri ,data:data },
			    dataType : "jsonp",
			    jsonp : "callback",
			    success: function(data) {
			        if(data != null){
			        	if(uri == URQA_URL + "/urqa/client/connect" ){
			        		session_key = jQuery.parseJSON(data).idsession;
			        		//console.log( "it's a get datasession " +  );
			        	}
			            console.log( data );
			        }
			    }
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

		var now = new Date();
		var now_date_string = now.format("yyyy-mm-dd HH:MM:ss");
		var utc_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

		console.log("Current Date : " + now_date_string + " "+ utc_now.getTime() );

		console.log( trace );

		var url = URQA_URL + "/urqa/client/send/exception";
		var reqobj = '{' +
						'"exception": {' +
						    '"sdkversion": "0.95", ' +
						    '"scrorientation": 0, ' +
						    '"appmemfree": 7, ' +
						    //'"callstack": "java.lang.RuntimeException: Could not read input channel file descriptors from parcel.\n\tat android.view.InputChannel.nativeReadFromParcel(Native Method)\n\tat android.view.InputChannel.readFromParcel(InputChannel.java:148)\n\tat android.view.InputChannel$1.createFromParcel(InputChannel.java:39)\n\tat android.view.InputChannel$1.createFromParcel(InputChannel.java:36)\n\tat com.android.internal.view.InputBindResult.<init>(InputBindResult.java:62)\n\tat com.android.internal.view.InputBindResult$1.createFromParcel(InputBindResult.java:102)\n\tat com.android.internal.view.InputBindResult$1.createFromParcel(InputBindResult.java:99)\n\tat com.android.internal.view.IInputMethodManager$Stub$Proxy.startInput(IInputMethodManager.java:608)\n\tat android.view.inputmethod.InputMethodManager.startInputInner(InputMethodManager.java:1175)\n\tat android.view.inputmethod.InputMethodManager$H.handleMessage(InputMethodManager.java:462)\n\tat android.os.Handler.dispatchMessage(Handler.java:102)\n\tat android.os.Looper.loop(Looper.java:136)\n\tat android.app.ActivityThread.main(ActivityThread.java:5086)\n\tat java.lang.reflect.Method.invokeNative(Native Method)\n\tat java.lang.reflect.Method.invoke(Method.java:515)\n\tat com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:785)\n\tat com.android.internal.os.ZygoteInit.main(ZygoteInit.java:601)\n\tat dalvik.system.NativeStart.main(Native Method)\n", ' +
						    '"callstack": "java.lang.RuntimeException: Could not read input channel file descriptors from parcel.\\n\\tat android.view.InputChannel.nativeReadFromParcel(Native Method)\\n\\tat android.view.InputChannel.readFromParcel(InputChannel.java:148)\\n\\tat android.view.InputChannel$1.createFromParcel(InputChannel.java:39)\\n\\tat android.view.InputChannel$1.createFromParcel(InputChannel.java:36)\\n\\tat com.android.internal.view.InputBindResult.<init>(InputBindResult.java:62)\\n\\tat com.android.internal.view.InputBindResult$1.createFromParcel(InputBindResult.java:102)\\n\\tat com.android.internal.view.InputBindResult$1.createFromParcel(InputBindResult.java:99)\\n\\tat com.android.internal.view.IInputMethodManager$Stub$Proxy.startInput(IInputMethodManager.java:608)\\n\\tat android.view.inputmethod.InputMethodManager.startInputInner(InputMethodManager.java:1175)\\n\\tat android.view.inputmethod.InputMethodManager$H.handleMessage(InputMethodManager.java:462)\\n\\tat android.os.Handler.dispatchMessage(Handler.java:102)\\n\\tat android.os.Looper.loop(Looper.java:136)\\n\\tat android.app.ActivityThread.main(ActivityThread.java:5086)\\n\\tat java.lang.reflect.Method.invokeNative(Native Method)\\n\\tat java.lang.reflect.Method.invoke(Method.java:515)\\n\\tat com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:785)\\n\\tat com.android.internal.os.ZygoteInit.main(ZygoteInit.java:601)\\n\\tat dalvik.system.NativeStart.main(Native Method)\\n", ' +
						    '"locale": "English", ' +
						    '"mobileon": 0, ' +
						    '"appversion": "1.5.4", ' +
						    '"rank": 0, ' +
						    '"datetime": "2014-07-31 13:42:18", ' +
						    '"xdpi": 326.5710144042969, ' +
						    '"tag": "", ' +
						    '"errorname": "java.lang.RuntimeException: Could not read input channel file descriptors from parcel.", ' +
						    '"eventpaths": [], ' +
						    '"appmemmax": 256, ' +
						    '"device": "XT1033", ' +
						    '"scrheight": 1184, ' +
						    '"batterylevel": 99, ' +
						    '"gpson": 0, ' +
						    '"rooted": 0, ' +
						    '"kernelversion": "3.4.42-gb2383d6", ' +
						    '"sysmemlow": 0, ' +
						    '"apikey": "10EB2BF7", ' +
						    '"linenum": -2, ' +
						    '"scrwidth": 720, ' +
						    '"country": "US", ' +
						    '"appmemtotal": 36, ' +
						    '"availsdcard": 1321, ' +
						    '"lastactivity": "", ' +
						    '"errorclassname": "android.view.InputChannel", ' +
						    '"ydpi": 328.40399169921875, ' +
						    '"osversion": "4.4.4", ' +
						    '"wifion": 1 ' +
							/*
							'"sdkversion": "0.95", '+  	// 나중에 브라우져 버전? 
							'"local": "English", ' +
							'"tag": "", '+
							'"rank": 2, '+
							'"callstack": "' + trace.join("\\t\\n") +'", '+
							'"apikey": "'+api_key+'", '+
							'"datetime": "'+now_date_string+'", '+
							'"device": "Android SDK built for x86", '+
							'"country": "US", '+ //지역
							'"errorname": "' + trace.join(",") + '", '+
							'"errorclassname": "unknown", '+
							'"linenum": 0, '+
							'"appversion": "' + version + '",  '+		// Android Application App Version
							'"osversion": "L", '+ 	// 나중엔 브라우져?? 버전
							'"gpson": 0, '+ // GPS on(value 1), off(value 0) 
							'"wifion": 1, '+ // WiFi on(value 1), off(value 0) 
							'"mobileon": 0, '+ // MobileNetwor(3G) on(value 1), off(value 0) 
							'"scrwidth": 320, '+ 
							'"scrheight": 432, '+ 
							'"batterylevel": 50, '+
							'"availsdcard": 0, '+
							'"rooted": 0, '+
							'"appmemtotal": 3, '+ // iOS Memory total
							'"appmemfree": 47, '+ // iOS Memory free
							'"appmemmax": 48, '+ // iOS Memory usage
							'"kernelversion": "3.4.0+", '+ 
							'"xdpi": 160, '+ 
							'"xdpi": 160, '+ 
							'"scrorientation": 0, '+ 
							'"sysmemlow": 0, '+ 
							'"lastactivity": "com.netand.hiauth.mobileotpv2.LogoActivity", ' +
							'"eventpaths": [], '+
							*/
						'},' +
						'"console_log" : { '+
							'"data" : "This is Test Message" '+ // Android Console Log
						'}, ' + 
						'"instance": {' +
        					'"id": ' + utc_now.getTime() + '' +
    					'},' +
    					'"version": "0.95"'+
					 '}';

		callUrQA( url, reqobj );
	};

	return ret;

}();