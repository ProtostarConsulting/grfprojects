var app = angular.module("stockApp");

app
		.controller(
				"accountGroupViewCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $stateParams, objectFactory,
						appEndpointSF, $mdDialog, $mdMedia, ajsCache) {

					$scope.fromDate = new Date();
					$scope.toDate = new Date();
					$scope.fromDate.setDate($scope.toDate.getDate() - 30);
					$scope.groupName;
					$scope.accountList = [];
					$scope.entryList = [];

					$scope.getAccountListByGroupId = function(groupId) {

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

								})

					};

					$scope.getAccountGroupList = function() {

						var AccountGroupService = appEndpointSF
								.getAccountGroupService();
						AccountGroupService.getAccountGroupList().then(
								function(list) {

									$scope.GroupList = list;
									$scope.accountList = [];

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
