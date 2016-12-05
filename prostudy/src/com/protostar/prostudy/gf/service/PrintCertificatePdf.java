package com.protostar.prostudy.gf.service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.protostar.prostudy.gf.entity.GFStudentEntity;
import com.protostar.prostudy.until.PDFHtmlTemplateService;


public class PrintCertificatePdf extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
   
    public PrintCertificatePdf() {
        super();
        // TODO Auto-generated constructor stub
    }

	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		Long id = Long.parseLong(request.getParameter("id"));
		PDFHtmlTemplateService pdfHtmlTemplateService = new PDFHtmlTemplateService();
		
		response.setContentType("application/PDF");
		ServletOutputStream outputStream = response.getOutputStream();
		
		Date date = new Date();
		String DATE_FORMAT = "dd/MMM/yyyy";
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
		
		String fileNameAppend = "_" + sdf.format(date);
		response.setHeader("Content-disposition",
				"inline; filename='Certificate" + fileNameAppend + ".pdf'");
		
		GFStudentService gfStudentService = new GFStudentService();
		GFStudentEntity studEntity = null;
		studEntity = gfStudentService.getGFStudentById(id);
		pdfHtmlTemplateService.generateCertificate(studEntity,outputStream);
	}
		
}
