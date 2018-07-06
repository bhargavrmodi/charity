(function(){
	
	controllers.controller('vendorCtrl', ['$scope','$rootScope','vendorFac','FileUploader','$uibModal', function ($scope,$rootScope,vendorFac,FileUploader,$uibModal) {
		
		$scope.vendorList = [];
		$scope.vendorTypes = [];
		$scope.industryTypes = [];
		//$scope.userList = [{firstName:"", lastName:"", emailid:"", phone:"",id:"0"}];
		//$scope.contactList = [{phone:"", emailid:"", fax:"",id:"0"}];
		var editable = false;
		//$scope.id = 0;
		//$scope.addressid = 0;
		//$scope.themeid = 0;
		$scope.record = {};
		$scope.record.id = 0;
		$scope.vendortypeid = 0;
		$scope.page = 1;
		var oprtypelist = [];
		$scope.collapse1 = true;
		$scope.submitted = false;
		$scope.vendorFac = vendorFac;
		
		$scope.onSelect = function($item,$model,$label) {
			$scope.record.parentId = $item.id; 
			$scope.record.parentName = $item.name;
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
				$scope.isDisabledvendorName = true;
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
		
		$scope.isSelectedVendorType = function(){
			
			for(k in $scope.vendorTypes){
				if($scope.vendorTypes[k].isChecked)
				return true;
			}
			return false;
		}
		
		$rootScope.initializeVendorList = function(){
			vendorFac.setIsLoading(true);
			vendorFac.getVendorTypeList().then(function(data){
				$scope.vendorTypes = data.data;
			});
			/* vendorFac.getIndustryTypeList().then(function(data){
				$scope.industryTypes = data.data;
			}); */
			vendorFac.getVendorList().then(function(data){
				if(data.data.length == 0){
					setEditable(true)
					vendorFac.setIsLoading(false);
				}else{
					setEditable(false);
					$scope.vendorList = data.data;
					$scope.$broadcast('rebuild:me');
					$scope.showVendor($scope.vendorList[0].id);
				}
			});
		}
		
		$scope.addContact = function(id){
			$scope.record.orgContactsVO.push({phone:"", emailid:"", fax:"",id:"0"})
		}
		
		$scope.removeContact = function(index){
			$scope.record.orgContactsVO.splice(index, 1);
		}
		
		$scope.alreadyExists = function(vendorname){
			$rootScope.skipPopup = true;
			console.info("vendorname", vendorname)
			vendorFac.alreadyExist(vendorname).success(function(){
				$scope.alreadyExistError = null;
			}).error(function(response){
				$scope.alreadyExistError = response.errorDetailsMessage
			})
		}
		
		$scope.showVendor = function(vendorId){
			if($scope.showNewVendor){
				return false;
			}
			reset();
			vendorFac.getVendor(vendorId).success(function (vendorDetails) {
				
				vendorFac.setIsLoading(false);
				$scope.status = 'Vendor retrieved successfully.';
				$scope.record = vendorDetails;
				
				for(k in $scope.vendorTypes){
					$scope.vendorTypes[k].isChecked = false;
				}
				
				for(j in vendorDetails.vendorOpTypVO){
					for(k in $scope.vendorTypes){
						if($scope.vendorTypes[k].id == vendorDetails.vendorOpTypVO[j].operationtypeid){
							$scope.vendorTypes[k].isChecked = true;
						}
					}
				}
				
				/* // Get General Information
				$scope.id = vendorDetails.id;
				$scope.name = vendorDetails.name;
				
				$scope.parentId = vendorDetails.parentId;
				for(var i=0; i<$scope.vendorList.length; i++){
					if($scope.vendorList[i].id == $scope.parentId){
						$scope.parentCompanyName = $scope.vendorList[i].name;
					}
				}
				
				$scope.industrytype = vendorDetails.industryTypeId;
				$scope.vendorURL = vendorDetails.vendorURL;		
				$scope.description = vendorDetails.description;
				
				// Get Administrator Details
				//$scope.vendortypeid = vendorDetails.vendorOpTypVO.id;
				for(j in vendorDetails.vendorOpTypVO){
					for(k in $scope.vendorTypes){
						if($scope.vendorTypes[k].id == vendorDetails.vendorOpTypVO[j].operationtypeid){
							$scope.vendorTypes[k].isChecked = true;
						}
					}
				}
				
				// Get Address Details
				$scope.addressid = vendorDetails.addressVO.id;
				$scope.place = vendorDetails.addressVO.addressline;
				$scope.address.components.country = vendorDetails.addressVO.countryCode;
				$scope.address.components.state = vendorDetails.addressVO.stateCode;
				$scope.address.components.city = vendorDetails.addressVO.city;		
				$scope.address.components.postCode = vendorDetails.addressVO.zipCodeId;
				
				// Get Contacts Details
				$scope.contactList = vendorDetails.orgContactsVO;
				
				// Get Theme Details
				$scope.themeid = vendorDetails.themeVO.id;
				$scope.tagline = vendorDetails.themeVO.tagline;
				$scope.logo = vendorDetails.themeVO.logo; */
				
			}).error(function (error) {
				$scope.status = 'Unable to add vendor';// + error.message;
			});	
		}
		
		$scope.isSelected = function(checkTab){
			return $scope.record.id === checkTab;
		}
		
		$scope.add = function() {
			if($scope.showNewVendor){
				return false;
			}
			$scope.showNewVendor = !$scope.showNewVendor;
			$scope.editable = !$scope.editable;
			setEditable(true);
			reset();
		}
		
		$scope.cancel = function(){
			if(!$scope.showNewVendor){
				return false;
			}
			$scope.submitted = false;
			$scope.isDisabledvendorName = false;
			$scope.isDisabledwebsiteName = false;  	
			$scope.isDisabledaddressName = false;
			$scope.isDisabledcountryName = false;
			$scope.isDisabledState = false;
			$scope.isDisabledCity = false;
			$scope.isDisabledZipCodeId = false;
			$scope.isDisabledPhoneNumber = false;   
			$scope.isDisabledContactEmail = false;  
			$scope.isDisabledFaxNumber = false;
			$scope.showNewVendor = !$scope.showNewVendor;
			$scope.editable = !$scope.editable;
			setEditable(false)
			$scope.showVendor($scope.vendorList[0].id);
		}
		
		//Edit
		$scope.edit = function(){
			if($scope.showNewVendor){
				return false;
			}
			$scope.showNewVendor = !$scope.showNewVendor;
			$scope.editable = !$scope.editable;
			setEditable(true)
		}
		
		function reset(){
			/* var input = $('input');
			var tarea =  $('textarea');
			var sel =  $('select');
			input.val('');
			tarea.val('');
			sel.val('');
			input.trigger('input');
			tarea.trigger('textarea');
			sel.trigger('select');
			$scope.id = 0;
			for(k in $scope.vendorTypes){
				$scope.vendorTypes[k].isChecked = false;
			}
			//$scope.vendortypeid = 0;
			$scope.addressid = 0;
			$scope.themeid = 0;
			$scope.contactList = [{phone:"", emailid:"", fax:"",id:"0"}]; */
			
			$scope.record = {};
			$scope.record.id = 0;
			$scope.record.addressVO = {};
			$scope.record.themeVO = {};
			$scope.record.addressVO.id = 0;
			$scope.record.themeVO.id = 0;
			$scope.record.orgContactsVO = [{phone:"", emailid:"", fax:"", id:"0"}];
			$scope.record.vendorOpTypVO = [];
			$scope.vendortypeid = 0;
			for(k in $scope.vendorTypes){
				$scope.vendorTypes[k].isChecked = false;
			}
			
			$scope.collapse1 = true;
			$scope.collapse2 = false;
			$scope.collapse3 = false;
			$scope.collapse4 = false;
			$scope.collapse5 = false;
			
			$scope.alreadyExistError = null;
			
			$scope.submitted = false;
			$scope.isDisabledvendorName = false;
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
			if(!$scope.showNewVendor){
				return false;
			}
			$scope.showNewVendor = !$scope.showNewVendor;
			$scope.editable = !$scope.editable;
			setEditable(false);
			
			if($scope.record.id == 0){
				flag = true;
			}else{
				flag = false;
			}
			
			if($scope.vendorTypes && $scope.vendorTypes.length > 0){
				for(i in $scope.vendorTypes){
					if($scope.vendorTypes[i].isChecked){
						$scope.record.vendorOpTypVO.push({"id":$scope.vendortypeid,"operationtypeid":$scope.vendorTypes[i].id});
					}
				}
			}
			
			/* if($scope.vendorTypes && $scope.vendorTypes.length > 0){
				for(i in $scope.vendorTypes){
					if($scope.vendorTypes[i].isChecked){
						oprtypelist.push({"id":$scope.vendortypeid,"operationtypeid":$scope.vendorTypes[i].id});
					}
				}
			}
			
			var vendor = {
				// General Information
				id:$scope.id,
				name: $scope.name,
				vendorURL: $scope.vendorURL,
				vendorTypeId :$scope.vendorType,
				parentId : $scope.parentId,
				description:$scope.description,
				
				// Add Administrator
				"vendorOpTypVO":oprtypelist,
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
			}; */
			
			vendorFac.addVendor($scope.record).success(function () {
				$scope.status = 'Vendor added successfully.';
				if(flag){
					$uibModal.open({
					  animation: true,
					  ariaLabelledBy: 'modal-title-top',
					  ariaDescribedBy: 'modal-body-top',
					  templateUrl: 'js/controllers/popup.html',
					  size: 'sm',
					  controller: function($scope, $uibModalInstance) {
						$scope.name = 'top';  
						$scope.ok = function () {
							$rootScope.initializeVendorList();
							$rootScope.$emit('updateOrgDetails', {orgTypeId:"3", orgId:"14"});
							$uibModalInstance.close();
						};
						$scope.message = 'Vendor Onboarded successfully';
						$scope.buttonName = "Create User";
					  }
					});
				}else{
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
						};
						$scope.message = 'Vendor updated successfully';
					  }
					});
				}
			}).error(function (error) {
				$scope.status = 'Unable to add vendor';// + error.message;
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
