angular.module('blackRide', ['ngResource', 'ui.bootstrap','ui.router','ngAnimate', 'google-maps', 'ui.slider', 'facebook', 'googleplus', 'LocalStorageModule']);

angular.module('blackRide')
    .constant("HOST", "http://localhost:9001/")
    .constant("API_HOST", "http://private-aa499-shifttravellerapi.apiary-mock.com")
    .config(function($stateProvider, $urlRouterProvider, $provide, datepickerConfig, FacebookProvider, GooglePlusProvider, localStorageServiceProvider) {

    FacebookProvider.init('279962268844155');
    
    GooglePlusProvider.init({
        clientId: '379648358992-n7i7he2jsopkqldmiuktafkmd0llfdro.apps.googleusercontent.com',
        apiKey: 'AIzaSyCZlO96pgQ31KmpPS7cBTPjA17YIs8YNkY'
     });

    localStorageServiceProvider.setPrefix('blackRide');

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

angular.module("blackRide").run(function ($rootScope) {

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

angular.module('blackRide').controller('modalDriver', function ($scope, $modalInstance, driver) {

  $scope.driver = driver;
  $scope.ok = function () {
    $modalInstance.close(driver);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

angular.module('blackRide').controller('modalConfirm', function ($rootScope, $scope, $modalInstance, info) {

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
