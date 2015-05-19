angular.module('blackRide').controller('confirmModelController',
    [
        '$rootScope',
        '$scope',
        '$window',
        'HOST',
        '$state',
        '$modal',
        'AuthFactory',
        'localStorageService',
        '$timeout',
        '$http',
        'API_Key',
    function(
        $rootScope,
        $scope,
        $window,
        HOST,
        $state,
        $modal,
        AuthFactory,
        localStorageService,
        $timeout,
        $http,
        API_Key
    ) {

    if (!$rootScope.user) {
        $state.go("home");
    } else if (!$rootScope.user.booking.scheduled) {
        $state.go("time");
    } else if (!$rootScope.user.booking.quote) {
        $state.go("driver");
    }

    $scope.vehicle = ($rootScope.user.booking.quote && $rootScope.user.booking.quote.quote) ? $rootScope.user.booking.quote.quote.vehicle_type : 2;
    $scope.user = $rootScope.user;
    $scope.scheduled = $rootScope.user.booking.scheduled_raw;
    $scope.markers = [];
    $scope.markersControl = {};

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
                var posDep = {
                    lat: $scope.user.booking.from.latitude,
                    lon: $scope.user.booking.from.longitude
                };

                if ($scope.user.booking.to) {
                    var posDro = {
                        lat: $scope.user.booking.to.latitude,
                        lon: $scope.user.booking.to.longitude
                    };
                }

                $scope.map.control.refresh({
                    latitude: posDep.lat, 
                    longitude: posDep.lon
                });

                map = $scope.map.control.getGMap();
                var lat_lng = new Array();

                lat_lng.push(
                    new $window.google.maps.LatLng(posDep.lat, posDep.lon)
                );

                if (posDro) {
                    lat_lng.push(new $window.google.maps.LatLng(posDro.lat, posDro.lon));
                }

                var service = new $window.google.maps.DirectionsService();
                
                var lineSymbol = {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 4
                };

                var polyTwo = new $window.google.maps.Polyline({
                    map: map,
                    icons: [{
                        icon: lineSymbol,
                        offset: '0',
                        repeat: '20px'
                    }],
                    strokeColor: '#075FB5',
                    strokeOpacity: 0
                });

                $scope.markers.push({
                    icon: {
                        url: HOST + 'assets/imgs/a@2x.png',
                        scaledSize: new google.maps.Size(36, 50)
                    },
                    options: { draggable: false },
                    latitude: posDep.lat,
                    longitude: posDep.lon,
                    title: "m1",
                    id: 1
                });

                if (posDro) {
                    $scope.markers.push({
                        icon: {
                            url: HOST + 'assets/imgs/b@2x.png',
                            scaledSize: new google.maps.Size(36, 50)
                        },
                        options: { draggable: false },
                        latitude: posDro.lat,
                        longitude: posDro.lon,
                        title: "m2",
                        id: 2
                    });
                }

                var aPoint = lat_lng[0];

                if (posDro) {
                    var bPoint = lat_lng[1];
                    $scope.drawPath(aPoint, bPoint, polyTwo, service);
                }

                $window.google.maps.event.clearListeners(map, 'idle');
            }
        }
    };

    $scope.drawPath = function (pointA, pointB, polyline, service) {
        var path = new $window.google.maps.MVCArray();
        path.push(pointA);
        polyline.setPath(path);
        service.route({
            origin: pointA,
            destination: pointB,
            travelMode: $window.google.maps.DirectionsTravelMode.DRIVING
        }, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                    path.push(result.routes[0].overview_path[i]);
                }
            }
        });
    };

    $scope.open = function () {
        $timeout(function () {
            $rootScope.$broadcast("signIn");
        }, 100);
    };

    var onAuth = function (event, reqObj) {
        $http({
            url: 'http://shift-passenger-api-dev.appspot.com/bookings/' + $rootScope.user.booking.quote.booking_id + '/pending',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'client-token': $rootScope.user.token.value,
                'API-Key': API_Key
            }
        }).then(function () {
            $scope.map.active = true;
        });

    };

    $scope.$on("authSuccess", onAuth);

}]);