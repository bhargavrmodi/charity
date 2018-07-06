directives.directive('signageHeader', signageHeader);

function signageHeader(){
	return {
        restrict : "E",
        templateUrl : "templates/common/header.html"
    };
}