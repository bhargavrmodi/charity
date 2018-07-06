(function(){
	
	controllers.controller('passwordCtrl',['$scope','$rootScope','$http','pwdFac','$uibModal','$filter','$state', function($scope,$rootScope,$http, pwdFac,$uibModal,$filter,$state) {
		
			$scope.data = {
					oldpassword:null,
					newpassword:null,
					confirmpassword:null
			};
			var rootScope = $rootScope;
			setCompanyCode=function(companyCode){
				$scope.companyCode = companyCode;
			};
			
			$scope.pwdChange = function(){
				var changePasswordVO ={
						oldPassword:this.data.oldpassword,
						newPassword:this.data.newpassword,
						confirmPassword:this.data.confirmpassword
				}
				
				$http.post('/userrestservice/changepwd',changePasswordVO).success(function (passwordData) {
						//rootScope.$broadcast('authenticated', {authenticated:true,username:$scope.data.username,password:$scope.data.password,role:"Super Admin", userroles:userroles,companyCode:$scope.data.companyCode});
						console.log("password change successful")
						$uibModal.open({
				  animation: true,
				  ariaLabelledBy: 'modal-title-top',
				  ariaDescribedBy: 'modal-body-top',
				  templateUrl: 'js/controllers/popup.html',
				  size: 'sm',
				  controller: function($scope, $uibModalInstance) {
					$scope.name = 'top';  
					$scope.ok = function () {
						$uibModalInstance.close();
						$state.go("home");
					};
					if(passwordData.field!="error"){
					$scope.message = 'Password change successfully.';
					}else{
						$scope.message = passwordData.message;
					}
				  }
				});
				}).error(function (error) {
					//rootScope.$broadcast('authenticated', {authenticated:false});
					$scope.data.oldpassword = null;
					$scope.data.newpassword = null;
					$scope.data.confirmpassword = null;
					$scope.data.status="Change password failed.";
					//$state.go("/");
				});
			}
	}]);
	
})();  
