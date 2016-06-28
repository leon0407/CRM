var ua = navigator.userAgent.toLowerCase();
window.y_bridge_public={
	platform : null,
	isY : false,
	deviceId:"",
	version:0,
	client : null,
	orgid:"",
	userid:"",
	token: "",
    isNavbarHidden : true,
	isToolbarHidden : false,
	isGetClientInfo : false,
	memberId : null,
	memberInfoCBObj : null,
	NaEptStr : function(a){
		return!!("string"==typeof a&&a.length>0);
	},
	NaEptFun : function(a){
		return !!('function' == typeof a);
	},
	NaEptObj : function(a){
		if(null==a)return!1;
		if(a.length>0)return!0;
		if(0===a.length)return!1;
		for(var b in a)
			if(hasOwnProperty.call(a,b))
				return!0;
		return!1
	},
	stringifyAndEncode:function(a){
		return"string"==typeof a||this.NaEptObj(a)?encodeURIComponent(JSON.stringify(a)):"";
	},
	decodeAndParse:function(a){
		return this.NaEptStr(a)?JSON.parse(decodeURIComponent(a)):{};
	},
	buildParamString:function(a,b,c){
		var d={};
		d.param=a||null;
		d.CBPluginName=b||"";
		d.CBTagName="";
		d.token = window.y_bridge_public.token||"";
		//reg cb
		if(this.NaEptFun(c)){
			window[d.CBPluginName] = c;
		}
		//else if(this.NaEptStr(c)){
		//	var f = [];
		//	f[c] = function(p){
		//		eval(c+"("+ JSON.stringify(p) + ")");
		//	}
		//
		//	window[d.CBPluginName||"ntvcb"] = f;
		//}

		return JSON.stringify(d)
	},
	ntvCB : function(a){
		/*
		 window.y_bridge_public.ntvCB(stringifyAndEncode({"pluginname":"", "tagname":"", "param":{}}));
		 */
		if(a=a||"",this.NaEptStr(a)){
			var b=this.decodeAndParse(a),c=b.pluginname,d=b.tagname,e=b.param||{};
			if(window[c])
				return window[c](e);
			throw"回调web出错!不存在回调的方法"
		}
	},
	loadURL:function(a){
		if(window.y_bridge_public.isY
			&&window.y_bridge_public.client=="android"
			&&window.y_bridge_public.version>=10025){
			prompt(a);
			return;
		}
		var b=document.createElement("iframe"),
			c=document.body||document.documentElement;
		b.style.display="none",b.setAttribute("src",a),c.appendChild(b),
			setTimeout(function(){
				b.parentNode.removeChild(b),b=null;
			},200);
		// for debug
		console.log(decodeURIComponent(a));
	},
	isAppVersionGreatThan:function(a){
		var b=0;
		if(/yunxuetang/.test(ua)){
			var c=ua.split("/"),d=c.length,e=c[d-1],e=e.split(".");
			2==e.length?e.push(0):b=parseInt(e.join(""));
		}
		return b>=a;
	},
	init:function(){
		var i = window.navigator.userAgent.toLowerCase();
        var j = window.navigator.userAgent;

        if(i.indexOf("iphone") > 0){
			this.client = "iphone";
		}
		else if(i.indexOf("ipad") > 0){
			this.client = "ipad";
		}
		else if(i.indexOf("android") > 0){
			this.client = "android";
		}
		else{
			this.client = "pc or other"
		}
		console.log("user agent:" + i);
		console.log("client is:", this.client);

		// get token from cookie
		var arr = document.cookie.match(new RegExp("(^| )yxt.web.usertokencookiename=([^;]*)(;|$)"));
		if(arr != null){
			this.token = unescape(arr[2]);
			console.log("token:" + this.token);
		}
		else{
			console.log("notoken");
		}

		// initail app and version
		this.isY = i.indexOf("yunxuetang") > 0;
		if(this.isY){
			var tmp = i.match(new RegExp("yunxuetang/([0-9]+)"));
			if(tmp && tmp.length == 2){
				this.version = parseInt(tmp[1]);
			}
			var tmp2 = i.match(new RegExp("orgid/([a-zA-Z0-9-]+)"));
			if(tmp2 && tmp2.length==2){
				this.orgid = tmp2[1];
			}
			var tmp3 = j.match(new RegExp("deviceid/([a-zA-Z0-9-_.]+)"));
			if(tmp3 && tmp3.length==2){
				this.deviceId = tmp3[1];
			}
			var tmp4 = j.match(new RegExp("token/([a-zA-Z0-9-_.]+)"));
			if(tmp4 && tmp4.length==2){
				this.token = tmp4[1];
			}
			var tmp5 = j.match(new RegExp("userid/([a-zA-Z0-9-_.]+)"));
			if(tmp5 && tmp5.length==2){
				this.userid = tmp5[1];
			}
		}
		console.log(this.isY ? "this is yunxuetang app!" : "this is not yunxuetang app!");
	}
};

window.y_bridge_public.init();

window.y_bridge_util={
	// h5请求app播放文档
	play_doc : function(i){
		/*{param:{id:"1111111", fallurl:"http://www.baidu.com"}}*/
		if(!window.y_bridge_public.isY){
			//self.location.href = i.param.fallurl;
			return;
		}

		if(window.y_bridge_public.NaEptObj(i)
			&&window.y_bridge_public.NaEptObj(i.param)){
			if(i.param.hasOwnProperty("pid")){
				i.param.pid = i.param.pid || "";
			}
			if(i.param.hasOwnProperty("cid")){
				i.param.cid = i.param.cid || "";
			}
		}

		var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);

		this.getEasyJsUrl("ntv_util", "play_doc", _);
	},
	// h5请求app播放视频
	play_video : function(i){
		/*{param:{id:"1111111", fallurl:"http://www.baidu.com"}}*/
		if(!window.y_bridge_public.isY){
			//self.location.href = i.param.fallurl;
			return;
		}

		if(window.y_bridge_public.NaEptObj(i)
			&&window.y_bridge_public.NaEptObj(i.param)){
			if(i.param.hasOwnProperty("pid")){
				i.param.pid = i.param.pid || "";
			}
			if(i.param.hasOwnProperty("cid")){
				i.param.cid = i.param.cid || "";
			}
		}

		var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);

		this.getEasyJsUrl("ntv_util", "play_video", _);
	},
	// 网校h5请求app播放文档
	play_esdoc: function (id, url,type,backurl) {
		// 检查当前环境是否需要调用系统播放器。目前在微信内部与iphone的safari浏览器需要使用系统播放器，否则使用云播或壳的播放器
		// 此处判断代码需要修改
		if(!window.y_bridge_public.isY){
			self.location.href = url;
			return;
		}
		// 使用ajax获取知识播放相关信息
		var params = { key: id, type: type, backurl: escape(backurl) };
		var result = null;
		jQuery.ajax({
			type:"GET",
			url: "/m/ppvjs",
			async: false,
			contentType: "application/json",
			dataType: "json",
			data: params,
			success: function (data) {
				if (data.Code == "ok") {
					result = data.Data;
				}
			},
			error: function (msg) {
				console.log(msg);grg
			}
		});
		if (result == null) {
			return;
		}
		i = {param : {
			uid: result.uid, //唯一ID，可能是学生课时也可能是课件的ID
			title: result.title,
			url: result.url,
			type: result.type,
			sp: result.sp,
			ep: result.ep,
			callback: result.callback,
			backurl: result.backurl,
			istrack: result.istrack
		},
			CBPluginName:"",
			CBTagName:""
		};

		var t = i.param;

		var _ = window.y_bridge_public.buildParamString(t, i.CBPluginName, i.CBTagName);

		this.getEasyJsUrl("ntv_util", "play_doc", _);
	},
	// 网校h5请求APP播放视频
	play_esvideo: function (id, url, type, backurl) {
		// 检查当前环境是否需要调用系统播放器。目前在微信内部与iphone的safari浏览器需要使用系统播放器，否则使用云播或壳的播放器
		// 此处判断代码需要修改
		if(!window.y_bridge_public.isY){
			self.location.href = url;
			return;
		}
		// 使用ajax获取知识播放相关信息
		var params = { key: id, type: type, backurl: escape(backurl) };
		var result = null;
		jQuery.ajax({
			url: "/m/ppvjs",
			async: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: params,
			success: function (data) {
				if (data.Code == "ok") {
					result = data.Data;
				}
			}
		});
		if (result == null) {
			return;
		}
		i = {
			param : {
				uid: result.uid, //唯一ID，可能是学生课时也可能是课件的ID
				title: result.title,
				url: result.url,
				type: result.type,
				sp: result.sp,
				ep: result.ep,
				callback: result.callback,
				backurl: result.backurl,
				istrack: result.istrack
			},
			CBPluginName:"",
			CBTagName:""
		};

		var params2 = {
			url: "",
			uid: result.uid,
			ats: 120,
			ts:60
		};

		var t = i.param;
		var _ = window.y_bridge_public.buildParamString(t, i.CBPluginName, i.CBTagName);

		this.getEasyJsUrl("ntv_util", "play_video", _);
	},
	// h5请求打开下载页面
	req_down:function(i){
		if(!window.y_bridge_public.isY){
			return;
		}
		var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
		this.getEasyJsUrl("ntv_util", "req_down", _);
	},
	getEasyJsUrl:function(i,t,_){
		window.y_bridge_public.loadURL("yxtapp:"+i+":"+encodeURIComponent(t)+":"+encodeURIComponent(_));
	},
    getEasyJsUrlUnSafe:function(i,t,_){
        window.y_bridge_public.loadURL("unsafe:yxtapp:"+i+":"+encodeURIComponent(t)+":"+encodeURIComponent(_));
    },
	//用户登录成功后，h5提交身份信息给APP
	user_login:function(i){
		if(window.y_bridge_public.isY){
			var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			this.getEasyJsUrl("ntv_util", "user_login", _);
		}
	},
	//用户改变机构后，h5提交身份信息给APP
	user_changeorg:function(i){
		if(window.y_bridge_public.isY){
			var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			this.getEasyJsUrl("ntv_util", "user_changeorg", _);
		}
	},
	// 用户注册成功后，h5提交身份信息给APP
	user_reg:function(i){
		if(window.y_bridge_public.isY){
			var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			this.getEasyJsUrl("ntv_util", "user_reg", _);
		}
	},
	// 用户注销，h5通知APP退出登录状态
	user_logout:function(){
		if(window.y_bridge_public.isY) {
			var _ = window.y_bridge_public.buildParamString({}, "", "");
			this.getEasyJsUrl("ntv_util", "user_logout", _);
		}
	},
	// 用户h5请求app更新头像
	user_takephoto:function(i){
		if(window.y_bridge_public.isY){
			var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			this.getEasyJsUrl("ntv_util", "user_takephoto", _);
		}
	},
	// 支付宝，launch支持并回调成功
	pay_ali:function(i){
		if(window.y_bridge_public.isY) {
			var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			this.getEasyJsUrl("ntv_util", "pay_ali", _);
		}
	},
	// h5获取系统信息，版本信息、设备号
	sys_info:function(i){
		//获取设备信息
		if(window.y_bridge_public.isY && window.y_bridge_public.version>=10040) {
			var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			this.getEasyJsUrl("ntv_util", "sys_info", _);
		}
	},
	// h5调起二维码扫描，目前无返回回调
	sys_scan:function(i){
		//获取设备信息
		if(window.y_bridge_public.isY) {
			var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			this.getEasyJsUrl("ntv_util", "sys_scan", _);
		}
	},
	// 打开首页
	open_home:function(homeUrl){
		if(window.y_bridge_public.isY) {
			var _ = window.y_bridge_public.buildParamString({}, "", "");
			this.getEasyJsUrl("ntv_util", "open_home", _);
		}
		else if(homeUrl && homeUrl!=null){
			self.location.href = homeUrl;
		}
	},
	// 打开下载
	open_download:function(){
		if(window.y_bridge_public.isY) {
			var _ = window.y_bridge_public.buildParamString({}, "", "");
			this.getEasyJsUrl("ntv_util", "open_download", _);
		}
	},
	set_topic:function(i){
		if(window.y_bridge_public.isY&&window.y_bridge_public.NaEptObj(i)){
			var _ = JSON.stringify(i);
			return window.y_bridge_util.getEasyJsUrlUnSafe("ntv_util","topic", _);
		}
	}
};

window.y_bridge_bar=
{
    set_article:function(i){
        if(window.y_bridge_public.isY&&window.y_bridge_public.NaEptObj(i)){
            var _ = JSON.stringify(i);
            return window.y_bridge_util.getEasyJsUrlUnSafe("ntv_util","article", _);
        }
    },
    set_comment:function(i){
        if(window.y_bridge_public.isY&&window.y_bridge_public.NaEptObj(i)){
            var _ = JSON.stringify(i);
            return window.y_bridge_util.getEasyJsUrlUnSafe("ntv_util","comment", _);
        }
    },
	// h5请求设置app导航栏的通用设置
	set_navbar:function(i){
		/*
		 {
		 param:{isNavbarHidden = true, title = "", searchUrl = ""},
		 CBPluginName:"",
		 CBTagName:""
		 }
		 */
		if(window.y_bridge_public.isY&&window.y_bridge_public.NaEptObj(i)){
			window.y_bridge_public.isToolbarHidden = i.param.isToolbarHidden;
			var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			return window.y_bridge_util.getEasyJsUrl("ntv_bar","set_navbar",_);
		}
	},
	// h5请求设置app的工具栏通用设置
	set_toolbar:function(i){
		/*
		 {
		 param:{isToolbarHidden = true,unread=0},
		 CBPluginName:"",
		 CBTagName:""
		 }
		 */
		if(window.y_bridge_public.isY&&window.y_bridge_public.NaEptObj(i)){
			window.y_bridge_public.isNavbarHidden = i.param.isNavbarHidden;
			var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			window.y_bridge_util.getEasyJsUrl("ntv_bar", "set_toolbar",_);
		}
	},
	// h5请求选中指定的工具栏菜单
	set_toolbar_select:function(i){
		/*
		 {
		 param:{selectIndex = 0},
		 CBPluginName:"",
		 CBTagName:""
		 }
		 */
		if(window.y_bridge_public.isY&&window.y_bridge_public.NaEptObj(i)){
			window.y_bridge_public.isNavbarHidden = i.param.isNavbarHidden;
			var _ = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			window.y_bridge_util.getEasyJsUrl("ntv_bar", "set_toolbar_select",_);
		}
	},
	// h5请求设置头部显示分享
	set_navbar_share:function(i) {
		/*
		 {
		 param:{
		 "shareUrl":"http://www.yxt.com:8080/mobilezone/MNewsDetail?nid=fe5d8478-d671-47ad-9b32-0e86450cc8c4",
		 "shareImg":"http://cdn.news.yxt.com/img/20150907/1441591399746058803.png",
		 "title":"现在，找工作变得日渐艰难",
		 "desc":""}
		 CBPluginName:"",
		 CBTagName:""
		 }
		 */
		if (window.y_bridge_public.isY && window.y_bridge_public.NaEptObj(i)) {
			var t = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			window.y_bridge_util.getEasyJsUrl("ntv_bar", "set_navbar_share", t);
		}
	},
	// h5请求调起微信分享
	shareInfoFromH5:function(i){
		/*
		 {
		 param:{
		 "shareUrl":"http://www.yxt.com:8080/mobilezone/MNewsDetail?nid=fe5d8478-d671-47ad-9b32-0e86450cc8c4",
		 "shareImg":"http://cdn.news.yxt.com/img/20150907/1441591399746058803.png",
		 "title":"现在，找工作变得日渐艰难",
		 "desc":""}
		 CBPluginName:"",
		 CBTagName:""
		 }
		 */
		if(window.y_bridge_public.isY&&window.y_bridge_public.NaEptObj(i)){
			var t = window.y_bridge_public.buildParamString(i.param, i.CBPluginName, i.CBTagName);
			window.y_bridge_util.getEasyJsUrl("ntv_bar", "shareInfoFromH5",t);
		}
	}
};
