
angular.module('darkRide').controller('homeController', 
    [
        '$rootScope',
        '$scope',
        '$window',
        '$state', 
        'HOST', 
    function(
        $rootScope,
        $scope,
        $window,
        $state, 
        HOST
    ) {

    $scope.geoCoder = new $window.google.maps.Geocoder();
    $scope.address = "";
    $scope.details = "";
    $scope.options = null;
    $scope.ajaxLoader = false;
    $scope.searchResults = [];
    $scope.markersCtr = {};

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
            idle: function (res) {
                $scope.centerMap({lat: res.center.k, lon: res.center.B}, false);
                $window.google.maps.event.clearListeners(res, 'idle');
            },
            dragstart: function (res) {
                $scope.setIcon('dragging');
            },
            dragend: function (res) {
                var pos = $scope.map.control.getGMap().getCenter();
                $scope.markersCtr.getGMarkers()[0].setVisible(true);
                $scope.getAddress(pos.k, pos.B, function () {$scope.setIcon('pick_me')});
                $scope.ajaxLoader = false;
            },
            drag: function (res) {
                if ($(window).width() <= 320) {
                    $scope.markersCtr.getGMarkers()[0].setVisible(false);
                } else {
                    $scope.markersCtr.getGMarkers()[0].setPosition($scope.map.control.getGMap().getCenter());
                }
            },
            center_changed: function (res) {
                if (angular.isDefined($scope.markersCtr.getGMarkers()[0])) {
                    $scope.markersCtr.getGMarkers()[0].setPosition($scope.map.control.getGMap().getCenter());
                }
            }
        }
    };

    $scope.markersEvents = {
        click: function (gMarker, eventName, model) {
            var pos = gMarker.getPosition();
            $scope.setAndGo(pos);
        }
    };

    $scope.centerMap = function (position, dirty) {
        var posit;

        if (!dirty && $scope.position) {
            posit = $scope.position;
        } else if (position) {
            posit = position;
            $scope.getAddress(posit.lat, posit.lon);
        }

        $scope.markers = [];

        $scope.markers.push({
            icon: HOST + (dirty ? 'assets/imgs/pick_me.png' : 'assets/imgs/drag.png'),
            options: { draggable: false },
            latitude: posit.lat,
            longitude: posit.lon,
            title: "m0",
            id: 0
        });

        $scope.map.control.refresh({
            latitude: posit.lat, 
            longitude: posit.lon
        });

    };

    $scope.setAndGo = function (pos) {
       $rootScope.user.departureData.position.lat = pos.k ? pos.k : pos.lat;
       $rootScope.user.departureData.position.lon = pos.B ? pos.B : pos.lon;
       $rootScope.user.departureData.address = $scope.address;
        $state.go('time');
    };

    $scope.getAddress = function (lat, lon, call) {

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
                    if (angular.isDefined(call)) call();
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

        function displayError(error) {
          var errors = { 
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
          };

          $scope.map.active = true;
          $scope.$apply();
          //alert("Error: " + errors[error.code]);
        }

        if ($window.navigator.geolocation) {
            $window.navigator.geolocation.getCurrentPosition(function (res) {
                $scope.getAddress(res.coords.latitude, res.coords.longitude);
            }, displayError ,{
                enableHighAccuracy: false,
                timeout: 60000,
                maximumAge: 0
            });
        } else {
            $scope.map.active = true;
            $scope.$apply();
            //alert("Geolocation is not supported by this browser");
        }
    };

    $scope.setIcon = function (type) {
        $scope.markersCtr.getGMarkers()[0].setIcon(HOST + 'assets/imgs/' + type + '.png');
    }

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
