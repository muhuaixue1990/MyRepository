package com.zl.dao;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.zl.bean.ExemplaryMatrix;
import com.zl.bean.ExemplaryMatrixApplication;
import com.zl.bean.ExemplaryMatrixOnlineData;
import com.zl.bean.ExemplaryMatrixServiceData;
import com.zl.bean.ExemplaryMatrixServiceSituation;
import com.zl.bean.ExemplaryMatrixSettledEnterprise;
import com.zl.bean.ExemplaryMatrixStatementStatus;

/**
 * 示范基地后台DAO
 * @author muhuaixue
 *
 */
public interface ExemplaryMatrixBackstageDAO {

	/**
	 * 获取入驻企业列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> findSettledEnterpriseCount(Map<String, String> params);
	
	/**
	 * 获取入驻企业列表总数
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixSettledEnterprise> findSettledEnterpriseList(Map<String, String> params);
	
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
	public Integer saveSettledEnterprise(ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise);
	
	/**
	 * 通过id更新入驻企业信息
	 * @param params
	 * @return
	 */
	public Integer updateSettledEnterpriseById(ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise);
	
	/**
	 * 插入基地开展服务情况
	 * @param exemplaryMatrixServiceData
	 * @return
	 */
	public Integer saveExemplaryMatrixServiceData(ExemplaryMatrixServiceData exemplaryMatrixServiceData);
	
	public Integer updateExemplaryMatrixServiceData(ExemplaryMatrixServiceData exemplaryMatrixServiceData);
	
	/**
	 * 通过userCode，year，quarter 删除基地开展服务情况
	 * @param params
	 * @return
	 */
	public Integer deleteExemplaryMatrixServiceDataByParams(Map<String, String> params);
	
	/**
	 * 通过userCode，year，quarter 删除基地开展服务情况
	 * @param params
	 * @return
	 */
	public Integer updateExemplaryMatrixServiceDataByParams(ExemplaryMatrixServiceData exemplaryMatrixServiceData);
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixServiceData> findExemplaryMatrixServiceDataByParams(Map<String, String> params);
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据(分页)总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> findExemplaryMatrixServiceDataByParamsForPageCount(Map<String, String> params);
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据(分页)总数
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixServiceData> findExemplaryMatrixServiceDataByParamsForPage(Map<String, String> params);
	
	/**
	 * 查询当前年份和季度数据数量
	 * @param params
	 * @return
	 */
	public Map<String, Object> findStatementCountByNowTime(Map<String, String> params);
	
	/**
	 * 获取基地报表管理列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> findStatementManageListCount(Map<String, String> params);
	
	/**
	 * 获取基地报表管理列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findStatementManageList(Map<String, String> params);
	
	/**
	 * 查询符合完成时间条件的活动id集合
	 */
	public List<Map<String, Object>> findActivityIdList(Map<String, String> params);
	
	/**
	 * 根据活动id查询该活动服务人数
	 * @param params
	 * @return
	 */
	public Map<String, Object> findPersonCountByActivityId(Map<String, String> params);
	
	/**
	 * 查询线下活动数据
	 * @param params
	 * @return
	 */
	public Map<String, Object> findOfflineActivityCount(Map<String, String> params);
	
	/**
	 * 查询线上活动数据
	 * @param params
	 * @return
	 */
	public Map<String, Object> findOnlineActivityCount(Map<String, String> params);
	
	/**
	 * 获取区级报表审核列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> findStatementAuditListCount(Map<String, String> params);
	
	/**
	 * 获取区级报表审核列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findStatementAuditList(Map<String, String> params);
	
	/**
	 * 根据id获取申请表信息
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixApplication findApplicationById(Map<String, String> params);
	
	/**
	 * 查询已经填写了报表的年份和季度
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findHaveQuarterStatementTime(Map<String, String> params);
	
	/**
	 * 查询发布信息的数量
	 * @param params
	 * @return
	 */
	public Map<String, Object> findPublishInfo(Map<String, String> params);
	
	/**
	 * 根据参数删除服务情况
	 * @param params
	 * @return
	 */
	public Integer deleteExemplaryMatrixServiceSituationByParam(Map<String, String> params);
	
	/**
	 * 插入服务情况
	 * @param exemplaryMatrixServiceSituation
	 * @return
	 */
	public Integer saveExemplaryMatrixServiceSituation(ExemplaryMatrixServiceSituation exemplaryMatrixServiceSituation);
	
	/**
	 * 通过userCode，year，quarter获取服务情况汇总信息
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixServiceSituation> findExemplaryMatrixServiceSituationByParams(Map<String, String> params);
	
	/**
	 * 查询投融资金额
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixServiceSituation findFinancingAmountByParams(Map<String, String> params);
	
	/**
	 * 根据参数更新服务情况汇总表
	 * @param exemplaryMatrixServiceSituation
	 * @return
	 */
	public Integer updateExemplaryMatrixServiceSituationByParams(ExemplaryMatrixServiceSituation exemplaryMatrixServiceSituation);
	
	/**
	 * 通过userCode获取基地基本信息
	 * @param params
	 * @return
	 */
	public Map<String, Object> findMatrixBaseInfoByUserCode(Map<String, String> params);
	
	/**
	 * 数据统计页面，通过参数获取基地信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findMatrixInfoByParams(Map<String, String> params);
	
	/**
	 * 获取一个区的示范基地信息
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrix> findExemplaryMatrixsByDistrict(Map<String, String> params);
	
	/**
	 * 
	 * @param params
	 * @return
	 */
	public Map<String, Object> findDistrictCountByParams(Map<String, String> params);
	
	/**
	 * 
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findDistrictListByParams(Map<String, String> params);
	
	public List<LinkedHashMap<String, Object>> findDistrictListByParamsForExport(Map<String, String> params);
	
	/**
	 * 
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findServiceList(Map<String, String> params);
	
	/**
	 * 
	 * @param exemplaryMatrixOnlineData
	 * @return
	 */
	public Integer insertExemplaryMatrixOnlineData(ExemplaryMatrixOnlineData exemplaryMatrixOnlineData);
	
	/**
	 * 
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixOnlineData> findExemplaryMatrixOnlineDataByParam(Map<String, String> params);
	
	public ExemplaryMatrixOnlineData findOneExemplaryMatrixOnlineData(ExemplaryMatrixOnlineData exemplaryMatrixOnlineData);
	
	public Map<String, Object> findOnlineDataListCount(Map<String, String> params);
	public List<ExemplaryMatrixOnlineData> findOnlineDataList(Map<String, String> params);
	
	public Map<String, Object> findOfflineDataListCount(Map<String, String> params);
	public List<ExemplaryMatrixServiceData> findOfflineDataList(Map<String, String> params);
	
	public Integer deleteOnlineDataById(Map<String, String> params);
	public Integer deleteServiceDataById(Map<String, String> params);
	
	public ExemplaryMatrixOnlineData findOnlineDataById(Map<String, String> params);
	
	public Integer updateOnlineDataTypeByServiceId(ExemplaryMatrixOnlineData exemplaryMatrixOnlineData);
	
	/**
	 * 通过userCode year quarter查询报表状态列表
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixStatementStatus> getStatusListByParams(Map<String, String> params);
	
	/**
	 * 通过userCode year quarter 表格名称 查询表格状态
	 * @return
	 */
	public ExemplaryMatrixStatementStatus getStatementStatusByParams(ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus);
	
	/**
	 * 插入报表状态
	 * @param exemplaryMatrixStatementStatus
	 * @return
	 */
	public Integer insertStatementStatus(ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus);
	
	/**
	 * 更新报表状态
	 * @param exemplaryMatrixStatementStatus
	 * @return
	 */
	public Integer updateStatementStatus(ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus);
	
	/**
	 * 通过usercode year quarter获取审核结果
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixServiceData getAuditResult(Map<String, String> params);
	
}
