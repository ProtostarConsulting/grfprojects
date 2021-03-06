angular
		.module("prostudyApp")
		.controller(
				"commonSettingsCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, $mdDialog, $mdMedia,
						tableTestDataFactory, appEndpointSF) {

					$scope.curUser = appEndpointSF.getLocalUserService()
							.getLoggedinUser();
					$scope.settingsObj = {}

					$scope.addSettings = function() {

						var proadminService = appEndpointSF
								.getProtostarAdminService();
						proadminService.addCommonSettingsEntity(
								$scope.settingsObj).then(function(savedRecoed) {
							$scope.settingsObj.id = savedRecoed.id;
							$scope.showUpdateToast();
						});
					}

					$scope.getSettings = function() {
						$scope.loading = true;
						var proadminService = appEndpointSF
								.getProtostarAdminService();
						proadminService
								.getCommonSettingsEntity()
								.then(
										function(settingsOutput) {
											if (settingsOutput.result)
												$scope.settingsObj = settingsOutput.result;
												$scope.settingsObj.currYearofExam = $scope.curUser.instituteObj.yearofExam;
												$scope.loading = false;
										});
					}
					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {
							$scope.getSettings();
						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}
					$scope.waitForServiceLoad();
				});