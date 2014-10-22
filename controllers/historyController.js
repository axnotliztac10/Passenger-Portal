angular.module('blackRide').controller('historyController', 
    [
        '$scope',
        '$modal',
        '$rootScope',
        '$state',
    function(
        $scope,
        $modal,
        $rootScope,
        $state
    ) {

        $scope.els = [
            {
                departure: 'Mission St. 125',
                destiny: 'Oak St',
                date: '2014-04-11',
                price: 24
            },
            {
                departure: 'Mission St. 125',
                destiny: 'Oak St',
                date: '2014-04-12',
                price: 79
            },
            {
                departure: 'Mission St. 125',
                destiny: 'other address',
                date: '2014-04-13',
                price: 23
            }
        ];

        $scope.sorts = [
            {value: "date", label: "Time"},
            {value: "price", label: "Price"}
        ];

        $scope.sort = $scope.sorts[0];
}]);