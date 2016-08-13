package com.protostar.billingnstock.account.services;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.protostar.billingnstock.account.entities.AccountGroupEntity;


public class UploadGroupsListServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final Logger log = Logger.getLogger(UploadGroupsListServlet.class.getName());    
	class SizeEntry {
		public int size;
		public Date time;
	}
	
	static Map<String, SizeEntry> sizeMap = new ConcurrentHashMap<>();
	int counter;
    public UploadGroupsListServlet() {
        super();
        
    }

	
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			if (request.getHeader("Content-Type") != null
					&& request.getHeader("Content-Type").startsWith(
							"multipart/form-data")) {
				ServletFileUpload upload = new ServletFileUpload();

				FileItemIterator iterator = upload.getItemIterator(request);
				String[] split2 = null;
				Long insId = 0L;
				while (iterator.hasNext()) {
					FileItemStream item = iterator.next();
					log.fine("item.getFieldName(): " + item.getFieldName());

					InputStream openStream = item.openStream();
					int len = 0;
					byte[] fileContent = new byte[2000000];
					// Can handle files upto 20 MB

					int read = openStream.read(fileContent);
					// log.fine("No of bytes read:" + read);
					while ((len = openStream.read(fileContent, 0,
							fileContent.length)) != -1) {
						// res.getOutputStream().write(fileContent, 0, len);
					}
					openStream.close();
					log.info("File Read is Done!!");
					// Write code here to parse sheet of patients and upload to
					// database

					String fileAsString = new String(fileContent);

					split2 = fileAsString.split("\n");

				}

				for (int row = 1; row < split2.length; row++) {

					try {
						String[] split = split2[row].split(",");
						
						if(split.length < 3 ) {
							continue;
						}

						AccountGroupEntity accGrpEntity = new AccountGroupEntity();
						
						accGrpEntity.setGroupName(split[0].trim());
						
						accGrpEntity.setDescription(split[1].trim());				
						accGrpEntity.setDisplayOrderNo(Integer.parseInt(split[2].trim()));
						

						AccountGroupService accGrpService= new AccountGroupService();
						accGrpService.addAccountGroup(accGrpEntity);	
						
					} catch (Exception e) {
						log.warning(e.getMessage());
						e.printStackTrace();
					}

				}
			}
		} catch (Exception e) {
			log.severe(e.getMessage());
			e.printStackTrace();
			throw new ServletException(
					"Error Occurred while uploading the csv file.", e);
		}
	}
	}


