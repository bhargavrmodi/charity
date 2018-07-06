var app = angular.module('starter', ['ui.router','ui.bootstrap','angularFileUpload','smart-table','starter.controllers', 'starter.services','starter.directives','starter.factories']);

URLUtil.initializeBaseURL();

var services = angular.module('starter.services', [])
var controllers = angular.module('starter.controllers', ['ngSanitize','720kb.datepicker','vsGoogleAutocomplete','checklist-model','ngScrollbar']);
var directives = angular.module('starter.directives', []);
var factories = angular.module('starter.factories', []);

app.config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider,$urlRouterProvider,$httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
	var spinnerFunction = function (data, headersGetter) {
		// todo start the spinner here
		$('#mydiv').show();
		return data;
	};
//	$httpProvider.defaults.headers.common['X-Authorization'] = globalVar.token
	$httpProvider.defaults.transformRequest.push(spinnerFunction);
	
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: "templates/login.html",
    		controller: 'loginCtrl'
        })
		.state('home', {
            url: '/home',
            templateUrl: "templates/dashboard/dashboard.html"
        })
        .state('setup', {
            url: '/setup',
            templateUrl: "templates/setup/setup.html",
    		controller: 'setupCtrl'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: "templates/settings/settings.html",
    		controller: 'settingsCtrl'
        })
		.state('Clients', {
            url: '/clients',
            templateUrl: "templates/clients/clients.html",
    		controller: 'clientCtrl'
        })
		.state('Vendors', {
            url: '/vendors',
            templateUrl: "templates/vendors/vendors.html",
    		controller: 'vendorCtrl'
        })
		.state('Proposals', {
            url: '/proposals',
            templateUrl: "templates/proposals/proposals.html",
    		controller: 'proposalCtrl'
        })
		.state('Campaigns', {
            url: '/campaigns',
            templateUrl: "templates/campaigns/campaigns.html",
    		controller: 'campaignCtrl'
        })
		.state('User Management', {
            url: '/user',
            templateUrl: "templates/user/user.html",
    		controller: 'userCtrl'
        })
        .state('vuser', {
			url: '/vuser',
			templateUrl: "templates/user/vendoruser.html",
			controller: 'vuserCtrl'
		})
		.state('Role Management', {
			url: '/roles',
			templateUrl: "templates/role/roles.html",
			controller: 'MoveCtrl'
		})
        .state('Region Management', {
			url: '/regions',
			templateUrl: "templates/region/regions.html",
			controller: 'regionCtrl'
		})
		.state('Aprroval', {
            url: '/approval/:siteId/:stateId',
            templateUrl: "templates/approval/approval.html",
            controller: 'approvalCtrl'
        })
		.state('profile', {
            url: '/profile',
            templateUrl: "templates/password/password.html",
            controller: 'passwordCtrl'
        })
}])

app.factory('myHttpInterceptor', function ($q, $window, $injector, $rootScope) {
	var numLoadings = 0;
	var messages = [];
	return {
		response: function(response) {
			if(response.headers('X-Authorization') != null){
				$window.sessionStorage.setItem("token",response.headers('X-Authorization'));
			}
			
			if(response.headers('orgType') != null){
				$window.sessionStorage.setItem("orgType",response.headers('orgType'));
			}
			
			if(response.headers('vendorId') != null){
				$window.sessionStorage.setItem("vendorId",response.headers('vendorId'));
			}
			
			if ((--numLoadings) === 0) {
                // Hide loader
                $('#mydiv').hide();
            }
			
			return response;
		},
		request: function(request) {
			numLoadings++;
			if($window.sessionStorage.getItem("token") != null){
				request.headers['X-Authorization'] = $window.sessionStorage.getItem("token");
			}
			
			if($window.sessionStorage.getItem("orgType") != null){
				request.headers['orgType'] = $window.sessionStorage.getItem("orgType");
			}
			
			if($window.sessionStorage.getItem("vendorId") != null){
				request.headers['vendorId'] = $window.sessionStorage.getItem("vendorId");
			}
			
			$('#mydiv').show();
			return request;
		},
		responseError: function(response) {
			
			messages.push(response.data);
			if (!(--numLoadings)) {
                // Hide loader
                $('#mydiv').hide();
				if(!$rootScope.skipPopup){
					$rootScope.skipPopup = false;
					$injector.get('$uibModal').open({
					  templateUrl: 'templates/errorPopup.html',
					  controller: function($scope, $uibModalInstance) {
						$scope.name = 'top';
						$scope.ok = function () {
							messages = [];
							$uibModalInstance.close();
						};
						$scope.messages = messages;
					  }
					});
				}
            }
			
			return $q.reject(response);
		}
	};
});
