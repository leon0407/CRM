angular.module("routeApp", ['ui.router'])
    .run(function ($rootScope, $state, $stateParams, $location) {
        //路由发生改变成功之后，触发
        $rootScope.$on("$stateChangeSuccess", function () {

        });
        //路由发生改变时，触发
        $rootScope.$on("$stateChangeStart", function (event, toState) {

        });
    })
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.when("/","index")
                .otherwise("index");
            $stateProvider.state("home", {
                url: "/home",
                views: {
                    "main": {
                        templateUrl: "./views/home/index.html?v=" + APP_VERSION,
                        controller: "HomeCtrl"
                    }
                }
            })
            .state("clue", {
                url: "/clue",
                views: {
                    "main": {
                        templateUrl: "./views/clue/home.html?v=" + APP_VERSION,
                        controller: "ClueCtrl"
                    }
                }
            })
            .state("clue.filter", {
                url: "/filter/:filterType",
                views: {
                    "main@": {
                        templateUrl: "./views/clue/index.html?v=" + APP_VERSION,
                        controller: "ClueFilterCtrl"
                    }
                }
            })
            .state("clue.source", {
                url: "/source",
                views: {
                    "main@": {
                        templateUrl: "./views/clue/source.html?v=" + APP_VERSION,
                        controller: "ClueSourceCtrl"
                    }
                }
            })
            .state("clue.detail", {
                url: "/:clueId/detail?index",
                views: {
                    "main@": {
                        templateUrl: "./views/clue/detail.html?v=" + APP_VERSION,
                        controller: "ClueDetailCtrl"
                    }
                }
            })
            .state("clue.deal", {
                url: "/:clueId/deal",
                views: {
                    "main@": {
                        templateUrl: "./views/clue/deal.html?v=" + APP_VERSION,
                        controller: "ClueDealCtrl"
                    }
                }
            })
            .state("clue.add", {
                url: "/add",
                views: {
                    "main@": {
                        templateUrl: "./views/clue/add.html?v=" + APP_VERSION,
                        controller: "ClueAddCtrl"
                    }
                }
            })
            .state("clue.ok", {
                url: "/ok",
                views: {
                    "main@": {
                        templateUrl: "./views/clue/ok.html?v=" + APP_VERSION
                    }
                }
            })
            .state("clue.searchOrgName", {
                url: "/searchOrgName",
                views: {
                    "main@": {
                        templateUrl: "./views/clue/searchOrgName.html?v=" + APP_VERSION,
                        controller: "ClueSearchOrgNameCtrl"
                    }
                }
            })
            .state("product", {
                url: "/product",
                views: {
                    "main@": {
                        templateUrl: "./views/common/product.html?v=" + APP_VERSION,
                        controller: "ProductCtrl"
                    }
                }
            })
            .state("area", {
                url: "/area",
                views: {
                    "main@": {
                        templateUrl: "./views/common/area.html?v=" + APP_VERSION,
                        controller: "AreaCtrl"
                    }
                }
            })
            .state("area.subarea", {
                url: "/:areaId/subarea",
                views: {
                    "main@": {
                        templateUrl: "./views/common/subArea.html?v=" + APP_VERSION,
                        controller: "SubAreaCtrl"
                    }
                }
            })
            .state("industry", {
                url: "/industry",
                views: {
                    "main@": {
                        templateUrl: "./views/common/industry.html?v=" + APP_VERSION,
                        controller: "IndustryCtrl"
                    }
                }
            })
            .state("industry.subindustry", {
                url: "/:industryId/subIndustry",
                views: {
                    "main@": {
                        templateUrl: "./views/common/subIndustry.html?v=" + APP_VERSION,
                        controller: "SubIndustryCtrl"
                    }
                }
            })
            .state("clue.check", {
                url: "/check",
                views: {
                    "main@": {
                        templateUrl: "./views/clue/check.html?v=" + APP_VERSION,
                        controller: "ClueCheckCtrl"
                    }
                }
            })
            .state("clue.check.detail", {
                url: "/:checkId/detail",
                views: {
                    "main@": {
                        templateUrl: "./views/clue/checkDetail.html?v=" + APP_VERSION,
                        controller: "ClueCheckDetailCtrl"
                    }
                }
            })
            .state("business", {
                url: "/business",
                views: {
                    "main": {
                        templateUrl: "./views/business/home.html?v=" + APP_VERSION,
                        controller: "BusinessCtrl"
                    }
                }
            })
            .state("business.filter", {
                url: "/filter/:filterType",
                views: {
                    "main@": {
                        templateUrl: "./views/business/index.html?v=" + APP_VERSION,
                        controller: "BusinessFilterCtrl"
                    }
                }
            })
            .state("business.detail", {
                url: "/:businessId/detail?index",
                views: {
                    "main@": {
                        templateUrl: "./views/business/detail.html?v=" + APP_VERSION,
                        controller: "BusinessDetailCtrl"
                    }
                }
            })
            .state("business.deal", {
                url: "/:businessId/deal",
                views: {
                    "main@": {
                        templateUrl: "./views/business/deal.html?v=" + APP_VERSION,
                        controller: "BusinessDealCtrl"
                    }
                }
            })
            .state("business.contact", {
                url: "/:businessId/contact",
                views: {
                    "main@": {
                        templateUrl: "./views/business/contact.html?v=" + APP_VERSION,
                        controller: "BusinessContactCtrl"
                    }
                }
            })
            .state("business.status", {
                url: "/:businessId/status",
                views: {
                    "main@": {
                        templateUrl: "./views/business/status.html?v=" + APP_VERSION,
                        controller: "BusinessStatusCtrl"
                    }
                }
            })
            .state("business.team", {
                url: "/:businessId/team",
                views: {
                    "main@": {
                        templateUrl: "./views/business/team.html?v=" + APP_VERSION,
                        controller: "BusinessTeamCtrl"
                    }
                }
            })
            .state("contract", {
                url: "/contract",
                views: {
                    "main": {
                        templateUrl: "./views/contract/index.html?v=" + APP_VERSION,
                        controller: "ContractCtrl"
                    }
                }
            })
            .state("market", {
                url: "/market",
                views: {
                    "main": {
                        templateUrl: "./views/market/index.html?v=" + APP_VERSION,
                        controller: "MarketCtrl"
                    }
                }
            })
            .state("team", {
                url: "/team",
                views: {
                    "main": {
                        templateUrl: "./views/team/index.html?v=" + APP_VERSION,
                        controller: "TeamCtrl"
                    }
                }
            })
            .state("team.detail", {
                url: "/:areaId/:teamId/detail",
                views: {
                    "main@": {
                        templateUrl: "./views/team/detail.html?v=" + APP_VERSION,
                        controller: "TeamDetailCtrl"
                    }
                }
            })
            .state("data", {
                url: "/data",
                views: {
                    "main": {
                        templateUrl: "./views/data/index.html?v=" + APP_VERSION,
                        controller: "DataCtrl"
                    }
                }
            })
    });

