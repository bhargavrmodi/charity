services.factory('clientFac', ['$http','$rootScope', function ($http,$rootScope) {

    var clientFac = {};
	var isLoading = false;

    clientFac.getClientList = function () {
        return $http.get(URLUtil.getOrgRestServiceURL() +'/client/list');
    };

    clientFac.addClient = function (client) {
        return $http.post(URLUtil.getOrgRestServiceURL() + '/client/add', client);
    };
    
    clientFac.getClient = function (clientId) {
        return $http.get(URLUtil.getOrgRestServiceURL() + '/client/getClient/'+clientId);
    };
    
    clientFac.getIndustryTypeList = function (){
    	return $http.get(URLUtil.getOrgRestServiceURL() + '/industries');
    };
	
	clientFac.setIsLoading = function(loading){
		isLoading = loading;
	};
	
	clientFac.isLoading = function(){
		return isLoading;
	};
	
	clientFac.alreadyExist = function(clientname){
		return $http.get(URLUtil.getOrgRestServiceURL() + '/client/clientnamecheck/'+clientname);
	};
	
    return clientFac;

}]);