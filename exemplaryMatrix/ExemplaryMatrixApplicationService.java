package com.zl.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;



import com.zl.bean.BusinessCircumstance;
import com.zl.bean.CooperationFacilitatingAgency;
import com.zl.bean.EnterpriseEvaluate;
import com.zl.bean.ExemplaryMatrix;
import com.zl.bean.ExemplaryMatrixApplication;
import com.zl.bean.ExemplaryMatrixRecommend;
import com.zl.bean.ExemplaryMatrixRecommendEvaluate;
import com.zl.bean.MonthlyServiceData;
import com.zl.bean.PersonnelList;
import com.zl.bean.QuarterStatement;
import com.zl.bean.ServiceFunction;

/**
 * 示范基地认证service
 * @author Administrator
 *
 */
public interface ExemplaryMatrixApplicationService {
	/**
	 * 新增示范基地申请表
	 * @param exemplaryMatrixApplication
	 * @return
	 */
	public Integer saveExemplaryMatrixApplication(ExemplaryMatrixApplication exemplaryMatrixApplication);
	
	/**
	 * 通过UserCode获取申请结果
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixApplication getResultForApplicationByUserCode(Map<String, String> params);
	
	/**
	 * 获取月度服务数据列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceDataList(Map<String, String> params);
	
	/**
	 * 获取月度服务能力升级情况列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getOfficeEquipmentList(Map<String, String> params);
	
	/**
	 * 获取季度列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getQuarterStatementList(Map<String, String> params);
	
	/**
	 * 新增季度报表
	 * @param quarterStatement
	 * @return
	 */
	public Integer saveQuarterStatement(QuarterStatement quarterStatement);
	
	/**
	 * 查看报表列表时获取基地列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> findMatrixListForStatementList(Map<String, String> params);
	
	/**
	 * 查看月报查询服务数据列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceDataListByCode(Map<String, String> params);
	
	/**
	 * 查看月报查询办公设备升级
	 * @param params
	 * @return
	 */
	public Map<String, Object> getOfficeEquipmentListByCode(Map<String, String> params);
	
	/**
	 * 查看月报查询装修改造升级 
	 * @param params
	 * @return
	 */
	public Map<String, Object> getDecorationListByCode(Map<String, String> params);
	
	/**
	 * 通过code获取基地信息
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixApplication getMatrixInfoByCode(Map<String, String> params);
	
	/**
	 * 通过code获取基地信息(返回Map)
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMatrixInfoMapByCode(Map<String, String> params);
	
	/**
	 * 通过年份和季度查询季度报表 
	 * @param params
	 * @return
	 */
	public QuarterStatement findStatementByParam(Map<String, String> params);
	
	/**
	 * 保存/更新申请表
	 * @param exemplaryMatrixApplication
	 * @return
	 */
	public Map<String, Integer> saveOrUpdateApplication(ExemplaryMatrixApplication exemplaryMatrixApplication);
	
	/**
	 * 保存经营情况方法
	 * @param request
	 * @return
	 */
	public Integer saveBusinessCircumstance(HttpServletRequest request);
	
	/**
	 * 根据userCode和applicationId获取经营情况列表
	 * @param params
	 * @return
	 */
	public List<BusinessCircumstance> getBusinessCircumstanceByParams(Map<String, String> params);
	
	/**
	 * 根据userCode和applicationId获取经营情况列表（Map）
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getBusinessCircumstanceMapByParams(Map<String, String> params);
	
	/**
	 * 新增合作服务机构信息 
	 * @param request
	 * @return
	 */
	public Integer saveCooperationFacilitatingAgency(HttpServletRequest request);
	
	/**
	 * 通过userCode和applicationId获取合作服务机构信息
	 * @param params
	 * @return
	 */
	public List<CooperationFacilitatingAgency> getCooperationFacilitatingAgencyByParams(Map<String, String> params);
	
	/**
	 * 通过userCode和applicationId获取合作服务机构信息(Map)
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getCooperationFacilitatingAgencyMapByParams(Map<String, String> params);
	
	/**
	 * 新增服务功能信息
	 * @param request
	 * @return
	 */
	public Integer saveServiceFunction(HttpServletRequest request);
	
	/**
	 * 通过userCode和applicationId获取服务功能信息
	 * @param params
	 * @return
	 */
	public List<ServiceFunction> getServiceFunctionByParams(Map<String, String> params);
	
	/**
	 * 通过userCode和applicationId获取服务功能信息(Map)
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getServiceFunctionMapByParams(Map<String, String> params);
	
	/**
	 * 保存管理和服务人员名单及职称情况信息
	 * @param request
	 * @return
	 */
	public Integer savePersonnelList(PersonnelList personnelList);
	
	/**
	 * 通过id获取管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public PersonnelList getPersonnelListById(Map<String, String> params);
	
	/**
	 * 通过id删除管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public Integer deletePersonnelListById(Map<String, String> params);
	
	/**
	 * 通过userCode和applicationId获取管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public Map<String, Object> getPersonnelListByParams(Map<String, String> params);
	
	public List<PersonnelList> getPersonnelListByParamsNoPage(Map<String, String> params);
	
	
	/**
	 * 通过userCode和applicationId获取管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getPersonnelListMapByParams(Map<String, String> params);
	
	/**
	 * 保存入驻企业评价信息
	 * @param request
	 * @return
	 */
	public Integer saveEnterpriseEvaluate(HttpServletRequest request);
	
	/**
	 * 通过userCode和applicationId获取入驻企业评价信息
	 * @param params
	 * @return
	 */
	public List<EnterpriseEvaluate> getEnterpriseEvaluateByParams(Map<String, String> params);
	
	/**
	 * 通过userCode和applicationId获取入驻企业评价信息
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getEnterpriseEvaluateMapByParams(Map<String, String> params);
	
	/**
	 * 区属推荐获取列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> districtAuditGetList(Map<String, String> params);
	
	/**
	 * 市级审核获取列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> cityAuditGetList(Map<String, String> params);
	
	/**
	 * 第三方审核获取列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> thirdPartyAuditGetList(Map<String, String> params);
	
	/**
	 * 保存推荐主表信息
	 * @param exemplaryMatrixRecommend
	 * @return
	 */
	public Integer saveExemplaryMatrixRecommend(ExemplaryMatrixRecommend exemplaryMatrixRecommend);
	
	/**
	 * 保存推荐表附表方法
	 * @param request
	 * @return
	 */
	public Integer saveExemplaryMatrixRecommendEvaluate(HttpServletRequest request);
	
	/**
	 * 保存推荐表附表方法(新)
	 * @param request
	 * @return
	 */
	public Integer saveExemplaryMatrixRecommendEvaluateNew(ExemplaryMatrixRecommendEvaluate exemplaryMatrixRecommendEvaluate);
	
	/**
	 * 审核操作
	 * @param params
	 * @return
	 */
	public Integer audit(Map<String, String> params);
	
	/**
	 * 通过参数获取推荐主表内容
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixRecommend getExemplaryMatrixRecommendByParams(Map<String, String> params);
	
	/**
	 * 通过参数获取推荐主表内容(Map)
	 * @param params
	 * @return
	 */
	public Map<String, Object> getExemplaryMatrixRecommendMapByParams(Map<String, String> params);
	
	/**
	 * 获取推荐附表
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixRecommendEvaluate> getExemplaryMatrixRecommendEvaluateList(Map<String, String> params);
	
	/**
	 * 通过id获取推荐附表信息
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixRecommendEvaluate getExemplaryMatrixRecommendEvaluateById(Map<String, String> params);
	
	/**
	 * 通过id删除推荐附表信息
	 * @param params
	 * @return
	 */
	public Integer deleteExemplaryMatrixRecommendEvaluateById(Map<String, String> params);
	
	/**
	 * 获取推荐附表(Map)
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getExemplaryMatrixRecommendEvaluateMapList(Map<String, String> params);
	
	/**
	 * 保存月度服务信息
	 * @param monthlyServiceData
	 * @return
	 */
	public Integer saveMonthlyServiceData(HttpServletRequest request);
	
	/**
	 * 通过id查询月度服务信息
	 * @param params
	 * @return
	 */
	public MonthlyServiceData getMonthlyServiceDataById(Map<String, String> params);
	
	/**
	 * 保存月度报表——办公设备方法
	 * @param request
	 * @return
	 */
	public Integer saveMonthlyOfficeEquipment(HttpServletRequest request);
	
	/**
	 * 保存月度报表——装修改造
	 * @param request
	 * @return
	 */
	public Integer saveMonthlyDecoration(HttpServletRequest request);
	
	/**
	 * 通过服务类别统计数量
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getStatisticalByServiceType(Map<String, String> params);
	
	/**
	 * 创业创新首页查询基地信息列表
	 * @return
	 */
	public Map<String, Object> getMatrixForIndexByParams(Map<String, String> params);
	
	/**
	 * 提交申请
	 * @param params
	 * @return
	 */
	public Integer submitMatrixApplication(Map<String, String> params);
	
	/**
	 * 通过年月信息获取办公设备升级装修改造升级记录
	 * @param params
	 * @return
	 */
	public Map<String, List<Map<String, Object>>> getOfficeEquipmentAndDecorationByParams(Map<String, String> params);
	
	/**
	 * 20170630 获取月度报表列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMonthlyStatementList(Map<String, String> params);
	
	/**
	 * 通过userCode和年月获取月度服务信息
	 * @param params
	 * @return
	 */
	public List<MonthlyServiceData> getMonthlyServiceDataByYearAndMonth(Map<String, String> params);
	
	/**
	 * 区级审核月度报表页面获取列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMonthlyStatementListForAudit(Map<String, String> params);
	
	/**
	 * 区级审核月度报表操作
	 * @param params
	 * @return
	 */
	public Integer districtAuditStatement(Map<String, String> params);
	
	/**
	 * 查看月报时获取哪年填写了报表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getMonthlyStatementYears(Map<String, String> params);
	
	/**
	 * 查看季度报表时获取哪年填写了报表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getQuarterStatementYears(Map<String, String> params);
	
	/**
	 * 数据统计页面获取信息
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceDataStatistics(Map<String, String> params);
	
	/**
	 * 数据统计页面获取服务总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> getSumForService(Map<String, String> params);
	
	/**
	 * 获取数据统计详细信息方法
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceDataStatisticsDetailList(Map<String, String> params);
	
	/**
	 * 获取申报年限列表
	 * @return
	 */
	public List<Map<String, Object>> getApplicationYearList();
	
	/**
	 * 递交第三方方法
	 * @param params
	 * @return
	 */
	public Integer sendToThirdParty(Map<String, String> params);
	
	/**
	 * 提交月报
	 * @param params
	 * @return
	 */
	public Integer submitMonthlyStatement(Map<String, String> params);
	
	/**
	 * 提交月报
	 * @param params
	 * @return
	 */
	public Integer submitMonthlyStatementSeven(Map<String, String> params);
	
	/**
	 * 获取未填写当前月份月报的示范基地数量
	 * @return
	 */
	public Map<String, Object> getSumForMatrixNoMonthly(Map<String, String> params);
	
	/**
	 * 获取未填写当前月份月报的示范基地详情
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMatrixNoMonthlyDetailList(Map<String, String> params);
	
	/**
	 * 2018新增需求，区级将示范基地信息退回
	 * @param params
	 * @return
	 */
	public Integer sendBackMatrixInfo(Map<String , String > params);

	/**
	 * 通过userCode获取示范基地表信息，用来验证该基地是否示范基地
	 * @param params
	 * @return
	 */
	public ExemplaryMatrix findExemplaryMatrixInfoByUserCode(Map<String, String> params);
	
}
