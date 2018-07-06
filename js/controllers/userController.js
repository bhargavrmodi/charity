(function(){
	
	controllers.controller('userCtrl', ['$scope','$rootScope','userFac','datePickerFac','$uibModal','$filter','$window', function ($scope,$rootScope,userFac,datePickerFac,$uibModal,$filter,$window) {
		
		$scope.userList = [];  
		//$scope.contactList = [{phone:"", emailid:""}];
		
		$scope.userShow = false;
		$scope.companyID = 1;
		$scope.clientID = 1;
		//$scope.showUser = false;
		$scope.currentUser;
		$scope.noUser = false;
		//$scope.selectedRoles = [];
		$scope.allRoles = [];
		$scope.orgTypesResponse = [];
		$scope.orgListResponse = [];
		$scope.showNewUser = false;
		var editable = false;
		$scope.submitted = false;
		$scope.page = 1;
		
		$scope.record = {};
		$scope.record.id = 0;
		$scope.record.roles = [];
		$scope.orgType = $window.sessionStorage.getItem("orgType");
		$scope.userFac = userFac;
		
		/* $scope.$watch('orgTypeId', function(oldVal, newVal) {
			userFac.getOrgs(orgTypeId, '1').then(function(response){
				$scope.orgListResponse = response.data;
			})
		}); */
		
		$scope.getOrgs = function(id, cid){
			userFac.getOrgs(id, cid).then(function(response){
				$scope.orgListResponse = response.data;
			})
		}
		
		$scope.showOrganisation = function(){
			for(var k in $scope.orgTypesResponse){
				if ($scope.orgTypesResponse[k].id == $scope.record.orgtypeid && ($scope.orgTypesResponse[k].name == 'Company' || $scope.orgTypesResponse[k].name == 'SubCompany')){
					return false;
				}
			}
			return true;
		}
		
		$scope.moveItem = function(item, from, to) {
			console.log('Move item   Item: '+item+' From:: '+from+' To:: '+to);
			//Here from is returned as blank and to as undefined
			var idx=from.indexOf(item);
			if (idx != -1) {
				from.splice(idx, 1);
				to.push(item);      
			}
		};
		
		$scope.moveAll = function(from, to) {
			console.log('Move all  From:: '+from+' To:: '+to);
			//Here from is returned as blank and to as undefined
			angular.forEach(from, function(item) {
				to.push(item);
			});
			from.length = 0;
		};
		
		
		$scope.check = function(value) {
			if (value && $scope.record.roles.length > 0) {
			   $scope.save();
			}
			else{
				$scope.submitted = true;
				$scope.isDisabledOrganisationType = true;
				$scope.isDisabledOrganisation = true;
				$scope.isDisabledFirstName = true;
				$scope.isDisabledLastName = true;
				$scope.isDisabledDateOfBirth = true; 
				$scope.isDisabledaddressName = true;
				$scope.isDisabledcountryName = true;
				$scope.isDisabledState = true;
				$scope.isDisabledCity = true;
				$scope.isDisabledZipCodeId = true;   
				$scope.isDisabledphoneNumber = true;   
				$scope.isDisabledcontactEmail = true;
			}
		}
		
		$scope.phoneAlreadyExist = function(phonenumber){
			$rootScope.skipPopup = true;
			console.info("phonenumber", phonenumber)
			userFac.phoneAlreadyExist(phonenumber).success(function(){
				$scope.phoneAlreadyExistError = null;	
			}).error(function(response){
				$scope.phoneAlreadyExistError = response.errorDetailsMessage		
			})
		}
		
		$scope.emailAlreadyExist = function(email){
			$rootScope.skipPopup = true;
			console.info("email", email)
			userFac.emailAlreadyExist(email).success(function(){
				$scope.emailAlreadyExistError = null;	
			}).error(function(response){
				$scope.emailAlreadyExistError = response.errorDetailsMessage		
			})
		}
		
		/* $scope.groupsList = [
			{showRemoveBtn: true, groupId: 0, name:"Group 1", RolesID:[0, 1, 2, 3]},
			{showRemoveBtn: true, groupId: 1, name:"Group 2", RolesID:[0, 1]},
			{showRemoveBtn: true, groupId: 2, name:"Group 3", RolesID:[0,]},
			{showRemoveBtn: true, groupId: 3, name:"Group 4", RolesID:[3, 1, 2]}
		];
		
		$scope.rolesList = [
			{showRemoveBtn: true, roleId: 0, name:"Role 1", previlageID:[0, 1, 2, 3]},
			{showRemoveBtn: true, roleId: 1, name:"Role 2", previlageID:[0]},
			{showRemoveBtn: true, roleId: 2, name:"Role 3", previlageID:[0,1, 2]},
			{showRemoveBtn: true, roleId: 3, name:"Role 4", previlageID:[0, 1]}
		];
		
		$scope.roleList = [];
		
		$scope.privilagesList = [
			{showRemoveBtn: true, id: 0, name:"privilage 1"},
			{showRemoveBtn: true, id: 1, name:"privilage 2"},
			{showRemoveBtn: true, id: 2, name:"privilage 3"},
			{showRemoveBtn: true, id: 3, name:"privilage 4"}
		]; */
		
		//$scope.privilageList = [];
		
		$scope.isEditable = function(){
			return editable;
		}
		
		function setEditable(eValue){
			editable = eValue;
		}
		
		$rootScope.initializeUserList = function(){
			userFac.setIsLoading(true);
			userFac.getOrgTypes().then(function(response){
				$scope.orgTypesResponse = response.data;
			});
			userFac.getRoles().then(function(reponse){
				$scope.allRoles = reponse.data;
			});
			userFac.getUserList($scope.companyID).then(function(data){
				if(data.data.length == 0){
					setEditable(true)
					userFac.setIsLoading(false);
				}else{
					setEditable(false);
					$scope.userList = data.data;
					$scope.$broadcast('rebuild:me');
					$scope.showUser($scope.userList[0].id);
				}
			});               
		}

		var modal;
		$scope.openGroups = function(){
			$scope.checkedGroups = [];
			$scope.selectedGroups = [];
			modal = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'groupsPopup.html',
				size: 'sm',
				scope:$scope,
				controller: function($scope, $uibModalInstance) {
					$scope.ok = function () {
						$uibModalInstance.close();
					};
					$scope.selectedGroups = [];
						  angular.forEach($scope.groupsList, function(group){
							if (!!group.selected) $scope.selectedGroups.push(group.name);
					});
				}
			});
		}
		
		/* $scope.callGroups = function() { 
			modal.close();
			for (var i = 0; i < $scope.checkedGroups.length; i++) {
				if ($scope.checkedGroups[i] == $scope.groupsList[i].groupId ) {
					$scope.groupList.push($scope.groupsList[i]);
				}
			}
			$scope.showGroup(0); 
		}
		
		$scope.showGroup = function(groupID){
			$scope.roleList = [];
			$scope.roles = $scope.groupList[groupID].RolesID;
			for (var i = 0; i < $scope.roles.length; i++) {
				if ($scope.rolesList[i].roleId == $scope.roles[i] ) {
					$scope.roleList.push($scope.rolesList[i]);
				}
			}
			$scope.showRoles(0); 
		} */
		
		$scope.showRoles = function(roleId){
			$scope.privilageList = [];
			$scope.privilage = $scope.roleList[roleId].previlageID;
			for (var i = 0; i < $scope.privilagesList.length; i++) {
				if ($scope.privilagesList[i].id == $scope.privilage[i] ) {
					$scope.privilageList.push($scope.privilagesList[i]);
				}
			}
		}
		
		/* $scope.addGroup = function(id){
			$scope.groupList.push({showRemoveBtn: true, groupId: id, name:"Group 1", RolesID:[]})
		}
		
		$scope.removeGroup = function(index){
			$scope.groupList.splice(index, 1);
		} */
		
		/* $scope.selectGroup = function(index){
			$scope.currentGroup = $scope.groupList.groupId[index];
		} */
		
		$scope.removeUser = function(userId){
			$scope.showNewUser = !$scope.showNewUser;
			$scope.editable = !$scope.editable;
			setEditable(false);
			userFac.deleteUser(userId).success(function () {
				$scope.status = 'User deleted successfully.';
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
					$scope.message = 'User deleted successfully';
				  }
				});
				$rootScope.initializeUserList();
			}).error(function (error) {
				$scope.status = 'Unable to delete User';// + error.message;
			});
		}
		
		$scope.addContact = function(id){
			$scope.record.userContactInfo.push({phone:"", emailid:""})
		}
		
		$scope.removeContact = function(index){
			$scope.record.userContactInfo.splice(index, 1);
		}
		
		$scope.showUser = function(userId){
			if($scope.showNewUser){
				return false;
			}
			reset();
			userFac.getUser(userId).success(function (userDetails) {
				console.log(userDetails);
				userFac.setIsLoading(false);
				
				userFac.getOrgs(userDetails.orgtypeid).then(function(response){
					$scope.orgListResponse = response.data;
				});
				
				$scope.record = userDetails;
				//$scope.record.dob = $filter('date')($scope.record.dob, "dd/MM/yyyy");
				$scope.status = 'User retrieved successfully.';
				
				/* // Get General Information
				$scope.id =  userDetails.id;
				$scope.orgTypeId = userDetails.orgtypeid;
				$scope.firstName = userDetails.firstname;
				$scope.lastName = userDetails.lastname;
				$scope.dob = $filter('date')(userDetails.dob, "dd/MM/yyyy");
				$scope.industrytypeId = userDetails.industryTypeId;
				$scope.isActive = userDetails.isActive;
						
				// Get Address Details
				$scope.place = userDetails.userAddress.addressline;
				//$scope.locality = userDetails.userAddress.locality;
				$scope.address.components.country = userDetails.userAddress.countryCode;
				$scope.address.components.state = userDetails.userAddress.stateCode;
				$scope.address.components.city = userDetails.userAddress.city;		
				$scope.address.components.postCode = userDetails.userAddress.zipCodeId;
				//$scope.stateId = userDetails.userAddress.stateid;
				//$scope.countryId = userDetails.userAddress.countryid;
				$scope.selectedRoles = userDetails.roles;
				$scope.contactList = userDetails.userContactInfo; */
				$scope.collapse1 = true;
				$scope.collapse2 = true;
				$scope.collapse3 = true;
				$scope.collapse4 = true;
				$scope.collapse5 = true;
				
			}).error(function (error) {
				$scope.status = 'Unable to add User';// + error.message;
			});
		}

		$scope.isSelected = function(checkTab){
			return $scope.record.id === checkTab;
		}
		
		$scope.add = function() {
			if($scope.showNewUser){
				return false;
			}
			$scope.showNewUser = !$scope.showNewUser;
			$scope.editable = !$scope.editable;
			setEditable(true);
			reset();
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
			sel.trigger('select'); */
			
			$scope.record = {};
			$scope.record.id = 0;
			$scope.record.userAddress = {};
			$scope.record.userAddress.id = 0;
			$scope.record.userContactInfo = [{phone:"", emailid:"", id:"0"}];
			$scope.record.roles = [];
			
			//$scope.dob = '';
			//$scope.id = 0;
			//$scope.contactList = [{phone:"", emailid:""}]
			$scope.nonEditable = false;
			
			$scope.collapse1 = true;
			$scope.collapse2 = true;
			$scope.collapse3 = true;
			$scope.collapse4 = true;
			$scope.collapse5 = true;
			
			$scope.phoneAlreadyExistError = null;
			$scope.emailAlreadyExistError = null;
			
			$scope.submitted = false;
			$scope.isDisabledOrganisationType = false;
			$scope.isDisabledOrganisation = false;
			$scope.isDisabledFirstName = false;
			$scope.isDisabledLastName = false;
			$scope.isDisabledDateOfBirth = false; 
			$scope.isDisabledaddressName = false;
			$scope.isDisabledcountryName = false;
			$scope.isDisabledState = false;
			$scope.isDisabledCity = false;
			$scope.isDisabledZipCodeId = false;   
			$scope.isDisabledphoneNumber = false;   
			$scope.isDisabledcontactEmail = false;
		}
		
		$scope.cancel = function(){
			if(!$scope.showNewUser){
				return true;
			}
			$scope.showNewUser = !$scope.showNewUser;
			$scope.editable = !$scope.editable;
			$scope.submitted = true;
			setEditable(false);
			$scope.showUser($scope.userList[0].id);
		}
		
		//Edit
		$scope.edit = function(){
			if($scope.showNewUser){
				return false;
			}
			$scope.showNewUser = !$scope.showNewUser;
			$scope.editable = !$scope.editable;
			setEditable(true);
			$scope.nonEditable = true;
		}
		
		//Save
		$scope.save = function(){
			if(!$scope.showNewUser){
				return false;
			}
			$scope.showNewUser = !$scope.showNewUser;
			$scope.editable = !$scope.editable;
			setEditable(false);

			$scope.record.selectUserRoles = [];
			for(var i = 0; i < $scope.record.roles.length; i++){
				$scope.record.selectUserRoles.push($scope.record.roles[i].id);
			}
			
			//$scope.record.roles = $scope.record.selectUserRoles
			//$scope.record.userAddress.countryCode = $scope.record.userAddress.country
			//delete $scope.record.userAddress.country;
			
			if($scope.record.id == 0){
				flag = true;
				delete $scope.record.roles
			}else{
				flag = false;
			}
			
			
			/* var user = {
				id: $scope.id,
				orgid: $scope.orgId,
				orgtypeid: $scope.orgTypeId,
				firstname: $scope.firstName,
				lastname: $scope.lastName,
				username: "Shoes",
				password: "111",
				dob: $scope.dob,
				// Address
				userAddress:{
					addressline: $scope.place,
					countryCode:$scope.address.components.country,
					stateCode: $scope.address.components.state,
					city: $scope.address.components.city,
					//countryid:1,
					//stateId:1,
					zipCodeId:$scope.address.components.postCode
				},
				// Contacts
				userContactInfo : $scope.contactList,
				selectUserRoles: selRolesId
			}; */
			
			if(flag){
				userFac.addUser($scope.record).success(function () {
					$scope.status = 'User added successfully.';
					$uibModal.open({
					  animation: true,
					  ariaLabelledBy: 'modal-title-top',
					  ariaDescribedBy: 'modal-body-top',
					  templateUrl: 'js/controllers/popup.html',
					  size: 'sm',
					  controller: function($scope, $uibModalInstance) {
						$scope.name = 'top';  
						$scope.ok = function () {
							$rootScope.initializeUserList();
							$uibModalInstance.close();
						};
						$scope.message = 'User added successfully';
					  }
					});
				}).error(function (error) {
					$scope.status = 'Unable to add User';// + error.message;
				});
			}else{
				userFac.updateUser($scope.record).success(function () {
					$scope.status = 'User added successfully.';
					$uibModal.open({
					  animation: true,
					  ariaLabelledBy: 'modal-title-top',
					  ariaDescribedBy: 'modal-body-top',
					  templateUrl: 'js/controllers/popup.html',
					  size: 'sm',
					  controller: function($scope, $uibModalInstance) {
						$scope.name = 'top';  
						$scope.ok = function () {
							$rootScope.initializeUserList();
							$uibModalInstance.close();
						};
						$scope.message = 'User updated successfully';
					  }
					});
				}).error(function (error) {
					$scope.status = 'Unable to update User';// + error.message;
				});
			}
		};
	}]);	
	
})();
