
angular.module('darkRide').controller('dropController', 
	[
	'$rootScope',
	'$scope',
	'$window',
	'HOST',
	'$state',
	function(
	$rootScope,
	$scope,
	$window,
	HOST,
	$state
	) {
    
    $scope.geoCoder = new $window.google.maps.Geocoder();
    $scope.address = "GO TO MAP";
    $scope.markers = [];
    $scope.details = "";
    $scope.options = null;
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
            idle: function (res, res1) {
                var pos = $rootScope.user.departureData.position;

                $scope.address = $rootScope.user.departureData.address;

                if (typeof $rootScope.user.returnData.position.lat != "undefined") {
                    pos = $rootScope.user.returnData.position;
                    $scope.address = $rootScope.user.returnData.address;
                };

                $scope.centerMap({lat: pos.lat, lon: pos.lon}, false);
                $window.google.maps.event.clearListeners(res, 'idle');
            },
            dragstart: function () {
                $scope.setIcon('dragging');
            },
            dragend: function () {
                $scope.setIcon('drag');
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
            $scope.getAddress(pos.k, pos.B, function () {$scope.setIcon('pick_me')});
        }
    };

    $scope.centerMap = function (position, dirty) {
        var posit = position;
        $scope.getAddress(posit.lat, posit.lon);

        $scope.markers = [];

        $scope.markers.push({
            icon: HOST + (dirty ? 'assets/imgs/pick_me.png' : 'assets/imgs/drag.png'),
            options: { draggable: true },
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

    $scope.getAddress = function (lat, lon, call) {
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

    $scope.setIcon = function (type) {
        $scope.markersCtr.getGMarkers()[0].setIcon(HOST + 'assets/imgs/' + type + '.png');
    }

}]);
