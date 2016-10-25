angular
		.module("prostudyApp")
		.controller(
				"gfExamResultAddCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, appEndpointSF, $state, $stateParams,
						$mdDialog, $location, $anchorScroll, $filter,
						objectFactory, answerOfMediumList, standardList) {

					$scope.loading = true;
					var gfStudentService = appEndpointSF.getGFStudentService();
					var partnerSchoolService = appEndpointSF
							.getPartnerSchoolService();

					$scope.reviewByGrfRegNo = $stateParams.reviewByGrfRegNo;

					$scope.answerOfMediumList = answerOfMediumList;
					$scope.standardList = standardList
					$scope.data = {
						grfRegNo : '',
						coordinatorMobileNumberEntered : '',
						foundValidRecord : false,
						errorMsg : '',
						guestSuccessMsg : ''
					};

					$scope.examResultList = [];
					$scope.currentSchoolStandardList = [];

					$scope.getEmptyExamResult = function(school, standard) {
						return {
							createdDate : new Date(),
							standard : standard,
							studName : '',
							mediumOfAnswer : '',
							marks : '',
							createdDate : new Date(),
							modifiedBy : $scope.curUser ? $scope.curUser.email_id
									: 'guest',
							school : school,
							institute : school.institute,
							examYear : $scope.examDetail.yearOfExam,
							grfReviewed : false
						};
					}

					$scope.getBookDetailList = function(school) {
						if (year1 == undefined) {
							var date1 = new Date();
							var year1 = date1.getFullYear();
							year1 = year1.toString().substr(2, 2);
							year1 = date1.getFullYear() + "-"
									+ (Number(year1) + 1);
						}
						$scope.bookDetailList = [];
						for (q = 0; q < school.examDetailList.length; q++) {
							if (school.examDetailList[q].yearOfExam == year1) {
								if (school.examDetailList[q].bookSummary) {
									$scope.bookDetailList = school.examDetailList[q].bookSummary.bookDetail;
									$scope.examDetail = school.examDetailList[q];
								} else {
									return null;
								}
							}
						}
						return $scope.bookDetailList;
					}

					$scope.getResultListFor = function(std) {
						var tempExamResultList = [];

						angular.forEach($scope.examResultList, function(er) {
							if (std == er.standard) {
								tempExamResultList.push(er);
							}
						});

						return tempExamResultList;
					}

					$scope.grfRegNoChange = function(enteredGrfRegNo) {

						$scope.loading = true;
						
						var grfRegNo = (enteredGrfRegNo
								.startsWith('P-2016-') && enteredGrfRegNo.length >= 12) ? enteredGrfRegNo
								: 'P-2016-' + enteredGrfRegNo;

						$scope.examResultList = [];
						$scope.currentSchoolStandardList = [];
						$scope.foundSchool = null;
						$scope.data.foundValidRecord = false;
						$scope.data.guestSuccessMsg = '';

						partnerSchoolService
								.getSchoolByAutoGeneratedID(grfRegNo)
								.then(
										function(resp) {

											if (resp.items && resp.items.length) {
												$scope.foundSchool = resp.items[0];
											}
											if ($scope.foundSchool == null) {
												$scope.data.errorMsg = "This GRF. Reg. No. is not found. Please correct it and try. Please contact GRF office.";
												$scope.loading = false;
												return;
											} else {
												var studPerStd = 3;
												// three students/results per
												// std
												var contactDetail = $scope.foundSchool.contactDetail;
												$scope.coordinatorDetail = null;
												if (contactDetail.coordinatorDetail != undefined
														&& contactDetail.coordinatorDetail.length > 0) {
													$scope.coordinatorDetail = contactDetail.coordinatorDetail[0];
												}
												var userEnteredCoOrdMobileNo = '91'
														+ $scope.data.coordinatorMobileNumberEntered;
												// Check this only if user is
												// not logged-in
												if (!$scope.curUser
														&& ($scope.coordinatorDetail == null || userEnteredCoOrdMobileNo
																.indexOf($scope.coordinatorDetail.coordinatorMobileNum) == -1)) {
													$scope.data.errorMsg = "Entered co-ordinator number did not match with our records. Please contact GRF office.";
													$scope.loading = false;
													return;
												}
												$scope.bookDetailList = $scope
														.getBookDetailList($scope.foundSchool);

												if ($scope.bookDetailList == null) {
													$scope.data.errorMsg = "There are no book details associated with this school/college. Please contact GRF office.";
													$scope.loading = false;
													$scope.foundSchool = null;
													return;
												}

												// Get ResultList if already
												// entered.
												gfStudentService
														.serachExamResultEntitiesBySchool(
																$scope.foundSchool)
														.then(
																function(resp) {
																	angular
																			.forEach(
																					$scope.bookDetailList,
																					function(
																							book) {

																						if ($scope.currentSchoolStandardList
																								.indexOf(book.standard) == -1) {
																							$scope.currentSchoolStandardList
																									.push(book.standard);

																							var foundResultList = [];

																							if (resp.items
																									&& resp.items.length > 0) {
																								var foundResultList = $scope
																										.getExistingResultListForStd(
																												resp.items,
																												book.standard);
																								if (foundResultList.length > 0) {
																									$scope.examResultList = $scope.examResultList
																											.concat(foundResultList);

																								}
																							}

																							for (var i = 1; i <= (studPerStd - foundResultList.length); i++) {
																								$scope.examResultList
																										.push($scope
																												.getEmptyExamResult(
																														$scope.foundSchool,
																														book.standard));

																							}

																							$scope.examResultList = $filter(
																									'orderObjectBy')
																									(
																											$scope.examResultList,
																											'-marks')

																						}
																					});

																	$scope.data.foundValidRecord = true;
																	$scope.loading = false;
																});
											}

										});
					}

					$scope.getExistingResultListForStd = function(resultList,
							std) {
						var foundResultList = [];
						angular.forEach(resultList, function(resultObj) {
							if (resultObj.standard == std)
								foundResultList.push(resultObj);
						});
						return foundResultList;

					}

					$scope.addExamResultList = function() {
						$scope.loading = true;

						var resultWrapper = {
							list : $scope.examResultList,
							school : $scope.foundSchool
						};
						gfStudentService
								.addExamResults(resultWrapper)
								.then(
										function(resp) {

											if ($scope.reviewByGrfRegNo) {
												$scope.showUpdateToast();
											} else {
												$scope.showAddToast();
											}

											if (!$scope.curUser) {
												$scope.data.guestSuccessMsg = "Data saved successfully. If any question, please contact GRF office. Thank you.";
												$location.hash('topRight');
												$anchorScroll();
											} else {
												$state.reload();
											}
											$scope.loading = false;
										});
					}

					$scope.addMoreStudent = function(std) {

						for (var i = 1; i <= 5; i++) {
							$scope.examResultList
									.push($scope.getEmptyExamResult(
											$scope.foundSchool, std));

						}
					}

					$scope.saveReviewedExamResultList = function() {
						angular
								.forEach(
										$scope.examResultList,
										function(resultObj) {
											resultObj.grfReviewed = true;
											resultObj.modifiedDate = new Date();
											resultObj.modifiedBy = $scope.curUser ? $scope.curUser.email_id
													: 'guest';
										});

						$scope.addExamResultList();
					}

					$scope.cancel = function() {
						$state.go('gandhifoundation');
					}

					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {
							if ($scope.reviewByGrfRegNo) {
								$scope.grfRegNoChange($scope.reviewByGrfRegNo);
							} else {
								$scope.loading = false;
							}
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

					$scope.getStandardLabelStyle = function() {
						return {
							'padding-top' : '5px'
						};

					}
					$scope.getStudNameStyle = function() {
						return {
							'padding-left' : '100px',
							'padding-right' : '50px',
						};

					}

					$scope.getFormRowStyle = function() {
						return {
							'padding-top' : '1px',
							'padding-bottom' : '2px'
						};

					}

					$scope.getTableStyle = function() {
						return {
							'width' : '10%',
							'border-collapse' : 'collapse',
							'border' : '1px solid black',
							'padding-left' : '5px',
							'padding-right' : '5px',
							'padding-top' : '5px'
						};

					}
				});
