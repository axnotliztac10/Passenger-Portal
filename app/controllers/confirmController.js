angular.module('blackRide').controller('confirmController',
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
    } else if (!$rootScope.user.booking.driver_info) {
        $state.go("driver");
    }
        
    $scope.driver = $rootScope.user.booking.driver_info;
    $scope.user = $rootScope.user;
    $scope.scheduled = $rootScope.user.booking.scheduled;
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
                var bounds = map.getBounds();
                var lat_lng = new Array();
                var southWest = bounds.getSouthWest();
                var northEast = bounds.getNorthEast();
                var lngSpan = northEast.lng() - southWest.lng();
                var latSpan = northEast.lat() - southWest.lat();

                var lat = southWest.lat() + latSpan * Math.random();
                var lng = southWest.lng() + lngSpan * Math.random();

                lat_lng.push(
                    new $window.google.maps.LatLng(lat, lng),
                    new $window.google.maps.LatLng(posDep.lat, posDep.lon)
                );

                if (posDro) {
                    lat_lng.push(new $window.google.maps.LatLng(posDro.lat, posDro.lon));
                }

                var path = new $window.google.maps.MVCArray();
                var pathTwo = new $window.google.maps.MVCArray();
                var service = new $window.google.maps.DirectionsService();
                
                var lineSymbol = {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 4
                };

                var poly = new $window.google.maps.Polyline({
                    map: map,
                    icons: [{
                        icon: lineSymbol,
                        offset: '0',
                        repeat: '20px'
                    }],
                    strokeColor: '#737373',
                    strokeOpacity: 0
                });

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
                        url: HOST + $scope.driver.photo.replace(".jpg", "_min.png"),
                        scaledSize: new google.maps.Size(60, 60)
                    },
                    options: { draggable: false },
                    latitude: lat,
                    longitude: lng,
                    title: "m0",
                    id: 0
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


                var driver = lat_lng[0];
                var aPoint = lat_lng[1];
                path.push(driver);
                poly.setPath(path);
                service.route({
                    origin: driver,
                    destination: aPoint,
                    travelMode: $window.google.maps.DirectionsTravelMode.DRIVING
                }, function (result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                            path.push(result.routes[0].overview_path[i]);
                        }
                    }
                });

                if (posDro) {
                    var bPoint = lat_lng[2];
                    polyTwo.setPath(pathTwo);
                    service.route({
                        origin: aPoint,
                        destination: bPoint,
                        travelMode: $window.google.maps.DirectionsTravelMode.DRIVING
                    }, function (result, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                pathTwo.push(result.routes[0].overview_path[i]);
                            }
                        }
                    });
                }

                $window.google.maps.event.clearListeners(map, 'idle');
            }
        }
    };

    $scope.open = function () {
        $timeout(function () {
            $rootScope.$broadcast("signIn");
        }, 100);
    };

    var onAuth = function (event, reqObj) {
        return;
        $http({
            url: 'http://shift-passenger-api-dev.appspot.com/bookings',
            method: 'POST',
            data: {"type":"regular","pickup_time":"2015-03-06T08:26:12.143Z","route":{"from":{"latitude":48.2081743,"longitude":16.37381890000006,"location":"Vienna, Vienna"},"to":{"latitude":48.23106569999999,"longitude":16.148543399999994,"location":"Gablitz, Gablitz"}},"total":0,"distance":21900,"hire_per_hour":0,"booking_flight":""},
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

    localStorageService.set('dispatchFactory', $rootScope.user.booking);

}]);
