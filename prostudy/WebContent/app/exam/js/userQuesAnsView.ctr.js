angular
		.module("prostudyApp")
		.controller(
				"userQuesAnsViewCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, $sce, tableTestDataFactory,
						appEndpointSF, $state, $filter, $stateParams) {

					$scope.showSavedToast = function() {
						$mdToast.show($mdToast.simple()
								.content('Result Saved!').position("top")
								.hideDelay(3000));
					};

					$scope.selectedResultId = Number($stateParams.selectedResultId);
					$scope.selectedExamId = Number($stateParams.selectedExamId);

					$scope.curuser = appEndpointSF.getLocalUserService()
							.getLoggedinUser();

					$scope.userAnsList = []; // {qID, userOption}
					$scope.correctAns = [];
					$scope.score = 0;
					$scope.totalLength;
					$scope.answeredLength = 0;
					$scope.remainingLength;

					$scope.selected = [];
					$scope.Test = [];
					$scope.examResults = [];
					$scope.options = [];
					$scope.newQues = [ {
						qId : ""
					} ];

					$scope.showselectedExam = function() {
						var PracticeExamService = appEndpointSF
								.getPracticeExamService();

						PracticeExamService
								.getPracticeExamById($scope.selectedExamId)
								.then(
										function(practiceTest) {
											$scope.Test = practiceTest;
											$scope.Test.questions.description = $sce
													.trustAsHtml($scope.Test.questions.description);
											$scope.newQues = $scope.Test.questions;
											$scope.totalLength = $scope.Test.questions.length;

											$scope.newQues[0].qId = 1;
											for (var i = 1; i < $scope.newQues.length; i++) {

												$scope.newQues[i].qId = $scope.newQues[i - 1].qId + 1;

											}

										});

					}

					$scope.getPracticeExamResultbyID = function() {
						$scope.loading = true;
						var PracticeExamService = appEndpointSF
								.getPracticeExamService();
						
						PracticeExamService
								.getPracticeExamResultbyID(
										$scope.selectedResultId)
								.then(
										function(practiceExamResultList) {
											$scope.examResults = practiceExamResultList;
											for(var i = 0; i< $scope.examResults.userAns.length; i++){
												if($scope.examResults.userAns[i].userOption)
													$scope.answeredLength++;
											}
											$scope.loading = false;

										});
					}

					$scope.getPracticeExamResultbyID();
					$scope.showselectedExam();
					appEndpointSF.getLocalUserService().saveLoggedInUser(null);

				});
