angular.module('blackRide').factory('AuthFactory' , function ($http, API_HOST, API_Key) {
	return {
		save: function (obj) { 
			$http({
				url: API_HOST + '/auth',
				method: 'POST',
				data: obj,
				headers : { 
					"Content-Type" : "application/json",
					'API-Key': API_Key
				}
		}); }
	}
});

angular.module('blackRide').factory('SignupFactory' , function ($http, API_HOST, API_Key) {
	return {
		save: function (obj) {
			$http({
				url: API_HOST + '/signup',
				method: 'POST',
				data: obj,
				headers : {
					'Content-Type': 'application/json',
					'API-key': API_Key
				}
		});
		}
	}
});

angular.module('blackRide').factory('BookingsFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/bookings');
});

angular.module('blackRide').factory('DispatchFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/dispatch');
});