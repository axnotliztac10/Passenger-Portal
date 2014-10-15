
angular.module('blackRide').controller('authController', ['$rootScope', '$scope', 'Facebook', '$modal', 'GooglePlus', function ($rootScope, $scope, Facebook, $modal, GooglePlus) {
    
    $scope.$on('signIn', function () {
        $scope.open();
    });

    $scope.$on('fbSign', function () {
        $scope.getFbLog();
    });

    $scope.$on('gSign', function () {
        $scope.getGLog();
    });

    $scope.user = {
        auth_origin_name: null,
        auth_origin_entity_id: null,
        auth_origin_oauth_token: null,
        fleet: {
            id: null
        }
    };

    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'modalConfirm.html',
            controller: 'modalConfirm',
            size: 'sm',
            resolve: {
                info: function () {
                    return {};
                }
            },
            windowClass: "driverModal"
        });

        modalInstance.result.then(function () {
            
        }, function () {
            return;
        });
    };

    $scope.getFbLog = function () {
        Facebook.login(function(response) {
            if(response.status === 'connected') {
                $scope.fbMe();
            }
        },{
                scope: 'public_profile,email'
            });
    };

    $scope.getGLog = function () {
        GooglePlus.login().then(function (authResult) {
            GooglePlus.getUser().then(function (user) {
                $rootScope.$broadcast("signResponse", {res: user});
            });
        }, function (err) {
            console.log(err);
        });
    };


    $scope.getFbStatus = function () {
        Facebook.getLoginStatus(function(response) {
            if(response.status === 'connected') {
                $scope.loggedIn = true;
            } else {
                $scope.loggedIn = false;
            }
        });
    };

    $scope.fbMe = function() {
        Facebook.api('/me', function(response) {
          $rootScope.$broadcast("signResponse", {res: response});
        });
    };

}]);