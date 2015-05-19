angular.module('blackRide').controller('confirmModelController',
    [
        '$rootScope',
        '$scope',
        '$state',
    function(
        $rootScope,
        $scope,
        $state
    ) {

    if (!$rootScope.user) {
        $state.go("home");
    } else if (!$rootScope.user.booking.scheduled) {
        $state.go("time");
    } else if (!$rootScope.user.booking.quote) {
        $state.go("driver");
    }

    $scope.vehicle = ($rootScope.user.booking.quote && $rootScope.user.booking.quote.quote) ? $rootScope.user.booking.quote.quote.vehicle_type : 2;
    $scope.user = $rootScope.user;
    $scope.scheduled = $rootScope.user.booking.scheduled_raw;



}]);