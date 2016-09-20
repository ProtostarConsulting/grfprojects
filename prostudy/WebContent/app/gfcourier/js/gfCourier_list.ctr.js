angular.module("prostudyApp").controller(
		"gfCourierListCtr",
		function($scope, $window, $mdToast, $timeout, $mdSidenav, $mdUtil,
				$log, $q, $mdDialog, $mdMedia, $state, tableTestDataFactory,
				appEndpointSF, ajsCache) {
			console.log("Inside studentListPageCtr");

			$scope.showSavedToast = function() {
				$mdToast.show($mdToast.simple().content(
						'Scheduled Exam Assigned to Student!').position("top")
						.hideDelay(3000));
			};
			$scope.selected = [];
			$scope.query = {
				order : '-schoolName.autoGenerated',
				limit : 60,
				limitOptions : [ 1000, 2000, 3000, 4000, 5000 ],
				page : 1
			};
			
			$scope.logisticsList = [ "By Post", "By Hand", "ST Postal",
					"Tej Courier" ];
			$scope.courierTypelist = [ "Book", "Certificate",
					"Error Certificate", "Error books", "Prize Certificate" ];

			$scope.getGFCourierByInstitute = function(refresh) {
				$scope.loading = true;
				var courierListCacheKey = "gf-courierListCache";
				// Note this key has to be unique across application
				// else it will return unexpected result.
				if (!angular.isUndefined(ajsCache.get(courierListCacheKey))
						&& !refresh) {
					$log.debug("Found List in Cache, return it.")
					$scope.gfCouriertList = ajsCache.get(courierListCacheKey);
					$scope.loading = false;
					return;
				}

				var gfCourierService = appEndpointSF.getGFCourierService();
				gfCourierService.getGFCourierByInstitute(
						$scope.curUser.instituteID).then(
						function(gfCouriertList) {
							$scope.gfCouriertList = gfCouriertList;
							ajsCache.put(courierListCacheKey,
									gfCouriertList);
							$scope.loading = false;
						});
			}

			$scope.getPartnerByInstitute = function() {
				var schoolListCacheKey = "getPartnerByInstitute";
				// Note this key has to be unique across application
				// else it will return unexpected result.
				if (!angular.isUndefined(ajsCache.get(schoolListCacheKey))) {
					$log.debug("Found List in Cache, return it.")
					$scope.pSchoolList = ajsCache.get(schoolListCacheKey);
					return;
				}
				var PartnerSchoolService = appEndpointSF
						.getPartnerSchoolService();
				$scope.loading = true;
				PartnerSchoolService.getPartnerByInstitute(
						$scope.curUser.instituteID).then(function(pSchoolList) {
					$scope.pSchoolList = pSchoolList;
					ajsCache.put(schoolListCacheKey,
							pSchoolList);
					$scope.loading = false;
				});
			}

			$scope.waitForServiceLoad = function() {
				if (appEndpointSF.is_service_ready) {
					$scope.getGFCourierByInstitute();
					$scope.getPartnerByInstitute();
				} else {
					$log.debug("Services Not Loaded, watiting...");
					$timeout($scope.waitForServiceLoad, 1000);
				}
			}
			$scope.downloadData = function() {
				document.location.href = "DownloadGfCourierList?InstituteId="
						+ $scope.curUser.instituteID;
			}

			$scope.waitForServiceLoad();

			$scope.refresh = function() {
				$state.reload();
			}

		});