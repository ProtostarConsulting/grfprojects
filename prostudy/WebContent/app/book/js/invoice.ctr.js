app = angular.module("stockApp");
app
		.controller(
				"invoiceCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $state, $http, $stateParams,
						$routeParams, objectFactory, appEndpointSF) {

					$log.debug("$stateParams:", $stateParams);
					$log.debug("$stateParams.billDetails:",
							$stateParams.billDetails);

					var InvoiceService = appEndpointSF.getInvoiceService();
					
					$scope.selectedBill = $stateParams.billDetails;
					$scope.selectedBill1 = InvoiceService
							.getAllInvoice($stateParams.billDetails)

					$log.debug("Inside Ctr $scope.selectedBill1:"
							+ angular.toJson($scope.selectedBill1));

					/*
					 * for (i = 0; i < $scope.invoiceObj.length; i++) { if
					 * ($scope.invoiceObj[i].invoiceId === selectedBill) {
					 * $log.debug("Waaaaaaaaa"+$scope.invoiceObj[i]); } }
					 */
					$("#mainForm").show();
					$("#printForm").hide();

					$scope.gotoPrint = function() {
						$("#mainForm").hide();
						$("#printForm").show();
					}

					/*
					 * $scope.viewInvoice = function(invoice) {
					 * $log.debug("inside viewInvoice :" + invoice);
					 * $scope.selectedBill = invoice; $log.debug("inside
					 * viewInvoice a :" + angular.toJson($scope.selectedBill)); //
					 * MyService.getText(); // MyService.setText(selectedBill);
					 * 
					 * $state.go("invoice.view", invoice); }
					 */
					$scope.invoiceObj = {

						invoiceId : 101,
						customerName : '',
						customerAddress : '',
						invoiceDate : '',
						invoiceLineItemList : [],
						subTotal : '',
						taxCodeName : '',
						taxPercenatge : '',
						taxTotal : 0,
						finalTotal : ''
					};
					$scope.selected = [];

					$scope.addInvoice = function() {
						$log.debug("No1");
						var InvoiceService = appEndpointSF.getInvoiceService();

						InvoiceService.addInvoice($scope.invoiceObj).then(
								function(msgBean) {
									$log.debug("No6");
									$log.debug("Inside Ctr addInvoice");
									$log.debug("msgBean.msg:" + msgBean.msg);
									$scope.showSimpleToast();

								});
						$log.debug("No4");
					}

					$scope.getAllInvoice = function() {
						$log.debug("Inside Ctr $scope.getAllInvoice");
						var invoiceService = appEndpointSF.getInvoiceService();

						invoiceService
								.getAllInvoice()
								.then(
										function(invoiceList) {
											$log
													.debug("Inside Ctr getAllInvoice");
											$scope.invoiceData = invoiceList;
											$log
													.debug("Inside Ctr $scope.invoiceData:"
															+ angular
																	.toJson($scope.invoiceData));
										});
					}

					$scope.invoiceData = [];
					$scope.getAllInvoice();

					$scope.addItem = function() {
						var item = {
							srNo : $scope.invoiceObj.invoiceLineItemList.length + 1,
							itemName : "",
							qty : 1,
							price : "",
							subTotal : ""
						};

						$scope.invoiceObj.invoiceLineItemList.push(item);
					};

					$scope.lineItemStockChange = function(index, stockItem) {
						$log.debug("##Came to lineItemStockChange...");
						var lineSelectedItem = $scope.invoiceObj.invoiceLineItemList[index];
						lineSelectedItem.price = stockItem.price;
						lineSelectedItem.itemName = stockItem.itemName;
						lineSelectedItem.subTotal = stockItem.subTotal;

						$scope.calSubTotal();
						$scope.calfinalTotal();
					};

					$scope.calSubTotal = function() {
						$log.debug("##Came to calSubTotal...");
						$scope.invoiceObj.subTotal = 0;

						for (var i = 0; i < $scope.invoiceObj.invoiceLineItemList.length; i++) {
							var line = $scope.invoiceObj.invoiceLineItemList[i];
							$scope.invoiceObj.subTotal += (line.qty * line.price);

							$log.debug("subTotal :"
									+ $scope.invoiceObj.subTotal);
						}
						$log.debug("$scope.invoiceObj 1 :"
								+ $scope.invoiceObj.subTotal);
						return $scope.invoiceObj.subTotal;
					}

					$scope.calfinalTotal = function() {
						$log.debug("##Came to calSubTotal...");

						$scope.invoiceObj.finalTotal = $scope.invoiceObj.subTotal
								+ $scope.invoiceObj.taxTotal;
					}

					$scope.lineItemTaxChange = function(index, selectedTaxItem) {
						$log.debug("##Came to lineItemTaxChange...");

						/*
						 * var lineSelectedTax =
						 * $scope.invoiceObj.invoiceLineItemList[index];
						 * lineSelectedTax.price = stockItem.price;
						 * lineSelectedTax.itemName = stockItem.item_Name;
						 */
						$scope.invoiceObj.taxTotal = ($scope.invoiceObj.selectedTaxItem.taxPercenatge / 100)
								* ($scope.invoiceObj.subTotal)

						$scope.calfinalTotal();
					};

					$scope.CustomerddlChange = function(index, customerName) {
						$log.debug("##Came to CustomerddlChange...");

						/*
						 * var SelectedCust =
						 * $scope.invoiceObj.invoiceCustomerList[index];
						 * SelectedCust.customerName =
						 * customerName.customerName;
						 * SelectedCust.customerAddress =
						 * customerName.customerAddress;
						 */};

					$scope.removeItem = function(index) {
						$scope.invoiceObj.invoiceLineItemList.splice(index, 1);
						$scope.calSubTotal();
						$scope.calfinalTotal();
					};

					/* Setup menu */
					$scope.toggleRight = buildToggler('right');
					/**
					 * Build handler to open/close a SideNav; when animation
					 * finishes report completion in console
					 */
					function buildToggler(navID) {
						var debounceFn = $mdUtil.debounce(function() {
							$mdSidenav(navID).toggle().then(function() {
								$log.debug("toggle " + navID + " is done");
							});
						}, 200);
						return debounceFn;
					}

					$scope.close = function() {
						$mdSidenav('right').close().then(function() {
							$log.debug("close RIGHT is done");
						});
					};

					$scope.getAllCustomers = function() {
						$log.debug("Inside Ctr $scope.getAllCustomers");
						var customerService = appEndpointSF
								.getCustomerService();

						customerService.getAllCustomers().then(
								function(custList) {
									$log.debug("Inside Ctr getAllCustomers");
									$scope.customersforinvoice = custList;
								});
					}

					$scope.customers = [];
					$scope.getAllCustomers();

					$scope.getAllStock = function() {
						$log.debug("Inside Ctr $scope.getAllStock");
						var stockService = appEndpointSF.getStockService();

						stockService.getAllStock().then(function(stockList) {
							$log.debug("Inside Ctr getAllStock");
							$scope.stockforinvoice = stockList;
						});
					}

					$scope.stockData = [];
					$scope.getAllStock();

					$scope.getAllTaxes = function() {
						$log.debug("Inside Ctr $scope.getAllTaxes");
						var taxService = appEndpointSF.getTaxService();

						taxService.getAllTaxes().then(function(taxList) {
							$log.debug("Inside Ctr getAllTaxes");
							$scope.taxforinvoice = taxList;
						});
					}
					$scope.taxData = [];
					$scope.getAllTaxes();

				});