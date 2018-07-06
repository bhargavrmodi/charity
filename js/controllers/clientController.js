(function(){

	controllers.controller('clientCtrl', ['$scope','$rootScope','clientFac','FileUploader','$uibModal', function ($scope,$rootScope,clientFac,FileUploader,$uibModal) {
		
		$scope.clientList = [];
		//$scope.contactList = [{phone:"", emailid:"", fax:"",id:"0"}];
		var editable = false;
		$scope.industryTypes = [];
		var currentId = 1;
		$scope.collapse1 = true;
		$scope.submitted = false;
		$scope.record = {};
		$scope.record.id = 0;
		$scope.page = 1;
		//$scope.addressid = 0;
		//$scope.themeid = 0;
		$scope.clientFac = clientFac;
		
		$scope.options = {
			types: ['(cities)'],
			componentRestrictions: { country: 'FR' }
		};
	  
		$scope.onSelect = function($item,$model,$label) {
			$scope.record.parentId = $item.id;
			$scope.record.parentName = $item.name
		}

		$scope.isEditable = function(){
			return editable;
		}
		
		function setEditable(eValue){
			editable = eValue;
		}
		
		$scope.check = function(value) {
			if (value) {
			   $scope.save();
			}
			else{
				$scope.submitted = true;
				$scope.isDisabledclientName = true;
				$scope.isDisabledbrandName = true;  
				$scope.isDisabledindustrytypeName = true;
				$scope.isDisabledwebsiteName = true;
				$scope.isDisabledaddressName = true;
				$scope.isDisabledcountryName = true;
				$scope.isDisabledState = true;
				$scope.isDisabledCity = true;
				$scope.isDisabledZipCodeId = true;
				$scope.isDisabledPhoneNumber = true;   
				$scope.isDisabledContactEmail = true;  
				$scope.isDisabledFaxNumber = true;
			}
		}
		
		$rootScope.initializeClientList = function(){
			clientFac.setIsLoading(true);
			clientFac.getIndustryTypeList().then(function(data){
				$scope.industryTypes = data.data;
			});
			clientFac.getClientList().then(function(data){
				if(data.data.length == 0){
					setEditable(true);
					clientFac.setIsLoading(false);
				}else{
					setEditable(false);
					$scope.clientList = data.data;
					$scope.$broadcast('rebuild:me');
					$scope.showClient($scope.clientList[0].id);
				}
			});
		}
		
		$scope.addContact = function(id){
			$scope.record.orgContactsVO.push({phone:"", emailid:"", fax:"",id:"0"})
		}
		
		$scope.removeContact = function(index){
			$scope.record.orgContactsVO.splice(index, 1);
		}
		
		$scope.setCurrentClientId = function(id){
			currentId = id;
		}
		
		$scope.getCurrentClientId = function(){
			return currentId;
		}
		
		$scope.alreadyExists = function(clientName){
			$rootScope.skipPopup = true;
			console.info("clientName", clientName)
			clientFac.alreadyExist(clientName).success(function(){
				$scope.alreadyExistError = null;	
			}).error(function(response){
				$scope.alreadyExistError = response.errorDetailsMessage		
			})
		}
		
		$scope.showClient = function(clientId){
			if($scope.showNewClient){
				return false;
			}
			$scope.setCurrentClientId(clientId);
			reset();
			clientFac.getClient(clientId).success(function (clientDetails) {
				clientFac.setIsLoading(false);
				$scope.status = 'Client retrieved successfully.';
				$scope.record = clientDetails
				/*// Get General Information
				console.info("clientDetails", clientDetails)
				$scope.id = clientDetails.id;
				$scope.name = clientDetails.name;
				$scope.brandName = clientDetails.brandName;
				$scope.parentId = clientDetails.parentId;
				console.info($scope.clientList)
				for(var i=0; i<$scope.clientList.length; i++){
					if($scope.clientList[i].id == $scope.parentId){
						$scope.parentCompanyName = $scope.clientList[i].name;
					}
				}
				$scope.industrytypeId = clientDetails.industryTypeId;
				$scope.clientURL = clientDetails.clientURL;		
				$scope.description = clientDetails.description;
				
				// Get Administrator Details
				//$scope.userList = clientDetails.orgAdminVO;
				
				// Get Address Details
				$scope.addressid=clientDetails.addressVO.id;
				$scope.place = clientDetails.addressVO.addressline;
				//$scope.locality = clientDetails.addressVO.locality;
				$scope.address.components.country = clientDetails.addressVO.countryCode;
				$scope.address.components.state = clientDetails.addressVO.stateCode;
				$scope.address.components.city = clientDetails.addressVO.city;		
				$scope.address.components.postCode = clientDetails.addressVO.zipCodeId;
				
				// Get Contacts Details
				$scope.contactList = clientDetails.orgContactsVO;
				
				// Get Theme Details
				$scope.themeid=clientDetails.themeVO.id;
				$scope.tagline = clientDetails.themeVO.tagline;
				$scope.logo = clientDetails.themeVO.logo; */
				
				$scope.collapse1 = true;
				$scope.collapse2 = false;
				$scope.collapse3 = false;
				$scope.collapse4 = false;
				$scope.collapse5 = false;
			}).
				error(function (error) {
					$scope.status = 'Unable to add client';// + error.message;
			});
		}
		
		$scope.isSelected = function(checkTab){
			return $scope.record.id === checkTab;
		}
		
		$scope.add = function() {
			if($scope.showNewClient){
				return false;
			}
			$scope.showNewClient = !$scope.showNewClient;
			$scope.editable = !$scope.editable;
			setEditable(true);
			reset();
		}
		
		$scope.cancel = function(){
			if(!$scope.showNewClient){
				return false;
			}
			$scope.submitted = true;
			$scope.isDisabledclientName = true;
			$scope.isDisabledbrandName = true;  
			$scope.isDisabledindustrytypeName = true;
			$scope.isDisabledwebsiteName = true;
			$scope.isDisabledaddressName = true;
			$scope.isDisabledcountryName = true;
			$scope.isDisabledState = true;
			$scope.isDisabledCity = true;
			$scope.isDisabledZipCodeId = true;
			$scope.isDisabledPhoneNumber = true;   
			$scope.isDisabledContactEmail = true;  
			$scope.isDisabledFaxNumber = true;
			$scope.showNewClient = !$scope.showNewClient;
			$scope.editable = !$scope.editable;
			setEditable(false);
			$scope.showClient($scope.clientList[0].id);
		}
		
		//Edit
		$scope.edit = function(){
			if($scope.showNewClient){
				return false;
			}
			
			$scope.showNewClient = !$scope.showNewClient;
			$scope.editable = !$scope.editable;
			setEditable(true)
		}
		
		function reset(){
			/*var input = $('input');
			var tarea =  $('textarea');
			var sel =  $('select');
			input.val('');
			tarea.val('');
			sel.val('');
			input.trigger('input');
			tarea.trigger('textarea');
			sel.trigger('select');
			$scope.contactList = [{phone:"", emailid:"", fax:"",id:"0"}];
			$scope.id = 0;*/
			
			$scope.record = {};
			$scope.record.id = 0;
			$scope.record.addressVO = {};
			$scope.record.themeVO = {};
			$scope.record.addressVO.id = 0;
			$scope.record.themeVO.id = 0;
			$scope.record.orgContactsVO = [{phone:"", emailid:"", fax:"", id:"0"}];
			
			$scope.alreadyExistError = null;
			
			$scope.collapse1 = true;
			$scope.collapse2 = false;
			$scope.collapse3 = false;
			$scope.collapse4 = false;
			$scope.collapse5 = false;
			
			$scope.submitted = false;
			$scope.isDisabledclientName = false;
			$scope.isDisabledbrandName = false;  
			$scope.isDisabledindustrytypeName = false;
			$scope.isDisabledwebsiteName = false;
			$scope.isDisabledaddressName = false;
			$scope.isDisabledcountryName = false;
			$scope.isDisabledState = false;
			$scope.isDisabledCity = false;
			$scope.isDisabledZipCodeId = false;
			$scope.isDisabledPhoneNumber = false;   
			$scope.isDisabledContactEmail = false;  
			$scope.isDisabledFaxNumber = false;
		}
		
		//Save
		$scope.save = function(){
			
			if(!$scope.showNewClient){
				return false;
			}
			$scope.showNewClient = !$scope.showNewClient;
			$scope.editable = !$scope.editable;
			setEditable(false)
			
			if($scope.record.id == 0){
				flag = true;
			}else{
				flag = false;
			}
			
			/*var client = {
				// General Information
				id:$scope.id,
				name: $scope.name,
				clientURL: $scope.clientURL,
				brandName :$scope.brandName,
				parentId : $scope.parentId,
				industryTypeId:$scope.industrytypeId,
				description:$scope.description,
				
				// Add Administrator
				//orgAdminVO:$scope.userList,
				
				// Address
				"addressVO":{
					id:$scope.addressid,
					addressline: $scope.place,
					countryCode:$scope.address.components.country,
					stateCode:$scope.address.components.state,
					city:$scope.address.components.city,
					zipCodeId:$scope.address.components.postCode
				},
				// Contacts
				orgContactsVO : $scope.contactList,
			
				// Theme
				"themeVO":{
					id:$scope.themeid,
					tagline:$scope.tagline,
					logo:$scope.logo
				}
			};*/
			clientFac.addClient($scope.record).success(function(){
				$scope.status = 'Client added successfully.';
				if(flag){
					$uibModal.open({
					  animation: true,
					  ariaLabelledBy: 'modal-title-top',
					  ariaDescribedBy: 'modal-body-top',
					  templateUrl: 'js/controllers/popup.html',
					  backdrop: false,
					  controller: function($scope, $uibModalInstance, $state) {
						$scope.name = 'top';  
						$scope.ok = function () {
							$rootScope.initializeClientList();
							//$rootScope.$emit('updateOrgDetails', {orgTypeId:"3", orgId:"14"});
							$uibModalInstance.close();
						};
						$scope.navigateToUser = function(){
							$uibModalInstance.close();
							$state.go('User Management');
						}
						$scope.message = 'Client onboarded successfully';
						$scope.buttonName = "Create User";
					  }
					});
				}else{
					$uibModal.open({
					  animation: true,
					  ariaLabelledBy: 'modal-title-top',
					  ariaDescribedBy: 'modal-body-top',
					  templateUrl: 'js/controllers/popup.html',
					  backdrop: false,
					  controller: function($scope, $uibModalInstance) {
						$scope.name = 'top';  
						$scope.ok = function () {
							$rootScope.initializeClientList();
							$uibModalInstance.close();
						};
						$scope.message = 'Client updated successfully';
					  }
					});
				}
			}).error(function (error) {
				$scope.status = 'Unable to add client';// + error.message;
			});
		};
		
		var uploader = $scope.uploader = new FileUploader({
			queueLimit: 1,
			url: 'upload.php'
		});

		// FILTERS

		uploader.filters.push({
			name: 'imageFilter',
			fn: function(item /*{File|FileLikeObject}*/, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		// CALLBACKS

		uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
			console.info('onWhenAddingFileFailed', item, filter, options);
		};
		uploader.onAfterAddingFile = function(fileItem) {
			console.info('onAfterAddingFile', fileItem);
		};
		uploader.onAfterAddingAll = function(addedFileItems) {
			console.info('onAfterAddingAll', addedFileItems);
		};
		uploader.onBeforeUploadItem = function(item) {
			console.info('onBeforeUploadItem', item);
		};
		uploader.onProgressItem = function(fileItem, progress) {
			console.info('onProgressItem', fileItem, progress);
		};
		uploader.onProgressAll = function(progress) {
			console.info('onProgressAll', progress);
		};
		uploader.onSuccessItem = function(fileItem, response, status, headers) {
			console.info('onSuccessItem', fileItem, response, status, headers);
		};
		uploader.onErrorItem = function(fileItem, response, status, headers) {
			console.info('onErrorItem', fileItem, response, status, headers);
		};
		uploader.onCancelItem = function(fileItem, response, status, headers) {
			console.info('onCancelItem', fileItem, response, status, headers);
		};
		uploader.onCompleteItem = function(fileItem, response, status, headers) {
			console.info('onCompleteItem', fileItem, response, status, headers);
		};
		uploader.onCompleteAll = function() {
			console.info('onCompleteAll');
		};
	}]);
	
})();

