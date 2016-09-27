package com.protostar.prostudy.gf.service;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.protostar.prostudy.gf.entity.GFBookTransactionEntity;

/**
 * Servlet implementation class DownloadBookStockTransaction
 */
public class DownloadBookStockTransaction extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DownloadBookStockTransaction() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		System.out.println("hi i am download servlet");
		// TODO Auto-generated method stub
		String bookTransaction = request.getParameter("BookStockTransactionByInstituteId");
		long InstituteId = Long.parseLong(bookTransaction);
		
		System.out.println("Courier Type----"+InstituteId);
		
		GFBookStockService gfBookStockService = new GFBookStockService();
		
		Date date=new Date();
		String DATE_FORMAT = "dd/MMM/yyyy";
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
		
		
		List<GFBookTransactionEntity> list1 = gfBookStockService.getGFBookStockTransactionByInstituteId(InstituteId);
		
		
		
		
		try {
			
			response.setContentType("text/csv");
			response.setHeader("Content-Disposition",
					"attachment; filename=BookTransactionData_"+sdf.format(date)+".csv");
			
			ServletOutputStream outputStream = response.getOutputStream();
			OutputStreamWriter writer = new OutputStreamWriter(outputStream);
			
			writer.append("Book Name");
			writer.append(',');
			writer.append("Standard	");
			writer.append(',');
			writer.append("Book Qty");
			writer.append(',');
			writer.append("Medium");
			writer.append(',');
			writer.append("Transaction Date");
			writer.append(',');
			writer.append("Transaction Type");
			writer.append(',');
			
			writer.append(System.lineSeparator());
			
			for(int i=0;i<list1.size();i++){
				
				if(!list1.get(i).getBook().getBookName().equals(null)){
				System.out.println("----"+list1.get(i).getBook().getBookName());
				
				String bookName=list1.get(i).getBook().getBookName();
				writer.append(bookName);
				writer.append(',');
				
				String standard=list1.get(i).getBook().getStandard();
				writer.append(standard);
				writer.append(',');
				int bookQty=list1.get(i).getBook().getBookQty();
				writer.append(Integer.toString(bookQty));
				writer.append(',');
				String medium=list1.get(i).getBook().getBookMedium();
				writer.append(medium);
				writer.append(',');
				String transactionDate=list1.get(i).getTransactionDate().toString();
				writer.append(transactionDate);
				writer.append(',');
				String transactionType=list1.get(i).getTransactionType();
				writer.append(transactionType);
				writer.append(',');
				
				writer.append(System.lineSeparator());
			
				}
				else{}
				
			}
			
			writer.close();
			
		} catch (Exception e) {
			// TODO: handle exception
			throw new ServletException("Exception in Excel Sample Servlet", e);
		}
				
		
		
		
	}

	
}
