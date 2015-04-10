
angular.module('blackRide').controller('organizationsController', 
    [
        '$scope',
        '$rootScope',
        '$timeout',
        'Organisations',
    function(
        $scope,
        $rootScope,
        $timeout,
        Organisations
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

        $scope.saveAddress = function () {
            $scope.ajaxLoader = true;
            $timeout(function() {
                $scope.editAddress = false;
                $scope.ajaxLoader = false;
            }, 400);
        };

        $scope.$on('authSuccess', function () {
            Organisations.get().success(function (res) {
                $scope.organisation = res[0];
            });
        });
            
        $rootScope.$broadcast('signIn');
    }]);