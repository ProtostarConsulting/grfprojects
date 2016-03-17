angular.module("prostudyApp").factory('googleEndpointSF', googleEndpointSF);

function googleEndpointSF($log, $q, $localStorage, $timeout) {

	var serviceFactory = {};

	// start of UserService
	var UserService = {};

	serviceFactory.getUserService = function() {
		return UserService;
	}

	UserService.addUser = function(user) {

		var deferred = $q.defer();
		gapi.client.userService.addUser(user).execute(function(resp) {

			deferred.resolve(resp);
			$log.debug("resp :" + angular.toJson(resp));
			$log.debug("getUser #resp :" + resp);
		});

		return deferred.promise;
	}

	UserService.getUser = function() {
		var deferred = $q.defer();
		gapi.client.userService.getUser().execute(function(resp) {
			$log.debug("getUser #resp :" + resp);
			deferred.resolve(resp.items);
		});
		return deferred.promise;

	}

	UserService.getUserByEmailID = function(email_id) {
		var deferred = $q.defer();
		gapi.client.userService.getUserByEmailID({
			'email_id' : email_id
		}).execute(function(resp) {
			$log.debug("resp:" + angular.toJson(resp));

			deferred.resolve(resp.result);

		});
		return deferred.promise;
	}

	UserService.getUserByInstitute = function(instituteID) {
		var deferred = $q.defer();
		gapi.client.userService.getUserByInstitute({
			'instituteID' : instituteID
		}).execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	UserService.getUserByClass = function(standard, division, subject) {

		var deferred = $q.defer();

		gapi.client.userService.getUserByClass({
			'standard' : standard,
			'division' : division,
			'subject' : subject
		}).execute(function(resp) {
			deferred.resolve(resp.items);
		});

		return deferred.promise;
	}

	UserService.updateUser = function(user) {
		$log.debug("No2");
		var deferred = $q.defer();
		gapi.client.userService.updateUser(user).execute(function(resp) {
			$log.debug("user......." + angular.toJson(user));
			deferred.resolve(resp.result);
		});
		$log.debug("No3");
		return deferred.promise;
	}

	UserService.getLoggedinUser = function() {
		var user = $localStorage.loggedinUser;
		if (user == 'undefined' || user == null)
			return null;
		else
			return $localStorage.loggedinUser;
	}

	UserService.login = function(email, pass) {
		$log.debug("No2");
		var deferred = $q.defer();

		gapi.client.userService.login({
			'email_id' : email,
			'password' : pass
		}).execute(function(resp) {
			deferred.resolve(resp);
		});
		$log.debug("No3");
		return deferred.promise;
	}

	UserService.logout = function() {
		$localStorage.loggedinUser = null;
	}

	UserService.getExamId = function(selectedMyExamId) {
		$log.debug("No2");
		var deferred = $q.defer();
		gapi.client.userService.getExamId(selectedMyExamId).execute(
				function(resp) {
					$log.debug("getExamId... #resp:" + angular.toJson(resp));
					deferred.resolve(resp);
				});
		$log.debug("No3");
		return deferred.promise;
	}

	UserService.getMyExamList = function(email_id) {

		var deferred = $q.defer();
		gapi.client.userService.getUserByEmailID({
			'email_id' : email_id
		}).execute(function(resp) {
			$log.debug("getMyExamList #resp :" + resp.myExams);
			deferred.resolve(resp.myExams);
		});
		return deferred.promise;
	}

	UserService.getMyBookList = function(email_id) {

		var deferred = $q.defer();
		gapi.client.userService.getUserByEmailID({
			'email_id' : email_id
		}).execute(function(resp) {
			$log.debug("getMyBookList #resp :" + resp.myBooks);
			deferred.resolve(resp.myBooks);
		});
		return deferred.promise;
	}

	// end of
	// UserService-----------------------------------------------------------------------------------------------------------------

	// start of CertificateService
	var CertificateService = {};

	serviceFactory.getCertificateService = function() {
		return CertificateService;
	}

	CertificateService.addCertificate = function(certificate) {

		var deferred = $q.defer();
		gapi.client.certificateService.addCertificate(certificate).execute(
				function(resp) {

					deferred.resolve(resp);
					$log.debug("resp :" + angular.toJson(resp));
				});

		return deferred.promise;
	}

	CertificateService.getCertificate = function() {
		var deferred = $q.defer();
		gapi.client.certificateService.getCertificate().execute(function(resp) {
			$log.debug("getCertificate #resp :" + resp);
			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	CertificateService.getCertificateById = function(studID) {
		var deferred = $q.defer();
		gapi.client.certificateService.getCertificateById({
			'studID' : studID
		}).execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}
	// End of CertificateService

	// start of StandardService
	var StandardService = {};

	serviceFactory.getStandardService = function() {
		return StandardService;
	}

	StandardService.addStandards = function(std) {

		var deferred = $q.defer();
		gapi.client.standardService.addStandard(std).execute(function(resp) {

			deferred.resolve(resp);
			$log.debug("resp :" + angular.toJson(resp));
		});

		return deferred.promise;
	}

	StandardService.getStandards = function() {
		var deferred = $q.defer();
		gapi.client.standardService.getStandard().execute(function(resp) {
			$log.debug("getUser #resp :" + resp);
			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	StandardService.getStandardByInstitute = function(instituteID) {
		var deferred = $q.defer();
		gapi.client.standardService.getStandardByInstitute({
			'instituteID' : instituteID
		}).execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	StandardService.editStandard = function(standard) {

		var deferred = $q.defer();
		gapi.client.standardService.editStandard(standard).execute(
				function(resp) {

					deferred.resolve(resp);
				});

		return deferred.promise;
	}

	// end of StandardService

	// start of DivisionService
	var DivisionService = {};

	serviceFactory.getDivisionService = function() {
		return DivisionService;
	}

	DivisionService.addDivisions = function(div) {

		var deferred = $q.defer();
		gapi.client.divisionService.addDivision(div).execute(function(resp) {

			deferred.resolve(resp);
			$log.debug("resp :" + angular.toJson(resp));
		});

		return deferred.promise;
	}

	DivisionService.getDivisions = function() {
		var deferred = $q.defer();
		gapi.client.divisionService.getDivision().execute(function(resp) {
			$log.debug("getUser #resp :" + resp);
			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	DivisionService.getDivisionByStandard = function(standardID) {
		var deferred = $q.defer();
		gapi.client.divisionService.getDivisionByStandard({
			'standardID' : standardID
		}).execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	DivisionService.editDivision = function(division) {

		var deferred = $q.defer();
		gapi.client.divisionService.editDivision(division).execute(
				function(resp) {

					deferred.resolve(resp);
				});

		return deferred.promise;
	}

	// end of DivisionService

	// start of SubjectService
	var SubjectService = {};

	serviceFactory.getSubjectService = function() {
		return SubjectService;
	}

	SubjectService.addSubjects = function(sub) {

		var deferred = $q.defer();
		gapi.client.subjectService.addSubject(sub).execute(function(resp) {

			deferred.resolve(resp);
			$log.debug("resp :" + angular.toJson(resp));
		});

		return deferred.promise;
	}

	SubjectService.getSubjects = function() {
		var deferred = $q.defer();
		gapi.client.subjectService.getSubject().execute(function(resp) {
			$log.debug("getUser #resp :" + resp);
			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	SubjectService.getSubjectByDivision = function(divisionID) {
		var deferred = $q.defer();
		gapi.client.subjectService.getSubjectByDivision({
			'divisionID' : divisionID
		}).execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	SubjectService.editSubject = function(subject) {

		var deferred = $q.defer();
		gapi.client.subjectService.editSubject(subject).execute(function(resp) {
			deferred.resolve(resp.result);
		});

		return deferred.promise;
	}
	// end of SubjectService

	// start of AttendanceService
	var AttendanceService = {};

	serviceFactory.getAttendanceService = function() {
		return AttendanceService;
	}

	AttendanceService.addAttendance = function(attendance) {

		var deferred = $q.defer();
		gapi.client.attendanceService.addAttendance(attendance).execute(
				function(resp) {

					deferred.resolve(resp);

				});

		return deferred.promise;
	}

	AttendanceService.getAttendance = function() {
		var deferred = $q.defer();
		gapi.client.attendanceService.getAttendance().execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	AttendanceService.getAttendanceByInstitute = function(instituteID) {
		var deferred = $q.defer();
		gapi.client.attendanceService.getAttendanceByInstitute({
			'instituteID' : instituteID
		}).execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	// End of AttendanceService

	var ChapterService = {};

	serviceFactory.getChapterService = function() {
		return ChapterService;
	}

	ChapterService.addChapter = function(chapter) {
		$log.debug("No2");
		var deferred = $q.defer();
		$log.debug("abc");
		gapi.client.chapterService.addChapter(chapter).execute(function(resp) {
			$log.debug("No5");
			$log.debug("addChapter#resp:" + resp);
			deferred.resolve(resp);
		});
		$log.debug("No3");
		return deferred.promise;
	}

	ChapterService.getChapters = function() {
		var deferred = $q.defer();
		gapi.client.chapterService.getAllChapters().execute(function(resp) {
			$log.debug("getAllChapters#resp :" + resp);
			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	ChapterService.getChaptersByID = function(selectedChapterId) {
		var deferred = $q.defer();
		gapi.client.chapterService.getChaptersByID({
			'id' : selectedChapterId
		}).execute(function(resp) {

			deferred.resolve(resp.result);
		});
		return deferred.promise;
	}

	ChapterService.getChaptersByInstitute = function(instituteID) {
		var deferred = $q.defer();
		gapi.client.chapterService.getChaptersByInstitute({
			'instituteID' : instituteID
		}).execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	ChapterService.updateChapter = function(chapter) {
		$log.debug("No2");
		var deferred = $q.defer();
		gapi.client.chapterService.updateChapter(chapter).execute(
				function(resp) {
					deferred.resolve(resp.result);
				});
		$log.debug("No3");
		return deferred.promise;
	}
	
	ChapterService.getChaptersByClass = function(standard, division, subject) {

		var deferred = $q.defer();
		gapi.client.chapterService.getChaptersByClass({
			'standard' : standard,
			'division' : division,
			'subject' : subject
		}).execute(function(resp) {
			deferred.resolve(resp.items);
		});

		return deferred.promise;
	}

	// end of
	// ChapterService----------------------------------------------------------------------------------------------------------
	var BookService = {};

	serviceFactory.getBookService = function() {
		return BookService;
	}

	BookService.addBook = function(book) {
		$log.debug("No2");
		var deferred = $q.defer();
		$log.debug("abc");

		gapi.client.bookService.addBook(book).execute(function(resp) {
			$log.debug("No5");
			$log.debug("addBook#resp:" + resp);
			deferred.resolve(resp);
		});
		$log.debug("No3");
		return deferred.promise;
	}// end of addBook

	BookService.getBooks = function(id) {
		var deferred = $q.defer();
		gapi.client.bookService.getBooks({
			'id' : id
		}).execute(function(resp) {
			$log.debug("getBooks#resp:" + resp);
			deferred.resolve(resp.items);
		});
		return deferred.promise;
	} // End of getBooks

	BookService.getBookbyID = function(selectedBookId) {
		var deferred = $q.defer();
		gapi.client.bookService.getBookByID({
			'id' : selectedBookId
		}).execute(function(resp) {

			deferred.resolve(resp);
		});
		return deferred.promise;
	} // End of getBookbyID

	BookService.getBookByStandard = function(selectedStdId) {
		var deferred = $q.defer();
		gapi.client.bookService.getBookByStandard({
			'standard' : selectedStdId
		}).execute(function(resp) {

			$log.debug("getBookByStandard#resp:" + angular.toJson(resp));
			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	BookService.getBooksByInstitute = function(instituteID) {
		var deferred = $q.defer();
		gapi.client.bookService.getBooksByInstitute({
			'instituteID' : instituteID
		}).execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	BookService.updateBook = function(book) {

		var deferred = $q.defer();
		gapi.client.bookService.updateBook(book).execute(function(resp) {
			$log.debug("book......." + angular.toJson(book));
			deferred.resolve(resp.result);
		});

		return deferred.promise;
	}

	BookService.likeCount = function(book) {
		var deferred = $q.defer();
		gapi.client.bookService.updateBook(book).execute(function(resp) {

			deferred.resolve(resp);

		});
		return deferred.promise;
	}

	BookService.dislikeCount = function(book) {
		var deferred = $q.defer();
		gapi.client.bookService.updateBook(book).execute(function(resp) {
			deferred.resolve(resp);
		});
		return deferred.promise;
	}

	// -------end of
	// BookService------------------------------------------------------------------------------------------------------

	// start of SyllabusService

	var SyllabusService = {};

	serviceFactory.getSyllabusService = function() {
		return SyllabusService;
	}

	SyllabusService.addSyllabus = function(syll) {
		$log.debug("No2");
		var deferred = $q.defer();
		$log.debug("abc");
		gapi.client.syllabusService.addSyllabus(syll).execute(function(resp) {
			$log.debug("No5");
			$log.debug("addSyllabus #resp:" + angular.toJson(resp));
			deferred.resolve(resp);
		});
		$log.debug("No3");
		return deferred.promise;
	}

	SyllabusService.getSyllabus = function() {
		var deferred = $q.defer();
		gapi.client.syllabusService.getSyllabus().execute(function(resp) {
			$log.debug("Syllabus.....Service#resp :" + resp);
			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	SyllabusService.getSyllabusByInstitute = function(instituteID) {
		var deferred = $q.defer();
		gapi.client.syllabusService.getSyllabusByInstitute({
			'instituteID' : instituteID
		}).execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	SyllabusService.updateSyllabus = function(syllabus) {

		var deferred = $q.defer();

		gapi.client.syllabusService.updateSyllabus(syllabus).execute(
				function(resp) {
					$log.debug(" updateSyllabus resp:" + angular.toJson(resp));
					deferred.resolve(resp);
				});

		return deferred.promise;
	}

	// End of SyllabusService

	// start of PracticeExamService
	var PracticeExamService = {};

	serviceFactory.getPracticeExamService = function() {
		return PracticeExamService;
	}

	PracticeExamService.addPracticeExam = function(exam) {

		var deferred = $q.defer();

		gapi.client.practiceExamService.addPracticeExam(exam).execute(
				function(resp) {

					$log.debug("addPracticeExam :" + angular.toJson(exam));
					$log.debug("res.result.length :" + resp.result.length);

					deferred.resolve(resp);
				});

		return deferred.promise;
	}

	PracticeExamService.getPracticeExams = function() {
		var deferred = $q.defer();
		gapi.client.practiceExamService.getPracticeExams().execute(
				function(resp) {

					deferred.resolve(resp.items);

				});
		return deferred.promise;
	}

	PracticeExamService.getPracticeExamById = function(selectedExamId) {
		var deferred = $q.defer();
		gapi.client.practiceExamService.getPracticeExamById({
			'examId' : selectedExamId
		}).execute(function(resp) {
			deferred.resolve(resp);
		});
		return deferred.promise;
	}

	PracticeExamService.getPracticeExamByInstitute = function(instituteID) {
		var deferred = $q.defer();
		gapi.client.practiceExamService.getPracticeExamByInstitute({
			'instituteID' : instituteID
		}).execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	PracticeExamService.updatePracticeExam = function(exam) {

		var deferred = $q.defer();

		gapi.client.practiceExamService.updatePracticeExam(exam).execute(
				function(resp) {

					deferred.resolve(resp);

				});

		return deferred.promise;
	}

	PracticeExamService.likeCount = function(exam) {
		var deferred = $q.defer();
		gapi.client.practiceExamService.updatePracticeExam(exam).execute(
				function(resp) {

					deferred.resolve(resp);

				});
		return deferred.promise;
	}

	PracticeExamService.dislikeCount = function(exam) {
		var deferred = $q.defer();
		gapi.client.practiceExamService.updatePracticeExam(exam).execute(
				function(resp) {
					deferred.resolve(resp);
				});
		return deferred.promise;
	}
	// End of PracticeExamService

	// start of PracticeExamResultService

	var PracticeExamResultService = {};

	serviceFactory.getPracticeExamResultService = function() {
		return PracticeExamResultService;
	}

	PracticeExamResultService.addPracticeExamResult = function(res) {

		var deferred = $q.defer();

		gapi.client.practiceExamResultService.addPracticeExamResult(res)
				.execute(function(resp) {

					deferred.resolve(resp);
				});

		return deferred.promise;
	}

	PracticeExamResultService.getPracticeExamResult = function() {
		var deferred = $q.defer();
		gapi.client.practiceExamResultService.getPracticeExamResult().execute(
				function(resp) {

					deferred.resolve(resp.items);
				});
		return deferred.promise;
	}

	PracticeExamResultService.getPracticeExamResultbyID = function(email_id) {
		var deferred = $q.defer();
		gapi.client.practiceExamResultService.getPracticeExamResultbyID({
			'email_id' : email_id
		}).execute(function(resp) {

			deferred.resolve(resp.items);

		});
		return deferred.promise;
	}

	// End of PracticeExamResultService

	// start of InstituteService

	var InstituteService = {};

	serviceFactory.getInstituteService = function() {
		return InstituteService;
	}

	InstituteService.addInstitute = function(insti, student, admin, teacher) {

		var deferred = $q.defer();
		gapi.client.instituteService.addInstitute(insti).execute(
				function(resp) {

					deferred.resolve(resp);
					$log.debug("resp :" + angular.toJson(resp));
				});

		return deferred.promise;
	}

	InstituteService.getInstitutes = function() {
		var deferred = $q.defer();
		gapi.client.instituteService.getInstitutes().execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	InstituteService.getInstituteById = function(selectedInstituteId) {
		var deferred = $q.defer();
		gapi.client.instituteService.getInstituteById({
			'id' : selectedInstituteId
		}).execute(function(resp) {
			$log.debug("resp:" + angular.toJson(resp));

			deferred.resolve(resp.result);
		});
		return deferred.promise;
	}

	InstituteService.editInstitute = function(insti) {

		var deferred = $q.defer();
		gapi.client.instituteService.editInstitute(insti).execute(
				function(resp) {

					deferred.resolve(resp);
				});

		return deferred.promise;
	}

	// End of InstituteService

	// start of QuestionService
	var QuestionService = {};

	serviceFactory.getQuestionService = function() {
		return QuestionService;
	}

	QuestionService.addQuestion = function(ques) {

		var deferred = $q.defer();

		gapi.client.questionService.addQuestion(ques).execute(function(resp) {
			$log.debug("resp :" + angular.toJson(resp));

			deferred.resolve(resp);
		});

		return deferred.promise;
	}

	QuestionService.getQuestion = function() {
		var deferred = $q.defer();
		gapi.client.questionService.getQuestion().execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	QuestionService.getQuestionsByInstitute = function(instituteID) {
		var deferred = $q.defer();
		gapi.client.questionService.getQuestionsByInstitute({
			'instituteID' : instituteID
		}).execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	QuestionService.updateQuestion = function(ques) {

		var deferred = $q.defer();
		gapi.client.questionService.updateQuestion(ques)
				.execute(
						function(resp) {
							$log.debug(" ques resp:" + angular.toJson(ques));
							$log.debug(" updateQuestion* resp:"
									+ angular.toJson(resp));
							deferred.resolve(resp);
						});

		return deferred.promise;
	}

	QuestionService.getQuestionByID = function(id) {
		var deferred = $q.defer();
		gapi.client.questionService.getQuestionByID({
			'quesId' : id
		}).execute(function(resp) {
			$log.debug("resp:" + angular.toJson(resp));
			deferred.resolve(resp.result);
		});
		return deferred.promise;
	}

	// End of QuestionService

	// start of StudentService
	var StudentService = {};

	serviceFactory.getStudentService = function() {
		return StudentService;
	}

	StudentService.addStudent = function(stud) {

		var deferred = $q.defer();
		gapi.client.studentService.addStudent(stud).execute(function(resp) {

			deferred.resolve(resp);
			$log.debug("resp_stud" + angular.toJson(resp));
		});

		return deferred.promise;
	}

	StudentService.getStudents = function() {
		var deferred = $q.defer();
		gapi.client.studentService.getStudents().execute(function(resp) {

			deferred.resolve(resp.items);
		});
		return deferred.promise;
	}

	StudentService.updateStudent = function(stud) {

		var deferred = $q.defer();
		gapi.client.studentService.updateStudent(stud).execute(function(resp) {
			deferred.resolve(resp.result);
		});

		return deferred.promise;
	}

	StudentService.getStudentByInstitute = function(instituteID) {
		var deferred = $q.defer();
		gapi.client.studentService.getStudentByInstitute({
			'instituteID' : instituteID
		}).execute(function(resp) {

			deferred.resolve(resp.items);

			$log.debug("resp institute :" + angular.toJson(resp));
		});
		return deferred.promise;
	}

	// End of StudentService

	return serviceFactory;
}
