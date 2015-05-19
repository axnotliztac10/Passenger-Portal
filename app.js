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
    'pubnub.angular.service',
    'angular-loading-bar'
  ]
);

angular.module('blackRide')
    .constant("HOST", "http://shift-portal.appspot.com/")
    .constant("API_HOST", "http://shift-passenger-api-dev.appspot.com")
    .constant('API_Key', 'dce1f7d8944bbda2eed53a8b96d8fca5a88504e53bd480fe4b55026073fd53e9')
    .config(function(
      $stateProvider,
      $urlRouterProvider,
      $locationProvider,
      datepickerConfig,
      FacebookProvider,
      GooglePlusProvider,
      localStorageServiceProvider,
      $httpProvider,
      cfpLoadingBarProvider
    ) {

    Stripe.setPublishableKey('pk_test_NdgelnceB9gAkiWX2vYJtTql');
    FacebookProvider.init('649096295216181');
    
    GooglePlusProvider.init({
        clientId: '644096460143-5evkaal3iej4kkp3pq36hisfngjb10s0.apps.googleusercontent.com',
        apiKey: 'AIzaSyCC5Zs_D1q-RJy3I8hbDk6xxDuNlHZQS_s'
     });

    localStorageServiceProvider.setPrefix('portal_');

    datepickerConfig.showWeeks = false;
    cfpLoadingBarProvider.includeSpinner = false;

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
        abstract: true,
        url: '/confirm',
        template: '<div ui-view></div>'
    });

    $stateProvider.state('confirm.driver', {
        url: '/driver',
        controller: 'confirmController',
        templateUrl: 'app/views/confirm-driver.html'
    });

    $stateProvider.state('confirm.model', {
        url: '/model',
        controller: 'confirmModelController',
        templateUrl: 'app/views/confirm-model.html'
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

    $stateProvider.state('about', {
        url: '/about',
        controller: 'aboutController',
        templateUrl: 'app/views/about.html'
    });

    $urlRouterProvider.otherwise('/home');
    //$locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('myHttpInterceptor');

});

angular.module("blackRide").run(function ($rootScope, $state) {

    var closeOnOpen = function () {
        $('#menu').removeClass('show-nav');
        //$('#status-buttons, #on-menu-open').removeClass('menu-opened');
    };

    var menuListener = function () {
      closeOnOpen();

      $('.menuOpen').off("click").on("click", function() {
          $menu = $('#menu'), $scope = $(this);
          $menu.toggleClass('show-nav');
          //$('#status-buttons, #on-menu-open').toggleClass('menu-opened');
      });
    };

    var lightListener = function (scope) {
      closeOnOpen();

      var closure = function (scope) {
        $scope = $(scope);
        elements = ($scope.attr("light")) ? $scope.attr("light").split(",") : false;

        $("[light]").removeClass("lightDot");
        if (elements) {
          angular.forEach(elements, function (v, i) {
            $("[ui-sref='" + v + "']").addClass("lightDot");
          });
        }
      };

      if (scope == "history" || scope == "organizations" || scope == "payment" || scope == "about") {
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
        var state = $state.current.name;
        if (state.indexOf('confirm') > -1) state = 'confirm';
        lightListener(state);
    });

    $rootScope.$on('$locationChangeSuccess', function () {
        menuListener();
    });

    $(window).scroll(function () {
      if ($(window).scrollTop() > 60) {
        $('html').addClass('scroll-header');
      } else {
        $('html').removeClass('scroll-header');
      }
    });

    $(window).load(function () {
      menuListener();
      $('.hide-on-load').removeClass('hide-on-load');
      $('#menu [ui-sref]').on('click', function () {
        $('body, html').scrollTop(0);
      });
    });
});

angular.module('blackRide').controller('modalDriver', function ($scope, $modalInstance, candidate) {

  $scope.candidate = candidate;
  $scope.ok = function () {
    $modalInstance.close(candidate);
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

  $scope.$on("authSuccess", function (event, args) {
    $scope.ok();
  });

});

angular.module('blackRide').controller('menuController', function ($rootScope, $scope, Organisations) {
  $scope.organizations = false;

  var getOrg = function () {
    Organisations.get().success(function (res) {
      $scope.organizations = res.length;
    });
  };

  $scope.$on('loggedOut', function () {
    $scope.loggedIn = false;
  })

  $scope.$on('authSuccess', function () {
    $scope.loggedIn = true;
    getOrg();
  });

  if ($rootScope.isLoggedIn()) {
    $scope.loggedIn = true;
    getOrg();
  }
});

angular.module('blackRide').filter('getCustomDate', function() {
  return function(item) {
    var d = item.split('T')[0];
    var date = new Date(d);
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

      return day + ", " + d;
  };
});

angular.module('blackRide').filter('cardMask', function() {
  return function(item) {
    if (!item) {
      return '0000';
    }
    var itemStr = '' + item;
    return itemStr.substr(itemStr.length - 4);
  };
});

angular.module('blackRide').factory('myHttpInterceptor', function($q, $rootScope) {
  return {
   'responseError': function (rejection) {
      if (rejection.status == 401 && rejection.data.indexOf('client-token') != -1) {
        $rootScope.$broadcast('logOut&In');
      } else {
        $rootScope.addAlert('success', rejection.data);
      }
      return $q.reject(rejection);
    }
  };
});
