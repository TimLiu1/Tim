var blogServices = angular.module('blogServices', []);
var HOST = '/api/blog/'


var responseSuccess = function (res) {
    if (res.data.code && res.data.code != '000') {
        return { err: res.data.msg }
    }
    return res.data;
};
var responseError = function (err) {
    return { err: err, msg: '调用后台出错' };
};




blogServices.factory('blogS', ['$http', function ($http) {
    return {
        postBlog: function (blog) { //发表blog
            return $http.post(HOST + 'blog', blog).then(responseSuccess, responseError);
        },
        getBlogList: function (blog) { //获取blog列表
            return $http.post(HOST + 'blogList',blog).then(responseSuccess, responseError);
        },
        deleteBlog: function (id) {   //删除blog
            return $http.get(HOST + 'deleteBlog?_id=' + id).then(responseSuccess, responseError);
        },
        updateBlog: function (obj) { //更新blog
            return $http.post(HOST + 'updateBlog',obj).then(responseSuccess, responseError);
        },
         getBlog: function (_id,flag) { //取得具体blog
            return $http.get(HOST + 'getBlog?_id=' + _id+'&flag='+flag).then(responseSuccess, responseError);
        },
         exchangeTitle: function (obj) {
            return $http.post(HOST + 'exchangeTitle',obj).then(responseSuccess, responseError);
        },

    }
}])