var blogFilters = angular.module('blogFilters',[]).filter('trust', ['$sce',function($sce) {
  //让html正常显示
    return function(value, type) {
        return $sce.trustAs(type || 'html', value);
    }
}])