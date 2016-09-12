var commonDirectives = angular.module("commonDirectives", []);

commonDirectives.directive('messageBox', function () {
    return {
        restrict: 'E',
        template: '<div>\
                        <h1 ng-click = "alert()">你好世界</h1>\
                        <p>每次都是helloworld，ni Y</p>\
                        </div>'
    }
})