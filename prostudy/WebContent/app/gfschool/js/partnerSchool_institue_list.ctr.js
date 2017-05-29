angular.module("prostudyApp").controller(
		"partnerSchool_Institue_ListCtr",
		function($scope, $window, $mdToast, $timeout, $mdSidenav, $mdUtil,
				$log, appEndpointSF, $state, $sce, $stateParams, $q, $mdDialog,
				$mdMedia, $location, $anchorScroll, Upload, ajsCache) {

			console.log("inside institue list ctr***");
			$scope.curUser = appEndpointSF.getLocalUserService()
					.getLoggedinUser();
			$scope.pSchoolInstitueList = [];

			$scope.getPartnerSchoolInstituteList = function() {
				var PartnerSchoolService = appEndpointSF
						.getPartnerSchoolService();

				PartnerSchoolService.getPartnerSchoolInstituteList().then(
						function(list) {
							$scope.pSchoolInstitueList = list;
						});
			}

			$scope.waitForServiceLoad = function() {
				if (appEndpointSF.is_service_ready) {
					$scope.getPartnerSchoolInstituteList();
				} else {
					$log.debug("Services Not Loaded, watiting...");
					$timeout($scope.waitForServiceLoad, 1000);
				}
			}

			$scope.waitForServiceLoad();
		});