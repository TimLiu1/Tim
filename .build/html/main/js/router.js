var router = angular.module('mainRouter', ['ngRoute']);
router.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/overview', {
                templateUrl: '/html/main/partials/overview.html',
                controller: 'MainCtrl'
            }).
            otherwise({
                redirectTo: '/overview'
            });
    }])