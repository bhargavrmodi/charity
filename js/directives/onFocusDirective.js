directives.directive('onFocus', onFocus);

function onFocus($timeout) {
	return function(scope, element, attrs) {
		scope.$watch(attrs.onFocus, function (newValue) {
			if (newValue) {
				$timeout(function () {
					element.focus();
				}, 0, false);
			}
		}); 
	}; 
}	  