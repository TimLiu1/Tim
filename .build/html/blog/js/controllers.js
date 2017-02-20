var blogControllers = angular.module('blogControllers', []);



//主页控制器
blogControllers.controller('BlogCtrl', ['storage', '$scope', 'blogS', 'UserSer', '$ngBootbox', '$window', '$location', '$routeParams', '$rootScope', 'UM', 'Auth', '$location', "$interval",
    function (storage, $scope, blogS, UserSer, $ngBootbox, $window, $location, $routeParams, $rootScope, UM, Auth, $location, $interval) {
        $scope.search = {};
        $scope.currentPage = 1;
        $scope.search.title = $routeParams.flag;
        $scope.flag = 0;
        $scope.showButton = 0


        $scope.startTime = function () {
            $scope.sendCode();
            $scope.showtime = "60秒"
            $scope.showButton = 1;
            $scope.timerCount = 60000
            $scope.i = setInterval(function () {
                $scope.showtime = $scope.timerCount / 1000 + "秒"
                if ($scope.timerCount == 0) {
                    clearTimeout($scope.i);
                    $scope.showtime = "60秒"
                    $scope.showButton = 0;
                }
            }, 1000)

        }
        var counter = $interval(function () {
            $scope.timerCount = $scope.timerCount - 1000;
            $scope.showtime = $scope.timerCount / 1000 + "秒"
        }, 1000);


        // Auth.logout();
        $scope.logoutFlag = $location.search().logoutFlag;
        console.log("登出程序启动" + $scope.logoutFlag)
        console.log($scope.logoutFlag);
        if ($scope.logoutFlag === 'logout') {
            Auth.logout();
            $location.url('/index')

        }
        //   获取blog列表
        $scope.getBlogList = function () {
            $scope.search.currentPage = $scope.currentPage;
            blogS.getBlogList($scope.search).then(function (data) {
                if (data.err) {
                    $ngBootbox.alert(data.msg);
                    return;
                }
                $scope.pageSize = 5;
                $scope.blog_count = data.blog_count;
                $scope.totalItems = data.blogs.total;
                $scope.blogs = data.blogs.docs
                $scope.blogList = data.blogList
                console.log($scope.blogList);
            })

        }
        $scope.getBlogList();
        $scope.getLable = function (label) {
            $scope.search.label = label
            $scope.getBlogList();

        }

        $scope.searchByMonth = function (year, month) {
            console.log(year)
            $scope.search.year = year;
            $scope.search.month = month;
            $scope.getBlogList();
        }

        $scope.changeFlag = function (flag) {
            $scope.flag = flag
        }

        //获取验证码
        $scope.sendCode = function () {
            console.log("发送验证码")
            UserSer.sendCode($scope.search).then(function (data) {
                $scope.data = data;
                console.log(data);
            })
        }




        //注册
        $scope.register = function (flag) {
            $scope.search.flag = $scope.flag;
            if ($scope.flag == 2) {
                if ($scope.data.sendCode != $scope.search.code) {
                    $ngBootbox.alert("验证码错误");
                    return;
                }
                if (!$scope.search.mobile || !$scope.search.password || !$scope.search.rePassword) {
                    $ngBootbox.alert("请填写所有必填项");
                    return;
                } else if ($scope.search.password != $scope.search.rePassword) {
                    $ngBootbox.alert("两次密码不一致");
                    return;
                } else if ($scope.search.password.length < 6) {
                    $ngBootbox.alert("密码必须大于6位");
                    return;
                } else {
                    UserSer.sign($scope.search).then(function (data) {
                        if (data) {
                            $ngBootbox.alert("注册成功");
                            $scope.flag = 0;
                        }
                    })
                }
            } else {
                if (!$scope.search.username || !$scope.search.email || !$scope.search.password || !$scope.search.rePassword) {
                    $ngBootbox.alert("请填写所有必填项");
                    return;
                } else if ($scope.search.password != $scope.search.rePassword) {
                    $ngBootbox.alert("两次密码不一致");
                    return;
                } else if ($scope.search.password.length < 6) {
                    $ngBootbox.alert("密码必须大于6位");
                    return;
                } else {
                    UserSer.sign($scope.search).then(function (data) {
                        if (data) {
                            $ngBootbox.alert("注册成功");
                            $scope.flag = 0;
                        }
                    })
                }
            }

        }


        //获取用户信息
        $scope.getUser = function () {
            $rootScope.user = Auth.getUser('user');
        }
        $scope.getUser();


        //登录
        $scope.login = function () {
            console.log($scope.search);
            if (!$scope.search.username || !$scope.search.password) {
                $ngBootbox.alert("请填写所有必填项");
                return;
            } else {
                UM.login($scope.search).then(function (data) {
                    if (data.data.code == '000') {
                        $ngBootbox.alert("登陆成功");
                        var user = data.data.user;
                        $rootScope.user = user;
                        Auth.setUser(user);
                        console.log("user" + JSON.stringify(Auth.getUser('user')));
                        Auth.setToken(data.data.user.token);
                    } else {
                        $ngBootbox.alert(data.data.msg);
                    }
                })
            }
        }



    }
])




//blog详情页面
blogControllers.controller('BlogDetailCtrl', ['$rootScope', '$scope', '$window', '$routeParams', 'blogS', '$ngBootbox', '$location', 'Auth', function ($rootScope, $scope, $window, $routeParams, blogS, $ngBootbox, $location, Auth) {
    $scope._id = $routeParams._id;
    $scope.flag = $routeParams.flag;
    //取得指定blog
    $scope.user = $rootScope.user;

    console.log('---------------');
    console.log($scope.user);

    $scope.getblog = function () {
        blogS.getBlog($scope._id, $scope.flag).then(function (data) {
            if (data.err) {
                $ngBootbox.alert(data.msg);
                $location.url('/index');
            }
            console.log(data);
            $scope.blog = data.blog
        })
    }
    $scope.getblog();
    $scope.user = Auth.getUser();
    console.log("user" + JSON.stringify($scope.user));


    //删除blog
    $scope.delete = function () {
        $ngBootbox.confirm("你确定删除" + $scope.blog.title).then(function () {
            blogS.deleteBlog($scope._id).then(function (data) {
                if (data.err) {
                    $ngBootbox.alert(data.msg);
                    return;
                }
                $ngBootbox.alert(data.msg);
                $location.url('/index')
            })
        }, function () {
            console.log('不删除');
        })
    }

    $scope.goBack = function () {
        $window.history.back()
    }
}])


//发布blog控制器
blogControllers.controller('PostBlogCtrl', ['$scope', 'blogS', '$ngBootbox', '$window', '$location', '$routeParams', '$rootScope',
    function ($scope, blogS, $ngBootbox, $window, $location, $routeParams, $rootScope) {
        $scope.search = {};
        $scope._id = $routeParams._id;
        $scope.flag = $routeParams.flag;
        $scope.currentPage = 1;

        //markdown语法解析
        var simplemde = new SimpleMDE({
            renderingConfig: {
                singleLineBreaks: false,
                codeSyntaxHighlighting: true,
            },
            placeholder: "content...",
        })


        // //socket.io实时更新
        // $rootScope.socket = io('http://115.159.146.35:8000');
        // $rootScope.socket.on('contentS', function (data) {
        //     $scope.contentC = data;
        // });
        // $scope.change = function () {
        //     $rootScope.socket.emit('contentC', $scope.search.content);
        // }


        //发布blog
        $scope.postBlog = function () {
            $scope.search.content = simplemde.value();
            if (!$scope.search.content) {
                $ngBootbox.alert('内容必须输入');
                return;
            }
            $scope.search.labels = $scope.search.labels.split(" ")
            blogS.postBlog($scope.search).then(function (data) {
                console.log("123" + JSON.stringify(data));
                if (data.code == '999') {
                    $ngBootbox.alert(data.msg);
                    $location.url('/index');
                    return;
                }
                $ngBootbox.alert('发布成功');
                $location.url('/index')
            })
        }

    }
])


//更新blog控制器
blogControllers.controller('UpdateBlogCtrl', ['$scope', 'blogS', '$ngBootbox', '$window', '$location', '$routeParams', '$rootScope',
    function ($scope, blogS, $ngBootbox, $window, $location, $routeParams, $rootScope) {
        $scope.search = {};
        $scope._id = $routeParams._id;
        $scope.flag = $routeParams.flag;
        console.log($scope.flag);


        //markdown语法解析
        var simplemde = new SimpleMDE({
            renderingConfig: {
                singleLineBreaks: false,
                codeSyntaxHighlighting: true,
            },
            placeholder: "content...",
        })


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
                simplemde.value($scope.search.content);
            })
        }

        $scope.getblog();

        // $rootScope.socket = io('http://115.159.146.35:8000');
        // $rootScope.socket.on('contentS', function (data) {
        //     console.log(data);
        //     $scope.contentC = data;
        // });
        // $scope.change = function () {
        //     $rootScope.socket.emit('contentC', $scope.search.content);
        // }

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
                $scope.search.content = simplemde.value();
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

    }
])




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

    }
])

//找回密码控制器
blogControllers.controller('FindPasswordCtrl', ['$scope', 'UserSer', '$ngBootbox', 'storage', 'Auth', '$location',
    function ($scope, UserSer, $ngBootbox, storage, Auth, $location) {
        $scope.search = {};
        $scope.findPassword = function () {
            console.log("找回密码")
            UserSer.findPassword($scope.search).then(function (data) {
                if (data.code == '999') {
                    $ngBootbox.alert(data.msg)
                    return;
                }
                $ngBootbox.alert('发送成功,请登录邮箱查看');
                $location.url('/index');

            })
        }

    }
])







//登出控制器
blogControllers.controller('LogoutCtrl', ['$scope', 'UM', '$ngBootbox', 'storage', 'Auth', '$location',
    function ($scope, UM, $ngBootbox, storage, Auth, $location) {
        $scope.search = {};
        $scope.logout = function () {
            Auth.logout();
            $ngBootbox.alert('登出成功');
        }
        $scope.logout();

    }
])

//照片上传控制器
blogControllers.controller('ImageCtrl', ['$scope', 'UM', '$ngBootbox', 'storage', 'Auth',
    function ($scope, UM, $ngBootbox, storage, Auth) {

        $scope.$on('$viewContentLoaded', function () {
            loadFileinput();
        });
        $scope.urls = [];
        function loadFileinput() {
            $("#file").fileinput({
                language: 'zh', //设置语言
                uploadUrl: "/api/common/image", //上传的地址
                allowedFileExtensions: ["jpg", "png", "gif", 'jpeg'],
                browseOnZoneClick: true,
                maxFileCount: 10,
                maxFileSize: 2000,
                resizePreference: 'height',
                overwriteInitial: false,
                uploadLabel: "上传",
                browseLabel: "选择图片",
                dropZoneTitle: "点击",
                dropZoneClickTitle: "选择图片",
                browseClass: "btn btn-primary", //按钮样式
                showCaption: false, //是否显示标题
                resizeImage: true
            })
        }


        $('#file').on('fileuploaded', function (event, data, previewId, index) {
            var form = data.form, files = data.files, extra = data.extra,
                response = data.response, reader = data.reader;
               $scope.detail = {
                   name:response.name,
                   url:response.url
               }
               $scope.urls.push($scope.detail)
               $scope.$apply();
        });


    }
])