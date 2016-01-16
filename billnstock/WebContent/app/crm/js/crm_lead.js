angular
		.module("stockApp")
		.controller(
				"lead",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $stateParams, $log, objectFactory,
						appEndpointSF) {
					
					$scope.lead ={
							id:"",
							name:"",
							company:"",
							phone:"",
							email:"",
							designation:"",
							address:"",
							tasks :[]
					}
					
					
					
					$scope.addlead = function() {

						var leadService = appEndpointSF.getleadService();
						
						leadService.addlead($scope.lead).then(function(msgBean) {

							$log.debug("Inside Ctr addlead");
							$log.debug("msgBean.msg:" + msgBean.msg);
							$scope.showSimpleToast(msgBean.msg);
							$scope.getAllleads();
						});

						$scope.lead = {};
					}
					
					
					$scope.getAllleads = function() {
						$log.debug("Inside Ctr $scope.getAlllead");
						var leadService = appEndpointSF.getleadService();

						leadService.getAllleads().then(function(leadList) {
							$log.debug("Inside Ctr getAllleads");
							$scope.leads = leadList;
							$scope.cleadid = $scope.leads.length + 1;
							$scope.lead.id = $scope.cleadid;
							
						});
					}
					
					$scope.leads = [];
					$scope.getAllleads();
					
					
					
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