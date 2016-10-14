var blogControllers = angular.module('blogControllers', []);

// blogControllers.controller('BlogCtrl', ['$scope','blogS', '$ngBootbox',
//     function ($scope,blogS, $ngBootbox) {
//         $scope.node = "beautiful world";
//         $scope.alertModel = function () {
//             $ngBootbox.customDialog({
//                 title: "请选择产品",
//                 templateUrl: "/html/blog/partials/checkDialog.html",
//                 show: true,
//                 backdrap: true,
//                 animate: true,
//                 size:'small',
//                 buttons: {
//                     success: {
//                         label: "OK",
//                         className: "btn-primary",
//                         callback: function () {
//                             var status = $("input[name='checkResult']:checked").val();
//                             var reason = $("#checkReason").val();
//                             console.log(status);
//                             console.log(reason);
//                         }
//                     }
//                     ,
//                     warning: {
//                         label: "Cancel",
//                         className: "btn-default"
//                     }
//                 }
//             })
//         }

//         $scope.prop = function () {
//             $ngBootbox.prompt('Enter something')
//                 .then(function (result) {
//                     console.log('Prompt returned: ' + result);
//                 }, function () {
//                     console.log('Prompt dismissed!');
//                 });
//         }
//     }]);

//发布博文
blogControllers.controller('BlogCtrl', ['$scope', 'blogS', '$ngBootbox', '$window', '$location', '$routeParams', '$rootScope',
    function ($scope, blogS, $ngBootbox, $window, $location, $routeParams, $rootScope) {
        $scope.search = {};
        $scope._id = $routeParams._id;
        $scope.flag = $routeParams.flag;
        $scope.currentPage = 1;
        //   获取blog列表
        $scope.getBlogList = function () {
            console.log($scope.currentPage);
            $scope.search.currentPage = $scope.currentPage;
            blogS.getBlogList($scope.search).then(function (data) {
                if (data.err) {
                    $ngBootbox.alert(data.msg);
                    return;
                }
                console.log(data)
                $scope.pageSize = 10;
                $scope.totalItems = data.total;
                $scope.blogs = data.blogs
            })

        }
        $scope.getBlogList();

        //取得指定blog
        $scope.getblog = function () {
            blogS.getBlog($scope._id, $scope.flag).then(function (data) {
                if (data.err) {
                    $ngBootbox.alert(data.msg);
                    return;
                }
                console.log(data);
                $scope.blog = data.blog
            })
        }
        if ($scope.flag) {
            $scope.getblog();
        }

        //删除blog
        $scope.delete = function () {
            $ngBootbox.confirm("你确定删除" + $scope.blog.title).then(function () {
                blogS.deleteBlog($scope._id).then(function (data) {
                    if (data.err) {
                        $ngBootbox.alert(data.msg);
                        return;
                    }
                    $ngBootbox.alert(data.msg);
                    // $location.url('/');
                })
            }, function () {
                console.log('不删除');
            })
        }
    }])


//发布blog控制器
blogControllers.controller('PostBlogCtrl', ['$scope', 'blogS', '$ngBootbox', '$window', '$location', '$routeParams', '$rootScope',
    function ($scope, blogS, $ngBootbox, $window, $location, $routeParams, $rootScope) {
        $scope.search = {};
        $scope._id = $routeParams._id;
        $scope.flag = $routeParams.flag;
        $scope.currentPage = 1;


        //socket.io实时更新
        $rootScope.socket = io('http://115.159.146.35:8000');
        $rootScope.socket.on('contentS', function (data) {
            console.log('--------->')
            console.log(data);
            $scope.contentC = data;
        });
        $scope.change = function () {
            $rootScope.socket.emit('contentC', $scope.search.content);
        }

        //发布blog
        $scope.postBlog = function () {
            $scope.search.labels = $scope.search.labels.split(" ")
            blogS.postBlog($scope.search).then(function (data) {
                if (data.err) {
                    $ngBootbox.alert(data.msg);
                    return;
                }
                $ngBootbox.alert('发布成功');
                $location.url('/index')
            })
        }

    }])


//更新blog控制器
blogControllers.controller('UpdateBlogCtrl', ['$scope', 'blogS', '$ngBootbox', '$window', '$location', '$routeParams', '$rootScope',
    function ($scope, blogS, $ngBootbox, $window, $location, $routeParams, $rootScope) {
        $scope.search = {};
        $scope._id = $routeParams._id;
        $scope.flag = $routeParams.flag;
        console.log($scope.flag);

        //更新blog 
        $scope.getblog = function () {
            blogS.getBlog($scope._id, $scope.flag).then(function (data) {
                if (data.err) {
                    $ngBootbox.alert(data.msg);
                    return;
                }
                console.log(data);
                $scope.search._id = data.blog._id;
                $scope.search.title = data.blog.title;
                $scope.search.labels = data.blog.labels.join(" ");
                $scope.search.content = data.blog.content;
            })
        }

        $scope.getblog();

        $rootScope.socket = io('http://115.159.146.35:8000');
        $rootScope.socket.on('contentS', function (data) {
            console.log(data);
            $scope.contentC = data;
        });
        $scope.change = function () {
            $rootScope.socket.emit('contentC', $scope.search.content);
        }

        // setInterval(function () {
        //     console.log($scope.search);
        //     blogS.exchangeTitle($scope.search).then(function (data) {
        //         if (data.err) {
        //             $ngBootbox.alert(data.msg)
        //         }
        //         console.log(data.content)
        //         $scope.contentC = data.content
        //     })
        // }, 9000)

        $scope.update = function () {
            $scope.search.labels = $scope.search.labels.split(" ")            
            $ngBootbox.confirm("确定更新?").then(function () {
                blogS.updateBlog($scope.search).then(function (data) {
                    if (data.err) {
                        $ngBootbox.alert(data.msg);
                        return;
                    }
                    $ngBootbox.alert(data.msg);
                    $location.url('/');
                })
            }, function () {

            })
        }

    }])




//登陆控制器
blogControllers.controller('LoginCtrl', ['$scope', 'UM', '$ngBootbox', 'storage', 'Auth', '$location',
    function ($scope, UM, $ngBootbox, storage, Auth, $location) {
        $scope.search = {};
        $scope.login = function () {
            UM.login($scope.search.username, $scope.search.password).then(function (data) {
                if (data.code == '999') {
                    $ngBootbox.alert(data.msg)
                    return;
                }
                Auth.setToken(data.data.user.token);
                Auth.setUser(data.data.user);
                $ngBootbox.alert('登录成功');
                $location.url('/index');

            })
        }

    }])


//登出控制器
blogControllers.controller('LogoutCtrl', ['$scope', 'UM', '$ngBootbox', 'storage', 'Auth',
    function ($scope, UM, $ngBootbox, storage, Auth) {
        $scope.search = {};
        $scope.logout = function () {
            Auth.logout();
            $ngBootbox.alert('登出成功')
        }
        $scope.logout();

    }])