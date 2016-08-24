angular
.module("stockApp")
.controller("accountGroupCtr",function($scope, $log,$mdToast, appEndpointSF,$state) 
		{
						
			$scope.tempAccountGroup=
			{
			groupName:"",
			description:"",
			displayOrderNo:"",
			accountGroupType:""
			};
			
			$scope.accountGroupTypeList=["ASSETS", "EQUITY", "LIABILITIES","INCOME","EXPENSES","OTHERINCOMES","OTHEREXPENCES"];
			
			$scope.addAccountGroup=function(){				
			
				var addAccountGroupService=appEndpointSF.getAccountGroupService();
				addAccountGroupService.addAccountGroup($scope.tempAccountGroup)
				.then(function(msgbean) {
					$scope.showSavedToast();
					$scope.tempAccountGroup={};
					$scope.addAccountGroup="";
					$scope.accGroupForm.$setPristine();
					$scope.accGroupForm.$setValidity();
					$scope.accGroupForm.$setUntouched();
					}
			
				)};
				$scope.showSavedToast = function() {
					$mdToast.show($mdToast.simple().content(
					'Account Group Saved ...!').position("top").hideDelay(
					3000));
				};
				
				$scope.cancelBtn=function(){
					$state.go("accounting", {  });
					
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
						$log.debug("accountValue:" + accountGroupValue);
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



