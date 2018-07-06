(function(){
	
	controllers.controller('fileUploadArtifactController', ['$scope','FileUploader','proposalFac','campaignFac','$uibModal','$rootScope', function ($scope, FileUploader, proposalFac, campaignFac, $uibModal, $rootScope) {
		$scope.fileUploadStatus = false;
		var uploader = $scope.uploader = new FileUploader({
			url: '/contractrestservice/proposal/uploadartifacts'
		});

		// FILTERS
		uploader.filters.push({
			name: 'customFilter',
			fn: function(item /*{File|FileLikeObject}*/, options) {
				return this.queue.length < 10;
			}
		});

		// CALLBACKS

		uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
			console.info('onWhenAddingFileFailed', item, filter, options);
		};
		uploader.onAfterAddingFile = function(fileItem) {
			$scope.fileUploadStatus = false;
			$('#mydiv').show();
			console.info('onAfterAddingFile', fileItem);
			fileItem.documentType = $scope.documentType;
			fileItem.processType = $scope.processType;
			console.log("campaignFac.getCampaignId()", campaignFac.getCampaignId())
			if(campaignFac.getCampaignId()){
				fileItem.campaignId = campaignFac.getCampaignId();
			}
			fileItem.proposalId = proposalFac.getProposalId()? proposalFac.getProposalId(): campaignFac.getProposalId();
			
			$scope.documentType = '';
			$scope.processType = '';
		};
		uploader.onAfterAddingAll = function(addedFileItems) {
			$scope.fileUploadStatus = false;
			console.info('onAfterAddingAll', addedFileItems);
			uploader.uploadAll()
		};
		uploader.onBeforeUploadItem = function(item) {
				/* if(!$scope.campaignId){
					$scope.campaignId = 0;
				} */
				item.formData.push({"proposalId" : proposalFac.getProposalId()? proposalFac.getProposalId(): campaignFac.getProposalId(),
				"documentTypeId":proposalFac.getDocumentTypeId(),
				"operationTypeId":proposalFac.getProcessTypeId(),
				"campaignId":campaignFac.getCampaignId()? campaignFac.getCampaignId(): 0
			});
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
			$scope.fileUploadStatus = true;
		};
		uploader.onCompleteAll = function() {
			console.info('onCompleteAll');
			$scope.fileUploadStatus = true;
			//$rootScope.initializeProposalList();
			$uibModal.open({
			  animation: true,
			  ariaLabelledBy: 'modal-title-top',
			  ariaDescribedBy: 'modal-body-top',
			  templateUrl: 'js/controllers/popup.html',
			  size: 'sm',
			  controller: function($scope, $uibModalInstance) {
				$scope.name = 'top';  
				$scope.ok = function () {
					console.info("proposalFac.getProposalId()", proposalFac.getProposalId())
					if(proposalFac.getProposalId()){
						$rootScope.getProposalDetails(proposalFac.getProposalId())
						$('#mydiv').hide();
					}else{
						$rootScope.getCampaignDetails(campaignFac.getProposalId(), campaignFac.getCampaignId())
						$('#mydiv').hide();
					}
					$uibModalInstance.close();
				};
				$scope.message = 'File Uploaded successfully';
			  }
			});
		};

		console.info('uploader', uploader);
		
	}]);	
	
})();
