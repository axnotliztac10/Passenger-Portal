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
        'localStorageService',
        '$timeout',
        '$state',
    function (
        $rootScope,
        $scope,
        Facebook,
        $modal,
        GooglePlus,
        AuthFactory,
        SignupFactory,
        LogoutFactory,
        StripeProvider,
        localStorageService,
        $timeout,
        $state
    ) {
    
    $scope.$on('signIn', function (event, callBack) {
        $scope.open();

        if (callBack) {
            callBack();
        }
    });

    $scope.$on('fbSign', function () {
        $scope.getFbLog();
    });

    $scope.$on('gSign', function () {
        $scope.getGLog();
    });

    $scope.$on('logOut&In', function () {
        $scope.logout(true);
        $scope.open();
    })

    $scope.logout = function (noConfirm) {
        var c = noConfirm || confirm('Confirm Logout');
        if (c) {
            $scope.nickname = null;
            var booking = angular.copy($rootScope.user.booking);
            $rootScope.user = {
                booking: ($state.current.name == 'drop') ? booking : {},
                token: 'none',
                flush: function () {
                    localStorageService.set('user', $rootScope.user);
                }
            };
            localStorageService.remove('user');
            $rootScope.$broadcast('loggedOut');
        }
    };

    $scope.open = function () {

        if ($rootScope.isLoggedIn()) {
            $rootScope.$broadcast('authSuccess');
            //Logout ux
            return;
        }

        var modalInstance = $modal.open({
            templateUrl: 'modalConfirm.html',
            controller: 'modalConfirm',
            size: 'sm',
            resolve: {
                info: function () {
                    return {};
                }
            },
            backdrop: 'static',
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
                $rootScope.user.full_name = $scope.nickname = user.name;
                $rootScope.user.first_name = user.given_name;
                $rootScope.user.last_name = user.family_name;
                $rootScope.user.picture = $scope.picture =  user.picture;
                $scope.loggedIn = true;
                $scope.sendResponse();
            });
        }, function (err) {
            console.log(err);
        });
    };

    $scope.fbMe = function(token) {
        Facebook.api('/me', function(response) {
            $rootScope.user.auth_origin_name = 'facebook';
            $rootScope.user.auth_origin_entity_id = response.id;
            $rootScope.user.auth_origin_oauth_token = token;
            $rootScope.user.first_name = response.first_name;
            $rootScope.user.last_name = response.last_name;
            $rootScope.user.full_name = $scope.nickname = response.name;
            Facebook.api(response.id + '/picture', function (photosRes) {
                $rootScope.user.picture = $scope.picture = photosRes.data.url;
            });
            $scope.loggedIn = true;
            $scope.sendResponse();
        });
    };

    $scope.sendResponse = function (res) {
        if ($scope.loggedIn) {
            SignupFactory.save(angular.copy($rootScope.user)).success(function (res) {
                $rootScope.user.passenger = res.passenger;
                $rootScope.user.token = res.token;
                $rootScope.user.flush();
                $rootScope.addAlert('success','Login successfully.');
                $rootScope.$broadcast('authSuccess');
            });
        } else {
            $rootScope.$broadcast('authFailed');
        }
    };

    $rootScope.addAlert = function (type, msg) {
        $scope.alertStyle = {display: 'block'};
        $scope.alerts = [{
            type: type,
            msg: msg
        }];
        $timeout(function () {
            $scope.alerts = [];
            $scope.alertStyle = {};
        }, 5000);
    }

    $rootScope.isLoggedIn = function () {
        return localStorageService.get('user');
    };

    $rootScope.user = {
        booking: {},
        token: 'none'
    };

    var init = function () {
        if ($rootScope.isLoggedIn()) {
            $rootScope.user = localStorageService.get('user');
            $scope.nickname = $rootScope.user.full_name;
            $scope.picture = $rootScope.user.picture;
        }

        if (!$rootScope.user.flush) {
            $rootScope.user.flush = function () {
                localStorageService.set('user', $rootScope.user);
            }
        }
    };

    init();

}]);
