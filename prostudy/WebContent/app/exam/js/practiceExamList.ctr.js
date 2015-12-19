angular
		.module("prostudyApp")
		.controller(
				"practiceExamListCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, $sce, tableTestDataFactory,
						appEndpointSF, $state, $filter) {

					$log.debug("Inside practiceExamListCtr");
					$scope.showSavedToast = function() {
						$mdToast.show($mdToast.simple()
								.content('Result Saved!').position("top")
								.hideDelay(3000));
					};

					$scope.getPracticeExams = function() {

						var PracticeExamService = appEndpointSF
								.getPracticeExamService();
						PracticeExamService
								.getPracticeExams()
								.then(
										function(practiceExamList) {
											$log
													.debug("Inside Ctr getPracticeExam");
											$scope.practiceTest = practiceExamList;
											$scope.practiceTest.description = $sce
													.trustAsHtml($scope.practiceTest.description);

										});
					}// End of getPracticeExams

					$scope.addTestToMyList = function(selectedMyExamId) {
						
						$log.debug("selectedMyExamId:" + selectedMyExamId);
						
						var UserService = appEndpointSF.getUserService();
						UserService.addMyPracticeExam(
								UserService.getExamId(selectedMyExamId)).then(
								function() {
									$scope.showSavedToast();
								});
						
					};
					
					$scope.getPracticeExams();

				});// end of examDemoCtr
