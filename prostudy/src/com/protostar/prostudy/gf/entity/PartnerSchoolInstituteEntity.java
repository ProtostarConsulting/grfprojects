package com.protostar.prostudy.gf.entity;

import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Index;
import com.protostar.prostudy.entity.Address;
import com.protostar.prostudy.entity.BaseEntity;

@Entity
@Cache
public class PartnerSchoolInstituteEntity extends BaseEntity {
	private String instituteName;
	
	public String getInstituteName() {
		return instituteName;
	}

	public void setInstituteName(String instituteName) {
		this.instituteName = instituteName;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	@Index
	private Address address;
}