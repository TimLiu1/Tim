'use strict'

var blogApp = angular.module('blogApp', [
    'ui.bootstrap',
    'blogRouter',
    'ngBootbox',
    'blogServices',
    'blogFilters',
    'blogControllers',
    'commonDirectives',
    'sysServices',
]);

blogApp.config(['$compileProvider','$httpProvider','$locationProvider',
function($compileProvider,$httpProvider,$locationProvider){
    $httpProvider.interceptors.push('authInterceptor');
}])
