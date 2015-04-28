
angular.module('blackRide').controller('timeController', 
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
        $scope.dt = $scope.updateDate();
        var date = new Date($scope.dt);
        var time = new Date($scope.timeToPick);
        $rootScope.user.booking.scheduled = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()  + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
        $rootScope.user.flush();
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
        if ($scope.dt == "Today") return new Date();
        else return $scope.dt;
    };

    $scope.addDays = function (p) {
        $scope.dt = $scope.updateDate();
        $scope.dt = new Date($scope.dt.setDate($scope.dt.getDate() + (p)));
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.toggleMin();
    
}]);
