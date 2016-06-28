/**
 * Created by leon on 16/4/25.
 */
angular.module("s.common", [])
    .service('CommonService', function ($rootScope, apiManager) {
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
        this.getIndustries = function(success){
            apiManager.callComApi({
                method: 'get',
                url: 'industries/0/subindustries',
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.getSubindustries = function(industryId, success){
            apiManager.callComApi({
                method: 'get',
                url: 'industries/'+ industryId +'/subindustries',
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.getAreas = function(success){
            apiManager.callComApi({
                method: 'get',
                url: 'areas/0/subareas',
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.getSubareas = function(areaId, success){
            apiManager.callComApi({
                method: 'get',
                url: 'areas/'+ areaId +'/subareas',
                success: function (data) {
                    if (angular.isFunction(success)) {
                        success(data);
                    }
                }
            });
        };
        this.clearRootScope = function () {
            $rootScope.areaId = '';
            $rootScope.areaName = '';
            $rootScope.companyName = '';
            $rootScope.productIds = '';
            $rootScope.productName = '';
            $rootScope.department = '';
            $rootScope.email = '';
            $rootScope.job = '';
            $rootScope.industryId = '';
            $rootScope.industryName = '';
            $rootScope.subIndustryId = '';
            $rootScope.subIndustryName = '';
            $rootScope.mobile = '';
            $rootScope.contactName = '';
            $rootScope.remark = '';
            $rootScope.genderIndex = '';
            $rootScope.address = '';
            $rootScope.productRemark = '';
            $rootScope.sourceType = '';
            $rootScope.sourceName = '';
            $rootScope.sourceDes = '';
        };
    });
