var blogServices = angular.module('blogServices', []);
var HOST = '/api/blog/'
var api = '/user/'


var responseSuccess = function (res) {
    if (res.data.code && res.data.code != '000') {
        bootbox.alert(res.data.msg);
    } else {
        return res.data;
    }
};
var responseError = function (err) {
    bootbox.alert("调用后台出错");
};




blogServices.factory('blogS', ['$http', function ($http) {
    return {
        postBlog: function (blog) { //发表blog
            return $http.post(HOST + 'blog', blog).then(responseSuccess, responseError);
        },
        getBlogList: function (blog) { //获取blog列表
            return $http.post(HOST + 'blogList', blog).then(responseSuccess, responseError);
        },
        deleteBlog: function (id) { //删除blog
            return $http.get(HOST + 'deleteBlog?_id=' + id).then(responseSuccess, responseError);
        },
        updateBlog: function (obj) { //更新blog
            return $http.post(HOST + 'updateBlog', obj).then(responseSuccess, responseError);
        },
        getBlog: function (_id, flag) { //取得具体blog
            return $http.get(HOST + 'getBlog?_id=' + _id + '&flag=' + flag).then(responseSuccess, responseError);
        },
        exchangeTitle: function (obj) {
            return $http.post(HOST + 'exchangeTitle', obj).then(responseSuccess, responseError);
        },
         

    }
}])

blogServices.factory('UserSer', ['$http', function ($http) {
    return {
        sign: function (blog) { //发表blog
            return $http.post(api + 'sign', blog).then(responseSuccess, responseError);
        },
        findPassword: function (obj) {
            return $http.post(api + 'findPassword', obj).then(responseSuccess, responseError);
        },
         sendCode: function (obj) {
            return $http.post(api + 'sendCode', obj).then(responseSuccess, responseError);
        },
    }
}])