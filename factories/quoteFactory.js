angular.module('darkRide').factory('QuoteFactory' , function () {

  var QuoteFactory = function () {   
    var _fleet_id = null;
    var _passenger_id = null;
    var _passenger_in_group = false;
    var _scheduled = null;
    var _scheduled_duration = 0.0;
    var _from = null;
    var _to = null;
    var _waypoints = [];
    var _sort_by = "price";
    var _max_results = 20;
    var _vehicle_type = 3;
    var _vehicle_size = 1;
    var _vehicle_energy_type = 6;
    var _driver_info = null;

    this.setFleet_id = function(fleet_id) { _fleet_id = fleet_id; } 
    this.getFleet_id = function() { return _fleet_id; } 
    this.setPassenger_id = function(passenger_id) { _passenger_id = passenger_id; } 
    this.getPassenger_id = function() { return _passenger_id; } 
    this.setPassenger_in_group = function(passenger_in_group) { _passenger_in_group = passenger_in_group; } 
    this.getPassenger_in_group = function() { return _passenger_in_group; } 
    this.setScheduled = function(scheduled) { _scheduled = scheduled; } 
    this.getScheduled = function() { return _scheduled; } 
    this.setScheduled_duration = function(scheduled_duration) { _scheduled_duration = scheduled_duration; } 
    this.getScheduled_duration = function() { return _scheduled_duration; } 
    this.setFrom = function(from) { _from = from; } 
    this.getFrom = function() { return _from; } 
    this.setTo = function(to) { _to = to; } 
    this.getTo = function() { return _to; } 
    this.setWaypoints = function(waypoints) { _waypoints = waypoints; } 
    this.getWaypoints = function() { return _waypoints; } 
    this.setSort_by = function(sort_by) { _sort_by = sort_by; } 
    this.getSort_by = function() { return _sort_by; } 
    this.setMax_results = function(max_results) { _max_results = max_results; } 
    this.getMax_results = function() { return _max_results; } 
    this.setVehicle_type = function(vehicle_type) { _vehicle_type = vehicle_type; } 
    this.getVehicle_type = function() { return _vehicle_type; } 
    this.setVehicle_size = function(vehicle_size) { _vehicle_size = vehicle_size; } 
    this.getVehicle_size = function() { return _vehicle_size; } 
    this.setVehicle_energy_type = function(vehicle_energy_type) { _vehicle_energy_type = vehicle_energy_type; } 
    this.getVehicle_energy_type = function() { return _vehicle_energy_type; } 
    this.setDriver_info = function(driver_info) { _driver_info = driver_info; } 
    this.getDriver_info = function() { return _driver_info; } 
  };

  return new QuoteFactory();

});