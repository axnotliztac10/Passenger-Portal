
angular.module('blackRide').controller('authController', ['$rootScope', '$scope', 'Facebook', '$modal', 'GooglePlus', 'AuthFactory', function ($rootScope, $scope, Facebook, $modal, GooglePlus, AuthFactory) {
    
    $scope.$on('signIn', function () {
        $scope.open();
    });

    $scope.$on('fbSign', function () {
        $scope.getFbLog();
    });

    $scope.$on('gSign', function () {
        $scope.getGLog();
    });

    $scope.$on('signResponse', function (event, reqObj) {
        AuthFactory.save(reqObj.body);
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


    $scope.getFbStatus = function () {
        Facebook.getLoginStatus(function(response) {
            if(response.status === 'connected') {
                $scope.loggedIn = true;
            } else {
                $scope.loggedIn = false;
            }
        });
    };

    $scope.fbMe = function(token) {
        Facebook.api('/me', function(response) {
            var fbRes = new UserFactory();
            fbRes.setAuth_origin_name("facebook");
            fbRes.setAuth_origin_entity_id(response.id);
            fbRes.setAuth_origin_oauth_token(token);
            $scope.sendResponse(fbRes.getSerialized());
        });
    };

    $scope.sendResponse = function (res) {
        $rootScope.$broadcast("signResponse", {body: res});
    };

    var UserFactory = function () {
        
        var scope = {
            auth_origin_name: null,
            auth_origin_entity_id: null,
            auth_origin_oauth_token: null,
            fleet: {
                id: 4768254505517056
            }
        };

        this.setAuth_origin_name = function (auth_origin_name) { scope.auth_origin_name = auth_origin_name; } 
        this.getAuth_origin_name = function () { return scope.auth_origin_name; } 
        this.setAuth_origin_entity_id = function (auth_origin_entity_id) { scope.auth_origin_entity_id = auth_origin_entity_id; } 
        this.getAuth_origin_entity_id = function () { return scope.auth_origin_entity_id; } 
        this.setAuth_origin_oauth_token = function (auth_origin_oauth_token) { scope.auth_origin_oauth_token = auth_origin_oauth_token; } 
        this.getAuth_origin_oauth_token = function () { return scope.auth_origin_oauth_token; } 
        this.setFleet = function (fleet) { scope.fleet.id = fleet; } 
        this.getFleet = function() { return scope.fleet.id; }
        this.getSerialized = function () { return scope;}
    };
}]);