var router = angular.module('blogRouter', ['ngRoute']);
router.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/index', {
                templateUrl: '/html/blog/partials/index.html',
                controller: 'blogCtrl'
            }).
             when('/message', {
                templateUrl: '/html/blog/partials/message.html',
                controller: 'blogCtrl'
            })
            .
            otherwise({
                redirectTo: '/index'
            });
    }])