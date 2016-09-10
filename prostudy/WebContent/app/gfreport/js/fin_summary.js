angular
		.module("prostudyApp")
		.controller(
				"finSummaryCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, tableTestDataFactory, $state,
						appEndpointSF, $sce, partnerSchoolLevels,
						indiaAddressLookupData, boardList) {

					$scope.paymentModes = [ {
						mode : 'Cash',
						noOfPayments : 0,
						amount : 0
					}, {
						mode : 'D.D',
						noOfPayments : 0,
						amount : 0
					}, {
						mode : 'NEFT/RTGS',
						noOfPayments : 0,
						amount : 0
					}, {
						mode : 'Other',
						noOfPayments : 0,
						amount : 0
					} ];

					function getPaymentDetailListByCurrentYear(school) {
						var date1 = new Date();
						var year1 = date1.getFullYear();
						year1 = year1.toString().substr(2, 2);
						year1 = date1.getFullYear() + "-" + (Number(year1) + 1);

						var paymentDetailList = [];
						for (q = 0; q < school.examDetailList.length; q++) {
							if (school.examDetailList[q].yearOfExam == year1) {
								if (school.examDetailList[q].paymentDetail != undefined) {
									paymentDetailList = school.examDetailList[q].paymentDetail;
									break;
								}
							}
						}
						return paymentDetailList;
					}

					function updatePaymentModeObj(school, modesArray) {
						var paymentDetailList = getPaymentDetailListByCurrentYear(school);
						if (paymentDetailList.length > 0) {
							var paymentModeIndex = modesArray
									.indexOf(paymentDetailList[0].payReceivedBy)
							if (paymentModeIndex >= 0) {
								paymentModeObj = $scope.paymentModes[paymentModeIndex];
								paymentModeObj.noOfPayments += 1;
								paymentModeObj.amount += paymentDetailList[0].payAmount;
							}
						}
					}

					$scope.calculateBySchoolList = function() {
						var modesArray = [];
						angular.forEach($scope.paymentModes, function(o) {
							modesArray.push(o.mode);
						});
						angular.forEach($scope.pSchoolList, function(school) {
							updatePaymentModeObj(school, modesArray);
						});
					}

					$scope.getPartnerSchoolByInstitute = function() {
						var PartnerService = appEndpointSF
								.getPartnerSchoolService();

						PartnerService.getPartnerByInstitute(
								$scope.curUser.instituteID).then(
								function(pSchoolList) {
									$scope.pSchoolList = pSchoolList;
									$scope.calculateBySchoolList();
								});
					}

					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {
							$scope.getPartnerSchoolByInstitute();

						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}

					$scope.waitForServiceLoad();

				});