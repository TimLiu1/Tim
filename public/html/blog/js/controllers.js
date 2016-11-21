var blogControllers = angular.module('blogControllers', []);



//主页控制器
blogControllers.controller('BlogCtrl', ['$scope', 'blogS', 'UserSer','$ngBootbox', '$window', '$location', '$routeParams', '$rootScope',
    function ($scope, blogS,UserSer, $ngBootbox, $window, $location, $routeParams, $rootScope) {
        $scope.search = {};
        $scope.currentPage = 1;
        $scope.search.title = $routeParams.flag;
        $scope.flag = 0;
        //   获取blog列表
        $scope.getBlogList = function () {
            $scope.search.currentPage = $scope.currentPage;
            blogS.getBlogList($scope.search).then(function (data) {
                if (data.err) {
                    $ngBootbox.alert(data.msg);
                    return;
                }
                console.log(data)
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

        $scope.changeFlag = function(flag){
            $scope.flag = flag
        } 

          $scope.register = function(flag){
           if(!$scope.search.username || !$scope.search.password || !$scope.search.rePassword){
           $ngBootbox.alert("请填写所有必填项");
           return;
           }else{
               UserSer.sign($scope.search).then(function(data){
                   console.log(data);
                   if(!data.err){
                       $ngBootbox.alert("注册成功,请登录");
                       $scope.flag = 0;
                   }
               })
           }
        } 

         $scope.login = function(){
           if(!$scope.search.username || !$scope.search.password ){
           $ngBootbox.alert("请填写所有必填项");
           return;
           }else{
              
           }
        } 

    }])


// blogControllers.controller('headController', ['$scope', '$location', '$routeParams',
// function ($scope, blogS, $ngBootbox, $window, $location, $routeParams, $rootScope) {
//     //   获取blog列表
//     $scope.getBlogList = function () {
//        $location.url('/index/'+$scope.search.title);
//     }
// }])

//blog详情页面
blogControllers.controller('BlogDetailCtrl', ['$scope', '$window', '$routeParams', 'blogS', '$ngBootbox', '$location', function ($scope, $window, $routeParams, blogS, $ngBootbox, $location) {
    $scope._id = $routeParams._id;
    $scope.flag = $routeParams.flag;
    //取得指定blog
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


        //socket.io实时更新
        $rootScope.socket = io('http://115.159.146.35:8000');
        $rootScope.socket.on('contentS', function (data) {
            $scope.contentC = data;
        });
        $scope.change = function () {
            $rootScope.socket.emit('contentC', $scope.search.content);
        }


        //发布blog
        $scope.postBlog = function () {
            $scope.search.content = simplemde.value();
            if(!$scope.search.content){
                $ngBootbox.alert('内容必须输入');
                return;
            }
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

    //登出控制器
blogControllers.controller('TagCtrl', ['$scope', 'UM', '$ngBootbox', 'storage', 'Auth',
    function ($scope, UM, $ngBootbox, storage, Auth) {
        console.log('标签云')
    }])

