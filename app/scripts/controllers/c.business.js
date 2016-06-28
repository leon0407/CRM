/**
 * Created by leon on 16/4/25.
 */
angular.module("c.business", [])
    .controller('BusinessCtrl', function ($scope, $rootScope, BusinessService) {
        $rootScope.pagetitle = '商机';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        $scope.isManager = isManager();
    })
    .controller('BusinessFilterCtrl', function ($scope, $rootScope, $stateParams, BusinessService) {
        init();
        var filterType = $stateParams.filterType; // filterType: -1 0 7 14 28
        $scope.filterType = filterType;
        // set title
        var title = {
            '0' : '我的商机',
            '1' : '团队商机',
            '2' : '我协助的商机',
            '7' : '7天未跟进的商机',
            '14': '14天未跟进的商机',
            '28': '即将超时的商机'
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
            $scope.businessSearchList = [];
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

        // sort business
        $scope.desc = true;
        $scope.sortBusiness = function () {
            $scope.desc = !$scope.desc;
            params.direction = $scope.desc ? 'DESC' : 'ASC';
            resetData();
            params.key = '';
            $scope.nextPage();
        };
        // get business
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
            BusinessService.getBusinessList(flag, params, function (data) {
                var len = data.datas.length;
                // nodata
                if (len == 0 && params.offset == 0) {
                    $scope.isloading = false;
                    $scope.nodata = true;
                    return;
                }
                angular.forEach(data.datas, function (value) {
                    $scope.businessList.push(value);
                });
                params.offset += params.limit;
                $scope.isloading = false;
                $scope.isbusy = false;
                // till end;
                if (len < 8) {
                    $scope.isloading = false;
                    $scope.isbusy = true;
                    if ($scope.businessList.length >= 8) {
                        $scope.isloaded = true;
                    }
                }
            });
        };

        $scope.nextPageSearch = function () {
            if ($scope.isbusySearch) return;
            $scope.isbusySearch = true;
            $scope.isloadingSearch = true;
            BusinessService.getBusinessList(flag, params, function (data) {
                var len = data.datas.length;
                // nodata
                if (len == 0 && params.offset == 0) {
                    $scope.isloadingSearch = false;
                    $scope.nodataSearch = true;
                    return;
                }
                angular.forEach(data.datas, function (value) {
                    $scope.businessSearchList.push(value);
                });
                params.offset += params.limit;
                $scope.isloadingSearch = false;
                $scope.isbusySearch = false;
                // till end;
                if (len < 8) {
                    $scope.isloadingSearch = false;
                    $scope.isbusySearch = true;
                    if ($scope.businessSearchList.length >= 8) {
                        $scope.isloadedSearch = true;
                    }
                }
            });
        };

        // init
        filterBusinesses(filterType);
        function filterBusinesses(subTime) {
            setParmas(subTime);
            $scope.isbusy = false;
            $scope.nextPage();
        }
        function setParmas(subTime){
            // 团队
            if(subTime == 1){
                flag = 1;
            }
            // 我负责的
            else{
                params.dealType = 0;
            }
            // 我协助的
            if (subTime == 2) {
                params.dealType = 1;
            }
            // 7天、14天未跟
            if(subTime == 7 || subTime == 14){
                params.subTime = subTime;
            }
            //  即将超期
            if(subTime == 28){
                params.isNear = 'isNear';
            }
        }
        function init(){
            $scope.businessList = [];
            $scope.isbusy = true;
            $scope.isloaded = false;
            $scope.isloading = false;
            $scope.nodata = false;

            $scope.businessSearchList = [];
            $scope.isbusySearch = true;
            $scope.isloadedSearch = false;
            $scope.isloadingSearch = false;
            $scope.nodataSearch = false;
        }
        function resetData(){
            params.offset = 0;
            $scope.businessList = [];
            $scope.isloaded = false;
            $scope.isloading = false;
            $scope.nodata = false;
            $scope.isbusy = false;
        }
    })
    .controller('BusinessDetailCtrl', function ($scope, $location, $rootScope, $state, $stateParams, BusinessService, ClueService) {
        $rootScope.pagetitle = '商机详情';
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
        var businessId = $stateParams.businessId;
        var hasJuster = false;
        BusinessService.getBusinessDetail(businessId, function (data) {
            $scope.business = data;
            angular.forEach(data.contacts, function (contact) {
                if(contact.type == 5){
                    hasJuster = true;
                }
            });
        });
        $scope.editStatus = function () {
            if(!hasJuster){
                dialog('您还没有找到决策者，不能更改商机状态！');
                return false;
            }
            $state.go('business.status',{businessId: businessId});
        };
        // get clue log list
        var clueId = $stateParams.businessId;
        var clueLogList = [];
        var params = {};
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
            angular.forEach(data.datas, function (clueLog) {
                $scope.clueLogList.push(clueLog);
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
    .controller('BusinessDealCtrl', function ($scope, $rootScope, $state, $stateParams, BusinessService, ClueService, CommonService) {
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
        $scope.getUser = function (userId, userName) {
            $scope.transferUserId = userId;
            $scope.transferUserName = userName;
            $scope.hideSearch();
            $scope.showTransferHint = true;
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
        // tab
        $scope.index = 0;
        $scope.tab = function (index) {
            $scope.index = index;
        };
        $scope.toggleObject = function (index) {
            $('.object-list button:eq('+ index +')').toggleClass('btn-bg-blue');
        };
        var businessId = $stateParams.businessId;
        BusinessService.getBusinessDetail(businessId, function (data) {
            $scope.business = data;
        });
        // 退回商机
        $scope.returnCase = function (backReason) {
            if(backReason.length < 5){
                dialog('退回原因不得少于5个字符！');
                return false;
            }
            var body = {
                businessId: businessId,
                intro: backReason,
                status: -2
            };
            ClueService.addClueLog(body, function (data) {
                $state.go('business');
            });
        };
        // 转让商机
        $scope.transferCase = function () {
            ClueService.transferCase(businessId, $scope.transferUserId, function () {
                var clueLog = getLocalStorage('userName') + '分配给' + $scope.transferUserName;
                var body = {
                    businessId: businessId,
                    intro: clueLog,
                    status: 1
                };
                ClueService.addClueLog(body, function (data) {
                    $scope.showTransferHint = false;
                    $state.go('business');
                });
            });
        };
        // add clue log
        $scope.addClueLog = function (clueLog) {
            if ($.trim(clueLog) == '') {
                dialog('跟进纪录不能为空！');
                return false;
            }
            var contactId = '';
            $('.object-list .btn-bg-blue').each(function (index) {
                if(index == 0){
                    contactId = contactId + $(this).data()['contactid'];
                }
                else{
                    contactId = contactId + ';' + $(this).data()['contactid'];
                }
            });
            var body = {
                businessId: businessId,
                contactId: contactId,
                intro: clueLog,
                status: $scope.business.status,
                type: 1
            };
            ClueService.addClueLog(body, function (data) {
                $state.go('business.detail',{businessId: businessId, index: 1});
            });
        };
    })
    .controller('BusinessContactCtrl', function ($scope, $rootScope, $state, $stateParams, BusinessService) {
        $rootScope.pagetitle = '新增联系人';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        var businessId = $stateParams.businessId;
        $scope.businessId = businessId;
        // tab
        $scope.index = 0;
        $scope.tab = function (index) {
            $scope.index = index;
        };
        $scope.showAddList = true;
        $scope.showInput = function (tagName) {
            $scope.tagName = tagName;
            $scope.showAddList = false;
        };
        $scope.selectRole = function (roleIndex) {
            $scope.roleIndex = roleIndex;
            var obj = {
                0: '发起人',
                1: '使用者',
                2: '影响者',
                3: '守门人',
                4: '购买者',
                5: '决策者'
            };
            $scope.role = obj[roleIndex];
            $scope.showAddList = true;
        };
        function validateInput() {
            if($scope.contactName === undefined || $scope.contactName === ''){
                dialog('请填写姓名！');
                return false;
            }
            if($scope.department === undefined || $scope.department === ''){
                dialog('请填写部门！');
                return false;
            }
            if($scope.job === undefined || $scope.job === ''){
                dialog('请填写职务！');
                return false;
            }
            if($scope.mobile === undefined || $scope.mobile === ''){
                dialog('请填写电话！');
                return false;
            }
            else{
                var mobile = $scope.mobile;
                var moblieReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if (!moblieReg.test(mobile)) {
                    dialog('请输入有效的手机号码！');
                    return false;
                }
            }
            if($scope.email != undefined && $scope.email != ''){
                var email = $scope.email;
                if($.trim(email).length !=0){
                    var emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                    if(!emailReg.test(email)){
                        dialog('请输入有效的邮箱地址！');
                        return false;
                    }
                }
            }
            if($scope.roleIndex === undefined || $scope.roleIndex === ''){
                dialog('请选择角色！');
                return false;
            }
            return true;
        }
        $scope.addContact = function () {
            if(!validateInput()) return;
            var params = {
                type: $scope.roleIndex,
                cardUrl: '',
                department: $scope.department,
                email: $scope.email,
                position: $scope.job,
                mobile: $scope.mobile,
                name: $scope.contactName,
                ramark: $scope.remark,
                sex: $scope.genderIndex
            };
            BusinessService.addContact(businessId, params, function (data) {
                $state.go('business.detail', {businessId: businessId})
            });
        }
    })
    .controller('BusinessStatusCtrl', function ($scope, $rootScope, $state, $stateParams, BusinessService) {
        $rootScope.pagetitle = '商机状态';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        var businessId = $stateParams.businessId;
        BusinessService.getBusinessDetail(businessId, function (data) {
            $scope.status = data.status;
        });
        $scope.tag = function (index) {
            if (index == $scope.status) return;
            $scope.statusIndex = index;
            if(index == -3){
              $('.lose-reason').slideDown();
            }
        };
        $scope.postStatus = function () {
            var status = $scope.statusIndex;
            if(status==-3){
                if($scope.loseReason===undefined || $.trim($scope.loseReason)===''){
                    dialog('请填写输单理由！');
                    return false;
                }
            }
            BusinessService.postStatus(businessId, status, function (data) {
                $state.go('business.detail', {businessId: businessId});
            });
        }
    })
    .controller('BusinessTeamCtrl', function ($scope, $rootScope, $state, $stateParams, BusinessService) {
        $rootScope.pagetitle = '团队详情';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});

        $scope.isManager = false;
        var businessId = $stateParams.businessId;
        BusinessService.getBusinessDetail(businessId, function (data) {
            $scope.maps = data.maps;
            angular.forEach(data.maps, function (map) {
                if(map.type == 0 && map.userId == getLocalStorage('userId')){
                    $scope.isManager = true;
                }
            })
        });
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
        // search the member
        $scope.isbusy = true;
        $scope.isloaded = false;
        $scope.nodata = false;
        $scope.memberList = [];
        var params = {};
        $scope.nextPage = function () {
            if ($scope.isbusy) return;
            $scope.isbusy = true;
            $scope.isloading = true;
            BusinessService.getMemberList(params, function (data) {
                var len = data.datas.length;
                // nodata
                if(len == 0 && params.offset == 0){
                    $scope.isloading = false;
                    $scope.nodata = true;
                    return ;
                }
                angular.forEach(data.datas, function(value){
                    $scope.memberList.push(value);
                });
                params.offset += params.limit;
                $scope.isloading = false;
                $scope.isbusy = false;
                // till end;
                if(len < 8){
                    $scope.isloading = false;
                    $scope.isbusy = true;
                    if($scope.memberList.length >= 8){
                        $scope.isloaded = true;
                    }
                }
            });
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
            $scope.nodata = false;
            $scope.isloaded = false;
            $scope.memberList = [];
            params = {
                businessId: businessId,
                limit: 10,
                offset: 0,
                key: key
            };
            $scope.isbusy = false;
            nextPage();
        };
        // add the member
        $scope.addMember = function (toUserId, headPictureUrl, nickName, mobile, email) {
            BusinessService.addMember(businessId, toUserId, 1, function (data) {
                $scope.maps.push({
                    headPictureUrl: headPictureUrl,
                    userName: nickName,
                    mobile: mobile,
                    email: email
                });
                $scope.hideSearch();
            });
        }
    });

