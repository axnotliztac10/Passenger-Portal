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

angular.module('darkRide').controller('homeController', ['$rootScope', '$scope', '$window', '$state', 'HOST', function($rootScope, $scope, $window, $state, HOST) {

    $scope.geoCoder = new $window.google.maps.Geocoder();
    $scope.markers = [];
    $scope.address = "";
    $scope.ajaxLoader = false;
    $scope.searchResults = [];
    $scope.focusId = -1;

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
                    icon: HOST + 'assets/imgs/pick_me@2x.png',
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
            var pos = gMarker.getPosition();
            $scope.setAndGo(pos);
        },
        dragend: function (gMarker) {
            var pos = gMarker.getPosition();
            $scope.getAddress(pos.k, pos.B);
        }
    };

    $scope.setAndGo = function (pos) {
        $rootScope.user.departureData.position.lat = pos.k ? pos.k : pos.lat;
        $rootScope.user.departureData.position.lon = pos.B ? pos.B : pos.lon;
        $rootScope.user.departureData.address = $scope.address;
        $state.go('time');
    };

    $scope.getAddress = function (lat, lon) {

        $scope.position = {
            lat: lat,
            lon: lon
        };

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

    $scope.getActualAdd = function () {

        if (typeof $rootScope.user.departureData.position.lat != "undefined") {
            $scope.position = $rootScope.user.departureData.position;
            $scope.address = $rootScope.user.departureData.address;
            $scope.ajaxLoader = true;
            return;
        };

        $window.navigator.geolocation.getCurrentPosition(function (res) {
            $scope.getAddress(res.coords.latitude, res.coords.longitude);
        });
    };

    $scope.searchAddress = function (address) {
        $scope.address = address;
        var request = {
            location: new google.maps.LatLng($scope.position.lat, $scope.position.lon),
            radius: '5000',
            query: address
        };

        service = new google.maps.places.PlacesService($scope.map.control.getGMap());

        service.textSearch(request, function(results, status, pagination) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                return;
            }

            if (results.length > 6) results = results.slice(0,5);
            $scope.searchResults = results;
            if (pagination.hasNextPage) {
                
            }
        });
    }

    $scope.setPressedKey = function ($event) {
        angular.forEach($scope.searchResults, function (v, i) { $scope.searchResults[i].focus = false; });
        if ($event.keyCode == 40) {
            $scope.focusId++;
            $scope.searchResults[$scope.focusId].focus = true;
            $event.preventDefault();
        } else if ($event.keyCode == 38) {
            $scope.focusId--;
            $scope.searchResults[$scope.focusId].focus = true;
            $event.preventDefault();
        }
    };

    $scope.$watch('focusId', function (n) {
        if (n > 5) $scope.focusId = 0;
        if (n < 0) $scope.focusId = 5;
    });

    $scope.init = function () {

        if (typeof $rootScope.user == "undefined") {
            $rootScope.user = {
                name: "",
                departureData: { position: {}, address: {} },
                returnData: { position: {}, address: {} },
                timeData: { time: null, date: null },
                driver: {}
            }
        }

        $scope.getActualAdd();
    };

    $scope.init();

}]);

angular.module('darkRide').controller('timeController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.timeToPick = new Date();
    $scope.ismeridian = false;
    $scope.format = 'dd-MMMM-yyyy';
    $scope.dt = new Date();
    $scope.showControls = false;

    $scope.toggleMin = function() {
        $scope.minDate = new Date();
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.changed = function () {
        $rootScope.user.timeData.time = $scope.timeToPick;
    };

    $scope.$watch('dt', function(newVal, oldVal) {
        $rootScope.user.timeData.date = newVal;
    });

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.changed();
    $scope.toggleMin();
}]);

angular.module('darkRide').controller('driverController', ['$scope', '$modal', '$rootScope', '$state', function($scope, $modal, $rootScope, $state) {
        $scope.filterRate = 0;
        $scope.backFilter = 0;
        $scope.max = 5;
        $scope.isReadonly = false;
        $scope.minPrice = 10;
        $scope.maxPrice = 60;
        $scope.minTime = 10;
        $scope.maxTime = 60;

        $scope.evaluateNoChange = function (change) {
            if (change == $scope.backFilter) {
                $scope.filterRate = 0;
                $scope.backFilter = 0;
                return;
            }
            $scope.backFilter = change;
        };

        $scope.timeFilter = function (driver) {
            return (driver.time >= $scope.minTime && driver.time <= $scope.maxTime);
        };

        $scope.priceFilter = function (driver) {
            return (driver.price >= $scope.minPrice && driver.price <= $scope.maxPrice);
        };

        $scope.starFilter = function (driver) {
            if ($scope.filterRate == 0) return true;
            return (driver.rate == $scope.filterRate);
        };

        $scope.open = function (size, driver) {

            var modalInstance = $modal.open({
                templateUrl: 'modalDriver.html',
                controller: 'modalDriver',
                size: size,
                resolve: {
                    driver: function () {
                        return driver;
                    }
                },
                windowClass: "driverModal"
            });

            modalInstance.result.then(function (driver) {
                $rootScope.user.driver = driver;
                $state.go("confirm");
                }, function () {
                return;
            });
        };

        $scope.drivers = [
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'Alexa Smith',
                model: 'Tesla S',
                photo: './assets/imgs/faces/13.jpg',
                rate: 4,
                time: 10,
                price: 30,
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            },
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'Peter Smith',
                model: 'BMW 251i',
                photo: './assets/imgs/faces/15.jpg',
                rate: 2,
                time: 12,
                price: 17,
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            },
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'John gMarker',
                model: 'Audi A3',
                photo: './assets/imgs/faces/30.jpg',
                rate: 3,
                time: 20,
                price: 30,
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            },
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'John Smith',
                model: 'Tesla S',
                photo: './assets/imgs/faces/47.jpg',
                rate: 5,
                time: 34,
                price: 45,
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            }
        ];
}]);

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

angular.module('darkRide').controller('dropController', ['$rootScope', '$scope', '$window', 'HOST', '$state', function($rootScope, $scope, $window, HOST, $state) {
    
    $scope.geoCoder = new $window.google.maps.Geocoder();
    $scope.address = "GO TO MAP";
    $scope.markers = [];

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
                var pos = $rootScope.user.departureData.position;

                $scope.address = $rootScope.user.departureData.address;
                $scope.markers.push({
                    icon: HOST + 'assets/imgs/drop_me@2x.png',
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
            var pos = gMarker.getPosition();
            if ($rootScope.user.departureData.address == $scope.address) return false; 
            $rootScope.user.returnData.position.lat = pos.k;
            $rootScope.user.returnData.position.lon = pos.B;
            $rootScope.user.returnData.address = $scope.address;
            $state.go('driver');
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

}]);

angular.module('darkRide').controller('confirmController', ['$rootScope', '$scope', '$window', 'HOST', '$state', '$modal', function($rootScope, $scope, $window, HOST, $state, $modal) {

    $scope.driver = $rootScope.user.driver;
    $scope.user = $rootScope.user;
    $scope.markers = [];

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
            idle: function (map, res1) {
                var posDep = $rootScope.user.departureData.position;

                $scope.map.control.refresh({
                    latitude: posDep.lat, 
                    longitude: posDep.lon
                });

                map = $scope.map.control.getGMap();
                var bounds = map.getBounds();
                var lat_lng = new Array();
                var southWest = bounds.getSouthWest();
                var northEast = bounds.getNorthEast();
                var lngSpan = northEast.lng() - southWest.lng();
                var latSpan = northEast.lat() - southWest.lat();

                var lat = southWest.lat() + latSpan * Math.random();
                var lng = southWest.lng() + lngSpan * Math.random();

                lat_lng.push(new $window.google.maps.LatLng(lat, lng), new $window.google.maps.LatLng(posDep.lat, posDep.lon));

                var path = new $window.google.maps.MVCArray();
                var service = new $window.google.maps.DirectionsService();
                var poly = new $window.google.maps.Polyline({ map: map, strokeColor: '#4986E7' });

                $scope.markers.push({
                    icon: HOST + $scope.driver.photo.replace(".jpg", "_min.png"),
                    options: { draggable: false },
                    latitude: lat,
                    longitude: lng,
                    title: "m0",
                    id: 0
                });

                $scope.markers.push({
                    icon: HOST + 'assets/imgs/a@2x.png',
                    options: { draggable: false },
                    latitude: posDep.lat,
                    longitude: posDep.lon,
                    title: "m1",
                    id: 1
                });

                angular.forEach(lat_lng, function (v, i) {
                    if ((i + 1) < lat_lng.length) {    
                        var src = lat_lng[i];
                        var des = lat_lng[i + 1];
                        path.push(src);
                        poly.setPath(path);
                        service.route({
                            origin: src,
                            destination: des,
                            travelMode: $window.google.maps.DirectionsTravelMode.DRIVING
                        }, function (result, status) {
                            if (status == google.maps.DirectionsStatus.OK) {
                                for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                    path.push(result.routes[0].overview_path[i]);
                                }
                            }
                        });
                    }
                });

                $window.google.maps.event.clearListeners(map, 'idle');
            }
        }
    };

    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'modalConfirm.html',
            controller: 'modalConfirm',
            size: 'sm',
            resolve: {
                info: function () {
                    return {};
                }
            },
            windowClass: "driverModal"
        });

        modalInstance.result.then(function () {
            $scope.map.active = true;
            }, function () {
            return;
        });
    };

}]);

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
