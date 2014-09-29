angular.module('darkRide', ['ui.bootstrap','ui.router','ngAnimate', 'google-maps', 'ui.slider']);

angular.module('darkRide')
    .constant("HOST", "http://54.68.30.59:9999/")
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

    $stateProvider.state('driver', {
        url: '/driver',
        controller: 'driverController',
        templateUrl: './views/driver.html',
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

angular.module('darkRide').controller('homeController', ['$scope', '$window', '$state', 'HOST', function($scope, $window, $state, HOST) {

    $scope.geoCoder = new $window.google.maps.Geocoder();
    $scope.markers = [];
    $scope.address = "";
    $scope.ajaxLoader = false;
    
    $scope.map = {
        control: {},
        active: false,
        center: {
            latitude: 51.219053,
            longitude: 4.404418
        },
        refresh: true,
        zoom: 14,
        events: {
            idle: function (res, res1) {
                var pos = $scope.position;

                $scope.markers.push({
                    icon: HOST + 'assets/imgs/pick_me.png',
                    options: { draggable: true },
                    latitude: pos.lat,
                    longitude: pos.lon,
                    title: "m0",
                    id: 0
                });

                $scope.map.control.refresh({
                    latitude: pos.lat, 
                    longitude: pos.lon
                });

                $window.google.maps.event.clearListeners(res, 'idle');
            }
        }
    };

    $scope.markersEvents = {
        click: function (gMarker, eventName, model) {
            $state.go('time');
        },
        dragend: function (gMarker) {
            var pos = gMarker.getPosition();
            $scope.getAddress(pos.k, pos.B);
        }
    };

    $scope.getAddress = function (lat, lon) {
        var latlng = new $window.google.maps.LatLng(lat, lon);
        $scope.geoCoder.geocode({'latLng': latlng}, function (results, status) {
            if (status === $window.google.maps.GeocoderStatus.OK && results[0]) {
                $scope.$apply(function () {
                    $scope.ajaxLoader = true;
                    $scope.address = results[0].formatted_address;
                });
            }
        });
    };

    $scope.setMapData = function (res) {
        $scope.map.active=true;

        $scope.markers.push({
            icon: HOST + 'assets/imgs/pick_me.png',
            options: { draggable: true },
            latitude: res.coords.latitude,
            longitude: res.coords.longitude,
            title: "m0",
            id: 0
        });

        $scope.map.control.refresh({
            latitude: res.coords.latitude, 
            longitude: res.coords.longitude
        });
    };

    $scope.getActualAdd = function () {
        $window.navigator.geolocation.getCurrentPosition(function (res) {
            $scope.getAddress(res.coords.latitude, res.coords.longitude);
            $scope.position = {
                lat: res.coords.latitude,
                lon: res.coords.longitude
            };
        });
    };

    $scope.init = function () {
        $scope.getActualAdd();
    };

    $scope.init();

}]);

angular.module('darkRide').controller('timeController', ['$scope', function($scope) {
    $scope.timeToPick = new Date();
    $scope.ismeridian = false;
    $scope.format = 'dd-MMMM-yyyy';
    $scope.dt = null;
}]);

angular.module('darkRide').controller('driverController', ['$scope', function($scope) {
        $scope.filterRate = 0;
        $scope.max = 5;
        $scope.isReadonly = false;
        $scope.minPrice = 10;
        $scope.maxPrice = 50;
        $scope.minTime = 10;
        $scope.maxTime = 50;

        $scope.drivers = [
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'Alexa Smith',
                model: 'Tesla S',
                photo: './assets/imgs/faces/13.jpg',
                rate: 3,
                time: 10,
                price: 30
            },
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'Peter Smith',
                model: 'BMW 251i',
                photo: './assets/imgs/faces/15.jpg',
                rate: 3,
                time: 12,
                price: 17
            },
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'John gMarker',
                model: 'Audi A3',
                photo: './assets/imgs/faces/30.jpg',
                rate: 3,
                time: 20,
                price: 30
            },
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'John Smith',
                model: 'Tesla S',
                photo: './assets/imgs/faces/47.jpg',
                rate: 3,
                time: 34,
                price: 45
            }
        ];
}]);
