angular.module('blackRide').factory('AuthFactory' , function ($http, API_HOST, API_Key) {
	return {
		save: function (obj) { 
			return $http({
				url: API_HOST + '/auth',
				method: 'POST',
				data: obj,
				headers : { 
					"Content-Type" : "application/json",
					'API-Key': API_Key
				}
			});
		}
	}
});

angular.module('blackRide').factory('SignupFactory' , function ($http, API_HOST, API_Key) {
	return {
		save: function (obj) {
			return $http({
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

angular.module('blackRide').factory('LogoutFactory' , function ($http, API_HOST, API_Key) {
	return {
		delete: function (obj, token) {
			return $http({
				url: API_HOST + '/auth',
				method: 'DELETE',
				data: obj,
				headers : {
					'Content-Type': 'application/json',
					'API-key': API_Key,
					'client-token': token || 'notokenset'
				}
			});
		}
	}
});

angular.module('blackRide').factory('StripeProvider' , function ($http, API_HOST, API_Key) {
	return {
		save: function (obj, token) {
			return $http({
				url: API_HOST + '/providers/stripe',
				method: 'POST',
				data: obj,
				headers : {
					'Content-Type': 'application/json',
					'API-key': API_Key,
					'client-token': token || 'notokenset'
				}
			});
		}
	}
});

angular.module('blackRide').factory('BookingsFactory' , function ($http, API_HOST, API_Key) {
	return {
		get: function (token) {
			return $http({
				url: API_HOST + '/bookings/done',
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'API-key': API_Key,
					'client-token': token || 'notokenset'
				}
			});
		}
	}
});

angular.module('blackRide').factory('DispatchFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/dispatch');
});