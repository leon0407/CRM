/**
 * Created by leon on 16/4/25.
 */
angular.module("s.home", [])
    .service('HomeService', function (apiManager) {
        this.logIn = function (params, success) {
            apiManager.callLogInApi({
                method: 'post',
                url:    'users/qida/tokens',
                data:   params,
                success: function (data) {
                    if(angular.isFunction(success)){
                        success(data);
                    }
                }
            });
        };
        this.getUserInfo = function (success) {
            apiManager.callApi({
                method: 'get',
                url:    'users',
                success: function (data) {
                    if(angular.isFunction(success)){
                        success(data);
                    }
                }
            });
        }
    });
