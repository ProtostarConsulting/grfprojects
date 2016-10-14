package com.protostar.prostudy.gf.service;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;
import java.util.ArrayList;
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
	public GFStudentEntity addGFStudent(GFStudentEntity gfStudentEntity) {

		String nextPRN = UtilityService.getNextPRN(gfStudentEntity.getRole());
		gfStudentEntity.setPrn(nextPRN);

		ofy().save().entity(gfStudentEntity).now();
		return gfStudentEntity;

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

	@ApiMethod(name = "filterExamResults", path = "filterExamResults")
	public List<GFExamResultEntity> filterExamResults(
			@Named("standard") String standardFilter, @Named("dist") String distFilter) {

		standardFilter = standardFilter == null ? "" : standardFilter.trim();
		distFilter = distFilter == null ? "" : distFilter.trim();
		List<GFExamResultEntity> resultList = ofy().load()
				.type(GFExamResultEntity.class).order("-marks").list();
		System.out.println("resultList:" + resultList.size());
		
		
		List<GFExamResultEntity> filterResultList = new ArrayList();

		for (int i = 0; i < resultList.size(); i++) {

			GFExamResultEntity filterExamResultData = resultList.get(i);
			String currentRecordStandard = filterExamResultData.getStandard();
			String currentRecordDistrict = filterExamResultData.getSchool()
					.getAddress().getDist();
			
			if (!standardFilter.isEmpty()) {
				if (!currentRecordStandard.trim().equalsIgnoreCase(standardFilter)) {
					continue;
				}
			}
			
			if(distFilter.equalsIgnoreCase("All")){
				filterResultList.add(filterExamResultData);
			}

			if (!distFilter.isEmpty()) {
				if (!currentRecordDistrict.trim().equalsIgnoreCase(distFilter)) {
					continue;
				}
			}

			filterResultList.add(filterExamResultData);
		}

		return filterResultList;
	}

	@ApiMethod(name = "serachExamResultEntitiesBySchool", path = "serachExamResultEntitiesBySchool")
	public List<GFExamResultEntity> serachExamResultEntitiesBySchool(
			PartnerSchoolEntity schoolEntity) {
		System.out.println("schoolEntity.schoolName:"
				+ schoolEntity.getSchoolName());
		List<GFExamResultEntity> resultList = ofy().load()
				.type(GFExamResultEntity.class).filter("school", schoolEntity)
				.list();
		System.out.println("resultList:" + resultList.size());
		return resultList;
	}

}
