package com.protostar.prostudy;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

		Date date = new Date();
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		Integer year = cal.get(Calendar.YEAR);
		String currentYear = "".concat(year.toString()).concat("-")
				.concat("" + (year - 1999));
		
		System.out.println("Curernt year is:" + currentYear);
	}

	public static Map<String, List> getEmptyAuthorizationEntry(String authName,
			List<String> subAuths) {
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
