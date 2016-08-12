package com.protostar.prostudy.service;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.List;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.googlecode.objectify.Key;
import com.protostar.prostudy.entity.DivisionEntity;
import com.protostar.prostudy.entity.StandardEntity;
import com.protostar.prostudy.entity.StudSubEntity;


//@Api(name = "standardService", version = "v0.1", namespace = @ApiNamespace(ownerDomain = "com.protostar.prostudy.service", ownerName = "com.protostar.prostudy.service", packagePath = ""))
public class StandardService {

	@ApiMethod(name = "addStandard")
	public StandardEntity addStandard(StandardEntity std) {
		StandardEntity now = std;
		ofy().save().entity(std).now();
		return now;
	}

	@ApiMethod(name = "getStandard")
	public List<StandardEntity> getStandard() {
		return ofy().load().type(StandardEntity.class).list();
	}
	
	@ApiMethod(name = "getDivisionsByStandardName", path="getDivisionsByStandardName")
	public List<DivisionEntity> getDivisionsByStandardName(@Named("name") String stdname) {
		List<StandardEntity> std = ofy().load().type(StandardEntity.class)
				.filter("name", stdname).list();			
		DivisionService divisionService=new DivisionService();
		List<DivisionEntity> divList = divisionService.getDivisionByStandard(std.get(0).getId());
		
		
		return divList;
	}
	
	@ApiMethod(name = "getStandardByInstitute")
	 public List<StandardEntity> getStandardByInstitute(@Named("instituteID") Long instituteID) {		
	  List<StandardEntity> standardList = ofy().load().type(StandardEntity.class).filter("instituteID", instituteID).list();
	  return standardList;
	  
	 }
	
	@ApiMethod(name = "editStandard")
	public void editStandard(StandardEntity standard) {
		Key<StandardEntity> now = ofy().save().entity(standard).now();
	}
	
	
	
}