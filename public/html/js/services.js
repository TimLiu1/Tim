var sysServices = angular.module('sysServices', []);

sysServices.factory('storage', ['$window', function ($window) {
    return {
        session: {
            setObject: function (key, obj) {
                $window.sessionStorage.setItem(key, angular.toJson(obj));
            },
            getObject: function (key) {
                return angular.fromJson($window.sessionStorage.getItem(key));
            },
            setValue: function (key, value) {
                $window.sessionStorage.setItem(key, value);
            },
            getValue: function (key) {
                return $window.sessionStorage.getItem(key);
            }
        },
        local: {
            setObject: function (key, obj) {
                $window.localStorage.setItem(key, angular.toJson(obj));
            },
            getObject: function (key) {
                return angular.fromJson($window.localStorage.getItem(key));
            },
            setValue: function (key, value) {
                $window.localStorage.setItem(key, value);
            },
            getValue: function (key) {
                return $window.localStorage.getItem(key);
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            }
        }
    }
}]);


sysServices.factory('Auth', ['storage', '$http', '$window', '$location',
    function (storage, $hhtp, $window, $location) {
        return {
            getToken: function () {
                return storage.local.getValue('jwtToken');
            },
            setToken: function (token) {
                storage.local.setValue('jwtToken', token);
            },
            isAuthenticated: function () {
                if (storage.local.getObject('user')) {
                    return true;
                } else {
                    return false;
                }
            },
            getUser: function () {
                return storage.local.getObject('user');
            },
            setUser: function (user) {
                storage.local.setObject('user', user);
            },
            logout: function () {
                storage.local.remove('jwtToken');
                storage.local.remove('user');
            },
            login: function (obj) {

            }
        }
    }
]);

sysServices.factory('authInterceptor', ['storage', '$location', function (storage, $location) {
    return {
        request: function (config) {
            console.log(config);
            if (config.url.indexOf('.json') > 0) {
                return config;
            };
            if (storage.local.getValue('jwtToken')) {
                config.headers.Authorization = 'Tim ' + storage.local.getValue('jwtToken');
            }
            return config;
        },
        response: function (res) {
            if (res.data.code == 400) {
                storage.local.remove('user');
                storage.local.remove('jwtToken');
            }
            // if(res.data.code == '999'){
            //     alert(res.data.msg);
            //     $location.url('/login')
            // }
            return res;
        }
    }
}]);

sysServices.factory('UM', ['$http', 'storage', function ($http, storage) {
    return {
        login: function (obj) {
            return $http.post('/user/login', obj);
        }
    }
}])