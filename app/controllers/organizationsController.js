
angular.module('blackRide').controller('organizationsController', 
    [
        '$scope',
        '$rootScope',
        '$timeout',
    function(
        $scope,
        $rootScope,
        $timeout
    ) {

        $scope.organisations = [
            {
                orgName: 'SALES DEPARTMENT',
                members: [{
                    name: 'Ryan Clark',
                    id: 15,
                    balance: {
                        billed: 60,
                        max: 100
                    }
                },
                {
                    name: 'Velma Mcdaniel',
                    id: 13,
                    balance: {
                        billed: 70,
                        max: 90
                    }
                }]
            },
            {
                orgName: 'EXECUTIVE',
                members: [{
                    name: 'George Sanchez',
                    id: 30,
                    balance: {
                        billed: 200,
                        max: 400
                    }
                },
                {
                    name: 'Samuel Morgan',
                    id: 47,
                    balance: {
                        billed: 200,
                        max: 400
                    }
                }]
            }
        ];

        $scope.billAddress = '17 James Drive Brisbane 112890 Queensland';

        $scope.saveAddress = function () {
            $scope.ajaxLoader = true;
            $timeout(function() {
                $scope.editAddress = false;
                $scope.ajaxLoader = false;
            }, 400);
        };

    }]);