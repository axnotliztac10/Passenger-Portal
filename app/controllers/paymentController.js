
angular.module('blackRide').controller('paymentController', 
    [
        '$scope',
        '$rootScope',
        '$timeout',
    function(
        $scope,
        $rootScope,
        $timeout
    ) {


        $scope.setEdit = function (val, ev) {
            ev.stopPropagation();

            $timeout(function () {
                $scope.activeEdit = val;
            }, 100);
        };

    }]);
