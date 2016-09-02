package com.protostar.prostudy.gf.service;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import com.protostar.prostudy.gf.entity.ExamDetail;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;

/**
 * Servlet implementation class DownloadPartnerSchools
 */
public class DownloadPartnerSchools extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DownloadPartnerSchools() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		System.out.println("hi i am download servlet");
		Long insId = Long.parseLong(request.getParameter("InstituteId"));

		System.out.println("insid===" + insId);
		PartnerSchoolService patss = new PartnerSchoolService();

		Date date = new Date();
		String DATE_FORMAT = "dd/MMM/yyyy";
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);

		List<PartnerSchoolEntity> schoolList = patss
				.getPartnerByInstitute(insId);

		OutputStream out = null;
		try {

			// response.setContentType("application/vnd.ms-excel");
			response.setContentType("text/csv");

			response.setHeader("Content-Disposition",
					"attachment; filename=SchoolData_" + sdf.format(date)
							+ ".csv");

			ServletOutputStream outputStream = response.getOutputStream();
			OutputStreamWriter writer = new OutputStreamWriter(outputStream);
			// Part-1
			writer.append("School Name");
			writer.append(',');
			writer.append("Institute Name");
			writer.append(',');
			writer.append("Form Number");
			writer.append(',');
			writer.append("Category");
			writer.append(',');
			/*
			 * writer.append("primaryContact"); writer.append(',');
			 */writer.append("Address Line1");
			writer.append(',');
			writer.append("Line2");
			writer.append(',');
			writer.append("City");
			writer.append(',');
			writer.append("Taluka");
			writer.append(',');
			writer.append("District");
			writer.append(',');
			writer.append("State");
			writer.append(',');
			writer.append("country");
			writer.append(',');
			writer.append("pin");
			writer.append(',');
			writer.append("HeadMaster");
			writer.append(',');
			writer.append("HeadMasterMobile");
			writer.append(',');
			writer.append("headMasterEmailId");
			writer.append(',');
			writer.append("Coordinator Name");
			writer.append(',');
			writer.append("Coordinator Mobile");
			writer.append(',');
			writer.append("Email");
			writer.append(',');
			
			// Part-2
			writer.append("ExamYear");
			writer.append(',');
			writer.append("Mode of Exam");
			writer.append(',');
			writer.append("Male");
			writer.append(',');
			writer.append("Female");
			writer.append(',');
			/*
			 * writer.append("totalStudent"); writer.append(',');
			 * writer.append("male"); writer.append(',');
			 * writer.append("female"); writer.append(',');
			 * writer.append("total"); writer.append(',');
			 * writer.append("examMedium1"); writer.append(',');
			 * writer.append("examMedium2"); writer.append(',');
			 * writer.append("examMedium3"); writer.append(',');
			 * writer.append("yearOfExam"); writer.append(',');
			 * writer.append("bookRequired"); writer.append(',');
			 * writer.append("modeOfExam"); writer.append(',');
			 */

			writer.append(System.lineSeparator());

			for (int i = 0; i < schoolList.size(); i++) {

				try {

					PartnerSchoolEntity schoolEntity = schoolList.get(i);

					// Part-1
					writer.append(schoolEntity.getSchoolName()
							.replace(',', '-'));
					writer.append(',');
					writer.append(schoolEntity.getInstName() != null ? schoolEntity
							.getInstName().replace(',', '-') : "");
					writer.append(',');
					writer.append(schoolEntity.getFormNumber());
					writer.append(',');
					writer.append(schoolEntity.getCategory());
					writer.append(',');
					/*
					 * writer.append(patse.get(i).getPrimaryContact());
					 * writer.append(',');
					 */
					writer.append(schoolEntity.getAddress().getLine1()
							.replace(',', '-'));
					writer.append(',');
					writer.append(schoolEntity.getAddress().getLine2()
							.replace(',', '-'));
					writer.append(',');
					writer.append(schoolEntity.getAddress().getCity());
					writer.append(',');
					writer.append(schoolEntity.getAddress().getTal());
					writer.append(',');
					writer.append(schoolEntity.getAddress().getDist());
					writer.append(',');
					writer.append(schoolEntity.getAddress().getState());
					writer.append(',');
					writer.append(schoolEntity.getAddress().getCountry());
					writer.append(',');
					writer.append(schoolEntity.getAddress().getPin());
					writer.append(',');

					writer.append(schoolEntity.getContactDetail()
							.getHeadMasterName());
					writer.append(',');
					writer.append(schoolEntity.getContactDetail()
							.getHeadMasterMobile());
					writer.append(',');
					writer.append(schoolEntity.getContactDetail()
							.getHeadMasterEmailId());
					writer.append(',');

					if (schoolEntity.getContactDetail().getCoordinatorDetail() != null) {
						writer.append(schoolEntity.getContactDetail()
								.getCoordinatorDetail().get(0)
								.getCoordinatorName());
						writer.append(',');
						writer.append(schoolEntity.getContactDetail()
								.getCoordinatorDetail().get(0)
								.getCoordinatorMobileNum());
						writer.append(',');
						writer.append(schoolEntity.getContactDetail()
								.getCoordinatorDetail().get(0)
								.getCoordinatorEmailId());
						writer.append(',');
					}

					// Part-2
					ExamDetail examDeatil = PartnerSchoolService.getExamDeatilByCurretnYear(schoolEntity);
					if (examDeatil != null) {
						writer.append(examDeatil.getYearOfExam());
						writer.append(',');
						writer.append(examDeatil.getModeOfExam());
						writer.append(',');
						writer.append(examDeatil.getMale());
						writer.append(',');
						writer.append(examDeatil.getFemale());
						writer.append(',');						
					}
					writer.append(System.lineSeparator());

				} catch (Exception ex) {
					writer.append(System.lineSeparator());
				}

			}

			writer.close();

		} catch (Exception e) {
			throw new ServletException("Exception in Excel Sample Servlet", e);
		} finally {
			if (out != null)
				out.close();
		}

	}

}
