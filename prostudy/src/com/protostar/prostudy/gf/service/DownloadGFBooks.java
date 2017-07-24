package com.protostar.prostudy.gf.service;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.protostar.prostudy.gf.entity.GFBookEntity;

/**
 * Servlets implementation class DownloadGFBooks
 */
public class DownloadGFBooks extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final Logger log = Logger.getLogger(UplodePartnerSchoolsExcel.class
			.getName());

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DownloadGFBooks() {
		super();
		// TODO Auto-generated constructor stub
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		log.info("hi i am download servlet");
		if (request.getRemoteHost().contains("localhost")
				|| request.getRemoteHost().contains("127.0.0.1")) {
			response.addHeader("Access-Control-Allow-Origin", "*");
			response.addHeader("Access-Control-Allow-Methods",
					"GET,PUT,POST,DELETE");
			response.addHeader("Access-Control-Allow-Headers", "Content-Type");
		}

		Long insId = Long.parseLong(request.getParameter("InstituteId"));

		log.info("insid===" + insId);

		GFBookStockService gfBookStockService = new GFBookStockService();

		Date date = new Date();
		String DATE_FORMAT = "dd/MMM/yyyy";
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);

		List<GFBookEntity> gfbookEntity = gfBookStockService
				.getGFBookByInstituteId(insId);

		OutputStream out = null;
		try {

			response.setContentType("text/csv");

			response.setHeader("Content-Disposition",
					"attachment; filename=GFBookData_" + sdf.format(date)
							+ ".csv");

			ServletOutputStream outputStream = response.getOutputStream();
			OutputStreamWriter writer = new OutputStreamWriter(outputStream);

			writer.append("standard");
			writer.append(',');
			writer.append("bookName");
			writer.append(',');
			writer.append("bookAuther");
			writer.append(',');
			writer.append("weight");
			writer.append(',');
			writer.append("bookPrice");
			writer.append(',');
			writer.append("bookPublication");
			writer.append(',');
			writer.append("bookMedium");
			writer.append(',');
			writer.append("bookQty");
			writer.append(',');
			writer.append("bookThreshold");
			writer.append(',');
			/*
			 * writer.append("Temp"); writer.append(',');
			 */writer.append(System.lineSeparator());

			for (int i = 0; i < gfbookEntity.size(); i++) {

				try {

					String qty = String.valueOf(gfbookEntity.get(i)
							.getBookQty());
					String weight = String.valueOf(gfbookEntity.get(i)
							.getWeight());
					String price = String.valueOf(gfbookEntity.get(i)
							.getBookPrice());
					String thresholdQty = String.valueOf(gfbookEntity.get(i)
							.getBookThreshold());

					writer.append(gfbookEntity.get(i).getStandard());
					writer.append(',');

					writer.append(gfbookEntity.get(i).getBookName());
					writer.append(',');
					writer.append(gfbookEntity.get(i).getBookAuther());
					writer.append(',');
					writer.append(weight.trim());
					writer.append(',');
					writer.append(price.trim());
					writer.append(',');
					writer.append(gfbookEntity.get(i).getBookPublication());
					writer.append(',');
					writer.append(gfbookEntity.get(i).getBookMedium());
					writer.append(',');
					writer.append(qty.trim());
					writer.append(',');
					writer.append(thresholdQty.trim());
					writer.append(',');
					/*
					 * writer.append("Temp"); writer.append(" ");
					 */writer.append(System.lineSeparator());
				} catch (Exception e) {
					log.warning(e.getMessage());
					e.printStackTrace();
				}
			}

			writer.close();

		} catch (Exception e) {
			log.severe(e.getMessage());
			e.printStackTrace();
			throw new ServletException(
					"Error Occurred while downloading the csv file.", e);
		} finally {
			if (out != null)
				out.close();
		}

	}

	// /////// Only used while sending stock reorder email reminder to add as an
	// /////// attachment.
	public void generateCSV(List<GFBookEntity> stocksBelowThreshold, OutputStream outputStream) throws IOException {
		OutputStream out = null;

		try {

			OutputStreamWriter writer = new OutputStreamWriter(outputStream);

			writer.append("standard");
			writer.append(',');
			writer.append("bookName");
			writer.append(',');
			writer.append("bookAuther");
			writer.append(',');
			writer.append("weight");
			writer.append(',');
			writer.append("bookPrice");
			writer.append(',');
			writer.append("bookPublication");
			writer.append(',');
			writer.append("bookMedium");
			writer.append(',');
			writer.append("bookQty");
			writer.append(',');
			writer.append("bookThreshold");
			writer.append(',');
			writer.append(System.lineSeparator());

			if (stocksBelowThreshold != null && !stocksBelowThreshold.isEmpty()) {

				int qty = 0;
				String qtyInString = "";
				String thresholdQtyInString = "";
				for (GFBookEntity stockItemEntity : stocksBelowThreshold) {

					try {
						writer.write(stockItemEntity.getStandard());
						writer.write(',');
						writer.write(stockItemEntity.getBookName());
						writer.write(',');
						writer.write(stockItemEntity.getBookAuther());
						writer.write(',');
						String weight = String.valueOf(stockItemEntity
								.getWeight());
						writer.write(weight);
						writer.write(',');
						String price = String.valueOf(stockItemEntity
								.getBookPrice());
						writer.write(price);
						writer.write(',');
						writer.write(stockItemEntity.getBookPublication());
						writer.write(',');
						writer.write(stockItemEntity.getBookMedium());
						writer.write(',');
						qty = (int) stockItemEntity.getBookQty();
						qtyInString = Integer.toString(qty);
						thresholdQtyInString = Integer.toString(stockItemEntity.getBookThreshold());
						writer.write(qtyInString);
						writer.write(',');
						writer.write(thresholdQtyInString);
						writer.write(',');
						writer.append(System.lineSeparator());

					} catch (Exception e) {
						e.printStackTrace();
					}

				}

			}

			writer.close();

		} catch (Exception e) {
			e.printStackTrace();

		} finally {
			if (out != null)
				out.close();
		}

	}
}