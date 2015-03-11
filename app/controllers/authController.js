angular.module('blackRide').controller('authController', [
        '$rootScope',
        '$scope',
        'Facebook',
        '$modal',
        'GooglePlus',
        'AuthFactory',
        'AuthResponse',
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
        AuthResponse,
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

    $scope.$on('signResponse', function (event, reqObj) {
        SignupFactory.save(reqObj.body).then(function (res) {
                //AuthResponse.fillPassenger(res);
                //$rootScope.user.setAuthResponse(AuthResponse);
            $rootScope.userToken = res.data.token.value;
        });
    });

    $scope.$on('loginResponse', function (event, reqObj) {
        AuthFactory.save(reqObj.body).then(function (res) {
                //AuthResponse.fillPassenger(res);
                //$rootScope.user.setAuthResponse(AuthResponse);
            $rootScope.userToken = res.data.token.value;
        });

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
                var fbRes = new UserFactory();
                fbRes.setAuth_origin_name("gplus");
                fbRes.setAuth_origin_entity_id(user.id);
                fbRes.setAuth_origin_oauth_token(token);
                $scope.sendResponse(fbRes.getSerialized());
            });
        }, function (err) {
            console.log(err);
        });
    };

    $scope.fbMe = function(token) {
        Facebook.api('/me', function(response) {
            var fbRes = new UserFactory();
            fbRes.setAuth_origin_name("facebook");
            //fbRes.setAuth_origin_entity_id(response.id);
            fbRes.setAuth_origin_oauth_token(token);
            fbRes.setFirst_name(response.first_name);
            fbRes.setLast_name(response.last_name);
            fbRes.setFull_name(response.full_name);
            $scope.sendResponse(fbRes.getSerialized());
        });
    };

    $scope.sendResponse = function (res) {
        if ($scope.loggedIn) {
            $rootScope.$broadcast("loginResponse", {body: res});
        } else {
            $rootScope.$broadcast("signResponse", {body: res});
        }

    };

    var UserFactory = function () {
        
        var scope = {
            auth_origin_name: null,
                //auth_origin_entity_id: null,
            auth_origin_oauth_token: null,
            full_name: null,
            first_name: null,
            last_name: null,
            mobile_phone_number: null,
                /*fleet: {
                    id: 4768254505517056
                }*/
        };

        this.setAuth_origin_name = function (auth_origin_name) { scope.auth_origin_name = auth_origin_name; } 
        this.getAuth_origin_name = function () { return scope.auth_origin_name; } 
        this.setAuth_origin_entity_id = function (auth_origin_entity_id) { scope.auth_origin_entity_id = auth_origin_entity_id; } 
        this.getAuth_origin_entity_id = function () { return scope.auth_origin_entity_id; } 
        this.setAuth_origin_oauth_token = function (auth_origin_oauth_token) { scope.auth_origin_oauth_token = auth_origin_oauth_token; } 
        this.getAuth_origin_oauth_token = function () { return scope.auth_origin_oauth_token; } 
        this.setFleet = function (fleet) { scope.fleet.id = fleet; } 
        this.getFleet = function() { return scope.fleet.id; }
        this.setMobile_phone_number = function (mobile_phone_number) { scope.mobile_phone_number = mobile_phone_number; } 
        this.getMobile_phone_number = function() { return scope.mobile_phone_number; }
        this.setFirst_name = function (first_name) { scope.first_name = first_name; } 
        this.getFirst_name = function() { return scope.first_name; }
        this.setLast_name = function (last_name) { scope.last_name = last_name; } 
        this.getLast_name = function() { return scope.last_name; }
        this.setFull_name = function (full_name) { scope.full_name = full_name; } 
        this.getFull_name = function() { return scope.full_name; }
        this.getSerialized = function () { return scope; }
    };
}]);
