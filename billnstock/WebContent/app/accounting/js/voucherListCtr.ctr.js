var app = angular.module("stockApp");

app.controller("voucherListCtr", function($scope, $window, $mdToast, $timeout,
		$mdSidenav, $mdUtil, $log, $stateParams, objectFactory, appEndpointSF,$mdDialog,$mdMedia, $state  ) {
	
	


	$scope.voucherList=function(){
		
		var voucherServiceList=appEndpointSF.getVoucherService();
		voucherServiceList.listVoucher().then(function(list){
			$scope.Voucheraccounts=list;
		
				});
			}
	
	
	$scope.voucherList();
	

});
