
angular.module('blackRide').controller('homeController', 
    [
        '$rootScope',
        '$scope',
        '$window',
        '$state',
        'HOST',
        'QuoteFactory',
    function(
        $rootScope,
        $scope,
        $window,
        $state, 
        HOST,
        QuoteFactory
    ) {

    $scope.geoCoder = new $window.google.maps.Geocoder();
    $scope.address = "";
    $scope.details = "";
    $scope.options = null;
    $scope.ajaxLoader = false;
    $scope.searchResults = [];
    $scope.markersCtr = {};
    $scope.icons = {
        pick_me: {
            url: HOST + 'assets/imgs/pick_me@2x.png',
            scaledSize: new google.maps.Size(135, 51)
        },
        dragging: {
            url: HOST + 'assets/imgs/dragging@2x.png',
            scaledSize: new google.maps.Size(34, 51)
        },
        drag: {
            url: HOST + 'assets/imgs/drag@2x.png',
            scaledSize: new google.maps.Size(112, 49)
        }
    };

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
                $scope.centerMap({lat: res.getCenter().lat(), lon: res.getCenter().lng()}, false);
                $window.google.maps.event.clearListeners(res, 'idle');
            },
            dragstart: function (res) {
                $scope.setIcon($scope.icons['dragging']);
            },
            dragend: function (res) {
                var pos = $scope.map.control.getGMap().getCenter();
                $scope.markersCtr.getGMarkers()[0].setVisible(true);
                $scope.getAddress(pos.lat(), pos.lng(), function () {$scope.setIcon($scope.icons['pick_me'])});
                $scope.ajaxLoader = false;
            },
            drag: function (res) {
                $scope.markersCtr.getGMarkers()[0].setPosition($scope.map.control.getGMap().getCenter());
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
            icon: (dirty ? $scope.icons['pick_me'] : $scope.icons['drag']),
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
       $rootScope.user.setFrom({
            formatted_address: $scope.address,
            latitude: pos.lat && isNaN(pos.lat) ? pos.lat() : pos.lat,
            longitude: pos.lng && isNaN(pos.lng) ? pos.lng() : pos.lon
       });
       
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

        if ($rootScope.user.getFrom()) {
            $scope.position = {
                lat: $rootScope.user.getFrom().latitude,
                lon: $rootScope.user.getFrom().longitude
            };
            $scope.address = $rootScope.user.getFrom().formatted_address;
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
        $scope.markersCtr.getGMarkers()[0].setIcon(type);
    }

    $scope.init = function () {

        if (!angular.isDefined($rootScope.user)) {
            $rootScope.user = QuoteFactory;
        }

        $scope.getActualAdd();
    };

    $scope.init();

}]);
