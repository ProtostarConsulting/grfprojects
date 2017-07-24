package com.protostar.prostudy.gf.entity;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.google.common.io.BaseEncoding;
import com.protostar.prostudy.gf.service.DownloadGFBooks;
import com.protostar.prostudy.gf.service.GFBookStockService;
import com.protostar.prostudy.until.BaseEmailTask;
import com.protostar.prostudy.until.data.Constants;
import com.sendgrid.Attachments;
import com.sendgrid.Mail;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;

public class EmailStockReorderTask extends BaseEmailTask {
	
	private long bizId;

	public EmailStockReorderTask(Long bizID, String emailSubject, String messageBody) {
		super(bizID, emailSubject, messageBody);
		this.bizId = bizID;
	}

	private static final long serialVersionUID = 3014834910424140708L;
	
	@Override
	public void run() {

		if (this.isSkipEmail())
			return;

		try {
			SendGrid sg = new SendGrid(this.getSendGridAPIKey());
			sg.addRequestHeader("X-Mock", "true");

			Request request = new Request();
			request.method = Method.POST;
			request.endpoint = "mail/send";
			request.body = updateEmail(super.buildEmail()).build();
			Response response = sg.api(request);
			System.out.println(response.statusCode);
			System.out.println(response.body);
			System.out.println(response.headers);

		} catch (IOException ex) {
			ex.printStackTrace();
		} catch (RuntimeException e) {
			e.printStackTrace();
		}
	}

	public Mail updateEmail(Mail mail) throws IOException {

		GFBookStockService stockManagementService = new GFBookStockService();
		List<GFBookEntity> stockItemsBelowReorder = stockManagementService.getReportByThreshold(this.bizId);

		DownloadGFBooks downloadStockThreshold = new DownloadGFBooks();
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(Constants.DOCUMENT_DEFAULT_MAX_SIZE);
		downloadStockThreshold.generateCSV(stockItemsBelowReorder, outputStream);
		String base64Content = BaseEncoding.base64().encode(outputStream.toByteArray());

		String date_format = "MMM/dd/yyyy";
		SimpleDateFormat sdf = new SimpleDateFormat(date_format);

		Attachments attachments = new Attachments();
		attachments.setContent(base64Content);
		attachments.setType("text/csv");
		attachments.setFilename(sdf.format(new Date()) + "" + " " + "Bookstock Items Reorder Report" + ".csv");
		attachments.setDisposition("attachment");
		mail.addAttachments(attachments);
		return mail;
	}

}
