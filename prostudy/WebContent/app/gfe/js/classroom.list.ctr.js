angular
		.module("prostudyApp")
		.controller(
				"classroomCourseListCtr",
				function($scope, $window, $mdToast, $timeout, $mdSidenav,
						$mdUtil, $log, $q, tableTestDataFactory, appEndpointSF) {
					console.log("Inside classroomtListCtr");

					$scope.authorized = false;
					$scope.loading = false;
					$scope.currentClassroomUser = null;
					$scope.curUser = appEndpointSF.getLocalUserService()
							.getLoggedinUser();
					$scope.classroomCourses = [];

					var CLIENT_ID = '759880535753-3h86dfhcao97655vcnooobn17l4flp8q.apps.googleusercontent.com';

					var SCOPES = [
							"https://www.googleapis.com/auth/classroom.courses.readonly",
							"https://www.googleapis.com/auth/userinfo.profile",
							"https://www.googleapis.com/auth/plus.me",
							"https://www.googleapis.com/auth/userinfo.email",
							"https://www.googleapis.com/auth/admin.directory.user",
							"https://www.googleapis.com/auth/classroom.rosters" ];

					/**
					 * Check if current user has authorized this application.
					 */
					$scope.checkAuth = function checkAuth() {
						$log.debug("Inside checkAuth..");

						gapi.auth.authorize({
							'client_id' : CLIENT_ID,
							'scope' : SCOPES.join(' '),
							'immediate' : true
						}, $scope.handleAuthResult);
					}

					/**
					 * Handle response from authorization server.
					 * 
					 * @param {Object}
					 *            authResult Authorization result.
					 */
					$scope.handleAuthResult = function(authResult) {
						$log.debug("Inside handleAuthResult..");
						// var authorizeDiv = document
						// .getElementById('authorize-div');
						if (authResult && !authResult.error) {
							// Hide auth UI, then load client library.
							// authorizeDiv.style.display = 'none';
							$scope.authorized = true;
							$scope.loadClassroomApi(); // Do not auto load. Do
							// it via user action
						} else {
							// Show auth UI, allowing the user to initiate
							// authorization by
							// clicking authorize button.
							// authorizeDiv.style.display = 'inline';
							$scope.authorized = false;
						}
					}

					/**
					 * Initiate auth flow in response to user clicking authorize
					 * button.
					 * 
					 * @param {Event}
					 *            event Button click event.
					 */
					$scope.handleAuthClick = function(event) {
						$log.debug("Inside handleAuthClick..");
						gapi.auth.authorize({
							client_id : CLIENT_ID,
							scope : SCOPES,
							immediate : false
						}, $scope.handleAuthResult);
						return false;
					}

					/**
					 * Load Classroom API client library.
					 */
					$scope.loadClassroomApi = function() {
						gapi.client.load('classroom', 'v1', $scope.listCourses);
						gapi.client
								.load(
										'plus',
										'v1',
										function() {
											var request = gapi.client.plus.people
													.get({
														'userId' : 'me'
													});
											request
													.execute(function(resp) {
														$scope.currentClassroomUser = resp;
														$log
																.debug('Retrieved profile for:'
																		+ resp.displayName);
														$log
																.debug("$scope.currentClassroomUser:"
																		+ angular
																				.toJson($scope.currentClassroomUser));
													});

										});

					}

					/**
					 * Print the names of the first 10 courses the user has
					 * access to. If no courses are found an appropriate message
					 * is printed.
					 */
					$scope.listCourses = function() {
						$log.debug("Inside listCourses..");
						$scope.loading = true;
						var request = gapi.client.classroom.courses.list({
							pageSize : 20
						});

						request.execute(function(resp) {
							var courses = resp.courses;
							// appendPre('Courses:');

							if (courses.length > 0) {
								for (i = 0; i < courses.length; i++) {
									var course = courses[i];

									// appendPre(course.name)
									$scope.classroomCourses.push(course);
								}
							} else {
								appendPre('No courses found.');
							}

							$scope.loading = false;
							$log.debug("Inside listCourses...Done loading...");

						});
					}

					$scope.viewClassTeachers = function() {
						$log.debug("Inside viewClassTeachers..");
						$scope.userType = "Teacher";
						var request = gapi.client.classroom.courses.teachers
								.list({
									courseId : $scope.selected[0].id,
									pageSize : 20
								});

						request.execute(function(resp) {
							$scope.userList = resp.result.teachers?resp.result.teachers:[];
							$log.debug("resp:" + angular.toJson(resp));
						});
					}

					$scope.viewClassStudents = function() {
						$log.debug("Inside viewClassStudents..");
						$scope.userType = "Student";
						var request = gapi.client.classroom.courses.students
								.list({
									courseId : $scope.selected[0].id,
									pageSize : 20
								});

						request.execute(function(resp) {
							$scope.userList = resp.result.students?resp.result.students:[];
							$log.debug("resp:" + angular.toJson(resp));
						});
					}

					$scope.showSavedToast = function() {
						$mdToast.show($mdToast.simple().content(
								'classroomtListCtr Saved!').position("top")
								.hideDelay(3000));
					};

					$scope.userType = "";
					$scope.userList = [];
					
					$scope.checkAuth();

					// Table generic functions
					$scope.selected = [];
					$scope.query = {
						order : 'name',
						limit : 5,
						page : 1
					};

					$scope.onpagechange = function(page, limit) {
						var deferred = $q.defer();

						$timeout(function() {
							deferred.resolve();
						}, 2000);

						return deferred.promise;
					};

					$scope.onorderchange = function(order) {
						var deferred = $q.defer();

						$timeout(function() {
							deferred.resolve();
						}, 2000);

						return deferred.promise;
					};

				});