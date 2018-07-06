(function(){
	
	controllers.controller('proposalCtrl', ['$scope','$rootScope','proposalFac','datePickerFac','typeaheadFactory','$uibModal','$filter','campaignFac','$state','$stateParams','$timeout', function ($scope,$rootScope,proposalFac,datePickerFac,typeaheadFactory,$uibModal,$filter,campaignFac,$state,$stateParams,$timeout) {
	
	$scope.proposalFac = proposalFac;
	$scope.typeaheadFactory = typeaheadFactory;
	$scope.datePickerFac = datePickerFac;
	$scope.proposalList = [];
	$scope.clientList = [];
	var editable = false;
	$rootScope.indexVal = 1;
	$scope.proposalId = 0;
	$scope.record = {};
	$scope.record.id = 0;
	$scope.submitted = false;
	$scope.page = 1;
	//$scope.startDate = $filter('date')(new Date(), "dd/MM/yyyy");
	//$scope.endDate = $filter('date')(new Date(), "dd/MM/yyyy");
	$rootScope.getProposalDetails = getProposalDetails;
	$scope.minDate = new Date().toDateString();
	
	//var tomorrow = $scope.startDate;
	//tomorrow.setDate(tomorrow.getDate() + 1);
	//$scope.maxDate = tomorrow.toDateString();
	//$scope.maxDate = new Date(Date.parse($scope.startdate));
	//$scope.maxDate.setDate($scope.maxDate.getDate() + 1);
	//$scope.maxDate = $scope.maxDate.toDateString();
	
	$rootScope.initializeProposalList = function(){
		proposalFac.setIsLoading(true);
		
		proposalFac.getClientList().then(function(data){
			$scope.clientList = data.data;
		});
		
		proposalFac.getProcessList().then(function(data){
			$scope.processList = data.data;
		});
		
		proposalFac.getDocumentTypeList().then(function(data){
			$scope.documentTypeList = data.data;
			for(var k in $scope.documentTypeList){
				if($scope.documentTypeList[k].description == 'Actual Site Document'){
					$scope.documentTypeList.splice(k,1);
					break;
				}
			}
		});
		
		proposalFac.getUsersList().then(function(data){
			$scope.userList = data.data;
		});
		
		proposalFac.getProposalList().then(function(data){
			if(data.data.length == 0){
				setEditable(true)
				proposalFac.setIsLoading(false);
			}else{
				setEditable(false);
				$scope.proposalList = data.data;
				$scope.$broadcast('rebuild:me');
				$scope.showProposal($scope.proposalList[0].id);
			}
		});
	}
	
	$scope.remove = function(artifactList, id, proposalid, campaignid, index){
		
		$uibModal.open({
		  animation: true,
		  ariaLabelledBy: 'modal-title-top',
		  ariaDescribedBy: 'modal-body-top',
		  templateUrl: 'templates/common/warningPopup.html',
		  size: 'sm',
		  controller: function($scope, $uibModalInstance, proposalFac) {
			$scope.name = 'top';  
			$scope.ok = function () {
				var artifactObj = {
					"id": id,
					"proposalid": proposalid,
					"campaignid": campaignid 
				}
				proposalFac.deleteArtifact(artifactObj).then(function(){
					artifactList.splice(index,1);
				})
				$uibModalInstance.close();
			};
			$scope.cancel = function(){
				$uibModalInstance.close();
			}
			$scope.message = 'Are you sure, you want to delete the document?';
			$scope.buttonName = "Cancel";
		  }
		});
		
	}
	
	$scope.selectTab = function(selectedTab){
		if($scope.record.id > 0){
			$scope.indexVal = selectedTab;
		}
	}
	
	$scope.isEditable = function(){
		return editable;
	}
	
	function setEditable(eValue){
		editable = eValue;
	}
	
	$scope.check = function(value) {
		if(value){
			$scope.save();
		}else{
			$scope.submitted = true;
			$scope.isDisabledclientName=true;
			$scope.isDisabledbrandName= true;
			$scope.isDisabledcampaignName= true;
		}
	}
	
	$scope.isActivePage = function(tab){
		$rootScope.indexVal == tab;
	}
	
	$scope.alreadyExists = function(proposalname){
		$rootScope.skipPopup = true;
		console.info("proposalname", proposalname)
		proposalFac.alreadyExist(proposalname).success(function(){
			$scope.alreadyExistError = null;
		}).error(function(response){
			$scope.alreadyExistError = response.errorDetailsMessage
		})
	}
	
	$scope.showProposal = function(id){
		if($scope.showNewProposal){
			return false;
		}
		reset();
		getProposalDetails(id);
	}
	
	function getProposalDetails(id){
		proposalFac.getProposalDetails(id).then(function(data){
			$scope.record = data.data;
			$scope.record.startdate = $filter('date')(new Date($scope.record.startdate), "MMM d, y");
			$scope.record.enddate = $filter('date')(new Date($scope.record.enddate), "MMM d, y");
			proposalFac.setProposalId(id);
			/* var i = 0;
			var j = 0;
			var clientListLength = $scope.clientList.length;
			var userListLength = $scope.userList.length;
			var proposalObj = data.data;
			proposalFac.setProposalId(proposalObj.id);
			$scope.id = proposalObj.id;
			for(i=0; i < clientListLength; i++){
				if($scope.clientList[i].id == proposalObj.clientid){
					$scope.clientName = $scope.clientList[i].name;
				}
			}
			$scope.campaignDescription = proposalObj.description;
			$scope.campaignName = proposalObj.name;
			$scope.startDate = $filter('date')(proposalObj.startdate, "dd/MM/yyyy");
			$scope.endDate = $filter('date')(proposalObj.enddate, "dd/MM/yyyy");
			$scope.artifactList = proposalObj.artifactList;
			for(j=0; j < userListLength; j++){
				if($scope.userList[j].id == proposalObj.assignedtouser){
					$scope.userName = $scope.userList[j].firstname;
				}
			} */
			
			$timeout(function () {
				proposalFac.setIsLoading(false);
			}, 500);
		});
	}
	
	$scope.isSelected = function(checkTab){
		return $scope.record.id === checkTab;
	}
	
	$scope.add = function() {
		$rootScope.indexVal = 1;
		if($scope.showNewProposal){
			return false;
		}
		$scope.showNewProposal = !$scope.showNewProposal;
		$scope.editable = !$scope.editable;
		setEditable(true);
		reset();
	}
	
	$scope.cancel = function(){
		if(!$scope.showNewProposal){
			return false;
		}
		$scope.submitted = true;
		$scope.isDisabledclientName=true;
		$scope.isDisabledbrandName= true;
		$scope.isDisabledcampaignName= true;
		$scope.showNewProposal = !$scope.showNewProposal;
		$scope.editable = !$scope.editable;
		setEditable(false);
		$scope.showProposal($scope.proposalList[0].id);
	}
	
	//Edit
	$scope.edit = function(){
		if($scope.showNewProposal){
			return false;
		}
		$scope.showNewProposal = !$scope.showNewProposal;
		$scope.editable = !$scope.editable;
		setEditable(true);
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
		$scope.id = 0;*/
		$scope.record = {};
		$scope.record.id = 0;
		$scope.record.startdate = $filter('date')(new Date(), "MMM d, y");
		//$scope.record.enddate = $filter('date')(new Date(), "MMM d, y");
		
		$scope.alreadyExistError = null;
		
		$scope.submitted = false;
		$scope.isDisabledclientName= false;
		$scope.isDisabledbrandName= false;
		$scope.isDisabledcampaignName= false;
	}
	
	//Save
    $scope.save = function(){
		if(!$scope.showNewProposal){
			return false;
		}
		$scope.showNewProposal = !$scope.showNewProposal;
		$scope.editable = !$scope.editable;
		var flag = false;
		setEditable(false);
		
		if($scope.record.id == 0){
			flag = true;
		}else{
			flag = false;
		}
		
		/* var proposal = {
			id:$scope.id,
			name: $scope.campaignName,
			clientid: typeaheadFactory.getProposalClientId(),
			brandName: $scope.brandName,
			startdate: $scope.startDate,
			enddate: $scope.endDate,
			description: $scope.campaignDescription
		}; */
		function getRecordForSave(){
			var record = angular.copy($scope.record);
			record.startdate = $filter('date')(new Date(record.startdate), "MM/dd/yyyy");
			record.enddate = $filter('date')(new Date(record.enddate), "MM/dd/yyyy");
			console.info("record", $filter('date')(new Date(record.startdate), "MM/dd/yyyy"))
			return record;
		}
		
		proposalFac.addProposal(getRecordForSave()).success(function (proposalData) {
			$scope.status = 'proposal added successfully.';
			if($scope.id == 0)
			$rootScope.indexVal++;
			proposalFac.setProposalId(proposalData.id);
			if(flag){
				$rootScope.initializeProposalList();
			}
		}).error(function (error) {
			$scope.status = 'Unable to add proposal';// + error.message;
		});
    };
    
    $scope.submit = function(){
		console.log("$rootScope.indexVal"+$rootScope.indexVal)
		proposalFac.submit(proposalFac.getProposalId(), typeaheadFactory.getUserId()).success(function(){
			$scope.status = 'Proposal added successfully.';
			$uibModal.open({
			  animation: true,
			  ariaLabelledBy: 'modal-title-top',
			  ariaDescribedBy: 'modal-body-top',
			  templateUrl: 'js/controllers/popup.html',
			  size: 'sm',
			  controller: function($scope, $uibModalInstance, $rootScope) {
				$scope.name = 'top';  
				$scope.ok = function () {
					$rootScope.indexVal = 1;
					$state.transitionTo($state.current, $stateParams, {
						reload: true,
						inherit: false,
						notify: true
					});
					$uibModalInstance.close();
				};
				$scope.message = 'Proposal Onboarded successfully';
			  }
			});
		}).error(function (error) {
				$scope.status = 'Unable to add proposal';// + error.message;
		});
    };
	
	$scope.Next = function(){
		$scope.indexVal++;
	}
	
	$scope.Previous = function(){
		$scope.indexVal--;
	}
	
	$scope.onSelectClient = function ($item, $model, $label){
		typeaheadFactory.setProposalClient($item);
		$scope.record.clientid = $item.id;
		$scope.record.clientName = $item.name;
		/* if($item.id){
			proposalFac.getBrandList($item.id).then(function(data){
				console.log("Vishal" + data.data);
				$scope.brandList = data.data;
			});
		} */
	};
	
	$scope.onSelectUser = function ($item, $model, $label){
		typeaheadFactory.setUserId($item.id);
		console.info($item)
		$scope.record.assignedtouser = $item.id;
		$scope.record.assignedUserName = $item.firstname + " " + $item.lastname;
		console.info("$scope.record.assignedtouser", $scope.record.assignedtouser)
		console.info("$scope.record.assignedUserName", $scope.record.assignedUserName)
	};
	
	/*$scope.getFile= function(){
		var artifact = {
			proposalid: $scope.proposalId,
			id: $scope.id
		};
		
		proposalFac.downloadFile(artifact)
		.success(function () {
			$scope.status = 'proposal Created successfully.';
		}).error(function (error) {
			$scope.status = 'Unable to add proposal';// + error.message;
		});
	}*/
	
	$scope.getFile = function (item) {
		console.info("item", item)
		var artifact = {
			proposalid: item.proposalid,
			id: item.id,
			name:item.documentfullname
		};
		 
		proposalFac.downloadFile(artifact).then(function (response) {
			var blob = new Blob([response.data], { type: "application/octet-stream" });
			var blobURL = (window.URL || window.webkitURL).createObjectURL(blob);
			var anchor = document.createElement("a");
			anchor.download = artifact.name;
			anchor.href = blobURL;
			anchor.click();
		},
		function (error) {
			
		});
	};
	
	}]);
	
})();
