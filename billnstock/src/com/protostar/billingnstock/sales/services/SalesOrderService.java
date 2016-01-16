package com.protostar.billingnstock.sales.services;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.List;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.googlecode.objectify.Key;
import com.protostar.billingnstock.invoice.entities.InvoiceEntity;
import com.protostar.billingnstock.sales.entities.SalesOrderEntity;

@Api(name = "salesOrderService", version = "v0.1", namespace = @ApiNamespace(ownerDomain = "com.protostar.billingnstock.sales.services", ownerName = "com.protostar.billingnstock.sales.services", packagePath = ""))
public class SalesOrderService {

		@ApiMethod(name="addSalesOrder")
		public void addSalesOrder(SalesOrderEntity salesOrderEntity){
			Key<SalesOrderEntity> now=ofy().save().entity(salesOrderEntity).now();
		}
		
		@ApiMethod(name="getAllSalesOrder")
		public List<SalesOrderEntity> getAllSalesOrder(){
			
			return ofy().load().type(SalesOrderEntity.class).list();
			
		}
		
		@ApiMethod(name="getSalesOrderById")
		public SalesOrderEntity getSalesOrderById(@Named("salesOrderId") String salesOrderId){
			
			SalesOrderEntity SalesOrderById=ofy().load().type(SalesOrderEntity.class).filter("SOByID", salesOrderId).first().now();
			System.out.println("Searched Recored is:"+ SalesOrderById.getCustomerName());
		
			return SalesOrderById;
			
		}
}