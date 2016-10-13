angular
		.module("prostudyApp")
		.controller(
				"practiceExamTestCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, $sce, tableTestDataFactory,
						appEndpointSF, $state, $filter, $stateParams, $mdDialog) {

					$scope.showSavedToast = function() {
						$mdToast.show($mdToast.simple()
								.content('Result Saved!').position("top")
								.hideDelay(3000));
					};

					$scope.curUser = appEndpointSF.getLocalUserService()
							.getLoggedinUser();

					// Code for timer
					var date = new Date();
					
					$scope.flag = true;

					$scope.counter = 200;
					$scope.startTime = null;
					$scope.endTime = null;
					$scope.examResults;
					$scope.selectedID;

					$scope.currentPage = 0;
					$scope.totalPages = 0;
					$scope.itemsPerPage = 4;
					$scope.count = 0;
					$scope.isDisabledPrevious = false;
					$scope.isDisabledNext = false;
					$scope.score = 0;
					$scope.newQues = [ {
						qId : ""
					} ];
					var mytimeout = null;

					$scope.onTimeout = function() {
						if ($scope.counter === 0) {
							$scope.$broadcast('timer-stopped', 0);
							$timeout.cancel(mytimeout);

							return;

						}
						$scope.counter--;

						mytimeout = $timeout($scope.onTimeout, 1000);
					};

					$scope.startTimer = function() {
						mytimeout = $timeout($scope.onTimeout, 1000);
						$scope.tempPracticeExamResult.startTime = $filter('date')(new Date(), 'hh:mm:ss a');
						
					};

					$scope.stopTimer = function() {
						var date = new Date();
						$scope.$broadcast('timer-stopped', $scope.counter);
						$timeout.cancel(mytimeout);
						$scope.tempPracticeExamResult.endTime = $filter('date')(new Date(), 'hh:mm:ss a');
					};

					$scope.$on('timer-stopped', function(event, remaining) {
						if (remaining === 0) {
							console.log('your time ran out!');

						}
					});// End of timer


					
					$scope.toggleSelection = function toggleSelection(index,id,optionId) {
						
						var idx = $scope.selection.indexOf(index, id, optionId);
						
						if (idx > -1) {
							$scope.selection.splice(index, 1);

						} else {
							$scope.selection.push(optionId);
							$scope.userAnsList.push({
								qID : id,
								userOption : 'option'+optionId
							});
						}
						
						/*for(i=0;i <$scope.selection.length; i++)
							{
								if(index+1 == $scope.selection[i])
								{
									
									$scope.selection.splice(index, 1);
								}
							}
						*/

					};
					
					
					$scope.userAnsList = []; // {qID, userOption}
					$scope.correctAns = [];
					$scope.score = 0;

					$scope.checkAnswer = function() {

						for (var i = 0; i < $scope.userAnsList.length; i++) {

							if ($scope.userAnsList[i].userOption == $scope.Test.questions[i].correctAns) {
								$scope.tempPracticeExamResult.score++;
							}

						}
						$scope.stopTimer();
						$scope.addPracticeExamResult();
					

						/*
						 * $log.debug("$scope.selectedID" +$scope.selectedID);
						 * $state.go('userQuesAnsView', {selectedExamId :
						 * $scope.Test.id, selectedResultId :
						 * $scope.selectedID});
						 */

					}

					$scope.getCorrectAnsByQID = function(qID) {

						for (var i = 0; i < $scope.Test.questions.length; i++) {

							if ($scope.Test.questions[i].id == qID) {
								return $scope.Test.questions[i].correctAns;

							}
						}
						return -1;
					}

					$scope.selected = [];

					$scope.onNext = function() {
						$scope.currentPage++;
						$scope.count = $scope.currentPage;

						$scope.array = $scope.Test.questions.slice(
								($scope.currentPage * $scope.itemsPerPage)
										- $scope.itemsPerPage,
								($scope.currentPage * $scope.itemsPerPage));
						console.log("slice =" + $scope.array);

						if ($scope.currentPage == $scope.totalPages) {
							$scope.isDisabledNext = true;

						} else {
							$scope.isDisabledPrevious = false;
						}

					}// end of onNext

					$scope.onButtonClick = function(index) {

						$scope.currentPage = index;
						$scope.count = $scope.currentPage;

						$scope.array = $scope.Test.questions.slice(
								($scope.currentPage * $scope.itemsPerPage)
										- $scope.itemsPerPage,
								($scope.currentPage * $scope.itemsPerPage));

						if ($scope.currentPage == $scope.totalPages) {
							$scope.isDisabledNext = true;

						} else {
							$scope.isDisabledNext = false;
						}
						if ($scope.currentPage == 1) {
							$scope.isDisabledPrevious = true;

						} else {
							$scope.isDisabledPrevious = false;
						}

					};// end of onPage

					$scope.onPrevious = function() {
						$scope.currentPage--;

						$scope.array = $scope.Test.questions.slice(
								($scope.currentPage * $scope.itemsPerPage)
										- $scope.itemsPerPage,
								($scope.currentPage * $scope.itemsPerPage));

						if ($scope.currentPage <= 1) {
							$scope.isDisabledPrevious = true;

						} else {
							$scope.isDisabledNext = false;
						}

					}// end of onPrevious

					$scope.score = 0;

					$scope.getPracticeExamByInstitute = function() {

						var PracticeExamService = appEndpointSF
								.getPracticeExamService();
						PracticeExamService.getPracticeExamByInstitute(
								$scope.curUser.instituteID).then(
								function(practiceExamList) {
									$scope.practiceTest = practiceExamList;

								});
					}

					$scope.selectedExamId = $stateParams.selectedExamId;

					$scope.showselectedExam = function() {
						var PracticeExamService = appEndpointSF
								.getPracticeExamService();

						PracticeExamService.getPracticeExamById($scope.selectedExamId)
								.then(
										function(practiceTest) {
											$scope.Test = practiceTest;

											$scope.buttonLimit = function(count) {
												$scope.totalPages = Math
														.ceil($scope.Test.questions.length / 4);

												return Array.apply(0,
														Array(+count)).map(
														function(value, index) {
															return index;
														});

											}// end of buttonlimit

											$scope.newQues = $scope.Test.questions;

											$scope.newQues[0].qId = 1;
											for (var i = 1; i < $scope.newQues.length; i++) {

												$scope.newQues[i].qId = $scope.newQues[i - 1].qId + 1;

											}

											$scope.tempPracticeExamResult.examTitle = $scope.Test.examtitle;

											$scope.tempPracticeExamResult.test = $scope.Test.questions;

											$scope.onNext();
											$scope.isDisabledPrevious = true;
										});

					}// End of showselectedExam

					$scope.questions = [];
					$scope.practiceTest = [];
					$scope.Test = [];
					$scope.selection = [];
					$scope.userAns = [];

					$scope.getPracticeExamResultbyEmail = function() {

						var PracticeExamService = appEndpointSF
								.getPracticeExamService();

						PracticeExamService
								.getPracticeExamResultbyEmail(
										$scope.curUser.email_id)
								.then(
										function(practiceExamResultList) {

											$scope.examResults = practiceExamResultList;

										});
					}

					$scope.tempPracticeExamResult = {

						ID : "",
						examTitle : "",
						userId : $scope.curUser.id,
						email_id : $scope.curUser.email_id,
						firstName : $scope.curUser.firstName,
						lastName : $scope.curUser.lastName,
						startTime : "",
						endTime : "",
						score : $scope.score,
						userAns : $scope.userAnsList,
						testID : "",
						test : ""

					}

					$scope.addPracticeExamResult = function() {

						$scope.tempPracticeExamResult.testID = $scope.selectedExamId;
						var PracticeExamService = appEndpointSF.getPracticeExamService();

				

						PracticeExamService.addPracticeExamResult(
								$scope.tempPracticeExamResult).then(
								function(msgBean) {
									$scope.selectedID = msgBean.id;
									$log.debug("$scope.selectedID :"
											+ $scope.selectedID);
									$log.debug("$scope.Test.id :"
											+ $scope.Test.id);
									$state.go('userQuesAnsView', {
										selectedExamId : $scope.Test.id,
										selectedResultId : $scope.selectedID
									});
									$scope.showSavedToast();

								});


					}
					
					 $scope.showConfirm = function(ev) {
						  
						 	$scope.checkAnswer();
						    var confirm = $mdDialog.confirm()
						          .title('Are you sure you want to submit test now?')
						          .targetEvent(ev)
						          .ok('YES')
						          .cancel('NO');
						    $mdDialog.show(confirm).then(function() {
						    			$state.go('userQuesAnsView', {selectedExamId : $scope.Test.id, selectedResultId : $scope.selectedID, flag: $scope.flag});
						    }, function() {
						      //do nothing to stay on page.
						    });
						  };

					



					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {

							$scope.getPracticeExamByInstitute();
							$scope.getPracticeExamResultbyEmail();
							$scope.showselectedExam();
							
						} else {
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}


					$scope.waitForServiceLoad();

				});
