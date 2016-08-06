var app = angular.module("stockApp");

app.controller("accountlistCtr", function($scope, $window, $mdToast, $timeout,
		$mdSidenav, $mdUtil, $log, $stateParams, objectFactory, appEndpointSF,$mdDialog,$mdMedia, $state  ) {

	$scope.query = {
		order : 'name',
		limit : 5,
		page : 1
	};


	$scope.getaccountlist=function(){
		
	var getlist=appEndpointSF.getAccountService();
	getlist.getaccountlist().then(function(list){
		$scope.accounts=list;
	
			});
		}
	
	
	$scope.delAccByid=function(daccountid){
		
		var delrecord=appEndpointSF.getAccountService();
		
		delrecord.deleteaccByid(daccountid).then(function(){
			$scope.showDelToast();
			$scope.getaccountlist();
			
			
		});
		
		
		
	}
	  $scope.getaccountlist();
	
	
	$scope.waitForServiceLoad = function() {
	      if (appEndpointSF.is_service_ready) {
	       
	    	  $scope.getaccountlist();
	       

	      } else {
	       $log.debug("Services Not Loaded, watiting...");
	       $timeout($scope.waitForServiceLoad, 1000);
	      }
	     }
});
