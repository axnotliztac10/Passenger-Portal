angular.module('blackRide').run(function ($httpBackend, API_HOST) {

	var authRespond = {"client_id":"11fbdd6eb2f9322d6840415f68bdca73a689a3d6","passenger":{"id":6051711999279104,"created":"2014-10-08T16:20:31Z","modified":"2014-10-08T16:20:31Z","status":1,"first_name":"Joe","last_name":"Doe","full_name":"Joe Doe","email":"joe.doe@email.com","fleet_id":5910046797987840,"fare_id":5910974510923776},"fleet":{"address":"Chodowieckistraße 26","address2":"","city":"Berlin","country":"Germany","created":"2014-07-02T13:18:10Z","description":"some description of the fleet","email":"john@blueandshift.com","id":5910046797987840,"location_lat":52.54,"location_lng":13.426,"logo_url":"http://madebyspiffy.com/img/spiffy_logo@2x.png","mobile_phone_number":"+4907646233","modified":"2014-07-02T13:18:10Z","name":"John's Fleet","postal_code":"10405","size":1,"state":"Berlin","status":1,"timezone":120,"timezone_city":"Berlin","work_phone_number":"+4903046233"},"fleet_auth_options":[{"name":"Joe Doe's Fleet","city":"","country":"","fleet_id":4729205669494784}],"token":{"value":"20de374e224c904bfe99e153d7350c1d4ef31753","expire_at":"2014-05-27T21:11:39Z"}};

	var bookingsRespond = {"affiliation_path":[],"created":"2014-07-07T10:07:42Z","fleet_id":5629499534213120,"fleet_path":[5629499534213120],"id":6612462929444864,"modified":"2014-07-07T10:07:42Z","passenger_full_name":"John Smith","passenger_id":5136918324969472,"passenger_in_group":false,"payment_method_type":0,"price":10,"route":{"distance":195480,"duration":8198,"formatted_distance":"195.48 km","formatted_duration":"2 h 16 min","from":{"latitude":51.53,"longitude":13.42},"to":{"latitude":52.2,"longitude":14.66},"waypoints":[{"formatted_address":"foobar","latitude":51.89,"longitude":13.79,}]},"scheduled":"2014-04-11T09:09:51Z","status":1};

	var dispatchRespond = {"token":"DEADBEEFABC","fleet_id":111,"passenger_id":123,"scheduled":"2014-06-12T12:33:55Z","from":{"formatted_address":"Street ABC 15, Berlin, Germany","latitude":52.12,"longitude":13.22},"to":{"formatted_address":"Street ABC 21, Berlin, Germany","latitude":52.22,"longitude":13.44},"sort_by":"","max_results":20,"waypoints":[{"formatted_address":"","latitude":52.18,"longitude":13.32}],"sort_by":"","max_results":20,"error":"","vehicle_type":1,"vehicle_size":5,"vehicle_energy_type":1};

	var rideRespond = {"affiliation_path":[6398745356795904],"booking_id":4780264240709632,"created":"2014-06-26T13:44:20Z","driver_id":4709895496531968,"fare_extra_ids":[],"fleet_path":[5695057915019264],"id":5343214194130944,"modified":"2014-06-26T13:44:20Z","price":0,"price_fare_id":5906164147552256,"status":1,"vehicle_id":6680220333506560};

	var bookingPatchRespond = [200, 'ok', {}];

	$httpBackend.whenPOST(API_HOST + '/auth').respond(function(method, url, data) {
		return authRespond;
	});

	$httpBackend.whenGET(/^.\/views\//).passThrough();

});