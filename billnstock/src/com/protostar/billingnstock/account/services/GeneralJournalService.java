package com.protostar.billingnstock.account.services;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.List;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.protostar.billingnstock.account.entities.GeneralJournalEntity;

@Api(name = "generalJournalService", version = "v0.1", namespace = @ApiNamespace(ownerDomain = "com.protostar.billingnstock.services", ownerName = "com.protostar.billingnstock.services", packagePath = ""))
public class GeneralJournalService {
	
	
	
	@ApiMethod(name = "addJournal")
	public void addJournal(GeneralJournalEntity journalEntity) {		
		ofy().save().entity(journalEntity).now();
	}
	
	@ApiMethod(name = "getAllJournalList")
	public List<GeneralJournalEntity> getAllJournalList() {
		return ofy().load().type(GeneralJournalEntity.class).list();
	}

}
