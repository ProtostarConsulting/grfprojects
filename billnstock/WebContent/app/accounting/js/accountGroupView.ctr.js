var app = angular.module("stockApp");

app
		.controller(
				"accountGroupViewCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $stateParams, objectFactory,$state,
						appEndpointSF, $mdDialog, $mdMedia, ajsCache) {

					$scope.loading = true;				
			
					$scope.accountList = [];
					$scope.entryList = [];
					$scope.flag=$stateParams.flag;
			
					$scope.getAccountListByGroupId = function(groupId) {
						$scope.loading = true;
						$scope.wait = true;
						$scope.accountList = [];

						var AccountService = appEndpointSF.getAccountService();
						AccountService.getAccountListByGroupId(groupId).then(
								function(list) {

									for (var i = 0; i < list.length; i++) {
										list[i].totaldebit = 0;
										list[i].totalcredit = 0;

									}
									$scope.grandDebitTotal = 0;
									$scope.grandCreditTotal = 0;
									$scope.accountList = list;
									
									var maxWaitTime = 1000 * 5;
									var currentWaitTime = 0;
									
									$scope.waitFn = function() {
										if (currentWaitTime < maxWaitTime) {
											$log.debug("Wating for account  Data ...");
											currentWaitTime += 1000;
											$timeout($scope.waitFn, 1000);											
										} 
										else if(currentWaitTime==maxWaitTime) {
											$scope.loading = false;
											$scope.wait = false;
											
										}
									}
									$scope.waitFn();									

								})

					};
					
					
					$scope.getAccountGroupList = function() {

						var AccountGroupService = appEndpointSF
								.getAccountGroupService();
						AccountGroupService.getAccountGroupList().then(
								function(list) {

									$scope.GroupList = list;
									$scope.accountList = [];	
									
									
									if($scope.flag)
									{
										$scope.groupId=$stateParams.selectdAccount.accountgroup.id;
										$scope.fromDate = $stateParams.fromDate;
										$scope.toDate = $stateParams.toDate;
										$scope.getAccountListByGroupId($scope.groupId);
									}

								})

					};

					
					
					$scope.getAccountEntryByAccountId = function(accId, acIndex) {

						var AccountEntryService = appEndpointSF
								.getAccountEntryService();
						AccountEntryService
								.getAccountEntryByAccountId(accId)
								.then(
										function(list) {
											
											$scope.entryList = list;												
											
											$scope.totaldebit = 0;
											$scope.totalcredit = 0;

											for (var i = 0; i < list.length; i++) {
												if (new Date(list[i].date) >= new Date(
														$scope.fromDate)
														&& new Date(
																list[i].date) <= new Date(
																$scope.toDate)) {

													if ($scope.accountList.length > 0) {
														if (angular
																.isNumber(list[i].debit)) {

															$scope.totaldebit = $scope.totaldebit
																	+ parseFloat(list[i].debit);

														}
													}
													if ($scope.accountList.length > 0) {
														if (angular
																.isNumber(list[i].credit)) {
															$scope.totalcredit = $scope.totalcredit
																	+ parseFloat(list[i].credit);
														}
													}

												}

												if ($scope.accountList.length > 0
														&& $scope.accountList[acIndex] != undefined) {
													$scope.accountList[acIndex].totaldebit = $scope.totaldebit;
													$scope.accountList[acIndex].totalcredit = $scope.totalcredit;
												}

											}
											if ($scope.accountList.length > 0
													&& $scope.accountList[acIndex] != undefined) {
												$scope.grandCreditTotal = $scope.grandCreditTotal
														+ $scope.accountList[acIndex].totalcredit;
												$scope.grandDebitTotal = $scope.grandDebitTotal
														+ $scope.accountList[acIndex].totaldebit;
											}
										})

					};
					
					$scope.clear = function() {
						$scope.loading = true;		
						
						$scope.toDate="";
						$scope.fromDate="";
						$scope.groupId="";
						
						$scope.searchForm.$setPristine();						
						$scope.searchForm.$setUntouched();
						
					
					}
					
					var printDivCSS = new String(
							'<link href="/lib/base/css/angular-material.min.css"" rel="stylesheet" type="text/css">'
									+ '<link href="/lib/base/css/bootstrap.min.css"" rel="stylesheet" type="text/css">')
					$scope.printDiv = function(divId) {
						
						window.frames["print_frame"].document.body.innerHTML = document
								.getElementById(divId).innerHTML;
						window.frames["print_frame"].window.focus();
						window.frames["print_frame"].window.print();
					}				
				

					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {
							$scope.getAccountGroupList();

						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}
					$scope.waitForServiceLoad();
				});
