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
                controller: 'PostBlogCtrl'
            }).
             when('/blogDetail/:_id/:flag', {
                templateUrl: '/html/blog/partials/blog_detail.html',
                controller: 'BlogCtrl'
            }).
             when('/updateBlog/:_id', {
                templateUrl: '/html/blog/partials/update_blog.html',
                controller: 'UpdateBlogCtrl'
            }).
             when('/checkDialog', {
                templateUrl: '/html/blog/partials/checkDialog.html',
                controller: 'BlogCtrl'
            }).
            when('/login',{
                templateUrl:'/html/blog/partials/login.html',
                controller:'LoginCtrl'
            }).
             when('/logout',{
                templateUrl:'/html/blog/partials/login.html',
                controller:'LogoutCtrl'
            }).
            otherwise({
                redirectTo: '/index'
            });
    }])