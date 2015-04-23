angular.module('blackRide').controller('aboutController', 
    [
        '$scope',
        'API_HOST',
        '$rootScope',
        '$state',
        '$http',
        'API_Key',
    function(
        $scope,
        API_HOST,
        $rootScope,
        $state,
        $http,
        API_Key
    ) {

        $scope.$on('authSuccess', function () {
            $http({
                url: API_HOST + '/fleet',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'API-key': API_Key,
                    'client-token': $rootScope.user.token.value
                }
            }).success(function (res) {
                $scope.fleet = res;
            });
        });

        $rootScope.$broadcast('signIn');

}]);