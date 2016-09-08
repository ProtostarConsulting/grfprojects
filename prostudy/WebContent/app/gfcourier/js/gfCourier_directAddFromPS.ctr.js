angular
		.module("prostudyApp")
		.controller(
				"gfCourierDirectAddCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, appEndpointSF, $state, $stateParams,
						$mdDialog, objectFactory, logisticsList,
						courierTypelist, ajsCache) {
					
					$scope.loading = true;
					$scope.logisticsList = logisticsList;
					$scope.courierTypelist = courierTypelist;
					$scope.partnerSchool = {
						courierType : '',
						logistics : '',
						registrationID : '',
						weight : '',
						courierFrom : "Gandhi Foundation",
						courierTo : '',
						schoolName : '',
						courierDispatchDate : new Date(),
						bookQty : 0,
						bookLineItemList : [],
						otherLineItemList : []
					}
					$scope.newCourierObj = {
						bookLineItemList : []
					};
					$scope.newCourierObj.courierDispatchDate = new Date();
					$scope.tempPartnerSchool = {
						examDetailList : ''
					};

					$scope.yearOfExam = $stateParams.yearOfExam;
					$scope.partnerSchool = $stateParams.partnerSchool;
					$log.debug("$scope.partnerSchool=="
							+ angular.toJson($scope.partnerSchool));

					if ($scope.yearOfExam != undefined
							|| $scope.partnerSchool != undefined) {
						$scope.partnerSchool.courierTo = $scope.partnerSchool.schoolName
								+ ", "
								+ $scope.partnerSchool.address.line1
								+ ", "
								+ $scope.partnerSchool.address.city
								+ ", "
								+ $scope.partnerSchool.address.state
								+ ", "
								+ "PIN-"
								+ $scope.partnerSchool.address.pin;

						$scope.partnerSchool.courierFrom = $scope.curUser.instituteObj.name
								+ ", "
								+ $scope.curUser.instituteObj.address.line1;
					}

					$scope.addGFCourier = function() {
						$scope.loading = true;
						$scope.newCourierObj.instituteID = $scope.curUser.instituteID;

						$scope.newCourierObj.schoolName = $scope.pSchool;
						$scope.newCourierObj.govRegisterno = $scope.partnerSchool.govRegisterno;
						$scope.newCourierObj.autoGenerated = $scope.partnerSchool.autoGenerated;
						// $scope.newCourierObj.courierDispatchDate = new
						// Date();
						$scope.newCourierObj.courierFrom = $scope.partnerSchool.courierFrom;
						$scope.newCourierObj.courierTo = $scope.partnerSchool.courierTo;
						$scope.newCourierObj.courierType = $scope.partnerSchool.courierType;
						$scope.newCourierObj.logistics = $scope.partnerSchool.logistics;

						for (var i = 0; i < $scope.tempPartnerSchool.examDetailList.bookSummary.bookDetail.length; i++) {
							for (var j = 0; j < $scope.bookStocks.length; j++) {
								if ($scope.tempPartnerSchool.examDetailList.bookSummary.bookDetail[i].bookName == $scope.bookStocks[j].id) {
									$scope.bookStocks[j].bookQty = $scope.tempPartnerSchool.examDetailList.bookSummary.bookDetail[i].totalStud;
									$scope.weight = $scope.weight
											+ $scope.bookStocks[j].weight
											* $scope.tempPartnerSchool.examDetailList.bookSummary.bookDetail[i].totalStud;
									$scope.newCourierObj.bookLineItemList
											.push($scope.bookStocks[j]);

								}
							}
						}

						var gfCourierService = appEndpointSF
								.getGFCourierService();

						gfCourierService
								.addGFCourier($scope.newCourierObj)
								.then(
										function(addedCourier) {
											$scope.showAddToast();
											$scope.loading = false;
											var courierListCacheKey = "gf-courierListCache";
											// Note this key has to be unique
											// across application
											// else it will return unexpected
											// result.
											if (addedCourier.id != ''
													&& !angular
															.isUndefined(ajsCache
																	.get(courierListCacheKey))) {
												$log
														.debug("Found List in Cache, return it.")
												$scope.gfCouriertList = ajsCache
														.get(courierListCacheKey);
												$scope.gfCouriertList
														.push(addedCourier);
											}
											$state.go('courierModule.list', {});
										});
					}

					$scope.getSchoolByAutoGeneratedID = function() {
						$scope.loading = true;
						var PartnerService = appEndpointSF
								.getPartnerSchoolService();
						PartnerService
								.getSchoolByAutoGeneratedID(
										$scope.partnerSchool.autoGenerated)
								.then(
										function(pSchool) {
											$scope.pSchool = pSchool;

											$scope.partnerSchool.courierFrom = $scope.curUser.instituteObj.name
													+ ", "
													+ $scope.curUser.instituteObj.address.line1;

											if ($scope.partnerSchool.examDetailList != undefined) {

												for (var i = 0; i < $scope.partnerSchool.examDetailList.length; i++) {

													if ($scope.partnerSchool.examDetailList[i].yearOfExam == $scope.yearOfExam) {
														$scope.tempPartnerSchool.examDetailList = $scope.partnerSchool.examDetailList[i];
													}
												}

												$scope.newCourierObj.totalFees = $scope.tempPartnerSchool.examDetailList.bookSummary.amtForGRF80per;
												$scope.newCourierObj.totalWeight = 0;

												for (var i = 0; i < $scope.tempPartnerSchool.examDetailList.bookSummary.bookDetail.length; i++) {
													for (var j = 0; j < $scope.bookStocks.length; j++) {

														if ($scope.tempPartnerSchool.examDetailList.bookSummary.bookDetail[i].bookName == $scope.bookStocks[j].id) {

															$scope.newCourierObj.totalWeight = ($scope.newCourierObj.totalWeight)
																	+ ($scope.bookStocks[j].weight * $scope.tempPartnerSchool.examDetailList.bookSummary.bookDetail[i].totalStud);

															/*
															 * $scope.newCourierObj.totalFees =
															 * $scope.newCourierObj.totalFees +
															 * $scope.tempPartnerSchool.examDetailList.bookSummary.bookDetail[i].totalFees;
															 */
														}
													}
												}
											}
											$scope.loading = false;
										});
					}

					$scope.getGFBookStockByInstituteId = function() {
						$scope.loading = true;
						var gfBookStockService = appEndpointSF
								.getGFBookStockService();
						gfBookStockService.getGFBookByInstituteId(
								$scope.curUser.instituteID).then(
								function(tempBooks) {
									$scope.bookStocks = tempBooks;
									$scope.getSchoolByAutoGeneratedID();
									$scope.loading = false;
								});
					}
					$scope.bookStocks = [];

					$scope.showCourierExistsAlert = function(ev) {
						var confirm = $mdDialog
								.confirm()
								.title(
										'The courier for this school is already added. Please click Okay to go to courier list.')
								.textContent('')
								.ariaLabel(
										'The courier for this school already present.')
								.targetEvent(ev).ok('Okay');

						var gotoListFn = function() {
							$state.go('courierModule.list', {});
						};

						$mdDialog.show(confirm).then(gotoListFn, gotoListFn);
					};
					

					$scope.waitForServiceLoad1 = function() {
						if (appEndpointSF.is_service_ready) {
							if ($scope.yearOfExam != undefined
									|| $scope.partnerSchool != undefined) {
								
								var gfCourierService = appEndpointSF.getGFCourierService();
								gfCourierService.getCourierByGRFNo($scope.partnerSchool.autoGenerated).then(
										function(foundCourier) {
											if(foundCourier.id && foundCourier.id != '' ){
												$scope.showCourierExistsAlert({});
											}else{
												$scope.getGFBookStockByInstituteId();
											}												
										});
							}
						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad1, 1000);
						}
					}

					$scope.waitForServiceLoad1();

				});
