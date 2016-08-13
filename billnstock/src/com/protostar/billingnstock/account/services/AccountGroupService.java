package com.protostar.billingnstock.account.services;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Ref;
import com.protostar.billingnstock.account.entities.AccountGroupEntity;
import com.protostar.billingnstock.user.entities.BusinessEntity;
import com.protostar.billnstock.until.data.ServerMsg;

@Api(name = "accountGroupService", version = "v0.1", namespace = @ApiNamespace(ownerDomain = "com.protostar.billingnstock.services", ownerName = "com.protostar.billingnstock.services", packagePath = ""))
public class AccountGroupService {

	@ApiMethod(name = "addAccountGroup")
	public void addAccountGroup(AccountGroupEntity accountGroupEntity) {

		if (accountGroupEntity.getId() == null) {
			accountGroupEntity.setCreatedDate(new Date());
			accountGroupEntity.setModifiedDate(new Date());
		} else {
			accountGroupEntity.setModifiedDate(new Date());
		}
		ofy().save().entity(accountGroupEntity).now();

	}
	
	@ApiMethod(name = "getAccountGroupList")
	public List<AccountGroupEntity> getAccountGroupList() {
		return ofy().load().type(AccountGroupEntity.class).list();
	}
	
	@ApiMethod(name = "updateAccountGrp")
	public AccountGroupEntity updateAccountGrp(AccountGroupEntity update) {
		AccountGroupEntity	 now = update;
		ofy().save().entity(update).now();
		System.out.println("inside update details now" + now);
		return now;
	}
	
	@ApiMethod(name = "deleteAccountGrp")
	 public void deleteAccountGrp(@Named("id") Long id) {

		  ofy().delete().type(AccountGroupEntity.class).id(id).now();

		 
		 }
	

	@ApiMethod(name = "checkAccountGrpAlreadyExist")
	public ServerMsg checkAccountGrpAlreadyExist(@Named("groupName") String groupName) {
		ServerMsg serverMsg = new ServerMsg();
		List<AccountGroupEntity> list = ofy().load().type(AccountGroupEntity.class).filter("groupName",groupName).list();

		
		System.out.println("list ######"+list);
		if (list == null || list.size() == 0)
		{
			System.out.println("list888888888"+list);
			serverMsg.setReturnBool(false);
		} 
		else {
			serverMsg.setReturnBool(true);
		}

		return serverMsg;
	}
	


	@ApiMethod(name = "getAllAccountGroupsByBusiness")
	public List<AccountGroupEntity> getAllAccountGroupsByBusiness(
			@Named("id") Long busId) {

		List<AccountGroupEntity> filteredAccounts = ofy()
				.load()
				.type(AccountGroupEntity.class)
				.filter("business",
						Ref.create(Key.create(BusinessEntity.class, busId)))
				.list();

		return filteredAccounts;
	}

	@ApiMethod(name = "getAccountGroupById")
	public AccountGroupEntity getAccountGroupById(@Named("id") Long accountId) {

		AccountGroupEntity accountById = ofy().load()
				.type(AccountGroupEntity.class).id(accountId).now();

		return accountById;
	}


	public void createDefaltAccountGroups() {
		
		//check if not there then only add esle return;
		
		List<AccountGroupEntity> accountGroupEntities = new ArrayList<AccountGroupEntity>(10);  
		accountGroupEntities.add(new AccountGroupEntity("Bank Accounts", null));
		accountGroupEntities.add(new AccountGroupEntity("Capital Accounts", null));
		accountGroupEntities.add(new AccountGroupEntity("Current Assests", null));
		accountGroupEntities.add(new AccountGroupEntity("Direct Incomes", null));
		accountGroupEntities.add(new AccountGroupEntity("Direct Expesnes", null));
		accountGroupEntities.add(new AccountGroupEntity("Current Liabilities", null));
		
		//this.addAccountGroups(accountGroupEntities);
		
		

	}

}