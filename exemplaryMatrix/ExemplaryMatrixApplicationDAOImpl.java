package com.zl.dao.impl;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.RowBounds;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.zl.bean.BusinessCircumstance;
import com.zl.bean.CooperationFacilitatingAgency;
import com.zl.bean.EnterpriseEvaluate;
import com.zl.bean.ExemplaryMatrix;
import com.zl.bean.ExemplaryMatrixApplication;
import com.zl.bean.ExemplaryMatrixRecommend;
import com.zl.bean.ExemplaryMatrixRecommendEvaluate;
import com.zl.bean.ExemplaryMatrixServiceData;
import com.zl.bean.MonthlyDecoration;
import com.zl.bean.MonthlyOfficeEquipment;
import com.zl.bean.MonthlyServiceData;
import com.zl.bean.PersonnelList;
import com.zl.bean.QuarterStatement;
import com.zl.bean.ServiceFunction;
import com.zl.dao.ExemplaryMatrixApplicationDAO;

/**
 * 示范基地认证DAO实现
 * @author Administrator
 *
 */
@Repository
public class ExemplaryMatrixApplicationDAOImpl implements ExemplaryMatrixApplicationDAO{
	
	/**
	 * 用于调用mapper执行sql
	 */
	private SqlSessionTemplate sqlSessionTemplate;
	
	
	public SqlSessionTemplate getSqlSessionTemplate() {
		return sqlSessionTemplate;
	}
	
	@Resource
	public void setSqlSessionTemplate(SqlSessionTemplate sqlSessionTemplate) {
		this.sqlSessionTemplate = sqlSessionTemplate;
	}
	
	/**
	 * 通过UserCode获取申请结果
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixApplication getResultForApplicationByUserCode(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getResultForApplicationByUserCode", params);
	}
	
	/**
	 * 通过参数查询月度服务数据数量
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceDataCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getServiceDataCount", params);
	}
	
	/**
	 * 通过参数查询月度服务数据详情
	 * @param params
	 * @return
	 */
	public List<MonthlyServiceData> getServiceDataList(Map<String, String> params ,int startIndex, int pageSize){
		return this.sqlSessionTemplate.selectList("getServiceDataList", params, new RowBounds(startIndex,pageSize));
	}
	
	/**
	 * 通过参数查询月度服务能力升级数量
	 * @param params
	 * @return
	 */
	public Map<String, Object> getOfficeEquipmentCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getOfficeEquipmentCount",params);
	}
	
	/**
	 * 通过参数查询月度服务能力升级详情
	 * @param params
	 * @return
	 */
	public List<MonthlyOfficeEquipment> getOfficeEquipmentList(Map<String, String> params ,int startIndex, int pageSize){
		return this.sqlSessionTemplate.selectList("getOfficeEquipmentList", params, new RowBounds(startIndex,pageSize));
	}
	
	/**
	 * 获取季度报表详情
	 * @param params
	 * @return
	 */
	public List<QuarterStatement> getQuarterStatementList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getQuarterStatementList",params);
	}
	
	/**
	 * 新增季度报表
	 * @param quarterStatement
	 * @return
	 */
	public Integer saveQuarterStatement(QuarterStatement quarterStatement){
		return this.sqlSessionTemplate.insert("saveQuarterStatement", quarterStatement);
	}
	
	/**
	 * 更新季度报表
	 * @param quarterStatement
	 * @return
	 */
	public Integer updateQuarterStatement(QuarterStatement quarterStatement){
		return this.sqlSessionTemplate.update("updateQuarterStatement", quarterStatement);
	}
	
	/**
	 * 查看报表列表时获取基地列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> findMatrixListForStatementListCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findMatrixListForStatementListCount",params);
	}
	
	/**
	 * 查看报表列表时获取基地列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findMatrixListForStatementList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findMatrixListForStatementList", params);
	}
	
	/**
	 * 查看月报查询服务数据列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceDataListByCodeCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getServiceDataListByCodeCount",params);
	}
	
	/**
	 * 查看月报查询服务数据列表
	 * @param params
	 * @return
	 */
	public List<MonthlyServiceData> getServiceDataListByCode(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getServiceDataListByCode", params);
	}
	
	/**
	 * 查看月报查询办公设备升级总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> getOfficeEquipmentListByCodeCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getOfficeEquipmentListByCodeCount",params);
	}
	
	/**
	 * 查看月报查询办公设备升级
	 * @param params
	 * @return
	 */
	public List<MonthlyOfficeEquipment> getOfficeEquipmentListByCode(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getOfficeEquipmentListByCode", params);
	}
	
	/**
	 * 查询办公能力升级返回map
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getOfficeEquipmentListByCodeForMap(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getOfficeEquipmentListByCodeForMap", params);
	}
	
	/**
	 * 查看月报查询装修改造升级 总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> getDecorationListByCodeCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getDecorationListByCodeCount",params);
	}
	
	/**
	 * 查看月报查询装修改造升级
	 * @param params
	 * @return
	 */
	public List<MonthlyDecoration> getDecorationListByCode(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getDecorationListByCode", params);
	}
	
	/**
	 * 查看月报查询装修改造升级返回map
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getDecorationListByCodeForMap(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getDecorationListByCodeForMap", params);
	}
	
	/**
	 * 通过code获取基地信息
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixApplication getMatrixInfoByCode(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getMatrixInfoByCode", params);
	}
	
	/**
	 * 通过code获取基地信息(返回Map)
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMatrixInfoMapByCode(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getMatrixInfoMapByCode", params);
	}
	
	/**
	 * 通过年份和季度查询季度报表 
	 * @param params
	 * @return
	 */
	public QuarterStatement findStatementByParam(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findStatementByParam", params);
	}
	
	/**
	 * 新增申请表
	 * @param exemplaryMatrixApplication
	 * @return
	 */
	public Integer saveApplication(ExemplaryMatrixApplication exemplaryMatrixApplication){
		return this.sqlSessionTemplate.insert("saveApplication", exemplaryMatrixApplication);
	}
	
	/**
	 * 更新申请表
	 * @param exemplaryMatrixApplication
	 * @return
	 */
	public Integer updateApplication(ExemplaryMatrixApplication exemplaryMatrixApplication){
		return this.sqlSessionTemplate.update("updateApplication", exemplaryMatrixApplication);
	}
	
	/**
	 * 保存经营情况方法
	 * @param businessCircumstance
	 * @return
	 */
	public Integer saveBusinessCircumstance(BusinessCircumstance businessCircumstance){
		return this.sqlSessionTemplate.insert("saveBusinessCircumstance", businessCircumstance);
	}
	
	/**
	 * 通过usercode和applicationId删除经营情况列表
	 * @param params
	 * @return
	 */
	public Integer deleteBusinessCircumstanceByParams(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteBusinessCircumstanceByParams", params);
	}
	
	/**
	 * 根据userCode和applicationId获取经营情况列表
	 * @param params
	 * @return
	 */
	public List<BusinessCircumstance> getBusinessCircumstanceByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getBusinessCircumstanceByParams",params);
	}
	
	/**
	 * 根据userCode和applicationId获取经营情况列表（Map）
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getBusinessCircumstanceMapByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getBusinessCircumstanceMapByParams", params);
	}
	
	
	/**
	 * 新增合作服务机构信息 
	 * @param request
	 * @return
	 */
	public Integer saveCooperationFacilitatingAgency(CooperationFacilitatingAgency cooperationFacilitatingAgency){
		return this.sqlSessionTemplate.insert("saveCooperationFacilitatingAgency",cooperationFacilitatingAgency);
	}
	
	/**
	 * 通过userCode和applicationId删除合作服务机构信息
	 * @param params
	 * @return
	 */
	public Integer deleteCooperationFacilitatingAgencyByParams(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteCooperationFacilitatingAgencyByParams", params);
	}
	
	/**
	 * 通过userCode和applicationId获取合作服务机构信息
	 * @param params
	 * @return
	 */
	public List<CooperationFacilitatingAgency> getCooperationFacilitatingAgencyByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getCooperationFacilitatingAgencyByParams", params);
	}
	
	/**
	 * 通过userCode和applicationId获取合作服务机构信息(Map)
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getCooperationFacilitatingAgencyMapByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getCooperationFacilitatingAgencyMapByParams", params);
	}
	
	/**
	 * 新增服务功能信息
	 * @param serviceFunction
	 * @return
	 */
	public Integer saveServiceFunction(ServiceFunction serviceFunction){
		return this.sqlSessionTemplate.insert("saveServiceFunction", serviceFunction);
	}
	
	/**
	 * 通过userCode和applicationId删除服务功能信息
	 * @param params
	 * @return
	 */
	public Integer deleteServiceFunctionByParams(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteServiceFunctionByParams", params);
	}
	
	/**
	 * 通过userCode和applicationId获取服务功能信息
	 * @param params
	 * @return
	 */
	public List<ServiceFunction> getServiceFunctionByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getServiceFunctionByParams", params);
	}
	
	/**
	 * 通过userCode和applicationId获取服务功能信息(Map)
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getServiceFunctionMapByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getServiceFunctionMapByParams", params);
	}
	
	
	/**
	 * 保存管理和服务人员名单及职称情况信息
	 * @param personnelList
	 * @return
	 */
	public Integer savePersonnelList(PersonnelList personnelList){
		return this.sqlSessionTemplate.insert("savePersonnelList", personnelList);
	}
	
	/**
	 * 通过id更新管理和服务人员名单及职称情况信息
	 * @param personnelList
	 * @return
	 */
	public Integer updatePersonnelListById(PersonnelList personnelList){
		return this.sqlSessionTemplate.update("updatePersonnelListById", personnelList);
	}
	
	/**
	 * 通过id获取管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public PersonnelList getPersonnelListById(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getPersonnelListById", params);
	}
	
	/**
	 * 通过userCode和applicationId删除管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public Integer deletePersonnelListByParams(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deletePersonnelListByParams", params);
	}
	
	/**
	 * 通过userCode和applicationId获取管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public Map<String, Object> getPersonnelListByParamsCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getPersonnelListByParamsCount",params);
	}
	
	
	/**
	 * 通过userCode和applicationId获取管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public List<PersonnelList> getPersonnelListByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getPersonnelListByParams", params);
	}
	
	/**
	 * 通过userCode和applicationId获取管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getPersonnelListMapByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getPersonnelListMapByParams", params);
	}
	
	/**
	 * 保存入驻企业评价信息
	 * @param request
	 * @return
	 */
	public Integer saveEnterpriseEvaluate(EnterpriseEvaluate enterpriseEvaluate){
		return this.sqlSessionTemplate.insert("saveEnterpriseEvaluate", enterpriseEvaluate);
	}
	
	/**
	 * 通过userCode和applicationId删除入驻企业评价信息
	 * @param params
	 * @return
	 */
	public Integer deleteEnterpriseEvaluateByParams(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteEnterpriseEvaluateByParams", params);
	}
	
	/**
	 * 通过userCode和applicationId获取入驻企业评价信息
	 * @param params
	 * @return
	 */
	public List<EnterpriseEvaluate> getEnterpriseEvaluateByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getEnterpriseEvaluateByParams", params);
	}
	
	/**
	 * 通过userCode和applicationId获取入驻企业评价信息
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getEnterpriseEvaluateMapByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getEnterpriseEvaluateMapByParams", params);
	}
	
	/**
	 * 区属推荐获取列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> districtAuditGetListCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("districtAuditGetListCount", params);
	}
	
	/**
	 * 区属推荐获取列表
	 * @param params
	 * @return
	 */
	public List<Map<String, String>> districtAuditGetList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("districtAuditGetList",params);
	}
	
	/**
	 * 市级推荐获取列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> cityAuditGetListCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("cityAuditGetListCount", params);
	}
	
	/**
	 * 市级推荐获取列表
	 * @param params
	 * @return
	 */
	public List<Map<String, String>> cityAuditGetList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("cityAuditGetList", params);
	}
	
	/**
	 * 第三方推荐获取列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> thirdPartyAuditGetListCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("thirdPartyAuditGetListCount", params);
	}
	
	/**
	 * 第三方推荐获取列表
	 * @param params
	 * @return
	 */
	public List<Map<String, String>> thirdPartyAuditGetList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("thirdPartyAuditGetList", params);
	}
	
	/**
	 * 保存推荐主表信息
	 * @param exemplaryMatrixRecommend
	 * @return
	 */
	public Integer saveExemplaryMatrixRecommend(ExemplaryMatrixRecommend exemplaryMatrixRecommend){
		return this.sqlSessionTemplate.insert("saveExemplaryMatrixRecommend", exemplaryMatrixRecommend);
	}
	
	/**
	 * 根据userCode和applicationId删除推荐主表信息
	 * @param params
	 * @return
	 */
	public Integer deleteExemplaryMatrixRecommendByParams(Map<String, Object> params){
		return this.sqlSessionTemplate.delete("deleteExemplaryMatrixRecommendByParams", params);
	}
	
	/**
	 * 根据userCode和applicationId删除推荐附表方法
	 * @param params
	 * @return
	 */
	public Integer deleteExemplaryMatrixRecommendEvaluateByParams(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteExemplaryMatrixRecommendEvaluateByParams", params);
	}
	
	/**
	 * 保存推荐表附表方法
	 * @param exemplaryMatrixRecommendEvaluate
	 * @return
	 */
	public Integer saveExemplaryMatrixRecommendEvaluate(ExemplaryMatrixRecommendEvaluate exemplaryMatrixRecommendEvaluate){
		return this.sqlSessionTemplate.insert("saveExemplaryMatrixRecommendEvaluate", exemplaryMatrixRecommendEvaluate);
	}
	
	/**
	 * 通过id更新推荐表附表
	 * @param exemplaryMatrixRecommendEvaluate
	 * @return
	 */
	public Integer updateExemplaryMatrixRecommendEvaluateById(ExemplaryMatrixRecommendEvaluate exemplaryMatrixRecommendEvaluate){
		return this.sqlSessionTemplate.update("updateExemplaryMatrixRecommendEvaluateById", exemplaryMatrixRecommendEvaluate);
	}
	
	/**
	 * 通过参数获取推荐主表内容
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixRecommend getExemplaryMatrixRecommendByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getExemplaryMatrixRecommendByParams", params);
	}
	
	/**
	 * 通过参数获取推荐主表内容(Map)
	 * @param params
	 * @return
	 */
	public Map<String, Object> getExemplaryMatrixRecommendMapByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getExemplaryMatrixRecommendMapByParams", params);
	}
	
	/**
	 * 获取推荐附表
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixRecommendEvaluate> getExemplaryMatrixRecommendEvaluateList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getExemplaryMatrixRecommendEvaluateList", params);
	}
	
	/**
	 * 通过id获取推荐附表信息
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixRecommendEvaluate getExemplaryMatrixRecommendEvaluateById(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getExemplaryMatrixRecommendEvaluateById", params);
	}
	
	/**
	 * 通过id删除推荐附表信息
	 * @param params
	 * @return
	 */
	public Integer deleteExemplaryMatrixRecommendEvaluateById(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteExemplaryMatrixRecommendEvaluateById", params);
	}
	
	/**
	 * 获取推荐附表(Map)
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getExemplaryMatrixRecommendEvaluateMapList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getExemplaryMatrixRecommendEvaluateMapList", params);
	}
	
	
	/**
	 * 通过userCode 年 月 删除月度服务信息表
	 * @param params
	 * @return
	 */
	public Integer deleteMonthlyServiceData(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteMonthlyServiceData",params);
	}
	
	/**
	 * 保存月度服务信息
	 * @param monthlyServiceData
	 * @return
	 */
	public Integer saveMonthlyServiceData(MonthlyServiceData monthlyServiceData){
		return this.sqlSessionTemplate.insert("saveMonthlyServiceData", monthlyServiceData);
	}
	
	/**
	 * 通过id查询月度服务信息
	 * @param params
	 * @return
	 */
	public MonthlyServiceData getMonthlyServiceDataById(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getMonthlyServiceDataById", params);
	}
	
	/**
	 * 根据id更新月度服务信息
	 * @param monthlyServiceData
	 * @return
	 */
	public Integer updateMonthlyServiceDataById(MonthlyServiceData monthlyServiceData){
		return this.sqlSessionTemplate.selectOne("updateMonthlyServiceDataById", monthlyServiceData);
	}
	
	/**
	 * 保存月度报表——办公设备方法
	 * @param request
	 * @return
	 */
	public Integer saveMonthlyOfficeEquipment(MonthlyOfficeEquipment monthlyOfficeEquipment){
		return this.sqlSessionTemplate.insert("saveMonthlyOfficeEquipment", monthlyOfficeEquipment);
	}
	
	/**
	 * 通过userCode 年 月 删除办公设备表
	 * @param params
	 * @return
	 */
	public Integer deleteMonthlyOfficeEquipmentByParams(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteMonthlyOfficeEquipmentByParams", params);
	}
	
	/**
	 * 保存月度报表——装修改造
	 * @param request
	 * @return
	 */
	public Integer saveMonthlyDecoration(MonthlyDecoration monthlyDecoration){
		return this.sqlSessionTemplate.insert("saveMonthlyDecoration", monthlyDecoration);
	}
	
	/**
	 * 通过userCode 年 月 删除装修改造表
	 * @param params
	 * @return
	 */
	public Integer deleteMonthlyDecorationByParams(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteMonthlyDecorationByParams", params);
	}
	
	/**
	 * 通过服务类别统计数量
	 * @param params
	 * @return
	 */
	public Map<String, Object> getStatisticalByServiceType(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getStatisticalByServiceType", params);
	}
	
	/**
	 * 创业创新首页查询基地信息列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMatrixForIndexByParamsCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getMatrixForIndexByParamsCount",params);
	}
	
	/**
	 * 创业创新首页查询基地信息列表
	 * @return
	 */
	public List<Map<String, Object>> getMatrixForIndexByParams(Map<String, String> params ,int startIndex, int pageSize){
		return this.sqlSessionTemplate.selectList("getMatrixForIndexByParams", params, new RowBounds(startIndex,pageSize));
	}
	
	/**
	 * 获取办公设备升级信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getOfficeEquipmentByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getOfficeEquipmentListByCode", params);
	}
	
	/**
	 * 获取装修改造信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getDecorationByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getDecorationListByCode", params);
	}
	
	/**
	 * 20170630 获取月度报表列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMonthlyStatementListCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getMonthlyStatementListCount",params);
	}
	
	/**
	 * 20170630 获取月度报表列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getMonthlyStatementList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getMonthlyStatementList", params);
	}
	
	/**
	 * 通过userCode和年月获取月度服务信息
	 * @param params
	 * @return
	 */
	public List<MonthlyServiceData> getMonthlyServiceDataByYearAndMonth(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getMonthlyServiceDataByYearAndMonth", params);
	}
	
	/**
	 * 区级审核月度报表页面获取列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMonthlyStatementListForAuditCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getMonthlyStatementListForAuditCount", params);
	}
	
	/**
	 * 区级审核月度报表页面获取列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getMonthlyStatementListForAudit(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getMonthlyStatementListForAudit", params);
	}
	
	/**
	 * 更新月度服务数据报表
	 * @param monthlyServiceData
	 * @return
	 */
	public Integer updateMonthlyServiceData(MonthlyServiceData monthlyServiceData){
		return this.sqlSessionTemplate.update("updateMonthlyServiceData", monthlyServiceData);
	}
	
	/**
	 * 更新月度服务能力升级情况——办公设备表
	 * @param monthlyOfficeEquipment
	 * @return
	 */
	public Integer updateMonthlyOfficeEquipment(MonthlyOfficeEquipment monthlyOfficeEquipment){
		return this.sqlSessionTemplate.update("updateMonthlyOfficeEquipment", monthlyOfficeEquipment);
	}
	
	/**
	 * 更新月度服务能力升级情况——装修改造表
	 * @param monthlyDecoration
	 * @return
	 */
	public Integer updateMonthlyDecoration(MonthlyDecoration monthlyDecoration){
		return this.sqlSessionTemplate.update("updateMonthlyDecoration", monthlyDecoration);
	}
	
	/**
	 * 查看月报时获取哪年填写了报表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getMonthlyStatementYears(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getMonthlyStatementYears", params);
	}
	
	/**
	 * 查看季度报表时获取哪年填写了报表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getQuarterStatementYears(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getQuarterStatementYears", params);
	}
	
	/**
	 * 数据统计页面总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceDataStatisticsCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getServiceDataStatisticsCount", params);
	}
	
	/**
	 * 区级审核月度报表页面获取列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getServiceDataStatistics(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getServiceDataStatistics", params);
	}
	
	/**
	 * 数据统计页面查询每次服务类别服务总次数
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceCountByServiceType(Map<String, Object> params){
		return this.sqlSessionTemplate.selectOne("getServiceCountByServiceType", params);
	}
	
	/**
	 * 数据统计页面获取服务总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> getSumForService(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getSumForService", params);
	}
	
	/**
	 * 20170719添加，数据统计页面，查询服务人数总计方法
	 * @param params
	 * @return
	 */
	public Map<String, Object> getSumForPerson(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getSumForPerson", params);
	}
	
	/**
	 * 获取数据统计详细信息方法
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getServiceDataStatisticsDetailList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getServiceDataStatisticsDetailList", params);
	}
	
	/**
	 * 获取申报年限列表
	 * @return
	 */
	public List<Map<String, Object>> getApplicationYearList(){
		return this.sqlSessionTemplate.selectList("getApplicationYearList");
	}
	
	/**
	 * 递交第三方方法
	 * @param params
	 * @return
	 */
	public Integer sendToThirdParty(ExemplaryMatrixApplication exemplaryMatrixApplication){
		return this.sqlSessionTemplate.update("sendToThirdParty", exemplaryMatrixApplication);
	}
	
	/**
	 * 通过userCode获取示范基地信息
	 * @param exemplaryMatrix
	 * @return
	 */
	public ExemplaryMatrix getExemplaryMatrixByUserCode(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findExemplaryMatrixByUserCode", params);
	}
	
	/**
	 * 插入示范基地信息
	 * @param exemplaryMatrix
	 * @return
	 */
	public Integer insertExemplaryMatrix(ExemplaryMatrix exemplaryMatrix){
		return this.sqlSessionTemplate.insert("insertExemplaryMatrix", exemplaryMatrix);
	}
	
	/**
	 * 更新示范基地信息
	 * @param exemplaryMatrix
	 * @return
	 */
	public Integer updateExemplaryMatrix(ExemplaryMatrix exemplaryMatrix){
		return this.sqlSessionTemplate.update("updateExemplaryMatrix", exemplaryMatrix);
	}
	
	/**
	 * 查询哪些示范基地填写了本月月报，并将填写的示范基地月报填写状态置为1
	 * @param params
	 * @return
	 */
	public Integer updateMonthlyStatementStatus(Map<String, String> params){
		return this.sqlSessionTemplate.update("updateMonthlyStatementStatus", params);
	}
	
	/**
	 * 获取未填写当前月份月报的示范基地数量
	 * @return
	 */
	public Map<String, Object> getSumForMatrixNoMonthly(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getSumForMatrixNoMonthly",params);
	}
	
	/**
	 * 获取未填写当前月份月报的示范基地详情
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getMatrixNoMonthlyDetailList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getMatrixNoMonthlyDetailList", params);
	}
	
	/**
	 * 2018新需求，根据userCode删除基地表里的信息
	 * @param exemplaryMatrix
	 * @return
	 */
	public Integer deleteExemplaryMatrixInfoByUserCode(ExemplaryMatrix exemplaryMatrix){
		return this.sqlSessionTemplate.delete("deleteExemplaryMatrixInfoByUserCode", exemplaryMatrix);
	}
	
	/**
	 * 查询提交结果
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getSubmitResult(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getSubmitResult", params);
	}
}
