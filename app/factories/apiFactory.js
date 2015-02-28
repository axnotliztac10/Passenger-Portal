angular.module('blackRide').factory('AuthFactory' , function ($http, API_HOST) {
	return {
		save: function (obj) { 
			$http({
				url: API_HOST + '/auth',
				method: 'POST',
				data: obj,
				headers : { "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8" }
		}); }
	}
});

angular.module('blackRide').factory('SignupFactory' , function ($resource, API_HOST) {
	return {
		save: function (obj) {
			$http({
				url: API_HOST + '/signup',
				method: 'POST',
				data: obj,
				headers : { "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8" }
		}); }
	}
});

angular.module('blackRide').factory('BookingsFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/bookings');
});

angular.module('blackRide').factory('DispatchFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/dispatch');
});