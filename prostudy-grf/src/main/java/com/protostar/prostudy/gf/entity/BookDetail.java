package com.protostar.prostudy.gf.entity;

public class BookDetail {

	
	private String bookName;
	private Integer bookPrise;
	private String standard;
	private Integer totalStud;
	private Integer freeStudCount;
	private Integer appearedTotalStud = 0;
	private Integer totalFees;
	private Integer totalExamFees;
	private Integer examFees;
	private Integer remainingFees;
	private Integer amtForInst20per;
	private Integer amtForGRF80per;
	
	public String getBookName() {
		return bookName;
	}
	public void setBookName(String bookName) {
		this.bookName = bookName;
	}
	public Integer getBookPrise() {
		return bookPrise;
	}
	public void setBookPrise(Integer bookPrise) {
		this.bookPrise = bookPrise;
	}
	
	public Integer getTotalStud() {
		return totalStud;
	}
	public void setTotalStud(Integer totalStud) {
		this.totalStud = totalStud;
	}
	public Integer getTotalFees() {
		return totalFees;
	}
	public void setTotalFees(Integer totalFees) {
		this.totalFees = totalFees;
	}
	public String getStandard() {
		return standard;
	}
	public void setStandard(String standard) {
		this.standard = standard;
	}
	public Integer getAppearedTotalStud() {
		return appearedTotalStud;
	}
	public void setAppearedTotalStud(Integer appearedTotalStud) {
		this.appearedTotalStud = appearedTotalStud;
	}
	public Integer getTotalExamFees() {
		return totalExamFees;
	}
	public void setTotalExamFees(Integer totalExamFees) {
		this.totalExamFees = totalExamFees;
	}
	public Integer getExamFees() {
		return examFees;
	}
	public void setExamFees(Integer examFees) {
		this.examFees = examFees;
	}
	public Integer getRemainingFees() {
		return remainingFees;
	}
	public void setRemainingFees(Integer remainingFees) {
		this.remainingFees = remainingFees;
	}
	public Integer getAmtForGRF80per() {
		return amtForGRF80per;
	}
	public void setAmtForGRF80per(Integer amtForGRF80per) {
		this.amtForGRF80per = amtForGRF80per;
	}
	public Integer getAmtForInst20per() {
		return amtForInst20per;
	}
	public void setAmtForInst20per(Integer amtForInst20per) {
		this.amtForInst20per = amtForInst20per;
	}
	public Integer getFreeStudCount() {
		return freeStudCount;
	}
	public void setFreeStudCount(Integer freeStudCount) {
		this.freeStudCount = freeStudCount;
	}
	

}
