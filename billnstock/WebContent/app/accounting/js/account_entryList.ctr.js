
var app = angular.module("stockApp");

app.controller("accountEntryListController", function($scope, $window, $mdToast, $timeout,
		$mdSidenav, $mdUtil, $log, $stateParams, objectFactory, appEndpointSF,$mdDialog,$mdMedia ) {
	
	

	
	
	$scope.accountList=[];
	$scope.entryList=[];
	$scope.totaldebit=10;
	$scope.totalcredit=0;
	$scope.getAccountEntryList = function() {

		var AccountEntryService = appEndpointSF.getAccountEntryService();
		AccountEntryService.getAccountEntryList().then(function(entryList) {
			$scope.entryList = entryList;								
		});
	}		
	
	
	$scope.getAccountList=function(fromDate,toDate){
		
		var getlist=appEndpointSF.getAccountService();
		getlist.getaccountlist().then(function(list){
			$scope.accountList=list;
			
			if(fromDate!=undefined || toDate!=undefined)
				{
				$scope.accountList=[];
					for(var i=0;i<list.length;i++)
					{
						if(new Date(list[i].createdDate) >= new Date(fromDate) && new Date(list[i].createdDate)<= new Date(toDate))
						{
							$log.debug("xx  times");
								$scope.accountList.push(list[i]);
						}
					}
					$log.debug("xx"+$scope.accountList);
				}
		
				});
			}
	
		$scope.waitForServiceLoad = function() {
			if (appEndpointSF.is_service_ready) {
				$scope.getAccountEntryList();
				$scope.getAccountList();
			} else {
				$log.debug("Services Not Loaded, watiting...");
				$timeout($scope.waitForServiceLoad, 1000);
			}
		}
		$scope.waitForServiceLoad();
});
