package com.protostar.prostudy.until;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.protostar.prostudy.gf.entity.BookDetail;
import com.protostar.prostudy.gf.entity.ExamDetail;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;
import com.protostar.prostudy.gf.service.PartnerSchoolService;
import com.protostar.prostudy.until.data.DateUtil;

public class BusinessDataMigrationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public BusinessDataMigrationServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String servletMsg = "Migration Done!";
		Long grfInstiuteId = 5682617542246400L;
		if (request.getParameter("iid") != null) {
			grfInstiuteId = Long.parseLong(request.getParameter("iid"));
		}
		String yearOfExam = DateUtil.getCurrentGVSPYear(grfInstiuteId);

		PartnerSchoolService ps = new PartnerSchoolService();
		List<PartnerSchoolEntity> list = ps.getPartnerByInstitute(grfInstiuteId, yearOfExam);
		try {
			for (PartnerSchoolEntity sc : list) {
				ExamDetail examDetail = null;
				for (ExamDetail exam : sc.getExamDetailList()) {
					if (yearOfExam.trim().equalsIgnoreCase(exam.getYearOfExam().trim())) {
						examDetail = exam;
						break;
					}
				}
				if (examDetail != null) {
					int freeCount = 0;
					List<BookDetail> bookDetail = examDetail.getBookSummary().getBookDetail();

					for (BookDetail bd : bookDetail) {
						freeCount += bd.getFreeStudCount();
					}
					examDetail.setTotalFreeStudCount(String.valueOf(freeCount));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		ofy().save().entities(list).now();
		PrintWriter writer = response.getWriter();
		writer.write(servletMsg);
		writer.flush();
	}

}
