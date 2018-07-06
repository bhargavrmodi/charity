services.factory('dashboardFac', ['$http','$rootScope', function ($http, $rootScope) {

    var dashboardFac = {};
    var pieChartArray;
    var sitePhases = {};
    var sitePhasesCount = {};
    dashboardFac.getDashboard = function(start, number, params,myTask) {
    	//alert(myTask);
        return $http.get(URLUtil.getContractRestServiceURL() +'/dashboard/getSiteListByRole/'+myTask);
    };
    
    dashboardFac.getApprovalData = function(id,stateId) {
    	//alert(stateId);
    	if(stateId==1){
            return $http.get(URLUtil.getContractRestServiceURL() +'/operation/siterecci/'+id);
    	}else if(stateId==2){
            return $http.get(URLUtil.getContractRestServiceURL() +'/campaigndesign/list/'+id);
    	}else if(stateId==3){
    		 return $http.get(URLUtil.getContractRestServiceURL() +'/campaignfabrication/'+id);
    	}else if(stateId==4){
    		 return $http.get(URLUtil.getContractRestServiceURL() +'/campaignprinting/list/'+id);
    	}else{
    		 return $http.get(URLUtil.getContractRestServiceURL() +'/operation/siteinstallation/'+id);
    	}
        //return $http.get(URLUtil.getContractRestServiceURL() +'/operation/siterecci/'+siteId);
    };
    dashboardFac.getApprovalDataForRecci = function(siteId) {
    	//alert(siteId);
        return $http.get(URLUtil.getContractRestServiceURL() +'/operation/siterecci/'+siteId);
    };
    
    dashboardFac.getApprovalDataForDesign = function(campaignid) {
    	//alert(siteId);
        return $http.get(URLUtil.getContractRestServiceURL() +'/campaigndesign/list/'+campaignid);
    };
    
    dashboardFac.getApprovalDataForPrinting = function(campaignid) {
    	//alert(siteId);
        return $http.get(URLUtil.getContractRestServiceURL() +'/campaignprinting/list/'+campaignid);
    };
    
    dashboardFac.getApprovalDataForFabrication = function(campaignid) {
    	//alert(siteId);
        return $http.get(URLUtil.getContractRestServiceURL() +'/campaignfabrication/'+campaignid);
    };
    
    dashboardFac.getApprovalDataForInstallation = function(siteId) {
    	//alert(siteId);
        return $http.get(URLUtil.getContractRestServiceURL() +'/operation/siteinstallation/'+siteId);
    };
    
    dashboardFac.siteApproval = function ( sitedetailsVO) {   	
        
    		//alert(sitedetailsVO.siteid);
            return $http({

                method: 'POST',
                url: URLUtil.getContractRestServiceURL() + '/approvals/siteApproval',
                data: sitedetailsVO,
              headers: {'Content-Type':'application/json'}
            });
       

        
    };
    dashboardFac.setPieChartArray =  function (sitePhaseList, count){
    	//console.info("response datasss", sitePhaseList);
    	//console.info("response datasss", count);
    	var pCharArr="";
    	var pCharArrEnd="]";
    	for (var i=0; i<sitePhaseList.length ; i++){
    		pCharArr=pCharArr+"{ name :'"+sitePhaseList[i]+"',y:"+ count[i]+"}|";
    	}
    	pCharArr=pCharArr.substring(0,pCharArr.length-1);
    	var array = pCharArr.split("|");
    	//console.info("response datasss", array);
    	pieChartArray=array;
    	sitePhases = sitePhaseList;
    	sitePhasesCount=count;
    };
    
    dashboardFac.getPieChartArray =  function (){
    	var pieChartArray=[{name: 'RECY',
                y: 1
            }, {
                name: 'DESIGN',
                y: 0
            }, {
                name: 'FABRICATION',
                y: 0
            }, {
                name: 'PRINTING',
                y: 0
            }, {
                name: 'INSTALLATION',
                y: 0
            },
            {
                name: 'TOTALCOUNT',
                y: 1
            }];
    	console.info("grtyuiopp", pieChartArray);
    //	pieChartArray1=pieChartArray;
    	console.info("grtyuiopp", pieChartArray);
    	return pieChartArray;
    };
    dashboardFac.getSitePhasList =  function (){
    	
    	return sitePhases;
    };
  dashboardFac.getCount =  function (){
    	
    	return sitePhasesCount;
    };
    return dashboardFac;

}]);

/* services.factory('dashboardFac', ['$q', '$filter', '$timeout', '$http', function ($q, $filter, $timeout, $http) {

    //this would be the service to call your server, a standard bridge between your model an $http

	// the database (normally on your server)
	var dashboardItems = [];

	function getDashboardItems() {
		return $http.get(URLUtil.getContractRestServiceURL() +'/dashboard/getSiteListByRole');
	}

	getDashboardItems().then(function(data){
		console.info("data.data.sites", data.data.sites)
		dashboardItems = data.data.sites;
	})
	//fake call to the server, normally this service would serialize table state to send it to the server (with query parameters for example) and parse the response
	//in our case, it actually performs the logic which would happened in the server
	function getDashboard(start, number, params) {

		var deferred = $q.defer();
		console.info("dashboardItems", dashboardItems)
		var filtered = params.search.predicateObject ? $filter('filter')(dashboardItems, params.search.predicateObject) : dashboardItems;
		console.info("filtered", filtered)
		if (params.sort.predicate) {
			filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
		}
		
		
		
		var result = filtered.slice(start, start + number);

		//note, the server passes the information about the data set size
		deferred.resolve({
			data: result,
			numberOfPages: Math.ceil(filtered.length / number)
		});
		
		return deferred.promise;
	}

	return {
		getDashboard: getDashboard
	};

}]); */

/* services.factory('dashboardFac', ['$q', '$filter', '$timeout', function ($q, $filter, $timeout) {

    //this would be the service to call your server, a standard bridge between your model an $http

	// the database (normally on your server)
	var randomsItems = [];

	function createRandomItem(id) {
		var heroes = ['Batman', 'Superman', 'Robin', 'Thor', 'Hulk', 'Niki Larson', 'Stark', 'Bob Leponge'];
		return {
			id: id,
			name: heroes[Math.floor(Math.random() * 7)],
			age: Math.floor(Math.random() * 1000),
			saved: Math.floor(Math.random() * 10000)
		};

	}

	for (var i = 0; i < 1000; i++) {
		randomsItems.push(createRandomItem(i));
	}


	//fake call to the server, normally this service would serialize table state to send it to the server (with query parameters for example) and parse the response
	//in our case, it actually performs the logic which would happened in the server
	function getPage(start, number, params) {

		var deferred = $q.defer();

		var filtered = params.search.predicateObject ? $filter('filter')(randomsItems, params.search.predicateObject) : randomsItems;

		if (params.sort.predicate) {
			filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
		}

		var result = filtered.slice(start, start + number);

		$timeout(function () {
			//note, the server passes the information about the data set size
			deferred.resolve({
				data: result,
				numberOfPages: Math.ceil(filtered.length / number)
			});
		}, 1500);


		return deferred.promise;
	}

	return {
		getPage: getPage
	};

}]); */