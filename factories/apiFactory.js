angular.module('blackRide').factory('AuthFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/auth', 
		{ 
			callback: "JSON_CALLBACK" 
		}, 
		{ 
			save: { method: "JSONP" } 
		});
});

angular.module('blackRide').factory('SignupFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/signup');
});