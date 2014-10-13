angular.module('darkRide', ['ui.bootstrap','ui.router','ngAnimate', 'google-maps', 'ui.slider', 'ngAutocomplete']);

angular.module('darkRide')
    .constant("HOST", "http://localhost:9001/")
    .config(function($stateProvider, $urlRouterProvider, $provide, datepickerConfig) {

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

angular.module('darkRide').controller('modalDriver', function ($scope, $modalInstance, driver) {

  $scope.driver = driver;
  $scope.ok = function () {
    $modalInstance.close(driver);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

angular.module('darkRide').controller('modalConfirm', function ($scope, $modalInstance, info) {

  $scope.ok = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

$(function() {
    $('.menuOpen').click(function() {
        toggleNav();
    });
});

function toggleNav() {
    $menu = $('#menu');
    $menu.fadeToggle('fast', function () {
        $menu.toggleClass('show-nav');
    });
}