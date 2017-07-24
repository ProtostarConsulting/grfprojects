package com.protostar.prostudy.gf.service;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.protostar.prostudy.entity.InstituteEntity;

public class SendBookRecorderEmail extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public SendBookRecorderEmail() {
		super();
		// TODO Auto-generated constructor stub
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		Long insID;
		GFBookStockService bookService = new GFBookStockService();
		List<InstituteEntity> instituteList = ofy().load()
				.type(InstituteEntity.class).list();
		for (InstituteEntity instituteEntity : instituteList) {
			insID = instituteEntity.getId();
			bookService.sendStockReorderEmail(insID);
		}
	}

}