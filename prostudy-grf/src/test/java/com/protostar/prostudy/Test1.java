package com.protostar.prostudy;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.math.NumberUtils;

import com.google.common.base.CaseFormat;

public class Test1 {

	public static void main(String[] args) {

		/*
		 * String[] a = {"list", "add"};
		 * 
		 * InstituteAuthorizationEntity instituteEntity = new
		 * InstituteAuthorizationEntity(); List<Map<String, List>>
		 * authorizations = new ArrayList<Map<String, List>>();
		 * instituteEntity.setAuthorizations(authorizations); // Map<String,
		 * List> enrtry1 = new HashMap<String, List>();
		 * authorizations.add(getEmptyAuthorizationEntry("gfe", null));
		 * authorizations.add(getEmptyAuthorizationEntry("exams",
		 * Arrays.asList(a)));
		 * 
		 * System.out.println("authorizations: " + authorizations);
		 */

		/*
		 * String lineSeparator = System.lineSeparator(); String aString =
		 * "This is a \n " + System.lineSeparator() + "string ";
		 * 
		 * byte[] bytes = aString.getBytes(); System.out.println("bytes:" +
		 * aString); System.out.println("bytes:" + bytes);
		 * System.out.println("All is well!");
		 */

		// System.out.println(EmailValidator.validate(""));
/*
		Date date = new Date();
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		Integer year = cal.get(Calendar.YEAR);
		String currentYear = "".concat(year.toString()).concat("-")
				.concat("" + (year - 1999));
		
		System.out.println("Curernt year is:" + currentYear);
		
		
		Date lastModifiedDate = new Date(System.currentTimeMillis()
				- (long) 365 * 24 * 60 * 60 * 1000);
		System.out.println("lastModifiedDate:" + lastModifiedDate);
		*/
		SimpleDateFormat sd = new SimpleDateFormat("dd/MM/yyyy");
		String dateStr = sd
				.format(new Date());
		System.out.println("sd:" + dateStr);
		
		String string = CaseFormat.LOWER_CAMEL.to(CaseFormat.UPPER_CAMEL, "this is a string token");
		System.out.println("string:" + string);
		
		System.out.println("NumberUtils.isParsable(null): " + NumberUtils.isParsable(null));
		System.out.println("NumberUtils.isParsable(\"\"): " + NumberUtils.isParsable(""));
		System.out.println("NumberUtils.isParsable(\" \"): " + NumberUtils.isParsable(" "));
		System.out.println("NumberUtils.isParsable(\"null\"): " + NumberUtils.isParsable("null"));
		System.out.println("NumberUtils.isParsable(\"45\"): " + NumberUtils.isParsable("45"));
		System.out.println("NumberUtils.isParsable(\"45.78\"): " + NumberUtils.isParsable("45.78"));
		
	}

	public static Map<String, List> getEmptyAuthorizationEntry(String authName, List<String> subAuths) {
		Map<String, List> authorization = new HashMap<String, List>();
		List<Map<String, List>> subAuthorizations = new ArrayList<Map<String, List>>();

		if (subAuths != null && !subAuths.isEmpty()) {
			for (String subAuth : subAuths) {
				Map<String, List> subAuthorization = new HashMap<String, List>();
				subAuthorization.put(subAuth, null);
				subAuthorizations.add(subAuthorization);
			}

			authorization.put(authName, subAuthorizations);

		} else {
			authorization.put(authName, null);
		}

		return authorization;
	}
}
