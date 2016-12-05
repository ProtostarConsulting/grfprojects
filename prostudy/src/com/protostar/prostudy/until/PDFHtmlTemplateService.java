package com.protostar.prostudy.until;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.io.StringReader;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletOutputStream;

import com.itextpdf.text.Document;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.protostar.prostudy.gf.entity.GFStudentEntity;
import com.protostar.prostudy.until.data.DateUtil;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateExceptionHandler;

public class PDFHtmlTemplateService {

	static Configuration cfg = null;

	public Configuration getConfiguration() {

		if (cfg != null) {
			return cfg;
		}

		Configuration cfg = new Configuration(Configuration.VERSION_2_3_22);

		cfg.setClassForTemplateLoading(this.getClass(), "/");

		cfg.setDefaultEncoding("UTF-8");
		cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
		cfg.setLogTemplateExceptions(false);
		return cfg;
	}

	public void generateCertificate(GFStudentEntity studEntity,
			ServletOutputStream outputStream) {
		// TODO Auto-generated method stub
		if (studEntity instanceof GFStudentEntity) {
			generateStudentCertificate(studEntity, outputStream);
		}

	}

	private void generateStudentCertificate(GFStudentEntity studEntity,
			ServletOutputStream outputStream) {
		// TODO Auto-generated method stub
		try {
			Document document = new Document();
			PdfWriter writer = PdfWriter.getInstance(document, outputStream);
			document.open();
			XMLWorkerHelper worker = XMLWorkerHelper.getInstance();
			Map<String, Object> root = new HashMap<String, Object>();

			Image logoURL = Image.getInstance("img/images/grf_logo_new_50x57.gif");
			logoURL.setAbsolutePosition(50f, 745f);
			logoURL.scaleToFit(50f, 50f);
			String logo = String.valueOf(document.add(logoURL));
			//root.put("logo", logo);
			
			String studName = studEntity.getfName() + " "
					+ studEntity.getlName();
			
			root.put("studName", studName.toUpperCase());
			
			String studStandard = studEntity.getStandard();
			root.put("studStandard", studStandard);

			String year = DateUtil.getCurrentGVSPYear();
			root.put("date", year);

			Template template = getConfiguration().getTemplate("email_templates/StudentCretificatePDF.ftlh");

			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(
					5000);
			Writer out = new PrintWriter(byteArrayOutputStream);
			template.process(root, out);
 
			String pdfXMLContent = byteArrayOutputStream.toString();

			worker.parseXHtml(writer, document, new StringReader(pdfXMLContent));
			document.close();
			
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
	}
}
