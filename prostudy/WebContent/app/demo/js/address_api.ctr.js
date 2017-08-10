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
					$scope.tempAddress = [];
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
					
					var placeSearch, autocomplete;
				      var componentForm = {
				        street_number: 'short_name',
				        route: 'long_name',
				        locality: 'long_name',
				        administrative_area_level_1: 'short_name',
				        country: 'long_name',
				        postal_code: 'short_name'
				      };
				      
				      function initAutocomplete() {
				          // Create the autocomplete object, restricting the search to geographical
				          // location types.
				          autocomplete = new google.maps.places.Autocomplete(
				              /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
				              {types: ['geocode']});

				          // When the user selects an address from the dropdown, populate the address
				          // fields in the form.
				          autocomplete.addListener('place_changed', fillInAddress);
				        }

				        function fillInAddress() {
				          // Get the place details from the autocomplete object.
				          var place = autocomplete.getPlace();

				          for (var component in componentForm) {
				            document.getElementById(component).value = '';
				            document.getElementById(component).disabled = false;
				          }

				          // Get each component of the address from the place details
				          // and fill the corresponding field on the form.
				          for (var i = 0; i < place.address_components.length; i++) {
				            var addressType = place.address_components[i].types[0];
				            if (componentForm[addressType]) {
				              var val = place.address_components[i][componentForm[addressType]];
				              document.getElementById(addressType).value = val;
				            }
				          }
				        }

				        // Bias the autocomplete object to the user's geographical location,
				        // as supplied by the browser's 'navigator.geolocation' object.
				        function geolocate() {
				          if (navigator.geolocation) {
				            navigator.geolocation.getCurrentPosition(function(position) {
				              var geolocation = {
				                lat: position.coords.latitude,
				                lng: position.coords.longitude
				              };
				              var circle = new google.maps.Circle({
				                center: geolocation,
				                radius: position.coords.accuracy
				              });
				              autocomplete.setBounds(circle.getBounds());
				            });
				          }
				        }  

					$scope.searchAddressByPin = function(address) {
						if (address != undefined && address != "") {
							$http
									.get(
											"http://maps.googleapis.com/maps/api/geocode/json?",
											{
												params : {
													'address' : address,
													'sensor' : false
												}
											})
									.then(
											function(response) {
												console
														.log("address ******"
																+ response.data.results);
												$scope.tempAddress = response.data.results[0].address_components;
												for (var i = 0; i < $scope.tempAddress.length; i++) {
													if ($scope.tempAddress[i].types[0] == "locality") {
														$scope.address.city = $scope.tempAddress[i].long_name;
													}
													if ($scope.tempAddress[i].types[0] == "administrative_area_level_1") {
														$scope.address.state = $scope.tempAddress[i].long_name;
													}
													if ($scope.tempAddress[i].types[0] == "postal_code") {
														$scope.address.pin = $scope.tempAddress[i].long_name;
													}
													if ($scope.tempAddress[i].types[0] == "country") {
														$scope.address.country = $scope.tempAddress[i].long_name;
													}
												}
											});
						}
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
							if (address.length <= 4) {
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