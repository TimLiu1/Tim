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
blogControllers.controller('BlogCtrl', ['$scope', 'blogS', '$ngBootbox', '$window', '$location',
    function ($scope, blogS, $ngBootbox, $window, $location) {
        $scope.search = {};
        $scope.postBlog = function () {
            blogS.postBlog($scope.search).then(function (data) {
                if (data.err) {
                    $ngBootbox.alert(data.msg);
                    return;
                }
                $ngBootbox.alert('发布成功');
                $location.url('/index')
            })
        }
        //    $scope.contentC = marked($scope.search.content);
        $scope.getBlogList = function () {
            blogS.getBlogList().then(function (data) {
                if (data.err) {
                    $ngBootbox.alert(data.msg);
                    return;
                }
                console.log(data)
                $scope.blogs = data.blogs
            })

        }
        $scope.getBlogList();
        setInterval(function () {
            blogS.exchangeTitle($scope.search).then(function (data) {
                if(data.err){
                    $ngBootbox.alert(data.msg)
                }
                console.log(data.content)
                $scope.contentC = data.content
            })
        }, 9000)
        //删除blog
        $scope.delete = function (blog) {
            $ngBootbox.confirm("你确定删除" + blog.blog.title).then(function () {
                var _id = blog.blog._id
                blogS.deleteBlog(_id).then(function (data) {
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


blogControllers.controller('UpdateBlogCtrl', ['$scope', 'blogS', '$ngBootbox', '$window', '$location', '$routeParams',
    function ($scope, blogS, $ngBootbox, $window, $location, $routeParams) {
        $scope.search = {};
        $scope._id = $routeParams._id;

        //更新blog 
        $scope.getblog = function () {
            blogS.getBlog($scope._id).then(function (data) {
                if (data.err) {
                    $ngBootbox.alert(data.msg);
                    return;
                }
                $scope.search._id = data.blog._id;
                $scope.search.title = data.blog.title;
                $scope.search.content = data.blog.content;
            })
        }

        $scope.getblog();
        
         setInterval(function () {
            blogS.exchangeTitle($scope.search).then(function (data) {
                if(data.err){
                    $ngBootbox.alert(data.msg)
                }
                console.log(data.content)
                $scope.contentC = data.content
            })
        }, 9000)

        $scope.update = function () {
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