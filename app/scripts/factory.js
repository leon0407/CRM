angular.module("factoryApp", [])
    .factory('apiManager', function ($http, $location) {
        var factory = {};
        var source = '706';
        factory.callApi = function (option) {
            var headers = {
                'Source': source,
                'Token': getLocalStorage('crm_token'),
                'OrgId': getLocalStorage('orgId')
            };
            xhr(BASE_URL, option, headers);
        };
        factory.callComApi = function (option){
            var headers = {
                'Source': source,
                'Token': getLocalStorage('crm_token')
            };
            xhr(COM_URL, option, headers);
        };
        factory.callLogInApi = function (option) {
            var headers = {
                'Source': source
            };
            xhr(LOG_URL, option, headers);
        };
        function xhr(domin, option, headers){
            var opt = {
                method: option.method,
                url: domin + option.url,
                ignoreLoadingBar: false || option.ignoreLoadingBar,
                headers: headers
            };
            if (option.method.toLowerCase() == 'get') {
                opt.params = option.data;
            }
            else {
                opt.data = option.data;
            }
            $http(opt).success(function (data) {
                data.IsSuccessStatusCode = true;
                if (angular.isFunction(option.success)) {
                    option.success(data);
                }
            }).error(function (data, status) {
                data.IsSuccessStatusCode = false;
                dialog(data.error.message);
                if (angular.isFunction(option.error)) {
                    option.error(data);
                }
            });
        }
        return factory;

    });
