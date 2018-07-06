directives.directive('clients', clients);
directives.directive('displayClients', displayClients);
directives.directive('addEditClients', addEditClients);

function clients(){
	return {
        restrict : "E",
        templateUrl : "templates/clients/clients.html"
    };
}

function displayClients(){
	return {
        restrict : "E",
        templateUrl : "templates/clients/displayClients.html"
    };
}

function addEditClients(){
	return {
        restrict : "E",
        templateUrl : "templates/clients/addEditClients.html"
    };
}
