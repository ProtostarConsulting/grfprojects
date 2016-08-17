angular
		.module("stockApp")
		.controller(
				"accountGroupCtr",
				function($scope, $log, $mdToast, appEndpointSF, $state) {
					$log.debug("hello");
					$scope.tempAccountGrp = {
						"groupName" : "",
						"description" : "",
						"displayOrderNo" : ""
					};

					$scope.addAccountGroup = function() {

						var addAccountGroupService = appEndpointSF
								.getAccountGroupService();
						addAccountGroupService.addAccountGroup(
								$scope.tempAccountGrp).then(function(msgbean) {
							$scope.showSavedToast();
							$scope.tempAccountGrp = {};
							$scope.addAccountGroup = "";

							$scope.accGrp.$setPristine();
							$scope.accGrp.$setValidity();
							$scope.accGrp.$setUntouched();
						}

						)
					};
					$scope.showSavedToast = function() {
						$mdToast.show($mdToast.simple().content(
								'Account Group Saved ...!').position("top")
								.hideDelay(3000));
					};

					$scope.cancelBtn = function() {
						$state.go("accounting", {});

					}

			
				});
angular
.module("stockApp")
.directive(
		'accountGroupUserexists',
		function($log, $q, appEndpointSF) {
			return {
				restrict : 'A',
				require : 'ngModel',
				link : function($scope, $element, $attrs, ngModel) {
					$log.debug("Inside of accountGroupUserexists....");
					ngModel.$asyncValidators.userexists = function(
							accountGroupValue) {
						var deferred = $q.defer();
						var AccountGroupService = appEndpointSF
								.getAccountGroupService();
						$log.debug("accountGroupValue:" + accountGroupValue);
						AccountGroupService
								.checkAccountGroupAlreadyExist(accountGroupValue)
								.then(
										function(response) {
											$log
													.debug("Inside of userexists validator fn: "
															+ response.returnBool);
											if (response.returnBool == true) {
												deferred.reject();
											} else {
												deferred.resolve();
											}
										});
						return deferred.promise;
					}

				}
			};
		});

