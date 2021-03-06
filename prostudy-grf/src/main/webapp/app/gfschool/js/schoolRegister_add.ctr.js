angular
		.module("prostudyApp")
		.controller(
				"schoolRegisterAddCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, tableTestDataFactory, $state,
						$stateParams, $location, $anchorScroll, appEndpointSF,
						partnerSchoolLevels, standardList,
						indiaAddressLookupData) {

					console.log("Inside schoolRegisterAddCtr");
					$scope.curUser = appEndpointSF.getLocalUserService()
							.getLoggedinUser();

					$scope.Country = indiaAddressLookupData;
					$scope.partnerSchoolLevels = partnerSchoolLevels;
					$scope.standardList = standardList;
					$scope.tempInstituteList = [];
					$scope.commonSettingsObj = null;

					$scope.partnerSchool = {
						address : $scope.Address,
						autoGenerated : "",
						govRegisterno : "",
						schoolName : "",
						formNumber : "",
						category : "",
						contactDetail : "",
						primaryContact : "",
						examDetailList : [],
					};

					$scope.examDetail = {
						totalStudent : "",
						male : "",
						female : "",
						total : "",
						/* examMedium : $scope.selected, */
						yearOfExam : "",
						bookRequired : 'OffLine',
						modeOfExam : 'OffLine',
						bookSummary : "",
						paymentDetail : $scope.PaymentDetail,

					}

					$scope.contactDetail = {
						headMasterName : "",
						headMasterMobile : "",
						headMasterPhone : "",
						headMasterEmailId : "",
						coordinatorDetail : [ {
							srno : 1,
							coordinatorName : "",
							coordinatorPhoneNum : "",
							coordinatorMobileNum : "",
							coordinatorEmailId : "",
						} ]

					}

					$scope.Address = {
						line1 : "",
						dist : "",
						city : "",
						state : "",
						country : "India",
						pin : "",
						tal : "",
						otherState : "",
						otherDist : "",
						otherTal : "",
						otherAddressFlag : false
					}

					$scope.addPartnerSchool = function() {

						// $scope.partnerSchool.instituteID =
						// $scope.curUser.instituteID;
						$scope.partnerSchool.contactDetail = $scope.contactDetail;

						if ($scope.schoolid != undefined
								&& $scope.selectedPSchoolId == "") {
							$scope.partnerSchool.id = $scope.schoolid.id;
						}

						if ($scope.partnerSchool.address != undefined) {
							if ($scope.partnerSchool.address.state == "Other") {
								$scope.partnerSchool.address.state = $scope.partnerSchool.address.otherState;
								$scope.partnerSchool.address.dist = $scope.partnerSchool.address.otherDist;
								$scope.partnerSchool.address.tal = $scope.partnerSchool.address.otherTaluka;
								$scope.partnerSchool.address.otherAddressFlag = true;
							} else {
								$scope.partnerSchool.address.otherAddressFlag = false;
							}
						} else {
							$scope.partnerSchool.address = $scope.Address;
						}

						$scope.partnerSchool.examDetailList = $scope.examlist;

						$scope.getExamByYear();
						var PartnerSchoolService = appEndpointSF
								.getPartnerSchoolService();

						$scope.partnerSchool.modifiedDate = new Date();

						$location.hash('topRight');
						$anchorScroll();
						$scope.loading = true;

						$scope.partnerSchool.instituteID = $scope.commonSettingsObj.grfInstituteId;
						PartnerSchoolService
								.addPartnerSchool($scope.partnerSchool)
								.then(
										function(schoolid) {
											$scope.loading = false;
											if (schoolid.code) {
												$scope
														.showErrorToast("Error occured while saving data. Please try latter on or contact technical support. Error Details:"
																+ schoolid.message);
											} else {
												$scope.schoolid = schoolid;

												if ($scope.selectedPSchoolId != undefined) {
													$scope.showUpdateToast();
												} else {
													$scope.showAddToast();
												}
												$scope.addPaymentFlag = false;
												$location.hash('topRight');
												$anchorScroll();
											}

											$scope.partnerSchool = $scope
													.clearData();
										});

					}

					$scope.clearData = function() {

						return {
							address : $scope.Address,
							autoGenerated : "",
							govRegisterno : "",
							instituteID : "",
							schoolName : "",
							formNumber : "",
							category : "",
						}

					}
					$scope.examlist = [];

					$scope.getExamByYear = function(year1) {
						if (year1 == undefined) {
							var date1 = new Date();
							var year1 = date1.getFullYear();
							year1 = year1.toString().substr(2, 2);
							year1 = date1.getFullYear() + "-"
									+ (Number(year1) + 1);
						}
						var k = 0;
						for (q = 0; q < $scope.examlist.length; q++) {
							if ($scope.examlist[q].yearOfExam == year1) {
								$scope.examDetail = $scope.examlist[q];
								$scope.bookSummary = $scope.examlist[q].bookSummary;
								if ($scope.examlist[q].paymentDetail != undefined) {
									$scope.PaymentDet = $scope.examlist[q].paymentDetail;
								}
								$scope.examDetail.totalStudent = parseInt($scope.examDetail.totalStudent);
								$scope.examDetail.male = parseInt($scope.examDetail.male);
								$scope.examDetail.female = parseInt($scope.examDetail.female);
								$scope.examDetail.total = parseInt($scope.examDetail.total);

								if ($scope.bookSummary != undefined) {
									k = 1;
								}
							}

						}
						if (k == 0) {
							$scope.PaymentDet = [];
							$scope.bookSummary = {
								bookDetail : [ {
									standard : "",
									bookName : "",
									bookPrise : 0,
									totalStud : 0,
									totalFees : 0
								} ],
								total : 0,
								amtForInst20per : 0,
								amtForGRF80per : 0
							}
							if (year1 == undefined) {
								$scope.examDetail = {
									totalStudent : "",
									male : "",
									female : "",
									total : "",
									/* examMedium : [], */
									yearOfExam : $scope.yearOfExam,
									bookRequired : 'OffLine',
									modeOfExam : 'OffLine',
									bookSummary : $scope.bookSummary,
									paymentDetail : $scope.PaymentDet,
								};
							} else {
								$scope.examDetail = {
									totalStudent : "",
									male : "",
									female : "",
									total : "",
									/* examMedium : [], */
									yearOfExam : year1,
									bookRequired : 'OffLine',
									modeOfExam : 'OffLine',
									bookSummary : $scope.bookSummary,
									paymentDetail : $scope.PaymentDet,
								};
							}

							$scope.examlist.push($scope.examDetail);
							$scope.examDetail = $scope.examlist[$scope.examlist.length - 1];
						}

					}

					$scope.getSchoolInstituteList = function() {
						$scope.loading = true;
						var partnerSchoolService = appEndpointSF
								.getPartnerSchoolService();
						partnerSchoolService.getPartnerSchoolInstituteList(
								$scope.commonSettingsObj.grfInstituteId).then(
								function(list) {
									$scope.tempInstituteList = list;
									$scope.loading = false; 
								});
					}

					$scope.temp = {
						tempDistricts : [],
						tempTalukas : [],
						tempVillages : []
					}

					$scope.getDistricts = function(index, state) {

						$scope.temp.tempDistricts = [];
						for (var i = 0; i < $scope.Country.states.length; i++) {

							if ($scope.Country.states[i].name == state) {
								$scope.temp.tempDistricts = $scope.Country.states[i].districts;
							}
						}
					};

					$scope.getTalukas = function(index, district) {

						$scope.temp.tempTalukas = [];
						for (var j = 0; j < $scope.temp.tempDistricts.length; j++) {
							if ($scope.temp.tempDistricts[j].name == district) {
								$scope.temp.tempTalukas = $scope.temp.tempDistricts[j].talukas;
							}
						}
					};

					$scope.getVillages = function(index, taluka) {

						$scope.temp.tempVillages = [];
						for (var k = 0; k < $scope.temp.tempTalukas.length; k++) {
							if ($scope.temp.tempTalukas[k].name == taluka) {
								$scope.temp.tempVillages = $scope.temp.tempTalukas[k].villages;
							}
						}
					};

					$scope.getInstituteId = function() {
						var proadminService = appEndpointSF
								.getProtostarAdminService();
						proadminService
								.getCommonSettingsEntity()
								.then(
										function(settingsOutput) {
											if (settingsOutput.result) {
												$scope.commonSettingsObj = settingsOutput.result;
												$scope.getSchoolInstituteList();
											}
										});
					}

					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {
							$scope.getInstituteId();
						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}

					$scope.waitForServiceLoad();
				});