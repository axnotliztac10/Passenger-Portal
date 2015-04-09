angular.module('blackRide').directive('stripeForm', function ($window, $rootScope, StripeProvider) {
    var directive = { restrict: 'A' };
    directive.link = function(scope, element, attributes) {
      var form = angular.element(element);
      
      $(form[0]).find('.nextStep > a').bind('click', function () { 
        $window.Stripe.createToken(scope.genTok, function(status, response) {
          StripeProvider.save({token: response.id, default: scope.defaultCard}).then(function (res) {
            console.log(res.data);
          });
        });
      });
    };
    return directive;
  });

angular.module("blackRide").directive('ngAutocomplete', function($parse) {
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
            scope.$parent.centerMap({lat: scope.details.geometry.location.lat(), lon: scope.details.geometry.location.lng()}, true);
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

