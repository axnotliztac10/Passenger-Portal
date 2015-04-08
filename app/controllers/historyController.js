angular.module('blackRide').controller('historyController', 
    [
        '$scope',
        '$modal',
        '$rootScope',
        '$state',
        'BookingsFactory',
        '$timeout',
    function(
        $scope,
        $modal,
        $rootScope,
        $state,
        BookingsFactory,
        $timeout
    ) {

        $scope.sorts = [
            {value: "date", label: "Time"},
            {value: "price", label: "Price"}
        ];

        $scope.sort = $scope.sorts[0];


        $rootScope.$broadcast('signIn');

        $scope.$on('authSuccess', function () {
            BookingsFactory.get($rootScope.userToken).success(function (res) {
                $scope.bookingsDone = res;
            });
        });

}]);