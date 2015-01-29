
angular.module('blackRide').controller('organizationsController', 
    [
        '$scope',
        '$rootScope',
        '$state',
    function(
        $scope,
        $rootScope,
        $state
    ) {

        $scope.as = [
            {child: [0,1]},
            {child: [0]},
            {child: [0,1]}
        ];

    }]);