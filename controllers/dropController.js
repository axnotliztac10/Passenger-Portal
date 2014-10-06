
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
                    icon: HOST + 'assets/imgs/drop_me.png',
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
