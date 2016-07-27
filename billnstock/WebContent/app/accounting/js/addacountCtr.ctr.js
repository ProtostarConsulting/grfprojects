var app = angular.module("stockApp");

app.controller("addacountCtr", function($scope, $window, $mdToast, $timeout,
		$mdSidenav, $mdUtil, $log, $stateParams, objectFactory, appEndpointSF,$mdDialog,$mdMedia, $state  ) {

	$scope.query = {
		order : 'name',
		limit : 5,
		page : 1
	};

	
	$scope.account={
			
			
			accountName:"",
   
			accountNo:"",
			displayOrderNo:"",
			description:"",
			contra:false
			
	};
	$scope.cancle=function(){
		
		 $state.go('accounting',{});
		
		
	}
	
	
	$scope.accountType = [
			      'PERSONAL',
			      'REAL',
			      'NOMINAL'],
			   	
	$scope.addAccount=function(){
		
		var accountservice=appEndpointSF.getAccountService();
		accountservice.addAccount1($scope.account).then(function() {
		
			
		});
		$scope.account="";
		$scope.accountForm.$setPristine();
        $scope.accountForm.$setValidity();
        $scope.accountForm.$setUntouched();
	}
	
	
});