angular.module("prostudyApp").controller(
		"gfExamResultListCtr",
		function($scope, $window, $mdToast, $timeout, $mdSidenav, $mdUtil,
				$log, $q, appEndpointSF, $state, $stateParams, $mdDialog,
				objectFactory, answerOfMediumList, standardList) {
			$scope.answerOfMediumList = answerOfMediumList;
			$scope.standardList = standardList

			$scope.examResultList = [];

			$scope.getExamResultEntities = function() {
				var gfStudentService = appEndpointSF.getGFStudentService();
				$scope.loading = true;
				gfStudentService.getExamResultEntities(
						$scope.curUser.instituteID).then(function(resp) {
					$scope.examResultList = resp.items;					
					$scope.loading = false;
				});
			}

			$scope.cancel = function() {
				$state.go('gandhifoundation');
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

			$scope.query = {
				order : 'description',
				limit : 120,
				page : 1
			};

			$scope.cancelButton = function() {
				$state.go("studentModule", {});
			}

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
