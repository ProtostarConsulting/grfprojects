angular
		.module("prostudyApp")
		.controller(
				"attendanceAddCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, objectFactory, appEndpointSF, $filter,
						$state) {

					$log.debug("Inside attendanceAddCtr");
					$scope.showSavedToast = function() {
						$mdToast.show($mdToast.simple().content(
								'attendance Saved!').position("top").hideDelay(
								3000));
					};

					$scope.curUser = appEndpointSF.getLocalUserService()
							.getLoggedinUser();

					$scope.standards = [];
					$scope.divisions = [];
					$scope.subjects = [];
					$scope.studArray = [];
					
					$scope.selectedStud = null;

					$scope.selectedStdID;
					$scope.stdList;
					$scope.divList;
					$scope.subList;
					
					$scope.subID;
					$scope.newSubList;

					$scope.students = [];
					$scope.attendanceRecordList = [];
					$scope.isActive = false;
					$scope.selectedSubject;
					$scope.selectedStandard;
					$scope.selectedDivision;
					$scope.firstName;
					$scope.lastName;

					$scope.getStandardByInstitute = function() {

						var StandardService = appEndpointSF
								.getStandardService();
						StandardService
								.getStandardByInstitute(
										$scope.curUser.instituteID)
								.then(
										function(standardList) {
											for (var i = 0; i < standardList.length; i++) {
												$scope.standards
														.push(standardList[i].name);

											}
											$scope.stdList = standardList;

										});
					}

					$scope.getStandardByInstitute();

					$scope.getDivisionByStandard = function() {

						for (var i = 0; i < $scope.stdList.length; i++) {
							if ($scope.selectedStandard == $scope.stdList[i].name) {
								$scope.selectedStdID = $scope.stdList[i].id;
							}
						}
						var DivisionService = appEndpointSF
								.getDivisionService();
						DivisionService
								.getDivisionByStandard($scope.selectedStdID)
								.then(
										function(divisionList) {
											for (var i = 0; i < divisionList.length; i++) {
												$scope.divisions
														.push(divisionList[i].name);
											}
											$scope.divList = divisionList;
										});
					}

					$scope.getSubjectByDivision = function() {

						for (var i = 0; i < $scope.divList.length; i++) {
							if ($scope.selectedDivision == $scope.divList[i].name) {
								$scope.selectedDivID = $scope.divList[i].id;
							}
						}
						var SubjectService = appEndpointSF.getSubjectService();
						SubjectService
								.getSubjectByDivision($scope.selectedDivID)
								.then(
										function(subjectList) {

											$scope.newSubList = subjectList;
											for (var i = 0; i < subjectList.length; i++) {
												$scope.subjects.push(subjectList[i].name);
											}

										});
						$scope.subjects.splice(0, $scope.subjects.length);
					}
					
					
					$scope.getStudentBySubject = function() {
						$log.debug("$scope.newSubList :"+angular.toJson($scope.newSubList));

						for (i = 0; i < $scope.newSubList.length; i++) {
							if ($scope.selectedSubject == $scope.newSubList[i].name) {
								$scope.subID = $scope.newSubList[i].id;
							}
						}

						var StudSubService = appEndpointSF.getStudSubService();
						StudSubService.getStudentBySubject($scope.subID).then(
								function(studentList) {
									$scope.newStudents = studentList;
									for(i=0;i<$scope.newStudents.length;i++)
										{
											$scope.studArray.push($scope.newStudents[i].studID);
										}
									
									for (var i = 0; i < $scope.studArray.length; i++) 
									 {
										 $scope.attendanceRecordList.push($scope.getAttendanceRecord($scope.studArray[i].id));
										 $scope.firstName = $scope.studArray[i].firstName;
										 $scope.lastName = $scope.studArray[i].lastName;
									   }
								
								});
					}

				
				
					$scope.getAttendanceRecord = function(studID) {

						return {
							studID : studID,
							instituteID : $scope.curUser.instituteID,
							firstName : $scope.firstName,
							lastName : $scope.lastName,
							standard : $scope.selectedStandard,
							division : $scope.selectedDivision,
							subject : $scope.selectedSubject,
							date : new Date(),
							attendance : true,

						};
					}
					
					$scope.getButtonClass = function(studID) {
						return $scope.selectedStudID == studID? "md-raised md-warn": "md-raised md-primary";

					}

					$scope.toggleAttendance = function(index) {
						$scope.selectedStudID = $scope.attendanceRecordList[index].studID;
						$scope.attendanceRecordList[index].attendance = !$scope.attendanceRecordList[index].attendance;
						
					}

					$scope.submitAttendance = function() {

						var AttendanceService = appEndpointSF
								.getAttendanceService();
						for (i = 0; i < $scope.attendanceRecordList.length; i++) {
							AttendanceService.addAttendance(
									$scope.attendanceRecordList[i]).then(
									function(msgBean) {

									});
						}
						$scope.showSavedToast();
						$state.go('attendance');

					}

					$scope.isActive = false;

					$scope.toggleActive = function() {
						$scope.isActive = !$scope.isActive;
					};

					$scope.cancel = function() {
						$state.go('attendance');
					}

				});