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

					$scope.selectedResultId = $stateParams.selectedResultId;
					$scope.selectedExamId = $stateParams.selectedExamId;
					$scope.flag = $stateParams.flag;

					$scope.curuser = appEndpointSF.getLocalUserService()
							.getLoggedinUser();

					$scope.userAnsList = []; // {qID, userOption}
					$scope.correctAns = [];
					$scope.score = 0;
					$scope.totalLength;
					$scope.answeredLength;
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

						var PracticeExamService = appEndpointSF
								.getPracticeExamService();

						PracticeExamService
								.getPracticeExamResultbyID(
										$scope.selectedResultId)
								.then(
										function(practiceExamResultList) {

											$scope.examResults = practiceExamResultList;
											$scope.answeredLength = $scope.examResults.userAns.length;

										});
					}

					$scope.getPracticeExamResultbyID();
					$scope.showselectedExam();

					$scope.cancelButton = function() {
						if ($scope.flag == "true") {
							$state.go("exam");
						} else {
							$state.go("favourite");
						}

					}

				});
