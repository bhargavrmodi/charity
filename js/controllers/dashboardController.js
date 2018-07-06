controllers.controller('dashboardCtrl', ['dashboardFac', '$scope', '$q', function (dashboardFac, $scope, $q) {
	var ctrl = this;
	$scope.mytask = "y";
    this.displayed = [];

    this.showAssignToDetails = function(assignedToName){
        $scope.assignedToName = assignedToName;
        $scope.completedDate = new Date();
        this.showAssignTo = true;
    }

    $scope.displayGrid =  function (stateId, showDesc){
    	showDesc = !showDesc;
    };

    $scope.callServer = function(tableState) {
		console.info("tableState", tableState)
        ctrl.isLoading = true;

        var pagination = tableState.pagination;

        // This is NOT the page number, but the index of item in the list that you want to use to display the table.
		var start = pagination.start || 0;
		
		// Number of entries showed per page.
        var number = pagination.number || 10;
        
		if(!tableState.myTask){
			tableState.myTask = 'y';
		}

        dashboardFac.getDashboard(start, number, tableState, tableState.myTask).then(function (response) {
			var deferred = $q.defer();
			dashboardFac.setPieChartArray (response.data.sitePhaseList,response.data.count)
			var dashboardItems = response.data.sites;
			var filtered = tableState.search.predicateObject ? $filter('filter')(dashboardItems, tableState.search.predicateObject) : dashboardItems;
			
			if (tableState.sort.predicate) {
				filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
			}
			
			var result = filtered.slice(start, start + number);
			  
			//note, the server passes the information about the data set size
			//deferred.resolve({
				//data: result,
				//numberOfPages: Math.ceil(filtered.length / number)
			//});
			
			//return deferred.promise;
			Highcharts.chart('container', {
			    xAxis: {
			        categories: dashboardFac.getSitePhasList()
			    },
				title: {
			        text: 'Campaign Overview (Line Graph)'
			    },
			    series: [{
			        data: dashboardFac.getCount()
			    }]
			});
			   
			Highcharts.chart('container1', {
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'pie'
				},
				title: {
					text: 'Campaign Overview (Pie Chart)'
				},
				tooltip: {
					pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							format: '<b>{point.name}</b>: {point.percentage:.1f} %',
							style: {
								color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
							}
						}
					}
				},
				series: [{
					name: 'Brands',
					colorByPoint: true,
					data: dashboardFac.getPieChartArray()
				}]
			});
			
			console.info("result", result)
			
			ctrl.displayed = result;
			
			//set the number of pages so the pagination can update
			tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
			
			//adding for progress bar
			ctrl.isLoading = false;
			
        });	
    };
}]);
