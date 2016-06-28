/**
 * Created by leon on 16/4/25.
 */
angular.module("c.home", [])
    .controller('HomeCtrl', function ($scope, $rootScope, $state, HomeService) {
        $rootScope.pagetitle = 'CRM';
        window.y_bridge_bar.set_navbar({param: {title: $rootScope.pagetitle}});
        var userId = getLocalStorage('userId');
        var params = {
            userId: userId
        };
        setLocalStorage('userId', userId);
        HomeService.logIn(params, function (data) {
            var token = data.token;
            var orgId = data.orgId;
            setLocalStorage('crm_token', token);
            setLocalStorage('orgId', orgId);
            HomeService.getUserInfo(function (data) {
                // 19：团队主管 39：区域主管 49：超管
                var role = data.type;
                setLocalStorage('role', role);
                setLocalStorage('userName', data.fullName);
            });
        });
        $scope.clueCheck = function () {
            $rootScope.orgName = undefined;
            $state.go('clue.check');
        };
    });
