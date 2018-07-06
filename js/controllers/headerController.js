(function(){
	
	controllers.controller('headerCtrl', ['$scope','$http','$rootScope','$state','$window','$location', function ($scope,$http,$rootScope,$state,$window,$location) {

		if(!$window.sessionStorage.getItem("authenticated")){
			$state.go('/');
		}
		var thizz = this;
		this.selectedTab = null;
		
		$scope.showNavigationMenu = $window.sessionStorage.getItem("authenticated")? $window.sessionStorage.getItem("authenticated"): false;
		$scope.mainMenuItems = JSON.parse($window.sessionStorage.getItem("mainMenuItems"));
		$scope.topMenuItems = JSON.parse($window.sessionStorage.getItem("topMenuItems"));
		
		/*if(agreement=='true'){
			$scope.showNavigationMenu=false;
		}*/
		$scope.selectTab = function(setTab){
			thizz.selectedTab = setTab;
			$state.go(setTab);
		}
		
		$scope.getInitials = function(){
			var str = $window.sessionStorage.getItem("companyName");
			//console.info("str", str)
			if(str)
			return str.charAt(0).toUpperCase(); 
		}
		
		$scope.logout = function(){
			var logoutObj ={
				"userId": $window.sessionStorage.getItem("userId")
			}
			$http.post('/webapp/logout',logoutObj).success(function (logoutData) {
				$window.sessionStorage.clear();
				$window.location.reload();
				$state.go('/');
			}).error(function (error) {
				$window.sessionStorage.clear();
				$window.location.reload();
				$state.go('/');
			});
		}
		
		// Sets class of the selectedTab to 'active'.
		$scope.getTabClass = function(tab){
		   return thizz.selectedTab == tab ? "active" : "";
		};
		
		$scope.$on('authenticated', function(event, user) {
			$scope.user = user;
			//$scope.showNavigationMenu = user.authenticated;
			$scope.showNavigationMenu = $window.sessionStorage.getItem("authenticated");
			$scope.mainMenuItems = JSON.parse($window.sessionStorage.getItem("mainMenuItems"));
			$scope.topMenuItems = JSON.parse($window.sessionStorage.getItem("topMenuItems"));
		});
		
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
			console.log("state changed");
			// this is temporary till authentication is implemented
			if(toState != null && toState.name != "/" && toState.name != ""){
				thizz.showNavigationMenu = 'true';
				thizz.selectedTab = toState.name;
			}
			
		})
		
	}]);	
	
})();
