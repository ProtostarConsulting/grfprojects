angular.module("prostudyApp").controller(
		"gfExamResultListReportCtr",
		function($scope, $window, $mdToast, $timeout, $mdSidenav, $mdUtil,
				$log, $q, appEndpointSF, $state, $stateParams, $mdDialog,
				objectFactory, answerOfMediumList, standardList,
				indiaAddressLookupData) {

			$scope.pendingSchoolList = [];

			$scope.getExamResultEntities = function() {
				$scope.loading = true;
				var PartnerService = appEndpointSF.getPartnerSchoolService();
				PartnerService.getPendingResultSchools(
						$scope.curUser.instituteID,
						$scope.curUser.instituteObj.yearofExam).then(
						function(list) {
							$scope.pendingSchoolList = list;
							$scope.loading = false;
						});
			}

			$scope.waitForServiceLoad = function() {
				if (appEndpointSF.is_service_ready) {
					$scope.getExamResultEntities();
				} else {
					$log.debug("Services Not Loaded, watiting...");
					$timeout($scope.waitForServiceLoad, 1000);
				}
			}

			$scope.waitForServiceLoad();

			$scope.getRowStyle = function(even) {
				if (!even) {
					return {
						'border' : '1px solid black',
						'text-align' : 'left',
						'padding' : '2px',
						'background-color' : '#8cced4'
					};
				} else {
					return {
						'border' : '1px solid black',
						'text-align' : 'left',
						'padding' : '2px'
					};
				}
			}

			$scope.getTHStyle = function() {
				return {
					'border' : '1px solid black',
					'text-align' : 'center',
					'padding' : '5px',
					'background-color' : '#44acb6'
				};

			}
		});