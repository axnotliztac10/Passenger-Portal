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
    var infowindow;

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

                $scope.setDriverImage(new google.maps.LatLng(lat, lng), map);

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
                    channel: $rootScope.user.booking.driver_info.driver.id + '.Driver',
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
                        angular.forEach($scope.markers, function (v, i) {
                            if (v.id == 1010) {
                                $scope.markers.splice(i, 1);
                                $scope.markers.push({
                                    icon: {
                                        url: HOST + 'assets/imgs/driver@2x.png',
                                        scaledSize: new google.maps.Size(60, 60)
                                    },
                                    options: { draggable: false },
                                    latitude: msgDriver.lat,
                                    longitude: msgDriver.lng,
                                    title: "m0",
                                    id: 1010
                                });
                            }
                        });

                        $scope.setDriverImage(newposition, map);
                    }
                });

                $window.google.maps.event.clearListeners(map, 'idle');
            }
        }
    };

    $scope.setDriverImage = function (position, map) {
        if (infowindow) infowindow.setMap(null);
        var infolib = eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('7 8(a){a=a||{};r.s.1R.2k(2,3d);2.Q=a.1v||"";2.1H=a.1B||J;2.S=a.1G||0;2.H=a.1z||1h r.s.1Y(0,0);2.B=a.U||1h r.s.2E(0,0);2.15=a.13||t;2.1p=a.1t||"2h";2.1m=a.F||{};2.1E=a.1C||"3g";2.P=a.1j||"3b://38.r.33/2Y/2T/2N/1r.2K";3(a.1j===""){2.P=""}2.1f=a.1x||1h r.s.1Y(1,1);3(q a.A==="p"){3(q a.18==="p"){a.A=L}v{a.A=!a.18}}2.w=!a.A;2.17=a.1n||J;2.1I=a.2g||"2e";2.16=a.1l||J;2.4=t;2.z=t;2.14=t;2.V=t;2.E=t;2.R=t}8.9=1h r.s.1R();8.9.25=7(){5 i;5 f;5 a;5 d=2;5 c=7(e){e.20=L;3(e.1i){e.1i()}};5 b=7(e){e.30=J;3(e.1Z){e.1Z()}3(!d.16){c(e)}};3(!2.4){2.4=1e.2S("2Q");2.1d();3(q 2.Q.1u==="p"){2.4.O=2.G()+2.Q}v{2.4.O=2.G();2.4.1a(2.Q)}2.2J()[2.1I].1a(2.4);2.1w();3(2.4.6.D){2.R=L}v{3(2.S!==0&&2.4.Z>2.S){2.4.6.D=2.S;2.4.6.2D="2A";2.R=L}v{a=2.1P();2.4.6.D=(2.4.Z-a.W-a.11)+"12";2.R=J}}2.1F(2.1H);3(!2.16){2.E=[];f=["2t","1O","2q","2p","1M","2o","2n","2m","2l"];1o(i=0;i<f.1L;i++){2.E.1K(r.s.u.19(2.4,f[i],c))}2.E.1K(r.s.u.19(2.4,"1O",7(e){2.6.1J="2j"}))}2.V=r.s.u.19(2.4,"2i",b);r.s.u.T(2,"2f")}};8.9.G=7(){5 a="";3(2.P!==""){a="<2d";a+=" 2c=\'"+2.P+"\'";a+=" 2b=11";a+=" 6=\'";a+=" U: 2a;";a+=" 1J: 29;";a+=" 28: "+2.1E+";";a+="\'>"}K a};8.9.1w=7(){5 a;3(2.P!==""){a=2.4.3n;2.z=r.s.u.19(a,"1M",2.27())}v{2.z=t}};8.9.27=7(){5 a=2;K 7(e){e.20=L;3(e.1i){e.1i()}r.s.u.T(a,"3m");a.1r()}};8.9.1F=7(d){5 m;5 n;5 e=0,I=0;3(!d){m=2.1D();3(m 3l r.s.3k){3(!m.26().3h(2.B)){m.3f(2.B)}n=m.26();5 a=m.3e();5 h=a.Z;5 f=a.24;5 k=2.H.D;5 l=2.H.1k;5 g=2.4.Z;5 b=2.4.24;5 i=2.1f.D;5 j=2.1f.1k;5 o=2.23().3c(2.B);3(o.x<(-k+i)){e=o.x+k-i}v 3((o.x+g+k+i)>h){e=o.x+g+k+i-h}3(2.17){3(o.y<(-l+j+b)){I=o.y+l-j-b}v 3((o.y+l+j)>f){I=o.y+l+j-f}}v{3(o.y<(-l+j)){I=o.y+l-j}v 3((o.y+b+l+j)>f){I=o.y+b+l+j-f}}3(!(e===0&&I===0)){5 c=m.3a();m.39(e,I)}}}};8.9.1d=7(){5 i,F;3(2.4){2.4.37=2.1p;2.4.6.36="";F=2.1m;1o(i 35 F){3(F.34(i)){2.4.6[i]=F[i]}}2.4.6.32="31(0)";3(q 2.4.6.X!=="p"&&2.4.6.X!==""){2.4.6.2Z="\\"2X:2W.2V.2U(2R="+(2.4.6.X*1X)+")\\"";2.4.6.2P="2O(X="+(2.4.6.X*1X)+")"}2.4.6.U="2M";2.4.6.M=\'1c\';3(2.15!==t){2.4.6.13=2.15}}};8.9.1P=7(){5 c;5 a={1b:0,1g:0,W:0,11:0};5 b=2.4;3(1e.1s&&1e.1s.1W){c=b.2L.1s.1W(b,"");3(c){a.1b=C(c.1V,10)||0;a.1g=C(c.1U,10)||0;a.W=C(c.1T,10)||0;a.11=C(c.1S,10)||0}}v 3(1e.2I.N){3(b.N){a.1b=C(b.N.1V,10)||0;a.1g=C(b.N.1U,10)||0;a.W=C(b.N.1T,10)||0;a.11=C(b.N.1S,10)||0}}K a};8.9.2H=7(){3(2.4){2.4.2G.2F(2.4);2.4=t}};8.9.1y=7(){2.25();5 a=2.23().2C(2.B);2.4.6.W=(a.x+2.H.D)+"12";3(2.17){2.4.6.1g=-(a.y+2.H.1k)+"12"}v{2.4.6.1b=(a.y+2.H.1k)+"12"}3(2.w){2.4.6.M="1c"}v{2.4.6.M="A"}};8.9.2B=7(a){3(q a.1t!=="p"){2.1p=a.1t;2.1d()}3(q a.F!=="p"){2.1m=a.F;2.1d()}3(q a.1v!=="p"){2.1Q(a.1v)}3(q a.1B!=="p"){2.1H=a.1B}3(q a.1G!=="p"){2.S=a.1G}3(q a.1z!=="p"){2.H=a.1z}3(q a.1n!=="p"){2.17=a.1n}3(q a.U!=="p"){2.1q(a.U)}3(q a.13!=="p"){2.22(a.13)}3(q a.1C!=="p"){2.1E=a.1C}3(q a.1j!=="p"){2.P=a.1j}3(q a.1x!=="p"){2.1f=a.1x}3(q a.18!=="p"){2.w=a.18}3(q a.A!=="p"){2.w=!a.A}3(q a.1l!=="p"){2.16=a.1l}3(2.4){2.1y()}};8.9.1Q=7(a){2.Q=a;3(2.4){3(2.z){r.s.u.Y(2.z);2.z=t}3(!2.R){2.4.6.D=""}3(q a.1u==="p"){2.4.O=2.G()+a}v{2.4.O=2.G();2.4.1a(a)}3(!2.R){2.4.6.D=2.4.Z+"12";3(q a.1u==="p"){2.4.O=2.G()+a}v{2.4.O=2.G();2.4.1a(a)}}2.1w()}r.s.u.T(2,"2z")};8.9.1q=7(a){2.B=a;3(2.4){2.1y()}r.s.u.T(2,"21")};8.9.22=7(a){2.15=a;3(2.4){2.4.6.13=a}r.s.u.T(2,"2y")};8.9.2x=7(a){2.w=!a;3(2.4){2.4.6.M=(2.w?"1c":"A")}};8.9.2w=7(){K 2.Q};8.9.1A=7(){K 2.B};8.9.2v=7(){K 2.15};8.9.2u=7(){5 a;3((q 2.1D()==="p")||(2.1D()===t)){a=J}v{a=!2.w}K a};8.9.3i=7(){2.w=J;3(2.4){2.4.6.M="A"}};8.9.3j=7(){2.w=L;3(2.4){2.4.6.M="1c"}};8.9.2s=7(c,b){5 a=2;3(b){2.B=b.1A();2.14=r.s.u.2r(b,"21",7(){a.1q(2.1A())})}2.1N(c);3(2.4){2.1F()}};8.9.1r=7(){5 i;3(2.z){r.s.u.Y(2.z);2.z=t}3(2.E){1o(i=0;i<2.E.1L;i++){r.s.u.Y(2.E[i])}2.E=t}3(2.14){r.s.u.Y(2.14);2.14=t}3(2.V){r.s.u.Y(2.V);2.V=t}2.1N(t)};',62,210,'||this|if|div_|var|style|function|InfoBox|prototype||||||||||||||||undefined|typeof|google|maps|null|event|else|isHidden_|||closeListener_|visible|position_|parseInt|width|eventListeners_|boxStyle|getCloseBoxImg_|pixelOffset_|yOffset|false|return|true|visibility|currentStyle|innerHTML|closeBoxURL_|content_|fixedWidthSet_|maxWidth_|trigger|position|contextListener_|left|opacity|removeListener|offsetWidth||right|px|zIndex|moveListener_|zIndex_|enableEventPropagation_|alignBottom_|isHidden|addDomListener|appendChild|top|hidden|setBoxStyle_|document|infoBoxClearance_|bottom|new|stopPropagation|closeBoxURL|height|enableEventPropagation|boxStyle_|alignBottom|for|boxClass_|setPosition|close|defaultView|boxClass|nodeType|content|addClickHandler_|infoBoxClearance|draw|pixelOffset|getPosition|disableAutoPan|closeBoxMargin|getMap|closeBoxMargin_|panBox_|maxWidth|disableAutoPan_|pane_|cursor|push|length|click|setMap|mouseover|getBoxWidths_|setContent|OverlayView|borderRightWidth|borderLeftWidth|borderBottomWidth|borderTopWidth|getComputedStyle|100|Size|preventDefault|cancelBubble|position_changed|setZIndex|getProjection|offsetHeight|createInfoBoxDiv_|getBounds|getCloseClickHandler_|margin|pointer|relative|align|src|img|floatPane|domready|pane|infoBox|contextmenu|default|apply|touchmove|touchend|touchstart|dblclick|mouseup|mouseout|addListener|open|mousedown|getVisible|getZIndex|getContent|setVisible|zindex_changed|content_changed|auto|setOptions|fromLatLngToDivPixel|overflow|LatLng|removeChild|parentNode|onRemove|documentElement|getPanes|gif|ownerDocument|absolute|mapfiles|alpha|filter|div|Opacity|createElement|en_us|Alpha|Microsoft|DXImageTransform|progid|intl|MsFilter|returnValue|translateZ|WebkitTransform|com|hasOwnProperty|in|cssText|className|www|panBy|getCenter|http|fromLatLngToContainerPixel|arguments|getDiv|setCenter|2px|contains|show|hide|Map|instanceof|closeclick|firstChild'.split('|'),0,{}));

        var contentString = "<div id='content' style='width: 50px;border-radius: 50%;overflow: hidden;height: 50px;'><img style='width:100%' src='" + $rootScope.user.booking.driver_info.driver.logo_url_small + "'></div>";

        infowindow = new InfoBox({
            content: contentString,
            disableAutoPan: true,
            pixelOffset: new google.maps.Size(-25, -78),
            position: position,
            boxStyle: {
                width: "50px"
            }
        });

        infowindow.open(map);
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
