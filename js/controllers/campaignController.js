(function(){
	
	controllers.controller('campaignCtrl', ['$scope','$rootScope','campaignFac','FileUploader','datePickerFac','$filter','proposalFac','$uibModal', '$window', function ($scope,$rootScope,campaignFac,FileUploader,datePickerFac,$filter,proposalFac,$uibModal, $window) {
		
		$scope.campaignList = [];
		$scope.clientList = [];
		$scope.processScheduleList = [];
		$scope.operationList = [];
		$scope.editable = true;
		var editable = false;
		$scope.indexVal = 1;
		$scope.page = 1;
		//$scope.startDate = $filter('date')(new Date(), "dd/MM/yyyy");
		//$scope.endDate = $filter('date')(new Date(), "dd/MM/yyyy");
		$scope.regionList = [];
		$scope.artifactList = [];
		
		var campaignId = 0;
		var processId = 0;
		$scope.record = {};
		$scope.record.id = 0;
		//$scope.index = 1;
		$scope.proposalFac = proposalFac;
		$scope.campaignFac = campaignFac;
		$scope.visibility = false;
		//$scope.showRegions = showRegions;
		//$scope.showCampaignList = showCampaignList;
		//$scope.assignVendorCampaignSites = assignVendorCampaignSites;
		$scope.showHideCampaignList = false;
		$rootScope.getCampaignDetails = getCampaignDetails;
		$scope.showCampaigns = $window.sessionStorage.getItem("orgType");
		$scope.minDate = new Date().toDateString();
		
		$scope.checkIfEnterKeyWasPressed = function($event){
			console.log("Success")
			var keyCode = $event.which || $event.keyCode;
			if (keyCode === 13) {
				$event.preventDefault();
				// Do that thing you finally wanted to do
			}

		  };
		
		//Vendor Campaign Method
		/* function showRegions(campaignObj){
			$scope.showHideCampaignList = !$scope.showHideCampaignList;
			getRegionList(campaignObj.id);
			getCampaignOperations(campaignObj.id, 0);
			$scope.campaignName = campaignObj.name;
			campaignFac.setCampaignId(campaignObj.id);
			//campaignFac.getVendorCampaignOperations(campaignObj.id).then(function(response){
			//	$scope.vendorCampaignOperationList = response.data.contractOperationsVO;
			//});
			proposalFac.getUsersList().then(function(data){
				$scope.userList = data.data;
			});
		} */
		
		//Vendor Campaign Method
		/* function showCampaignList(){
			$scope.showHideCampaignList = !$scope.showHideCampaignList;
		} */
		
		//Vendor Campaign Method
		/* function assignVendorCampaignSites(sitesObj, operationObj){
			var selSites = [];
			campaignFac.setVendorOperationId(operationObj.operationid);
			campaignFac.setVendorOperationType(operationObj.operationtype);
			for(i in sitesObj){
				if(sitesObj[i] && sitesObj[i].isSelected == 'Y'){
					selSites.push(sitesObj[i]);
				}
				if(i == sitesObj.length-1){
					campaignFac.setSelectedSites(selSites);
				}
			}
			console.info("sitesObj", sitesObj);
			$uibModal.open({
			  animation: true,
			  ariaLabelledBy: 'modal-title-top',
			  ariaDescribedBy: 'modal-body-top',
			  templateUrl: "templates/campaigns/assignCampaignVendorModal.html",
			  size: 'lg',
			  controller: function($scope, $uibModalInstance, campaignFac, proposalFac) {
				$scope.name = 'top';
				$scope.campaignFac = campaignFac;
				campaignFac.getVendorUserList('1').then(function(data){
					$scope.vendorUserList = data.data;
				});

				$scope.onSelectVendor = function($item, $model, $label){
					console.info("$item", $item)
					console.info("$model", $model)
					console.info("$label", $label)
				}
				
				$scope.onSelectVendorUser = function ($item, $model, $label){
					console.info("$item", $item);
					$scope.assignedto = $item.id;
				};
				
				$scope.ok = function () {
					
					var contractOperationsList = [];
					var selSitesList = campaignFac.getSelectedSites();
					for(k in selSitesList){
						contractOperationsList.push({
							"id": 0,
							"campaignid": campaignFac.getCampaignId(),
							"siteid"  : selSitesList[k].siteid,        
							"assignedto": $scope.assignedto,
							"assignedvendorid": 1
						});
					}
					var assignmentDetailsObj = {
						"operationid":campaignFac.getVendorOperationId(),
						"operationtype":campaignFac.getVendorOperationType(),
						"contractOperationsList": contractOperationsList
					};
					
					campaignFac.saveAssignmentDetails(assignmentDetailsObj).then(function(data){
						$uibModalInstance.close();
					});
					
				};
				$scope.cancel = function(){
					$uibModalInstance.close();
				};
				//$scope.message = 'Client onboarded successfully';
			  }
			});
		} */
		
		//Client Campaign Method
		/* $scope.saveClientUser = function(){
			console.log("Save")
		} */
		
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
		
		$scope.initializeCampaignList = function(){
			campaignFac.setIsLoading(true);
			
			campaignFac.getOperationList().then(function(data){
				var operationList = data.data;
				$scope.operationList = operationList;
				var i = 0;
				for(i = 0; i < operationList.length; i++){
					$scope.processScheduleList.push({"campaignid":0,"operationid":operationList[i].id,"name":operationList[i].name,"proposedstartdate":"","proposedenddate":""});
				}
			});
			
			proposalFac.getProcessList().then(function(data){
				$scope.processList = data.data;
			});
			
			proposalFac.getDocumentTypeList().then(function(data){
				$scope.documentTypeList = data.data;
				for(var k in $scope.documentTypeList){
					if($scope.documentTypeList[k].description == 'Raw Site Document'){
						$scope.documentTypeList.splice(k,1);
						break;
					}
				}
			});
			
			proposalFac.getClientList().then(function(data){
				$scope.clientList = data.data;
			});
			
			campaignFac.getCampaignlList().then(function(data){
				if(data.data.length == 0){
					setEditable(true)
					campaignFac.setIsLoading(false);
				}else{
					setEditable(false);
					$scope.campaignList = data.data;
					$scope.$broadcast('rebuild:me');
					$scope.showCampaign($scope.campaignList[0].proposalid, $scope.campaignList[0].id);
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
		
		/* $scope.check = function(value) {
			if( value ){
				$scope.Next();
			}
			else{
				$scope.isDisabledclientName=true;
				$scope.isDisabledbrandName= true;
				$scope.isDisabledcampaignName= true;
				$scope.isDisableddescriptionName= true;
			}
		} */
		
		function getRegionList(campaignid){
			campaignFac.getRegionList(campaignid).then(function(data){
				$scope.regionList = data.data;
			});
		}
		
		function getCampaignOperations(campaignid, regionid){
			campaignFac.getCampaignOperations(campaignid, regionid).then(function(data){
				var campaignOperationList = data.data.contractOperationsVO;
				$rootScope.campaignOperationList = campaignOperationList;
				for(oid in $scope.processScheduleList){
					for(coid in $rootScope.campaignOperationList){
						if($scope.processScheduleList[oid].operationid == $rootScope.campaignOperationList[coid].operationid){
							$scope.processScheduleList[oid].isChecked = true;
							$scope.processScheduleList[oid].proposedstartdate = $rootScope.campaignOperationList[coid].proposedstartdate;
							$scope.processScheduleList[oid].proposedenddate = $rootScope.campaignOperationList[coid].proposedenddate;
							$scope.processScheduleList[oid].id = $rootScope.campaignOperationList[coid].id;
							$scope.processScheduleList[oid].proposedstartdate = $filter('date')(new Date($scope.processScheduleList[oid].proposedstartdate), "MMM d, y");
							$scope.processScheduleList[oid].proposedenddate = $filter('date')(new Date($scope.processScheduleList[oid].proposedenddate), "MMM d, y");
						}
					}
				}
			});
		}
		
		$scope.showCampaign = function(proposalid, campaignid){
			if($scope.showNewCampaign){
				return false;
			}
			getCampaignDetails(proposalid, campaignid);
		}
		
		function getCampaignDetails(proposalid, campaignid){
			processId = 0;
			campaignFac.setCampaignId(campaignid);
			campaignFac.setProposalId(proposalid);
			getRegionList(campaignid);
			getCampaignOperations(campaignid, 0);
		
			campaignFac.getCampaignDetails(proposalid, campaignid).then(function(data){
				$scope.record = data.data;
				$scope.record.startdate = $filter('date')(new Date($scope.record.startdate), "MMM d, y");
				$scope.record.enddate = $filter('date')(new Date($scope.record.enddate), "MMM d, y");
				campaignFac.setIsLoading(false);
				//var i = 0;
				//var clientListLength = $scope.clientList.length;
				//var campaignObj = data.data;
				//$scope.id = campaignObj.id;
				/* for(i=0;i<clientListLength;i++){
					if($scope.clientList[i].id == campaignObj.clientid)
						$scope.clientName = $scope.clientList[i].name;
				} */
				//$scope.clientName = campaignObj.clientName;
				//$scope.brandName = campaignObj.brandName;
				//$scope.campaignDescription = campaignObj.description;
				//$scope.campaignName = campaignObj.name;
				//$scope.startDate = $filter('date')(campaignObj.startdate, "dd/MM/yyyy");
				//$scope.endDate = $filter('date')(campaignObj.enddate, "dd/MM/yyyy");
				//$scope.campaignId=campaignObj.id;
				//$scope.proposalId=campaignObj.proposalId;
				/* if(campaignObj.guidelines){
					$scope.artifactList = campaignObj.guidelines;
				} */
			});
		}
		
		$scope.showCompanySites = function(region){
			console.info("region", region)
			if(!region.showDetails){
				var cid = campaignFac.getCampaignId();
				var aid = region.areaId;
				campaignFac.getSiteList(cid, aid).then(function(data){
					region.siteList = data.data;
					var i = 0;
					if(region.siteList){
						var siteListLength = region.siteList.length;
						for(i=0; i<siteListLength; i++){
							region.siteList[i].readonly = true;
						}
					}
				});
				
				campaignFac.getZipCodeList(aid).then(function(data){
					$scope.zipcodeList = data.data;
				})
			}
			region.showDetails = !region.showDetails;
		}
		
		$scope.showVendorSites = function(region){
			if(!region.showDetails){
				var cid = campaignFac.getCampaignId();
				var aid = region.areaId;
				campaignFac.getVendorCampaignOperations(cid, aid).then(function(response){
					$scope.vendorCampaignOperationList = response.data.contractOperationsVO;
					campaignFac.getSiteList(cid, aid).then(function(data){
						region.siteList = data.data;
						var i = 0;
						if(region.siteList){
							var siteListLength = region.siteList.length;
							for(i=0; i<siteListLength; i++){
								region.siteList[i].readonly = true;
							}
						}
					});
				});
				
			}
			region.showDetails = !region.showDetails;
		}
		
		$scope.showClientSites = function(region){
			if(!region.showDetails){
				var cid = campaignFac.getCampaignId();
				var aid = region.areaId;
				campaignFac.getSiteList(cid, aid).then(function(data){
					region.siteList = data.data;
					var i = 0;
					if(region.siteList){
						var siteListLength = region.siteList.length;
						for(i=0; i<siteListLength; i++){
							region.siteList[i].readonly = true;
						}
					}
				});
			}
			region.showDetails = !region.showDetails;
		}
		
		$scope.isSelected = function(checkTab){
			return $scope.record.id === checkTab;
		}
		
		/* $scope.add = function() {
			if($scope.showNewCampaign){
				return false;
			}
			$scope.showNewCampaign = !$scope.showNewCampaign;
			$scope.editable = !$scope.editable;
			var input = $('input');
			input.val('');
			input.trigger('input');
			$scope.campaignList.unshift({name:"Add New Campaign", id:"0"});
			$scope.id = $scope.campaignList[0].id;
			$scope.startDate = $filter('date')(new Date(), "dd/MM/yyyy");
			$scope.endDate = $filter('date')(new Date(), "dd/MM/yyyy");
			
				$scope.isDisabledclientName= false;
				$scope.isDisabledbrandName= false;
				$scope.isDisabledcampaignName= false;
				$scope.isDisableddescriptionName= false;
		} */
		
		$scope.cancel = function(){
			if(!$scope.showNewCampaign){
				return false;
			}
			$scope.showNewCampaign = !$scope.showNewCampaign;
			$scope.editable = !$scope.editable;
			setEditable(false);
			$scope.showCampaign($scope.campaignList[0].id);
		}
		
		//Edit
		$scope.edit = function(){
			if($scope.showNewCampaign){
				return false;
			}
			$scope.showNewCampaign = !$scope.showNewCampaign;
			$scope.editable = !$scope.editable;
			setEditable(true);
		}
		
		//Save
		$scope.save = function(){
			if(!$scope.showNewCampaign){
				return false;
			}
			$scope.showNewCampaign = !$scope.showNewCampaign;
			$scope.editable = !$scope.editable;
			setEditable(false);
			var processObj = [];
			var contractOperationsVO = {};
			var j = 0;
			for(j = 0; j < $scope.processScheduleList.length; j++){
				if($scope.processScheduleList[j].isChecked){
					$scope.processScheduleList[j].campaignid = campaignFac.getCampaignId();
					$scope.processScheduleList[j].id = $scope.processScheduleList[j].id? $scope.processScheduleList[j].id: 0;
					$scope.processScheduleList[j].proposedstartdate = $filter('date')(new Date($scope.processScheduleList[j].proposedstartdate), "MM/dd/yyyy");
					$scope.processScheduleList[j].proposedenddate = $filter('date')(new Date($scope.processScheduleList[j].proposedenddate), "MM/dd/yyyy");
					processObj.push($scope.processScheduleList[j]);
				}
				if(j == $scope.processScheduleList.length-1){
					contractOperationsVO = {"contractOperationsVO":processObj}
					console.info("contractOperationsVO", contractOperationsVO)
					saveProcessSchedule(contractOperationsVO);
				}
			}
			
			function saveProcessSchedule(contractOperationsVO){
				campaignFac.saveProcessSchedule(contractOperationsVO).then(function(){
					campaignFac.getCampaignOperations(campaignFac.getCampaignId(), 0).then(function(data){
						var campaignOperationList = data.data.contractOperationsVO;
						$rootScope.campaignOperationList = campaignOperationList;
						for(oid in $scope.processScheduleList){
							for(coid in $rootScope.campaignOperationList){
								if($scope.processScheduleList[oid].operationid == $rootScope.campaignOperationList[coid].operationid){
									$scope.processScheduleList[oid].isChecked = true;
									$scope.processScheduleList[oid].proposedstartdate = $rootScope.campaignOperationList[coid].proposedstartdate;
									$scope.processScheduleList[oid].proposedenddate = $rootScope.campaignOperationList[coid].proposedenddate;
									$scope.processScheduleList[oid].id = $rootScope.campaignOperationList[coid].id;
								}
							}
						}
					});
				});
			}
		};
		
		$scope.Next = function(){
			if($scope.indexVal == 3){
				getRegionList(campaignFac.getCampaignId());
			}
			$scope.indexVal++;
		}
		
		$scope.Previous = function(){
			$scope.indexVal--;
		}
		
		$scope.addNewRow = function(siteList) {
		  siteList[siteList.length - 1].readonly = true;
		  siteList.unshift({"sitename":"", "addressline":"", "zipcode":"", "siteownercontactnumber":"" , "areaid":"", "readonly": false, "site":"new"})
		}
		
		/* $scope.removeRow = function(index, siteList) {
		  siteList.splice(index, 1);
		} */
		
		$scope.editRow = function(siteObj, region) {
		  siteObj.readonly = !siteObj.readonly;
			
			console.info("siteObj", siteObj);
			
			var site = {
				"siteid": siteObj.siteid ? siteObj.siteid: 0,
				"sitename": siteObj.sitename, 
				"addressline": siteObj.addressline, 
				"zipcode": siteObj.zipcode ? siteObj.zipcode: 0, 
				"siteownername": siteObj.siteownername, 
				"siteownercontactnumber": siteObj.siteownercontactnumber, 
				"areaid": region.areaId, 
				"campaingid":campaignFac.getCampaignId()
			} 
			
			campaignFac.addSites(site).then(function(data){
			  
			});
		}
		
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
			
			
		$scope.downloadFile = function () {
			campaignFac.downloadFile().then(function (response) {
				var blob = new Blob([response.data], { type: "application/octet-stream" });
				var blobURL = (window.URL || window.webkitURL).createObjectURL(blob);
				var anchor = document.createElement("a");
				anchor.download = "ActualSiteDocument.xlsx";
				anchor.href = blobURL;
				anchor.click();
			},
			function (error) {
			});
		};
		
		
		$scope.assignVendors = function(region){
			campaignFac.setCurrentRegionId(region.areaId);
			campaignFac.getCampaignOperations(campaignFac.getCampaignId(), region.areaId).then(function(data){
				var campaignOperationList = data.data.contractOperationsVO;
				$rootScope.campaignOperationList = campaignOperationList;
			});
			$uibModal.open({
			  animation: true,
			  ariaLabelledBy: 'modal-title-top',
			  ariaDescribedBy: 'modal-body-top',
			  templateUrl: "templates/campaigns/assignVendorModal.html",
			  size: 'lg',
			  controller: function($scope, $uibModalInstance, campaignFac, proposalFac) {
				$scope.name = 'top';
				campaignFac.getVendorList().then(function(data){
					$scope.vendorList = data.data;
				});
				proposalFac.getUsersList().then(function(data){
					$scope.userList = data.data;
				});
				
				$scope.onSelect = function ($item, $model, $label){
					if($item.id){
						campaignFac.getVendorUserList($item.id).then(function(data){
							$scope.vendorUserList = data.data;
						});
					}
				};
				
				$scope.ok = function () {
					var assignmentDetailsArr = [];
					var assignmentDetailsObj = {};
					for(k in $scope.campaignOperationList){
						assignmentDetailsArr.push({
							"id": $scope.campaignOperationList[k].id,
							"campaignid": $scope.campaignOperationList[k].campaignid,		  
							"operationid": $scope.campaignOperationList[k].operationid, 
							"operationtype": $scope.campaignOperationList[k].operationtype,
							"regionid": campaignFac.getCurrentRegionId(),
							"assignedto": $scope.campaignOperationList[k].username ? $scope.campaignOperationList[k].username["id"] : null,
							"assignedvendorid": $scope.campaignOperationList[k].vendorname ? $scope.campaignOperationList[k].vendorname["id"] : null
						});
					}
					assignmentDetailsObj.contractOperationsList = assignmentDetailsArr;
					campaignFac.saveAssignmentDetails(assignmentDetailsObj).then(function(data){
						$uibModalInstance.close();
					});
				};
				$scope.cancel = function(){
					$uibModalInstance.close();
				};
				$scope.message = 'Client onboarded successfully';
			  }
			});
		}
		
	}]);	
	
})();
