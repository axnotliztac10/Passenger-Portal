angular.module('blackRide').factory('AuthFactory' , function ($http, API_HOST, API_Key, $rootScope) {
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

angular.module('blackRide').factory('SignupFactory' , function ($http, API_HOST, API_Key, $rootScope) {
	return {
		save: function (obj) {
			delete obj.booking;
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

angular.module('blackRide').factory('LogoutFactory' , function ($http, API_HOST, API_Key, $rootScope) {
	return {
		delete: function (obj) {
			return $http({
				url: API_HOST + '/auth',
				method: 'DELETE',
				data: obj,
				headers : {
					'Content-Type': 'application/json',
					'API-key': API_Key,
					'client-token': $rootScope.user.token.value
				}
			});
		}
	}
});

angular.module('blackRide').factory('StripeProvider' , function ($http, API_HOST, API_Key, $rootScope) {
	return {
		save: function (obj) {
			return $http({
				url: API_HOST + '/providers/stripe',
				method: 'POST',
				data: obj,
				headers : {
					'Content-Type': 'application/json',
					'API-key': API_Key,
					'client-token': $rootScope.user.token.value
				}
			});
		}
	}
});

angular.module('blackRide').factory('Organisations', function ($http, API_HOST, API_Key, $rootScope) {
	return {
		get: function () {
			return $http({
				url: API_HOST + '/organisations',
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'API-key': API_Key,
					'client-token': $rootScope.user.token.value
				}
			});
		}
	}
});

angular.module('blackRide').factory('Quotes', function ($http, API_HOST, API_Key, $rootScope) {
	return {
		save: function (obj) {
			return $http({
				url: API_HOST + '/quotes',
				method: 'POST',
				data: obj,
				headers: {
					'Content-Type': 'application/json',
					'API-key': API_Key,
					'client-token': $rootScope.user.token.value
				}
			});
		},
		create: function (id) {
			return $http({
				url: API_HOST + '/booking/' + id,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'API-key': API_Key,
					'client-token': $rootScope.user.token.value
				}
			});
		}
	}
});

angular.module('blackRide').factory('Bookings' , function ($http, API_HOST, API_Key, $rootScope) {
	return {
		done: {
			get: function () {
				return $http({
					url: API_HOST + '/bookings/done',
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'API-key': API_Key,
						'client-token': $rootScope.user.token.value
					}
				});
			}
		},
		pending: {
			get: function () {
				return $http({
					url: API_HOST + '/bookings/pending',
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'API-key': API_Key,
						'client-token': $rootScope.user.token.value
					}
				});
			}
		},
		dispatched: {
			get: function () {
				return $http({
					url: API_HOST + '/bookings/dispatched',
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'API-key': API_Key,
						'client-token': $rootScope.user.token.value
					}
				});
			}
		},
		ongoing: {
			get: function () {
				return $http({
					url: API_HOST + '/bookings/ongoing',
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'API-key': API_Key,
						'client-token': $rootScope.user.token.value
					}
				});
			}
		},
		cancelled: {
			get: function () {
				return $http({
					url: API_HOST + '/bookings/cancelled',
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'API-key': API_Key,
						'client-token': $rootScope.user.token.value
					}
				});
			}
		}
	}
});
