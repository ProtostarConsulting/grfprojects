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
					$scope.geocodeurl = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCMkE8GLrbOTlfMEsxDvBSwrcSLwtgc1Yk&sensor=false&address="
					$scope.address = {
						line1 : "",
						line2 : "",
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
					$scope.searchingAddress = false;

					$scope.autoCompleteAddress = function(searchText) {
						if (!searchText || !searchText.trim())
							return;
						
						$scope.searchingAddress = true;
							$http
									.get($scope.geocodeurl + searchText)
									.then(
											function(response) {
												if (response.data.status == "OK"
													&& response.data.results[0]
													&& response.data.results[0].address_components){
													var addressParts = response.data.results[0].address_components;
													$scope.address.line1 = '';
													$scope.address.line2 = getLine2(addressParts);
													$scope.address.city = getCity(addressParts);
													$scope.address.state = getState(addressParts);
													$scope.address.country = getCountry(addressParts);
													$scope.address.pin = getPin(addressParts);
												}else{
													$scope.address.line1 = '';
													$scope.address.line2 = '';
													$scope.address.city = '';
													$scope.address.state = '';
													$scope.address.country = '';
													$scope.address.pin = '';
												}
												$scope.searchingAddress = false;
											});
					}
					
					function getLine2(addressParts) {
						var output = '';
						angular.forEach(addressParts, function(part) {
							if (part.types.indexOf('sublocality') > -1) {
								output = part.long_name;
							}
						});
						return output;
					}

					function getCity(addressParts) {
						var output = '';
						angular.forEach(addressParts, function(part) {
							if (part.types.indexOf('locality') > -1) {
								output = part.long_name;
							}
						});
						return output;
					}

					function getDistrict(addressParts) {
						var output = '';
						angular
								.forEach(
										addressParts,
										function(part) {
											if (part.types
													.indexOf('administrative_area_level_2') > -1) {
												output = part.long_name;
											}
										});
						return output;
					}

					function getState(addressParts) {
						var output = '';
						angular
								.forEach(
										addressParts,
										function(part) {
											if (part.types
													.indexOf('administrative_area_level_1') > -1) {
												output = part.long_name;
											}
										});
						return output;
					}

					function getCountry(addressParts) {
						var output = '';
						angular.forEach(addressParts, function(part) {
							if (part.types.indexOf('country') > -1) {
								output = part.long_name;
							}
						});
						return output;
					}

					function getPin(addressParts) {
						var output = '';
						angular.forEach(addressParts, function(part) {
							if (part.types.indexOf('postal_code') > -1) {
								output = part.long_name;
							}
						});
						return output;
					}
				});