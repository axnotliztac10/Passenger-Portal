
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

    if (!$rootScope.user) {
        $state.go("home");
        return;
    }
    
    $scope.geoCoder = new $window.google.maps.Geocoder();
    $scope.address = "GO TO MAP";
    $scope.markers = [];
    $scope.details = "";
    $scope.options = null;
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
            idle: function (res, res1) {
                var pos = {
                    lat: $rootScope.user.getFrom().latitude,
                    lon: $rootScope.user.getFrom().longitude
                };

                $scope.address = $rootScope.user.getFrom().formatted_address;

                if ($rootScope.user.getTo()) {
                    pos = {
                        lat: $rootScope.user.getTo().latitude,
                        lon: $rootScope.user.getTo().longitude
                    };
                    $scope.address = $rootScope.user.getTo().formatted_address;
                };

                $scope.centerMap({lat: pos.lat, lon: pos.lon}, false);
                $window.google.maps.event.clearListeners(res, 'idle');
            },
            dragstart: function () {
                 $scope.setIcon($scope.icons['dragging']);
            },
            dragend: function () {
                var pos = $scope.map.control.getGMap().getCenter();
                $scope.getAddress(pos.k, pos.B, function () {$scope.setIcon($scope.icons['pick_me'])});
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
            if ($rootScope.user.getFrom().formatted_address == $scope.address) return false; 
            $rootScope.user.setTo({
                formatted_address: $scope.address,
                latitude: pos.k,
                longitude: pos.B
           });
            $state.go('driver');
        }
    };

    $scope.centerMap = function (position, dirty) {
        var posit = position;
        $scope.getAddress(posit.lat, posit.lon);

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
        $scope.markersCtr.getGMarkers()[0].setIcon(type);
    }

}]);
