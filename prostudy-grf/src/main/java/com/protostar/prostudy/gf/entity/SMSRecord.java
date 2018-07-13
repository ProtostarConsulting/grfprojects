package com.protostar.prostudy.gf.entity;

import java.util.Date;

public class SMSRecord {
	
	private Date smsdate;
	private String mobileno;
	private String smsmessage;
	
	public Date getSmsdate() {
		return smsdate;
	}
	public void setSmsdate(Date smsdate) {
		this.smsdate = smsdate;
	}
	public String getMobileno() {
		return mobileno;
	}
	public void setMobileno(String mobileno) {
		this.mobileno = mobileno;
	}
	public String getSmsmessage() {
		return smsmessage;
	}
	public void setSmsmessage(String smsmessage) {
		this.smsmessage = smsmessage;
	}
}
