factories.factory('datePickerFac', function ($filter) {
	var proposalStartDate = '';
	var proposalEndDate = '';
	return{
		setProposalStartDate: setProposalStartDate,
		getProposalStartDate: getProposalStartDate,
		setProposalEndDate: setProposalEndDate,
		getProposalEndDate: getProposalEndDate
	}
	
	function setProposalStartDate(sDate){
		console.log("sDate"+sDate)
		proposalStartDate = $filter('date')(sDate, "dd/MM/yyyy hh:mm:ss a");
	}
	
	function getProposalStartDate(){
		return proposalStartDate;
	}
	
	function setProposalEndDate(eDate){
		proposalEndDate = $filter('date')(eDate, "dd/MM/yyyy hh:mm:ss a");
	}
	
	function getProposalEndDate(){
		return proposalEndDate;
	}
});
