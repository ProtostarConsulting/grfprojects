package com.protostar.prostudy.gf.service;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;

import javax.mail.MessagingException;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.protostar.prostudy.gf.entity.ExamDetail;
import com.protostar.prostudy.gf.entity.GFBookEntity;
import com.protostar.prostudy.gf.entity.GFBookTransactionEntity;
import com.protostar.prostudy.gf.entity.GFCourierEntity;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;

@Api(name = "gfCourierService", version = "v0.1", namespace = @ApiNamespace(ownerDomain = "com.protostar.prostudy.gf.service", ownerName = "com.protostar.prostudy.gf.service", packagePath = ""))
public class GFCourierService {

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
				gfBookTransactionEntity.setBookQty(gfCourierEntity.getBookLineItemList().get(i)
						.getBookQty());
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
				.list();

		return list;

	}

	@ApiMethod(name = "getGFCourierById", path = "getGFCourierById")
	public GFCourierEntity getGFCourierById(@Named("id") long studID) {

		GFCourierEntity stud = ofy().load().type(GFCourierEntity.class)
				.id(studID).now();

		return stud;

	}

	@ApiMethod(name = "getCourierByGRFNo", path = "getCourierByGRFNo")
	public GFCourierEntity getCourierByGRFNo(
			@Named("autoGenerated") String autoGenerated) {

		GFCourierEntity courier = ofy().load().type(GFCourierEntity.class)
				.filter("autoGenerated", autoGenerated).first().now();

		return courier;

	}

}
