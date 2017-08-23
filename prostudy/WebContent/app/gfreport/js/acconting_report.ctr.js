angular
		.module("prostudyApp")
		.controller(
				"accountingReportCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, tableTestDataFactory, $state, $http,
						$stateParams, $location, $anchorScroll, appEndpointSF) {

					$scope.curUser = appEndpointSF.getLocalUserService()
							.getLoggedinUser();
					$scope.isError = false;
					$scope.errorMsg = "";

					$scope.printGRfAccountReport = function(fromGrfNo, toGrfNo) {
						var enteredFromGrfNo;
						if(fromGrfNo != undefined){
							enteredFromGrfNo = fromGrfNo.trim();
						}else{
							$scope.isError = true;
							$scope.errorMsg = "Please Enter GRF No."
						}
						//var enteredFromGrfNo = fromGrfNo.trim();
						var enteredToGrfNo;
						if (toGrfNo != undefined) {
							enteredToGrfNo = toGrfNo.trim();
						} else {
							enteredToGrfNo = "";
						}

						var fromGRfRegNo = (enteredFromGrfNo
								.startsWith('P-2017-') && enteredFromGrfNo.length >= 12) ? enteredFromGrfNo
								: 'P-2017-' + enteredFromGrfNo;
						var toGRfRegNo = (enteredToGrfNo.startsWith('P-2017-') && enteredToGrfNo.length >= 12) ? enteredToGrfNo
								: 'P-2017-' + enteredToGrfNo;

						/*
						 * $http .get(
						 * "http://localhost:8888/PrintBookDetailPdf?yearOfExam=" +
						 * $scope.curUser.instituteObj.yearofExam +
						 * "&fromGRfRegNo=" + fromGRfRegNo + "&toGRfRegNo=" +
						 * toGRfRegNo).then( function(response) {
						 * console.log("response ------" + response); });
						 */

						var response = window
								.open("PrintBookDetailPdf?yearOfExam="
										+ $scope.curUser.instituteObj.yearofExam
										+ "&fromGRfRegNo=" + fromGRfRegNo
										+ "&toGRfRegNo=" + toGRfRegNo);
						$scope.isError = false;
					}
				});