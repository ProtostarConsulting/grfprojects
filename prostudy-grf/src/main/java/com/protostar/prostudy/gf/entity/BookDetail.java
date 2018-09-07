package com.protostar.prostudy.gf.entity;

public class BookDetail {
	private String bookName;
	private String standard;
	private Integer bookPrise;	
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

	public int getBookPrise() {
		return bookPrise == null ? 0 : bookPrise.intValue();
	}

	public void setBookPrise(Integer bookPrise) {
		this.bookPrise = bookPrise;
	}

	public int getTotalStud() {
		return totalStud == null ? 0 : totalStud.intValue();
	}

	public void setTotalStud(Integer totalStud) {
		this.totalStud = totalStud;
	}

	public int getTotalFees() {
		return totalFees == null ? 0 : totalFees.intValue();
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

	public int getAppearedTotalStud() {
		return appearedTotalStud == null ? 0 : appearedTotalStud.intValue();
	}

	public void setAppearedTotalStud(Integer appearedTotalStud) {
		this.appearedTotalStud = appearedTotalStud;
	}

	public int getTotalExamFees() {
		return totalExamFees == null ? 0 : totalExamFees.intValue();
	}

	public void setTotalExamFees(Integer totalExamFees) {
		this.totalExamFees = totalExamFees;
	}

	public int getExamFees() {
		return examFees == null ? 0 : examFees.intValue();
	}

	public void setExamFees(Integer examFees) {
		this.examFees = examFees;
	}

	public int getRemainingFees() {
		return remainingFees == null ? 0 : remainingFees.intValue();
	}

	public void setRemainingFees(Integer remainingFees) {
		this.remainingFees = remainingFees;
	}

	public int getAmtForGRF80per() {
		return amtForGRF80per == null ? 0 : amtForGRF80per.intValue();
	}

	public void setAmtForGRF80per(Integer amtForGRF80per) {
		this.amtForGRF80per = amtForGRF80per;
	}

	public int getAmtForInst20per() {
		return amtForInst20per == null ? 0 : amtForInst20per.intValue();
	}

	public void setAmtForInst20per(Integer amtForInst20per) {
		this.amtForInst20per = amtForInst20per;
	}

	public int getFreeStudCount() {
		return freeStudCount == null ? 0 : freeStudCount.intValue();
	}

	public void setFreeStudCount(Integer freeStudCount) {
		this.freeStudCount = freeStudCount;
	}
}
