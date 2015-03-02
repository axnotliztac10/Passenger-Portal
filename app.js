angular.module(
  'blackRide',
  [
    'ngResource',
    'ui.bootstrap',
    'ui.router',
    'ngAnimate',
    'google-maps',
    'ui.slider',
    'facebook',
    'googleplus',
    'LocalStorageModule'
  ]
);

angular.module('blackRide')
    .constant("HOST", "http://shiftportal.s3-website-us-east-1.amazonaws.com/")
    .constant("API_HOST", "http://private-063a2-zoltangiber.apiary-mock.com")
    .config(function(
      $stateProvider,
      $urlRouterProvider,
      $locationProvider,
      datepickerConfig,
      FacebookProvider,
      GooglePlusProvider,
      localStorageServiceProvider
    ) {

    FacebookProvider.init('617137985097004');
    
    GooglePlusProvider.init({
        clientId: '644096460143-5evkaal3iej4kkp3pq36hisfngjb10s0.apps.googleusercontent.coma',
        apiKey: 'AIzaSyCC5Zs_D1q-RJy3I8hbDk6xxDuNlHZQS_s'
     });

    localStorageServiceProvider.setPrefix('blackRide');

    datepickerConfig.showWeeks = false;

    $stateProvider.state('home', {
        url: '/home',
        controller: 'homeController',
        templateUrl: 'app/views/home.html'
    });

    $stateProvider.state('time', {
        url: '/time',
        controller: 'timeController',
        templateUrl: 'app/views/time.html'
    });

    $stateProvider.state('drop', {
        url: '/drop',
        controller: 'dropController',
        templateUrl: 'app/views/drop.html'
    });

    $stateProvider.state('driver', {
        url: '/driver',
        controller: 'driverController',
        templateUrl: 'app/views/driver.html',
    });

    $stateProvider.state('confirm', {
        url: '/confirm',
        controller: 'confirmController',
        templateUrl: 'app/views/confirm.html'
    });

    $stateProvider.state('history', {
        url: '/history',
        controller: 'historyController',
        templateUrl: 'app/views/history.html'
    });

    $stateProvider.state('organizations', {
        url: '/organizations',
        controller: 'organizationsController',
        templateUrl: 'app/views/organizations.html'
    });

    $stateProvider.state('payment', {
        url: '/payment',
        controller: 'paymentController',
        templateUrl: 'app/views/payment.html'
    });

    $urlRouterProvider.otherwise('/home');
    //$locationProvider.html5Mode(true);

});

angular.module("blackRide").run(function ($rootScope, $state) {

    var menuListener = function () {
        $('.menuOpen').off("click").on("click", function() {
            $menu = $('#menu'), $scope = $(this);
            if ($menu.css("display") == "block") {
              if (angular.isDefined($scope.attr('bot'))) {
                setTimeout(function () {$menu.css("top", "auto")}, 800);
              }
            } else {
              if (angular.isDefined($scope.attr('bot'))) $menu.css("top", $scope.attr('bot') + "px");
            }
            $menu.fadeToggle('fast', function () {
                $menu.toggleClass('show-nav');
            });
        });
    };

    var lightListener = function (scope) {
      var closure = function (scope) {
        $scope = $(scope), elements = $scope.attr("light").split(",");
        $("[light]").removeClass("lightDot");
        angular.forEach(elements, function (v, i) {
          $("[ui-sref='" + v + "']").addClass("lightDot");
        });
      };

      /*if (scope == "history" || scope == "organizations" || scope == "payment") {
        $("#status-buttons").hide();
        return;
      } else {
        $("#status-buttons").show();
      }*/

      if (scope) {
        closure("[ui-sref='" + scope + "']");
      } else { 
        $("[light]").on("click", function () {
          closure(this);
        });
      }
    };

    $rootScope.$on('$stateChangeSuccess', function () {
        lightListener($state.current.name);
    });

    $rootScope.$on('$locationChangeSuccess', function () {
        menuListener();
    });

    $(window).load(function () {
      menuListener();
    });
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

angular.module('blackRide').filter('getCustomDate', function() {
  return function(item) {
    var date = new Date(item);
      switch (date.getDay()) {
          case 0:
              day = "Sunday";
          break;
          case 1:
              day = "Monday";
          break;
          case 2:
              day = "Tuesday";
          break;
          case 3:
              day = "Wednesday";
          break;
          case 4:
              day = "Thursday";
          break;
          case 5:
              day = "Friday";
          break;
          case 6:
              day = "Saturday";
          break;
      }

      return day + ", " + item;
  };
});
