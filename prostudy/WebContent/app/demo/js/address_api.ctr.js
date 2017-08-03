angular
		.module("prostudyApp")
		.controller(
				"addressApiCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$state, $sce, $stateParams, $q, $mdDialog, $mdMedia,
						$location, $anchorScroll, Upload, ajsCache, $mdUtil,
						$log, $http, appEndpointSF, indiaAddressLookupData) {
					console.log("Inside demoCtr");

					$scope.Country = indiaAddressLookupData;
					$scope.appkey = "nf9sio8nh2jayar3gqknr41g";

					$scope.address = {
						line1 : "",
						dist : "",
						city : "",
						state : "",
						country : "",
						pin : "",
						tal : "",
						otherState : "",
						otherDist : "",
						otherTal : "",
						otherAddressFlag : false
					}

					$scope.searchAddressByPin = function(pin) {
						$http
								.get(
										"https://www.whizapi.com/api/v2/util/ui/in/indian-city-by-postal-code?",
										{
											params : {
												'project-app-key' : $scope.appkey,
												'pin' : pin
											}
										}).then(function(response) {
									$scope.address.city = response.data.Data[0].City;
									$scope.address.state = response.data.Data[0].State;
									$scope.address.pin = response.data.Data[0].Pincode;
									$scope.address.country = response.data.Data[0].Country;
									$scope.address.line1 = response.data.Data[0].Address;
								});
					}

					$scope.bindSelectedAddress = function(address) {
						$scope.address.city = address.City;
						$scope.address.state = address.State;
						$scope.address.pin = address.Pincode;
						$scope.address.country = address.Country;
						$scope.address.line1 = address.Address;
					}

					$scope.searchDialog = function(ev) {
						var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))
								&& $scope.customFullscreen;
						$mdDialog
								.show(
										{
											controller : DialogController,
											templateUrl : '/app/demo/search_addressby_pin.html',
											parent : angular
													.element(document.body),
											targetEvent : ev,
											clickOutsideToClose : true,
											fullscreen : useFullScreen,
											locals : {
												curUser : $scope.curUser,
												appkey : $scope.appkey,
												bindSelectedAddress : $scope.bindSelectedAddress
											}
										})
								.then(
										function(answer) {
											$scope.status = 'You said the information was "'
													+ answer + '".';
										},
										function() {
											$scope.status = 'You cancelled the dialog.';
										});
					}

					function DialogController($scope, $mdDialog, curUser,
							appkey, bindSelectedAddress) {
						$scope.csvFile;
						$scope.uploadProgressMsg = null;

						$scope.searchByAddress = function(address) {
							if(address.length <=4){
								return;
							}
							$scope.loading = true;
							$http
									.get(
											"https://www.whizapi.com/api/v2/util/ui/in/indian-postal-codes?",
											{
												params : {
													'project-app-key' : appkey,
													'search' : address
												}
											}).then(function(response) {
										$scope.Address = response.data.Data;
										$scope.loading = false;
									});
						}

						$scope.selectAddress = function(address) {
							bindSelectedAddress(address);
							$scope.cancel();
						}

						$scope.cancel = function() {
							$mdDialog.cancel();
						};

					}
				});