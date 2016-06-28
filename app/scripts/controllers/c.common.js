angular.module("c.common", [])
    .controller('ProductCtrl', function ($scope, $rootScope, $state, CommonService) {
        $rootScope.pagetitle = '产品列表';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        CommonService.getProductList(function(data){
            $scope.productList = data.datas;
            // check product
            $scope.toggle = function(index){
                $('.product-list li:eq(' + index + ')').toggleClass('active');
            };
            // enter
            var productIds = [];
            $scope.productToAdd = function(){
                var txt = '';
                $.each($('.product-list li.active'), function(index){
                    if(index == 0){
                        txt = txt + $(this).find('span').text();
                    }else{
                        txt = txt + ' | ' + $(this).find('span').text();
                    }
                    productIds.push($(this).data().productid);
                });
                $rootScope.productIds = productIds;
                $rootScope.productName = txt;
                $rootScope.productRemark = $scope.productRemark;
                $state.go('clue.add');
            };
        });
    })
    .controller('AreaCtrl', function ($scope, $rootScope, $state, CommonService) {
        $rootScope.pagetitle = '地区列表';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        CommonService.getAreas(function(data){
            $scope.areaList = data.datas;
        });
        $scope.goToSubarea = function(areaId, areaName){
            $rootScope.areaName = areaName;
            $state.go('area.subarea',{areaId: areaId});
        };
    })
    .controller('SubAreaCtrl', function ($scope, $rootScope, $stateParams, $state, CommonService) {
        $rootScope.pagetitle = '地区列表';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        var areaId = $stateParams.areaId;
        CommonService.getSubareas(areaId, function(data){
            $scope.subareaList = data.datas;
        });
        $scope.areaToAdd = function(areaId, areaName){
            $rootScope.areaName += ' ' + areaName;
            $rootScope.areaId = areaId;
            $state.go('clue.add');
        };
    })
    .controller('IndustryCtrl', function ($scope, $rootScope, $state, CommonService) {
        $rootScope.pagetitle = '行业列表';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        CommonService.getIndustries(function(data){
            $scope.industryList = data.datas;
        });
        $scope.goToSubindustry = function(industryId, industryName){
            $rootScope.industryId = industryId;
            $rootScope.industryName = industryName;
            $state.go('industry.subindustry',{industryId: industryId});
        };
    })
    .controller('SubIndustryCtrl', function ($scope, $rootScope, $stateParams, $state, CommonService) {
        $rootScope.pagetitle = '行业列表';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        var industryId = $stateParams.industryId;
        CommonService.getSubindustries(industryId, function(data){
            $scope.subindustryList = data.datas;
        });
        $scope.industryToAdd = function(industryId, industryName){
            $rootScope.subIndustryId = industryId;
            $rootScope.subIndustryName = industryName;
            $state.go('clue.add');
        };
    });

