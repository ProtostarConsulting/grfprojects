package com.protostar.prostudy.gf.service;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;
import java.text.SimpleDateFormat;
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
import com.google.appengine.api.datastore.QueryResultIterator;
import com.google.common.base.CaseFormat;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;
import com.googlecode.objectify.cmd.QueryKeys;
import com.protostar.prostudy.gf.entity.ExamDetail;
import com.protostar.prostudy.gf.entity.GFBookEntity;
import com.protostar.prostudy.gf.entity.GFBookTransactionEntity;
import com.protostar.prostudy.gf.entity.GFCourierEntity;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;
import com.protostar.prostudy.until.data.EntityPagingInfo;

@Api(name = "gfCourierService", version = "v0.1", namespace = @ApiNamespace(ownerDomain = "com.protostar.prostudy.gf.service", ownerName = "com.protostar.prostudy.gf.service", packagePath = ""))
public class GFCourierService {

	private final Logger logger = Logger.getLogger(GFCourierService.class
			.getName());

	@ApiMethod(name = "addGFCourier")
	public GFCourierEntity addGFCourier(final GFCourierEntity gfCourierEntity)
			throws MessagingException, IOException {

		/*
		 * GFCourierEntity gfCourierEntityUpated =
		 * ofy().execute(TxnType.REQUIRED, new Work<GFCourierEntity>() { public
		 * GFCourierEntity run() {
		 */
		if (gfCourierEntity.getBookLineItemList() != null
				&& gfCourierEntity.getBookLineItemList().size() > 0) {
			for (int i = 0; i < gfCourierEntity.getBookLineItemList().size(); i++) {
				long bID = gfCourierEntity.getBookLineItemList().get(i).getId();
				GFBookEntity book = ofy().load().type(GFBookEntity.class)
						.id(bID).now();
				int afterBkQty = book.getBookQty()
						- gfCourierEntity.getBookLineItemList().get(i)
								.getBookQty();

				GFBookTransactionEntity gfBookTransactionEntity = new GFBookTransactionEntity();

				gfBookTransactionEntity.setBook(book);
				gfBookTransactionEntity.setBookQty(gfCourierEntity
						.getBookLineItemList().get(i).getBookQty());
				gfBookTransactionEntity.setInstituteID(gfCourierEntity
						.getInstituteID());
				gfBookTransactionEntity.setTransactionDate(gfCourierEntity
						.getCourierDispatchDate());
				gfBookTransactionEntity.setTotalFees(book.getBookQty()
						* book.getBookPrice());
				gfBookTransactionEntity.setTransactionType("Dr");

				SimpleDateFormat sd = new SimpleDateFormat("dd MMM");
				StringBuffer notes = new StringBuffer();
				notes.append("For school: "
						+ gfCourierEntity.getSchoolName().getSchoolName());
				notes.append(", Sent as part of courier dated: "
						+ sd.format(gfCourierEntity.getCourierDispatchDate()));
				notes.append(", Docket ID: "
						+ gfCourierEntity.getCourierDocketID());
				notes.append(", Tx Qty: "
						+ gfCourierEntity.getBookLineItemList().get(i)
								.getBookQty());
				notes.append(", Previous Book Qty: " + book.getBookQty());
				notes.append(", After Book Qty: " + afterBkQty);

				gfBookTransactionEntity.setNote(notes.toString());

				ofy().save().entity(gfBookTransactionEntity).now();
				book.setBookQty(afterBkQty);
				ofy().save().entity(book).now();
			}
		}

		PartnerSchoolService partnerSchoolService = new PartnerSchoolService();

		PartnerSchoolEntity partnerSchoolEntity = partnerSchoolService
				.getPSchoolByPSID(gfCourierEntity.getSchoolName().getId());

		ExamDetail examDeatil = PartnerSchoolService
				.getExamDeatilByCurretnYear(partnerSchoolEntity);
		if (PartnerSchoolService.notificationEnabled && examDeatil != null
				&& examDeatil.getNotificationData().getCurrierSmsSent() == 0
				&& gfCourierEntity.getCourierName() != null
				&& !gfCourierEntity.getCourierName().isEmpty()
				&& gfCourierEntity.getCourierDocketID() != null) {
			// Send email
			/*
			 * new EmailHandler() .sendNewSchoolRegistrationEmail
			 * (partnerSchoolEntity);
			 */
			// Send SMS
			SimpleDateFormat sd = new SimpleDateFormat("MMM dd");
			String dateStr = sd
					.format(gfCourierEntity.getCourierDispatchDate());

			String smsMsg = "Gandhi Exam books & Question paper parcel dispatched on "
					+ dateStr
					+ "; by "
					+ gfCourierEntity.getCourierName()
					+ " thru LR No "
					+ gfCourierEntity.getCourierDocketID()
					+ "); Please collect and acknowledge it.";

			String cordinatorMobileNumber = (partnerSchoolEntity
					.getContactDetail().getCoordinatorDetail() != null && partnerSchoolEntity
					.getContactDetail().getCoordinatorDetail().size() > 0) ? partnerSchoolEntity
					.getContactDetail().getCoordinatorDetail().get(0)
					.getCoordinatorMobileNum()
					: null;
			TextLocalSMSHandler.sendSms(smsMsg, cordinatorMobileNumber);
			// examDeatil.getNotificationData().setRegistrationEmailSent(1);
			examDeatil.getNotificationData().setCurrierSmsSent(1);
			ofy().save().entity(partnerSchoolEntity).now();
		}

		ofy().save().entity(gfCourierEntity).now();
		return gfCourierEntity;
		/*
		 * } });
		 * 
		 * return gfCourierEntityUpated;
		 */
	}

	@ApiMethod(name = "getGFCourierByInstitute", path = "getGFCourierByInstitute")
	public List<GFCourierEntity> getGFCourierByInstitute(
			@Named("instituteID") long instituteID) {
		List<GFCourierEntity> list = ofy().load().type(GFCourierEntity.class)
				.order("autoGenerated").list();
		return list;
	}

	@ApiMethod(name = "fetchCourierListByPaging", path = "fetchCourierListByPaging")
	public EntityPagingInfo fetchCourierListByPaging(
			@Named("instituteID") Long instituteID, EntityPagingInfo pagingInfo) {

		logger.info("instituteID:" + instituteID);
		logger.info("pagingInfo.getWebSafeCursorString():"
				+ pagingInfo.getWebSafeCursorString());

		Query<GFCourierEntity> filterInstituteQuery = ofy().load()
				.type(GFCourierEntity.class).filter("instituteID", instituteID)
				.order("-autoGenerated");

		if (pagingInfo.getWebSafeCursorString() != null)
			filterInstituteQuery = filterInstituteQuery.startAt(Cursor
					.fromWebSafeString(pagingInfo.getWebSafeCursorString()));

		QueryResultIterator<GFCourierEntity> iterator = filterInstituteQuery
				.limit(pagingInfo.getLimit()).iterator();
		List<GFCourierEntity> courierList = new ArrayList<GFCourierEntity>();

		while (iterator.hasNext()) {
			courierList.add(iterator.next());
		}

		Cursor cursor = iterator.getCursor();
		pagingInfo.setEntityList(courierList);
		pagingInfo.setWebSafeCursorString(cursor.toWebSafeString());
		pagingInfo.setTotalEntities(ofy().load().type(GFCourierEntity.class)
				.filter("instituteID", instituteID).count());

		/*logger.info("pagingInfo.getStartPage:" + pagingInfo.getStartPage());
		logger.info("pagingInfo.getLimit():" + pagingInfo.getLimit());
		logger.info("pagingInfo.getEntityList().size: "
				+ pagingInfo.getEntityList().size());
		logger.info("pagingInfo.getTotalEntities: "
				+ pagingInfo.getTotalEntities());*/
		/*
		 * logger.info("First Entity Reg. No: " +
		 * courierList.get(0).getAutoGenerated());
		 * logger.info("Last Entity Reg. No: " +
		 * courierList.get(courierList.size()-1).getAutoGenerated());
		 */

		return pagingInfo;
	}

	@ApiMethod(name = "touchAllEntities", path = "touchAllEntities")
	public void touchAllEntities() {
		List<GFCourierEntity> courierList = ofy().load()
				.type(GFCourierEntity.class).list();
		for (GFCourierEntity entity : courierList) {
			entity.setModifiedDate(new Date());
		}
		ofy().save().entities(courierList).now();
	}

	@ApiMethod(name = "getGFCourierById", path = "getGFCourierById")
	public GFCourierEntity getGFCourierById(@Named("id") long id) {
		GFCourierEntity stud = ofy().load().type(GFCourierEntity.class).id(id)
				.now();
		return stud;
	}

	@ApiMethod(name = "getCourierByGRFNo", path = "getCourierByGRFNo")
	public Collection<GFCourierEntity> getCourierByGRFNo(
			@Named("autoGenerated") String autoGenerated) {

		List<Key<PartnerSchoolEntity>> schoolKeyList = new ArrayList<Key<PartnerSchoolEntity>>();

		
		List<Key<PartnerSchoolEntity>> schoolKeyList1 = ofy().load()
				.type(PartnerSchoolEntity.class)
				.filter("autoGenerated", autoGenerated).keys().list();
		
		String formNumber = autoGenerated.split("-")[2];
		List<Key<PartnerSchoolEntity>> schoolKeyList2 = ofy().load()
				.type(PartnerSchoolEntity.class)
				.filter("formNumber", formNumber).keys().list();

		if (schoolKeyList1 != null)
			schoolKeyList.addAll(schoolKeyList1);
		if (schoolKeyList2 != null)
			schoolKeyList.addAll(schoolKeyList2);

		return ofy().load().type(GFCourierEntity.class)
				.filter("schoolName in", schoolKeyList).list();
	}

	@ApiMethod(name = "searchCourierBySchoolName", path = "searchCourierBySchoolName")
	public List<GFCourierEntity> searchCourierBySchoolName(
			@Named("schoolNameSearchStr") String schoolNameSearchStr) {
		String[] splitArray = schoolNameSearchStr.trim().split(" ");
		List<String> strList = new ArrayList<String>(Arrays.asList(splitArray));
		for (String stringToken : splitArray) {
			strList.add(stringToken.toLowerCase());
			strList.add(stringToken.toUpperCase());
			strList.add(CaseFormat.LOWER_CAMEL.to(CaseFormat.UPPER_CAMEL,
					stringToken.toLowerCase()));
		}

		List<Key<PartnerSchoolEntity>> schoolKeyList = ofy().load()
				.type(PartnerSchoolEntity.class)
				.filter("schoolNameIndex in", strList).keys().list();

		return ofy().load().type(GFCourierEntity.class)
				.filter("schoolName in", schoolKeyList).list();
	}

	@ApiMethod(name = "getPendingPastDate", path = "getPendingPastDate")
	public List<GFCourierEntity> getPendingPastDate(
			@Named("sinceDate") Long sinceDate) {
		Date date = new Date(sinceDate);
		logger.info("date:" + date);
		List<GFCourierEntity> list = ofy().load().type(GFCourierEntity.class)
				.filter("courierDocketID", null)
				.filter("courierDispatchDate <", date).list();
		return list;
	}

	@ApiMethod(name = "getCourierByCourierType", path = "getCourierByCourierType")
	public List<GFCourierEntity> getCourierByCourierType(
			@Named("courierType") String courierType) {
		logger.info("courierType:" + courierType);
		List<GFCourierEntity> list = ofy().load().type(GFCourierEntity.class)
				.filter("courierType", courierType.trim()).list();
		return list;
	}

	@ApiMethod(name = "getCourierByLogisticsType", path = "getCourierByLogisticsType")
	public List<GFCourierEntity> getCourierByLogisticsType(
			@Named("logisticsType") String logisticsType) {
		logger.info("logisticsType:" + logisticsType);
		List<GFCourierEntity> list = ofy().load().type(GFCourierEntity.class)
				.filter("logistics", logisticsType.trim()).list();
		return list;
	}
}
