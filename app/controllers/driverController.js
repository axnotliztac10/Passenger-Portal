angular.module('blackRide').controller('driverController', 
    [
        '$scope',
        '$modal',
        '$rootScope',
        '$state',
        'Bookings',
        '$timeout',
        'Quotes',
    function(
        $scope,
        $modal,
        $rootScope,
        $state,
        Bookings,
        $timeout,
        Quotes
    ) {

        if (!$rootScope.user) {
            $state.go("home");
        } else if (!$rootScope.user.booking.scheduled) {
            $state.go("time");
        }
        
        $scope.now = $rootScope.user.booking.scheduled_now;
        $scope.filterRate = 0;
        $scope.backFilter = 0;
        $scope.max = 5;
        $scope.isReadonly = false;
        $scope.minPrice = 10;
        $scope.maxPrice = 60;
        $scope.minTime = 10;
        $scope.maxTime = 60;

        $scope.evaluateNoChange = function (change) {
            if (change == $scope.backFilter) {
                $scope.filterRate = 0;
                $scope.backFilter = 0;
                return;
            }
            $scope.backFilter = change;
        };

        $scope.timeFilter = function (candidate) {
            var time = candidate.vehicles[0].quote.hours * 60;
            //return (time >= $scope.minTime && time <= $scope.maxTime);
            return (time >= $scope.minTime);
        };

        $scope.priceFilter = function (candidate) {
            var price = candidate.vehicles[0].quote.total;
            //return (candidate.price >= $scope.minPrice && candidate.price <= $scope.maxPrice);
            return (price >= $scope.minPrice);
        };

        $scope.starFilter = function (candidate) {
            if ($scope.filterRate == 0) return true;
            return (candidate.rate == $scope.filterRate);
        };

        $scope.open = function (size, candidate) {
            $timeout(function () {
                var modalInstance = $modal.open({
                    templateUrl: 'modalDriver.html',
                    controller: 'modalDriver',
                    size: size,
                    backdrop: 'static',
                    resolve: {
                        candidate: function () {
                            return candidate;
                        }
                    },
                    windowClass: "driverModal"
                });

                modalInstance.result.then(function (candidate) {
                    $rootScope.user.booking.driver_info = candidate;
                    $state.go("confirm.driver");
                    }, function () {
                    return;
                });
            }, 100);
        };

        $scope.driversMock = [
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'Alexa Smith',
                model: 'Tesla S',
                photo: './assets/imgs/faces/13.jpg',
                rate: 4,
                time: 10,
                price: 30,
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            },
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'Peter Smith',
                model: 'BMW 251i',
                photo: './assets/imgs/faces/15.jpg',
                rate: 2,
                time: 12,
                price: 17,
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            },
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'John gMarker',
                model: 'Audi A3',
                photo: './assets/imgs/faces/30.jpg',
                rate: 3,
                time: 20,
                price: 30,
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            },
            {
                img: './assets/imgs/cars/car.jpg',
                name: 'John Smith',
                model: 'Tesla S',
                photo: './assets/imgs/faces/47.jpg',
                rate: 5,
                time: 34,
                price: 45,
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            }
        ];

        $scope.candidates = [];
        $scope.candidates = [{"driver":{"id":6286870317105152,"name":"Pedro Garcia","logo_url":"https://storage.googleapis.com/shift-driver-api-drivers-photo/photo_driver_6286870317105152.jpg?v=1427049685","logo_url_small":"https://lh5.ggpht.com/G-7UkWGTPqle-A92ksch3P08PeagBCMLHpVXgaT_1sDpjwNQ517OwloVzooRLj_nOIxx53y-BJ7ULZpIITOlppb3VoT7=s200"},"vehicles":[{"vehicle_id":5652383656837120,"owner":6286870317105152,"make":"Volkswagen","model":"Phaeton","energy_type":1,"vehicle_type":4,"quote":{"fleet":5081359164899328,"energy_type":1,"vehicle_type":4,"passenger":5734183724908544,"kms":584.778,"hours":320.21666666666664,"hours_waiting":0,"currency":"EUR","total":821.4892}}]}];

        $scope.selectModel = function (modelId) {
            var route = {
                    pickup_time: $rootScope.user.booking.scheduled_raw,
                    origin: $rootScope.user.booking.from.formatted_address,
                    vehicle_type: modelId
                };

            if ($rootScope.user.booking.to.formatted_address) {
                route.destination = $rootScope.user.booking.to.formatted_address;
            }

            Quotes.save(route).success(function (res) {
                $rootScope.user.booking.quote = res;
                $state.go('confirm.model');
            });
        };

        if ($rootScope.user.booking.quote && $rootScope.user.booking.quote.candidates && $rootScope.user.booking.quote.candidates.length > 0) {
            $scope.candidates = $rootScope.user.booking.quote.candidates;
        }
        
}]);
