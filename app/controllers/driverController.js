angular.module('blackRide').controller('driverController', 
    [
        '$scope',
        '$modal',
        '$rootScope',
        '$state',
        'Bookings',
        '$timeout',
    function(
        $scope,
        $modal,
        $rootScope,
        $state,
        Bookings,
        $timeout
    ) {

        if (!$rootScope.user) {
            $state.go("home");
        } else if (!$rootScope.user.booking.scheduled) {
            $state.go("time");
        } else if (!$rootScope.user.booking.driver_info) {
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
                    resolve: {
                        candidate: function () {
                            return candidate;
                        }
                    },
                    windowClass: "driverModal"
                });

                modalInstance.result.then(function (candidate) {
                    $rootScope.user.booking.driver_info = candidate;
                    $state.go("confirm");
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

        $scope.candidates = $rootScope.user.booking.quote.candidates;
}]);
