/**
 * Created by leon on 16/4/25.
 */
angular.module("s.clue", [])
    .service('ClueService', function (apiManager) {
        this.getUserList = function(params, success){
            apiManager.callApi({
                method: 'get',
                url: 'users/all',
                data: params,
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.getProductList = function(success){
            apiManager.callApi({
                method: 'get',
                url: 'product',
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.searchClueByOrgName = function(params, success){
            apiManager.callApi({
                method: 'get',
                url: 'business/searchByOrgName',
                data: params,
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.clueIsExist = function(params, success, error){
            apiManager.callApi({
                method: 'post',
                url: 'business/isExsit',
                data: params,
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                },
                error: function (data) {
                    if (angular.isFunction(success)) {
                        error(data);
                    }
                }
            });
        };
        this.addClue = function(body, success){
            apiManager.callApi({
                method: 'post',
                url: 'business',
                data: body,
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.getClueList = function(flag, params, success){
            var href = '';
            if(flag == 0){
                href = 'business/clues';
            }
            else if(flag == 1){
                href = 'business/myClues';
            }
            else{
                href = 'business/team/clues';
            }
            apiManager.callApi({
                method: 'get',
                url: href,
                data: params,
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.transferCase = function (businessId, toUserId, success) {
            apiManager.callApi({
                method: 'put',
                url: 'business/' + businessId + '/assigned/' + toUserId,
                data: {
                  type: 0
                },
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.getClueDetail = function(businessId, success){
            apiManager.callApi({
                method: 'get',
                url: 'business/' + businessId,
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.searchOrgName = function(params, success){
            apiManager.callComApi({
                method: 'post',
                url: 'eci/companies/search',
                data: params,
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.getClueLogList = function(businessId, params, success){
            apiManager.callApi({
                method: 'get',
                url: 'businesslog/' + businessId + '/log',
                data: params,
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.addClueLog = function(body, success){
            apiManager.callApi({
                method: 'post',
                url: 'businesslog',
                data: body,
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
    });
