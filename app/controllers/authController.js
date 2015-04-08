angular.module('blackRide').controller('authController', [
        '$rootScope',
        '$scope',
        'Facebook',
        '$modal',
        'GooglePlus',
        'AuthFactory',
        'SignupFactory',
        'LogoutFactory',
        'StripeProvider',
    function (
        $rootScope,
        $scope,
        Facebook,
        $modal,
        GooglePlus,
        AuthFactory,
        SignupFactory,
        LogoutFactory,
        StripeProvider
    ) {
    
    $scope.$on('signIn', function (event, callBack) {
        $scope.open();
        if (callBack) {
            callBack();
        }
    });

    $scope.$on('fbSign', function () {
        $scope.getFbLog();
        Facebook.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                $scope.loggedIn = true;
            } else if (response.status === 'not_authorized') {
                $scope.loggedIn = false;
            } else if (response.status === 'unknown') {
                $scope.loggedIn = false;
            }

            $scope.getFbLog();
        });
    });

    $scope.$on('gSign', function () {
        $scope.getGLog();
    });

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
                $scope.fbMe(response.authResponse.accessToken);
            }
        },{
                scope: 'public_profile,email'
            });
    };

    $scope.getGLog = function () {
        GooglePlus.login().then(function (authResult) {
            var token = authResult.access_token;
            GooglePlus.getUser().then(function (user) {
                $rootScope.user.auth_origin_name = 'gplus';
                $rootScope.user.auth_origin_entity_id = user.id;
                $rootScope.user.auth_origin_oauth_token = token;

                $scope.sendResponse();
            });
        }, function (err) {
            console.log(err);
        });
    };

    $scope.fbMe = function(token) {
        Facebook.api('/me', function(response) {
            $rootScope.user.auth_origin_name = 'facebook';
            //$rootScope.user.setAuth_origin_entity_id = response.id;
            $rootScope.user.auth_origin_oauth_token = token;
            $rootScope.user.first_name = response.first_name;
            $rootScope.user.last_name = response.last_name;
            $rootScope.user.full_name = response.full_name;

            $scope.sendResponse();
        });
    };

    $scope.sendResponse = function (res) {
        if ($scope.loggedIn) {
            (function () {
                SignupFactory.save(angular.copy($rootScope.user)).success(function (res) {
                    $rootScope.user.passenger = res.passenger;
                    $rootScope.user.token = res.token;
                    $rootScope.$broadcast('authSuccess');
                });
            })();
        } else {
            $rootScope.$broadcast('authFailed');
        }
    };

    $rootScope.user = {
        booking: {}
    };

}]);
