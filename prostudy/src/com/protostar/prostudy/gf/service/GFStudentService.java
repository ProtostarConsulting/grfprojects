package com.protostar.prostudy.gf.service;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;
import java.util.List;

import javax.mail.MessagingException;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.protostar.prostudy.gf.entity.GFExamResultEntity;
import com.protostar.prostudy.gf.entity.GFStudentEntity;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;
import com.protostar.prostudy.until.data.GFExamResultEntityList;
import com.protostar.prostudy.until.data.UtilityService;

@Api(name = "gfStudentService", version = "v0.1", namespace = @ApiNamespace(ownerDomain = "com.protostar.prostudy.gf.service", ownerName = "com.protostar.prostudy.gf.service", packagePath = ""))
public class GFStudentService {

	@ApiMethod(name = "addGFStudent", path = "addGFStudent")
	public void addGFStudent(GFStudentEntity gfStudentEntity) {

		String nextPRN = UtilityService.getNextPRN(gfStudentEntity.getRole());
		gfStudentEntity.setPrn(nextPRN);

		ofy().save().entity(gfStudentEntity).now();

	}

	@ApiMethod(name = "getGFStudentsByInstitute", path = "getGFStudentsByInstitute")
	public List<GFStudentEntity> getGFStudentsByInstitute(
			@Named("instituteID") long instituteID) {

		List<GFStudentEntity> list = ofy().load().type(GFStudentEntity.class)
				.list();

		return list;

	}

	@ApiMethod(name = "getGFStudentById", path = "getGFStudentById")
	public GFStudentEntity getGFStudentById(@Named("id") long studID) {
		GFStudentEntity stud = ofy().load().type(GFStudentEntity.class)
				.id(studID).now();

		return stud;

	}

	@ApiMethod(name = "addExamResults")
	public GFExamResultEntityList addExamResults(
			GFExamResultEntityList resultList) throws MessagingException,
			IOException {
		for (GFExamResultEntity er : resultList.getList()) {
			ofy().save().entity(er).now();
		}
		return resultList;
	}

	@ApiMethod(name = "getExamResultEntities", path = "getExamResultEntities")
	public List<GFExamResultEntity> getExamResultEntities(
			@Named("instituteID") Long id) {
		List<GFExamResultEntity> resultList = ofy().load()
				.type(GFExamResultEntity.class).list();
		System.out.println("resultList:" + resultList.size());
		return resultList;
	}

	@ApiMethod(name = "serachExamResultEntitiesBySchool", path = "serachExamResultEntitiesBySchool")
	public List<GFExamResultEntity> serachExamResultEntitiesBySchool(
			PartnerSchoolEntity schoolEntity) {
		System.out.println("schoolEntity.schoolName:" + schoolEntity.getSchoolName());
		List<GFExamResultEntity> resultList = ofy().load()
				.type(GFExamResultEntity.class).filter("school", schoolEntity)
				.list();
		System.out.println("resultList:" + resultList.size());
		return resultList;
	}

}
