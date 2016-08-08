var app = angular.module("stockApp");

app.controller(
				"accountEntryListController",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $stateParams, objectFactory,
						appEndpointSF, $mdDialog, $mdMedia) {

					$scope.accountList = [];
					$scope.entryList = [];

					$scope.fromDate = new Date();
					$scope.toDate = new Date();
					$scope.fromDate.setDate($scope.toDate.getDate() - 30);

					$scope.getAccountEntryList = function(accName, fromDate,
							toDate) {

						var AccountEntryService = appEndpointSF
								.getAccountEntryService();
						AccountEntryService
								.getAccountEntryList()
								.then(
										function(entryList) {
											$scope.List = entryList;								
										

											if (fromDate != undefined
													&& toDate != undefined
													&& accName != undefined) {
												$scope.entryList = [];
												$scope.totaldebit = 0;
												$scope.totalcredit = 0;

												$scope.closingBalance = 0;
												$scope.openingBalance = 0;
												

												for (var i = 0; i < entryList.length; i++) {
													if (entryList[i].accountEntity.accountName == accName
															&& new Date(
																	entryList[i].date) >= new Date(
																	fromDate)
															&& new Date(
																	entryList[i].date) <= new Date(
																	toDate)) {
														$scope.entryList
																.push(entryList[i]);
														if (angular
																.isNumber(entryList[i].debit)) {
															$scope.totaldebit = $scope.totaldebit
																	+ parseFloat(entryList[i].debit);
														}
														if (angular
																.isNumber(entryList[i].credit)) {
															$scope.totalcredit = $scope.totalcredit
																	+ parseFloat(entryList[i].credit);
														}

														
													}

												}
												for (var i = 0; i < $scope.entryList.length; i++) {
													if ($scope.entryList[i].accountEntity.accountType
															.trim() == "PERSONAL") {
														$scope.closingBalance = $scope.totaldebit
																- $scope.totalcredit;
													}
													if (entryList[i].accountEntity.accountType
															.trim() == "REAL") {
														$scope.closingBalance = $scope.totaldebit
																- $scope.totalcredit;
													}
													if (entryList[i].accountEntity.accountType
															.trim() == "NOMINAL") {
														$scope.closingBalance = $scope.totalcredit
																- $scope.totaldebit;
													}

												}

											}

										});
					}

					$scope.clearSearch = function() {
						$scope.fromDate = "";
						$scope.toDate = "";
						$scope.searchAccName = "";

					}

					$scope.getAccountList = function() {

						var AccountService = appEndpointSF.getAccountService();
						AccountService.getAccountList().then(
								function(list) {
									$scope.accountList = list;
									$scope.getAccountEntryList(
											$scope.searchAccName,
											$scope.fromDate, $scope.toDate);
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
