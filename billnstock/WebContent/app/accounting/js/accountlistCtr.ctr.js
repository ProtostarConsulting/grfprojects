/*var app = angular.module("stockApp");

app.controller("accountlistCtr", function($scope, $window, $mdToast, $timeout,
		$mdSidenav, $mdUtil, $log, $stateParams, objectFactory, appEndpointSF,$mdDialog,$mdMedia, $state  ) {

	$scope.query = {
		order : 'name',
		limit : 5,
		page : 1
	};


	$scope.getAccountList=function(){
		
	var AccountService=appEndpointSF.getAccountService();
	AccountService.getAccountList().then(function(list){
		$scope.accounts=list;
	
			});
		}

	$scope.getAccountList();

	
	
	$scope.delAccByid=function(daccountid){
		
		var delrecord=appEndpointSF.getAccountService();
		
		delrecord.deleteaccByid(daccountid).then(function(){
			$scope.showDelToast();
			$scope.getAccountList();
			
			
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
*/
var app = angular.module("stockApp");

app.controller("accountlistCtr", function($scope, $window, $mdToast, $timeout,
		$mdSidenav, $mdUtil, $log, $stateParams, objectFactory, appEndpointSF,$mdDialog,$mdMedia, $state  ) {

	$scope.query = {
		order : 'name',
		limit : 5,
		page : 1
	};


	$scope.getAccountList=function(){
		
	var AccountService=appEndpointSF.getAccountService();
	AccountService.getAccountList().then(function(list){
		$scope.accounts=list;
	
			});
		}
	$scope.getAccountList();
	
	$scope.delAccByid=function(daccountid){
		
		var delrecord=appEndpointSF.getAccountService();
		
		delrecord.deleteaccByid(daccountid).then(function(){
			$scope.showDelToast();
			$scope.getAccountList();
			
			
		});
		
		
		
	}
	
	
	
});
