package com.protostar.prostudy.until;

import java.io.IOException;

import com.google.appengine.api.taskqueue.DeferredTask;
import com.protostar.prostudy.entity.InstituteEntity;
import com.protostar.prostudy.service.InstituteService;
import com.protostar.prostudy.until.data.Constants;
import com.sendgrid.Content;
import com.sendgrid.Email;
import com.sendgrid.Mail;
import com.sendgrid.Method;
import com.sendgrid.Personalization;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;

public class BaseEmailTask implements DeferredTask {
	
	private static final long serialVersionUID = 1L;

	private boolean skipEmail = false;
	private String emailSubject;
	private String messageBody;
	private String emailDLList;
	private String sendGridAPIKey;
	
	public BaseEmailTask(Long bizID, String emailSubject, String messageBody) {

		InstituteService instituteService = new InstituteService();
		InstituteEntity instituteEntity = instituteService.getInstituteById(bizID);
		if (instituteEntity == null || !instituteEntity.getSettings().getEmailNotificationFlag()) {
			this.skipEmail= true;
			return;
		}
		String sendgrid_API_KEY = instituteEntity.getSendGridApiKey();
		if (sendgrid_API_KEY == null || sendgrid_API_KEY.isEmpty()) {
			this.skipEmail= true;
			return;
		}

		this.sendGridAPIKey = sendgrid_API_KEY;
		this.emailSubject = emailSubject;
		this.messageBody = messageBody;
		this.emailDLList = instituteEntity.getSettings().getEmailNotificationDL();
	}
	

	@Override
	public void run() {
		// TODO Auto-generated method stub
		try {
			SendGrid sg = new SendGrid(this.sendGridAPIKey);
			sg.addRequestHeader("X-Mock", "true");

			Request request = new Request();
			request.method = Method.POST;
			request.endpoint = "mail/send";
			request.body = buildEmail().build();
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
	
	public String getMessageBody() {
		return messageBody;
	}

	public void setMessageBody(String messageBody) {
		this.messageBody = messageBody;
	}

	public String getEmailSubject() {
		return emailSubject;
	}

	public void setEmailSubject(String emailSubject) {
		this.emailSubject = emailSubject;
	}
	
	public Mail buildEmail() {
		// See buildKitchenSinkExample() method in EmailHandler for detailed
		// usage.
		Mail mail = new Mail();

		Email fromEmail = new Email();
		fromEmail.setName(Constants.PROTOSTAR_FROM_EMAIL_NAME);
		fromEmail.setEmail(Constants.PROTOSTAR_FROM_EMAIL_ID);
		mail.setFrom(fromEmail);

		Personalization personalization = new Personalization();

		if (this.emailDLList != null && !this.emailDLList.isEmpty()) {
			String[] emailIds = this.emailDLList.split(",");
			for (String emailId : emailIds) {
				// Can't have same email id in to, cc or bcc
				String trimedTo = emailId.trim();
				if (this.emailDLList.equalsIgnoreCase(trimedTo))
					continue;

				Email selfTo = new Email();
				selfTo.setEmail(trimedTo);
				personalization.addTo(selfTo);
			}
		}
		
		personalization.setSubject(this.emailSubject);
		personalization.addHeader("X-Test", "test");
		personalization.addHeader("X-Mock", "true");

		mail.addPersonalization(personalization);

		Content content = new Content();
		content.setType("text/html");
		content.setValue(this.messageBody);
		mail.addContent(content);
		
		return mail;
	}

	public String getSendGridAPIKey() {
		return sendGridAPIKey;
	}

	public void setSendGridAPIKey(String sendGridAPIKey) {
		this.sendGridAPIKey = sendGridAPIKey;
	}

	public boolean isSkipEmail() {
		return skipEmail;
	}

	public void setSkipEmail(boolean skipEmail) {
		this.skipEmail = skipEmail;
	}

}