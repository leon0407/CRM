/**
 * Created by leon on 16/4/25.
 */
angular.module("c.team", [])
    .controller('TeamCtrl', function ($scope, $rootScope, $stateParams, TeamService) {
        $rootScope.pagetitle = '我的团队';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        $scope.isloading = true;
        $scope.nodata = false;
        TeamService.getTeamList(function(data){
            if(data.datas.length==0){
                $scope.nodata = true;
            }
            var teamList = [];
            angular.forEach(data.datas, function (team) {
                angular.forEach(team.users, function(user){
                   if(user.type==1){
                       team.leader = user.userName;
                   }
                });
                teamList.push(team);
            });
            $scope.isloading = false;
            $scope.teamList = teamList;
        });
    })
    .controller('TeamDetailCtrl', function ($scope, $rootScope, $stateParams, TeamService) {
        $rootScope.pagetitle = '团队详情';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        var teamId = $stateParams.teamId;
        var areaId = $stateParams.areaId;
        // authorization
        $scope.isManager = false;
        TeamService.getTeamDetail(teamId, areaId, function(data){
            var team = data;
            angular.forEach(data.users, function (user) {
                if(user.type==1){
                    team.leader = user.userName;
                    if(user.userId == getLocalStorage('userId')){
                        $scope.isManager = true;
                    }
                }
            });
            $scope.team = team;
        });

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
            TeamService.getMemberList(params, function (data) {
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
            $scope.nodata = false;
            $scope.isloaded = false;
            $scope.memberList = [];
            params = {
                teamId: teamId,
                limit: 10,
                offset: 0,
                key: key
            };
            $scope.isbusy = false;
            $scope.nextPage();
        };
        // add the member
        $scope.addMember = function (userId, headPictureUrl, userName, mobile, email) {
            var params = {
                teamId: teamId,
                userId: userId,
                type:   0
            };
            TeamService.addMember(params, function (data) {
                $scope.team.users.push({
                        headPictureUrl: headPictureUrl,
                        userName: userName,
                        mobile: mobile,
                        email: email
                });
                $scope.hideSearch();
            });
        };
        // del the member
        $scope.showDel = false;
        $scope.delMember = function (userId,index) {
            var params = {
                teamId: teamId,
                userId: userId
            };
            TeamService.delMember(params, function (data) {
                $scope.team.users.splice(index, 1);
            });
        }
    });
