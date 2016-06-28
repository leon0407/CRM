/**
 * Created by leon on 16/4/25.
 */
angular.module("s.business", [])
    .service('BusinessService', function (apiManager) {
        this.getBusinessList = function(flag, params, success){
            var href = '';
            if(flag == 0){
                href = 'business/businesses';
            }
            else{
                href = 'business/team/businesses';
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
        this.getBusinessDetail = function(businessId, success){
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
        this.addContact = function(businessId, params, success){
            apiManager.callApi({
                method: 'post',
                url: 'business/'+ businessId + '/addContact/',
                data: params,
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.postStatus = function(businessId, status, success){
            apiManager.callApi({
                method: 'put',
                url: 'business/'+ businessId,
                data: {
                    status: status
                },
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.getMemberList = function(params, success){
            apiManager.callApi({
                method: 'get',
                url: 'users/notInBusinessMap',
                data: params,
                success: function(data){
                    if(angular.isFunction(success)){
                        success(data);
                    }
                }
            });
        };
        this.addMember = function(businessId, toUserId, type, success){
            apiManager.callApi({
                method: 'put',
                url: 'business/' + businessId + '/assigned/' + toUserId,
                data: {
                    type: type
                },
                success: function(data){
                    if(angular.isFunction(success)){
                        success(data);
                    }
                }
            });
        };
    });
