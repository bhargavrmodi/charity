(function(){
	
	controllers.controller('loginCtrl', ['$scope','$rootScope','$http','$state','$window','$uibModal','vendorFac','$sce', function ($scope,$rootScope,$http,$state,$window,$uibModal,vendorFac,$sce) {

		$scope.data = {
			username:null,
			password:null,
			status:null
		};
		var rootScope = $rootScope;
		var userroles =[
			{name:'User management', role:'user'},
			{name:'Vendor user management', role:'vuser'},
			{name:'Groups management', role:'groups'},
			{name:'Role management', role:'roles'},
			{name:'Region management', role:'regions'}
		];
		
		var url = $window.location.pathname;
		$scope.companyCode = url.substring(url.lastIndexOf('/')+1);
		
		function openAgreementPopup(){
			vendorFac.downloadAgreementPdf().then(function(response){
				if(response.data.byteLength === 0){
					$state.go('home');
				}else{
					$uibModal.open({
					  animation: true,
					  ariaLabelledBy: 'modal-title-top',
					  ariaDescribedBy: 'modal-body-top',
					  size: 'lg',
					  backdrop: false,
					  windowClass: 'agreement',
					  templateUrl: 'templates/vendors/agreementpdf.html',
					  controller: function($scope, $uibModalInstance) {
						$scope.pdfUrl = '';
						$scope.pdfName = 'test';
						$scope.scroll = 0;
						$scope.loading = 'loading';

						$scope.getNavStyle = function(scroll) {
							if(scroll > 100) return 'pdf-controls fixed';
							else return 'pdf-controls';
						}

						$scope.onError = function(error) {
							console.log(error);
						}

						$scope.onLoad = function() {
							$scope.loading = '';
						}

						$scope.onProgress = function (progressData) {
							console.log(progressData);
						};
						
						$scope.initializeAgreementPdf = function(){
							vendorFac.downloadAgreementPdf().then(function(response){
								if(response.data.byteLength===0){
									//$window.sessionStorage.setItem("authenticated",'true');
									$state.go('home');
								}else{
									var file = new Blob([response.data], {type: 'application/pdf'});
									var fileURL = URL.createObjectURL(file);
									$scope.pdfUrl = $sce.trustAsResourceUrl(fileURL);
								}

							});
						}
						/*$scope.downloadFile = function () {
							vendorFac.downloadAgreementPdf().then(function (response) {
								var blob = new Blob([response.data], { type: "application/octet-stream" });
								var blobURL = (window.URL || window.webkitURL).createObjectURL(blob);
								var anchor = document.createElement("a");
								anchor.download = "V.xlsx";
								anchor.href = blobURL;
								anchor.click();
							},
							function (error) {
							});
						};*/
						$scope.submit = function(){
							if($scope.checked){
								vendorFac.submit().then(function(response){
									//$window.sessionStorage.setItem("authenticated",'true');
									$uibModalInstance.close();
									$state.go('home');
								},
								function (error){
									$window.sessionStorage.clear();
									$window.location.reload();
									$state.go('/');
								});
							}else{
								return;
							}
						}
						
						$rootScope.cancel = function(){
							$window.sessionStorage.clear();
							$window.location.reload();
							$state.go('/');
						}
					  }
					});
					//var file = new Blob([response.data], {type: 'application/pdf'});
					//var fileURL = URL.createObjectURL(file);
					//$rootScope.pdfUrl = $sce.trustAsResourceUrl(fileURL);
				}

			});
		}
		
		if($window.sessionStorage.getItem("orgType") && $window.sessionStorage.getItem("orgType")==='Vendor'){
			openAgreementPopup();
		}
		
		/* var setCompanyCode = function(companyCode){
			cosole.info("companyCode", companyCode)
			$scope.companyCode = companyCode;
		}; */
		
		$scope.login = function(){
			$rootScope.skipPopup = true;
			var loginVO ={
				username:this.data.username,
				password:this.data.password,
				companyCode:$scope.companyCode
			}
			
			$http.post('/webapp/login',loginVO).success(function (loginData) {
				console.info("loginData", loginData)
				$window.sessionStorage.setItem("companyName",$scope.companyCode);
				$window.sessionStorage.setItem("authenticated",'true');
				$window.sessionStorage.setItem("userId",loginData.User.id);
				$window.sessionStorage.setItem("mainMenuItems",JSON.stringify(loginData.Screen.mainMenuItems));
				$window.sessionStorage.setItem("topMenuItems",JSON.stringify(loginData.Screen.topMenuItems));
				$window.sessionStorage.setItem("isCompanyProjectHead",JSON.stringify(loginData.Screen.companyProjectHead));
				rootScope.$broadcast('authenticated', {username:$scope.data.username,companyCode:$scope.data.companyCode});
				if(loginData.User.orgType==='Vendor'){
					openAgreementPopup();
					//$state.go("agreement");
				}else{
					$state.go("home");
				}
			}).error(function (error) {
				console.info("error", error)
				//$window.sessionStorage.setItem("authenticated",'false');
				/* rootScope.$broadcast('authenticated', {authenticated:false}); */
				$scope.data.username = null;
				$scope.data.password = null;
				$scope.data.status = error.Error;
				$state.go("/");
			});
		}
		
	}]);	
	
})();
