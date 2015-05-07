angular.module('blackRide').controller('dropController', 
	[
    	'$rootScope',
    	'$scope',
    	'$window',
    	'HOST',
    	'$state',
        '$http',
        'API_Key',
        'Quotes',
	function(
    	$rootScope,
    	$scope,
    	$window,
    	HOST,
    	$state,
        $http,
        API_Key,
        Quotes
	) {

    if (!$rootScope.user.booking || !$rootScope.user.booking.from) {
        $state.go("home");
        return;
    }
    
    $scope.geoCoder = new $window.google.maps.Geocoder();
    $scope.address = "Search address";
    $scope.markers = [];
    $scope.details = "";
    $scope.options = null;
    $scope.searchResults = [];
    $scope.markersCtr = {};
    $scope.icons = {
        pick_me: {
            url: HOST + 'assets/imgs/drop_me@2x.png',
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
                    lat: $rootScope.user.booking.from.latitude,
                    lon: $rootScope.user.booking.from.longitude
                };

                $scope.address = $rootScope.user.booking.from.formatted_address;

                if ($rootScope.user.booking.to && $rootScope.user.booking.to.latitude) {
                    pos = {
                        lat: $rootScope.user.booking.to.latitude,
                        lon: $rootScope.user.booking.to.longitude
                    };
                    $scope.address = $rootScope.user.booking.to.formatted_address;
                };

                $scope.centerMap({lat: pos.lat, lon: pos.lon}, false);
                $window.google.maps.event.clearListeners(res, 'idle');
            },
            dragstart: function () {
                 $scope.setIcon($scope.icons['dragging']);
            },
            dragend: function () {
                var pos = $scope.map.control.getGMap().getCenter();
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

    var setBooking = function () {
        $scope.$on("authSuccess", function () {
            var route = {
                    pickup_time: $rootScope.user.booking.scheduled_raw,
                    origin: $rootScope.user.booking.from.formatted_address
                };

            if ($rootScope.user.booking.to.formatted_address) {
                route.destination = $rootScope.user.booking.to.formatted_address;
            }

            Quotes.save(route).success(function (res) {
                $rootScope.user.booking.quote = res;
                $state.go('driver');
            });
        });
        
        $rootScope.$broadcast("signIn");
    };

    $scope.go = function () {
        $rootScope.user.booking.to = {};
        setBooking();
    };

    $scope.markersEvents = {
        click: function (gMarker, eventName, model) {
            var pos = gMarker.getPosition();
            if ($rootScope.user.booking.from.formatted_address == $scope.address) return false; 
            $rootScope.user.booking.to = {
                formatted_address: $scope.address,
                latitude: pos.lat(),
                longitude: pos.lng()
            };
            $rootScope.user.flush();

            setBooking();
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
