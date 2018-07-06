directives.directive('login', signageHeader);

function signageHeader(){
	return {
        restrict : "E",
        templateUrl : "templates/login.html"
    };
}