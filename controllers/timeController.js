
angular.module('darkRide').controller('timeController', 
    [
        '$scope',
        '$rootScope',
        '$state',
    function(
        $scope,
        $rootScope,
        $state
    ) {

    if (!angular.isDefined($rootScope.user)) {
        $state.go("home");
        return;
    }

    $scope.timeToPick = new Date();
    $scope.ismeridian = false;
    $scope.format = 'dd-MM-yyyy';
    $scope.dt = "Today";
    $scope.showControls = false;

    $scope.setAndGo = function () {
        $scope.updateDate();
        $state.go("drop");
    };

    $scope.toggleMin = function () {
        $scope.minDate = new Date();
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.updateDate = function () {
        $rootScope.user.timeData.date = $scope.dt = new Date();
    };

    $scope.addDays = function (p) {
        $scope.dt = new Date($scope.dt.setDate($scope.dt.getDate() + (p)));
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
