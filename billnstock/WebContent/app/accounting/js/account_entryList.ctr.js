var app = angular.module("stockApp");

app.controller(
				"accountEntryListController",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $stateParams, objectFactory,
						appEndpointSF, $mdDialog, $mdMedia) {					
					
					$scope.openingBalance=0;
					$scope.selectdAccount=$stateParams.selectdAccount;
					
					if($scope.selectdAccount)
					{$scope.searchAccId=$scope.selectdAccount.id;					
					}
								
					
					$scope.accountList = [];
					 var entryList = [];

					$scope.fromDate = new Date();
					$scope.toDate = new Date();
					$scope.fromDate.setDate($scope.toDate.getDate() - 30);

					$scope.entries=[];
					
					$scope.getAccountEntryByAccountId=function(accId,fromDate,toDate){			
						
						
						var AccountEntryService = appEndpointSF.getAccountEntryService();						
						AccountEntryService.getAccountEntryByAccountId(accId)
						.then(
								function(list) {			
									$log.debug("list:"+angular.toJson(list));
																	
									$scope.totaldebit = 0;
									$scope.totalcredit = 0;
																		
									entryList=[];
									for (var i = 0; i < list.length; i++) {
										if ( new Date(list[i].date) >= new Date($scope.fromDate)&& new Date(list[i].date) <= new Date($scope.toDate)) {
											
											entryList.push(list[i]);
											if (angular
													.isNumber(list[i].debit)) {
												$scope.totaldebit = $scope.totaldebit
														+ parseFloat(list[i].debit);
											}
											if (angular
													.isNumber(list[i].credit)) {
												$scope.totalcredit = $scope.totalcredit
														+ parseFloat(list[i].credit);
											}
											
										}
									}	
									
								
									$scope.entries=[];
									for (var i = 0; i < entryList.length; i++) {
										if (entryList[i].accountEntity.accountType
												.trim() == "PERSONAL") {
											$scope.closingBalance =$scope.totalcredit- $scope.totaldebit;
										}
										if (list[i].accountEntity.accountType
												.trim() == "REAL") {
											$scope.closingBalance = $scope.totaldebit- $scope.totalcredit;
										}
										if (list[i].accountEntity.accountType
												.trim() == "NOMINAL") {
											$scope.closingBalance = $scope.totalcredit
													- $scope.totaldebit;
										}

									}							
									
									$scope.entries=entryList;
								})
							
							
					};
				

					$scope.getAccountList = function() {

						var AccountService = appEndpointSF.getAccountService();
						AccountService.getAccountList().then(
								function(list) {
									$scope.accountList = list;
									
									if($scope.selectdAccount)
									{																			
									$scope.getAccountEntryByAccountId($scope.searchAccId,$scope.fromDate, $scope.toDate);
									
									}									
									
								});
					}

					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {
							$scope.getAccountList();
							

						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}
					$scope.waitForServiceLoad();
				});
