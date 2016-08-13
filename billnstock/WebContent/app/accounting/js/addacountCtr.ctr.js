var app = angular.module("stockApp");

app
		.controller(
				"addacountCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $stateParams, objectFactory,
						appEndpointSF, $mdDialog, $mdMedia, $state) {

					$scope.query = {
						order : 'name',
						limit : 5,
						page : 1
					};
					$scope.accountId = $stateParams.AccountId;

					$scope.account = {
						accountName : "",
						accountNo : "",
						displayOrderNo : "",
						description : "",
						contra : false,
						accountgroup : ""// {}

					};
					$scope.cancle = function(accountId) {

						if (accountId != undefined) {
							$state.go('accounting.accountlist', {});
						} else {
							$state.go('accounting', {});
						}

					}

							$scope.accountType = [ 'PERSONAL', 'REAL',
									'NOMINAL' ],

							$scope.addAccount = function() {

								
								var accountservice = appEndpointSF
										.getAccountService();

								for (var i = 0; i < $scope.accountgroupList.length; i++) {
									if ($scope.account.accountgroup.groupName == $scope.accountgroupList[i].groupName) {
										$scope.account.accountgroup = $scope.accountgroupList[i];
									}
								}

								accountservice.addAccount1($scope.account)
										.then(function() {
											if ($stateParams.AccountId == "")
												$scope.showAddToast();
											else
												$scope.showUpdateToast();

										});

								/*
								 * if ($scope.accountId == "") {
								 * $scope.showAddToast(); } else {
								 * $scope.showUpdateToast(); }
								 */
								$scope.account = "";
								$scope.accountForm.$setPristine();
								$scope.accountForm.$setValidity();
								$scope.accountForm.$setUntouched();
							}

					$scope.accountgroupList = [];
					$scope.getGrouplist = function() {

						var listAccountGroupService = appEndpointSF
								.getAccountGroupService();
						listAccountGroupService
								.getAccountGroupList()
								.then(
										function(list) {
											/* $log.debug("list:"+angular.toJson(list)); */
											$scope.accountgroupList = list;
											$log
													.debug("accountgroup: "
															+ angular
																	.toJson($scope.accountgroup));
											/* ajsCache.put(AccountGroupServiceCacheKey,list); */
										});

					}
					
					$scope.checkAccountExist=function(name){
						
			   			if($scope.account.accountName){
			var checkAccount = appEndpointSF.getAccountService();
			checkAccount.checkAccountAlreadyExist($scope.account.accountName)
			.then(function(response){
				if (response.returnBool == true) {
					$scope.error = "Account Already Exists";				
					
					angular.element(document.getElementById('addButton'))[0].disabled = true;
					//accountForm.accountName.$error=true;
					 //$scope.accountForm.accountName.$setValidity(true);
				} 
				else {
					$scope.error = "";
					
				}
				
			});
				
				
			}
			
		}
					
					
					
					
					

					$scope.getAccByid = function() {

						var getrecord = appEndpointSF.getAccountService();
						getrecord.getAccountById($scope.accountId).then(
								function(account) {
									$scope.account = account;

								});
					}

/*					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {

							$scope.getGrouplist();
							if ($scope.accountId != undefined) {

								$scope.getAccByid();

							}

						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}
*/
					$scope.getGrouplist();
					$scope.getAccByid();
					/*$scope.waitForServiceLoad();*/

				});
