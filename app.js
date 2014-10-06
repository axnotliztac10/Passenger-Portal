angular.module('darkRide', ['ui.bootstrap','ui.router','ngAnimate', 'google-maps', 'ui.slider']);

angular.module('darkRide')
    .constant("HOST", "http://localhost:9001/")
    .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
        url: '/home',
        controller: 'homeController',
        templateUrl: './views/home.html',
    });

    $stateProvider.state('time', {
        url: '/time',
        controller: 'timeController',
        templateUrl: './views/time.html',
    });

    $stateProvider.state('drop', {
        url: '/drop',
        controller: 'dropController',
        templateUrl: './views/drop.html',
    });

    $stateProvider.state('driver', {
        url: '/driver',
        controller: 'driverController',
        templateUrl: './views/driver.html',
    });

    $stateProvider.state('confirm', {
        url: '/confirm',
        controller: 'confirmController',
        templateUrl: './views/confirm.html',
    });

    $urlRouterProvider.otherwise('/home');

});

angular.module('darkRide').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
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

angular.module('darkRide').controller('modalConfirm', function ($scope, $modalInstance, info) {

  $scope.ok = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

angular.module('darkRide').directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {

      elm.bind('keyup', function() {
        scope.$apply(function() {
          ctrl.$setViewValue(elm.text());
        });
      });

      ctrl.$render = function() {
        elm.text(ctrl.$viewValue);
      };
    }
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