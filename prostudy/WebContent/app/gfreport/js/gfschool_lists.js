angular.module("prostudyApp").controller(
		"schoollistsCtr",
		function($scope, $window, $mdToast, $timeout, $mdSidenav, $mdUtil,
				$log, $q, tableTestDataFactory, $state, appEndpointSF, $sce,partnerSchoolLevels,
				boardList) {
			
			
			$scope.gfSchoolLists={
					category:"",
					address:$scope.Address
			}
			$scope.Address={
					dist : "",	
					state : "",
					otherTal : "",
					tal : "",
					otherState : "",
					otherDist : "",
					
			}
			
			$scope.partnerSchoolLevels=partnerSchoolLevels;
			
			
			
			$scope.getaddress = function(postcode) {

				$
						.getJSON(
								'https://maps.googleapis.com/maps/api/geocode/json?address='
										+ postcode + '&sensor=false',
								function(data) {

									$scope.data = data.results[0].address_components;
									//var city = $scope.data[1].long_name;
									var tal = $scope.data[1].long_name;
									var dist = $scope.data[2].long_name;
									var state = $scope.data[3].long_name;
									var country = $scope.data[4].long_name;

									$scope.partnerSchool.address.city = city;
									$scope.partnerSchool.address.tal = tal;
									$scope.partnerSchool.address.dist = dist;
									$scope.partnerSchool.address.state = state;
									$scope.partnerSchool.address.country = country;
									$scope.partnerSchool.address.pin = postcode;

									$scope.getTalukas(0, dist);
									/*
									 * var lat =
									 * data.results[0].geometry.location.lat;
									 * var lng =
									 * data.results[0].geometry.location.lng;
									 */});
			}
			
			$scope.stateQuerySearch = function(query) {
				var results = query ? $scope.Country.states
						.filter(createFilterFor(query))
						: $scope.Country.states;
				$scope.gfSchoolLists.address.dist = results[0].districts;
				var deferred = $q.defer();
				$timeout(function() {
					deferred.resolve(results);

				}, Math.random() * 1000, false);

				return deferred.promise;
			}
			
						
		});