var router = angular.module('blogRouter', ['ngRoute']);
router.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/index', {
                templateUrl: '/html/blog/partials/index.html',
                controller: 'BlogCtrl'
            }).
             when('/message', {
                templateUrl: '/html/blog/partials/message.html',
                controller: 'BlogCtrl'
            })
            .
            otherwise({
                redirectTo: '/index'
            });
    }])