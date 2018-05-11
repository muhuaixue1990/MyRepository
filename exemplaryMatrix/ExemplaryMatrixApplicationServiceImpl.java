package com.zl.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itextpdf.text.pdf.PdfStructTreeController.returnType;
import com.zl.bean.BusinessCircumstance;
import com.zl.bean.CooperationFacilitatingAgency;
import com.zl.bean.EnterpriseEvaluate;
import com.zl.bean.ExemplaryMatrix;
import com.zl.bean.ExemplaryMatrixApplication;
import com.zl.bean.ExemplaryMatrixRecommend;
import com.zl.bean.ExemplaryMatrixRecommendEvaluate;
import com.zl.bean.ExemplaryMatrixServiceData;
import com.zl.bean.ExemplaryMatrixServiceSituation;
import com.zl.bean.ExemplaryMatrixStatementStatus;
import com.zl.bean.MonthlyDecoration;
import com.zl.bean.MonthlyOfficeEquipment;
import com.zl.bean.MonthlyServiceData;
import com.zl.bean.PersonnelList;
import com.zl.bean.QuarterStatement;
import com.zl.bean.ServiceFunction;
import com.zl.bean.SysCode;
import com.zl.dao.ExemplaryMatrixApplicationDAO;
import com.zl.dao.ExemplaryMatrixBackstageDAO;
import com.zl.dao.SysCodeDAO;
import com.zl.service.BaseService;
import com.zl.service.ExemplaryMatrixApplicationService;
import com.zl.service.ExemplaryMatrixBackstageService;
import com.zl.utils.LoadPropperties;
import com.zl.utils.PageBean;

/**
 * 示范基地认证service实现
 * @author Administrator
 *
 */
@Service
@Transactional
public class ExemplaryMatrixApplicationServiceImpl extends BaseService implements ExemplaryMatrixApplicationService{
	
	/**
	 * 示范基地认证dao
	 */
	private ExemplaryMatrixApplicationDAO exemplaryMatrixApplicationDAO;
	
	/**
	 * 示范基地后台dao
	 */
	private ExemplaryMatrixBackstageDAO exemplaryMatrixBackstageDAO;
	
	/**
	 * 示范基地后台Service
	 */
	private ExemplaryMatrixBackstageService exemplaryMatrixBackstageService;
	
	private SysCodeDAO sysCodeDAO;
	
	@Resource
	public void setExemplaryMatrixApplicationDAO(
			ExemplaryMatrixApplicationDAO exemplaryMatrixApplicationDAO) {
		this.exemplaryMatrixApplicationDAO = exemplaryMatrixApplicationDAO;
	}
	
	
	@Resource
	public void setSysCodeDAO(SysCodeDAO sysCodeDAO) {
		this.sysCodeDAO = sysCodeDAO;
	}

	@Resource
	public void setExemplaryMatrixBackstageDAO(
			ExemplaryMatrixBackstageDAO exemplaryMatrixBackstageDAO) {
		this.exemplaryMatrixBackstageDAO = exemplaryMatrixBackstageDAO;
	}

	
	@Resource
	public void setExemplaryMatrixBackstageService(
			ExemplaryMatrixBackstageService exemplaryMatrixBackstageService) {
		this.exemplaryMatrixBackstageService = exemplaryMatrixBackstageService;
	}


	/**
	 * 新增示范基地申请表
	 * @param exemplaryMatrixApplication
	 * @return
	 */
	public Integer saveExemplaryMatrixApplication(ExemplaryMatrixApplication exemplaryMatrixApplication){
		return null;
	}
	
	/**
	 * 通过UserCode获取申请结果
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixApplication getResultForApplicationByUserCode(Map<String, String> params){
		logger.info("传入service层参数为："+params);
		return exemplaryMatrixApplicationDAO.getResultForApplicationByUserCode(params);
	}
	
	/**
	 * 获取月度服务数据列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceDataList(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getServiceDataCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		PageBean pageBean = new PageBean((Long)countMap.get("count"), pageSize, startIndex);
		List<MonthlyServiceData> serviceDataList = exemplaryMatrixApplicationDAO.getServiceDataList(params, pageBean.getStart(), pageSize);
		logger.info("查询结果数量为："+serviceDataList.size());
		result.put("serviceDataList", serviceDataList);
		
		return result;
	}
	
	/**
	 * 获取月度服务能力升级情况列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getOfficeEquipmentList(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getOfficeEquipmentCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		PageBean pageBean = new PageBean((Long)countMap.get("count"), pageSize, startIndex);
		List<MonthlyOfficeEquipment> officeEquipmentList = exemplaryMatrixApplicationDAO.getOfficeEquipmentList(params, pageBean.getStart(), pageSize);
		logger.info("查询结果数量为："+officeEquipmentList.size());
		result.put("officeEquipmentList", officeEquipmentList);
		
		return result;
	}
	
	/**
	 * 获取季度列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getQuarterStatementList(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		
		List<QuarterStatement> quarterStatementList = exemplaryMatrixApplicationDAO.getQuarterStatementList(params);
		logger.info("查询结果数量为："+quarterStatementList.size());
		result.put("quarterStatementList", quarterStatementList);
		
		return result;
	}
	
	/**
	 * 新增季度报表
	 * @param quarterStatement
	 * @return
	 */
	public Integer saveQuarterStatement(QuarterStatement quarterStatement){
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", quarterStatement.getUserCode());
		params.put("year", quarterStatement.getYear().toString());
		params.put("quarter", quarterStatement.getQuarter().toString());
		QuarterStatement quarterStatementResult = exemplaryMatrixApplicationDAO.findStatementByParam(params);
		logger.info("查询结果为："+quarterStatementResult);
		Integer result = null;
		if (null == quarterStatementResult) {
			logger.info("执行插入操作");
			quarterStatement.setAuditType("0");
			quarterStatement.setCreateStamp(new Date());
			quarterStatement.setUpdateStamp(new Date());
			result = exemplaryMatrixApplicationDAO.saveQuarterStatement(quarterStatement);
		}else {
			logger.info("执行更新操作");
			quarterStatement.setUpdateStamp(new Date());
			result = exemplaryMatrixApplicationDAO.updateQuarterStatement(quarterStatement);
		}
		
		//20180403增加报表状态
		ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus =  new ExemplaryMatrixStatementStatus();
		exemplaryMatrixStatementStatus.setUserCode(quarterStatement.getUserCode());
		exemplaryMatrixStatementStatus.setServiceYear(quarterStatement.getYear());
		exemplaryMatrixStatementStatus.setServiceQuarter(quarterStatement.getQuarter());
		exemplaryMatrixStatementStatus.setStatementName("运营");
		exemplaryMatrixStatementStatus.setStatus("1");
		exemplaryMatrixStatementStatus.setCreateStamp(new Date());
		exemplaryMatrixStatementStatus.setUpdateStamp(new Date());
		exemplaryMatrixBackstageService.insertOrUpdateStatementStatus(exemplaryMatrixStatementStatus);
		
		return result;
	}
	
	/**
	 * 查看报表列表时获取基地列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> findMatrixListForStatementList(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		
		//20170630新增，根据传入区县代码分区查询基地列表
		String district = params.get("district");
		logger.info("传入的区县代码为："+district);
		//20170630，如果传入的市级代码则将参数致空
		if ("".equals(district.trim()) || "120000".equals(district.trim())) {
			params.put("district", "");
		}
		
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.findMatrixListForStatementListCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<Map<String, Object>> exemplaryMatrixApplicationList = exemplaryMatrixApplicationDAO.findMatrixListForStatementList(params);
		logger.info("查询结果数量为："+exemplaryMatrixApplicationList.size());
		result.put("exemplaryMatrixApplicationList", exemplaryMatrixApplicationList);
		
		return result;
	}
	
	
	/**
	 * 查看月报查询服务数据列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceDataListByCode(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getServiceDataListByCodeCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<MonthlyServiceData> monthlyServiceDatas = exemplaryMatrixApplicationDAO.getServiceDataListByCode(params);
		for (int i=0;i<monthlyServiceDatas.size();i++) {
			String path = LoadPropperties.getProperty("saveDbPath");
			monthlyServiceDatas.get(i).setPicture(path+monthlyServiceDatas.get(i).getPicture());
			logger.info("拼接得到的路径为："+monthlyServiceDatas.get(i).getPicture());
		}
		logger.info("查询结果数量为："+monthlyServiceDatas.size());
		result.put("monthlyServiceDatas", monthlyServiceDatas);
		
		return result;
	}
	
	/**
	 * 查看月报查询办公设备升级
	 * @param params
	 * @return
	 */
	public Map<String, Object> getOfficeEquipmentListByCode(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getOfficeEquipmentListByCodeCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<MonthlyOfficeEquipment> monthlyOfficeEquipments = exemplaryMatrixApplicationDAO.getOfficeEquipmentListByCode(params);
		logger.info("查询结果数量为："+monthlyOfficeEquipments.size());
		result.put("monthlyOfficeEquipments", monthlyOfficeEquipments);
		
		return result;
	}
	
	/**
	 * 查看月报查询装修改造升级 
	 * @param params
	 * @return
	 */
	public Map<String, Object> getDecorationListByCode(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getDecorationListByCodeCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<MonthlyDecoration> monthlyDecorations = exemplaryMatrixApplicationDAO.getDecorationListByCode(params);
		logger.info("查询结果数量为："+monthlyDecorations.size());
		result.put("monthlyDecorations", monthlyDecorations);
		
		return result;
	}
	
	/**
	 * 通过code获取基地信息
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixApplication getMatrixInfoByCode(Map<String, String> params){
//		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy");
//		String applicationYear = simpleDateFormat.format(new Date());
//		if (params.get("applicationYear") == null) {
//			params.put("applicationYear", applicationYear);
//		}
		ExemplaryMatrixApplication exemplaryMatrixApplication = exemplaryMatrixApplicationDAO.getMatrixInfoByCode(params);
		//拼路径
   	 	String showPath=LoadPropperties.getProperty("saveDbPath");
   	 	if(exemplaryMatrixApplication!=null){
	   	 	exemplaryMatrixApplication.setDevelopmentPlanningUrl(showPath+exemplaryMatrixApplication.getDevelopmentPlanningUrl());
	   	 	exemplaryMatrixApplication.setGoalOfDevelopmentUrl(showPath+exemplaryMatrixApplication.getGoalOfDevelopmentUrl());
	   	 	exemplaryMatrixApplication.setManagementSystemUrl(showPath+exemplaryMatrixApplication.getManagementSystemUrl());
	   	 	exemplaryMatrixApplication.setFeeScaleUrl(showPath+exemplaryMatrixApplication.getFeeScaleUrl());
   	 	}
   	 	
		return exemplaryMatrixApplication;
	}
	
	/**
	 * 通过code获取基地信息(返回Map)
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMatrixInfoMapByCode(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getMatrixInfoMapByCode(params);
	}
	
	
	/**
	 * 通过年份和季度查询季度报表 
	 * @param params
	 * @return
	 */
	public QuarterStatement findStatementByParam(Map<String, String> params){
//		QuarterStatement quarterStatement = exemplaryMatrixApplicationDAO.findStatementByParam(params);
//		if (!"1".equals(params.get("quarter"))) {
//			if (quarterStatement == null) {
//				logger.info("查询季度报表为空");
//				String newQuarter = String.valueOf(Integer.parseInt(params.get("quarter"))-1);
//				params.put("quarter", newQuarter);
//				quarterStatement = exemplaryMatrixApplicationDAO.findStatementByParam(params);
//			}
//		}
		return exemplaryMatrixApplicationDAO.findStatementByParam(params);
	}
	
	/**
	 * 保存/更新申请表
	 * @param exemplaryMatrixApplication
	 * @return
	 */
	public Map<String, Integer> saveOrUpdateApplication(ExemplaryMatrixApplication exemplaryMatrixApplication){
		Map<String, Integer> result = new HashMap<String, Integer>();
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", exemplaryMatrixApplication.getUserCode());
		
		ExemplaryMatrixApplication exemplaryMatrixApplicationResult = exemplaryMatrixApplicationDAO.getMatrixInfoByCode(params);
		logger.info("查询结果为："+exemplaryMatrixApplicationResult);
		Integer saveOrUpdateResult = 0;
		
		if (null == exemplaryMatrixApplicationResult) {
			logger.info("执行插入操作");
			//设置保存状态
			exemplaryMatrixApplication.setType("0");
			exemplaryMatrixApplication.setDistrictAuditType("0");
			exemplaryMatrixApplication.setThirdPartyAuditType("0");
			exemplaryMatrixApplication.setCityAuditType("0");
			exemplaryMatrixApplication.setSendThirdType("0");
			//只是插入申请年份
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy");
			exemplaryMatrixApplication.setApplicationYear(simpleDateFormat.format(new Date()));
			
			
			exemplaryMatrixApplication.setCreateStamp(new Date());
			exemplaryMatrixApplication.setUpdateStamp(new Date());
			saveOrUpdateResult = exemplaryMatrixApplicationDAO.saveApplication(exemplaryMatrixApplication);
			result.put("id", exemplaryMatrixApplication.getId());
		}else {
			logger.info("执行更新操作");
			//修改申请表时重置状态
			exemplaryMatrixApplication.setType("0");
			exemplaryMatrixApplication.setDistrictAuditType("0");
			exemplaryMatrixApplication.setThirdPartyAuditType("0");
			//20170519想了一下，还是不把递交第三方的状态置回初始状态了，避免撤销之后第三方看不见，也为了不影响市级审核列表页展示递交第三方的状态。
			//20170628测试让把递交第三方按钮打开，这样就可以多次递交，保存的时候将这个致空
			exemplaryMatrixApplication.setSendThirdType("0");
			//如果撤回的话不进行重置（市级审核状态不为空，同时审核状态为3时）
			if ((exemplaryMatrixApplicationResult.getCityAuditType()!=null || 
					!"".equals(exemplaryMatrixApplicationResult.getCityAuditType()))
					&&"3".equals(exemplaryMatrixApplicationResult.getCityAuditType())) {
				
			}else {
				exemplaryMatrixApplication.setCityAuditType("0");
			}
			
			exemplaryMatrixApplication.setUpdateStamp(new Date());
			//只是更新申请年份
			exemplaryMatrixApplication.setApplicationYear(exemplaryMatrixApplicationResult.getApplicationYear());
			saveOrUpdateResult = exemplaryMatrixApplicationDAO.updateApplication(exemplaryMatrixApplication);
			result.put("id", exemplaryMatrixApplicationResult.getId());
		}
		
		result.put("saveOrUpdateResult", saveOrUpdateResult);
		
		return result;
	}
	
	/**
	 * 保存经营情况方法
	 * @param request
	 * @return
	 */
	public Integer saveBusinessCircumstance(HttpServletRequest request){
		Integer result = 0;
		
		String userCode = request.getParameter("userCode");
		String applicationId = request.getParameter("applicationId");
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", userCode);
		params.put("exemplaryMatrixApplicationId", applicationId);
		exemplaryMatrixApplicationDAO.deleteBusinessCircumstanceByParams(params);
		
		
		String[] nos = request.getParameterValues("no");
		String[] years = request.getParameterValues("year");
		String[] operationRevenues = request.getParameterValues("operationRevenue");
		String[] smallMicroEnterpriseQuantitys = request.getParameterValues("smallMicroEnterpriseQuantity");
		String[] personnelQuantitys = request.getParameterValues("personnelQuantity");
		String[] totalAssetss = request.getParameterValues("totalAssets");
		String[] enterpriseQuantitys = request.getParameterValues("enterpriseQuantity");
		String[] proportions = request.getParameterValues("proportion");
		logger.info("传入参数条数为："+(years.length-1));
		
		for (int i = 0; i < nos.length-1; i++) {
			BusinessCircumstance businessCircumstance = new BusinessCircumstance();
			if (!"".equals(userCode.trim())&& null!=userCode) {
				businessCircumstance.setUserCode(userCode);
			}
			if (!"".equals(applicationId.trim())&& null!=applicationId) {
				businessCircumstance.setExemplaryMatrixApplicationId(Integer.parseInt(applicationId));
			}
			if (!"".equals(years[i].trim())&& null!=years[i]) {
				businessCircumstance.setYear(Integer.parseInt(years[i]));
			}
			if (!"".equals(operationRevenues[i].trim())&& null!=operationRevenues[i]) {
				businessCircumstance.setOperationRevenue(Double.parseDouble(operationRevenues[i]));
			}
			if (!"".equals(smallMicroEnterpriseQuantitys[i].trim())&& null!=smallMicroEnterpriseQuantitys[i]) {
				businessCircumstance.setSmallMicroEnterpriseQuantity(Integer.parseInt(smallMicroEnterpriseQuantitys[i]));
			}
			if (!"".equals(personnelQuantitys[i].trim())&& null!=personnelQuantitys[i]) {
				businessCircumstance.setPersonnelQuantity(Integer.parseInt(personnelQuantitys[i]));
			}
			if (!"".equals(totalAssetss[i].trim())&& null!=totalAssetss[i]) {
				businessCircumstance.setTotalAssets(Double.parseDouble(totalAssetss[i]));
			}
			if (!"".equals(enterpriseQuantitys[i].trim())&& null!=enterpriseQuantitys[i]) {
				businessCircumstance.setEnterpriseQuantity(Integer.parseInt(enterpriseQuantitys[i]));
			}
			if (!"".equals(proportions[i].trim())&& null!=proportions[i]) {
				businessCircumstance.setProportion(Double.parseDouble(proportions[i]));
			}
			businessCircumstance.setCreateStamp(new Date());
			businessCircumstance.setUpdateStamp(new Date());
			result += exemplaryMatrixApplicationDAO.saveBusinessCircumstance(businessCircumstance);
		}
		
		return result;
	}
	
	/**
	 * 根据userCode和applicationId获取经营情况列表
	 * @param params
	 * @return
	 */
	public List<BusinessCircumstance> getBusinessCircumstanceByParams(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getBusinessCircumstanceByParams(params);
	}
	
	/**
	 * 根据userCode和applicationId获取经营情况列表（Map）
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getBusinessCircumstanceMapByParams(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getBusinessCircumstanceMapByParams(params);
	}
	
	/**
	 * 新增合作服务机构信息 
	 * @param request
	 * @return
	 */
	public Integer saveCooperationFacilitatingAgency(HttpServletRequest request){
		Integer result = 0;
		
		String userCode = request.getParameter("userCode");
		String applicationId = request.getParameter("applicationId");
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", userCode);
		params.put("exemplaryMatrixApplicationId", applicationId);
		exemplaryMatrixApplicationDAO.deleteCooperationFacilitatingAgencyByParams(params);
		
		
		String[] nos = request.getParameterValues("no");
		String[] cooperativeFacilitatingAgencyNames = request.getParameterValues("cooperativeFacilitatingAgencyName");
		String[] signingTimes = request.getParameterValues("signingTime");
		String[] serviceItems = request.getParameterValues("serviceItems");
		logger.info("传入参数条数为："+(nos.length-1));
		
		for (int i = 0; i < nos.length-1; i++) {
			CooperationFacilitatingAgency cooperationFacilitatingAgency = new CooperationFacilitatingAgency();
			if (!"".equals(userCode.trim())&& null!=userCode) {
				cooperationFacilitatingAgency.setUserCode(userCode);
			}
			if (!"".equals(applicationId.trim())&& null!=applicationId) {
				cooperationFacilitatingAgency.setExemplaryMatrixApplicationId(Integer.parseInt(applicationId));
			}
			if (!"".equals(cooperativeFacilitatingAgencyNames[i].trim())&& null!=cooperativeFacilitatingAgencyNames[i]) {
				cooperationFacilitatingAgency.setCooperativeFacilitatingAgencyName(cooperativeFacilitatingAgencyNames[i]);
			}
			if (!"".equals(signingTimes[i].trim())&& null!=signingTimes[i]) {
				cooperationFacilitatingAgency.setSigningTime(signingTimes[i]);
			}
			if (!"".equals(serviceItems[i].trim())&& null!=serviceItems[i]) {
				cooperationFacilitatingAgency.setServiceItems(serviceItems[i]);
			}
			
			cooperationFacilitatingAgency.setCreateStamp(new Date());
			cooperationFacilitatingAgency.setUpdateStamp(new Date());
			result += exemplaryMatrixApplicationDAO.saveCooperationFacilitatingAgency(cooperationFacilitatingAgency);
		}
		
		return result;
	}
	
	/**
	 * 通过userCode和applicationId获取合作服务机构信息
	 * @param params
	 * @return
	 */
	public List<CooperationFacilitatingAgency> getCooperationFacilitatingAgencyByParams(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getCooperationFacilitatingAgencyByParams(params);
	}
	
	/**
	 * 通过userCode和applicationId获取合作服务机构信息(Map)
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getCooperationFacilitatingAgencyMapByParams(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getCooperationFacilitatingAgencyMapByParams(params);
	}
	
	/**
	 * 新增服务功能信息
	 * @param request
	 * @return
	 */
	public Integer saveServiceFunction(HttpServletRequest request){
		Integer result = 0;
		
		String userCode = request.getParameter("userCode");
		String applicationId = request.getParameter("applicationId");
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", userCode);
		params.put("exemplaryMatrixApplicationId", applicationId);
		exemplaryMatrixApplicationDAO.deleteServiceFunctionByParams(params);
		
		
		String[] nos = request.getParameterValues("no");
		String[] serviceItemss = request.getParameterValues("serviceItems");
		String[] proportions = request.getParameterValues("proportion");
		String[] serviceScales = request.getParameterValues("serviceScale");
		logger.info("传入参数条数为："+(nos.length-1));
		
		for (int i = 0; i < nos.length-1; i++) {
			ServiceFunction serviceFunction = new ServiceFunction();
			
			if (!"".equals(userCode.trim())&& null!=userCode) {
				serviceFunction.setUserCode(userCode);
			}
			if (!"".equals(applicationId.trim())&& null!=applicationId) {
				serviceFunction.setExemplaryMatrixApplicationId(Integer.parseInt(applicationId));
			}
			if (!"".equals(serviceItemss[i].trim())&& null!=serviceItemss[i]) {
				serviceFunction.setServiceItems(serviceItemss[i]);
			}
			if (!"".equals(proportions[i].trim())&& null!=proportions[i]) {
				serviceFunction.setProportion(Double.parseDouble(proportions[i]));
			}
			if (!"".equals(serviceScales[i].trim())&& null!=serviceScales[i]) {
				serviceFunction.setServiceScale(serviceScales[i]);
			}
			
			serviceFunction.setCreateStamp(new Date());
			serviceFunction.setUpdateStamp(new Date());
			result += exemplaryMatrixApplicationDAO.saveServiceFunction(serviceFunction);
		}
		
		return result;
	}
	
	/**
	 * 通过userCode和applicationId获取服务功能信息
	 * @param params
	 * @return
	 */
	public List<ServiceFunction> getServiceFunctionByParams(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getServiceFunctionByParams(params);
	}
	
	/**
	 * 通过userCode和applicationId获取服务功能信息(Map)
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getServiceFunctionMapByParams(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getServiceFunctionMapByParams(params);
	}
	
	/**
	 * 保存管理和服务人员名单及职称情况信息
	 * @param request
	 * @return
	 */
	public Integer savePersonnelList(PersonnelList personnelList){
		Integer result = 0;
		if ("".equals(personnelList.getId()) || null==personnelList.getId()) {
			personnelList.setNo(0);
			personnelList.setCreateStamp(new Date());
			personnelList.setUpdateStamp(new Date());
			result += exemplaryMatrixApplicationDAO.savePersonnelList(personnelList);
		}else {
			personnelList.setUpdateStamp(new Date());
			result += exemplaryMatrixApplicationDAO.updatePersonnelListById(personnelList);
		}
		
		return result;
	}
	
	/**
	 * 通过id获取管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public PersonnelList getPersonnelListById(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getPersonnelListById(params);
	}
	
	/**
	 * 通过id删除管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public Integer deletePersonnelListById(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.deletePersonnelListByParams(params);
	}
	
	/**
	 * 通过userCode和applicationId获取管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public Map<String, Object> getPersonnelListByParams(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getPersonnelListByParamsCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		logger.info("传入参数为："+params);
		List<PersonnelList> personnelList = exemplaryMatrixApplicationDAO.getPersonnelListByParams(params);
		logger.info("查询结果数量为："+personnelList.size());
		result.put("personnelList", personnelList);
		
		return result;
	}
	
	public List<PersonnelList> getPersonnelListByParamsNoPage(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getPersonnelListByParams(params);
	}
	
	/**
	 * 通过userCode和applicationId获取管理和服务人员名单及职称情况信息
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getPersonnelListMapByParams(Map<String, String> params){
		List<LinkedHashMap<String, Object>> result = exemplaryMatrixApplicationDAO.getPersonnelListMapByParams(params);
		if (result != null && 0!=result.size()) {
			for (int i = 0; i < result.size(); i++) {
				result.get(i).put("no", (i+1));
				String sex = (String)result.get(i).get("sex");
				if ("1".equals(sex)) {
					result.get(i).put("sex", "男");
				}else if("0".equals(sex)){
					result.get(i).put("sex", "女");
				}
			}
		}
		return exemplaryMatrixApplicationDAO.getPersonnelListMapByParams(params);
	}
	
	/**
	 * 保存入驻企业评价信息
	 * @param request
	 * @return
	 */
	public Integer saveEnterpriseEvaluate(HttpServletRequest request){
		Integer result = 0;
		
		String userCode = request.getParameter("userCode");
		String applicationId = request.getParameter("applicationId");
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", userCode);
		params.put("exemplaryMatrixApplicationId", applicationId);
		exemplaryMatrixApplicationDAO.deleteEnterpriseEvaluateByParams(params);
		
		
		String[] nos = request.getParameterValues("no");
		String[] legalRepresentatives = request.getParameterValues("legalRepresentative");
		String[] personnelQuantitys = request.getParameterValues("personnelQuantity");
		String[] enjoyServices = request.getParameterValues("enjoyService");
		String[] enterpriseNames = request.getParameterValues("enterpriseName");
		String[] entryTimes = request.getParameterValues("entryTime");
		String[] contactPhones = request.getParameterValues("contactPhone");
		
		
		logger.info("传入参数条数为："+(nos.length-1));
		
		for (int i = 0; i < nos.length-1; i++) {
			EnterpriseEvaluate enterpriseEvaluate = new EnterpriseEvaluate();
			if (!"".equals(userCode.trim())&& null!=userCode) {
				enterpriseEvaluate.setUserCode(userCode);
			}
			if (!"".equals(applicationId.trim())&& null!=applicationId) {
				enterpriseEvaluate.setExemplaryMatrixApplicationId(Integer.parseInt(applicationId));
			}
			if (!"".equals(nos[i].trim())&& null!=nos[i]) {
				enterpriseEvaluate.setNo(Integer.parseInt(nos[i]));
			}
			if (!"".equals(legalRepresentatives[i].trim())&& null!=legalRepresentatives[i]) {
				enterpriseEvaluate.setLegalRepresentative(legalRepresentatives[i]);
			}
			if (!"".equals(personnelQuantitys[i].trim())&& null!=personnelQuantitys[i]) {
				enterpriseEvaluate.setPersonnelQuantity(Integer.parseInt(personnelQuantitys[i]));
			}
			if (!"".equals(enjoyServices[i].trim())&& null!=enjoyServices[i]) {
				enterpriseEvaluate.setEnjoyService(enjoyServices[i]);
			}
			if (!"".equals(enterpriseNames[i].trim())&& null!=enterpriseNames[i]) {
				enterpriseEvaluate.setEnterpriseName(enterpriseNames[i]);
			}
			if (!"".equals(entryTimes[i].trim())&& null!=entryTimes[i]) {
				enterpriseEvaluate.setEntryTime(entryTimes[i]);
			}
			if (!"".equals(contactPhones[i].trim())&& null!=contactPhones[i]) {
				enterpriseEvaluate.setContactPhone(contactPhones[i]);
			}
			if (!"".equals(request.getParameter("evaluate"+i).trim())&& null!=request.getParameter("evaluate"+i)) {
				enterpriseEvaluate.setEvaluate(request.getParameter("evaluate"+i));
			}
			enterpriseEvaluate.setCreateStamp(new Date());
			enterpriseEvaluate.setUpdateStamp(new Date());
			result += exemplaryMatrixApplicationDAO.saveEnterpriseEvaluate(enterpriseEvaluate);
			
		}
		return result;
	}
	
	/**
	 * 通过userCode和applicationId获取入驻企业评价信息
	 * @param params
	 * @return
	 */
	public List<EnterpriseEvaluate> getEnterpriseEvaluateByParams(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getEnterpriseEvaluateByParams(params);
	}
	
	/**
	 * 通过userCode和applicationId获取入驻企业评价信息
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getEnterpriseEvaluateMapByParams(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getEnterpriseEvaluateMapByParams(params);
	}
	
	/**
	 * 区属推荐获取列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> districtAuditGetList(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.districtAuditGetListCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		logger.info("传入参数为："+params);
		List<Map<String, String>> matrixList = exemplaryMatrixApplicationDAO.districtAuditGetList(params);
		logger.info("查询结果数量为："+matrixList.size());
		result.put("matrixList", matrixList);
		
		return result;
	}
	
	/**
	 * 市级审核获取列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> cityAuditGetList(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.cityAuditGetListCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<Map<String, String>> matrixList = exemplaryMatrixApplicationDAO.cityAuditGetList(params);
		logger.info("查询结果数量为："+matrixList.size());
		result.put("matrixList", matrixList);
		
		return result;
	}
	
	/**
	 * 第三方审核获取列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> thirdPartyAuditGetList(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.thirdPartyAuditGetListCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<Map<String, String>> matrixList = exemplaryMatrixApplicationDAO.thirdPartyAuditGetList(params);
		logger.info("查询结果数量为："+matrixList.size());
		result.put("matrixList", matrixList);
		
		return result;
	}
	
	/**
	 * 保存推荐主表信息
	 * @param exemplaryMatrixRecommend
	 * @return
	 */
	public Integer saveExemplaryMatrixRecommend(ExemplaryMatrixRecommend exemplaryMatrixRecommend){
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("userCode", exemplaryMatrixRecommend.getUserCode());
		params.put("applicationId", exemplaryMatrixRecommend.getExemplaryMatrixApplicationId());
		exemplaryMatrixApplicationDAO.deleteExemplaryMatrixRecommendByParams(params);
		
		exemplaryMatrixRecommend.setCreateStamp(new Date());
		exemplaryMatrixRecommend.setUpdateStamp(new Date());
		Integer result = exemplaryMatrixApplicationDAO.saveExemplaryMatrixRecommend(exemplaryMatrixRecommend);
		return result;
	}
	
	/**
	 * 保存推荐表附表方法
	 * @param request
	 * @return
	 */
	public Integer saveExemplaryMatrixRecommendEvaluate(HttpServletRequest request){
		Integer result = 0;
		
		String userCode = request.getParameter("applicationUserCode");
		String applicationId = request.getParameter("applicationId");
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", userCode);
		params.put("exemplaryMatrixApplicationId", applicationId);
		exemplaryMatrixApplicationDAO.deleteExemplaryMatrixRecommendEvaluateByParams(params);
		
		
		String[] nos = request.getParameterValues("no");
		String[] enterpriseNames = request.getParameterValues("enterpriseName");
		String[] names = request.getParameterValues("name");
		String[] dutys = request.getParameterValues("duty");
		String[] contactPhones = request.getParameterValues("contactPhone");
		String[] enjoyServices = request.getParameterValues("enjoyService");
		
		logger.info("传入参数条数为："+(nos.length-1));
		
		for (int i = 0; i < nos.length-1; i++) {
			ExemplaryMatrixRecommendEvaluate exemplaryMatrixRecommendEvaluate = new ExemplaryMatrixRecommendEvaluate();
			exemplaryMatrixRecommendEvaluate.setUserCode(userCode);
			exemplaryMatrixRecommendEvaluate.setExemplaryMatrixApplicationId(Integer.parseInt(applicationId));
			exemplaryMatrixRecommendEvaluate.setEnterpriseName(enterpriseNames[i]);
			exemplaryMatrixRecommendEvaluate.setName(names[i]);
			exemplaryMatrixRecommendEvaluate.setDuty(dutys[i]);
			exemplaryMatrixRecommendEvaluate.setContactPhone(contactPhones[i]);
			exemplaryMatrixRecommendEvaluate.setEnjoyService(enjoyServices[i]);
			exemplaryMatrixRecommendEvaluate.setAccord(request.getParameter("accord"+i));
			exemplaryMatrixRecommendEvaluate.setEvaluate(request.getParameter("evaluate"+i));
			
			result += exemplaryMatrixApplicationDAO.saveExemplaryMatrixRecommendEvaluate(exemplaryMatrixRecommendEvaluate);
		}
		return result;
	}
	
	/**
	 * 保存推荐表附表方法(新)
	 * @param request
	 * @return
	 */
	public Integer saveExemplaryMatrixRecommendEvaluateNew(ExemplaryMatrixRecommendEvaluate exemplaryMatrixRecommendEvaluate){
		Integer id = exemplaryMatrixRecommendEvaluate.getId();
		logger.info("传入id为："+id);
		Integer result = 0;
		//id不为空执行更新操作
		if (id!=null) {
			exemplaryMatrixRecommendEvaluate.setUpdateStamp(new Date());
			result = exemplaryMatrixApplicationDAO.updateExemplaryMatrixRecommendEvaluateById(exemplaryMatrixRecommendEvaluate);
		}else {
			exemplaryMatrixRecommendEvaluate.setCreateStamp(new Date());
			exemplaryMatrixRecommendEvaluate.setUpdateStamp(new Date());
			result = exemplaryMatrixApplicationDAO.saveExemplaryMatrixRecommendEvaluate(exemplaryMatrixRecommendEvaluate);
		}
		
		return result;
	}
	
	/**
	 * 审核操作
	 * @param params
	 * @return
	 */
	public Integer audit(Map<String, String> params){
		String auditType = params.get("auditType");
		String flag = params.get("flag");
		ExemplaryMatrixApplication exemplaryMatrixApplication = new ExemplaryMatrixApplication();
		
		//设置当前审核时间
		SimpleDateFormat applicationYearFormat = new SimpleDateFormat("yyyy");
		String applicationYear = applicationYearFormat.format(new Date());
		exemplaryMatrixApplication.setApplicationYear(applicationYear);
		
		if ("district".equals(auditType)) {
			if ("2".equals(flag)) {
				//区级推荐
				
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				exemplaryMatrixApplication.setDistrictAuditTime(simpleDateFormat.format(new Date()));
				exemplaryMatrixApplication.setDistrictAuditType(flag);
				exemplaryMatrixApplication.setDistrictAuditUser(params.get("userCode"));
//				exemplaryMatrixApplication.setUpdateStamp(new Date());
				exemplaryMatrixApplication.setUserCode(params.get("applicationUserCode"));
			}else if ("1".equals(flag)) {
				//区级不推荐
				
				/*SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				exemplaryMatrixApplication.setDistrictAuditTime(simpleDateFormat.format(new Date()));
				exemplaryMatrixApplication.setDistrictAuditType(flag);
				exemplaryMatrixApplication.setDistrictAuditUser(params.get("userCode"));
//				exemplaryMatrixApplication.setUpdateStamp(new Date());
				exemplaryMatrixApplication.setUserCode(params.get("applicationUserCode"));*/
				
				//20170613修改
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				exemplaryMatrixApplication.setType("0");
				exemplaryMatrixApplication.setDistrictAuditTime(simpleDateFormat.format(new Date()));
				exemplaryMatrixApplication.setDistrictAuditType("0");
				exemplaryMatrixApplication.setDistrictAuditUser(params.get("userCode"));
//				exemplaryMatrixApplication.setUpdateStamp(new Date());
				exemplaryMatrixApplication.setUserCode(params.get("applicationUserCode"));
			}
		}else if ("city".equals(auditType)) {
			if ("2".equals(flag)) {
				//市级推荐
				
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				exemplaryMatrixApplication.setCityAuditTime(simpleDateFormat.format(new Date()));
				exemplaryMatrixApplication.setCityAuditType(flag);
				exemplaryMatrixApplication.setCityAuditUser(params.get("userCode"));
//				exemplaryMatrixApplication.setUpdateStamp(new Date());
				exemplaryMatrixApplication.setUserCode(params.get("applicationUserCode"));
				
				//20170720添加逻辑，将市级审核通过的请求信息添加到示范基地信息表中进行保存。
				//查询获取申请表信息
				Map<String, String> selectApplicationParam = new HashMap<String, String>();
				selectApplicationParam.put("userCode", exemplaryMatrixApplication.getUserCode());
				selectApplicationParam.put("applicationYear", exemplaryMatrixApplication.getApplicationYear());
				ExemplaryMatrixApplication exemplaryMatrixApplication2 = exemplaryMatrixApplicationDAO.getMatrixInfoByCode(selectApplicationParam);
				
				//往示范基地bean中塞值
				ExemplaryMatrix exemplaryMatrix = new ExemplaryMatrix();
				exemplaryMatrix.setUserCode(exemplaryMatrixApplication2.getUserCode());
				exemplaryMatrix.setContacter(exemplaryMatrixApplication2.getContacter());
				exemplaryMatrix.setContactPhone(exemplaryMatrixApplication2.getContactPhone());
				exemplaryMatrix.setMatrixName(exemplaryMatrixApplication2.getMatrixName());
				exemplaryMatrix.setMonthlyStatementStatus("0");
				exemplaryMatrix.setApplicationYear(exemplaryMatrixApplication2.getApplicationYear());
				
				//查询现有示范基地信息
				Map<String, String> selectMatrixParams = new HashMap<String, String>();
				selectMatrixParams.put("userCode", exemplaryMatrix.getUserCode());
				ExemplaryMatrix exemplaryMatrixResult = exemplaryMatrixApplicationDAO.getExemplaryMatrixByUserCode(selectMatrixParams);
				
				if (null == exemplaryMatrixResult) {
					logger.info("没有示范基地信息，需要新增");
					exemplaryMatrix.setCreateStamp(new Date());
					exemplaryMatrix.setUpdateStamp(new Date());
					exemplaryMatrixApplicationDAO.insertExemplaryMatrix(exemplaryMatrix);
				}else {
					logger.info("有示范基地信息，需要更新");
					exemplaryMatrix.setUpdateStamp(new Date());
					exemplaryMatrixApplicationDAO.updateExemplaryMatrix(exemplaryMatrix);
				}
				
			}else if ("1".equals(flag)) {
				//市级不推荐
				
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				exemplaryMatrixApplication.setCityAuditTime(simpleDateFormat.format(new Date()));
				exemplaryMatrixApplication.setCityAuditType(flag);
				exemplaryMatrixApplication.setCityAuditUser(params.get("userCode"));
//				exemplaryMatrixApplication.setUpdateStamp(new Date());
				exemplaryMatrixApplication.setUserCode(params.get("applicationUserCode"));
			}else if ("3".equals(flag)) {
				//市级撤销
				
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				exemplaryMatrixApplication.setCityAuditTime(simpleDateFormat.format(new Date()));
				exemplaryMatrixApplication.setCityAuditType(flag);
				exemplaryMatrixApplication.setCityAuditUser(params.get("userCode"));
//				exemplaryMatrixApplication.setUpdateStamp(new Date());
				exemplaryMatrixApplication.setUserCode(params.get("applicationUserCode"));
			}
		}else if ("thirdParty".equals(auditType)) {
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			exemplaryMatrixApplication.setThirdPartyAuditTime(simpleDateFormat.format(new Date()));
			exemplaryMatrixApplication.setThirdPartyAuditType(flag);
			exemplaryMatrixApplication.setThirdPartyAuditUser(params.get("userCode"));
//			exemplaryMatrixApplication.setUpdateStamp(new Date());
			exemplaryMatrixApplication.setUserCode(params.get("applicationUserCode"));
			exemplaryMatrixApplication.setOpinion(params.get("opinion"));
		}
		
		Integer result = exemplaryMatrixApplicationDAO.updateApplication(exemplaryMatrixApplication);
		
		return result;
	}
	
	/**
	 * 通过参数获取推荐主表内容
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixRecommend getExemplaryMatrixRecommendByParams(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getExemplaryMatrixRecommendByParams(params);
	}
	
	/**
	 * 通过参数获取推荐主表内容(Map)
	 * @param params
	 * @return
	 */
	public Map<String, Object> getExemplaryMatrixRecommendMapByParams(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getExemplaryMatrixRecommendMapByParams(params);
	}
	
	
	/**
	 * 获取推荐附表
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixRecommendEvaluate> getExemplaryMatrixRecommendEvaluateList(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getExemplaryMatrixRecommendEvaluateList(params);
	}
	
	/**
	 * 通过id获取推荐附表信息
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixRecommendEvaluate getExemplaryMatrixRecommendEvaluateById(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getExemplaryMatrixRecommendEvaluateById(params);
	}
	
	/**
	 * 通过id删除推荐附表信息
	 * @param params
	 * @return
	 */
	public Integer deleteExemplaryMatrixRecommendEvaluateById(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.deleteExemplaryMatrixRecommendEvaluateById(params);
	}
	
	/**
	 * 获取推荐附表(Map)
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> getExemplaryMatrixRecommendEvaluateMapList(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getExemplaryMatrixRecommendEvaluateMapList(params);
	}
	
	/**
	 * 保存月度服务信息
	 * @param monthlyServiceData
	 * @return
	 */
	public Integer saveMonthlyServiceData(HttpServletRequest request){
		Integer result = 0;
		
		String userCode = request.getParameter("userCode");
		String year = request.getParameter("year");
		String month = request.getParameter("month");
		
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", userCode);
		params.put("year", year);
		params.put("month", month);
		
		exemplaryMatrixApplicationDAO.deleteMonthlyServiceData(params);
		
		
		String[] nos = request.getParameterValues("no");
		String[] serviceTypes = request.getParameterValues("serviceType");
		String[] times = request.getParameterValues("time");
		String[] sites = request.getParameterValues("site");
		String[] titles = request.getParameterValues("title");
		String[] numbers = request.getParameterValues("number");
		String[] meetingPictures = request.getParameterValues("meetingPicture");
		String[] sketchs = request.getParameterValues("sketch");
		//新增
		String[] enterNumbers = request.getParameterValues("enterNumber");
		
		logger.info("传入参数条数为："+(nos.length-1));
		
		for (int i = 0; i < nos.length-1; i++) {
			MonthlyServiceData monthlyServiceData = new MonthlyServiceData();
			if (!"".equals(userCode.trim())&& null!=userCode) {
				monthlyServiceData.setUserCode(userCode);
			}
			if (!"".equals(year.trim())&& null!=year) {
				monthlyServiceData.setYear(Integer.parseInt(year));
			}
			if (!"".equals(month.trim())&& null!=month) {
				monthlyServiceData.setMonth(Integer.parseInt(month));
			}
			if (!"".equals(serviceTypes[i].trim())&& null!=serviceTypes[i]) {
				monthlyServiceData.setServiceClass(serviceTypes[i]);
			}
			if (!"".equals(times[i].trim())&& null!=times[i]) {
				monthlyServiceData.setTime(times[i]);
			}
			if (!"".equals(sites[i].trim())&& null!=sites[i]) {
				monthlyServiceData.setSite(sites[i]);
			}
			if (!"".equals(titles[i].trim())&& null!=titles[i]) {
				monthlyServiceData.setTitle(titles[i]);
			}
			if (!"".equals(numbers[i].trim())&& null!=numbers[i]) {
				monthlyServiceData.setNumber(Integer.parseInt(numbers[i]));
			}
			if (!"".equals(meetingPictures[i].trim())&& null!=meetingPictures[i]) {
				monthlyServiceData.setPicture(meetingPictures[i]);
			}
			if (!"".equals(sketchs[i].trim())&& null!=sketchs[i]) {
				monthlyServiceData.setSketch(sketchs[i]);
			}
			//新增
			if (!"".equals(enterNumbers[i].trim())&& null!=enterNumbers[i]) {
				monthlyServiceData.setEnterNumber(Integer.parseInt(enterNumbers[i]));
			}
			
			monthlyServiceData.setAuditType("0");
			monthlyServiceData.setSubmitType("0");
			monthlyServiceData.setCreateStamp(new Date());
			monthlyServiceData.setUpdateStamp(new Date());
			
			result += exemplaryMatrixApplicationDAO.saveMonthlyServiceData(monthlyServiceData);
		}
		return result;
	}
	
	/**
	 * 通过id查询月度服务信息
	 * @param params
	 * @return
	 */
	public MonthlyServiceData getMonthlyServiceDataById(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getMonthlyServiceDataById(params);
	}
	
	/**
	 * 保存月度报表——办公设备方法
	 * @param request
	 * @return
	 */
	public Integer saveMonthlyOfficeEquipment(HttpServletRequest request){
		Integer result = 0;
		
		String userCode = request.getParameter("userCode");
		String year = request.getParameter("year");
		String month = request.getParameter("month");
		
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", userCode);
		params.put("year", year);
		params.put("month", month);
		
		exemplaryMatrixApplicationDAO.deleteMonthlyOfficeEquipmentByParams(params);
		
		
		String[] monthlyOfficeEquipmentNos = request.getParameterValues("monthlyOfficeEquipmentNo");
		String[] equipmentNamea = request.getParameterValues("monthlyOfficeEquipment.equipmentName");
		String[] counts = request.getParameterValues("monthlyOfficeEquipment.count");
		String[] invoiceNos = request.getParameterValues("monthlyOfficeEquipment.invoiceNo");
		String[] amountInvesteds = request.getParameterValues("monthlyOfficeEquipment.amountInvested");
		String[] timeInvesteds = request.getParameterValues("monthlyOfficeEquipment.timeInvested");
		
		logger.info("传入参数条数为："+(monthlyOfficeEquipmentNos.length-1));
		
		for (int i = 0; i < monthlyOfficeEquipmentNos.length-1; i++) {
			MonthlyOfficeEquipment monthlyOfficeEquipment = new MonthlyOfficeEquipment();
			if (!"".equals(userCode.trim()) && null!=userCode) {
				monthlyOfficeEquipment.setUserCode(userCode);
			}
			if (!"".equals(year.trim())&& null!=year) {
				monthlyOfficeEquipment.setYear(Integer.parseInt(year));
			}
			if (!"".equals(month.trim())&& null!=month) {
				monthlyOfficeEquipment.setMonth(Integer.parseInt(month));
			}
			if (!"".equals(equipmentNamea[i].trim())&& null!=equipmentNamea[i]) {
				monthlyOfficeEquipment.setEquipmentName(equipmentNamea[i]);
			}
			if (!"".equals(counts[i].trim())&& null!=counts[i]) {
				monthlyOfficeEquipment.setCount(Integer.parseInt(counts[i]));
			}
			if (!"".equals(invoiceNos[i].trim())&& null!=invoiceNos[i]) {
				monthlyOfficeEquipment.setInvoiceNo(Integer.parseInt(invoiceNos[i]));
			}
			if (!"".equals(amountInvesteds[i].trim())&& null!=amountInvesteds[i]) {
				monthlyOfficeEquipment.setAmountInvested(Double.parseDouble(amountInvesteds[i]));
			}
			if (!"".equals(timeInvesteds[i].trim())&& null!=timeInvesteds[i]) {
				monthlyOfficeEquipment.setTimeInvested(timeInvesteds[i]);
			}
			
			monthlyOfficeEquipment.setAuditType("0");
			monthlyOfficeEquipment.setCreateStamp(new Date());
			monthlyOfficeEquipment.setUpdateStamp(new Date());
			result += exemplaryMatrixApplicationDAO.saveMonthlyOfficeEquipment(monthlyOfficeEquipment);
		}
		
		//20180403增加报表状态
		ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus =  new ExemplaryMatrixStatementStatus();
		exemplaryMatrixStatementStatus.setUserCode(userCode);
		exemplaryMatrixStatementStatus.setServiceYear(Integer.parseInt(year));
		exemplaryMatrixStatementStatus.setServiceQuarter(Integer.parseInt(month));
		exemplaryMatrixStatementStatus.setStatementName("服务升级");
		exemplaryMatrixStatementStatus.setStatus("1");
		exemplaryMatrixStatementStatus.setCreateStamp(new Date());
		exemplaryMatrixStatementStatus.setUpdateStamp(new Date());
		exemplaryMatrixBackstageService.insertOrUpdateStatementStatus(exemplaryMatrixStatementStatus);
		return result;
	}
	
	/**
	 * 保存月度报表——装修改造
	 * @param request
	 * @return
	 */
	public Integer saveMonthlyDecoration(HttpServletRequest request){
		Integer result = 0;
		
		String userCode = request.getParameter("userCode");
		String year = request.getParameter("year");
		String month = request.getParameter("month");
		
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", userCode);
		params.put("year", year);
		params.put("month", month);
		
		exemplaryMatrixApplicationDAO.deleteMonthlyDecorationByParams(params);
		
		
		String[] monthlyDecorationNos = request.getParameterValues("monthlyDecorationNo");
		String[] contractNames = request.getParameterValues("monthlyDecoration.contractName");
		String[] contractNos = request.getParameterValues("monthlyDecoration.contractNo");
		String[] contractContentss = request.getParameterValues("monthlyDecoration.contractContents");
		String[] invoiceNos = request.getParameterValues("monthlyDecoration.invoiceNo");
		String[] amountInvesteds = request.getParameterValues("monthlyDecoration.amountInvested");
		String[] timeInvesteds = request.getParameterValues("monthlyDecoration.timeInvested");
		
		logger.info("传入参数条数为："+(monthlyDecorationNos.length-1));
		
		for (int i = 0; i < monthlyDecorationNos.length-1; i++) {
			MonthlyDecoration monthlyDecoration = new MonthlyDecoration();
			if (!"".equals(userCode.trim()) && null!=userCode) {
				monthlyDecoration.setUserCode(userCode);
			}
			if (!"".equals(year.trim()) && null!=year) {
				monthlyDecoration.setYear(Integer.parseInt(year));
			}
			if (!"".equals(month.trim()) && null!=month) {
				monthlyDecoration.setMonth(Integer.parseInt(month));
			}
			if (!"".equals(contractNames[i].trim()) && null!=contractNames[i]) {
				monthlyDecoration.setContractName(contractNames[i]);
			}
			if (!"".equals(contractNos[i].trim()) && null!=contractNos[i]) {
				monthlyDecoration.setContractNo(Integer.parseInt(contractNos[i]));
			}
			if (!"".equals(contractContentss[i].trim()) && null!=contractContentss[i]) {
				monthlyDecoration.setContractContents(contractContentss[i]);
			}
			if (!"".equals(invoiceNos[i].trim()) && null!=invoiceNos[i]) {
				monthlyDecoration.setInvoiceNo(Integer.parseInt(invoiceNos[i]));
			}
			if (!"".equals(amountInvesteds[i].trim()) && null!=amountInvesteds[i]) {
				monthlyDecoration.setAmountInvested(Double.parseDouble(amountInvesteds[i]));
			}
			if (!"".equals(timeInvesteds[i].trim()) && null!=timeInvesteds[i]) {
				monthlyDecoration.setTimeInvested(timeInvesteds[i]);
			}
			
			monthlyDecoration.setAuditType("0");
			monthlyDecoration.setCreateStamp(new Date());
			monthlyDecoration.setUpdateStamp(new Date());
			
			result += exemplaryMatrixApplicationDAO.saveMonthlyDecoration(monthlyDecoration);
		}
		return result;
	}
	
	/**
	 * 通过服务类别统计数量
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getStatisticalByServiceType(Map<String, String> params){
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		Map<String, String> getSysCodeParams = new HashMap<String, String>();
		getSysCodeParams.put("group", "pioneer_service_type");
		getSysCodeParams.put("parent", "0");
		List<SysCode> sysCodes = sysCodeDAO.getSysCode(getSysCodeParams);
		logger.info("查询服务类别数量："+sysCodes.size());
		if (0!=sysCodes.size() && null!=sysCodes) {
			for (int i = 0; i < sysCodes.size(); i++) {
				params.put("serviceType", sysCodes.get(i).getCode());
				Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getStatisticalByServiceType(params);
				
				Map<String, Object> newMap = new HashMap<String, Object>();
				newMap.put("serviceName", sysCodes.get(i).getName());
				newMap.put("count", countMap.get("count"));
				
				result.add(newMap);
			}
		}
		
		return result;
	}
	
	/**
	 * 创业创新首页查询基地信息列表
	 * @return
	 */
	public Map<String, Object> getMatrixForIndexByParams(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getMatrixForIndexByParamsCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		PageBean pageBean = new PageBean((Long)countMap.get("count"), pageSize, startIndex);
		List<Map<String, Object>> matrixList = exemplaryMatrixApplicationDAO.getMatrixForIndexByParams(params, pageBean.getStart(), pageSize);
		logger.info("查询结果数量为："+matrixList.size());
		result.put("matrixList", matrixList);
		
		return result;
	}
	
	/**
	 * 提交申请
	 * @param params
	 * @return
	 */
	public Integer submitMatrixApplication(Map<String, String> params){
		Integer result = 0;
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy");
		String applicationYear = simpleDateFormat.format(new Date());
		
		Map<String, String> selectParams = new HashMap<String, String>();
		
		selectParams.put("userCode", params.get("userCode"));
		selectParams.put("applicationYear", applicationYear);
		
		ExemplaryMatrixApplication exemplaryMatrixApplicationResult = exemplaryMatrixApplicationDAO.getMatrixInfoByCode(selectParams);
				
		ExemplaryMatrixApplication exemplaryMatrixApplication = new ExemplaryMatrixApplication();
		//撤回的申请要重置递交第三方状态
		if ((exemplaryMatrixApplicationResult.getCityAuditType()!=null || 
				!"".equals(exemplaryMatrixApplicationResult.getCityAuditType()))
				&&"3".equals(exemplaryMatrixApplicationResult.getCityAuditType())) {
			exemplaryMatrixApplication.setSendThirdType("0");
		}
		
		exemplaryMatrixApplication.setUserCode(params.get("userCode"));
		exemplaryMatrixApplication.setType("1");
		exemplaryMatrixApplication.setApplicationYear(applicationYear);
		exemplaryMatrixApplication.setUpdateStamp(new Date());
		result = exemplaryMatrixApplicationDAO.updateApplication(exemplaryMatrixApplication);
		
		return result;
	}
	
	/**
	 * 通过年月信息获取办公设备升级装修改造升级记录
	 * @param params
	 * @return
	 */
	public Map<String, List<Map<String, Object>>> getOfficeEquipmentAndDecorationByParams(Map<String, String> params){
		Map<String, List<Map<String, Object>>> result = new HashMap<String, List<Map<String,Object>>>();
		List<Map<String, Object>> officeEquipmentList = exemplaryMatrixApplicationDAO.getOfficeEquipmentByParams(params);
		List<Map<String, Object>> decorationList = exemplaryMatrixApplicationDAO.getDecorationByParams(params);
		result.put("officeEquipmentList", officeEquipmentList);
		result.put("decorationList", decorationList);
		
		return result;
	}
	
	/**
	 * 20170630 获取月度报表列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMonthlyStatementList(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getMonthlyStatementListCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<Map<String, Object>> monthlyStatementList = exemplaryMatrixApplicationDAO.getMonthlyStatementList(params);
		logger.info("查询结果数量为："+monthlyStatementList.size());
		result.put("monthlyStatementList", monthlyStatementList);
		
		return result;
	}
	
	/**
	 * 通过userCode和年月获取月度服务信息
	 * @param params
	 * @return
	 */
	public List<MonthlyServiceData> getMonthlyServiceDataByYearAndMonth(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getMonthlyServiceDataByYearAndMonth(params);
	}
	
	/**
	 * 区级审核月度报表页面获取列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMonthlyStatementListForAudit(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getMonthlyStatementListForAuditCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<Map<String, Object>> monthlyStatementList = exemplaryMatrixApplicationDAO.getMonthlyStatementListForAudit(params);
		logger.info("查询结果数量为："+monthlyStatementList.size());
		result.put("monthlyStatementList", monthlyStatementList);
		
		return result;
	}
	
	/**
	 * 区级审核月度报表操作
	 * @param params
	 * @return
	 */
	public Integer districtAuditStatement(Map<String, String> params){
		Integer result= 0;
		String matrixCode = params.get("matrixCode");
		String year = params.get("year");
		String quarter = params.get("quarter");
		String auditType = params.get("auditType");
		String recommendations = params.get("recommendations");
		

		ExemplaryMatrixServiceData exemplaryMatrixServiceData = new ExemplaryMatrixServiceData();
		exemplaryMatrixServiceData.setUserCode(matrixCode);
		exemplaryMatrixServiceData.setServiceYear(Integer.parseInt(year));
		exemplaryMatrixServiceData.setServiceQuarter(Integer.parseInt(quarter));
		exemplaryMatrixServiceData.setAuditType(auditType);
		exemplaryMatrixServiceData.setUpdateStamp(new Date());
		exemplaryMatrixServiceData.setRecommendations(recommendations);
		
//		//没通过的话将提交操作置成初始状态
//		if ("0".equals(auditType)) {
//			monthlyServiceData.setSubmitType("0");
//		}
		result += exemplaryMatrixBackstageDAO.updateExemplaryMatrixServiceDataByParams(exemplaryMatrixServiceData);
		
		
		MonthlyOfficeEquipment monthlyOfficeEquipment = new MonthlyOfficeEquipment();
		
		monthlyOfficeEquipment.setUserCode(matrixCode);
		monthlyOfficeEquipment.setYear(Integer.parseInt(year));
		monthlyOfficeEquipment.setMonth(Integer.parseInt(quarter));
		monthlyOfficeEquipment.setAuditType(auditType);
		monthlyOfficeEquipment.setUpdateStamp(new Date());
		result += exemplaryMatrixApplicationDAO.updateMonthlyOfficeEquipment(monthlyOfficeEquipment);
		
		
		MonthlyDecoration monthlyDecoration = new MonthlyDecoration();
		
		monthlyDecoration.setUserCode(matrixCode);
		monthlyDecoration.setYear(Integer.parseInt(year));
		monthlyDecoration.setMonth(Integer.parseInt(quarter));
		monthlyDecoration.setAuditType(auditType);
		monthlyDecoration.setUpdateStamp(new Date());
		result += exemplaryMatrixApplicationDAO.updateMonthlyDecoration(monthlyDecoration);
		
		
		QuarterStatement quarterStatement = new QuarterStatement();
		quarterStatement.setUserCode(matrixCode);
		quarterStatement.setYear(Integer.parseInt(year));
		quarterStatement.setQuarter(Integer.parseInt(quarter));
		quarterStatement.setAuditType(auditType);
		quarterStatement.setUpdateStamp(new Date());
		result += exemplaryMatrixApplicationDAO.updateQuarterStatement(quarterStatement);
		
		ExemplaryMatrixServiceSituation exemplaryMatrixServiceSituation = new ExemplaryMatrixServiceSituation();
		exemplaryMatrixServiceSituation.setUserCode(matrixCode);;
		exemplaryMatrixServiceSituation.setServiceYear(Integer.parseInt(year));
		exemplaryMatrixServiceSituation.setServiceQuarter(Integer.parseInt(quarter));
		exemplaryMatrixServiceSituation.setAuditType(auditType);
		exemplaryMatrixServiceSituation.setUpdateStamp(new Date());
		result += exemplaryMatrixBackstageDAO.updateExemplaryMatrixServiceSituationByParams(exemplaryMatrixServiceSituation);
		
		return result;
	}
	
	/**
	 * 查看月报时获取哪年填写了报表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getMonthlyStatementYears(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getMonthlyStatementYears(params);
	}
	
	/**
	 * 查看季度报表时获取哪年填写了报表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getQuarterStatementYears(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getQuarterStatementYears(params);
	}
	
	/**
	 * 数据统计页面获取信息
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceDataStatistics(Map<String, String> params){
		Map<String, Object> result = new HashMap<String, Object>();
		
//		params = dealWithParams(params);
//		
//		
//		//数据统计页面总数
//		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getServiceDataStatisticsCount(params);
//		//插入返回参数
//		result.put("count", countMap.get("count"));
//		
//		int startIndex = Integer.parseInt(params.get("currentPage"));
//		int pageSize = Integer.parseInt(params.get("pageSize"));
//		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
//		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
//		
//		params.put("startNum", String.valueOf(pageBean.getStart()));
//		params.put("pageSize", String.valueOf(pageSize));
//		List<Map<String, Object>> serviceDataStatisticsList = exemplaryMatrixApplicationDAO.getServiceDataStatistics(params);
//		logger.info("查询结果数量为："+serviceDataStatisticsList.size());
//		
//		if (null != serviceDataStatisticsList && 0!=serviceDataStatisticsList.size()) {
//			for (int i = 0; i < serviceDataStatisticsList.size(); i++) {
//				//查询每一条记录的服务次数
//				String userCode = (String)serviceDataStatisticsList.get(i).get("userCode");
//				Integer serviceYear = (Integer)serviceDataStatisticsList.get(i).get("serviceYear");
//				Integer serviceQuarter = (Integer)serviceDataStatisticsList.get(i).get("serviceQuarter");
//				String serviceSort = (String)serviceDataStatisticsList.get(i).get("serviceCode");
//				String auditType = "1";
//				
//				//服务次数
//				Integer serviceCount = 0;
//				//分别处理每个分类
//				if ("103000001".equals(serviceSort)) {
//					//信息服务类别，对应八大服务的信息服务
//					//查询线上数据
//					Map<String, Integer> onlineData = exemplaryMatrixBackstageService.getOnlineData(userCode, "100000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = exemplaryMatrixBackstageService.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					serviceCount += (Integer)offlineData.get("offlineCount");
//				}else if ("103000002".equals(serviceSort)) {
//					//创业服务，对应八大服务的创业服务
//					//查询线上数据
//					Map<String, Integer> onlineData = exemplaryMatrixBackstageService.getOnlineData(userCode, "103000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = exemplaryMatrixBackstageService.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					serviceCount += (Integer)offlineData.get("offlineCount");
//				}else if ("103000003".equals(serviceSort)) {
//					//创新支持，对应八大服务的技术创新和质量服务
//					//查询线上数据
//					Map<String, Integer> onlineData = exemplaryMatrixBackstageService.getOnlineData(userCode, "102000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = exemplaryMatrixBackstageService.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					serviceCount += (Integer)offlineData.get("offlineCount");
//				}else if ("103000004".equals(serviceSort)) {
//					//人员培训，对应八大服务的人才与培训服务
//					//查询线上数据
//					Map<String, Integer> onlineData = exemplaryMatrixBackstageService.getOnlineData(userCode, "101000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = exemplaryMatrixBackstageService.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					serviceCount += (Integer)offlineData.get("offlineCount");
//				}else if ("103000005".equals(serviceSort)) {
//					//市场营销，对应八大服务的市场开拓服务
//					//查询线上数据
//					Map<String, Integer> onlineData = exemplaryMatrixBackstageService.getOnlineData(userCode, "105000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = exemplaryMatrixBackstageService.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					serviceCount += (Integer)offlineData.get("offlineCount");
//				}else if ("103000006".equals(serviceSort)) {
//					//投融资服务，对应八大服务的投融资服务
//					//查询线上数据
//					Map<String, Integer> onlineData = exemplaryMatrixBackstageService.getOnlineData(userCode, "104000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = exemplaryMatrixBackstageService.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					serviceCount += (Integer)offlineData.get("offlineCount");
//				}else if ("103000007".equals(serviceSort)) {
//					//管理咨询，对应八大服务的管理咨询服务
//					//查询线上数据
//					Map<String, Integer> onlineData = exemplaryMatrixBackstageService.getOnlineData(userCode, "106000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = exemplaryMatrixBackstageService.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					serviceCount += (Integer)offlineData.get("offlineCount");
//				}else if ("103000008".equals(serviceSort)) {
//					//专业服务，对应八大服务的法律服务
//					//查询线上数据
//					Map<String, Integer> onlineData = exemplaryMatrixBackstageService.getOnlineData(userCode, "107000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = exemplaryMatrixBackstageService.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					serviceCount += (Integer)offlineData.get("offlineCount");
//				}
//				serviceDataStatisticsList.get(i).put("serviceCount", serviceCount);
//	 		}
//		}
//		result.put("serviceDataStatisticsList", serviceDataStatisticsList);
		
		return result;
	}
	
	/**
	 * 数据统计页面获取服务总数
	 * @param params
	 * @return
	 */
	public Map<String, Object> getSumForService(Map<String, String> params){
		params = dealWithParams(params);
		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, Object> sumForService = exemplaryMatrixApplicationDAO.getSumForService(params);
		Map<String, Object> sumForPerson = exemplaryMatrixApplicationDAO.getSumForPerson(params);
		if (sumForService!=null) {
			result.put("count", sumForService.get("count"));
		}else {
			result.put("count", 0);
		}
		if (sumForPerson != null) {
			result.put("number", sumForPerson.get("number"));
			result.put("enterNumber", sumForPerson.get("enterNumber"));
		}else{
			result.put("number", 0);
			result.put("enterNumber", 0);
		}
		return result;
	}
	
	/**
	 * 数据统计页面处理参数
	 * @param params
	 * @return
	 */
	private Map<String, String> dealWithParams(Map<String, String> params){
		String fromTime = params.get("fromTime");
		String toTime = params.get("toTime");
		String district = params.get("district");
		logger.info("传入的所属区为："+district);
		if("120000".equals(district)){
			params.put("district", "");
		}
		
		if (fromTime!=null && !"".equals(fromTime)) {
			String fromYear = fromTime.substring(0, 4);
			String fromMonth = fromTime.substring(5, 7);
			logger.info("传入的起始年和月为："+fromYear+","+fromMonth);
			params.put("fromYear", fromYear);
			params.put("fromMonth", fromMonth);
		}
		if (toTime!=null && !"".equals(toTime)) {
			String toYear = toTime.substring(0, 4);
			String toMonth = toTime.substring(5, 7);
			logger.info("传入的截止年和月为："+toYear+","+toMonth);
			params.put("toYear", toYear);
			params.put("toMonth", toMonth);
		}
		return params;
	}
	
	/**
	 * 获取数据统计详细信息方法
	 * @param params
	 * @return
	 */
	public Map<String, Object> getServiceDataStatisticsDetailList(Map<String, String> params){
		Map<String, Object> result = new HashMap<String, Object>();
		
		params = dealWithParams(params);
		
		//数据统计页面总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getSumForService(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<Map<String, Object>> detailList = exemplaryMatrixApplicationDAO.getServiceDataStatisticsDetailList(params);
		logger.info("查询结果数量为："+detailList.size());
		result.put("detailList", detailList);
		
		return result;
	}
	
	/**
	 * 获取申报年限列表
	 * @return
	 */
	public List<Map<String, Object>> getApplicationYearList(){
		return exemplaryMatrixApplicationDAO.getApplicationYearList();
	}
	
	/**
	 * 递交第三方方法
	 * @param params
	 * @return
	 */
	public Integer sendToThirdParty(Map<String, String> params){
		Integer result = 0 ;
		ExemplaryMatrixApplication exemplaryMatrixApplication = new ExemplaryMatrixApplication();
		exemplaryMatrixApplication.setSendThirdType("1");
		//exemplaryMatrixApplication.setApplicationYear(params.get("applicationYear"));
		result = exemplaryMatrixApplicationDAO.sendToThirdParty(exemplaryMatrixApplication);
		return result;
	}
	
	/**
	 * 提交月报
	 *
	 * @param params
	 * @return
	 */
	public Integer submitMonthlyStatement(Map<String, String> params){
		Integer result = 0;
		String matrixCode = params.get("userCode");
		String year = params.get("year");
		String quarter = params.get("quarter");
		
		//增加判断当季度的运营情况是否填写了，没填写的不让提交
//		if ("1".equals(quarter)) {
//			QuarterStatement quarterStatementResult = exemplaryMatrixApplicationDAO.findStatementByParam(params);
//			if (quarterStatementResult == null) {
//				result = -1;
//				return result;
//			}
//		}else {
//			QuarterStatement quarterStatementResult = exemplaryMatrixApplicationDAO.findStatementByParam(params);
//			if (quarterStatementResult == null) {
//				String newQuarter = String.valueOf((Integer.parseInt(params.get("quarter"))-1));
//				params.put("quarter", newQuarter);
//				QuarterStatement quarterStatementResult2 = exemplaryMatrixApplicationDAO.findStatementByParam(params);
//				if (quarterStatementResult2 == null) {
//					result = -1;
//					return result;
//				}else{
//					quarterStatementResult2.setQuarter(Integer.parseInt(quarter));
//					exemplaryMatrixApplicationDAO.saveQuarterStatement(quarterStatementResult2);
//				}
//			}
//		}
//		params.put("quarter", quarter);
		//因为修改了提交的逻辑，当前季度提交上一季度，所以只要判断是不是填写了运营情况就行
		QuarterStatement quarterStatementResult = exemplaryMatrixApplicationDAO.findStatementByParam(params);
		if (quarterStatementResult == null) {
			result = -1;
			return result;
		}
		//判断上一季度的是否已经提交过了
		Map<String, String> getSubmitResultParam = new HashMap<String, String>();
		getSubmitResultParam.put("userCode", matrixCode);
		getSubmitResultParam.put("serviceYear", year);
		getSubmitResultParam.put("serviceQuarter", quarter);
		List<Map<String, Object>> submitResultList = exemplaryMatrixApplicationDAO.getSubmitResult(getSubmitResultParam);
		if (submitResultList!=null && submitResultList.size()!=0) {
			if ("1".equals((String)submitResultList.get(0).get("submitType")) && "0".equals((String)submitResultList.get(0).get("auditType"))) {
				result = -2;
				return result;
			}else if("1".equals((String)submitResultList.get(0).get("submitType")) && "2".equals((String)submitResultList.get(0).get("auditType"))){
				
			}else if("1".equals((String)submitResultList.get(0).get("submitType")) && "1".equals((String)submitResultList.get(0).get("auditType"))){
				result = -3;
				return result;
			}
		}
		
		
		ExemplaryMatrixServiceData exemplaryMatrixServiceData = new ExemplaryMatrixServiceData();
		exemplaryMatrixServiceData.setUserCode(matrixCode);
		exemplaryMatrixServiceData.setServiceYear(Integer.parseInt(year));
		exemplaryMatrixServiceData.setServiceQuarter(Integer.parseInt(quarter));
		exemplaryMatrixServiceData.setSubmitType("1");
		exemplaryMatrixServiceData.setAuditType("0");
		exemplaryMatrixServiceData.setUpdateStamp(new Date());
		
		result += exemplaryMatrixBackstageDAO.updateExemplaryMatrixServiceDataByParams(exemplaryMatrixServiceData);
		
		
		MonthlyOfficeEquipment monthlyOfficeEquipment = new MonthlyOfficeEquipment();
		
		monthlyOfficeEquipment.setUserCode(matrixCode);
		monthlyOfficeEquipment.setYear(Integer.parseInt(year));
		monthlyOfficeEquipment.setMonth(Integer.parseInt(quarter));
		monthlyOfficeEquipment.setAuditType("0");
		monthlyOfficeEquipment.setUpdateStamp(new Date());
		result += exemplaryMatrixApplicationDAO.updateMonthlyOfficeEquipment(monthlyOfficeEquipment);
		
		
		MonthlyDecoration monthlyDecoration = new MonthlyDecoration();
		
		monthlyDecoration.setUserCode(matrixCode);
		monthlyDecoration.setYear(Integer.parseInt(year));
		monthlyDecoration.setMonth(Integer.parseInt(quarter));
		monthlyDecoration.setAuditType("0");
		monthlyDecoration.setUpdateStamp(new Date());
		result += exemplaryMatrixApplicationDAO.updateMonthlyDecoration(monthlyDecoration);
		
		QuarterStatement quarterStatement = new QuarterStatement();
		quarterStatement.setUserCode(matrixCode);
		quarterStatement.setYear(Integer.parseInt(year));
		quarterStatement.setQuarter(Integer.parseInt(quarter));
		quarterStatement.setAuditType("0");
		quarterStatement.setUpdateStamp(new Date());
		result += exemplaryMatrixApplicationDAO.updateQuarterStatement(quarterStatement);
		
		return result;
	}
	
	/**
	 * 提交月报(七月)
	 *
	 * @param params
	 * @return
	 */
	public Integer submitMonthlyStatementSeven(Map<String, String> params){
		Integer result = 0;
		String matrixCode = params.get("userCode");
		String year = params.get("year");
		
		List<Map<String, String>> paramsList = new ArrayList<Map<String,String>>();
		Map<String, String> params1 = new HashMap<String, String>();
		params1.put("userCode", matrixCode);
		params1.put("year", String.valueOf(Integer.parseInt(year)-1));
		params1.put("quarter", "4");
		
		Map<String, String> params2 = new HashMap<String, String>();
		params2.put("userCode", matrixCode);
		params2.put("year", year);
		params2.put("quarter", "1");
		
		paramsList.add(params1);
		paramsList.add(params2);
		paramsList.add(params);

		for (int i = 0; i < paramsList.size(); i++) {
			String submitYear = paramsList.get(i).get("year");
			String submitQuarter = paramsList.get(i).get("quarter");
			
			
			//因为修改了提交的逻辑，当前季度提交上一季度，所以只要判断是不是填写了运营情况就行
			QuarterStatement quarterStatementResult = exemplaryMatrixApplicationDAO.findStatementByParam(paramsList.get(i));
			if (quarterStatementResult == null) {
				result = -1;
				return result;
			}
			
			
			//判断上一季度的是否已经提交过了
			Map<String, String> getSubmitResultParam = new HashMap<String, String>();
			getSubmitResultParam.put("userCode", matrixCode);
			getSubmitResultParam.put("serviceYear", submitYear);
			getSubmitResultParam.put("serviceQuarter", submitQuarter);
			List<Map<String, Object>> submitResultList = exemplaryMatrixApplicationDAO.getSubmitResult(getSubmitResultParam);
			if (submitResultList!=null && submitResultList.size()!=0) {
				if ("1".equals((String)submitResultList.get(0).get("submitType")) && "0".equals((String)submitResultList.get(0).get("auditType"))) {
					result = -2;
					return result;
				}else if("1".equals((String)submitResultList.get(0).get("submitType")) && "2".equals((String)submitResultList.get(0).get("auditType"))){
					
				}else if("1".equals((String)submitResultList.get(0).get("submitType")) && "1".equals((String)submitResultList.get(0).get("auditType"))){
					result = -3;
					return result;
				}
			}
		}
		
		for (int i = 0; i < paramsList.size(); i++) {
			String submitYear = paramsList.get(i).get("year");
			String submitQuarter = paramsList.get(i).get("quarter");
			ExemplaryMatrixServiceData exemplaryMatrixServiceData = new ExemplaryMatrixServiceData();
			exemplaryMatrixServiceData.setUserCode(matrixCode);
			exemplaryMatrixServiceData.setServiceYear(Integer.parseInt(submitYear));
			exemplaryMatrixServiceData.setServiceQuarter(Integer.parseInt(submitQuarter));
			exemplaryMatrixServiceData.setSubmitType("1");
			exemplaryMatrixServiceData.setAuditType("0");
			exemplaryMatrixServiceData.setUpdateStamp(new Date());
			
			result += exemplaryMatrixBackstageDAO.updateExemplaryMatrixServiceDataByParams(exemplaryMatrixServiceData);
			
			
			MonthlyOfficeEquipment monthlyOfficeEquipment = new MonthlyOfficeEquipment();
			
			monthlyOfficeEquipment.setUserCode(matrixCode);
			monthlyOfficeEquipment.setYear(Integer.parseInt(submitYear));
			monthlyOfficeEquipment.setMonth(Integer.parseInt(submitQuarter));
			monthlyOfficeEquipment.setAuditType("0");
			monthlyOfficeEquipment.setUpdateStamp(new Date());
			result += exemplaryMatrixApplicationDAO.updateMonthlyOfficeEquipment(monthlyOfficeEquipment);
			
			MonthlyDecoration monthlyDecoration = new MonthlyDecoration();
			
			monthlyDecoration.setUserCode(matrixCode);
			monthlyDecoration.setYear(Integer.parseInt(submitYear));
			monthlyDecoration.setMonth(Integer.parseInt(submitQuarter));
			monthlyDecoration.setAuditType("0");
			monthlyDecoration.setUpdateStamp(new Date());
			result += exemplaryMatrixApplicationDAO.updateMonthlyDecoration(monthlyDecoration);
			
			QuarterStatement quarterStatement = new QuarterStatement();
			quarterStatement.setUserCode(matrixCode);
			quarterStatement.setYear(Integer.parseInt(submitYear));
			quarterStatement.setQuarter(Integer.parseInt(submitQuarter));
			quarterStatement.setAuditType("0");
			quarterStatement.setUpdateStamp(new Date());
			result += exemplaryMatrixApplicationDAO.updateQuarterStatement(quarterStatement);
		}
		
		return result;
	}
	
	
	/**
	 * 获取未填写当前月份月报的示范基地数量
	 * 2018-3-9修改为填写季度报表
	 * @return
	 */
	public Map<String, Object> getSumForMatrixNoMonthly(Map<String, String> params){
		//将示范基地信息表中，所有记录的填写月报标签置为初始状态
		ExemplaryMatrix exemplaryMatrix1 = new ExemplaryMatrix();
		exemplaryMatrix1.setMonthlyStatementStatus("0");
		exemplaryMatrixApplicationDAO.updateExemplaryMatrix(exemplaryMatrix1);
		
		//将这个月填写了月报的示范基地信息状态置为1
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String nowTime = simpleDateFormat.format(new Date());
		String year = nowTime.substring(0, 4);
		String month = nowTime.substring(5, 7);
		
		Map<String, String> updateParam = new HashMap<String, String>();
		updateParam.put("year", year);
		
		Integer  monthIngeger = Integer.parseInt(month);
		if (monthIngeger>=1 && monthIngeger<=3) {
			updateParam.put("quarter", "1");
		}else if(monthIngeger>=4 && monthIngeger<=6){
			updateParam.put("quarter", "2");
		}else if (monthIngeger>=7 && monthIngeger<=9) {
			updateParam.put("quarter", "3");
		}else if (monthIngeger>=10 && monthIngeger<=12) {
			updateParam.put("quarter", "4");
		}
		exemplaryMatrixApplicationDAO.updateMonthlyStatementStatus(updateParam);
		
		if ("120000".equals(params.get("district"))) {
			params.put("district", "");
		}
		return exemplaryMatrixApplicationDAO.getSumForMatrixNoMonthly(params);
	}
	
	/**
	 * 获取未填写当前月份月报的示范基地详情
	 * @param params
	 * @return
	 */
	public Map<String, Object> getMatrixNoMonthlyDetailList(Map<String, String> params){
		Map<String, Object> result = new HashMap<String, Object>();
		
		if ("120000".equals(params.get("district"))) {
			params.put("district", "");
		}
		
		//未填写本月月报示范基地总数
		Map<String, Object> countMap = exemplaryMatrixApplicationDAO.getSumForMatrixNoMonthly(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<Map<String, Object>> detailList = exemplaryMatrixApplicationDAO.getMatrixNoMonthlyDetailList(params);
		logger.info("查询结果数量为："+detailList.size());
		result.put("detailList", detailList);
		
		return result;
	}
	
	/**
	 * 2018新增需求，区级将示范基地信息退回
	 * @param params
	 * @return
	 */
	public Integer sendBackMatrixInfo(Map<String , String > params){
		Integer result = 0;
		ExemplaryMatrixApplication exemplaryMatrixApplication = new ExemplaryMatrixApplication();
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		exemplaryMatrixApplication.setUserCode(params.get("userCode"));
		exemplaryMatrixApplication.setApplicationYear(params.get("applicationYear"));
		exemplaryMatrixApplication.setType("0");
		exemplaryMatrixApplication.setDistrictAuditType("0");
		exemplaryMatrixApplication.setDistrictAuditTime(simpleDateFormat.format(new Date()));
		exemplaryMatrixApplication.setThirdPartyAuditType("0");
		exemplaryMatrixApplication.setCityAuditType("0");
		exemplaryMatrixApplication.setSendThirdType("0");
		result += exemplaryMatrixApplicationDAO.updateApplication(exemplaryMatrixApplication);
		
		ExemplaryMatrix exemplaryMatrix = new ExemplaryMatrix();
		exemplaryMatrix.setUserCode(params.get("userCode"));
		
		result += exemplaryMatrixApplicationDAO.deleteExemplaryMatrixInfoByUserCode(exemplaryMatrix);
		return result;
	}
	
	/**
	 * 通过userCode获取示范基地表信息，用来验证该基地是否示范基地
	 * @param params
	 * @return
	 */
	public ExemplaryMatrix findExemplaryMatrixInfoByUserCode(Map<String, String> params){
		return exemplaryMatrixApplicationDAO.getExemplaryMatrixByUserCode(params);
	}

}
