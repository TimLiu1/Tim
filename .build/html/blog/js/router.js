var router = angular.module('blogRouter', ['ngRoute']);
router.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/index', {
                templateUrl: '/html/blog/partials/index.html',
                controller: 'BlogCtrl'
            }).
             when('/postBlog', {
                templateUrl: '/html/blog/partials/post-blog.html',
                controller: 'BlogCtrl'
            }).
             when('/updateBlog/:blog', {
                templateUrl: '/html/blog/partials/post-blog.html',
                controller: 'UpdateBlogCtrl'
            }).
             when('/checkDialog', {
                templateUrl: '/html/blog/partials/checkDialog.html',
                controller: 'BlogCtrl'
            }).
            otherwise({
                redirectTo: '/index'
            });
    }])