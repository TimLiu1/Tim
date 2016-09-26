var mainControllers = angular.module('mainControllers',[]);

mainControllers.controller('MainCtrl',['$scope',
function($scope){
    console.log('Tim‘s web')
}])

mainControllers.controller('loginCtrl',['$scope','UM',
function($scope,UM){
  $scope.search = {};
  $scope.login = function(){
      UM.login($scope.search.username,$scope.search.search.password).then(function(data){
          console.log(data);
      })
  }

}])