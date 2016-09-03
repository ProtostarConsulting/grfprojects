package com.protostar.prostudy.gf.entity;

import java.util.Date;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class GFBookTransactionEntity {

	@Id
	private Long id;
	private String transactionType;
	private Date transactionDate;
	@Index
	private long instituteID;
	private int bookQty;
	@Index

	Ref<GFBookEntity> book;
	
public GFBookEntity getBook() {
		return book.get();
	}

	public void setBook(GFBookEntity book) {
		this.book = Ref.create(book);
	}

	/*	private GFBookEntity book;
	

	public GFBookEntity getBook() {
		return book;
	}

	public void setBook(GFBookEntity book) {
		this.book = book;
	}
*/
	private float totalFees;

	public float getTotalFees() {
		return totalFees;
	}

	public void setTotalFees(float totalFees) {
		this.totalFees = totalFees;
	}

	public int getBookQty() {
		return bookQty;
	}

	public void setBookQty(int bookQty) {
		this.bookQty = bookQty;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(String transactionType) {
		this.transactionType = transactionType;
	}

	public Date getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(Date transactionDate) {
		this.transactionDate = transactionDate;
	}

	public long getInstituteID() {
		return instituteID;
	}

	public void setInstituteID(long instituteID) {
		this.instituteID = instituteID;
	}

}
