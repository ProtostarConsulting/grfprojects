package com.protostar.prostudy.gf.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.protostar.prostudy.gf.entity.BookDetail;
import com.protostar.prostudy.gf.entity.BookSummary;
import com.protostar.prostudy.gf.entity.ExamDetail;
import com.protostar.prostudy.gf.entity.GFBookEntity;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;
import com.protostar.prostudy.gf.entity.PaymentDetail;
import com.protostar.prostudy.until.PDFHtmlTemplateService;
import com.protostar.prostudy.until.data.Constants;

import freemarker.template.Template;

public class PrintBookDetailPdf extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public PrintBookDetailPdf() {
		super();
		// TODO Auto-generated constructor stub
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		if (request.getRemoteHost().contains("localhost")
				|| request.getRemoteHost().contains("127.0.0.1")) {
			response.addHeader("Access-Control-Allow-Origin", "*");
			response.addHeader("Access-Control-Allow-Methods",
					"GET,PUT,POST,DELETE");
			response.addHeader("Access-Control-Allow-Headers", "Content-Type");
		}

		String id = request.getParameter("schoolId");
		Long schoolId = (id != null) ? Long.parseLong(id) : 1L;
		String yearOfExam = request.getParameter("yearOfExam");
		String fromGRfRegNo = request.getParameter("fromGRfRegNo");
		String toGRfRegNo = request.getParameter("toGRfRegNo");

		//PDFHtmlTemplateService pdfHtmlTemplateService = new PDFHtmlTemplateService();
		response.setContentType("application/PDF");
		ServletOutputStream outputStream = response.getOutputStream();

		Date date = new Date();
		String DATE_FORMAT = "dd/MMM/yyyy";
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);

		String fileNameAppend = "_" + sdf.format(date);
		response.setHeader("Content-disposition",
				"inline; filename='AccountReport" + fileNameAppend + ".pdf'");

		PartnerSchoolService schoolService = new PartnerSchoolService();
		List<PartnerSchoolEntity> filteredSchoolList = new ArrayList<PartnerSchoolEntity>();
		if (schoolId != 1) {
			PartnerSchoolEntity schoolEntity = schoolService
					.getPSchoolByPSID(schoolId);
			filteredSchoolList.add(schoolEntity);
		} else {
			filteredSchoolList = schoolService.getAccountingReport(yearOfExam,
					fromGRfRegNo, toGRfRegNo);
		}

		this.generateBookDetailPdf(filteredSchoolList, yearOfExam, outputStream);
	}

	private void generateBookDetailPdf(List<PartnerSchoolEntity> schoolList,
			String yearOfExam, ServletOutputStream outputStream) {
		// TODO Auto-generated method stub
		try {
			Document document = new Document();
			PdfWriter writer = PdfWriter.getInstance(document, outputStream);
			document.open();

			XMLWorkerHelper worker = XMLWorkerHelper.getInstance();

			Map<String, Object> root = new HashMap<String, Object>();
			SimpleDateFormat sdfDate = new SimpleDateFormat("dd-MMM-yyyy");
			sdfDate.setTimeZone(TimeZone.getTimeZone("IST"));

			List<PaymentDetail> paymentDetailList = new ArrayList<PaymentDetail>();
			List<BookDetail> bookDetail = new ArrayList<BookDetail>();
			List<SchoolDataTotal> overallTotalList = new ArrayList<SchoolDataTotal>();
			List<String> paymentType = new ArrayList<String>();
			
			root.put("schoolList", schoolList);
			root.put("yearOfExam", yearOfExam);
			for (int i = 0; i < schoolList.size(); i++) {
				int totalStudent = 0, tempBookAmt = 0, tempGRFAmt = 0;
				float totalBookAmount = 0.0f, totalGRFFees = 0.0f, bookAmt20per = 0.0f, bookAmt80per = 0.0f, examAmt20per = 0.0f, examAmt80per = 0.0f;
				SchoolDataTotal overallTotals = new SchoolDataTotal();

				root.put("instituteName", "Gandhi Research Foundation");
				String gvspName = "Gandhi Vichar Sanskar Pariksha "
						+ yearOfExam;
				root.put("gvspName", gvspName);
				/*root.put("regNo", schoolList.get(i).getAutoGenerated());
				root.put("schoolName", schoolList.get(i).getSchoolName());
				Address address = schoolList.get(i).getAddress();
				root.put("city", address.getCity());*/

				List<ExamDetail> examDetailList = schoolList.get(i)
						.getExamDetailList();
				for (int j = 0; j < examDetailList.size(); j++) {

					if (examDetailList != null
							&& examDetailList.size() > 0
							&& examDetailList.get(j).getYearOfExam().trim()
									.equalsIgnoreCase(yearOfExam.trim())) {
						BookSummary bookSummary = examDetailList.get(j)
								.getBookSummary();
						paymentDetailList = examDetailList.get(j)
								.getPaymentDetail();
						if (bookSummary != null) {
							bookDetail = bookSummary.getBookDetail();

							if (bookDetail != null && bookDetail.size() > 0) {
								for (BookDetail book : bookDetail) {
									if (book.getBookName() != null && !book.getBookName().equalsIgnoreCase("")) {
										GFBookStockService bookService = new GFBookStockService();
										GFBookEntity bookEntity = bookService
												.getGFBookById(Long
														.parseLong(book
																.getBookName()
																.trim()));
										String bookName = bookEntity
												.getBookName()
												+ " "
												+ "("
												+ bookEntity.getStandard()
												+ '-'
												+ bookEntity.getBookMedium()
												+ ")";
										book.setBookName(bookName);

										totalStudent += book.getTotalStud();
										tempBookAmt += book.getTotalFees();
										totalBookAmount = (float) tempBookAmt;

										tempGRFAmt += book.getTotalExamFees();
										totalGRFFees = (float) tempGRFAmt;

									}
								}
								overallTotals
										.setTotalBookAmount(totalBookAmount);
								overallTotals.setTotalGRFFees(totalGRFFees);

								bookAmt20per += Math
										.round(((totalBookAmount / 100) * 20));
								bookAmt80per += Math
										.round(((totalBookAmount / 100) * 80));

								examAmt20per += Math
										.round(((totalGRFFees / 100) * 20));
								examAmt80per += Math
										.round(((totalGRFFees / 100) * 80));

								overallTotals.setBookAmt20per(bookAmt20per);
								overallTotals.setBookAmt80per(bookAmt80per);
								overallTotals.setExamAmt20per(examAmt20per);
								overallTotals.setExamAmt80per(examAmt80per);
								overallTotals.setTotalStudent(totalStudent);
								overallTotalList.add(overallTotals);

							}
						}
					}
				}
				
				if (paymentDetailList != null && paymentDetailList.size() > 0) {
					for (int j = 0; j < paymentDetailList.size(); j++) {
						for (PaymentDetail paymentDetail : paymentDetailList) {

							paymentType.add(paymentDetail.getPayReceivedBy());
							if(paymentDetail.getPayReceivedBy().trim().equalsIgnoreCase("D.D")) {
								Date tempDD_Date = paymentDetail.getDdCreatedDate();
								String ddDate = sdfDate.format(tempDD_Date);
								Date tempDepositeDate = paymentDetail
										.getDepositDate();
								String depositDate = sdfDate
										.format(tempDepositeDate);
								root.put("ddDate", ddDate);
								root.put("depositDate", depositDate);
							}
						}
					}
				}
				root.put("paymentTypeList", paymentType);
			}
			root.put("overallTotalList", overallTotalList);

			Template temp = PDFHtmlTemplateService.getConfiguration()
					.getTemplate("email_templates/book_details_tmpl.ftlh");

			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(
					Constants.DOCUMENT_DEFAULT_MAX_SIZE);
			Writer out = new PrintWriter(byteArrayOutputStream);
			temp.process(root, out);

			String pdfXMLContent = byteArrayOutputStream.toString();
			worker.parseXHtml(writer, document, new StringReader(pdfXMLContent));
			document.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public class SchoolDataTotal {
		private int totalStudent;
		float totalBookAmount;
		float totalGRFFees;
		float bookAmt20per;
		float bookAmt80per;
		float examAmt20per;
		float examAmt80per;

		public float getTotalBookAmount() {
			return totalBookAmount;
		}

		public void setTotalBookAmount(float totalBookAmount) {
			this.totalBookAmount = totalBookAmount;
		}

		public float getTotalGRFFees() {
			return totalGRFFees;
		}

		public void setTotalGRFFees(float totalGRFFees) {
			this.totalGRFFees = totalGRFFees;
		}

		public float getBookAmt20per() {
			return bookAmt20per;
		}

		public void setBookAmt20per(float bookAmt20per) {
			this.bookAmt20per = bookAmt20per;
		}

		public float getBookAmt80per() {
			return bookAmt80per;
		}

		public void setBookAmt80per(float bookAmt80per) {
			this.bookAmt80per = bookAmt80per;
		}

		public float getExamAmt20per() {
			return examAmt20per;
		}

		public void setExamAmt20per(float examAmt20per) {
			this.examAmt20per = examAmt20per;
		}

		public float getExamAmt80per() {
			return examAmt80per;
		}

		public void setExamAmt80per(float examAmt80per) {
			this.examAmt80per = examAmt80per;
		}

		public int getTotalStudent() {
			return totalStudent;
		}

		public void setTotalStudent(int totalStudent) {
			this.totalStudent = totalStudent;
		}
	}
}