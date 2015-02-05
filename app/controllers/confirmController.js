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
        'AuthResponse',
    function(
        $rootScope,
        $scope,
        $window,
        HOST,
        $state,
        $modal,
        AuthFactory,
        localStorageService,
        AuthResponse
    ) {

    if (!$rootScope.user) {
        $state.go("home");
    } else if (!$rootScope.user.getScheduled()) {
        $state.go("time");
    } else if (!$rootScope.user.getDriver_info()) {
        $state.go("driver");
    }
        
    $scope.driver = $rootScope.user.getDriver_info();
    $scope.user = $rootScope.user;
    $scope.scheduled = $rootScope.user.getScheduled();
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
                    lat: $scope.user.getFrom().latitude,
                    lon: $scope.user.getFrom().longitude
                };

                if ($scope.user.getTo()) {
                    var posDro = {
                        lat: $scope.user.getTo().latitude,
                        lon: $scope.user.getTo().longitude
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
        $rootScope.$broadcast("signIn");
    };

    $scope.$on("signResponse", function (event, reqObj) {
        $rootScope.user = reqObj.body;
        AuthFactory.save(reqObj.body, function (res) {
            AuthResponse.fillPassenger(res);
            $rootScope.user.setAuthResponse(AuthResponse);
        });

        $scope.map.active = true;
    });

    localStorageService.set('dispatchFactory', $rootScope.user);

}]);
