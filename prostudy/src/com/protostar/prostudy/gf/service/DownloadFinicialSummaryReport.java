package com.protostar.prostudy.gf.service;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.protostar.prostudy.gf.entity.ExamDetail;
import com.protostar.prostudy.gf.entity.GFCourierEntity;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;
import com.protostar.prostudy.gf.entity.PaymentDetail;

/**
 * Servlet implementation class DownloadCourierSummaryReport
 */
public class DownloadFinicialSummaryReport extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DownloadFinicialSummaryReport() {
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

		int sr_no = 0;
		float totalCourierCost = 0.0f;
		float totalPayAmount = 0;

		String summaryReportFilterType1 = request
				.getParameter("summaryReportFilterType1");

		String summaryReportFilterType2 = request
				.getParameter("summaryReportFilterType2");

		String DATE_FORMAT = "dd-MM-yyyy";

		SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);

		TimeZone timeZone = TimeZone.getTimeZone("IST");
		sdf.setTimeZone(timeZone);

		if ("school".equalsIgnoreCase(summaryReportFilterType1.trim())) {

			PartnerSchoolService partnerService = new PartnerSchoolService();
			List<PartnerSchoolEntity> schoolList = partnerService
					.getSchoolByPaymentMode(summaryReportFilterType2);
			try {

				response.setContentType("text/csv");
				response.setHeader("Content-Disposition",
						"attachment; filename=FinancialSummaryCSVDataByPaymentMode_"
								+ sdf.format(new Date()) + ".csv");

				ServletOutputStream outputStream = response.getOutputStream();
				OutputStreamWriter writer = new OutputStreamWriter(outputStream);

				writer.append("Sr. No.");
				writer.append(',');
				writer.append("Reg. No.");
				writer.append(',');
				writer.append("School Name");
				writer.append(',');
				writer.append("Address");
				writer.append(',');
				writer.append("Payment Date");
				writer.append(',');
				writer.append("Amount");
				writer.append(',');

				writer.append(System.lineSeparator());

				for (int j = 0; j < schoolList.size(); j++) {

					PartnerSchoolEntity schoolEntity = schoolList.get(j);
					String serial_no = Integer.toString(++sr_no);
					writer.append(serial_no);
					writer.append(',');
					String reg_no = schoolEntity.getAutoGenerated();
					writer.append(reg_no);
					writer.append(',');
					String schoolName = schoolEntity.getSchoolName();
					writer.append(schoolName);
					writer.append(',');
					String address = schoolEntity.getAddress().getTal() + "- "
							+ schoolEntity.getAddress().getDist();
					writer.append(address);
					writer.append(',');
					ExamDetail examDeatilByCurretnYear = PartnerSchoolService
							.getExamDeatilByCurretnYear(schoolEntity);
					float payAmount = 0;
					Date paymentDate1 = null;
					if (examDeatilByCurretnYear.getPaymentDetail() != null) {
						List<PaymentDetail> paymentDetailList = examDeatilByCurretnYear
								.getPaymentDetail();
						for (PaymentDetail paymentDetail : paymentDetailList) {
							payAmount += paymentDetail.getPayAmount();
							paymentDate1 = paymentDetail.getPaymentDate();
						}
					}
					String paymentDate = sdf.format(paymentDate1);
					writer.append(paymentDate);
					writer.append(',');
					writer.append(Float.toString(payAmount));
					writer.append(',');
					writer.append(System.lineSeparator());
					totalPayAmount = totalPayAmount + payAmount;
					String totalCost = "" + totalPayAmount;

					if (j == schoolList.size() - 1) {
						writer.append(',');
						writer.append(',');
						writer.append(',');
						writer.append(',');
						writer.append("Total: ,");
						writer.append(totalCost);
					}

				}

				writer.close();

			} catch (Exception e) {
				// TODO: handle exception
				throw new ServletException("Exception in Excel Sample Servlet",
						e);
			}

		}

		else {

			GFCourierService gfCourierService = new GFCourierService();
			List<GFCourierEntity> courierReportList = gfCourierService
					.getCourierByLogisticsType(summaryReportFilterType2);
			try {

				response.setContentType("text/csv");
				response.setHeader("Content-Disposition",
						"attachment; filename=FinancialSummaryCSVDataByLogistics_"
								+ sdf.format(new Date()) + ".csv");

				ServletOutputStream outputStream = response.getOutputStream();
				OutputStreamWriter writer = new OutputStreamWriter(outputStream);

				writer.append("Sr. No.");
				writer.append(',');
				writer.append("Reg. No.");
				writer.append(',');
				writer.append("School Name");
				writer.append(',');
				writer.append("Address");
				writer.append(',');
				writer.append("Dispatch Date");
				writer.append(',');
				writer.append("Amount");
				writer.append(',');

				writer.append(System.lineSeparator());

				for (int i = 0; i < courierReportList.size(); i++) {

					GFCourierEntity gfCourierEntity = courierReportList.get(i);
					String serial_no = Integer.toString(++sr_no);
					writer.append(serial_no);
					writer.append(',');
					String reg_no = gfCourierEntity.getAutoGenerated();
					writer.append(reg_no);
					writer.append(',');
					String schoolName = gfCourierEntity.getSchoolName()
							.getSchoolName();
					writer.append(schoolName);
					writer.append(',');
					String address = gfCourierEntity.getSchoolName()
							.getAddress().getTal()
							+ "- "
							+ gfCourierEntity.getSchoolName().getAddress()
									.getDist();
					writer.append(address);
					writer.append(',');
					Date courierDispatchDate = gfCourierEntity
							.getCourierDispatchDate();
					String dispachDateToCourier = sdf
							.format(courierDispatchDate);
					writer.append(dispachDateToCourier);
					writer.append(',');
					float courierCost1 = gfCourierEntity.getCourierCost();
					String courierCost = Float.toString(courierCost1);
					writer.append(courierCost);
					writer.append(',');
					writer.append(System.lineSeparator());
					totalCourierCost = totalCourierCost + courierCost1;
					String totalCost = "" + totalCourierCost;

					if (i == courierReportList.size() - 1) {
						writer.append(',');
						writer.append(',');
						writer.append(',');
						writer.append(',');
						writer.append("Total: ,");
						writer.append(totalCost);
					}
				}
				writer.close();

			} catch (Exception e) {
				// TODO: handle exception
				throw new ServletException("Exception in Excel Sample Servlet",
						e);
			}
		}
	}
}
