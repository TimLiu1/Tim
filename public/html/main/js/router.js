var router = angular.module('mainRouter', ['ngRoute']);
router.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/overview', {
                templateUrl: '/html/main/partials/overview.html',
                controller: 'MainCtrl'
            }).
             when('/message', {
                templateUrl: '/html/main/partials/message.html',
                controller: 'MainCtrl'
            }).          
            otherwise({
                redirectTo: '/overview'
            });
    }])