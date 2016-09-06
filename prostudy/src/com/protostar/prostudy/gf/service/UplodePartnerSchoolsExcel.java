package com.protostar.prostudy.gf.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.protostar.prostudy.entity.Address;
import com.protostar.prostudy.gf.entity.ContactDetail;
import com.protostar.prostudy.gf.entity.CoordinatorDetail;
import com.protostar.prostudy.gf.entity.ExamDetail;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;
import com.protostar.prostudy.until.data.UtilityService;

/**
 * Servlet implementation class UplodePartnerSchoolsExcel
 */
public class UplodePartnerSchoolsExcel extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final Logger log = Logger
			.getLogger(UplodePartnerSchoolsExcel.class.getName());

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UplodePartnerSchoolsExcel() {
		super();
		// TODO Auto-generated constructor stub
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		log.info("In side UplodePartnerSchoolsExcel");
		this.doGet(request, response);
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		try {
			if (request.getHeader("Content-Type") != null
					&& request.getHeader("Content-Type").startsWith(
							"multipart/form-data")) {
				ServletFileUpload upload = new ServletFileUpload();

				FileItemIterator iterator = upload.getItemIterator(request);
				String[] split2 = null;
				Map parameterMap = request.getParameterMap();
				for (Object key : parameterMap.keySet()) {
					log.fine("key:" + key + "\b value:" + parameterMap.get(key));
				}

				Long insId = 0L;
				while (iterator.hasNext()) {
					FileItemStream item = iterator.next();
					log.fine("item.getFieldName(): " + item.getFieldName());

					if (item.getName() == null) {
						// It is form field not file.

						if ("instituteId".equalsIgnoreCase(item.getFieldName())) {
							insId = Long.parseLong(UtilityService.read(item
									.openStream()));

						}
						continue;
					}
					InputStream openStream = item.openStream();
					int len = 0;
					byte[] fileContent = new byte[2000000];
					// Can handle files upto 20 MB

					int read = openStream.read(fileContent);
					// log.fine("No of bytes read:" + read);
					while ((len = openStream.read(fileContent, 0,
							fileContent.length)) != -1) {
						// res.getOutputStream().write(fileContent, 0, len);
					}
					log.fine("File content is : " + new String(fileContent));
					log.fine("File Read is Done!!");
					// Write code here to parse sheet of patients and upload to
					// database

					String fileAsString = new String(fileContent);

					split2 = fileAsString.split("\n");

				}
				// gte business entity

				for (int row = 1; row < split2.length; row++) {
					try {
						String[] split = split2[row].split(",");
						if (split == null || split.length < 18) {
							continue;
						}
						log.fine(" Row: " + row);
						log.fine(" schoolName: " + split[0]);
						log.fine(" desc: " + split[1]);
						log.fine(" formNumber: " + split[2]);
						log.fine(" category: " + split[3]);
						log.fine(" line1: " + split[4]);
						log.fine(" line2: " + split[5]);
						log.fine(" city: " + split[6]);
						log.fine(" taluka: " + split[7]);
						log.fine(" Dist: " + split[8]);
						log.fine(" state: " + split[9]);
						log.fine(" country: " + split[10]);
						log.fine(" pin: " + split[11]);
						log.fine(" headMasterName: " + split[12]);
						log.fine(" headMasterMobile: " + split[13]);
						log.fine(" headMasterEmailId: " + split[14]);
						log.fine(" coordinatorName: " + split[15]);
						log.fine(" coordinatorPhoneNum: " + split[16]);
						log.fine(" coordinatorEmailId: " + split[17]);


						// insert partner school
						PartnerSchoolEntity patschool = new PartnerSchoolEntity();
						patschool.setSchoolName(split[0]);
						patschool.setInstName(split[1]);
						patschool.setFormNumber(split[2]);
						patschool.setCategory(split[3]);
/*						patschool.setPrimaryContact(split[4]);*/
						patschool.setInstituteID(insId);
						// address
						Address add = new Address();
						add.setLine1(split[4]);
						add.setLine2(split[5]);
						add.setCity(split[6]);
						add.setTal(split[7]);
						add.setDist(split[8]);
						add.setState(split[9]);
						add.setCountry(split[10]);
						add.setPin(split[11]);
						patschool.setAddress(add);

						// Contact Detail
						ContactDetail conDetail = new ContactDetail();

						conDetail.setHeadMasterEmailId(split[12]);
						conDetail.setHeadMasterMobile(split[13]);
						conDetail.setHeadMasterName(split[14]);
						patschool.setContactDetail(conDetail);
						
						CoordinatorDetail corddetail = new CoordinatorDetail();
						corddetail.setCoordinatorName(split[15]);
						corddetail.setCoordinatorPhoneNum(split[16]);
						corddetail.setCoordinatorEmailId(split[17]);

						List<CoordinatorDetail> corddetailList = new ArrayList<CoordinatorDetail>();
						corddetailList.add(corddetail);
						conDetail.setCoordinatorDetail(corddetailList);
						
/*						corddetail.setSrno(1);
						corddetail.setCoordinatorEmailId(split[26]);
						corddetail.setCoordinatorName(split[24]);
						corddetail.setCoordinatorPhoneNum(split[25]);

						conDetail.setCoordinatorDetail(Arrays
								.asList(corddetail));
*/	

						// ExamDetail
						ExamDetail eDtail = new ExamDetail();
						/*						eDtail.setBookRequired(split[19]);
*/						/*
						 * eDtail.setExamMedium(Arrays.asList(split[15],
						 * split[16], split[17]));
						 */
						eDtail.setFemale("");
						eDtail.setMale("");
						eDtail.setModeOfExam("");
						eDtail.setTotal("");
						eDtail.setTotalStudent("");
						eDtail.setYearOfExam("");
					
						List<ExamDetail> examList = new ArrayList<ExamDetail>();
						examList.add(eDtail);
						patschool.setExamDetailList(examList); 
						
						// book summary
	//					BookSummary bookSummary = new BookSummary();
						/* patschool.setBookSummary(bookSummary); */

						PartnerSchoolService partnerSchool = new PartnerSchoolService();
						partnerSchool.addPartnerSchool(patschool);
					} catch (Exception e) {
						log.severe(e.getMessage());
						e.printStackTrace();
						throw new ServletException(
								"Error Occurred while uploading the csv file.",
								e);
					}

				}
			}

		} catch (Exception e) {
			log.severe(e.getMessage());
			e.printStackTrace();
			throw new ServletException(
					"Error Occurred while uploading the csv file.", e);
		}

	}
}
