angular
		.module("prostudyApp")
		.controller(
				"gfSelectedBookRecordCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, $mdDialog, $mdMedia, $stateParams,
						tableTestDataFactory, ajsCache, $state, Upload,
						appEndpointSF) {

					$scope.curUser = appEndpointSF.getLocalUserService()
							.getLoggedinUser();

					$scope.selectedGFBook = $stateParams.selectedGFBook;
					$scope.selectedBookQty = [];
					$scope.fetchSchoolByBId = function() {
						$scope.loading = true;
						$scope.schoolList = [];
						$scope.totalBookQty = 0;
						var partnerSchoolService = appEndpointSF
								.getPartnerSchoolService();
						partnerSchoolService
								.getSchoolByBId($scope.selectedGFBook.id,
										$scope.curUser.instituteObj.yearofExam)
								.then(
										function(schoolList) {
											$scope.schoolList = schoolList;
											for (var k = 0; k < schoolList.length; k++) {
												for (var i = 0; i < schoolList[k].examDetailList.length; i++) {
													if ($scope.curUser.instituteObj.yearofExam == schoolList[k].examDetailList[i].yearOfExam) {
														for (j = 0; j < schoolList[k].examDetailList[i].bookSummary.bookDetail.length; j++) {
															if ($scope.selectedGFBook.id == schoolList[k].examDetailList[i].bookSummary.bookDetail[j].bookName) {
																$scope.totalBookQty = $scope.totalBookQty
																		+ schoolList[k].examDetailList[i].bookSummary.bookDetail[j].totalStud;
																$scope.selectedBookQty
																		.push(schoolList[k].examDetailList[i].bookSummary.bookDetail[j].totalStud);
															}
														}
													}
												}
											}
											$scope.loading = false;
										});
					}

					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {
							$scope.fetchSchoolByBId();
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