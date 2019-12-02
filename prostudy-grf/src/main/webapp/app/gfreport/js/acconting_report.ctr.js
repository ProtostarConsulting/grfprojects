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
						if (fromGrfNo != undefined) {
							enteredFromGrfNo = fromGrfNo.trim();
						} else {
							$scope.isError = true;
							$scope.errorMsg = "Please Enter GRF No."
						}
						// var enteredFromGrfNo = fromGrfNo.trim();
						var enteredToGrfNo;
						if (toGrfNo != undefined) {
							enteredToGrfNo = toGrfNo.trim();
						} else {
							enteredToGrfNo = "";
						}

						$scope.examYearString = $scope.curUser.instituteObj.yearofExam
								.split("-");
						$scope.searchString = 'P-' + $scope.examYearString[0]
								+ '-';
						var fromGRfRegNo = (enteredFromGrfNo
								.startsWith($scope.searchString) && enteredFromGrfNo.length >= 12) ? enteredFromGrfNo
								: $scope.searchString + enteredFromGrfNo;

						var fromGRfRegNo = (enteredToGrfNo
								.startsWith($scope.searchString) && enteredToGrfNo.length >= 12) ? enteredToGrfNo
								: $scope.searchString + enteredToGrfNo;

						// var fromGRfRegNo = (enteredFromGrfNo
						// .startsWith('P-2018-') && enteredFromGrfNo.length >=
						// 12) ? enteredFromGrfNo
						// : 'P-2018-' + enteredFromGrfNo;
						// var toGRfRegNo =
						// (enteredToGrfNo.startsWith('P-2018-') &&
						// enteredToGrfNo.length >= 12) ? enteredToGrfNo
						// : 'P-2018-' + enteredToGrfNo;

						/*
						 * $http .get(
						 * "http://localhost:8888/PrintBookDetailPdf?yearOfExam=" +
						 * $scope.curUser.instituteObj.yearofExam +
						 * "&fromGRfRegNo=" + fromGRfRegNo + "&toGRfRegNo=" +
						 * toGRfRegNo).then( function(response) {
						 * console.log("response ------" + response); });
						 */

						window.open("PrintBookDetailPdf?yearOfExam="
								+ $scope.curUser.instituteObj.yearofExam
								+ "&fromGRfRegNo=" + fromGRfRegNo
								+ "&toGRfRegNo=" + toGRfRegNo);
						$scope.isError = false;
					}
				});