angular
		.module("stockApp")
		.controller(
				"setup",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $stateParams, $mdMedia, $mdDialog, $log,
						objectFactory, appEndpointSF) {

					$scope.showSimpleToast = function(msgBean) {
						$mdToast.show($mdToast.simple().content(msgBean)
								.position("top").hideDelay(3000));
					};
					$scope.businessNo = $stateParams.businessNo;
							
					$scope.curuser = appEndpointSF.getLocalUserService().getLoggedinUser();

				
					
				
					// ----------hide and show ---------------------------

					$scope.IsHidden = true;
					$scope.ShowHide = function() {
						$scope.IsHidden = $scope.IsHidden ? false : true;
					}
					// -----------------------------------------------------

				
					

					$scope.toggleRight = buildToggler('right');

					function buildToggler(navID) {
						var debounceFn = $mdUtil.debounce(function() {
							$mdSidenav(navID).toggle().then(function() {
								$log.debug("toggle " + navID + " is done");
							});
						}, 200);
						return debounceFn;
					}

					$scope.close = function() {
						$mdSidenav('right').close().then(function() {
							$log.debug("close RIGHT is done");
						});
					};

			
			
			
				});
