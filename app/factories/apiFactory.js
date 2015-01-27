angular.module('blackRide').factory('AuthFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/auth');
});

angular.module('blackRide').factory('SignupFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/signup');
});

angular.module('blackRide').factory('BookingsFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/bookings');
});

angular.module('blackRide').factory('DispatchFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/dispatch');
});