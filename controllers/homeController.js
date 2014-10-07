
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
                $scope.centerMap();
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

    $scope.centerMap = function (position) {
        var pos = position || $scope.position;
        $scope.address = (position) ? position.formatted_address : $scope.address;
        $scope.markers = [];

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
