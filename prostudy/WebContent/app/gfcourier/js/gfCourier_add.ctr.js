angular
		.module("prostudyApp")
		.controller(
				"gfCourierAddCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, appEndpointSF, $state, $stateParams,
						$mdDialog, objectFactory, logisticsList,
						courierTypelist) {

					$scope.courierTypelist = courierTypelist;
					$scope.logisticsList = logisticsList;

					$scope.tempCourierObj = {
						courierType : '',
						logistics : '',
						registrationID : '',
						weight : '',
						courierFrom : '',
						courierTo : '',
						schoolName : '',
						courierDispatchDate : new Date(),
						bookQty : 0,
						bookLineItemList : [],
						note : ''
					}

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
					}

					$scope.selectedGFCourierID = $stateParams.selectedGFCourierID;
					$scope.partnerSchool = $stateParams.partnerSchool;
					$log.debug("$scope.partnerSchool=="
							+ angular.toJson($scope.partnerSchool));

					$scope.registrationID1;
					$scope.addGFCourier = function() {
						$scope.loading = true;
						if ($scope.selectedGFStudID == "") {
							$scope.tempCourierObj.instituteID = $scope.curUser.instituteID;
							$scope.tempCourierObj.schoolName = $scope.institute;
						}
						var gfCourierService = appEndpointSF
								.getGFCourierService();

						gfCourierService.addGFCourier($scope.tempCourierObj)
								.then(function() {
									/*$scope.gfCourierForm.$setPristine();
									$scope.gfCourierForm.$setValidity();
									$scope.gfCourierForm.$setUntouched();*/
									if ($scope.selectedGFStudID == "") {
										$scope.showAddToast();
									} else {
										$scope.showUpdateToast();
									}
									$state.reload();
									$scope.loading = false;

								});
						
					}

					$scope.getGFCourierById = function() {
						$scope.loading = true;
						var gfCourierService = appEndpointSF
								.getGFCourierService();
						gfCourierService
								.getGFCourierById($scope.selectedGFCourierID)
								.then(
										function(tempCourier) {
											$scope.loading = false;
											$scope.tempCourierObj = tempCourier;
											$scope.tempCourierObj.courierDispatchDate = new Date(
													$scope.tempCourierObj.courierDispatchDate);
										});
					}

					$scope.getPartnerByInstitute = function() {

						var PartnerSchoolService = appEndpointSF
								.getPartnerSchoolService();
						PartnerSchoolService.getPartnerByInstitute(
								$scope.curUser.instituteID).then(
								function(pSchoolList) {
									$scope.pSchoolList = pSchoolList;

								});
					}

					$scope.getGFBookByInstituteId = function() {

						var gfBookStockService = appEndpointSF
								.getGFBookStockService();
						gfBookStockService.getGFBookByInstituteId(
								$scope.curUser.instituteID).then(
								function(bookList) {
									$scope.bookList = bookList;

								});
					}

					$scope.addBook = function() {
						var item = {
							srNo : $scope.tempCourierObj.bookLineItemList.length + 1,
							bookName : "",
							bookAuther : "",
							weight : "",
							bookPrice : "",
							bookQty : 1
						};

						$scope.tempCourierObj.bookLineItemList.push(item);
					};

					$scope.lineItemStockChange = function(index, stockItem) {

						var lineSelectedItem = $scope.tempCourierObj.bookLineItemList[index];
						lineSelectedItem.id = stockItem.id;
						lineSelectedItem.bookName = stockItem.bookName;
						// lineSelectedItem.bookQty = stockItem.bookQty;
						lineSelectedItem.bookPrice = stockItem.bookPrice;
						lineSelectedItem.bookAuther = stockItem.bookAuther;
						lineSelectedItem.weight = stockItem.weight;

						$scope.calBookWeight();
					};

					$scope.removeItem = function(index) {
						$scope.tempCourierObj.bookLineItemList.splice(index, 1);
						$scope.calBookWeight();
					};

					$scope.cancel = function() {
						$state.go('gandhifoundation');
					}

					$scope.waitForServiceLoad = function() {
						if (appEndpointSF.is_service_ready) {

							if ($scope.selectedGFCourierID != "") {
								$scope.getGFCourierById();
							} else {
								$scope.getPartnerByInstitute();
								$scope.getGFBookByInstituteId();
							}

						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad, 1000);
						}
					}

					$scope.waitForServiceLoad();

					$scope.query = {
						order : 'description',
						limit : 5,
						page : 1
					};
					$scope.cancelButton = function() {
						$state.go("courierModule", {});
					}

					$scope.getGFBookStockByInstituteId = function() {
						var gfBookStockService = appEndpointSF
								.getGFBookStockService();
						gfBookStockService.getGFBookByInstituteId(
								$scope.curUser.instituteID).then(
								function(tempBooks) {
									$scope.bookStocks = tempBooks;
								});
					}
					$scope.bookStocks = [];

					$scope.waitForServiceLoad1 = function() {
						if (appEndpointSF.is_service_ready
								&& $scope.selectedGFCourierID == "") {

							$scope.getGFBookStockByInstituteId();

						} else {
							$log.debug("Services Not Loaded, watiting...");
							$timeout($scope.waitForServiceLoad1, 1000);
						}
					}

					$scope.waitForServiceLoad1();

					$scope.getInstituteByGRFNo = function(autoGenerated) {
						$scope.tempCourierObj.schoolName = "";
						$scope.tempCourierObj.courierFrom = "";
						$scope.tempCourierObj.courierTo = "";
						var InstituteService = appEndpointSF
								.getInstituteService();
						InstituteService
								.getInstituteByGRFNo(autoGenerated)
								.then(
										function(institute) {
											$scope.institute = institute;

											$scope.tempCourierObj.courierTo = $scope.institute.schoolName
													+ ","
													+ $scope.institute.address.line1
													+ ","
													+ $scope.institute.address.city
													+ ","
													+ $scope.institute.address.pin;
											$scope.tempCourierObj.schoolName = $scope.institute.schoolName;
											if (!$scope.curUser.instituteObj.address) {
												$scope.tempCourierObj.courierFrom = $scope.curUser.instituteObj.name;
											} else {
												$scope.tempCourierObj.courierFrom = $scope.curUser.instituteObj.name
														+ ","
														+ $scope.curUser.instituteObj.address;
											}

										});
					};
					$scope.institute;

					$scope.checkBookStock = function(item, $event) {

						$scope.hit = "";
						for (var i = 0; i <= $scope.bookStocks.length; i++) {

							if ($scope.bookStocks[i].id == item.id) {
								$scope.qtyErrorMsg = "";
								if ($scope.bookStocks[i].bookQty < item.bookQty) {
									$scope.qtyErrorMsg = "Quantity entered is not available in stock";
									item.bookQty = 1;
									item.bkQty = $scope.bookStocks[i].bookQty
									$scope.showAlert(item, $event);
								}
								$scope.tempQty = $scope.bookStocks[i].bookQty
										- item.bookQty;
								if ($scope.tempQty <= $scope.bookStocks[i].bookThreshold) {
									// $scope.showAlert1(item, $event);
									$scope.hit = "yes";
								}

							}
						}
					}

					$scope.calBookWeight = function() {

						$scope.tempCourierObj.totalWeight = 0;
						$scope.tempCourierObj.totalFees = 0;

						for (var i = 0; i < $scope.tempCourierObj.bookLineItemList.length; i++) {
							var line = $scope.tempCourierObj.bookLineItemList[i];
							$scope.tempCourierObj.totalWeight += (line.bookQty * line.weight);

							$scope.tempCourierObj.totalFees += (line.bookQty * line.bookPrice);
						}

						return $scope.tempCourierObj.totalWeight;
					}
					$scope.showAlert = function(item, ev) {
						$mdDialog
								.show($mdDialog
										.alert()
										.parent(
												angular
														.element(document
																.querySelector('#popupContainer')))
										.clickOutsideToClose(true)
										.title('Alert')
										.textContent(
												'The book quantity entered is not available in stock. The available quantity is'
														+ ":" + item.bkQty)
										.ariaLabel('Alert Dialog Demo').ok(
												'close!').targetEvent(ev));
					};
				});
