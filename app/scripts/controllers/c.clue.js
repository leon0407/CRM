/**
 * Created by leon on 16/4/25.
 */
angular.module("c.clue", [])
    .controller('ClueCtrl', function ($scope, $rootScope, $state, CommonService, ClueService) {
        $rootScope.pagetitle = '线索';
        $scope.isManager = isManager();
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
    })
    .controller('ClueFilterCtrl', function ($scope, $rootScope, $state, $stateParams, CommonService, ClueService) {
        init();

        var filterType = $stateParams.filterType; // filterType: -1 0 7 14 28
        $scope.filterType = filterType;
        // set title
        var title = {
            '-1': '我上报的线索',
            '0' : '我的线索',
            '1' : '团队线索',
            '7' : '7天未跟进的线索',
            '14': '14天未跟进的线索',
            '28': '即将超时的线索'
        };
        $rootScope.pagetitle = title[filterType];
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});

        $scope.showSearch = function () {
            $('.dark-mask').show();
            $('.search-box').show();
        };
        $scope.hideSearch = function () {
            $('.dark-mask').hide();
            $('.search-box').hide();
            $('.white-bg').hide();
            $scope.keyword = '';
            $scope.search();
        };
        var oldKey = '';
        $scope.search = function(){
            if($scope.keyword == '' || $scope.keyword == undefined){
                $('.white-bg').hide();
            }
            else{
                $('.white-bg').show();
            }
            var key = $scope.keyword;
            if(oldKey == key || key === undefined || key === ''){
                return;
            }
            else{
                oldKey = key;
            }
            $scope.nodataSearch = false;
            $scope.isloadedSearch = false;
            $scope.clueSearchList = [];
            params = {
                limit: 8,
                offset: 0,
                orderby: 'createTime',
                direction: 'DESC',
                key: key
            };
            setParmas(filterType);
            $scope.isbusySearch = false;
            $scope.nextPageSearch();
        };
        // sort clues
        $scope.desc = true;
        $scope.sortClue = function () {
            $scope.desc = !$scope.desc;
            params.direction = $scope.desc ? 'DESC' : 'ASC';
            resetData();
            params.key = '';
            $scope.nextPage();
        };

        var params = {
            limit: 8,
            offset: 0,
            orderby: 'createTime',
            direction: 'DESC'
        };
        var flag = 0;
        $scope.nextPage = function () {
            if ($scope.isbusy) return;
            $scope.isbusy = true;
            $scope.isloading = true;
            ClueService.getClueList(flag, params, function (data) {
                var len = data.datas.length;
                // nodata
                if (len == 0 && params.offset == 0) {
                    $scope.isloading = false;
                    $scope.nodata = true;
                    return;
                }
                angular.forEach(data.datas, function (value) {
                    $scope.clueList.push(value);
                });
                params.offset += params.limit;
                $scope.isloading = false;
                $scope.isbusy = false;
                // till end;
                if (len < 8) {
                    $scope.isloading = false;
                    $scope.isbusy = true;
                    if ($scope.clueList.length >= 8) {
                        $scope.isloaded = true;
                    }
                }
            });
        };

        $scope.nextPageSearch = function () {
            if ($scope.isbusySearch) return;
            $scope.isbusySearch = true;
            $scope.isloadingSearch = true;
            ClueService.getClueList(flag, params, function (data) {
                var len = data.datas.length;
                // nodata
                if (len == 0 && params.offset == 0) {
                    $scope.isloadingSearch = false;
                    $scope.nodataSearch = true;
                    return;
                }
                angular.forEach(data.datas, function (value) {
                    $scope.clueSearchList.push(value);
                });
                params.offset += params.limit;
                $scope.isloadingSearch = false;
                $scope.isbusySearch = false;
                // till end;
                if (len < 8) {
                    $scope.isloadingSearch = false;
                    $scope.isbusySearch = true;
                    if ($scope.clueSearchList.length >= 8) {
                        $scope.isloadedSearch = true;
                    }
                }
            });
        };
        // init
        filterClues(filterType);
        function filterClues(subTime) {
            setParmas(subTime);
            $scope.isbusy = false;
            $scope.nextPage();
        }
        function setParmas(subTime){
            // 我上报的
            if (subTime == -1) {
                flag = 1;
            }
            // 团队
            else if(subTime == 1){
                flag = 2;
            }
            // 7天、14天未跟
            else{
                flag = 0;
                if(!(subTime == 0 || subTime == 28)){
                    params.subTime = subTime;
                }
            }
            //  即将超期
            if(subTime == 28){
                params.isNear = 'isNear';
            }
        }
        function init(){
            $scope.clueList = [];
            $scope.isbusy = true;
            $scope.isloaded = false;
            $scope.isloading = false;
            $scope.nodata = false;

            $scope.clueSearchList = [];
            $scope.isbusySearch = true;
            $scope.isloadedSearch = false;
            $scope.isloadingSearch = false;
            $scope.nodataSearch = false;
        }
        function resetData(){
            params.offset = 0;
            $scope.clueList = [];
            $scope.isloaded = false;
            $scope.isloading = false;
            $scope.nodata = false;
            $scope.isbusy = false;
        }
    })
    .controller('ClueDetailCtrl', function ($scope, $location, $rootScope, $stateParams, $state, ClueService, CommonService) {
        $rootScope.pagetitle = '线索详情';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        // tab
        $scope.tab = function (index) {
            $scope.index = index;
        };
        var index = $location.search().index;
        if(index !==undefined){
            $scope.index = index;
        }else{
            $scope.index = 0;
        }
        $scope.isManager = isManager();
        $scope.showSearch = function () {
            $('.dark-mask').show();
            $('.search-box').show();
        };
        $scope.hideSearch = function () {
            $('.dark-mask').hide();
            $('.search-box').hide();
            $scope.keyword = '';
            $scope.search();
        };
        $scope.search = function () {

        };
        // clue detail
        var clueId = $stateParams.clueId;
        $scope.isMyCharge = false;
        ClueService.getClueDetail(clueId, function (data) {
            $scope.clue = data;
            var userId = getLocalStorage('userId');
            if(data.maps.length > 0 && data.maps[0].userId == userId){
                $scope.isMyCharge = true;
            }
            if(data.status >= 2){
                $scope.isMyCharge = false;
            }
        });
        // get clue log list
        function loadInit() {
            $scope.isbusy = false;
            $scope.isloaded = false;
            $scope.nodata = false;
            $scope.clueLogList = [];
            params = {
                limit: 6,
                offset: 0,
                orderby: 'createTime',
                direction: 'DESC'
            };
        }

        loadInit();
        $scope.nextPage = function () {
            if ($scope.isbusy) return;
            $scope.isbusy = true;
            $scope.isloading = true;
            ClueService.getClueLogList(clueId, params, function (data) {
                var len = data.datas.length;
                // nodata
                if (len == 0 && params.offset == 0) {
                    $scope.isloading = false;
                    $scope.nodata = true;
                    return;
                }
                angular.forEach(data.datas, function (value) {
                    if (value.type == 0) {
                        $scope.clueLogList.push(value);
                    }
                });
                params.offset += params.limit;
                $scope.isloading = false;
                $scope.isbusy = false;
                // till end;
                if (len < 6) {
                    $scope.isloading = false;
                    $scope.isbusy = true;
                    if ($scope.clueLogList.length >= 8) {
                        $scope.isloaded = true;
                    }
                }
            });
        };
    })
    .controller('ClueDealCtrl', function ($scope, $rootScope, $stateParams, $state, ClueService) {
        $rootScope.pagetitle = '跟进处理';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        $scope.isManager = isManager();
        $scope.showSearch = function () {
            $('.dark-mask').show();
            $('.search-box').show();
        };
        $scope.hideSearch = function () {
            $('.dark-mask').hide();
            $('.search-box').hide();
            $('.white-bg').hide();
            $scope.keyword = '';
            $scope.search();
        };
        var oldKey = '';
        var params = {};
        $scope.search = function(){
            if($scope.keyword == '' || $scope.keyword == undefined){
                $('.white-bg').hide();
            }
            else{
                $('.white-bg').show();
            }
            var key = $scope.keyword;
            if(oldKey == key || key === undefined || key === ''){
                return;
            }
            else{
                oldKey = key;
            }
            $scope.nodata = false;
            $scope.isloaded = false;
            $scope.userList = [];
            params = {
                limit: 15,
                offset: 0,
                key: key
            };
            $scope.isbusy = false;
            $scope.nextPage();
        };
        // clue detail
        var clueId = $stateParams.clueId;
        ClueService.getClueDetail(clueId, function (data) {
            $scope.clue = data;
        });
        // 退回线索
        $scope.returnCase = function (backReason) {
            var backReason = $.trim(backReason);
            if(backReason.length < 5){
                dialog('退回原因不得少于5个字符！');
                return false;
            }
            var body = {
                businessId: clueId,
                intro: backReason,
                status: -1
            };
            ClueService.addClueLog(body, function (data) {
                $state.go('clue');
            });
        };
        $scope.getUser = function (userId, userName) {
            $scope.transferUserId = userId;
            $scope.transferUserName = userName;
            $scope.hideSearch();
            $scope.showTransferHint = true;
        };
        // 转让线索
        $scope.transferCase = function () {
            ClueService.transferCase(clueId, $scope.transferUserId, function () {
                var clueLog = getLocalStorage('userName') + '分配给' + $scope.transferUserName;
                var body = {
                    businessId: clueId,
                    intro: clueLog,
                    status: 1
                };
                ClueService.addClueLog(body, function (data) {
                    $scope.showTransferHint = false;
                    $state.go('clue');
                });
            });
        };
        // tab
        $scope.index = 0;
        $scope.tab = function (index) {
            $scope.index = index;
        };
        // search user
        $scope.isbusy = true;
        $scope.isloaded = false;
        $scope.nodata = false;
        $scope.userList = [];
        $scope.nextPage = function () {
            if ($scope.isbusy) return;
            $scope.isbusy = true;
            $scope.isloading = true;
            ClueService.getUserList(params, function (data) {
                var len = data.datas.length;
                // nodata
                if(len == 0 && params.offset == 0){
                    $scope.isloading = false;
                    $scope.nodata = true;
                    return ;
                }
                angular.forEach(data.datas, function(value){
                    $scope.userList.push(value);
                });
                params.offset += params.limit;
                $scope.isloading = false;
                $scope.isbusy = false;
                // till end;
                if(len < 8){
                    $scope.isloading = false;
                    $scope.isbusy = true;
                    if($scope.userList.length >= 8){
                        $scope.isloaded = true;
                    }
                }
            });
        };
        // add clue log
        $scope.clueLog = '';
        $scope.checked = false;
        $scope.effectiveValue = 1;
        $scope.addClueLog = function (clueLog) {
            if ($.trim(clueLog) == '') {
                dialog('跟进纪录不能为空！');
                return false;
            }
            // isEffective: -1 0 1;
            // status: -1 1 2 3
            // 转为商机
            var status;
            var body = {
                businessId: clueId,
                intro: clueLog
            };
            if($scope.clue.isEffective == 0){
                body.isEffective = $scope.effectiveValue;
                body.status = $scope.effectiveValue;
            }
            if($scope.clue.isEffective == 1){
                body.isEffective = 1;
                body.status = 1;
            }
            if ($scope.checked) {
                body.status = 2;
                body.type = 1;
            }
            ClueService.addClueLog(body, function (data) {
                // 如果转为商机
                if($scope.checked){
                    $state.go('business.filter',{filterType: 0});
                }
                else{
                    $state.go('clue.detail', {clueId: clueId, index: 1});
                }
            });
        };
    })
    .controller('ClueAddCtrl', function ($scope, $stateParams, $state, $rootScope, ClueService, CommonService) {
        $rootScope.pagetitle = '新增线索';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        $scope.goToCheckClue = function () {
            $rootScope.orgName = undefined;
            $state.go('clue.check');
        };
        if($rootScope.genderIndex === undefined || $rootScope.genderIndex === ''){
            $rootScope.genderIndex = 1;
        }
        $scope.passValue = function (target) {
            switch (target) {
                case 'contactName' :
                    $rootScope.contactName = $scope.contactName;
                    break;
                case 'department'  :
                    $rootScope.department = $scope.department;
                    break;
                case 'email' :
                    $rootScope.email = $scope.email;
                    break;
                case 'job' :
                    $rootScope.job = $scope.job;
                    break;
                case 'mobile' :
                    $rootScope.mobile = $scope.mobile;
                    break;
                case 'remark' :
                    $rootScope.remark = $scope.remark;
                    break;
                case 'genderIndex' :
                    $rootScope.genderIndex = $scope.genderIndex;
                    break;
                case 'address' :
                    $rootScope.address = $scope.address;
                    break;
                case 'sourceDes' :
                    $rootScope.sourceDes = $scope.sourceDes;
                    break;

            }
        };

        // add clue
        $scope.addClue = function () {
            if(!validateInput()) return false;
            var body = {
                areaId: $rootScope.areaId,
                areaName: $rootScope.areaName,
                orgName: $rootScope.companyName,
                productIds: $rootScope.productIds,
                type: 0,
                cardUrl: '',
                department: $rootScope.department,
                email: $rootScope.email,
                position: $rootScope.job,
                industryId: $rootScope.industryId,
                industryName: $rootScope.industryName,
                subIndustryId: $rootScope.subIndustryId,
                subIndustryName: $rootScope.subIndustryName,
                mobile: $rootScope.mobile,
                name: $rootScope.contactName,
                ramark: $rootScope.remark,
                sex: $rootScope.genderIndex,
                address: $rootScope.address,
                intro: $rootScope.productRemark,
                sourceType: $rootScope.sourceType,
                sourceDes: $rootScope.sourceDes
            };
            ClueService.addClue(body, function (data) {
                CommonService.clearRootScope();
                $state.go('clue.ok');
            });
        };
        function validateInput() {
            if($rootScope.contactName === undefined || $rootScope.contactName === ''){
                dialog('请填写姓名！');
                return false;
            }
            if($rootScope.companyName === undefined || $rootScope.companyName === ''){
                dialog('请选择公司！');
                return false;
            }
            if($rootScope.department === undefined || $rootScope.department === ''){
                dialog('请填写部门！');
                return false;
            }
            if($rootScope.job === undefined || $rootScope.job === ''){
                dialog('请填写职务！');
                return false;
            }
            if($rootScope.productIds === undefined || $rootScope.productIds === ''){
                dialog('请选择产品！');
                return false;
            }
            if($rootScope.mobile === undefined || $rootScope.mobile === ''){
                dialog('请填写电话！');
                return false;
            }
            else{
                var mobile = $rootScope.mobile;
                var moblieReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if (!moblieReg.test(mobile)) {
                    dialog('请输入有效的手机号码！');
                    return false;
                }
            }
            if($rootScope.email != undefined && $rootScope.email != ''){
                var email = $rootScope.email;
                if($.trim(email).length !=0){
                    var emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                    if(!emailReg.test(email)){
                        dialog('请输入有效的邮箱地址！');
                        return false;
                    }
                }
            }
            if($rootScope.industryName === undefined || $rootScope.industryName === ''){
                dialog('请选择行业！');
                return false;
            }
            if($rootScope.areaName === undefined || $rootScope.areaName === ''){
                dialog('请选择地区！');
                return false;
            }
            if($rootScope.sourceName === undefined || $rootScope.sourceName === ''){
                dialog('请选择线索来源！');
                return false;
            }
            return true;
        }
        clueIsExsit();
        function clueIsExsit(){
            if($rootScope.companyName !='' && $rootScope.companyName !=undefined && $rootScope.productIds !=undefined && $rootScope.productIds.length>0){
                var params = {
                    orgName: $rootScope.companyName,
                    productIds: $rootScope.productIds
                };
                ClueService.clueIsExist(params, function (data) {
                }, function (data) {
                    $rootScope.companyName = '';
                    $rootScope.productIds = '';
                    $rootScope.productName = '';
                })
            }
        }
    })
    .controller('ClueSearchOrgNameCtrl', function ($scope, $rootScope, $state, ClueService) {
        $rootScope.pagetitle = '公司查询';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        // search the companyName
        $scope.isbusy = true;
        $scope.isloaded = false;
        $scope.nodata = false;
        $scope.itemList = [];
        var params = {};
        $scope.nextPage = function () {
            if ($scope.isbusy) return;
            $scope.isbusy = true;
            $scope.isloading = true;
            ClueService.searchOrgName(params, function (data) {
                var len = data.datas.length;
                // nodata
                if (len == 0 && params.offset == 0) {
                    $scope.isloading = false;
                    $scope.nodata = true;
                    return;
                }
                angular.forEach(data.datas, function (value) {
                    $scope.itemList.push(value);
                });
                params.offset += params.limit;
                $scope.isloading = false;
                $scope.isbusy = false;
                // till end;
                if (len < 8) {
                    $scope.isloading = false;
                    $scope.isbusy = true;
                    if ($scope.itemList.length >= 8) {
                        $scope.isloaded = true;
                    }
                }
            });
        };
        var oldKey = '';
        $scope.search = function () {
            var key = $.trim($scope.keyword);
            if (oldKey == key || key === undefined || key === '') {
                return;
            }
            else {
                oldKey = key;
            }
            if(key.length == 1 ){
                dialog('请输入至少两个字符');
                return;
            }
            $scope.nodata = false;
            $scope.isloaded = false;
            $scope.itemList = [];
            params = {
                limit: 10,
                offset: 0,
                keyword: key
            };
            $scope.isbusy = false;
            $scope.nextPage();
        };
        // select the company
        $scope.selectCompany = function (companyName) {
            $rootScope.companyName = companyName;
            $state.go('clue.add');
        };
    })
    .controller('ClueCheckCtrl', function ($scope, $rootScope, $state, ClueService) {
        $rootScope.pagetitle = '线索查重';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        $scope.isbusy = true;
        $scope.isloaded = false;
        $scope.nodata = false;
        $scope.checkList = [];

        $scope.hideSearch = function () {
            $scope.keyword = '';
            $scope.search();
        };

        // save the search result
        if ($rootScope.orgName) {
            $scope.keyword = $rootScope.orgName;
            $scope.isbusy = false;
            $scope.$emit('emitSearch');
        }
        var params = {
            limit: 8,
            offset: 0,
            key: $rootScope.orgName
        };
        $scope.nextPage = function () {
            if ($scope.isbusy) return;
            $scope.isbusy = true;
            $scope.isloading = true;
            ClueService.searchClueByOrgName(params, function (data) {
                var len = data.datas.length;
                // nodata
                if (len == 0 && params.offset == 0) {
                    $scope.isloading = false;
                    $scope.nodata = true;
                    return;
                }
                angular.forEach(data.datas, function (value) {
                    $scope.checkList.push(value);
                });
                params.offset += params.limit;
                $scope.isloading = false;
                $scope.isbusy = false;
                // till end;
                if (len < 8) {
                    $scope.isloading = false;
                    $scope.isbusy = true;
                    if ($scope.checkList.length >= 8) {
                        $scope.isloaded = true;
                    }
                }
            });
        };
        var oldOrgName = '';
        $scope.search = function () {
            var orgName = $scope.keyword;
            $rootScope.orgName = orgName;
            if (oldOrgName == orgName) {
                return;
            }
            else {
                oldOrgName = orgName;
            }
            $scope.nodata = false;
            $scope.isloaded = false;
            $scope.checkList = [];
            if (angular.isNullOrEmpty($.trim(orgName))) {
                return;
            }
            params = {
                limit: 8,
                offset: 0,
                key: orgName
            };
            $scope.isbusy = false;
            $scope.$emit('emitSearch');
        };
    })
    .controller('ClueCheckDetailCtrl', function ($scope, $rootScope, $stateParams, ClueService) {
        $rootScope.pagetitle = '线索详情';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        var clueId = $stateParams.checkId;
        ClueService.getClueDetail(clueId, function (data) {
            $scope.clue = data;
        });
    })
    .controller('ClueSourceCtrl', function ($scope, $rootScope, $state) {
        $rootScope.pagetitle = '线索来源';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        var array = ['销售获取','市场活动','合作渠道','推广渠道','公司官网','公司微信','在线客服','产品注册','独立合伙人','老板关系','老客户转介绍','其他'];
        $scope.sourceToAdd = function (sourceType) {
            $rootScope.sourceType = sourceType;
            $rootScope.sourceName = array[sourceType-1];
            $state.go('clue.add');
        }
    });
