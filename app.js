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
    'LocalStorageModule',
    'famous.angular'
  ]
);

angular.module('blackRide')
    //.constant("HOST", "http://127.0.0.1:9001/")
    .constant("HOST", "http://shiftportal.s3-website-us-east-1.amazonaws.com/")
    .constant("API_HOST", "http://shift-dev.appspot.com/1.0/passenger")
    .config(function(
      $stateProvider,
      $urlRouterProvider,
      $locationProvider,
      datepickerConfig,
      FacebookProvider,
      GooglePlusProvider,
      localStorageServiceProvider
    ) {

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

    $stateProvider.state('organizations', {
        url: '/organizations',
        controller: 'organizationsController',
        templateUrl: './views/organizations.html'
    });

    $stateProvider.state('payment', {
        url: '/payment',
        controller: 'paymentController',
        templateUrl: './views/payment.html'
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

      if (scope == "history" || scope == "organizations") {
        $("#status-buttons").hide();
        return;
      } else {
        $("#status-buttons").show();
      }

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
