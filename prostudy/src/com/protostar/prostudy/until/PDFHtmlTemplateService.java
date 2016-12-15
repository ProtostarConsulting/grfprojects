package com.protostar.prostudy.until;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;

import javax.servlet.ServletOutputStream;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.GrayColor;
import com.itextpdf.text.pdf.PRStream;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfName;
import com.itextpdf.text.pdf.PdfObject;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStream;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.PdfWriter;
import com.protostar.prostudy.gf.entity.GFExamResultEntity;
import com.protostar.prostudy.gf.entity.GFStudentEntity;
import com.protostar.prostudy.until.data.DateUtil;

import freemarker.template.Configuration;
import freemarker.template.TemplateExceptionHandler;

public class PDFHtmlTemplateService {

	public static final Font FONT = new Font(FontFamily.TIMES_ROMAN, 12,
			Font.NORMAL, GrayColor.BLACK);
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
			GFExamResultEntity examResultEntity,
			ServletOutputStream outputStream) {
		if (studEntity instanceof GFStudentEntity
				|| examResultEntity instanceof GFExamResultEntity) {
			generateStudentCertificate(studEntity, examResultEntity,
					outputStream);
		}

	}

	private void generateStudentCertificate(GFStudentEntity studEntity,
			GFExamResultEntity examResultEntity,
			ServletOutputStream outputStream) {
		try {

			String studName = null, schoolName = null, std = null;
			String year = DateUtil.getCurrentGVSPYear();
			ByteArrayOutputStream boas = new ByteArrayOutputStream();

			String file = "email_templates/CERTIFICATE_GVSP.pdf";

			InputStream inStream = getClass().getClassLoader().getResourceAsStream(file);

			byte[] img = new byte[1024];
			PdfReader reader = new PdfReader(inStream);
			for (int i = 0; i < reader.getXrefSize(); i++) {
				PdfObject pdfObject = reader.getPdfObject(i);
				if (pdfObject != null) {
					if (pdfObject.isStream()) {
						PdfStream stream = (PdfStream) pdfObject;
						PdfObject pdfSubtype = stream.get(PdfName.SUBTYPE);
						if (pdfSubtype != null) {
							if (pdfSubtype.toString().equals(
									PdfName.IMAGE.toString())) {
								img = PdfReader
										.getStreamBytesRaw((PRStream) stream);
								boas.write(img);
							}
						}

					}
				}
			}

			if (studEntity != null) {
				studName = studEntity.getfName().toUpperCase() + "  "
						+ studEntity.getmName().toUpperCase() + "  "
						+ studEntity.getlName().toUpperCase();
				schoolName = studEntity.getSchool().getSchoolName()
						.toUpperCase();
				std = studEntity.getStandard().toLowerCase();
			}

			if (examResultEntity != null) {
				studName = examResultEntity.getStudName().toUpperCase();
				schoolName = examResultEntity.getSchool().getSchoolName()
						.toUpperCase();
				std = examResultEntity.getStandard();
			}

			Document document = new Document(PageSize.A4);
			PdfWriter writer = PdfWriter.getInstance(document, outputStream);
			document.open();
			PdfContentByte cb = writer.getDirectContent();
			Image i = Image.getInstance(img);
			i.scaleToFit(500f, 800f);
			document.add(getWaterMark(cb, i, studName, year, schoolName, std));

			boas.close();
			document.close();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private Image getWaterMark(PdfContentByte cb, Image i, String studName,
			String year, String school, String standard)
			throws DocumentException {

		float width = i.getScaledWidth();
		float height = i.getScaledHeight();
		double d1 = width / 2.08;
		float width1 = (float) d1;
		double d2 = height / 2.08;
		float height1 = (float) d2;
		double w1 = width / 1.9;
		float width2 = (float) w1;
		double w2 = width / 1.9;
		float height2 = (float) w2;
		double w3 = width / 1.91;
		float width3 = (float) w3;
		double w4 = height / 1.91;
		float height3 = (float) w4;
		double w5 = height / 1.95;
		float height4 = (float) w5;
		PdfTemplate template2 = cb.createTemplate(width, height);
		template2.addImage(i, width, 0, 0, height, 0, 0);
		ColumnText.showTextAligned(template2, Element.ALIGN_CENTER, new Phrase(
				school, FONT), width1, height1, 0);
		ColumnText.showTextAligned(template2, Element.ALIGN_CENTER, new Phrase(
				year, FONT), width2, height2, 0);
		ColumnText.showTextAligned(template2, Element.ALIGN_CENTER, new Phrase(
				studName, FONT), width3, height3, 0);
		ColumnText.showTextAligned(template2, Element.ALIGN_UNDEFINED,
				new Phrase(standard, FONT), 452f, height4, 0);
		return Image.getInstance(template2);
	}
}
