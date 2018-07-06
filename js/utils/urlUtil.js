URLUtil = {
	baseURL : "",
	
	initializeBaseURL : function(){
		var splittedURL = document.URL.split("/");
		this.baseURL = splittedURL[0]+"//"+splittedURL[2];
	},

	getOrgRestServiceURL : function (){
		return this.baseURL + "/orgrestservice";
	},
	
	getContractRestServiceURL : function (){
		return this.baseURL + "/contractrestservice";
	},
	
	getUserRestServiceURL : function (){
		return this.baseURL + "/userrestservice";
	}
};


