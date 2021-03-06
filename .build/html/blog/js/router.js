var router = angular.module('blogRouter', ['ngRoute']);
router.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/index', {
            templateUrl: '/html/blog/partials/index.html',
            controller: 'BlogCtrl'
        }).
        when('/postBlog', {
            templateUrl: '/html/blog/partials/post-blog.html',
            controller: 'PostBlogCtrl'
        }).
        when('/blogDetail/:_id/:flag', { //blog详情页面
            templateUrl: '/html/blog/partials/blog_detail.html',
            controller: 'BlogDetailCtrl'
        }).
        when('/updateBlog/:_id', {
            templateUrl: '/html/blog/partials/update_blog.html',
            controller: 'UpdateBlogCtrl'
        }).
        when('/checkDialog', {
            templateUrl: '/html/blog/partials/checkDialog.html',
            controller: 'BlogCtrl'
        }).
        when('/login', {
            templateUrl: '/html/blog/partials/login.html',
            controller: 'LoginCtrl'
        }).
        when('/logout', {
            templateUrl: '/html/blog/partials/login.html',
            controller: 'LogoutCtrl'
        }).
        when('/findPassword', {
            templateUrl: '/html/blog/partials/findPassword.html',
            controller: 'FindPasswordCtrl'
        }).
        when('/tag', {
            templateUrl: '/html/blog/partials/tag.html',
            controller: 'TagCtrl'
        }).
        when('/image', { //
            templateUrl: '/html/blog/partials/image.html',
            controller: 'ImageCtrl'
        }).
        otherwise({
            redirectTo: '/index'
        });
    }
])