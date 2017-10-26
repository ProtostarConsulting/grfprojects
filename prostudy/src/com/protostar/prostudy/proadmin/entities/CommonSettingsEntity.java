package com.protostar.prostudy.proadmin.entities;

import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Cache
@Entity
public class CommonSettingsEntity {

	@Id
	private Long id;
	private Long grfInstituteId;
	private String sendGridAPIKey;
	private String textLocalAPIKey;
	private String currYearofExam;

	public String getSendGridAPIKey() {
		// Not storing whole key in the DB to avoid auto suspension if checked
		// in the github.com
		return "SG." + this.sendGridAPIKey;
	}

	public void setSendGridAPIKey(String sendGridAPIKey) {
		// If it starts with 'SG.', strip it.
		if (sendGridAPIKey.startsWith("SG.")) {
			sendGridAPIKey = sendGridAPIKey.substring(3);
		}
		this.sendGridAPIKey = sendGridAPIKey;
	}

	public String getTextLocalAPIKey() {
		return textLocalAPIKey;
	}

	public void setTextLocalAPIKey(String textLocalAPIKey) {
		this.textLocalAPIKey = textLocalAPIKey;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getGrfInstituteId() {
		return grfInstituteId;
	}

	public void setGrfInstituteId(Long grfInstituteId) {
		this.grfInstituteId = grfInstituteId;
	}

	public String getCurrYearofExam() {
		return currYearofExam;
	}

	public void setCurrYearofExam(String currYearofExam) {
		this.currYearofExam = currYearofExam;
	}
}
