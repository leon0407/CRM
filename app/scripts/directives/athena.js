/**
 * Created by Administrator on 2016/3/25.
 */
var athena_directive = angular.module("ui.athena",[])
    .directive("searchBar", function($timeout){
        return {
            replace : true,
            scope : {
                placeholder : "@placehold",
                keyword : "=",
                search : "=",
                hideSearch: "="
            },
            templateUrl : "searchbar.html",
            link : function(scope,ele,attrs){
                scope.input = function(){
                    scope.focus = true;
                    $timeout(function(){
                        ele[0].querySelector("input").focus();
                    });
                };
                scope.hideInput = function(){
                    scope.focus = false;
                    if(scope.hideSearch()){
                        scope.hideSearch();
                    }
                    //scope.keyword = '';
                    //scope.search();
                    //var $dm = $('.dark-mask');
                    //if($dm.length == 1){
                    //    $dm.hide();
                    //    $('.search-box').hide();
                    //}
                };
                scope.clear = function(){
                    scope.keyword = '';
                };
                ele.on("submit", function(e){
                    scope.search(e);
                });
            }
        }
    });

athena_directive.run(["$templateCache",function($templateCache){
    $templateCache.put("searchbar.html","<form>\
        <div class=\"searchbar-wrap\" ng-class=\"{true : \'focus\'}[focus]\">\
        <div class=\"searchbar\" ng-click=\"input()\">\
        <i class=\"fa fa-search\"></i>\
        <div class=\"searchbar-text\" ng-bind=\"placeholder\"></div>\
        <div class=\"searchbar-input\"><input ng-model=\"keyword\" type=\"text\" placeholder=\"{{placeholder}}\" autocapitalize=\"off\"></div>\
        <i class=\"fa fa-times-circle\" ng-click=\"clear()\"></i>\
        </div>\
        <span class=\"searchbar-cancel\" ng-click=\"hideInput()\">取消</span>\
        </div>\
        </form>")
}]);
