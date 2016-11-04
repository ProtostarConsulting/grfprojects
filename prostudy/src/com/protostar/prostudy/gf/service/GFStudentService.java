package com.protostar.prostudy.gf.service;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.mail.MessagingException;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.QueryResultIterator;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;
import com.googlecode.objectify.cmd.QueryKeys;
import com.protostar.prostudy.gf.entity.GFExamResultEntity;
import com.protostar.prostudy.gf.entity.GFStudentEntity;
import com.protostar.prostudy.gf.entity.PartnerSchoolEntity;
import com.protostar.prostudy.until.data.EntityPagingInfo;
import com.protostar.prostudy.until.data.GFExamResultEntityList;
import com.protostar.prostudy.until.data.UtilityService;

@Api(name = "gfStudentService", version = "v0.1", namespace = @ApiNamespace(ownerDomain = "com.protostar.prostudy.gf.service", ownerName = "com.protostar.prostudy.gf.service", packagePath = ""))
public class GFStudentService {

	private final Logger logger = Logger.getLogger(GFStudentService.class
			.getName());

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

		ofy().save().entities(resultList.getList()).now();
		logger.info("Saved list using entities method");

		PartnerSchoolService partnerSchoolService = new PartnerSchoolService();
		partnerSchoolService.addPartnerSchool(resultList.getSchool());

		return resultList;
	}

	@ApiMethod(name = "getExamResultEntities", path = "getExamResultEntities")
	public List<GFExamResultEntity> getExamResultEntities(
			@Named("instituteID") Long id) {
		List<GFExamResultEntity> resultList = ofy().load()
				.type(GFExamResultEntity.class).project("school")
				.distinct(true).list();
		logger.info("getExamResultEntities:resultList:" + resultList.size());
		return resultList;
	}

	@ApiMethod(name = "getExamResultsPendingGRFReview", path = "getExamResultsPendingGRFReview")
	public List<GFExamResultEntity> getExamResultsPendingGRFReview(
			@Named("instituteID") Long id) {
		List<GFExamResultEntity> resultList = ofy().load()
				.type(GFExamResultEntity.class).filter("grfReviewed", false)
				.project("createdDate", "school").distinct(true).list();

		Set<Long> schoolIds = new HashSet<Long>();
		List<GFExamResultEntity> examResultList = new ArrayList<GFExamResultEntity>();
		for (GFExamResultEntity next : resultList) {
			if (!schoolIds.contains(next.getSchool().getId())) {
				examResultList.add(next);
				schoolIds.add(next.getSchool().getId());
			}
		}

		logger.info("getExamResultsPendingGRFReview:examResultList:"
				+ examResultList.size());
		return examResultList;
	}

	@ApiMethod(name = "fetchExamResultByPaging", path = "fetchExamResultByPaging")
	public EntityPagingInfo fetchExamResultByPaging(
			@Named("instituteID") Long instituteID, EntityPagingInfo pagingInfo) {

		/*
		 * logger.info("instituteID:" + instituteID);
		 * logger.info("pagingInfo.getWebSafeCursorString():" +
		 * pagingInfo.getWebSafeCursorString());
		 */

		Query<GFExamResultEntity> filterInstituteQuery = ofy().load()
				.type(GFExamResultEntity.class).project("school")
				.distinct(true);

		int totalCount = filterInstituteQuery.count();

		if (pagingInfo.getWebSafeCursorString() != null)
			filterInstituteQuery = filterInstituteQuery.startAt(Cursor
					.fromWebSafeString(pagingInfo.getWebSafeCursorString()));

		QueryResultIterator<GFExamResultEntity> iterator = filterInstituteQuery
				.order("school").order("-createdDate")
				.limit(pagingInfo.getLimit()).iterator();

		List<GFExamResultEntity> examResultList = new ArrayList<GFExamResultEntity>();
		while (iterator.hasNext()) {
			GFExamResultEntity next = iterator.next();
			// this is projected, need whole object
			examResultList.add(ofy().load().type(GFExamResultEntity.class)
					.id(next.getId()).now());
		}

		Cursor cursor = iterator.getCursor();
		pagingInfo.setEntityList(examResultList);
		pagingInfo.setWebSafeCursorString(cursor.toWebSafeString());
		pagingInfo.setTotalEntities(totalCount);

		/*
		 * logger.info("pagingInfo.getStartPage:" + pagingInfo.getStartPage());
		 * logger.info("pagingInfo.getLimit():" + pagingInfo.getLimit());
		 * logger.info("pagingInfo.getEntityList().size: " +
		 * pagingInfo.getEntityList().size());
		 * logger.info("pagingInfo.getTotalEntities: " +
		 * pagingInfo.getTotalEntities());
		 */

		return pagingInfo;
	}

	@ApiMethod(name = "getExamResultByGRFNo", path = "getExamResultByGRFNo")
	public Collection<GFExamResultEntity> getExamResultByGRFNo(
			@Named("autoGenerated") String autoGenerated) {
		ArrayList<GFExamResultEntity> resultList = new ArrayList<GFExamResultEntity>();
		List<Key<PartnerSchoolEntity>> schoolKeyList = PartnerSchoolService
				.getSchoolKyesByRegOrFormNo(autoGenerated);
		if (schoolKeyList == null || schoolKeyList.size() == 0) {
			return resultList;
		}
		GFExamResultEntity now = ofy().load().type(GFExamResultEntity.class)
				.filter("school in", schoolKeyList).first().now();
		if (now != null) {
			resultList.add(now);
		}
		return resultList;
	}

	@ApiMethod(name = "searchExamResultBySchoolName", path = "searchExamResultBySchoolName")
	public List<GFExamResultEntity> searchExamResultBySchoolName(
			@Named("nameSearchString") String nameSearchString) {
		ArrayList<GFExamResultEntity> resultList = new ArrayList<GFExamResultEntity>();
		List<Key<PartnerSchoolEntity>> schoolKeyList = PartnerSchoolService
				.searchSchoolKeysByName(nameSearchString);

		if (schoolKeyList == null || schoolKeyList.size() == 0) {
			return resultList;
		}
		GFExamResultEntity now = ofy().load().type(GFExamResultEntity.class)
				.filter("school in", schoolKeyList).first().now();
		if (now != null) {
			resultList.add(now);
		}
		return resultList;
	}

	@ApiMethod(name = "touchAllEntities", path = "touchAllEntities")
	public void touchAllEntities() {
		List<GFExamResultEntity> courierList = ofy().load()
				.type(GFExamResultEntity.class).list();
		for (GFExamResultEntity entity : courierList) {
			entity.setModifiedDate(new Date());
		}
		ofy().save().entities(courierList).now();
	}

	@ApiMethod(name = "filterExamResults", path = "filterExamResults")
	public List<GFExamResultEntity> filterExamResults(
			@Named("standard") String standardFilter,
			@Named("dist") String distFilter) {

		standardFilter = standardFilter == null ? "" : standardFilter.trim();
		distFilter = distFilter == null ? "" : distFilter.trim();
		List<GFExamResultEntity> resultList = ofy().load()
				.type(GFExamResultEntity.class).order("-marks").list();
		// logger.info("filterExamResults:resultList:" + resultList.size());

		List<GFExamResultEntity> filterResultList = new ArrayList<GFExamResultEntity>();

		for (int i = 0; i < resultList.size(); i++) {

			GFExamResultEntity filterExamResultData = resultList.get(i);
			String currentRecordStandard = filterExamResultData.getStandard();
			String currentRecordDistrict = filterExamResultData.getSchool()
					.getAddress().getDist();

			if (!standardFilter.isEmpty()) {
				if (!currentRecordStandard.trim().equalsIgnoreCase(
						standardFilter)) {
					continue;
				}
			}

			if (distFilter.equalsIgnoreCase("All")) {
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
		logger.info("schoolEntity.schoolName:" + schoolEntity.getSchoolName());
		List<GFExamResultEntity> resultList = ofy().load()
				.type(GFExamResultEntity.class).filter("school", schoolEntity)
				.list();
		logger.info("serachExamResultEntitiesBySchool:resultList:"
				+ resultList.size());
		return resultList;
	}

}
