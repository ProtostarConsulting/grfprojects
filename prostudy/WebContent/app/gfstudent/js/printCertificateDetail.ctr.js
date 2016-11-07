angular
		.module("prostudyApp")
		.controller(
				"printCertificateDetailCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, appEndpointSF, $state, $sce,
						$stateParams, $q, $mdDialog, $mdMedia) {

					$scope.loading = true;
					// $scope.selectedPSchoolId = $stateParams.PSchoolId;
					$scope.selectedSchoolObj = $stateParams.selectedSchoolObj;
					// $scope.bookStocks = $stateParams.bookStocks;
					// $scope.yearOfExam = $stateParams.yearOfExam;
					
					$scope.getCurYear = function() {
						var date = new Date();
						var curyear = date.getFullYear();
						curyear = curyear.toString().substr(2, 2);
						$scope.yearOfExam = date.getFullYear() + "-"
								+ (Number(curyear) + 1);
					}
					$scope.getCurYear();
					
					$scope.date = new Date();
					$scope.receiptNumber = 0;

					$log.debug("$scope.yearOfExam=" + $scope.yearOfExam);

					$scope.curUser = appEndpointSF.getLocalUserService()
							.getLoggedinUser();
					var printDivCSS = new String(
							'<link href="/lib/base/css/angular-material.min.css"" rel="stylesheet" type="text/css">'
									+ '<link href="/lib/base/css/bootstrap.min.css"" rel="stylesheet" type="text/css">')

					$scope.printBookDetailDiv = function(bookDetailDiv) {

						/*
						 * document.getElementById('hidetr').style.display =
						 * 'block';
						 */
						window.frames["print_frame"].document.body.innerHTML = printDivCSS
								+ document.getElementById(bookDetailDiv).innerHTML;
						window.frames["print_frame"].window.focus();
						/*
						 * document.getElementById('hidetr').style.display =
						 * 'none';
						 */
						window.frames["print_frame"].window.print();

					}
					
					

					function initBookDetails(pSchool) {
						$scope.examList = pSchool.examDetailList;
						$scope.add = pSchool.address;
						$scope.ContactDetail = pSchool.contactDetail;
						if ($scope.ContactDetail.coordinatorDetail != undefined
								&& $scope.ContactDetail.coordinatorDetail.length > 0) {
							$scope.coordinatorName = $scope.ContactDetail.coordinatorDetail[0].coordinatorName;
							$scope.coordinatorMobileNum = $scope.ContactDetail.coordinatorDetail[0].coordinatorMobileNum;
						} else {
							$scope.coordinatorName = '';
							$scope.coordinatorMobileNum = '';
						}
						$scope.school = pSchool;
						$scope.receiptNumber = parseInt($scope.school.autoGenerated
								.split("-")[2])
								+ ($scope.date.getFullYear() - 2000);
						$scope.getPrintDetail();
						$scope.loading = false;
					}

					$scope.examList = [];
					$scope.ContactDetail;
					$scope.add;
					$scope.school;

					$scope.getPrintDetail = function() {

						for (i = 0; i < $scope.examList.length; i++) {
							if ($scope.examList[i].yearOfExam == $scope.yearOfExam) {
								$scope.examDetail = $scope.examList[i];
								$scope.bookSummary = $scope.examList[i].bookSummary;
								$scope.BookDetail = $scope.examList[i].bookSummary.bookDetail;
								$scope.PaymentDet = $scope.examList[i].paymentDetail;
								$scope.totalStudents = 0;
								if ($scope.BookDetail != undefined) {
									for (var k = 0; k < $scope.BookDetail.length; k++) {
										$scope.totalStudents += $scope.BookDetail[k].appearedTotalStud;
									}
								}
							}
						}
					}

					$scope.bookSummary;
					$scope.BookDetail = [];
					$scope.PaymentDet = [];

					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {
							if ($scope.selectedSchoolObj != undefined
									&& $scope.selectedSchoolObj != null) {
								initBookDetails($scope.selectedSchoolObj);
							}
						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}

					$scope.waitForServiceLoad();

				});

angular.module("prostudyApp").filter('range', function() {
	return function(val, range) {
		range = parseInt(range);
		for (var i = 0; i < range; i++)
			val.push(i);
		return val;
	};
});