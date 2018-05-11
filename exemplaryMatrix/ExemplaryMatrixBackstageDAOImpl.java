package com.zl.dao.impl;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.itextpdf.text.pdf.PdfStructTreeController.returnType;
import com.zl.bean.ExemplaryMatrix;
import com.zl.bean.ExemplaryMatrixApplication;
import com.zl.bean.ExemplaryMatrixOnlineData;
import com.zl.bean.ExemplaryMatrixServiceData;
import com.zl.bean.ExemplaryMatrixServiceSituation;
import com.zl.bean.ExemplaryMatrixSettledEnterprise;
import com.zl.bean.ExemplaryMatrixStatementStatus;
import com.zl.dao.ExemplaryMatrixBackstageDAO;

/**
 * 示范基地后台DAO实现
 * @author muhuaixue
 *
 */
@Repository
public class ExemplaryMatrixBackstageDAOImpl implements ExemplaryMatrixBackstageDAO{
	
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
	 * 获取入驻企业列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> findSettledEnterpriseCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findSettledEnterpriseCount", params);
	}
	
	/**
	 * 获取入驻企业列表总数
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixSettledEnterprise> findSettledEnterpriseList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findSettledEnterpriseList", params);
	}
	
	/**
	 * 通过id获取入驻企业信息
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixSettledEnterprise findSettledEnterpriseById(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findSettledEnterpriseById", params);
	}
	
	/**
	 * 通过id删除入驻企业信息
	 * @param params
	 * @return
	 */
	public Integer deleteSettledEnterpriseById(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteSettledEnterpriseById", params);
	}
	
	/**
	 * 插入入驻企业信息
	 * @param exemplaryMatrixSettledEnterprise
	 * @return
	 */
	public Integer saveSettledEnterprise(ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise){
		return this.sqlSessionTemplate.insert("saveSettledEnterprise", exemplaryMatrixSettledEnterprise);
	}
	
	/**
	 * 通过id更新入驻企业信息
	 * @param params
	 * @return
	 */
	public Integer updateSettledEnterpriseById(ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise){
		return this.sqlSessionTemplate.update("updateSettledEnterpriseById", exemplaryMatrixSettledEnterprise);
	}
	
	/**
	 * 插入基地开展服务情况
	 * @param exemplaryMatrixServiceData
	 * @return
	 */
	public Integer saveExemplaryMatrixServiceData(ExemplaryMatrixServiceData exemplaryMatrixServiceData){
		return this.sqlSessionTemplate.insert("saveExemplaryMatrixServiceData", exemplaryMatrixServiceData);
	}
	
	public Integer updateExemplaryMatrixServiceData(ExemplaryMatrixServiceData exemplaryMatrixServiceData){
		return this.sqlSessionTemplate.update("updateExemplaryMatrixServiceData", exemplaryMatrixServiceData);
	}
	
	/**
	 * 通过userCode，year，quarter 删除基地开展服务情况
	 * @param params
	 * @return
	 */
	public Integer deleteExemplaryMatrixServiceDataByParams(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteExemplaryMatrixServiceDataByParams", params);
	}
	
	/**
	 * 通过userCode，year，quarter 删除基地开展服务情况
	 * @param params
	 * @return
	 */
	public Integer updateExemplaryMatrixServiceDataByParams(ExemplaryMatrixServiceData exemplaryMatrixServiceData){
		return this.sqlSessionTemplate.update("updateExemplaryMatrixServiceDataByParams", exemplaryMatrixServiceData);
	}
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixServiceData> findExemplaryMatrixServiceDataByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findExemplaryMatrixServiceDataByParams", params);
	}
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据(分页)总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> findExemplaryMatrixServiceDataByParamsForPageCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findExemplaryMatrixServiceDataByParamsForPageCount", params);
	}
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据(分页)总数
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixServiceData> findExemplaryMatrixServiceDataByParamsForPage(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findExemplaryMatrixServiceDataByParamsForPage", params);
	}
	
	/**
	 * 查询当前年份和季度数据数量
	 * @param params
	 * @return
	 */
	public Map<String, Object> findStatementCountByNowTime(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findStatementCountByNowTime", params);
	}
	
	
	/**
	 * 获取基地报表管理列表总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> findStatementManageListCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findStatementManageListCount", params);
	}
	
	/**
	 * 获取基地报表管理列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findStatementManageList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findStatementManageList", params);
	}
	
	/**
	 * 查询符合完成时间条件的活动id集合
	 */
	public List<Map<String, Object>> findActivityIdList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findActivityIdList", params);
	}
	
	/**
	 * 根据活动id查询该活动服务人数
	 * @param params
	 * @return
	 */
	public Map<String, Object> findPersonCountByActivityId(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findPersonCountByActivityId", params);
	}
	
	/**
	 * 查询线下活动数据
	 * @param params
	 * @return
	 */
	public Map<String, Object> findOfflineActivityCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findOfflineActivityCount", params);
	}
	
	/**
	 * 查询线上活动数据
	 * @param params
	 * @return
	 */
	public Map<String, Object> findOnlineActivityCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findOnlineActivityCount", params);
	}
	
	/**
	 * 获取区级报表审核列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> findStatementAuditListCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findStatementAuditListCount", params);
	}
	
	/**
	 * 获取区级报表审核列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findStatementAuditList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findStatementAuditList", params);
	}
	
	/**
	 * 根据id获取申请表信息
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixApplication findApplicationById(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findApplicationById", params);
	}
	
	/**
	 * 查询已经填写了报表的年份和季度
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findHaveQuarterStatementTime(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findHaveQuarterStatementTime", params);
	}
	
	/**
	 * 查询发布信息的数量
	 * @param params
	 * @return
	 */
	public Map<String, Object> findPublishInfo(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findPublishInfo", params);
	}
	
	/**
	 * 根据参数删除服务情况
	 * @param params
	 * @return
	 */
	public Integer deleteExemplaryMatrixServiceSituationByParam(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteExemplaryMatrixServiceSituationByParam", params);
	}
	
	/**
	 * 插入服务情况
	 * @param exemplaryMatrixServiceSituation
	 * @return
	 */
	public Integer saveExemplaryMatrixServiceSituation(ExemplaryMatrixServiceSituation exemplaryMatrixServiceSituation){
		return this.sqlSessionTemplate.insert("saveExemplaryMatrixServiceSituation", exemplaryMatrixServiceSituation);
	}
	
	/**
	 * 通过userCode，year，quarter获取服务情况汇总信息
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixServiceSituation> findExemplaryMatrixServiceSituationByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findExemplaryMatrixServiceSituationByParams", params);
	}
	
	/**
	 * 查询投融资金额
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixServiceSituation findFinancingAmountByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findFinancingAmountByParams", params);
	}
	
	/**
	 * 根据参数更新服务情况汇总表
	 * @param exemplaryMatrixServiceSituation
	 * @return
	 */
	public Integer updateExemplaryMatrixServiceSituationByParams(ExemplaryMatrixServiceSituation exemplaryMatrixServiceSituation){
		return this.sqlSessionTemplate.update("updateExemplaryMatrixServiceSituationByParams", exemplaryMatrixServiceSituation);
	}
	
	/**
	 * 通过userCode获取基地基本信息
	 * @param params
	 * @return
	 */
	public Map<String, Object> findMatrixBaseInfoByUserCode(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findMatrixBaseInfoByUserCode", params);
	}
	
	/**
	 * 数据统计页面，通过参数获取基地信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findMatrixInfoByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findMatrixInfoByParams", params);
	}
	
	/**
	 * 获取一个区的示范基地信息
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrix> findExemplaryMatrixsByDistrict(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findExemplaryMatrixsByDistrict", params);
	}
	
	/**
	 * 
	 * @param params
	 * @return
	 */
	public Map<String, Object> findDistrictCountByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findDistrictCountByParams",params);
	}
	
	/**
	 * 
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findDistrictListByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findDistrictListByParams", params);
	}
	
	public List<LinkedHashMap<String, Object>> findDistrictListByParamsForExport(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findDistrictListByParamsForExport", params);
	}
	
	/**
	 * 
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findServiceList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findServiceList", params);
	}
	
	/**
	 * 
	 * @param exemplaryMatrixOnlineData
	 * @return
	 */
	public Integer insertExemplaryMatrixOnlineData(ExemplaryMatrixOnlineData exemplaryMatrixOnlineData){
		return this.sqlSessionTemplate.insert("insertExemplaryMatrixOnlineData", exemplaryMatrixOnlineData);
	}
	/**
	 * 
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixOnlineData> findExemplaryMatrixOnlineDataByParam(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findExemplaryMatrixOnlineDataByParam", params);
	}
	
	public ExemplaryMatrixOnlineData findOneExemplaryMatrixOnlineData(ExemplaryMatrixOnlineData exemplaryMatrixOnlineData){
		return this.sqlSessionTemplate.selectOne("findOneExemplaryMatrixOnlineData", exemplaryMatrixOnlineData);
	}
	
	public Map<String, Object> findOnlineDataListCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findOnlineDataListCount", params);
	}
	public List<ExemplaryMatrixOnlineData> findOnlineDataList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findOnlineDataList", params);
	}
	
	
	public Map<String, Object> findOfflineDataListCount(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findOfflineDataListCount", params);
	}
	public List<ExemplaryMatrixServiceData> findOfflineDataList(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("findOfflineDataList", params);
	}
	
	public Integer deleteOnlineDataById(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteOnlineDataById", params);
	}
	
	public Integer deleteServiceDataById(Map<String, String> params){
		return this.sqlSessionTemplate.delete("deleteServiceDataById", params);
	}
	
	public ExemplaryMatrixOnlineData findOnlineDataById(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("findOnlineDataById", params);
	}
	public Integer updateOnlineDataTypeByServiceId(ExemplaryMatrixOnlineData exemplaryMatrixOnlineData){
		return this.sqlSessionTemplate.update("updateOnlineDataTypeByServiceId",exemplaryMatrixOnlineData);
	}
	
	/**
	 * 通过userCode year quarter查询报表状态列表
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixStatementStatus> getStatusListByParams(Map<String, String> params){
		return this.sqlSessionTemplate.selectList("getStatusListByParams", params);
	}
	
	/**
	 * 通过userCode year quarter 表格名称 查询表格状态
	 * @return
	 */
	public ExemplaryMatrixStatementStatus getStatementStatusByParams(ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus){
		return this.sqlSessionTemplate.selectOne("getStatementStatusByParams", exemplaryMatrixStatementStatus);
	}
	
	/**
	 * 插入报表状态
	 * @param exemplaryMatrixStatementStatus
	 * @return
	 */
	public Integer insertStatementStatus(ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus){
		return this.sqlSessionTemplate.insert("insertStatementStatus", exemplaryMatrixStatementStatus);
	}
	
	/**
	 * 更新报表状态
	 * @param exemplaryMatrixStatementStatus
	 * @return
	 */
	public Integer updateStatementStatus(ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus){
		return this.sqlSessionTemplate.update("updateStatementStatus", exemplaryMatrixStatementStatus);
	}
	
	/**
	 * 通过usercode year quarter获取审核结果
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixServiceData getAuditResult(Map<String, String> params){
		return this.sqlSessionTemplate.selectOne("getAuditResult",params);
	}
}
