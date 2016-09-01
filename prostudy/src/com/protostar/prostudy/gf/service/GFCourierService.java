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
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Ref;
import com.protostar.prostudy.gf.entity.ExamDetail;
import com.protostar.prostudy.gf.entity.GFBookEntity;
import com.protostar.prostudy.gf.entity.GFBookStockEntity;
import com.protostar.prostudy.gf.entity.GFBookTransactionEntity;
import com.protostar.prostudy.gf.entity.GFCourierEntity;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;

@Api(name = "gfCourierService", version = "v0.1", namespace = @ApiNamespace(ownerDomain = "com.protostar.prostudy.gf.service", ownerName = "com.protostar.prostudy.gf.service", packagePath = ""))
public class GFCourierService {

	@ApiMethod(name = "addGFCourier")
	public void addGFCourier(GFCourierEntity gfCourierEntity)
			throws MessagingException, IOException {	

		if (gfCourierEntity.getBookLineItemList().size() < 1) {
			GFBookTransactionEntity gfBookTransactionEntity = new GFBookTransactionEntity();
			gfBookTransactionEntity.setTransactionType("Dr");
			ofy().save().entity(gfBookTransactionEntity).now();
		} else {
			for (int i = 0; i < gfCourierEntity.getBookLineItemList().size(); i++) {
				GFBookTransactionEntity gfBookTransactionEntity = new GFBookTransactionEntity();
				GFBookEntity book = gfCourierEntity.getBookLineItemList()
						.get(i);

				gfBookTransactionEntity.setBook(book);
				gfBookTransactionEntity.setBookQty(book.getBookQty());
				gfBookTransactionEntity.setInstituteID(gfCourierEntity
						.getInstituteID());
				gfBookTransactionEntity.setTransactionDate(gfCourierEntity
						.getCourierDispatchDate());
				gfBookTransactionEntity.setTotalFees(book.getBookQty()
						* book.getBookPrice());
				gfBookTransactionEntity.setTransactionType("Dr");

				ofy().save().entity(gfBookTransactionEntity).now();
			}
		}

		// For Deduct the book Stock

		for (int i = 0; i < gfCourierEntity.getBookLineItemList().size(); i++) {

			long bID = gfCourierEntity.getBookLineItemList().get(i).getId();
			String bookmedium = gfCourierEntity.getBookLineItemList().get(i)
					.getBookMedium();

			GFBookEntity getBook = ofy().load().type(GFBookEntity.class)
					.id(bID).now();

			int bkQty = getBook.getBookQty()
					- gfCourierEntity.getBookLineItemList().get(i).getBookQty();
			getBook.setBookQty(bkQty);
			ofy().save().entity(getBook).now();

			GFBookStockEntity filteredbook = ofy()
					.load()
					.type(GFBookStockEntity.class)
					.filter("book",
							Ref.create(Key.create(GFBookEntity.class, bID)))
					.first().now();

			int bkQty1 = filteredbook.getBookQty()
					- gfCourierEntity.getBookLineItemList().get(i).getBookQty();
			filteredbook.setBookQty(bkQty1);
			ofy().save().entity(filteredbook).now();

		}
		PartnerSchoolService partnerSchoolService = new PartnerSchoolService();
		
		PartnerSchoolEntity partnerSchoolEntity = partnerSchoolService.getPSchoolByPSID(gfCourierEntity
				.getSchoolName().getId());

		ExamDetail examDeatil = PartnerSchoolService
				.getExamDeatilByCurretnYear(partnerSchoolEntity);
		if (PartnerSchoolService.notificationEnabled && examDeatil != null
				&& examDeatil.getNotificationData().getCurrierSmsSent() == 0
				&& gfCourierEntity.getCourierName() != null
				&& !gfCourierEntity.getCourierName().isEmpty()
				&& gfCourierEntity.getCourierDocketID() != null) {
			// Send email
			/*
			 * new EmailHandler()
			 * .sendNewSchoolRegistrationEmail(partnerSchoolEntity);
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
			//examDeatil.getNotificationData().setRegistrationEmailSent(1);
			examDeatil.getNotificationData().setCurrierSmsSent(1);
			ofy().save().entity(partnerSchoolEntity).now();
		}
		
		ofy().save().entity(gfCourierEntity).now();
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
