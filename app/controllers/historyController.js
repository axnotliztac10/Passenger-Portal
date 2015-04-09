angular.module('blackRide').controller('historyController', 
    [
        '$scope',
        '$modal',
        '$rootScope',
        '$state',
        'Bookings',
        '$timeout',
    function(
        $scope,
        $modal,
        $rootScope,
        $state,
        Bookings,
        $timeout
    ) {

        $scope.sorts = [
            {value: "date", label: "Time"},
            {value: "price", label: "Price"}
        ];

        $scope.sort = $scope.sorts[0];

        var getBookings = function () {
            Bookings.done.get($rootScope.userToken).success(function (res) {
                $scope.bookingsDone = res;
            });

            Bookings.pending.get($rootScope.userToken).success(function (res) {
                $scope.bookingsPending = res;
            });

            Bookings.dispatched.get($rootScope.userToken).success(function (res) {
                $scope.bookingsDispatched = res;
            });

            Bookings.ongoing.get($rootScope.userToken).success(function (res) {
                $scope.bookingsOngoing = res;
            });

            Bookings.cancelled.get($rootScope.userToken).success(function (res) {
                $scope.bookingsCancelled = res;
            });
        };

        $scope.$on('authSuccess', function () {
            getBookings();
        });

        $rootScope.$broadcast('signIn');

}]);