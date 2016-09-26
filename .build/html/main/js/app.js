'use strict'

var mainApp = angular.module('mainApp', [
    'ui.bootstrap',
    'mainRouter',
    'mainControllers',
    'commonDirectives',
    'sysServices'
]);
mainApp.config(['$compileProvider','$httpProvider','$locationProvider',
function($compileProvider,$httpProvider,$locationProvider){
    $httpProvider.interceptors.push('authInterceptor');
}])