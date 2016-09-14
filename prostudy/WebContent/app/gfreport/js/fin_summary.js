angular
		.module("prostudyApp")
		.controller(
				"finSummaryCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, tableTestDataFactory, $state,
						appEndpointSF, $sce, $location, $anchorScroll,
						partnerSchoolLevels, indiaAddressLookupData, boardList,
						logisticsList) {

					$scope.loading = true;
					$scope.filterType = '';

					$scope.pSchoolList = [];
					$scope.gfCouriertList = [];

					$scope.noOfPaymentsTotal = 0;
					$scope.amountPaymentsTotal = 0;
					$scope.noOfCourierParcelsTotal = 0;
					$scope.chargesCourierTotal = 0;

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

					$scope.logisticsListData = [];
					angular.forEach(logisticsList, function(o) {
						$scope.logisticsListData.push({
							logistic : o,
							noOfParcels : 0,
							charges : 0
						});
					});

					$scope.getPaymentDetailListByCurrentYear = function(school) {
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
						var paymentDetailList = $scope
								.getPaymentDetailListByCurrentYear(school);
						if (paymentDetailList.length > 0) {
							var paymentModeIndex = modesArray
									.indexOf(paymentDetailList[0].payReceivedBy
											.trim())
							if (paymentModeIndex >= 0) {
								paymentModeObj = $scope.paymentModes[paymentModeIndex];
								paymentModeObj.noOfPayments += 1;
								paymentModeObj.amount += paymentDetailList[0].payAmount;
								$scope.noOfPaymentsTotal++;
								$scope.amountPaymentsTotal += paymentDetailList[0].payAmount;

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
									$scope.loading = false;
								});
					}

					function updateLogisticListObj(courierObj) {
						var logisticsIndex = logisticsList
								.indexOf(courierObj.logistics.trim())
						if (logisticsIndex >= 0) {
							logisticsObj = $scope.logisticsListData[logisticsIndex];
							logisticsObj.noOfParcels += 1;
							logisticsObj.charges += courierObj.courierCost;
							$scope.noOfCourierParcelsTotal++;
							$scope.chargesCourierTotal += courierObj.courierCost;

						}
					}

					$scope.calculateByCourierList = function() {
						angular.forEach($scope.gfCouriertList, function(
								courierObj) {
							updateLogisticListObj(courierObj);
						});
					}
					$scope.getGFCourierByInstitute = function(refresh) {
						var gfCourierService = appEndpointSF
								.getGFCourierService();
						gfCourierService.getGFCourierByInstitute(
								$scope.curUser.instituteID).then(
								function(gfCouriertList) {
									$scope.gfCouriertList = gfCouriertList;
									$scope.calculateByCourierList();
								});
					}

					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {
							$scope.getPartnerSchoolByInstitute();
							$scope.getGFCourierByInstitute();

						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}

					$scope.waitForServiceLoad();

					$scope.t_addTotalAmountByPaymentType = function(amt) {
						return $scope.t_totalAmountByPaymentType;
					}
					$scope.t_addTotalCostByLogisticType = function(cost) {
						return $scope.t_totalCostByLogisticType
					}
					$scope.clearfilterValues = function(courierType) {
						$scope.filterType = '';
						$scope.filterPaymentType = '';
						$scope.filterLogisticsType = '';
						$scope.t_totalAmountByPaymentType = 0;
						$scope.t_totalCostByLogisticType = 0;
					}

					$scope.filterSchoolListBy = function(paymentType) {
						$scope.fitlteredSchoolList = [];
						$scope.t_totalAmountByPaymentType = 0;
						
						angular.forEach($scope.pSchoolList, function(school) {
							var paymentDetailList = $scope
									.getPaymentDetailListByCurrentYear(school);
							if (paymentDetailList.length > 0
									&& paymentDetailList[0].payReceivedBy
											.trim() == paymentType) {
								$scope.fitlteredSchoolList.push(school);
								$scope.t_totalAmountByPaymentType += paymentDetailList[0].payAmount;
							}
						});
					}

					$scope.filterCourierListBy = function(courierType) {
						$scope.fitlteredCourierList = [];
						$scope.t_totalCostByLogisticType = 0;
						
						angular
								.forEach(
										$scope.gfCouriertList,
										function(courier) {
											if (courier.logistics.trim() == courierType) {
												$scope.fitlteredCourierList
														.push(courier);
												$scope.t_totalCostByLogisticType += courier.courierCost;
											}
										});
					}

					$scope.filterBy = function(fType, fSubType) {
						$location.hash('topRight');
						$anchorScroll();

						$scope.filterType = fType;
						if ($scope.filterType == 'school') {
							$scope.filterPaymentType = fSubType;
							$scope.filterSchoolListBy(fSubType);
						} else if ($scope.filterType == 'courier') {
							$scope.filterLogisticsType = fSubType;
							$scope.filterCourierListBy(fSubType);
						}

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