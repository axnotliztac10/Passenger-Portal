angular.module('darkRide', ['ui.bootstrap','ui.router','ngAnimate', 'google-maps', 'ui.slider', 'ngAutocomplete', 'facebook', 'googleplus']);

angular.module('darkRide')
    .constant("HOST", "http://54.68.30.59:9001/")
    .config(function($stateProvider, $urlRouterProvider, $provide, datepickerConfig, FacebookProvider, GooglePlusProvider) {

    FacebookProvider.init('279962268844155');
    GooglePlusProvider.init({
        clientId: '6buDZz7dhdRLWwdVhZKslTKn',
        apiKey: 'AIzaSyBZ7fUKs7wkyO83FrbCBaWx8lQHBoT3big'
     });
    datepickerConfig.showWeeks = false;

    $stateProvider.state('home', {
        url: '/home',
        controller: 'homeController',
        templateUrl: './views/home.html'
    });

    $stateProvider.state('time', {
        url: '/time',
        controller: 'timeController',
        templateUrl: './views/time.html'
    });

    $stateProvider.state('drop', {
        url: '/drop',
        controller: 'dropController',
        templateUrl: './views/drop.html'
    });

    $stateProvider.state('driver', {
        url: '/driver',
        controller: 'driverController',
        templateUrl: './views/driver.html',
    });

    $stateProvider.state('confirm', {
        url: '/confirm',
        controller: 'confirmController',
        templateUrl: './views/confirm.html'
    });

    $stateProvider.state('history', {
        url: '/history',
        controller: 'historyController',
        templateUrl: './views/history.html'
    });

    $urlRouterProvider.otherwise('/home');

});

angular.module("darkRide").run(function ($rootScope) {

    var menuListener = function () {

        $('.menuOpen').off("click").on("click", function() {
            $menu = $('#menu');
            $menu.fadeToggle('fast', function () {
                $menu.toggleClass('show-nav');
            });
        });
    };

    $rootScope.$on('$locationChangeSuccess', function () {
        menuListener();
    });

    menuListener();
});

angular.module('darkRide').controller('authController', function($rootScope, $scope, Facebook, $modal, GooglePlus) {
    
    $scope.$on('signIn', function () {
        $scope.open();
    });

    $scope.$on('fbSign', function () {
        $scope.getFbLog();
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
                $scope.fbMe();
            }
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

});

angular.module('darkRide').controller('modalDriver', function ($scope, $modalInstance, driver) {

  $scope.driver = driver;
  $scope.ok = function () {
    $modalInstance.close(driver);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

angular.module('darkRide').controller('modalConfirm', function ($rootScope, $scope, $modalInstance, info) {

  $scope.fb = function () {
    $rootScope.$broadcast("fbSign");
  };

  $scope.g = function () {
    $rootScope.$broadcast("gSign");
  };

  $scope.ok = function (user) {
    $modalInstance.close(user);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.$on("signResponse", function (event, args) {
    $scope.ok();
  });

});
