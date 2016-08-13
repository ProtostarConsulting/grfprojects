package com.protostar.billingnstock.account.entities;

import java.util.Date;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Parent;
import com.protostar.billnstock.entity.BaseEntity;

@Entity
public class AccountEntryEntity extends BaseEntity {

	private Date date;
	private String narration;
	private Double debit;
	private Double credit;
	@Index
	private Ref<AccountEntity> accountEntity;

	//@Parent
	@Index
	private Ref<AccountingFYEntity> fyEntity;

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getNarration() {
		return narration;
	}

	public void setNarration(String narration) {
		this.narration = narration;
	}

	public Double getDebit() {
		return debit;
	}

	public void setDebit(Double debit) {
		this.debit = debit;
	}

	public Double getCredit() {
		return credit;
	}

	public void setCredit(Double credit) {
		this.credit = credit;
	}
	
	public AccountingFYEntity getFyEntity() {
		return fyEntity == null ? null : fyEntity.get();
	}

	public void setFyEntity(AccountingFYEntity fyEntity) {
		this.fyEntity = Ref.create(fyEntity);
	}

	public AccountEntity getAccountEntity() {
		return accountEntity.get();
	}

	public void setAccountEntity(AccountEntity accountEntity) {
		this.accountEntity = Ref.create(accountEntity);
	}
}
