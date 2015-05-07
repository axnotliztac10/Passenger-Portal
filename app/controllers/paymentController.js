
angular.module('blackRide').controller('paymentController', 
    [
        '$scope',
        '$rootScope',
        '$timeout',
    function(
        $scope,
        $rootScope,
        $timeout
    ) {

      var sendCard = function () {
        $rootScope.user.card = { cardBody: scope.genTok };
        $rootScope.user.flush();
        $window.Stripe.createToken(scope.genTok, function(status, response) {
          StripeProvider.save({token: response.id, default: scope.defaultCard}).success(function (res) {
            $rootScope.user.card.stripe = res;
            $rootScope.user.flush();
          });
        });
      };

      $scope.setEdit = function (val, ev) {
        ev.stopPropagation();
        $scope.activeEdit = val;
      };

      $scope.validate = function (validate, $event) {
        if (validate) {
          sendCard();
          $scope.setEdit(false, $event);
        }
      };

      $('label').click(function() {

        var el = $(this).children('span:first-child');
        el.addClass('circle');

        /*var newone = el.clone(true);
        el.before(newone);
        $("." + el.attr("class") + ":last").remove();*/
      }); 

      $scope.$on('authSuccess', function () {
        if ($rootScope.user.card && $rootScope.user.card.cardBody) {
          $scope.genTok = $rootScope.user.card.cardBody;
        }
        $scope.viewData = true;
      });

      $rootScope.$broadcast('signIn');

    }]);
