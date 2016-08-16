var app = angular.module("stockApp");

app
		.controller(
				"voucherSalesCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $stateParams, objectFactory,
						appEndpointSF, $mdDialog, $mdMedia, $state) {

					$scope.vouchersSaview1 = $stateParams.Account;
					$scope.accountId = $stateParams.AccountId;
					var i, flag;

					$scope.vouchers = {
						accountType1 : "",
						accountType2 : "",
						amount : "",
						narration : ""
					};

					$scope.vaccounts1 = [];
					$scope.vaccounts2 = [];
					$scope.getAccountList = function() {

						var accountService = appEndpointSF.getAccountService();
						accountService.getAccountList().then(function(list) {
							for (var x = 0; x < list.length; x++) {
								$scope.vaccounts1.push(list[x]);

								$scope.vaccounts2.push(list[x]);

							}

						});
					}

				

					$scope.addvoucher = function() {

						var voucherService = appEndpointSF.getVoucherService();
						voucherService.addvoucher($scope.vouchers).then(
								function() {

									$scope.showAddToast();
									$scope.crClosingBalance = "";
									$scope.drClosingBalance = "";
									$scope.vouchers = "";
									$scope.voucherSalesForm.$setPristine();
									$scope.voucherSalesForm.$setValidity();
									$scope.voucherSalesForm.$setUntouched();

								});

					}
				

					$scope.cancle = function() {

						$state.go('accounting', {});

					}

					$scope.remSelected = function(selected, fl) {

						$scope.getAccountEntryByAccountId(selected, fl);

						
						var accountService = appEndpointSF.getAccountService();
						accountService
								.getAccountList()
								.then(
										function(list) {

											if (flag != undefined) {
												$scope.vaccounts2.push(flag);

											}

											for (i = 0; i < $scope.vaccounts2.length; i++) {

												if (selected.accountName == $scope.vaccounts2[i].accountName) {

													$scope.vaccounts2.splice(i,
															1);

													flag = selected;
													if (selected == $scope.vouchers.accountType2) {
														$scope.crClosingBalance = "";
														$scope.vouchers.accountType2 = "";
														$scope.voucherSalesForm.Account.$touched = true;
													}

													break;

												}
											}
										});

					}

				
					$scope.getAccountEntryByAccountId = function(accId, fl) {

						var AccountEntryService = appEndpointSF
								.getAccountEntryService();
						AccountEntryService
								.getAccountEntryByAccountId(accId.id)
								.then(
										function(list) {
											

											$scope.totaldebit = 0;
											$scope.totalcredit = 0;
											

											entryList = [];
											for (var i = 0; i < list.length; i++) {

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

											$scope.entries = [];
											for (var i = 0; i < entryList.length; i++) {
												if (entryList[i].accountEntity.accountType
														.trim() == "PERSONAL") {

													if (fl == 1) {

														$scope.drClosingBalance = 0;
														$scope.drClosingBalance = $scope.totalcredit
																- $scope.totaldebit;
													} else {

														$scope.crClosingBalance = 0;
														$scope.crClosingBalance = $scope.totalcredit
																- $scope.totaldebit;

													}

												}
												if (list[i].accountEntity.accountType
														.trim() == "REAL") {
													if (fl == 1) {

														$scope.drClosingBalance = 0;
														$scope.drClosingBalance = $scope.totaldebit
																- $scope.totalcredit;
													} else {

														$scope.crClosingBalance = 0;
														$scope.crClosingBalance = $scope.totaldebit
																- $scope.totalcredit;

													}

												}
												if (list[i].accountEntity.accountType
														.trim() == "NOMINAL") {
													if (fl == 1) {

														$scope.drClosingBalance = 0;
														$scope.drClosingBalance = $scope.totalcredit
																- $scope.totaldebit;
													} else {

														$scope.crClosingBalance = 0;
														$scope.crClosingBalance = $scope.totalcredit
																- $scope.totaldebit;

													}

												}

											}

											$scope.entries = entryList;
											$log.debug("**********",
													$scope.crClosingBalance);

											// return($scope.drClosingBalance);

										})

					}

					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {
							$scope.getAccountList();

						} else {
							// $log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}
					$scope.waitForServiceLoad();

				});
