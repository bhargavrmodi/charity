directives.directive('showSites', showSites);

function showSites(){
	return {
        restrict : "A",
		require: "^stTable",
        link: function(scope, element, attrs, ctrl){
			element.on('click', function(){
				console.info("attrs", attrs)
				var tableState = ctrl.tableState();
				tableState.myTask = attrs.showSites;
				ctrl.pipe();
				
			})
		}
    };
}
