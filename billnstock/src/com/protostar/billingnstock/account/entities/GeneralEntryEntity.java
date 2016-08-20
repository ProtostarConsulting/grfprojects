package com.protostar.billingnstock.account.entities;

import java.util.Date;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Parent;
import com.protostar.billnstock.entity.BaseEntity;

@Entity
public class GeneralEntryEntity extends BaseEntity {

	private Date date;
	@Index
	private Ref<AccountEntity> debitAccount;
	@Index
	private Ref<AccountEntity> creditAccount;
	private String narration;
	private Double amount;


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

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public AccountEntity getDebitAccount() {
		return debitAccount.get();
	}

	public void setDebitAccount(AccountEntity debitAccount) {
		this.debitAccount = Ref.create(debitAccount);
	}

	public AccountEntity getCreditAccount() {
		return creditAccount.get();
	}

	public void setCreditAccount(AccountEntity creditAccount) {
		this.creditAccount = Ref.create(creditAccount);
	}

	public AccountingFYEntity getFyEntity() {
		return fyEntity == null ? null : fyEntity.get();
	}

	public void setFyEntity(AccountingFYEntity fyEntity) {
		this.fyEntity = Ref.create(fyEntity);
	}

}
