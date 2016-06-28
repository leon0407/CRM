angular.isNullOrEmpty = function (t) {
    if (t == null || t == '') {
        return true;
    } else {
        return false;
    }
};

//设置cookie
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}
//获取cookie
function getCookie(cname) {
    var result = null;
    var myCookie = "" + document.cookie + ";";
    var searchName = "" + cname + "=";
    var startOfCookie = myCookie.indexOf(searchName);
    var endOfCookie;
    if (startOfCookie != -1) {
        startOfCookie += searchName.length;
        endOfCookie = myCookie.indexOf(";", startOfCookie);
        result = (myCookie.substring(startOfCookie, endOfCookie));
    }
    return result;
}
//清除cookie
function clearCookie(name) {
    setCookie(name, "");
}

//取缓存value
function getLocalStorage(key) {
    var value;
    try {
        localStorage.setItem("TestKey", "123");
        value = localStorage.getItem(key);
    }
    catch (e) {
        value = getCookie(key);
    }

    return value;
}
//设置缓存值
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch (e) {
        setCookie(key, value);
    }
}


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

// get code
function getCode(){
    var str = window.location.search;
    return str.replace(/(\?code=)|(&state=STATE)/g,'');
}

// set token
function setToken() {
    var t = window.y_bridge_public.token;
    if (t && t != null) {
        setLocalStorage("token", t);
    }
}

// dialog
function dialog(txt){
    $('.dialog-tip').text(txt);
    $('.dialog').css('display','-webkit-box');
}
function isManager(){
    var role = getLocalStorage('role');
    var arr = ['19','39','49'];
    if(arr.indexOf(role)>=0){
        return true;
    }
    return false;
}
