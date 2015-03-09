
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


      $scope.setEdit = function (val, ev) {
        ev.stopPropagation();

        $rootScope.$broadcast('signIn', function () {
          $scope.activeEdit = val;
        });
      };

      $('label').click(function() {

        var el = $(this).children('span:first-child');
        el.addClass('circle');

        /*var newone = el.clone(true);
        el.before(newone);
        $("." + el.attr("class") + ":last").remove();*/
      }); 

    }]);
