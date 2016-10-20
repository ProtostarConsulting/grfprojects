package com.protostar.prostudy.service;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.List;
import java.util.logging.Logger;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.protostar.prostudy.entity.PracticeExamResultEntity;


@Api(name = "practiceExamService", version = "v0.1", namespace = @ApiNamespace(ownerDomain = "com.protostar.prostudy.service", ownerName = "com.protostar.prostudy.service", packagePath = ""))
public class PracticeExamResultService {

	private final Logger logger = Logger.getLogger(PracticeExamResultService.class
			.getName());
	
	@ApiMethod(name = "addPracticeExamResult")
	public PracticeExamResultEntity addPracticeExamResult(PracticeExamResultEntity res) {
		PracticeExamResultEntity now = res;
		ofy().save().entity(res).now();
		return now;
	}
	
	@ApiMethod(name = "getPracticeExamResult")
	public List<PracticeExamResultEntity> getPracticeExamResult() {
		return ofy().load().type(PracticeExamResultEntity.class).list();
	}

	
	@ApiMethod(name = "getPracticeExamResultbyEmail")
	public List<PracticeExamResultEntity> getPracticeExamResultbyEmail(@Named("email_id") String email_id) {
		List<PracticeExamResultEntity> list = ofy().load().type(PracticeExamResultEntity.class)
				.filter("email_id", email_id).list();
		return list;
	}
	
	@ApiMethod(name = "getPracticeExamResultbyID")
	public PracticeExamResultEntity getPracticeExamResultbyID(@Named("id") Long id) {
		
		PracticeExamResultEntity selected = ofy().load().type(PracticeExamResultEntity.class).id(id).now();
		return selected;
	}


}
