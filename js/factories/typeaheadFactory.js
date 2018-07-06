factories.factory('typeaheadFactory', function () {
	var proposalClientName = '';
	var proposalClientId = '';
	var proposalBrandName = '';
	var proposalBrandId = '';
	var userId = 0;
	
	return{
		setProposalClient: setProposalClient,
		getProposalClientName: getProposalClientName,
		getProposalClientId: getProposalClientId,
		setProposalBrand: setProposalBrand,
		getProposalBrandId: getProposalBrandId,
		setUserId: setUserId,
		getUserId: getUserId
	}
	
	function setProposalClient(client){
		proposalClientName = client.name;
		proposalClientId = client.id;
	}
	
	function getProposalClientName(){
		return proposalClientName;
	}
	
	function getProposalClientId(){
		return proposalClientId;
	}
	
	function setProposalBrand(brandId){
		console.info("brandId",brandId)
		proposalBrandId = brandId;
	}
	
	function getProposalBrandId(){
		return proposalBrandId;
	}
	
	function setUserId(uid){
		userId = uid
	}
	
	function getUserId(){
		return userId;
	}
});
