angular.module('blackRide').controller('driverController', 
    [
        '$scope',
        '$modal',
        '$rootScope',
        '$state',
        'BookingsFactory',
        'BookingsResponse',
        'DispatchFactory',
        'DispatchResponse',
    function(
        $scope,
        $modal,
        $rootScope,
        $state,
        BookingsFactory,
        BookingsResponse,
        DispatchFactory,
        DispatchResponse
    ) {

        if (!$rootScope.user) {
            $state.go("home");
        } else if (!$rootScope.user.getScheduled()) {
            $state.go("time");
        } else if (!$rootScope.user.getDriver_info()) {
            $state.go("driver");
        }
        
        $scope.filterRate = 0;
        $scope.backFilter = 0;
        $scope.max = 5;
        $scope.isReadonly = false;
        $scope.minPrice = 10;
        $scope.maxPrice = 60;
        $scope.minTime = 10;
        $scope.maxTime = 60;

        $scope.newBooking = {
            passenger_id: $rootScope.user.getAuthResponse().id,
            passenger_in_group: false,
            fleet_id: $rootScope.user.getAuthResponse().fleet_id,
            scheduled: $rootScope.user.getScheduled(),
            route: {
                from: $rootScope.user.getFrom(),
                to: $rootScope.user.getTo(),
                waypoints : [
                    {
                        formatted_address: "foobar",
                        latitude: 51.89,
                        longitude: 13.79,
                    }
                ]
            },
            scheduled_duration: 0.0
        };

        BookingsFactory.save($scope.newBooking, function (res) {
            BookingsResponse.fillPassenger(res);
            $rootScope.user.setBookingResponse(BookingsResponse);
        });

        DispatchFactory.save($rootScope.user.getSerialized(), function (res) {
            DispatchResponse.fillPassenger(res);
            $rootScope.user.setDispatchResponse(BookingsResponse);
        });

        $scope.evaluateNoChange = function (change) {
            if (change == $scope.backFilter) {
                $scope.filterRate = 0;
                $scope.backFilter = 0;
                return;
            }
            $scope.backFilter = change;
        };

        $scope.timeFilter = function (driver) {
            return (driver.time >= $scope.minTime && driver.time <= $scope.maxTime);
        };

        $scope.priceFilter = function (driver) {
            return (driver.price >= $scope.minPrice && driver.price <= $scope.maxPrice);
        };

        $scope.starFilter = function (driver) {
            if ($scope.filterRate == 0) return true;
            return (driver.rate == $scope.filterRate);
        };

        $scope.open = function (size, driver) {

            var modalInstance = $modal.open({
                templateUrl: 'modalDriver.html',
                controller: 'modalDriver',
                size: size,
                resolve: {
                    driver: function () {
                        return driver;
                    }
                },
                windowClass: "driverModal"
            });

            modalInstance.result.then(function (driver) {
                $rootScope.user.setDriver_info(driver);
                $state.go("confirm");
                }, function () {
                return;
            });
        };

        $scope.drivers = [
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
}]);
