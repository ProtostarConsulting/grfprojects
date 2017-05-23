package com.protostar.prostudy.gf.service;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.mail.MessagingException;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.QueryResultIterator;
import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.common.base.CaseFormat;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.LoadResult;
import com.googlecode.objectify.cmd.Query;
import com.protostar.prostudy.gf.entity.BookDetail;
import com.protostar.prostudy.gf.entity.BookSummary;
import com.protostar.prostudy.gf.entity.ExamDetail;
import com.protostar.prostudy.gf.entity.GFCourierEntity;
import com.protostar.prostudy.gf.entity.GFExamResultEntity;
import com.protostar.prostudy.gf.entity.NotificationData;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;
import com.protostar.prostudy.gf.entity.PaymentDetail;
import com.protostar.prostudy.until.data.Constants;
import com.protostar.prostudy.until.data.DateUtil;
import com.protostar.prostudy.until.data.EntityPagingInfo;
import com.protostar.prostudy.until.data.EntityUtil;
import com.protostar.prostudy.until.data.SequenceGeneratorShardedService;
import com.protostar.prostudy.until.data.UtilityService;

@Api(name = "partnerSchoolService", version = "v0.1", namespace = @ApiNamespace(ownerDomain = "com.protostar.prostudy.gf.service", ownerName = "com.protostar.prostudy.gf.service", packagePath = ""))
public class PartnerSchoolService {

	private static final String CURRENT_YEAR_SCHOOL_AND_STUDENT_COUNT_KIND = "CurrentYearSchoolAndStudentCount";
	private static final String CURRENT_YEAR_SCHOOL_AND_STUDENT_COUNT_KEY = "1";
	private final Logger logger = Logger.getLogger(PartnerSchoolService.class
			.getName());
	public static boolean notificationEnabled = true;
	private Entity schoolAndStudentCountEntity = new Entity(
			CURRENT_YEAR_SCHOOL_AND_STUDENT_COUNT_KIND,
			CURRENT_YEAR_SCHOOL_AND_STUDENT_COUNT_KEY);
	public static String currentYear;
	static {
		currentYear = DateUtil.getCurrentGVSPYear();
	}

	public static String previousYear;
	static {
		previousYear = DateUtil.getPreviousGVSPYear();
	}

	// private boolean notificationEnabled = false;

	@ApiMethod(name = "addPartnerSchool")
	public PartnerSchoolEntity addPartnerSchool(
			PartnerSchoolEntity partnerSchoolEntity) throws MessagingException,
			IOException {
		logger.fine("###Inside addPartnerSchool###");

		if (partnerSchoolEntity.getAutoGenerated() == null
				|| partnerSchoolEntity.getAutoGenerated().isEmpty()) {
			String nextPRN = UtilityService.getNextPRN("P");
			partnerSchoolEntity.setAutoGenerated(nextPRN);
			/*
			 * SequenceGeneratorShardedService sequenceGenerator = new
			 * SequenceGeneratorShardedService
			 * (EntityUtil.getInstituteEntityRawKey
			 * (partnerSchoolEntity.getInstitute()),
			 * Constants.SCHOOL_REGISTRATION_NO_COUNTER); Long
			 * nextSequenceNumber = sequenceGenerator.getNextSequenceNumber();
			 * partnerSchoolEntity
			 * .setAutoGenerated(nextSequenceNumber.toString());
			 */
			partnerSchoolEntity.setCreatedDate(new Date());
		}

		// Do post processing like notifications.
		if (!notificationEnabled) {
			logger.warning("### Notification is disabled. Ignoring Email and SME ###");
		}
		ExamDetail examDeatil = getExamDeatilByCurretnYear(partnerSchoolEntity);
		if (notificationEnabled
				&& examDeatil != null
				&& examDeatil.getNotificationData().getRegistrationSmsSent() == 0
				&& partnerSchoolEntity.getExamDetailList() != null
				&& partnerSchoolEntity.getExamDetailList().size() > 0
				&& partnerSchoolEntity.getContactDetail() != null
				&& partnerSchoolEntity.getContactDetail()
						.getCoordinatorDetail() != null
				&& partnerSchoolEntity.getContactDetail()
						.getCoordinatorDetail().size() > 0
				&& partnerSchoolEntity.getContactDetail()
						.getCoordinatorDetail().get(0)
						.getCoordinatorMobileNum() != null
				&& !partnerSchoolEntity.getContactDetail()
						.getCoordinatorDetail().get(0)
						.getCoordinatorMobileNum().isEmpty()) {
			// Send email
			new EmailHandler()
					.sendNewSchoolRegistrationEmail(partnerSchoolEntity);
			// Send SMS
			String smsMsg = "Thanks for participating in Gandhi Vichar Sanskar Pariksha. Its Regd. No. is:"
					+ partnerSchoolEntity.getAutoGenerated()
					+ ". From onward, you may refer this number on each correspondence.";

			String cordinatorMobileNumber = (partnerSchoolEntity
					.getContactDetail().getCoordinatorDetail() != null && partnerSchoolEntity
					.getContactDetail().getCoordinatorDetail().size() > 0) ? partnerSchoolEntity
					.getContactDetail().getCoordinatorDetail().get(0)
					.getCoordinatorMobileNum()
					: null;
			TextLocalSMSHandler.sendSms(smsMsg, cordinatorMobileNumber);
			examDeatil.getNotificationData().setRegistrationEmailSent(1);
			examDeatil.getNotificationData().setRegistrationSmsSent(1);

		}

		List<ExamDetail> examDet = partnerSchoolEntity.getExamDetailList();
		if (examDet != null && examDet.size() > 0) {
			for (int j = 0; j < examDet.size(); j++) {
				ExamDetail examEntity = examDet.get(j);
				List<PaymentDetail> paymentDet = examEntity.getPaymentDetail();
				if (paymentDet != null && paymentDet.size() > 0) {
					for (int i = 0; i < paymentDet.size(); i++) {
						PaymentDetail detail = paymentDet.get(i);
						if (detail.getPaymentReciptNo() == null || detail.getPaymentReciptNo().isEmpty()) {
							SequenceGeneratorShardedService sequenceGenerator = new SequenceGeneratorShardedService(
									EntityUtil.getInstituteEntityRawKey(partnerSchoolEntity
											.getInstituteID()),
									Constants.PAYMENT_RECEIPET_NO);
							Long nextSequenceNumber = sequenceGenerator
									.getNextSequenceNumber();
							System.out.println("paymentReceiptNumber**"
									+ nextSequenceNumber);
							detail.setPaymentReciptNo(nextSequenceNumber.toString());
						}
					}
				}
			}
		}

		partnerSchoolEntity.setLastModifiedDate(new Date());
		Key<PartnerSchoolEntity> now = ofy().save().entity(partnerSchoolEntity)
				.now();
		partnerSchoolEntity.setId(now.getId());

		return partnerSchoolEntity;
	}

	@ApiMethod(name = "touchAllSchools", path = "touchAllSchools")
	public void touchAllSchools() {
		List<PartnerSchoolEntity> schoolList = ofy().load()
				.type(PartnerSchoolEntity.class).list();
		for (PartnerSchoolEntity entity : schoolList) {
			entity.setModifiedDate(new Date());
		}
		ofy().save().entities(schoolList).now();
	}

	public static ExamDetail getExamDeatilByCurretnYear(
			PartnerSchoolEntity partnerSchoolEntity) {
		ExamDetail currentYearExamDetail = null;

		if (partnerSchoolEntity == null)
			return null;

		for (ExamDetail exam : partnerSchoolEntity.getExamDetailList()) {
			if (currentYear.equals(exam.getYearOfExam().trim())
					|| previousYear.equals(exam.getYearOfExam().trim())) {
				currentYearExamDetail = exam;
				break;
			}
		}

		if (currentYearExamDetail != null
				&& currentYearExamDetail.getNotificationData() == null) {
			currentYearExamDetail.setNotificationData(new NotificationData());
		}

		return currentYearExamDetail;

	}

	@ApiMethod(name = "getPSchoolByPSID", path = "getPSchoolByPSID")
	public PartnerSchoolEntity getPSchoolByPSID(@Named("id") Long id) {
		PartnerSchoolEntity pSchool = ofy().load()
				.type(PartnerSchoolEntity.class).id(id).now();
		return pSchool;

	}

	@ApiMethod(name = "getSchoolByBId", path = "getSchoolByBId")
	public List<PartnerSchoolEntity> getSchoolByBId(@Named("id") Long id) {

		String bookID = Long.toString(id).trim();
		List<PartnerSchoolEntity> schoolList = ofy().load()
				.type(PartnerSchoolEntity.class).list();
		List<PartnerSchoolEntity> filterSchoolList = new ArrayList();
		for (int i = 0; i < schoolList.size(); i++) {
			PartnerSchoolEntity currentSchool = schoolList.get(i);
			List<ExamDetail> examDetailList = currentSchool.getExamDetailList();
			if (examDetailList != null && examDetailList.size() > 0) {
				BookSummary bookSummary = examDetailList.get(0)
						.getBookSummary();
				if (bookSummary != null) {
					List<BookDetail> bookDetail = bookSummary.getBookDetail();
					for (BookDetail book : bookDetail) {
						if (bookID.equalsIgnoreCase(book.getBookName())) {
							filterSchoolList.add(currentSchool);
						}
					}
				}
			}
		}

		return filterSchoolList;

	}

	@ApiMethod(name = "getPSchoolByFormNumber", path = "getPSchoolByFormNumber")
	public PartnerSchoolEntity getPSchoolByFormNumber(
			@Named("formNumber") String formNumber) {
		logger.info("getPSchoolByFormNumber### formNumber: " + formNumber);
		PartnerSchoolEntity pSchool = ofy().load()
				.type(PartnerSchoolEntity.class)
				.filter("formNumber", formNumber).first().now();
		logger.info("pSchool: " + pSchool);
		return pSchool;

	}

	public static List<Key<PartnerSchoolEntity>> getSchoolKyesByRegOrFormNo(
			String autoGenerated) {
		LoadResult<Key<PartnerSchoolEntity>> first = ofy().load()
				.type(PartnerSchoolEntity.class)
				.filter("autoGenerated", autoGenerated).keys().first();
		String formNumber = autoGenerated.split("-")[2];
		LoadResult<Key<PartnerSchoolEntity>> second = ofy().load()
				.type(PartnerSchoolEntity.class)
				.filter("formNumber", formNumber).keys().first();

		List<Key<PartnerSchoolEntity>> keysToFetch = new ArrayList<Key<PartnerSchoolEntity>>();
		if (first.now() != null)
			keysToFetch.add(first.now());
		if (second.now() != null)
			keysToFetch.add(second.now());

		return keysToFetch;
	}

	@ApiMethod(name = "getSchoolByAutoGeneratedID", path = "getSchoolByAutoGeneratedID")
	public Collection<PartnerSchoolEntity> getSchoolByAutoGeneratedID(
			@Named("autoGenerated") String autoGenerated) {

		List<Key<PartnerSchoolEntity>> schoolKeyList = getSchoolKyesByRegOrFormNo(autoGenerated);
		if (schoolKeyList == null || schoolKeyList.size() == 0)
			return new ArrayList<PartnerSchoolEntity>();

		Map<Key<PartnerSchoolEntity>, PartnerSchoolEntity> keys = ofy().load()
				.keys(schoolKeyList);
		return keys.values();
	}
	
	@ApiMethod(name = "getSchoolByselfUpdateStatus", path = "getSchoolByselfUpdateStatus")
	public List<PartnerSchoolEntity> getSchoolByselfUpdateStatus() {
		List<PartnerSchoolEntity> schoolList = ofy().load()
				.type(PartnerSchoolEntity.class).filter("schoolSelfUpdate", true).list();

		Set<Long> schoolIds = new HashSet<Long>();
		List<PartnerSchoolEntity> schoolSelfUpdateList = new ArrayList<PartnerSchoolEntity>();
		for (PartnerSchoolEntity next : schoolList) {
			if (!schoolIds.contains(next.getId())) {
				schoolSelfUpdateList.add(next);
				schoolIds.add(next.getId());
			}
		}

		logger.info("getSchoolByselfUpdateStatus:"
				+ schoolSelfUpdateList.size());
		return schoolSelfUpdateList;
	}

	@ApiMethod(name = "getPartnerByInstitute", path = "getPartnerByInstitute")
	public List<PartnerSchoolEntity> getPartnerByInstitute(
			@Named("instituteID") Long id) {
		List<PartnerSchoolEntity> schoolList = ofy().load()
				.type(PartnerSchoolEntity.class).filter("instituteID", id)
				.order("autoGenerated").list();

		return schoolList;
	}

	public static List<Key<PartnerSchoolEntity>> searchSchoolKeysByName(
			String nameSearchString) {
		String[] splitArray = nameSearchString.trim().split(" ");
		List<String> strList = new ArrayList<String>(Arrays.asList(splitArray));
		for (String stringToken : splitArray) {
			strList.add(stringToken.toLowerCase());
			strList.add(stringToken.toUpperCase());
			strList.add(CaseFormat.LOWER_CAMEL.to(CaseFormat.UPPER_CAMEL,
					stringToken.toLowerCase()));
		}

		List<Key<PartnerSchoolEntity>> schoolKeys = ofy().load()
				.type(PartnerSchoolEntity.class)
				.filter("schoolNameIndex in", strList).keys().list();

		return schoolKeys;
	}

	public static List<Key<PartnerSchoolEntity>> searchSchoolKeysByCityName(
			String nameSearchString) {
		String[] splitArray = nameSearchString.trim().split(" ");
		List<String> strList = new ArrayList<String>(Arrays.asList(splitArray));
		for (String stringToken : splitArray) {
			strList.add(stringToken.toLowerCase());
			strList.add(stringToken.toUpperCase());
			strList.add(CaseFormat.LOWER_CAMEL.to(CaseFormat.UPPER_CAMEL,
					stringToken.toLowerCase()));
		}

		List<Key<PartnerSchoolEntity>> schoolKeys = ofy().load()
				.type(PartnerSchoolEntity.class)
				.filter("address.city in", strList).keys().list();

		return schoolKeys;
	}

	@ApiMethod(name = "searchSchoolByName", path = "searchSchoolByName")
	public Collection<PartnerSchoolEntity> searchSchoolByName(
			@Named("nameSearchString") String nameSearchString) {

		Set<Key<PartnerSchoolEntity>> keysSet = new HashSet<Key<PartnerSchoolEntity>>();

		List<Key<PartnerSchoolEntity>> list1 = searchSchoolKeysByName(nameSearchString);
		List<Key<PartnerSchoolEntity>> list2 = searchSchoolKeysByCityName(nameSearchString);
		keysSet.addAll(list1);
		keysSet.addAll(list2);

		return ofy().load().keys(keysSet).values();
	}

	@ApiMethod(name = "fetchSchoolsListByPaging", path = "fetchSchoolsListByPaging")
	public EntityPagingInfo fetchSchoolsListByPaging(
			@Named("instituteID") Long id, @Named("yearofExam") String yearofExam, EntityPagingInfo pagingInfo) {
		System.out.println("fetchSchoolsListByPaging yearOfExam***"+yearofExam);
		Query<PartnerSchoolEntity> filterInstituteQuery = ofy().load()
				.type(PartnerSchoolEntity.class).filter("instituteID", id)
				.filter("examDetailIndex in", yearofExam)
				.order("-autoGenerated");

		// logger.info("pagingInfo.getWebSafeCursorString:" +
		// pagingInfo.getWebSafeCursorString());

		if (pagingInfo.getWebSafeCursorString() != null)
			filterInstituteQuery = filterInstituteQuery.startAt(Cursor
					.fromWebSafeString(pagingInfo.getWebSafeCursorString()));

		QueryResultIterator<PartnerSchoolEntity> iterator = filterInstituteQuery
				.limit(pagingInfo.getLimit()).iterator();
		List<PartnerSchoolEntity> schoolList = new ArrayList<PartnerSchoolEntity>();

		while (iterator.hasNext()) {
			schoolList.add(iterator.next());
		}

		Cursor cursor = iterator.getCursor();
		pagingInfo.setEntityList(schoolList);
		pagingInfo.setWebSafeCursorString(cursor.toWebSafeString());
		pagingInfo.setTotalEntities(ofy().load()
				.type(PartnerSchoolEntity.class).filter("instituteID", id)
				.count());

		// logger.info("pagingInfo.getStartPage:" + pagingInfo.getStartPage());
		// logger.info("pagingInfo.getEntityList().size: "
		// + pagingInfo.getEntityList().size());
		// logger.info("pagingInfo.getTotalEntities: "
		// + pagingInfo.getTotalEntities());
		// logger.info("First Entity Reg. No: "
		// + schoolList.get(0).getAutoGenerated());
		// logger.info("Last Entity Reg. No: "
		// + schoolList.get(schoolList.size()-1).getAutoGenerated());

		return pagingInfo;
	}

	@ApiMethod(name = "getSchoolByPaymentMode", path = "getSchoolByPaymentMode")
	public List<PartnerSchoolEntity> getSchoolByPaymentMode(
			@Named("payReceivedBy") String payReceivedBy) {

		List<PartnerSchoolEntity> schoolList = ofy().load()
				.type(PartnerSchoolEntity.class).list();

		List<PartnerSchoolEntity> fileredSchoolList = new ArrayList<PartnerSchoolEntity>();

		for (PartnerSchoolEntity currentSchool : schoolList) {
			ExamDetail examDeatil = getExamDeatilByCurretnYear(currentSchool);
			if (examDeatil == null) {
				continue;
			}
			List<PaymentDetail> paymentDetailList = examDeatil
					.getPaymentDetail();
			if (paymentDetailList == null || paymentDetailList.size() == 0) {
				continue;
			}
			for (PaymentDetail paymentDetail : paymentDetailList) {
				if (paymentDetail.getPayReceivedBy() != null
						&& payReceivedBy.equalsIgnoreCase(paymentDetail
								.getPayReceivedBy().trim())) {
					if (!fileredSchoolList.contains(currentSchool))
						fileredSchoolList.add(currentSchool);
				}
			}
		}

		return fileredSchoolList;
	}

	@ApiMethod(name = "getPendingResultSchools", path = "getPendingResultSchools")
	public List<PartnerSchoolEntity> getPendingResultSchools() {

		List<PartnerSchoolEntity> schoolList = ofy().load()
				.type(PartnerSchoolEntity.class).list();
		List<PartnerSchoolEntity> pendingSchoolList = new ArrayList();
		/*
		 * List<GFExamResultEntity> examResultList = ofy().load()
		 * .type(GFExamResultEntity.class).list();
		 */
		List<GFExamResultEntity> examResultList = ofy().load()
				.type(GFExamResultEntity.class).project("school")
				.distinct(true).list();
		List<Long> resultSchoolIds = new ArrayList<Long>(examResultList.size());
		for (GFExamResultEntity result : examResultList) {
			resultSchoolIds.add(result.getSchool().getId());
		}

		for (PartnerSchoolEntity currentSchool : schoolList) {
			if (!resultSchoolIds.contains(currentSchool.getId())) {
				pendingSchoolList.add(currentSchool);
			}
		}
		return pendingSchoolList;
	}

	private boolean containSchool(List<GFExamResultEntity> resultList,
			PartnerSchoolEntity school) {
		for (GFExamResultEntity result : resultList) {
			if (school.getId() == result.getSchool().getId()) {
				return true;
			}
		}
		return false;

	}

	@ApiMethod(name = "getCurrentYearSchoolAndStudentCount", path = "getCurrentYearSchoolAndStudentCount")
	public SchoolAndStudentCount getCurrentYearSchoolAndStudentCount() {

		SchoolAndStudentCount schoolAndStudentCount = new SchoolAndStudentCount();
		MemcacheService memcacheService = MemcacheServiceFactory
				.getMemcacheService();
		logger.info("schoolAndStudentCountEntity.getKey():"
				+ schoolAndStudentCountEntity.getKey().toString());
		Object cacheObject = memcacheService.get(schoolAndStudentCountEntity
				.getKey());

		if (cacheObject != null && cacheObject instanceof SchoolAndStudentCount) {
			logger.info("Got schoolAndStudentCountEntity in Cache: "
					+ schoolAndStudentCountEntity);
			schoolAndStudentCount = (SchoolAndStudentCount) cacheObject;
		} else {
			logger.info("NOT found schoolAndStudentCountEntity in Cache. Need to get from Datastore... "
					+ schoolAndStudentCountEntity);
			DatastoreService datastore = DatastoreServiceFactory
					.getDatastoreService();

			try {
				schoolAndStudentCountEntity = datastore
						.get(schoolAndStudentCountEntity.getKey());
				schoolAndStudentCount
						.setSchoolCount((Long) schoolAndStudentCountEntity
								.getProperty("schoolCount"));
				schoolAndStudentCount
						.setCollegeCount((Long) schoolAndStudentCountEntity
								.getProperty("collegeCount"));
				schoolAndStudentCount
						.setSchoolStudentcount((Long) schoolAndStudentCountEntity
								.getProperty("schoolStudentcount"));
				schoolAndStudentCount
						.setCollegeStudentcount((Long) schoolAndStudentCountEntity
								.getProperty("collegeStudentcount"));
				schoolAndStudentCount.setLastModifiedDate(new Date(
						(Long) schoolAndStudentCountEntity
								.getProperty("lastModifiedDate")));
			} catch (EntityNotFoundException e) {
				e.printStackTrace();
			}
		}

		return schoolAndStudentCount;

	}

	@ApiMethod(name = "updateCurrentYearSchoolAndStudentCount", path = "updateCurrentYearSchoolAndStudentCount")
	public void updateCurrentYearSchoolAndStudentCount() {

		long schoolCount = 0;
		long collegeCount = 0;
		long schoolStudentcount = 0;
		long collegeStudentcount = 0;

		List<PartnerSchoolEntity> list = ofy().load()
				.type(PartnerSchoolEntity.class).list();
		// schoolCount = ofy().load().type(PartnerSchoolEntity.class).count();
		logger.info("list: " + list);
		logger.info("list.size(): " + (list == null ? "null" : list.size()));
		for (PartnerSchoolEntity schoolEntity : list) {
			long studNumbers = 0;
			try {
				ExamDetail examDeatilByCurretnYear = getExamDeatilByCurretnYear(schoolEntity);
				if (examDeatilByCurretnYear != null
						&& !examDeatilByCurretnYear.getTotal().isEmpty()) {
					try {
						studNumbers = Long.parseLong(examDeatilByCurretnYear
								.getTotal());
						// next year use below commented code to get correct
						// count.
						// studNumbers =
						// calculateTotalStudents(examDeatilByCurretnYear);
					} catch (Exception ex) {
						logger.warning("updateCurrentYearSchoolAndStudentCount: "
								+ ex.getMessage());
					}
				}

				if (schoolEntity.getCategory()
						.equals("School & Junior College")) {
					schoolCount++;
					schoolStudentcount += studNumbers;
				} else {
					collegeCount++;
					collegeStudentcount += studNumbers;
				}
			} catch (Exception ex) {
				logger.warning("ex: " + ex.getMessage());
				continue;
			}
		}
		logger.info("schoolCount: " + schoolCount);
		logger.info("schoolStudentcount: " + schoolStudentcount);

		SchoolAndStudentCount schoolAndStudentCount = new SchoolAndStudentCount();

		schoolAndStudentCount.setSchoolCount(schoolCount);
		schoolAndStudentCount.setSchoolStudentcount(schoolStudentcount);
		schoolAndStudentCount.setCollegeCount(collegeCount);
		schoolAndStudentCount.setCollegeStudentcount(collegeStudentcount);
		schoolAndStudentCount.setLastModifiedDate(new Date());

		MemcacheService memcacheService = MemcacheServiceFactory
				.getMemcacheService();
		DatastoreService datastore = DatastoreServiceFactory
				.getDatastoreService();

		schoolAndStudentCountEntity.setProperty("schoolCount", schoolCount);
		schoolAndStudentCountEntity.setProperty("collegeCount", collegeCount);
		schoolAndStudentCountEntity.setProperty("schoolStudentcount",
				schoolStudentcount);
		schoolAndStudentCountEntity.setProperty("collegeStudentcount",
				collegeStudentcount);
		schoolAndStudentCountEntity.setProperty("lastModifiedDate",
				schoolAndStudentCount.getLastModifiedDate().getTime());

		memcacheService.put(schoolAndStudentCountEntity.getKey(),
				schoolAndStudentCount);
		datastore.put(schoolAndStudentCountEntity);
	}

	private int calculateTotalStudents(ExamDetail examDeatilByCurretnYear) {
		List<BookDetail> bookDetailList = examDeatilByCurretnYear
				.getBookSummary().getBookDetail();
		int total = 0;
		for (BookDetail bookDetail : bookDetailList) {
			System.out.println("bookDetail.getTotalStud():"
					+ bookDetail.getTotalStud());
			total += bookDetail.getTotalStud();
		}
		return total;
	}

	static class SchoolAndStudentCount implements Serializable {
		private static final long serialVersionUID = 1L;
		long schoolCount;
		long collegeCount;
		long schoolStudentcount;
		long collegeStudentcount;

		private Date lastModifiedDate = new Date(System.currentTimeMillis()
				- (long) 365 * 24 * 60 * 60 * 1000);

		public SchoolAndStudentCount() {

		}

		public SchoolAndStudentCount(long schoolCount, long collegeCount,
				long schoolStudentcount, long collegeStudentcount,
				long lastModifiedDate) {
			this.schoolCount = schoolCount;
			this.collegeCount = collegeCount;
			this.schoolStudentcount = schoolStudentcount;
			this.collegeStudentcount = collegeStudentcount;
			this.lastModifiedDate = new Date(lastModifiedDate);
		}

		public long getSchoolCount() {
			return schoolCount;
		}

		public void setSchoolCount(long schoolCount) {
			this.schoolCount = schoolCount;
		}

		public long getCollegeCount() {
			return collegeCount;
		}

		public void setCollegeCount(long collegeCount) {
			this.collegeCount = collegeCount;
		}

		public long getSchoolStudentcount() {
			return schoolStudentcount;
		}

		public void setSchoolStudentcount(long schoolStudentcount) {
			this.schoolStudentcount = schoolStudentcount;
		}

		public long getCollegeStudentcount() {
			return collegeStudentcount;
		}

		public void setCollegeStudentcount(long collegeStudentcount) {
			this.collegeStudentcount = collegeStudentcount;
		}

		public Date getLastModifiedDate() {
			return lastModifiedDate;
		}

		public void setLastModifiedDate(Date lastModifiedDate) {
			this.lastModifiedDate = lastModifiedDate;
		}

	}

	static class PaymentModeWiseData implements Serializable {
		private static final long serialVersionUID = 1L;
		public String paymentMode;
		public Long noOfPayments = 0L;
		public Float amount = 0F;

		public PaymentModeWiseData(String paymentMode) {
			this.paymentMode = paymentMode;
		}
	}

	static class LogisticsWiseData implements Serializable {
		private static final long serialVersionUID = 1L;
		public String logistic;
		public Long noOfParcels = 0L;
		public Float charges = 0F;

		public LogisticsWiseData(String logistic) {
			this.logistic = logistic;
		}
	}

	static class FinSummayReportData implements Serializable {
		private static final long serialVersionUID = 1L;
		public List<PaymentModeWiseData> paymentModesData = new ArrayList<PaymentModeWiseData>();
		public List<LogisticsWiseData> logisticsWiseData = new ArrayList<LogisticsWiseData>();

		public Float amountPaymentsTotal = 0F;
		public Float chargesCourierTotal = 0F;
	}

	@ApiMethod(name = "getFinSummayReportData", path = "getFinSummayReportData")
	public FinSummayReportData getFinSummayReportData(
			@Named("instituteID") Long id) {

		MemcacheService memcacheService = MemcacheServiceFactory
				.getMemcacheService();
		String memecacheKey = "FinSummayReportData-" + currentYear;

		Object foundCacheObject = memcacheService.get(memecacheKey);
		if (foundCacheObject != null) {
			if (foundCacheObject instanceof FinSummayReportData) {
				logger.info("getFinSummayReportData-finSummayReportData Found in Cache, returning it."
						+ foundCacheObject);
				return (FinSummayReportData) foundCacheObject;
			} else {
				logger.info("getFinSummayReportData-finSummayReportData Found in Cache is WRONG type");
			}
		}

		logger.info("getFinSummayReportData-finSummayReportData NOT Found in Cache:"
				+ foundCacheObject);
		FinSummayReportData finSummayReportData = new FinSummayReportData();
		String[] paymentModes = { "Cash", "D.D", "NEFT/RTGS", "Other" };
		String[] logisticsList = { "By Post", "By Hand", "ST Postal",
				"Tej Courier", "Other" };
		for (String string : paymentModes) {
			finSummayReportData.paymentModesData.add(new PaymentModeWiseData(
					string));
		}

		for (String string : logisticsList) {
			finSummayReportData.logisticsWiseData.add(new LogisticsWiseData(
					string));
		}

		updatePaymentModesData(finSummayReportData);
		updateLogisticsData(finSummayReportData);
		Expiration expirationTenMins = Expiration.byDeltaSeconds(60 * 60);
		// put in memcache.
		memcacheService.put(memecacheKey, finSummayReportData,
				expirationTenMins);

		return finSummayReportData;
	}

	private void updateLogisticsData(FinSummayReportData finSummayReportData) {
		List<GFCourierEntity> courierList = ofy().load()
				.type(GFCourierEntity.class).list();

		for (GFCourierEntity courierEntity : courierList) {
			/*
			 * if (courierEntity.getCourierDocketID() == null ||
			 * courierEntity.getCourierDocketID().isEmpty()) { continue; }
			 */
			for (LogisticsWiseData logisticsReportObj : finSummayReportData.logisticsWiseData) {
				if (courierEntity.getLogistics() != null
						&& logisticsReportObj.logistic
								.equalsIgnoreCase(courierEntity.getLogistics()
										.trim())) {
					logisticsReportObj.noOfParcels++;
					logisticsReportObj.charges += courierEntity
							.getCourierCost();
					finSummayReportData.chargesCourierTotal += courierEntity
							.getCourierCost();
					continue;
				}
			}
		}
	}

	private void updatePaymentModesData(FinSummayReportData finSummayReportData) {
		for (PaymentModeWiseData paymentModeReportObj : finSummayReportData.paymentModesData) {
			List<PartnerSchoolEntity> schoolList = getSchoolByPaymentMode(paymentModeReportObj.paymentMode
					.trim());
			for (PartnerSchoolEntity partnerSchoolEntity : schoolList) {
				ExamDetail examDeatil = getExamDeatilByCurretnYear(partnerSchoolEntity);
				if (examDeatil == null) {
					continue;
				}
				List<PaymentDetail> paymentDetailList = examDeatil
						.getPaymentDetail();
				if (paymentDetailList == null || paymentDetailList.size() == 0) {
					continue;
				}
				for (PaymentDetail paymentDetail : paymentDetailList) {
					if (paymentDetail.getPayReceivedBy() != null
							&& paymentModeReportObj.paymentMode
									.equalsIgnoreCase(paymentDetail
											.getPayReceivedBy().trim())) {
						paymentModeReportObj.amount += paymentDetail
								.getPayAmount();
						finSummayReportData.amountPaymentsTotal += paymentDetail
								.getPayAmount();
					}
				}
				paymentModeReportObj.noOfPayments++;
			}
		}
	}
}// end of class

