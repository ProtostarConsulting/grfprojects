package com.protostar.prostudy.until.data;

import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class DateUtil {
	public static Date removeTime(Date date) {
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("IST"));
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTime();
	}

	public static Date convertCSTtoISTTime(Date date) {
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("IST"));
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 5);
		cal.set(Calendar.MINUTE, 30);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTime();
	}

	public static Date addDays(Date date, int days) {
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("IST"));
		cal.setTime(date);
		cal.add(Calendar.DATE, days);
		return cal.getTime();
	}

	public static String getCurrentGVSPYear() {
		Date date = new Date();
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		Integer year = cal.get(Calendar.YEAR);
		return "".concat(year.toString()).concat("-")
				.concat("" + (year - 1999));
	}
	
	public static String getPreviousGVSPYear() {
		Calendar cal = Calendar.getInstance();
		//cal.setTime(date);
		cal.add(Calendar.YEAR, -1);
		Integer year = cal.get(Calendar.YEAR);
		return "".concat(year.toString()).concat("-")
				.concat("" + (year - 1999));
	}
}
