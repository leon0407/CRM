var type = 0;
var USERID, TOKEN, ORGID;
if(type == 0){
    USERID = 'ec287b00-f765-46e1-a310-375d0bdcebaf';
    // connection: dev
    var LOG_URL = 'http://devinner.yunxuetang.com.cn/usercenterapi/v1/';
    var COM_URL = 'http://devinner.yunxuetang.com.cn/componentapi/v1/';
    var BASE_URL = 'http://devinner.yunxuetang.com.cn/omsapi/v1/';
}
else{
    USERID = 'ec287b00-f765-46e1-a310-375d0bdcebaf';
    // connection: product
    var BASE_URL = 'http://api.oms.yxt.com/v1/';
    var COM_URL = 'http://api.component.yxt.com/v1/';
    var LOG_URL = 'http://api.usercenter.yxt.com/v1/';
}

setLocalStorage('userId', USERID);

var APP_VERSION = angular.element(document.getElementsByTagName('html')).attr('data-ver');

