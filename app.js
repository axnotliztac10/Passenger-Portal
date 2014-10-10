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

angular.module( "ngAutocomplete", []).directive('ngAutocomplete', function($parse) {
  return {

    scope: {
      details: '=',
      ngAutocomplete: '=',
      options: '='
    },

    link: function(scope, element, attrs, model) {

      var opts

      var initOpts = function() {
        opts = {}
        if (scope.options) {
          if (scope.options.types) {
            opts.types = []
            opts.types.push(scope.options.types)
          }
          if (scope.options.bounds) {
            opts.bounds = scope.options.bounds
          }
          if (scope.options.country) {
            opts.componentRestrictions = {
              country: scope.options.country
            }
          }
        }
      }
      initOpts()

      var newAutocomplete = function() {
        scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
          scope.$apply(function() {
              scope.details = scope.gPlace.getPlace();
              scope.ngAutocomplete = element.val();
              scope.$parent.centerMap({lat: scope.details.geometry.location.k, lon: scope.details.geometry.location.B}, true);
              scope.$parent.address = element.val();
          });
        })
      }
      newAutocomplete()

      scope.watchOptions = function () {
        return scope.options
      };
      scope.$watch(scope.watchOptions, function () {
        initOpts()
        newAutocomplete()
        element[0].value = '';
        scope.ngAutocomplete = element.val();
      }, true);
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