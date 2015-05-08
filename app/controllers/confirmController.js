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
        'PubNub',
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
        API_Key,
        PubNub
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
                        //url: ($scope.driver && $scope.driver.driver && $scope.driver.driver.logo_url_small) ? $scope.driver.driver.logo_url_small.replace(".jpg", "_min.png") : HOST + './assets/imgs/faces/15_min.png',
                        url: HOST + 'assets/imgs/driver@2x.png',
                        scaledSize: new google.maps.Size(60, 60)
                    },
                    options: { draggable: false },
                    latitude: lat,
                    longitude: lng,
                    title: "m0",
                    id: 1010
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
                $scope.drawPath(driver, aPoint, poly, service);

                if (posDro) {
                    var bPoint = lat_lng[2];
                    $scope.drawPath(aPoint, bPoint, polyTwo, service);
                }

                var codes = {
                    "notification": {
                        "kind": {
                            "1": "Affiliation",
                            "2": "Booking",
                            "4": "Ride",
                            "8": "Vehicle",
                            "16": "Driver"
                        },
                        "type": {
                            "1": "Information",
                            "2": "Warning",
                            "4": "Success",
                            "8": "Error"
                        },
                        "code": {
                            "1": "BookingNotReceived",
                            "2": "BookingReceived",
                            "4": "RideAccepted",
                            "8": "RideRejected",
                            "16": "RideCancelled",
                            "32": "RideTransferringToStart",
                            "64": "RideCompleted",
                            "128": "RideNoAnswer",
                            "256": "DriverLogin",
                            "512": "DriverLogout",
                            "1024": "VehicleFree",
                            "2048": "VehicleBusy"
                        }
                    }
                };

                var notification_kinds = codes.notification.kind;
                var notification_types = codes.notification.type;
                var notification_codes = codes.notification.code;

                PubNub.init({
                    subscribe_key:'sub-c-4dec92dc-f2fb-11e3-854f-02ee2ddab7fe',
                });

                PubNub.ngSubscribe({
                    channel: $rootScope.user.passenger.id + '.Passenger',
                    callback: function (message, env, channel) {
                        var msg = JSON.parse(message);
                        if (!(msg && msg.payload)) {
                            return;
                        }
                        msg = msg.payload;

                        var kind = notification_kinds[msg.kind];
                        var type = notification_types[msg.type];
                        var code = notification_codes[msg.code];
                    }
                });

                PubNub.ngSubscribe({
                    channel: 6286870317105152 + '.Driver',
                    callback: function (message_driver) {
                        var msgDriver = JSON.parse(message_driver);
                        if (!(msgDriver && msgDriver.payload)) {
                            return;
                        }
                        msgDriver = msgDriver.payload;

                        var kind = notification_kinds[msgDriver.kind];
                        var type = notification_types[msgDriver.type];
                        var code = notification_codes[msgDriver.code];

                        var newposition = new google.maps.LatLng(msgDriver.lat, msgDriver.lng);
                        $scope.drawPath(newposition, aPoint, poly, service);
                        if ($scope.markersControl.getGMarkers()[2]) $scope.markersControl.getGMarkers()[2].setPosition(newposition);
                    }
                });

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
            url: 'http://shift-passenger-api-dev.appspot.com/dispatch',
            method: 'POST',
            data: {
                booking_id: $rootScope.user.booking.quote.booking_id,
                driver_id: $rootScope.user.booking.driver_info.driver.id,
                ride_id: $rootScope.user.booking.quote.ride_id,
                vehicle_id: $rootScope.user.booking.driver_info.vehicles[0].vehicle_id
            },
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
