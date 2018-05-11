package com.zl.service;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.zl.bean.ExemplaryMatrixApplication;
import com.zl.bean.ExemplaryMatrixOnlineData;
import com.zl.bean.ExemplaryMatrixServiceData;
import com.zl.bean.ExemplaryMatrixServiceSituation;
import com.zl.bean.ExemplaryMatrixSettledEnterprise;
import com.zl.bean.ExemplaryMatrixStatementStatus;

/**
 * 示范基地后台Service
 * @author muhuaixue
 *
 */
public interface ExemplaryMatrixBackstageService {

	/**
	 * 获取入驻企业列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> findSettledEnterpriseList(Map<String, String> params);
	
	/**
	 * 通过id获取入驻企业信息
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixSettledEnterprise findSettledEnterpriseById(Map<String, String> params);
	
	
	/**
	 * 通过id删除入驻企业信息
	 * @param params
	 * @return
	 */
	public Integer deleteSettledEnterpriseById(Map<String, String> params);
	
	/**
	 * 插入入驻企业信息
	 * @param exemplaryMatrixSettledEnterprise
	 * @return
	 */
	public Integer saveOrUpdateSettledEnterprise(ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise);
	
	/**
	 * 上传入驻企业信息
	 * @param filePath
	 * @param id
	 * @param time
	 * @return
	 * @throws IOException
	 */
	public Integer saveSettledEnterpriseForFile(String filePath,String userCode) throws IOException;
	
	/**
	 * 通过id更新入驻企业信息
	 * @param params
	 * @return
	 */
	public Integer updateSettledEnterpriseById(ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise);
	
	/**
	 * 插入基地开展服务情况
	 * @param request
	 * @return
	 */
	public Integer saveExemplaryMatrixServiceData(ExemplaryMatrixServiceData exemplaryMatrixServiceData);
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixServiceData> findExemplaryMatrixServiceDataByParams(Map<String, String> params);
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据(分页)
	 * @param params
	 * @return
	 */
	public Map<String, Object> findExemplaryMatrixServiceDataByParamsForPage(Map<String, String> params);
	
	/**
	 * 获取基地报表管理列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findStatementManageList(Map<String, String> params);
	
	/**
	 * 根据userCode，year，quarter统计这个季度的服务数据方法
	 * @param params
	 * @return
	 */
	public Map<String, Object> findServieDataByParam(Map<String, String> params);
	
	/**
	 * 获取区级报表审核列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> findStatementAuditList(Map<String, String> params);
	
	/**
	 * 获取区级报表审核列表信息，不分页
	 * @param params
	 * @return
	 */
	public Map<String, Object> findStatementAuditListNoPage(Map<String, String> params);
	
	/**
	 * 为导出季度报表处理数据
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> disposeDataForExportQuarterStatement(Map<String, String> params);
	
	/**
	 * 为导出年度报表处理数据
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> disposeDataForExportYearStatement(Map<String, String> params);
	
	/**
	 * 查询已经填写了报表的年份和季度
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findHaveQuarterStatementTime(Map<String, String> params);
	
	/**
	 * 保存服务情况汇总
	 * @param request
	 * @return
	 */
	public Integer saveExemplaryMatrixServiceSituation(HttpServletRequest request);
	
	/**
	 * 通过userCode，year，quarter获取服务情况汇总信息
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixServiceSituation> findExemplaryMatrixServiceSituationByParams(Map<String, String> params);
	
	/**
	 * 通过userCode获取基地基本信息
	 * @param params
	 * @return
	 */
	public Map<String, Object> findMatrixBaseInfoByUserCode(Map<String, String> params);
	
	/**
	 * 根据参数获取服务能力提升数据
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> findServiceAbilityPromoteByParams(Map<String, String> params);
	
	/**
	 * 获取基地服务情况数据
	 * @param params
	 * @return
	 */
	public Map<String, String> findMatrixServiceInfo(Map<String, String> params);
	
	/**
	 * 通过区编号获取该区的示范基地列表
	 * @param parasm
	 * @return
	 */
	public List<Map<String, Object>> findMatrixListByDistrict(Map<String, String> params);
	
	/**
	 * 获取线上活动数据方法
	 * @return
	 */
	public Map<String, Integer> getOnlineData(String userCode , String serviceSort , Integer year , Integer quarter,String serviceForMatrix);
	
	/**
	 * 获取线上活动数据方法(有审核条件的)
	 * @return
	 */
	public Map<String, Object> getOnlineDataForAuditType(String userCode , String serviceSort , Integer year , Integer quarter,String auditType);
	
	/**
	 * 获取线下数据方法
	 * @param userCode
	 * @param serviceSort
	 * @param year
	 * @param quarter
	 * @return
	 */
	public Map<String, Object> getOfflineData(String userCode , String serviceSort , Integer year , Integer quarter, String auditType);
	
	/**
	 * 数据统计页面，根据条件各种统计
	 * @param params
	 * @return
	 */
	public Map<String, Integer> findServiceCount(Map<String, String> params);
	
	/**
	 * 数据统计页面，获取线上数据详情
	 * @param params
	 * @return
	 */
	public Map<String, Object> findOnlineDataDetail(Map<String, String> params);
	
	/**
	 * 市级导出增加导出各个区的数据
	 * TODO
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> exportQuarterStatementForCity(Map<String, String> params);
	
	/**
	 * 市级统计页面列表页
	 * @param params
	 * @return
	 */
	public Map<String, Object> findServiceDataStatisticsCity(Map<String, String> params);
	
	public Map<String, Object> findOnlineDataList(Map<String, String> params);
	
	public Map<String, Object> findOfflineDataList(Map<String, String> params);
	
	public Integer deleteServiceDataById(Map<String, String> params);
	
	public ExemplaryMatrixOnlineData findOnlineDataById(Map<String, String> params);
	
	/**
	 * 保存或更新报表填写状态
	 * @param exemplaryMatrixStatementStatus
	 * @return
	 */
	public Integer insertOrUpdateStatementStatus(ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus);
}
