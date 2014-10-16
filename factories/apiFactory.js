angular.module('blackRide').factory('AuthFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/auth', {} 
		{
			save: { method: "JSONP" },
			params: {
	          callback: 'JSON_CALLBACK'
	        }
		});
});

angular.module('blackRide').factory('SignupFactory' , function ($resource, API_HOST) {
	return $resource(API_HOST + '/signup');
});