angular.module("prostudyApp").controller(
		"updateMyProfileCtr",
		function($scope, $window, $mdToast, $timeout, $mdSidenav, $mdUtil,
				$log, $q, tableTestDataFactory, appEndpointSF, $state,
				$mdDialog, $mdMedia, $stateParams) {

			$scope.flag = $stateParams.flag;
			$log.debug("$scope.flag :" + $scope.flag);

			$scope.showSavedToast = function() {
				$mdToast.show($mdToast.simple().content('Profile Updated!')
						.position("top").hideDelay(3000));
			};
			$scope.curUser = appEndpointSF.getLocalUserService()
					.getLoggedinUser();
			$log.debug("$scope.curUser : " + angular.toJson($scope.curUser));

			$scope.tempUser = $scope.curuser;

			$scope.getInstitutes = function() {
				var InstituteService = appEndpointSF.getInstituteService();
				InstituteService.getInstitutes().then(function(instituteList) {
					$log.debug("Inside Ctr getInstitutes");
					$scope.institutes = instituteList;
					$log.debug("$scope.institutes :" + $scope.institutes);
				});
			}
			$scope.getInstitutes();

			$scope.tempUser = {
				id : $scope.curUser.id,
				firstName : $scope.curUser.firstName,
				lastName : $scope.curUser.lastName,
				email_id : $scope.curUser.email_id,
				address : $scope.curUser.address,
				contact : $scope.curUser.contact,
				role : $scope.curUser.role,
				password : "",
				myExams : [],
				myBooks : [],

			};

			$scope.updateUser = function() {

				var UserService = appEndpointSF.getUserService();
				UserService.updateUser($scope.tempUser).then(function(msgBean) {
					$scope.showSavedToast();
					$scope.tempUser = {};
					$state.go("home");
				});

			}

			$scope.skip = function() {
				$state.go("home");
			}

			$scope.showAdvanced = function(ev) {
				var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))
						&& $scope.customFullscreen;
				$mdDialog.show({
					controller : DialogController,
					templateUrl : '/app/institute/changePwd.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : useFullScreen,
					locals : {
						curUser : $scope.curUser
					}
				}).then(
						function(answer) {
							$scope.status = 'You said the information was "'
									+ answer + '".';
						}, function() {
							$scope.status = 'You cancelled the dialog.';
						});
				$scope.$watch(function() {
					return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
					$scope.customFullscreen = (wantsFullScreen === true);
				});
			};

			function DialogController($scope, $mdDialog, curUser) {

				$scope.hide = function() {
					$mdDialog.hide();
				};
				$scope.cancel = function() {
					$mdDialog.cancel();
				};
				$scope.answer = function(answer) {
					$mdDialog.hide(answer);
				};

				$scope.inputType1 = 'password';
				$scope.inputType2 = 'password';

				$scope.showpass1 = function() {
					if ($scope.inputType1 == 'password') {
						$scope.inputType1 = 'text';
					} else {
						$scope.inputType1 = 'password';
					}

				}
				$scope.showpass2 = function() {
					if ($scope.inputType2 == 'password') {
						$scope.inputType2 = 'text';
					} else {
						$scope.inputType2 = 'password';
					}
				}
				$scope.setpassinput1 = function() {
					$scope.inputType1 = 'password';
				}
				$scope.setpassinput2 = function() {
					$scope.inputType2 = 'password';
				}
				$scope.changepass = function() {
					
					if ($scope.newPassword == $scope.cPassword) {
						$scope.savemsg = true;
						$scope.checkpass = false;
					} else {
						$scope.checkpass = true;
						$scope.savemsg = false;
					}

					if ($scope.savemsg == true) {

					}
				}

				$scope.updatePass = function() {
					alert(angular.toJson(curUser));
					$log.debug("curUser.password :"+curUser.password)
					curUser.password = $scope.cPassword;
					var UserService = appEndpointSF.getUserService();
					UserService.updateUser(curUser).then(
							function(msgBean) {
								
								$scope.newPassword = "";
								$scope.cPassword = "";
							});

				}
			}

		});
