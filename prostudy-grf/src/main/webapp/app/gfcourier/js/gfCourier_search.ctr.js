angular.module("prostudyApp").controller(
		"gfCourierSearchCtr",
		function($scope, $window, $mdToast, $timeout, $mdSidenav, $mdUtil,
				$log, $q, appEndpointSF, $state, $stateParams, $mdDialog,
				objectFactory, logisticsList, courierTypelist, $state) {

			$scope.courierTypelist = courierTypelist;
			$scope.logisticsList = logisticsList;

			$scope.getNextYears = function() {
				var date = new Date();
				for (var i = 0; i < 4; i++) {
					var year = date.getFullYear();
					year = year.toString().substr(2, 2);

					$scope.Years.push(date.getFullYear() + "-"
							+ (Number(year) + 1));
					date.setYear(date.getFullYear() + 1);
				}
			}

			$scope.Years = [];
			$scope.yearOfExam;
			$scope.getNextYears();

			$scope.getCourierByGRFNo = function(autoGenerated) {
				$scope.tempCourierObj.schoolName = "";
				$scope.tempCourierObj.courierFrom = "";
				$scope.tempCourierObj.courierTo = "";

				var gfCourierService = appEndpointSF.getGFCourierService();
				gfCourierService.getCourierByGRFNo(autoGenerated).then(
						function(courier) {
							if(!courier.id){
								
								$scope.errorMsg = "No Record Found";
								$scope.gfCourierForm.$setPristine();
								$scope.gfCourierForm.$setValidity();
								$scope.gfCourierForm.$setUntouched();
								$scope.tempCourier = courier;
								$timeout(function() {
									$state.reload();
									},3000);

					//			$scope.yearOfExam ="";
					//		$scope.tempCourierObj.autoGenerated = "";
								
							}else{
								$scope.tempCourier = courier;
								$scope.errorMsg = "";
								$scope.yearOfExam ="";
								$scope.tempCourierObj.autoGenerated = "";
								$scope.gfCourierForm.$setPristine();
								$scope.gfCourierForm.$setValidity();
								$scope.gfCourierForm.$setUntouched();
							}

						});
			};
			$scope.institute;

			$scope.getGFBookStockByInstituteId = function() {
				var gfBookStockService = appEndpointSF.getGFBookStockService();
				gfBookStockService.getGFBookByInstituteId(
						$scope.curUser.instituteID).then(function(tempBooks) {
					$scope.bookStocks = tempBooks;

				});
			}
			$scope.bookStocks = [];

			$scope.waitForServiceLoad1 = function() {
				if (appEndpointSF.is_service_ready) {
					$scope.getGFBookStockByInstituteId();
				} else {
					$log.debug("Services Not Loaded, watiting...");
					$timeout($scope.waitForServiceLoad1, 1000);
				}
			}

			$scope.waitForServiceLoad1();
			
			
			$scope.getCurYear = function() {
				var date = new Date();
				var curyear = date.getFullYear();
				curyear = curyear.toString().substr(2, 2);
				$scope.yearOfExam = date.getFullYear() + "-"
						+ (Number(curyear) + 1);
			}
			$scope.getCurYear();
			
			var printDivCSS = new String(
					'<link href="/lib/base/css/angular-material.min.css"" rel="stylesheet" type="text/css">'
							+ '<link href="/lib/base/css/bootstrap.min.css"" rel="stylesheet" type="text/css">')
			$scope.printDiv = function(divId) {
				// window.frames["print_frame"].document.body.innerHTML
				// = printDivCSS
				// + document.getElementById(divId).innerHTML;
				window.frames["print_frame"].document.body.innerHTML = document
						.getElementById(divId).innerHTML;
				window.frames["print_frame"].window.focus();
				window.frames["print_frame"].window.print();
			}
		});
