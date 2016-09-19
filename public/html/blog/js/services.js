var blogServices = angular.module('blogServices',[]);
var HOST = '/api/blog/'


var responseSuccess = function(res) {
    if (res.data.code && res.data.code != '000') {
        return { err: res.data.msg }
    }
    return res.data;
};
var responseError = function(err) {
    return { err: err, msg: '调用后台出错' };
};




blogServices.factory('blogS',['$http',function($http){
    return {
        postBlog: function(blog){
            return $http.post(HOST+'blog',blog).then(responseSuccess,responseError);
        },
         getBlogList: function(blog){
            return $http.get(HOST+'blogList').then(responseSuccess,responseError);
        }
    }
}])