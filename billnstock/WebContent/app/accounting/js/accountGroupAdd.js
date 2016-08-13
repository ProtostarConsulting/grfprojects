angular
.module("stockApp")
.controller("accountGroupCtr",function($scope, $log,$mdToast, appEndpointSF,$state) 
		{
			$log.debug("hello");
			$scope.tempAccountGrp={"groupName":"","description":"","displayOrderNo":""};
			
			$scope.addAccountGroup=function(){				
			
				var addAccountGroupService=appEndpointSF.getAccountGroupService();
				addAccountGroupService.addAccountGroup($scope.tempAccountGrp)
				.then(function(msgbean) {
					$scope.showSavedToast();
					$scope.tempAccountGrp={};
					$scope.addAccountGroup="";
					$scope.accGrp.$setPristine();
					$scope.accGrp.$setValidity();
					$scope.accGrp.$setUntouched();
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
				
				$scope.checkGroupExist=function(name){
					
					   			if($scope.tempAccountGrp.groupName){
					var checkAccountGrp = appEndpointSF.getAccountGroupService();
					checkAccountGrp.checkAccountGrpAlreadyExist($scope.tempAccountGrp.groupName)
					.then(function(response){
						if (response.returnBool == true) {
							$scope.error = "Account Group Already Exists";
							angular.element(document
											.getElementById('grpName'));//[0].disabled = true;
							angular
									.element(document
											.getElementById('descrip'))[0].disabled = true;
							angular
									.element(document
											.getElementById('orderNo'))[0].disabled = true;
							
							angular
									.element(document
											.getElementById('addButton'))[0].disabled = true;
						} else {
							$scope.error = "";
							angular.element(document
									.getElementById('grpName'))[0].disabled = false;
					angular
							.element(document
									.getElementById('descrip'))[0].disabled = false;
					angular
							.element(document
									.getElementById('orderNo'))[0].disabled = false;
					
					angular
							.element(document
									.getElementById('addButton'))[0].disabled = false; 
						}
						
					});
						
						
					}
					
				}
		});






