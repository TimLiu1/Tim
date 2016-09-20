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
blogControllers.controller('BlogCtrl', ['$scope', 'blogS', '$ngBootbox', '$window','$location',
    function ($scope, blogS, $ngBootbox, $window,$location) {
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
        //更新blog 

         $scope.update = function (blog) {
             $location.url('/updateBlog/'+blog.blog);
         }
    }])


    blogControllers.controller('UpdateBlogCtrl', ['$scope', 'blogS', '$ngBootbox', '$window','$location', '$routeParams',
    function ($scope, blogS, $ngBootbox, $window,$location, $routeParams) {
        $scope.search = {};
        console.log($routeParams.blog)
        
        //更新blog 
        $scope.update = function (blog) {
            $ngBootbox.confirm("你确定更新" + blog.blog.title).then(function () {
                $scope.search._id = blog.blog._id
                blogS.updateBlog(_id).then(function (data) {
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