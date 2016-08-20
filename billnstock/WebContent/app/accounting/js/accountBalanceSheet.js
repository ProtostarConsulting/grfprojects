var app = angular.module("stockApp");

app
		.controller(
				"accountBalanceSheetCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $stateParams, objectFactory, $state,
						appEndpointSF, $mdDialog, $mdMedia) {

					$scope.loading = true;
					$scope.totalBalance;

					$scope.accountGroupTypeList = [ "ASSETS", "EQUITY",
							"LIABILITIES", "INCOME", "EXPENSES",
							"OTHERINCOMES", "OTHEREXPENCES" ];

					$scope.totalTypeCount = $scope.accountGroupTypeList.length;
					$scope.accountGroupTypeGroupList = [];

					$scope.getAccountListByGroup = function(groupObj) {
						$scope.accountList = [];

						var AccountService = appEndpointSF.getAccountService();
						AccountService.getAccountListByGroupId(groupObj.id)
								.then(function(list) {

									for (var i = 0; i < list.length; i++) {
										getAccountBalance(list[i]);

									}
									

									$scope.accountList = list;									
									if (list == null) {
										groupObj.accountList = [];
									} else {
										
										groupObj.accountList = list;
									}
									
									/*for (var i = 0; i < groupObj.accountList.length; i++) {
										$log.debug("groupObj.accountList[i].balance"+ groupObj.accountList[i].balance);
										$scope.totalBalance=$scope.totalBalance+groupObj.accountList[i].balance;
									}
									
									
									//$log.debug("$scope.totalBalance"+$scope.totalBalance);
									
									groupObj.totalBalance=$scope.totalBalance;*/
								//	$log.debug("groupObj @@@@@@@@@@@@@@######  "+angular.toJson(groupObj.accountList));
								
									
								})

					};
					
				

					function getAccountBalance(accounObj) {
						var AccountService = appEndpointSF.getAccountService();
						AccountService.getAccountBalance(accounObj.id).then(
								function(objResp) {
									accounObj.balance = objResp.returnBalance;
								});
					}

					$scope.getAccountGroupListByType = function(groupTypeObj) {

						var AccountGroupService = appEndpointSF
								.getAccountGroupService();
						AccountGroupService
								.getAccountGroupListByType(
										groupTypeObj.groupType)
								.then(
										function(list) {
											$scope.GroupList = list;
											$scope.accountList = [];
											groupTypeObj.groupList = list;
											$scope.totalTypeCount--;

											if (groupTypeObj.groupList != undefined) {
												for (var i = 0; i < groupTypeObj.groupList.length; i++) {
													$scope.getAccountListByGroup(groupTypeObj.groupList[i]);
													
												}
											}

										//	$log.debug("groupTypeObj @@ "+angular.toJson(groupTypeObj.groupList));
											
											
											/*getAccountGroupBalance(groupObj);*/
											if ($scope.totalTypeCount == 0) {
												$scope.loading = false;
											}

										})

					};
					
					
					function getGroupTypeObject(groupTypeValue) {
						return {
							groupType : groupTypeValue,							
							groupList : []
						};
					}
					function getGroupAccObject(groupObj) {
						return {
							groupObj : groupObj,
							totalBalance:"45",
							accountList : []
						};
					}

					
							
				
					
					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {

							for (var i = 0; i < $scope.accountGroupTypeList.length; i++) {
								groupTypeObj = getGroupTypeObject($scope.accountGroupTypeList[i]);
								$scope.accountGroupTypeGroupList
										.push(groupTypeObj);
								$scope.getAccountGroupListByType(groupTypeObj);
							}

						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}
					$scope.waitForServiceLoad();
				});

/*angular
		.module("stockApp")
		.controller("accountBalanceSheetCtr",
				function($scope, $log, $mdToast,$stateParams, appEndpointSF, $state) {
			
			$scope.flag=$stateParams.flag;
			
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
								$scope.getAccountListByGroupId($scope.groupId);
							}else{
								if($scope.GroupList && $scope.GroupList.length > 0){
									$scope.groupId = $scope.GroupList[0].id;
									$scope.getAccountListByGroupId($scope.groupId);
								}
							}

						})

			};
			$scope.getAccountGroupList();
			$scope.getAccountGroupListByType = function(groupTypeObj) {

				var AccountGroupService = appEndpointSF
						.getAccountGroupService();
				AccountGroupService
						.getAccountGroupListByType(
								groupTypeObj.groupType)
						.then(
								function(list) {
									$scope.GroupList = list;
									$scope.accountList = [];
									groupTypeObj.groupList = list;
									$scope.totalTypeCount--;

									if (groupTypeObj.groupList != undefined) {
										for (var i = 0; i < groupTypeObj.groupList.length; i++) {
											$scope
													.getAccountListByGroup(groupTypeObj.groupList[i]);
										}
									}

									if ($scope.totalTypeCount == 0) {
										$scope.loading = false;
									}

								})

			};
			
			function getGroupTypeObject(groupTypeValue) {
				return {
					groupType : groupTypeValue,
					groupList : []
				};
			}
			function getGroupAccObject(groupObj) {
				return {
					groupObj : groupObj,
					accountList : []
				};
			}
			
			

			
		});*/