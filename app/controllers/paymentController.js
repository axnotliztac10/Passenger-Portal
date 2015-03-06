
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

            $timeout(function () {
                $scope.activeEdit = val;
            }, 100);
        };

        $('label').click(function() {
  
  // find the first span which is our circle/bubble
  var el = $(this).children('span:first-child');
  
  // add the bubble class (we do this so it doesnt show on page load)
  el.addClass('circle');
  
  // clone it
  var newone = el.clone(true);  
  
  // add the cloned version before our original
  el.before(newone);  
  
  // remove the original so that it is ready to run on next click
  $("." + el.attr("class") + ":last").remove();
}); 

    }]);
