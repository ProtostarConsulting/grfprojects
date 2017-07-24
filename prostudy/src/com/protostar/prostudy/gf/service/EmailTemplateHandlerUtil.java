package com.protostar.prostudy.gf.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import com.protostar.prostudy.entity.Address;
import com.protostar.prostudy.entity.InstituteEntity;
import com.protostar.prostudy.entity.UserEntity;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;
import com.protostar.prostudy.until.data.UtilityService;

import freemarker.core.ParseException;
import freemarker.template.Configuration;
import freemarker.template.MalformedTemplateNameException;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
import freemarker.template.TemplateNotFoundException;

//import static org.apache.commons.lang.StringEscapeUtils.escapeHtml;

public class EmailTemplateHandlerUtil {

	static Configuration cfg = null;

	public Configuration getConfiguration() {
		if (cfg != null) {
			return cfg;
		}

		Configuration cfg = new Configuration(Configuration.VERSION_2_3_22);

		// cfg.setDirectoryForTemplateLoading(new
		// File("/WEB-INF/email_templates"));
		cfg.setClassForTemplateLoading(this.getClass(), "/");

		cfg.setDefaultEncoding("UTF-8");
		cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
		cfg.setLogTemplateExceptions(false);
		return cfg;

	}
	
	private void addFooterParams(InstituteEntity documentEntity, Map<String, Object> root) {
		
		root.put("instituteName", documentEntity.getName());
		Address address = documentEntity.getAddress();
		root.put("instituteAdressLine1", address.getLine1());
		String line2 = address.getLine2();
		String pin = address.getPin();
		String country = address.getCountry();
		if (line2 == null || line2.trim().isEmpty()) {
			line2 = null;
		}
		if (pin == null || pin.trim().isEmpty()) {
			pin = null;
		}
		if (country == null || country.trim().isEmpty()) {
			country = null;
		}
		root.put("businessAdressLine2", line2);
		root.put("businessAdressCity", address.getCity());
		root.put("businessAdressPin", pin);
		root.put("businessAdressState", address.getState());
		root.put("businessAdressCountry", country);

		String currentAppURL = UtilityService.getCurrentAppURL();
		root.put("currentAppURL", currentAppURL);
	}

	public String createNewUserHtmlTemplate(UserEntity user) {
		try {

			Map<String, Object> root = new HashMap<String, Object>();
			root.put("firstName", user.getFirstName());
			root.put("siteUrl", "https://4-dot-prostudy-1051.appspot.com");
			root.put("user", user);

			Template temp = getConfiguration().getTemplate(
					"email_templates/new_user_registration.ftlh");

			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(
					500);
			Writer out = new PrintWriter(byteArrayOutputStream);
			temp.process(root, out);
			// return escapeHtml(byteArrayOutputStream.toString());
			return byteArrayOutputStream.toString();

		} catch (TemplateNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (MalformedTemplateNameException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (TemplateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return "";
	}
	
	public String registerSchoolForExamTemplate(PartnerSchoolEntity school) {
		try {

			Map<String, Object> root = new HashMap<String, Object>();
			root.put("firstName", school.getContactDetail().getHeadMasterName());
			root.put("totalStudents", school.getExamDetailList()==null?0:school.getExamDetailList().get(0).getTotal());
			root.put("totalBoys", school.getExamDetailList()==null?0:school.getExamDetailList().get(0).getMale());
			root.put("totalGirls", school.getExamDetailList()==null?0:school.getExamDetailList().get(0).getFemale());

			Template temp = getConfiguration().getTemplate(
					"email_templates/exam_school_registration.ftlh");

			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(
					5000);
			Writer out = new PrintWriter(byteArrayOutputStream);
			temp.process(root, out);
			// return escapeHtml(byteArrayOutputStream.toString());
			return byteArrayOutputStream.toString();

		} catch (TemplateNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (MalformedTemplateNameException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (TemplateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return "";
	}
	
	public String stockReorderEmailMsgBody(InstituteEntity instituteEntity) {

		try {

			Map<String, Object> root = new HashMap<String, Object>();

			addFooterParams(instituteEntity, root);
			Template temp = getConfiguration().getTemplate("email_templates/stock_reorder_tmpl.ftlh");

			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(500);
			Writer out = new PrintWriter(byteArrayOutputStream);
			temp.process(root, out);
			return byteArrayOutputStream.toString();

		} catch (TemplateNotFoundException e) {
			e.printStackTrace();
		} catch (MalformedTemplateNameException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TemplateException e) {
			e.printStackTrace();
		}

		return "";
	}
}
