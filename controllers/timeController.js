
angular.module('darkRide').controller('timeController', 
    [
    '$scope',
    '$rootScope',
    function(
    $scope,
    $rootScope
    ) {

    $scope.timeToPick = new Date();
    $scope.ismeridian = false;
    $scope.format = 'dd-MMMM-yyyy';
    $scope.dt = new Date();
    $scope.showControls = false;

    $scope.toggleMin = function() {
        $scope.minDate = new Date();
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.changed = function () {
        $rootScope.user.timeData.time = $scope.timeToPick;
    };

    $scope.$watch('dt', function(newVal, oldVal) {
        $rootScope.user.timeData.date = newVal;
    });

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.changed();
    $scope.toggleMin();
    
}]);
