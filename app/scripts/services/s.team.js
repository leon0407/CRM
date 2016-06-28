/**
 * Created by leon on 16/4/25.
 */
angular.module("s.team", [])
    .service('TeamService', function (apiManager) {
        this.getTeamList = function(success){
            apiManager.callApi({
                method: 'get',
                url: 'team',
                success: function(data){
                    if(angular.isFunction(success)){
                        success(data);
                    }
                }
            });
        };
        this.getMemberList = function(params, success){
            apiManager.callApi({
                method: 'get',
                url: 'users/notInTeam',
                data: params,
                success: function(data){
                    if(angular.isFunction(success)){
                        success(data);
                    }
                }
            });
        };
        this.getTeamDetail = function(teamId, domainId, success){
            apiManager.callApi({
                method: 'get',
                url: 'team/' + teamId,
                data: {
                    domainId: domainId
                },
                success: function(data){
                    if(angular.isFunction(success)){
                        success(data);
                    }
                }
            });
        };
        this.addMember = function(params, success){
            apiManager.callApi({
                method: 'post',
                url: 'team/addUser',
                data: params,
                success: function(data){
                    if(angular.isFunction(success)){
                        success(data);
                    }
                }
            });
        };
        this.delMember = function(params, success){
            apiManager.callApi({
                method: 'post',
                url: 'users/deleteUserFromTeam/?userId=' + params.userId + '&teamId=' + params.teamId,
                success: function(data){
                    if(angular.isFunction(success)){
                        success(data);
                    }
                }
            });
        };

    });
