package com.protostar.prostudy.gf.entity;

import java.util.List;

public class BookSummary {

	private List<BookDetail> bookDetail;
	private Integer total;
	private Integer appearedSchoolTotalStud = 0;
	
	
	public List<BookDetail> getBookDetail() {
		return bookDetail;
	}
	public void setBookDetail(List<BookDetail> bookDetail) {
		this.bookDetail = bookDetail;
	}
	public Integer getTotal() {
		return total;
	}
	public void setTotal(Integer total) {
		this.total = total;
	}
	public Integer getAppearedSchoolTotalStud() {
		return appearedSchoolTotalStud;
	}
	public void setAppearedSchoolTotalStud(Integer appearedSchoolTotalStud) {
		this.appearedSchoolTotalStud = appearedSchoolTotalStud;
	}
		
}
