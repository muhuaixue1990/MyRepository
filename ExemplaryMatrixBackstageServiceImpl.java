package com.zl.service.impl;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
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

import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zl.bean.CooperationFacilitatingAgency;
import com.zl.bean.ExemplaryMatrix;
import com.zl.bean.ExemplaryMatrixApplication;
import com.zl.bean.ExemplaryMatrixOnlineData;
import com.zl.bean.ExemplaryMatrixServiceData;
import com.zl.bean.ExemplaryMatrixServiceSituation;
import com.zl.bean.ExemplaryMatrixSettledEnterprise;
import com.zl.bean.ExemplaryMatrixStatementStatus;
import com.zl.bean.SysCode;
import com.zl.bean.view.ExemplaryMatrixStatementManageView;
import com.zl.dao.ExemplaryMatrixApplicationDAO;
import com.zl.dao.ExemplaryMatrixBackstageDAO;
import com.zl.service.BaseService;
import com.zl.service.ExemplaryMatrixApplicationService;
import com.zl.service.ExemplaryMatrixBackstageService;
import com.zl.service.SysCodeService;
import com.zl.utils.LoadPropperties;
import com.zl.utils.PageBean;

/**
 * 示范基地后台Service实现
 * @author muhuaixue
 *
 */
@Service
@Transactional
public class ExemplaryMatrixBackstageServiceImpl extends BaseService implements ExemplaryMatrixBackstageService{
	
	/**
	 * 示范基地后台dao
	 */
	private ExemplaryMatrixBackstageDAO exemplaryMatrixBackstageDAO;
	
	/**
	 * 系统编码Service
	 */
	private SysCodeService sysCodeService;
	
	/**
	 * 示范基地申请service
	 */
	private ExemplaryMatrixApplicationService exemplaryMatrixApplicationService;
	
	/**
	 * 示范基地申请dao
	 */
	private ExemplaryMatrixApplicationDAO exemplaryMatrixApplicationDAO;

	public ExemplaryMatrixBackstageDAO getExemplaryMatrixBackstageDAO() {
		return exemplaryMatrixBackstageDAO;
	}

	@Resource
	public void setExemplaryMatrixBackstageDAO(
			ExemplaryMatrixBackstageDAO exemplaryMatrixBackstageDAO) {
		this.exemplaryMatrixBackstageDAO = exemplaryMatrixBackstageDAO;
	}
	
	@Resource
	public void setSysCodeService(SysCodeService sysCodeService) {
		this.sysCodeService = sysCodeService;
	}
	
	@Resource
	public void setExemplaryMatrixApplicationService(
			ExemplaryMatrixApplicationService exemplaryMatrixApplicationService) {
		this.exemplaryMatrixApplicationService = exemplaryMatrixApplicationService;
	}
	
	@Resource
	public void setExemplaryMatrixApplicationDAO(
			ExemplaryMatrixApplicationDAO exemplaryMatrixApplicationDAO) {
		this.exemplaryMatrixApplicationDAO = exemplaryMatrixApplicationDAO;
	}

	/**
	 * 获取入驻企业列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> findSettledEnterpriseList(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixBackstageDAO.findSettledEnterpriseCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<ExemplaryMatrixSettledEnterprise> exemplaryMatrixSettledEnterprises = exemplaryMatrixBackstageDAO.findSettledEnterpriseList(params);
		logger.info("查询结果数量为："+exemplaryMatrixSettledEnterprises.size());
		result.put("exemplaryMatrixSettledEnterprises", exemplaryMatrixSettledEnterprises);
		
		return result;
	}
	
	/**
	 * 通过id获取入驻企业信息
	 * @param params
	 * @return
	 */
	public ExemplaryMatrixSettledEnterprise findSettledEnterpriseById(Map<String, String> params){
		ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise = exemplaryMatrixBackstageDAO.findSettledEnterpriseById(params);
		String path = LoadPropperties.getProperty("saveDbPath");
		exemplaryMatrixSettledEnterprise.setPicture(path + exemplaryMatrixSettledEnterprise.getPicture());
		return exemplaryMatrixSettledEnterprise;
	}
	
	/**
	 * 通过id删除入驻企业信息
	 * @param params
	 * @return
	 */
	public Integer deleteSettledEnterpriseById(Map<String, String> params){
		return exemplaryMatrixBackstageDAO.deleteSettledEnterpriseById(params);
	}
	
	/**
	 * 插入入驻企业信息
	 * @param exemplaryMatrixSettledEnterprise
	 * @return
	 */
	public Integer saveOrUpdateSettledEnterprise(ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise){
		Integer id = exemplaryMatrixSettledEnterprise.getId();
		if (id == null) {
			exemplaryMatrixSettledEnterprise.setCreateStamp(new Date());
			exemplaryMatrixSettledEnterprise.setUpdateStamp(new Date());
			return exemplaryMatrixBackstageDAO.saveSettledEnterprise(exemplaryMatrixSettledEnterprise);
		}else{
			exemplaryMatrixSettledEnterprise.setUpdateStamp(new Date());
			return exemplaryMatrixBackstageDAO.updateSettledEnterpriseById(exemplaryMatrixSettledEnterprise);
		}
	}
	

	/**
	 * 上传入驻企业信息
	 * @param filePath
	 * @param id
	 * @param time
	 * @return
	 * @throws IOException
	 */
	public Integer saveSettledEnterpriseForFile(String filePath,String userCode) throws IOException {//return 1:成功2：文件格式不对3：新增报错4：操作失败
		Integer result = 0;
		
		String fileType = filePath.substring(filePath.lastIndexOf(".") + 1, filePath.length());
		InputStream is = null;
		XSSFWorkbook wb = null;
		if(!fileType.equals("xlsx")){
			return -1;
		}
		is = new FileInputStream(filePath);
		wb = new XSSFWorkbook(is);
		XSSFSheet sheet = wb.getSheetAt(0);
		int rowSize = sheet.getLastRowNum() + 1;
		for (int j = 0; j < rowSize; j++) {
			XSSFRow row = sheet.getRow(j);
			//20180404验证是否模板，利用表头
			if (j == 0) {
				if (!"企业名称".equals(String.valueOf(row.getCell(0))) 
						|| !"注册地址".equals(String.valueOf(row.getCell(1))) 
						|| !"法人代表".equals(String.valueOf(row.getCell(2)))
						|| !"联系人".equals(String.valueOf(row.getCell(3)))
						|| !"联系电话".equals(String.valueOf(row.getCell(4)))
						|| !"主要产品或主营业务".equals(String.valueOf(row.getCell(5)))) {
					result = -1;
					return result;
				}
			}else{
				ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise = new ExemplaryMatrixSettledEnterprise();
				exemplaryMatrixSettledEnterprise.setUserCode(userCode);
				exemplaryMatrixSettledEnterprise.setEnterName(String.valueOf(row.getCell(0)));
				exemplaryMatrixSettledEnterprise.setRegisteredAddress(String.valueOf(row.getCell(1)));
				exemplaryMatrixSettledEnterprise.setLegalRepresentative(String.valueOf(row.getCell(2)));
				exemplaryMatrixSettledEnterprise.setContacter(String.valueOf(row.getCell(3)));
				exemplaryMatrixSettledEnterprise.setContactPhone(String.valueOf(row.getCell(4)));
				exemplaryMatrixSettledEnterprise.setProductProfession(String.valueOf(row.getCell(5)));
				
				exemplaryMatrixSettledEnterprise.setCreateStamp(new Date());
				exemplaryMatrixSettledEnterprise.setUpdateStamp(new Date());
				
				result += exemplaryMatrixBackstageDAO.saveSettledEnterprise(exemplaryMatrixSettledEnterprise);
			}
		}
		return result;
	}
	
	/**
	 * 通过id更新入驻企业信息
	 * @param params
	 * @return
	 */
	public Integer updateSettledEnterpriseById(ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise){
		exemplaryMatrixSettledEnterprise.setUpdateStamp(new Date());
		return exemplaryMatrixBackstageDAO.updateSettledEnterpriseById(exemplaryMatrixSettledEnterprise);
	}
	
	/**
	 * 插入基地开展服务情况
	 * @param request
	 * @return
	 */
	public Integer saveExemplaryMatrixServiceData(ExemplaryMatrixServiceData exemplaryMatrixServiceData){
		Integer result = 0;
		
		String userCode = exemplaryMatrixServiceData.getUserCode();
		String serviceYear = exemplaryMatrixServiceData.getServiceYear().toString();
		String serviceQuarter = exemplaryMatrixServiceData.getServiceQuarter().toString();
		
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", userCode);
		params.put("serviceYear", serviceYear);
		params.put("serviceQuarter", serviceQuarter);
		//执行删除操作（删除之前添加的那条记录）
		exemplaryMatrixBackstageDAO.deleteExemplaryMatrixServiceDataByParams(params);
		
		
		//查询当前状态是否为未通过状态
		boolean noPass = false;
		ExemplaryMatrixServiceData auditResult = exemplaryMatrixBackstageDAO.getAuditResult(params);
		if(auditResult!=null){
			if("2".equals(auditResult.getAuditType())){
				noPass = true;
			}
		}
		
		
		if("offline".equals(exemplaryMatrixServiceData.getLineType())){
			if (0==(exemplaryMatrixServiceData.getId())) {
				logger.info("没有数据，插入中间表数据");
				ExemplaryMatrixOnlineData exemplaryMatrixOnlineData = new ExemplaryMatrixOnlineData();
				exemplaryMatrixOnlineData.setServiceAddress(exemplaryMatrixServiceData.getActivityAddress());
				exemplaryMatrixOnlineData.setServiceType("service");
				exemplaryMatrixOnlineData.setUserCode(exemplaryMatrixServiceData.getUserCode());
				exemplaryMatrixOnlineData.setServiceYear(exemplaryMatrixServiceData.getServiceYear());
				exemplaryMatrixOnlineData.setServiceQuarter(exemplaryMatrixServiceData.getServiceQuarter());
				exemplaryMatrixOnlineData.setServiceName(exemplaryMatrixServiceData.getActivityName());
				exemplaryMatrixOnlineData.setServiceTime(exemplaryMatrixServiceData.getActivityTime());
				exemplaryMatrixOnlineData.setServiceAddress(exemplaryMatrixServiceData.getActivityAddress());
				exemplaryMatrixOnlineData.setServiceSort(exemplaryMatrixServiceData.getActivityClass());
				exemplaryMatrixOnlineData.setHaveType("1");
				exemplaryMatrixOnlineData.setCreateStamp(new Date());
				exemplaryMatrixOnlineData.setUpdateStamp(new Date());
				exemplaryMatrixOnlineData.setLineType("offline");
				exemplaryMatrixBackstageDAO.insertExemplaryMatrixOnlineData(exemplaryMatrixOnlineData);
				
				exemplaryMatrixServiceData.setServiceId(exemplaryMatrixOnlineData.getId());
				exemplaryMatrixServiceData.setAuditType("0");
				exemplaryMatrixServiceData.setSubmitType("0");
				exemplaryMatrixServiceData.setCreateStamp(new Date());
				exemplaryMatrixServiceData.setUpdateStamp(new Date());
				if (noPass) {
					exemplaryMatrixServiceData.setSubmitType(auditResult.getSubmitType());
					exemplaryMatrixServiceData.setAuditType(auditResult.getAuditType());
					exemplaryMatrixServiceData.setRecommendations(auditResult.getRecommendations());
				}
				
				result += exemplaryMatrixBackstageDAO.saveExemplaryMatrixServiceData(exemplaryMatrixServiceData);
			}else{
				logger.info("有数据，更新中间表数据");
				ExemplaryMatrixOnlineData exemplaryMatrixOnlineData = new ExemplaryMatrixOnlineData();
				exemplaryMatrixOnlineData.setId(exemplaryMatrixServiceData.getServiceId());
				exemplaryMatrixOnlineData.setServiceAddress(exemplaryMatrixServiceData.getActivityAddress());
				exemplaryMatrixOnlineData.setServiceType("service");
				exemplaryMatrixOnlineData.setUserCode(exemplaryMatrixServiceData.getUserCode());
				exemplaryMatrixOnlineData.setServiceYear(exemplaryMatrixServiceData.getServiceYear());
				exemplaryMatrixOnlineData.setServiceQuarter(exemplaryMatrixServiceData.getServiceQuarter());
				exemplaryMatrixOnlineData.setServiceName(exemplaryMatrixServiceData.getActivityName());
				exemplaryMatrixOnlineData.setServiceTime(exemplaryMatrixServiceData.getActivityTime());
				exemplaryMatrixOnlineData.setServiceAddress(exemplaryMatrixServiceData.getActivityAddress());
				exemplaryMatrixOnlineData.setServiceSort(exemplaryMatrixServiceData.getActivityClass());
				exemplaryMatrixOnlineData.setHaveType("1");
				exemplaryMatrixOnlineData.setUpdateStamp(new Date());
				exemplaryMatrixOnlineData.setLineType("offline");
				//更新填报状态
				exemplaryMatrixBackstageDAO.updateOnlineDataTypeByServiceId(exemplaryMatrixOnlineData);
				
				if (noPass) {
					exemplaryMatrixServiceData.setSubmitType(auditResult.getSubmitType());
					exemplaryMatrixServiceData.setAuditType(auditResult.getAuditType());
					exemplaryMatrixServiceData.setRecommendations(auditResult.getRecommendations());
				}else{
					exemplaryMatrixServiceData.setAuditType("0");
					exemplaryMatrixServiceData.setSubmitType("0");
				}
				exemplaryMatrixServiceData.setUpdateStamp(new Date());
				
				result += exemplaryMatrixBackstageDAO.updateExemplaryMatrixServiceData(exemplaryMatrixServiceData);
			}
			//20180403增加报表状态
			ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus =  new ExemplaryMatrixStatementStatus();
			exemplaryMatrixStatementStatus.setUserCode(userCode);
			exemplaryMatrixStatementStatus.setServiceYear(Integer.parseInt(serviceYear));
			exemplaryMatrixStatementStatus.setServiceQuarter(Integer.parseInt(serviceQuarter));
			exemplaryMatrixStatementStatus.setStatementName("线上服务");
			exemplaryMatrixStatementStatus.setStatus("1");
			exemplaryMatrixStatementStatus.setCreateStamp(new Date());
			exemplaryMatrixStatementStatus.setUpdateStamp(new Date());
			this.insertOrUpdateStatementStatus(exemplaryMatrixStatementStatus);
			
		}else if ("online".equals(exemplaryMatrixServiceData.getLineType())) {
			ExemplaryMatrixOnlineData exemplaryMatrixOnlineData = new ExemplaryMatrixOnlineData();
			exemplaryMatrixOnlineData.setId(exemplaryMatrixServiceData.getServiceId());
			exemplaryMatrixOnlineData.setServiceAddress(exemplaryMatrixServiceData.getActivityAddress());
			exemplaryMatrixOnlineData.setHaveType("1");
			//更新填报状态
			exemplaryMatrixBackstageDAO.updateOnlineDataTypeByServiceId(exemplaryMatrixOnlineData);
			
			Map<String, String> getResultParam = new HashMap<String, String>();
			getResultParam.put("serviceId", exemplaryMatrixServiceData.getServiceId().toString());
			List<ExemplaryMatrixServiceData> exemplaryMatrixServiceData2 = this.findExemplaryMatrixServiceDataByParams(getResultParam);
			if(null == exemplaryMatrixServiceData2 || 0==exemplaryMatrixServiceData2.size()){
				if (noPass) {
					exemplaryMatrixServiceData.setSubmitType(auditResult.getSubmitType());
					exemplaryMatrixServiceData.setAuditType(auditResult.getAuditType());
					exemplaryMatrixServiceData.setRecommendations(auditResult.getRecommendations());
				}else{
					exemplaryMatrixServiceData.setAuditType("0");
					exemplaryMatrixServiceData.setSubmitType("0");
				}
				exemplaryMatrixServiceData.setCreateStamp(new Date());
				exemplaryMatrixServiceData.setUpdateStamp(new Date());
				
				result += exemplaryMatrixBackstageDAO.saveExemplaryMatrixServiceData(exemplaryMatrixServiceData);
			}else {
				ExemplaryMatrixServiceData updateData = exemplaryMatrixServiceData2.get(0);
				updateData.setActivityName(exemplaryMatrixServiceData.getActivityName());
				updateData.setActivityTime(exemplaryMatrixServiceData.getActivityTime());
				updateData.setActivityAddress(exemplaryMatrixServiceData.getActivityAddress());
				updateData.setActivityClass(exemplaryMatrixServiceData.getActivityClass());
				updateData.setPersonQuantity(exemplaryMatrixServiceData.getPersonQuantity());
				updateData.setEnterpriseQuantity(exemplaryMatrixServiceData.getEnterpriseQuantity());
				updateData.setCooperationOrganization(exemplaryMatrixServiceData.getCooperationOrganization());
				updateData.setEnterpriseDetail(exemplaryMatrixServiceData.getEnterpriseDetail());
				updateData.setActivityOverview(exemplaryMatrixServiceData.getActivityOverview());
				updateData.setTotalExpend(exemplaryMatrixServiceData.getTotalExpend());
				updateData.setPersonalExpend(exemplaryMatrixServiceData.getPersonalExpend());
				updateData.setSiteExpend(exemplaryMatrixServiceData.getSiteExpend());
				updateData.setDataExpend(exemplaryMatrixServiceData.getDataExpend());
				updateData.setCooperationOrganizationExpend(exemplaryMatrixServiceData.getCooperationOrganizationExpend());
				updateData.setOtherExpend(exemplaryMatrixServiceData.getOtherExpend());
				updateData.setActivityInformPic(exemplaryMatrixServiceData.getActivityInformPic());
				updateData.setActivityCompletePic(exemplaryMatrixServiceData.getActivityCompletePic());
				updateData.setActivityPartPic(exemplaryMatrixServiceData.getActivityPartPic());
				updateData.setActivityContentPic(exemplaryMatrixServiceData.getActivityContentPic());
				updateData.setEvaluatePic(exemplaryMatrixServiceData.getEvaluatePic());
				updateData.setBillPic(exemplaryMatrixServiceData.getBillPic());
				updateData.setCost(exemplaryMatrixServiceData.getCost());
				if (noPass) {
					updateData.setSubmitType(auditResult.getSubmitType());
					updateData.setAuditType(auditResult.getAuditType());
					updateData.setRecommendations(auditResult.getRecommendations());
				}else{
					updateData.setAuditType("0");
					updateData.setSubmitType("0");
				}
				updateData.setUpdateStamp(new Date());
				result += exemplaryMatrixBackstageDAO.updateExemplaryMatrixServiceData(updateData);
			}
			
			//20180403增加报表状态
			ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus =  new ExemplaryMatrixStatementStatus();
			exemplaryMatrixStatementStatus.setUserCode(userCode);
			exemplaryMatrixStatementStatus.setServiceYear(Integer.parseInt(serviceYear));
			exemplaryMatrixStatementStatus.setServiceQuarter(Integer.parseInt(serviceQuarter));
			exemplaryMatrixStatementStatus.setStatementName("线上服务");
			exemplaryMatrixStatementStatus.setStatus("1");
			exemplaryMatrixStatementStatus.setCreateStamp(new Date());
			exemplaryMatrixStatementStatus.setUpdateStamp(new Date());
			this.insertOrUpdateStatementStatus(exemplaryMatrixStatementStatus);
			
		}
		logger.info("一共插入基地开展服务情况条数为："+result);
		return result;
	}
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixServiceData> findExemplaryMatrixServiceDataByParams(Map<String, String> params){
		List<ExemplaryMatrixServiceData> exemplaryMatrixServiceDatas = exemplaryMatrixBackstageDAO.findExemplaryMatrixServiceDataByParams(params);
		if (null!=exemplaryMatrixServiceDatas && 0!=exemplaryMatrixServiceDatas.size()) {
			String path = LoadPropperties.getProperty("saveDbPath");
			for (int i = 0; i < exemplaryMatrixServiceDatas.size(); i++) {
				exemplaryMatrixServiceDatas.get(i).setActivityInformPic(path + exemplaryMatrixServiceDatas.get(i).getActivityInformPic());
				exemplaryMatrixServiceDatas.get(i).setActivityCompletePic(path + exemplaryMatrixServiceDatas.get(i).getActivityCompletePic());
				exemplaryMatrixServiceDatas.get(i).setActivityPartPic(path + exemplaryMatrixServiceDatas.get(i).getActivityPartPic());
				exemplaryMatrixServiceDatas.get(i).setActivityContentPic(path + exemplaryMatrixServiceDatas.get(i).getActivityContentPic());
				exemplaryMatrixServiceDatas.get(i).setEvaluatePic(path + exemplaryMatrixServiceDatas.get(i).getEvaluatePic());
				exemplaryMatrixServiceDatas.get(i).setBillPic(path + exemplaryMatrixServiceDatas.get(i).getBillPic());
				exemplaryMatrixServiceDatas.get(i).setEnterpriseDetail(path + exemplaryMatrixServiceDatas.get(i).getEnterpriseDetail());
			}
		}
		return exemplaryMatrixServiceDatas;
	}
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据(分页)
	 * @param params
	 * @return
	 */
	public Map<String, Object> findExemplaryMatrixServiceDataByParamsForPage(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixBackstageDAO.findExemplaryMatrixServiceDataByParamsForPageCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<ExemplaryMatrixServiceData> serviceDataList = exemplaryMatrixBackstageDAO.findExemplaryMatrixServiceDataByParamsForPage(params);
		
		//拼路径
		if (null != serviceDataList && 0!=serviceDataList.size()) {
			String showPath=LoadPropperties.getProperty("saveDbPath");
			for (int i = 0; i < serviceDataList.size(); i++) {
				serviceDataList.get(i).setActivityInformPic(showPath + serviceDataList.get(i).getActivityInformPic());
				serviceDataList.get(i).setActivityCompletePic(showPath + serviceDataList.get(i).getActivityCompletePic());
				serviceDataList.get(i).setActivityPartPic(showPath + serviceDataList.get(i).getActivityPartPic());
				serviceDataList.get(i).setActivityContentPic(showPath + serviceDataList.get(i).getActivityContentPic());
				
				serviceDataList.get(i).setEnterpriseDetail(showPath + serviceDataList.get(i).getEnterpriseDetail());
				serviceDataList.get(i).setEvaluatePic(showPath + serviceDataList.get(i).getEvaluatePic());
				serviceDataList.get(i).setBillPic(showPath + serviceDataList.get(i).getBillPic());
			}
		}
		
		result.put("serviceDataList", serviceDataList);
		return result;
	}
	
	/**
	 * 获取基地报表管理列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findStatementManageList(Map<String, String> params){
		//获取userCode
		String userCode = params.get("userCode");
		
		//查询当年是不是有数据，没有的话插入四条数据
		//获取当前时间
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String nowTime = simpleDateFormat.format(new Date());
		//获取当前年份和月份
		String nowYear = nowTime.substring(0, 4);
		//20180418修改
		String paramYear = params.get("serviceYear");
		logger.info("当前年份及季度为："+paramYear);
		
		//查询当前季度是否有数据
		Map<String, String> findHavedDataParams = new HashMap<String, String>();
		findHavedDataParams.put("userCode", userCode);
		findHavedDataParams.put("serviceYear", paramYear);
		Map<String, Object> havedDataCount = exemplaryMatrixBackstageDAO.findStatementCountByNowTime(findHavedDataParams);
		logger.info("查询当年数据为："+havedDataCount);
		//判断是否为零
		BigDecimal haveDataCountDecimal = (BigDecimal)havedDataCount.get("count");
		//如果没有数据则插入一条本季度的数据
		if (haveDataCountDecimal.compareTo(new BigDecimal(0)) == 0) {
			Integer saveResult = 0;
			for (int i = 0; i < 4; i++) {
				ExemplaryMatrixServiceData exemplaryMatrixServiceData = new ExemplaryMatrixServiceData();
				exemplaryMatrixServiceData.setUserCode(userCode);
				exemplaryMatrixServiceData.setServiceYear(Integer.parseInt(paramYear));
				exemplaryMatrixServiceData.setServiceQuarter(i+1);
				exemplaryMatrixServiceData.setSubmitType("0");
				exemplaryMatrixServiceData.setAuditType("0");
				saveResult += exemplaryMatrixBackstageDAO.saveExemplaryMatrixServiceData(exemplaryMatrixServiceData);
			}
			logger.info("插入服务数据数量为："+saveResult);
		}
		
		List<Map<String, Object>> statementManageList = exemplaryMatrixBackstageDAO.findStatementManageList(params);
		
		if(null != statementManageList && 0!=statementManageList.size()){
			logger.info("查询到服务数据条数："+statementManageList.size());
			//处理详细数据
			//查询示范基地特有服务类型
			Map<String, String> getServiceClassParams = new HashMap<String, String>();
			getServiceClassParams.put("group", "pioneer_service_type");
			List<SysCode> sysCodes = sysCodeService.getSysCodeByParams(getServiceClassParams);
			
			//循环处理每个季度的数据
			for (int i = 0; i < statementManageList.size(); i++) {
				//获取查询到的年份和季度
				Integer year = (Integer)statementManageList.get(i).get("serviceYear");
				Integer quarter = (Integer)statementManageList.get(i).get("serviceQuarter");
				
				//20180403新增查询报表填写状态
				Map<String, String> getStatementStatusParams = new HashMap<String, String>();
				getStatementStatusParams.put("userCode", userCode);
				getStatementStatusParams.put("serviceYear", year.toString());
				getStatementStatusParams.put("serviceQuarter", quarter.toString());
				List<ExemplaryMatrixStatementStatus> exemplaryMatrixStatementStatus = exemplaryMatrixBackstageDAO.getStatusListByParams(getStatementStatusParams);
				statementManageList.get(i).put("exemplaryMatrixStatementStatus", exemplaryMatrixStatementStatus);
				
				
				//具体数据集合
				List<ExemplaryMatrixStatementManageView> exemplaryMatrixStatementManageViews = new ArrayList<ExemplaryMatrixStatementManageView>();
				//循环处理每个类别的服务
				for(SysCode sysCode : sysCodes){
					//新建每个服务类型的返回值实体类
					ExemplaryMatrixStatementManageView exemplaryMatrixStatementManageView = new ExemplaryMatrixStatementManageView();
					
					logger.info("当前处理的服务类别为："+sysCode.getCode());
					//分别处理每个分类
					if ("103000001".equals(sysCode.getCode())) {
						//信息服务类别，对应八大服务的信息服务
						//查询线上数据
						Map<String, Integer> onlineData = this.getOnlineData(userCode, "100000", year, quarter,sysCode.getCode());
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,"");
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount(onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
					}else if ("103000002".equals(sysCode.getCode())) {
						//创业服务，对应八大服务的创业服务
						//查询线上数据
						Map<String, Integer> onlineData = this.getOnlineData(userCode, "103000", year, quarter,sysCode.getCode());
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,"");
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount(onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
					}else if ("103000003".equals(sysCode.getCode())) {
						//创新支持，对应八大服务的技术创新和质量服务
						//查询线上数据
						Map<String, Integer> onlineData = this.getOnlineData(userCode, "102000", year, quarter,sysCode.getCode());
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,"");
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount(onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
					}else if ("103000004".equals(sysCode.getCode())) {
						//人员培训，对应八大服务的人才与培训服务
						//查询线上数据
						Map<String, Integer> onlineData = this.getOnlineData(userCode, "101000", year, quarter,sysCode.getCode());
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,"");
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount(onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
					}else if ("103000005".equals(sysCode.getCode())) {
						//市场营销，对应八大服务的市场开拓服务
						//查询线上数据
						Map<String, Integer> onlineData = this.getOnlineData(userCode, "105000", year, quarter,sysCode.getCode());
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,"");
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount(onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
					}else if ("103000006".equals(sysCode.getCode())) {
						//投融资服务，对应八大服务的投融资服务
						//查询线上数据
						Map<String, Integer> onlineData = this.getOnlineData(userCode, "104000", year, quarter,sysCode.getCode());
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,"");
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount(onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
					}else if ("103000007".equals(sysCode.getCode())) {
						//管理咨询，对应八大服务的管理咨询服务
						//查询线上数据
						Map<String, Integer> onlineData = this.getOnlineData(userCode, "106000", year, quarter,sysCode.getCode());
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,"");
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount(onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
					}else if ("103000008".equals(sysCode.getCode())) {
						//专业服务，对应八大服务的法律服务
						//查询线上数据
						Map<String, Integer> onlineData = this.getOnlineData(userCode, "107000", year, quarter,sysCode.getCode());
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,"");
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount(onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
					}
					
					exemplaryMatrixStatementManageViews.add(exemplaryMatrixStatementManageView);
				}
				
				//将处理之后的报表管理列表塞入返回值
				statementManageList.get(i).put("exemplaryMatrixStatementManageViews", exemplaryMatrixStatementManageViews);
			}
		}
		
		return statementManageList;
	}
	
	/**
	 * 服务类型转换，常用类型→基地特有类型
	 * @return
	 */
	private String serviceSortTransform(String serviceSort){
		if ("100000".equals(serviceSort)) {
			return "103000001";
		}else if ("103000".equals(serviceSort)) {
			return "103000002";
		}else if ("102000".equals(serviceSort)) {
			return "103000003";
		}else if ("101000".equals(serviceSort)) {
			return "103000004";
		}else if ("105000".equals(serviceSort)) {
			return "103000005";
		}else if ("104000".equals(serviceSort)) {
			return "103000006";
		}else if ("106000".equals(serviceSort)) {
			return "103000007";
		}else if ("107000".equals(serviceSort)) {
			return "103000008";
		}else {
			return "";
		}
	}
	
	/**
	 * 根据userCode，year，quarter统计这个季度的服务数据方法
	 * @param params
	 * @return
	 */
	public Map<String, Object> findServieDataByParam(Map<String, String> params){
		Map<String, Object> result = new HashMap<String, Object>();
		
		String userCode = params.get("userCode");
		//查看列表的时候需要审核通过线下服务内容
		String auditType = params.get("auditType");
		
		String serviceYear = params.get("serviceYear");
		String serviceQuarter = params.get("serviceQuarter");
		
		List<Map<String, Object>> statementManageList = null;
		
		if("4".equals(serviceQuarter)){
			statementManageList = exemplaryMatrixBackstageDAO.findStatementManageList(params);
			if (statementManageList == null || statementManageList.size() == 0) {
				params.put("serviceQuarter", "3");
				statementManageList = exemplaryMatrixBackstageDAO.findStatementManageList(params);
			}
			if (statementManageList == null || statementManageList.size() == 0) {
				params.put("serviceQuarter", "2");
				statementManageList = exemplaryMatrixBackstageDAO.findStatementManageList(params);
			}
			if (statementManageList == null || statementManageList.size() == 0) {
				params.put("serviceQuarter", "1");
				statementManageList = exemplaryMatrixBackstageDAO.findStatementManageList(params);
			}
		}else{
			statementManageList = exemplaryMatrixBackstageDAO.findStatementManageList(params);
		}
		
		if (null == statementManageList || 0 == statementManageList.size()) {
			Map<String, Object> statement = new HashMap<String, Object>();
			statement.put("serviceYear", Integer.parseInt(serviceYear));
			statement.put("serviceQuarter", Integer.parseInt(serviceYear));
			statementManageList.add(statement);
		}
		
		if(null != statementManageList && 0!=statementManageList.size()){
			//处理详细数据
			//查询示范基地特有服务类型
			Map<String, String> getServiceClassParams = new HashMap<String, String>();
			getServiceClassParams.put("group", "pioneer_service_type");
			List<SysCode> sysCodes = sysCodeService.getSysCodeByParams(getServiceClassParams);
			
			//循环处理每个季度的数据
			for (int i = 0; i < statementManageList.size(); i++) {
				
				//获取查询到的年份和季度
				Integer year = (Integer)statementManageList.get(i).get("serviceYear");
				Integer quarter = (Integer)statementManageList.get(i).get("serviceQuarter");
				
				//具体数据集合
				List<ExemplaryMatrixStatementManageView> exemplaryMatrixStatementManageViews = new ArrayList<ExemplaryMatrixStatementManageView>();
				//循环处理每个类别的服务
				for(SysCode sysCode : sysCodes){
					//新建每个服务类型的返回值实体类
					ExemplaryMatrixStatementManageView exemplaryMatrixStatementManageView = new ExemplaryMatrixStatementManageView();
					
					logger.info("当前处理的服务类别为："+sysCode.getCode());
					//分别处理每个分类
					if ("103000001".equals(sysCode.getCode())) {
						//信息服务类别，对应八大服务的信息服务
						//查询线上数据
						Map<String, Object> onlineData = this.getOnlineDataForAuditType(userCode, sysCode.getCode(), year, quarter,auditType);
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,auditType);
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount((Integer)onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setEnterCount((Integer)offlineData.get("enterpriseQuantity")+(Integer)onlineData.get("onlineEnterCount"));
						exemplaryMatrixStatementManageView.setPersonCount((Integer)onlineData.get("onlinePersonCount")+(Integer)offlineData.get("personQuantity"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
						exemplaryMatrixStatementManageView.setTotalExpend((Double)offlineData.get("totalExpend")+(Double)onlineData.get("totalExpend"));
						//增加查发布消息的查询，用于导出
						Map<String, String> getPublishInfoParams = new HashMap<String, String>();
						getPublishInfoParams.put("userCode", userCode);
						String fromTime = year+"-01-01 00:00:00";
						String toTime = "";
						if (quarter>=1 && quarter<=3) {
							toTime = year+"-03-31 23:59:59";
						}else if (quarter>=4 && quarter<=6) {
							toTime = year+"-06-30 23:59:59";
						}else if (quarter>=7 && quarter<=10) {
							toTime = year+"-10-31 23:59:59";
						}else if (quarter>=10 && quarter<=12) {
							toTime = year+"-12-31 23:59:59";
						}
						getPublishInfoParams.put("fromTime", fromTime);
						getPublishInfoParams.put("toTime",toTime);
						
						Map<String, Object> publicInfoCountMap = exemplaryMatrixBackstageDAO.findPublishInfo(getPublishInfoParams);
						Integer publishInfoCount = Integer.parseInt(((BigDecimal)publicInfoCountMap.get("count")).toString());
						logger.info("查询到的发布信息数量为："+publishInfoCount);
						exemplaryMatrixStatementManageView.setPublishInfoCount(publishInfoCount);
					}else if ("103000002".equals(sysCode.getCode())) {
						//创业服务，对应八大服务的创业服务
						//查询线上数据
						Map<String, Object> onlineData = this.getOnlineDataForAuditType(userCode, sysCode.getCode(), year, quarter,auditType);
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,auditType);
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount((Integer)onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setEnterCount((Integer)offlineData.get("enterpriseQuantity")+(Integer)onlineData.get("onlineEnterCount"));
						exemplaryMatrixStatementManageView.setPersonCount((Integer)onlineData.get("onlinePersonCount")+(Integer)offlineData.get("personQuantity"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
						exemplaryMatrixStatementManageView.setTotalExpend((Double)offlineData.get("totalExpend")+(Double)onlineData.get("totalExpend"));
					}else if ("103000003".equals(sysCode.getCode())) {
						//创新支持，对应八大服务的技术创新和质量服务
						//查询线上数据
						Map<String, Object> onlineData = this.getOnlineDataForAuditType(userCode, sysCode.getCode(), year, quarter,auditType);
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,auditType);
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount((Integer)onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setEnterCount((Integer)offlineData.get("enterpriseQuantity")+(Integer)onlineData.get("onlineEnterCount"));
						exemplaryMatrixStatementManageView.setPersonCount((Integer)onlineData.get("onlinePersonCount")+(Integer)offlineData.get("personQuantity"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
						exemplaryMatrixStatementManageView.setTotalExpend((Double)offlineData.get("totalExpend")+(Double)onlineData.get("totalExpend"));
					}else if ("103000004".equals(sysCode.getCode())) {
						//人员培训，对应八大服务的人才与培训服务
						//查询线上数据
						Map<String, Object> onlineData = this.getOnlineDataForAuditType(userCode, sysCode.getCode(), year, quarter,auditType);
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,auditType);
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount((Integer)onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setEnterCount((Integer)offlineData.get("enterpriseQuantity")+(Integer)onlineData.get("onlineEnterCount"));
						exemplaryMatrixStatementManageView.setPersonCount((Integer)onlineData.get("onlinePersonCount")+(Integer)offlineData.get("personQuantity"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
						exemplaryMatrixStatementManageView.setTotalExpend((Double)offlineData.get("totalExpend")+(Double)onlineData.get("totalExpend"));
					}else if ("103000005".equals(sysCode.getCode())) {
						//市场营销，对应八大服务的市场开拓服务
						//查询线上数据
						Map<String, Object> onlineData = this.getOnlineDataForAuditType(userCode, sysCode.getCode(), year, quarter,auditType);
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,auditType);
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount((Integer)onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setEnterCount((Integer)offlineData.get("enterpriseQuantity")+(Integer)onlineData.get("onlineEnterCount"));
						exemplaryMatrixStatementManageView.setPersonCount((Integer)onlineData.get("onlinePersonCount")+(Integer)offlineData.get("personQuantity"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
						exemplaryMatrixStatementManageView.setTotalExpend((Double)offlineData.get("totalExpend")+(Double)onlineData.get("totalExpend"));
					}else if ("103000006".equals(sysCode.getCode())) {
						//投融资服务，对应八大服务的投融资服务
						//查询线上数据
						Map<String, Object> onlineData = this.getOnlineDataForAuditType(userCode, sysCode.getCode(), year, quarter,auditType);
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,auditType);
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount((Integer)onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setEnterCount((Integer)offlineData.get("enterpriseQuantity")+(Integer)onlineData.get("onlineEnterCount"));
						exemplaryMatrixStatementManageView.setPersonCount((Integer)onlineData.get("onlinePersonCount")+(Integer)offlineData.get("personQuantity"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
						exemplaryMatrixStatementManageView.setTotalExpend((Double)offlineData.get("totalExpend")+(Double)onlineData.get("totalExpend"));
						
						//查询投融资金额
						Map<String, String> getFinancingAmountByParams = new HashMap<String, String>();
						getFinancingAmountByParams.put("userCode", userCode);
						getFinancingAmountByParams.put("serviceYear", year.toString());
						getFinancingAmountByParams.put("serviceQuarter", quarter.toString());
						getFinancingAmountByParams.put("auditType", auditType);
						getFinancingAmountByParams.put("serviceType", sysCode.getCode());
						ExemplaryMatrixServiceSituation exemplaryMatrixServiceSituation = exemplaryMatrixBackstageDAO.findFinancingAmountByParams(getFinancingAmountByParams);
						logger.info("结果为："+exemplaryMatrixServiceSituation);
						if(exemplaryMatrixServiceSituation != null){
							logger.info("投融资金额为："+exemplaryMatrixServiceSituation.getFinancingAmount());
							exemplaryMatrixStatementManageView.setFinancingAmount(exemplaryMatrixServiceSituation.getFinancingAmount());
						}else{
							exemplaryMatrixStatementManageView.setFinancingAmount(0.0);
						}
					
					}else if ("103000007".equals(sysCode.getCode())) {
						//管理咨询，对应八大服务的管理咨询服务
						//查询线上数据
						Map<String, Object> onlineData = this.getOnlineDataForAuditType(userCode, sysCode.getCode(), year, quarter,auditType);
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,auditType);
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount((Integer)onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setEnterCount((Integer)offlineData.get("enterpriseQuantity")+(Integer)onlineData.get("onlineEnterCount"));
						exemplaryMatrixStatementManageView.setPersonCount((Integer)onlineData.get("onlinePersonCount")+(Integer)offlineData.get("personQuantity"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
						exemplaryMatrixStatementManageView.setTotalExpend((Double)offlineData.get("totalExpend")+(Double)onlineData.get("totalExpend"));
					}else if ("103000008".equals(sysCode.getCode())) {
						//专业服务，对应八大服务的法律服务
						//查询线上数据
						Map<String, Object> onlineData = this.getOnlineDataForAuditType(userCode, sysCode.getCode(), year, quarter,auditType);
						//查询线下数据
						Map<String, Object> offlineData = this.getOfflineData(userCode, sysCode.getCode(), year, quarter,auditType);
						
						//设置数据
						exemplaryMatrixStatementManageView.setServiceYear(year);
						exemplaryMatrixStatementManageView.setServiceQuarter(quarter);
						exemplaryMatrixStatementManageView.setServiceSort(sysCode.getCode());
						exemplaryMatrixStatementManageView.setOnlineCount((Integer)onlineData.get("onlineCount"));
						exemplaryMatrixStatementManageView.setOfflineCount((Integer)offlineData.get("offlineCount"));
						exemplaryMatrixStatementManageView.setEnterCount((Integer)offlineData.get("enterpriseQuantity")+(Integer)onlineData.get("onlineEnterCount"));
						exemplaryMatrixStatementManageView.setPersonCount((Integer)onlineData.get("onlinePersonCount")+(Integer)offlineData.get("personQuantity"));
						exemplaryMatrixStatementManageView.setActivityCount(exemplaryMatrixStatementManageView.getOnlineCount()+exemplaryMatrixStatementManageView.getOfflineCount());
						exemplaryMatrixStatementManageView.setTotalExpend((Double)offlineData.get("totalExpend")+(Double)onlineData.get("totalExpend"));
					}
					
					exemplaryMatrixStatementManageViews.add(exemplaryMatrixStatementManageView);
				}
				
				//将处理之后的报表管理列表塞入返回值
				statementManageList.get(i).put("exemplaryMatrixStatementManageViews", exemplaryMatrixStatementManageViews);
			}
		}
		result.put("serviceData", statementManageList.get(0));
		return result;
	}
	
	/**
	 * 获取线上活动数据方法
	 * TODO
	 * @return
	 */
	public Map<String, Integer> getOnlineData(String userCode , String serviceSort , Integer year , Integer quarter,String serviceForMatrix){
		logger.info("进入获取线上活动数据方法，传入参数为："+serviceSort+","+year+","+quarter);
		//设置返回值
		Map<String, Integer> result = new HashMap<String, Integer>();
		
		//处理时间
		String startTime = year + "-01-01 00:00:00";
		String endTime = "";
		if (1 == quarter) {
			//一季度为1-3月
			endTime = year + "-03-31 00:00:00";
		}else if (2 == quarter) {
			//二季度为1-6月
			endTime = year + "-06-30 00:00:00";
		}else if (3 == quarter) {
			//三季度为1-9月
			endTime = year + "-09-30 00:00:00";
		}else if (4 == quarter) {
			//四季度为1-12月
			endTime = year + "-12-31 00:00:00";
		}
		
		Integer onlineCount = 0;
		Integer onlinePersonCount = 0;
		Integer onlineEnterCount = 0;
		
		
		//查询是否已经有了补录的机会
		Map<String, String> getExemplaryMatrixOnlineDataByParam =  new HashMap<String, String>();
		getExemplaryMatrixOnlineDataByParam.put("userCode", userCode);
		getExemplaryMatrixOnlineDataByParam.put("serviceYear", year.toString());
		getExemplaryMatrixOnlineDataByParam.put("serviceQuarter", quarter.toString());
		getExemplaryMatrixOnlineDataByParam.put("serviceType", serviceForMatrix);
		getExemplaryMatrixOnlineDataByParam.put("lineType", "online");
		List<ExemplaryMatrixOnlineData> exemplaryMatrixOnlineDatas = exemplaryMatrixBackstageDAO.findExemplaryMatrixOnlineDataByParam(getExemplaryMatrixOnlineDataByParam);
		logger.info("补录机会的数字为："+exemplaryMatrixOnlineDatas.size());
		
		//设置参数，查询在线活动数据
		Map<String, String> getActivityIdListParams = new HashMap<String, String>();
		getActivityIdListParams.put("userCode", userCode);
		getActivityIdListParams.put("serviceSort", serviceSort);
		getActivityIdListParams.put("startTime", startTime);
		getActivityIdListParams.put("endTime", endTime);
		//查询这期间完成活动id集合
		List<Map<String, Object>> activityIdList = exemplaryMatrixBackstageDAO.findActivityIdList(getActivityIdListParams);
		logger.info("这期间完成的活动总数为："+activityIdList.size());
		
		//查询在线服务数据
		Map<String, String> getServiceListParams = new HashMap<String, String>();
		getServiceListParams.put("userCode", userCode);
		getServiceListParams.put("serviceSort", serviceSort);
		getServiceListParams.put("startTime", startTime);
		getServiceListParams.put("endTime", endTime);
		List<Map<String, Object>> serviceList = exemplaryMatrixBackstageDAO.findServiceList(getServiceListParams);
		logger.info("这期间完成的服务总数为："+serviceList.size());
		
		//机会小于线上数字
		if(exemplaryMatrixOnlineDatas.size()!=0 && exemplaryMatrixOnlineDatas.size() < (activityIdList.size()+serviceList.size())){
			Map<String, String> getOnlineDataParams = new HashMap<String, String>();
			getOnlineDataParams.put("userCode", userCode);
			getOnlineDataParams.put("year", year.toString());
			getOnlineDataParams.put("quarter", quarter.toString());
			getOnlineDataParams.put("serviceSort", serviceForMatrix);
			
			Map<String, Object> activityCountMap = exemplaryMatrixBackstageDAO.findOnlineActivityCount(getOnlineDataParams);
			onlineCount = Integer.parseInt(((BigDecimal)activityCountMap.get("count")).toString());
			Double totalExpend = 0.0;
			if (onlineCount != 0) {
				onlinePersonCount = Integer.parseInt(((BigDecimal)activityCountMap.get("personQuantity")).toString());
				onlineEnterCount = Integer.parseInt(((BigDecimal)activityCountMap.get("enterpriseQuantity")).toString());
				totalExpend = (Double)activityCountMap.get("totalExpend");
			}
			
			//查询每个活动的服务人数，并计算总和
			if (0 != activityIdList.size() && null != activityIdList) {
				for (int i = 0; i < activityIdList.size(); i++) {
					//设置参数
					Map<String, String> getPersonCountParams = new HashMap<String, String>();
					String activityId = activityIdList.get(i).get("id").toString();
					getPersonCountParams.put("activityId", activityId);
					//查询人数
					Map<String, Object> personCountMap = exemplaryMatrixBackstageDAO.findPersonCountByActivityId(getPersonCountParams);
					Integer personCountResult = Integer.parseInt(((BigDecimal)personCountMap.get("count")).toString());
					logger.info("当前计算的活动id为："+activityId+",服务人数为："+personCountResult);
					
					ExemplaryMatrixOnlineData exemplaryMatrixOnlineData = new ExemplaryMatrixOnlineData();
					exemplaryMatrixOnlineData.setServiceId((Integer)activityIdList.get(i).get("id"));
					exemplaryMatrixOnlineData.setServiceType("activity");
					exemplaryMatrixOnlineData.setUserCode(userCode);
					exemplaryMatrixOnlineData.setServiceYear(year);
					exemplaryMatrixOnlineData.setServiceQuarter(quarter);
					exemplaryMatrixOnlineData.setServiceName((String)activityIdList.get(i).get("activityTitle"));
					String serviceTime = activityIdList.get(i).get("activityEndDate").toString();
					serviceTime = serviceTime.substring(0,10);
					exemplaryMatrixOnlineData.setServiceTime(serviceTime);
					exemplaryMatrixOnlineData.setServiceAddress((String)activityIdList.get(i).get("addressDetail"));
					exemplaryMatrixOnlineData.setServiceSort(this.serviceSortTransform((String)activityIdList.get(i).get("serviceType")));
					exemplaryMatrixOnlineData.setHaveType("0");
					exemplaryMatrixOnlineData.setCreateStamp(new Date());
					exemplaryMatrixOnlineData.setUpdateStamp(new Date());
					exemplaryMatrixOnlineData.setLineType("online");
					ExemplaryMatrixOnlineData exemplaryMatrixOnlineData2 = exemplaryMatrixBackstageDAO.findOneExemplaryMatrixOnlineData(exemplaryMatrixOnlineData);
					if (exemplaryMatrixOnlineData2 == null) {
						exemplaryMatrixBackstageDAO.insertExemplaryMatrixOnlineData(exemplaryMatrixOnlineData);
					}
				}
			}
			if(0!=serviceList.size() && null!=serviceList){
				for (int i = 0; i < serviceList.size(); i++) {
					ExemplaryMatrixOnlineData exemplaryMatrixOnlineData = new ExemplaryMatrixOnlineData();
					exemplaryMatrixOnlineData.setServiceId((Integer)serviceList.get(i).get("id"));
					exemplaryMatrixOnlineData.setServiceType("service");
					exemplaryMatrixOnlineData.setUserCode(userCode);
					exemplaryMatrixOnlineData.setServiceYear(year);
					exemplaryMatrixOnlineData.setServiceQuarter(quarter);
					exemplaryMatrixOnlineData.setServiceName((String)serviceList.get(i).get("serviceTitle"));
					String serviceTime = serviceList.get(i).get("dealintTimestamp").toString();
					serviceTime = serviceTime.substring(0,10);
					exemplaryMatrixOnlineData.setServiceTime(serviceTime);
					exemplaryMatrixOnlineData.setServiceSort(this.serviceSortTransform((String)serviceList.get(i).get("serviceType")));
					exemplaryMatrixOnlineData.setHaveType("0");
					exemplaryMatrixOnlineData.setCreateStamp(new Date());
					exemplaryMatrixOnlineData.setUpdateStamp(new Date());
					exemplaryMatrixOnlineData.setLineType("online");
					ExemplaryMatrixOnlineData exemplaryMatrixOnlineData2 = exemplaryMatrixBackstageDAO.findOneExemplaryMatrixOnlineData(exemplaryMatrixOnlineData);
					if (exemplaryMatrixOnlineData2 == null) {
						exemplaryMatrixBackstageDAO.insertExemplaryMatrixOnlineData(exemplaryMatrixOnlineData);
					}
				}
			}
		}else if(exemplaryMatrixOnlineDatas.size() > (activityIdList.size()+serviceList.size()) || exemplaryMatrixOnlineDatas.size() == (activityIdList.size()+serviceList.size()) ){
			Map<String, String> getOnlineDataParams = new HashMap<String, String>();
			getOnlineDataParams.put("userCode", userCode);
			getOnlineDataParams.put("year", year.toString());
			getOnlineDataParams.put("quarter", quarter.toString());
			getOnlineDataParams.put("serviceSort", serviceForMatrix);
			
			Map<String, Object> activityCountMap = exemplaryMatrixBackstageDAO.findOnlineActivityCount(getOnlineDataParams);
			onlineCount = Integer.parseInt(((BigDecimal)activityCountMap.get("count")).toString());
			Double totalExpend = 0.0;
			if (onlineCount != 0) {
				onlinePersonCount = Integer.parseInt(((BigDecimal)activityCountMap.get("personQuantity")).toString());
				onlineEnterCount = Integer.parseInt(((BigDecimal)activityCountMap.get("enterpriseQuantity")).toString());
				totalExpend = (Double)activityCountMap.get("totalExpend");
			}
		}else if(exemplaryMatrixOnlineDatas.size() == 0){
			onlineCount += activityIdList.size();
			onlineCount += serviceList.size();
			//查询每个活动的服务人数，并计算总和
			if (0 != activityIdList.size() && null != activityIdList) {
				for (int i = 0; i < activityIdList.size(); i++) {
					//设置参数
					Map<String, String> getPersonCountParams = new HashMap<String, String>();
					String activityId = activityIdList.get(i).get("id").toString();
					getPersonCountParams.put("activityId", activityId);
					//查询人数
					Map<String, Object> personCountMap = exemplaryMatrixBackstageDAO.findPersonCountByActivityId(getPersonCountParams);
					Integer personCountResult = Integer.parseInt(((BigDecimal)personCountMap.get("count")).toString());
					logger.info("当前计算的活动id为："+activityId+",服务人数为："+personCountResult);
					onlinePersonCount += personCountResult;
					
					ExemplaryMatrixOnlineData exemplaryMatrixOnlineData = new ExemplaryMatrixOnlineData();
					exemplaryMatrixOnlineData.setServiceId((Integer)activityIdList.get(i).get("id"));
					exemplaryMatrixOnlineData.setServiceType("activity");
					exemplaryMatrixOnlineData.setUserCode(userCode);
					exemplaryMatrixOnlineData.setServiceYear(year);
					exemplaryMatrixOnlineData.setServiceQuarter(quarter);
					exemplaryMatrixOnlineData.setServiceName((String)activityIdList.get(i).get("activityTitle"));
					String serviceTime = activityIdList.get(i).get("activityEndDate").toString();
					serviceTime = serviceTime.substring(0,10);
					exemplaryMatrixOnlineData.setServiceTime(serviceTime);
					exemplaryMatrixOnlineData.setServiceAddress((String)activityIdList.get(i).get("addressDetail"));
					exemplaryMatrixOnlineData.setServiceSort(this.serviceSortTransform((String)activityIdList.get(i).get("serviceType")));
					exemplaryMatrixOnlineData.setHaveType("0");
					exemplaryMatrixOnlineData.setCreateStamp(new Date());
					exemplaryMatrixOnlineData.setUpdateStamp(new Date());
					exemplaryMatrixOnlineData.setLineType("online");
					ExemplaryMatrixOnlineData exemplaryMatrixOnlineData2 = exemplaryMatrixBackstageDAO.findOneExemplaryMatrixOnlineData(exemplaryMatrixOnlineData);
					if (exemplaryMatrixOnlineData2 == null) {
						exemplaryMatrixBackstageDAO.insertExemplaryMatrixOnlineData(exemplaryMatrixOnlineData);
					}
				}
			}
			if(0!=serviceList.size() && null!=serviceList){
				for (int i = 0; i < serviceList.size(); i++) {
					ExemplaryMatrixOnlineData exemplaryMatrixOnlineData = new ExemplaryMatrixOnlineData();
					exemplaryMatrixOnlineData.setServiceId((Integer)serviceList.get(i).get("id"));
					exemplaryMatrixOnlineData.setServiceType("service");
					exemplaryMatrixOnlineData.setUserCode(userCode);
					exemplaryMatrixOnlineData.setServiceYear(year);
					exemplaryMatrixOnlineData.setServiceQuarter(quarter);
					exemplaryMatrixOnlineData.setServiceName((String)serviceList.get(i).get("serviceTitle"));
					String serviceTime = serviceList.get(i).get("dealintTimestamp").toString();
					serviceTime = serviceTime.substring(0,10);
					exemplaryMatrixOnlineData.setServiceTime(serviceTime);
					exemplaryMatrixOnlineData.setServiceSort(this.serviceSortTransform((String)serviceList.get(i).get("serviceType")));
					exemplaryMatrixOnlineData.setHaveType("0");
					exemplaryMatrixOnlineData.setCreateStamp(new Date());
					exemplaryMatrixOnlineData.setUpdateStamp(new Date());
					exemplaryMatrixOnlineData.setLineType("online");
					ExemplaryMatrixOnlineData exemplaryMatrixOnlineData2 = exemplaryMatrixBackstageDAO.findOneExemplaryMatrixOnlineData(exemplaryMatrixOnlineData);
					if (exemplaryMatrixOnlineData2 == null) {
						exemplaryMatrixBackstageDAO.insertExemplaryMatrixOnlineData(exemplaryMatrixOnlineData);
					}
				}
			}
		}
		//设置线上活动数量
		result.put("onlineCount", onlineCount);
		//设置线上活动服务人数总和
		result.put("onlinePersonCount", onlinePersonCount);
		result.put("onlineEnterCount", onlineEnterCount);
		return result;
	}
	
	/**
	 * 获取线上活动数据方法(有审核条件的)
	 * @return
	 */
	public Map<String, Object> getOnlineDataForAuditType(String userCode , String serviceSort , Integer year , Integer quarter,String auditType){
		logger.info("进入获取线上活动数据方法(有审核条件的)，传入参数为："+serviceSort+","+year+","+quarter);
		//设置返回值
		Map<String, Object> result = new HashMap<String, Object>();
		
		
		Integer onlinePersonCount = 0;
		Integer onlineEnterCount = 0;
		
		//增加判断线上是否已经有补录数据，有的话直接取补录数据，否则取线上已有的数据
		Map<String, String> getOnlineDataParams = new HashMap<String, String>();
		getOnlineDataParams.put("userCode", userCode);
		getOnlineDataParams.put("year", year.toString());
		getOnlineDataParams.put("quarter", quarter.toString());
		getOnlineDataParams.put("serviceSort", serviceSort);
		getOnlineDataParams.put("auditType", auditType);
		
		Map<String, Object> activityCountMap = exemplaryMatrixBackstageDAO.findOnlineActivityCount(getOnlineDataParams);
		Integer	onlineCount = Integer.parseInt(((BigDecimal)activityCountMap.get("count")).toString());
		Double totalExpend = 0.0;
		if (onlineCount != 0) {
			onlinePersonCount = Integer.parseInt(((BigDecimal)activityCountMap.get("personQuantity")).toString());
			onlineEnterCount = Integer.parseInt(((BigDecimal)activityCountMap.get("enterpriseQuantity")).toString());
			totalExpend = (Double)activityCountMap.get("totalExpend");
		}
		
		
		//设置线上活动数量
		result.put("onlineCount", onlineCount);
		//设置线上活动服务人数总和
		result.put("onlinePersonCount", onlinePersonCount);
		result.put("onlineEnterCount", onlineEnterCount);
		result.put("totalExpend", totalExpend);
		return result;
	}
	
	
	
	
	/**
	 * 获取线下数据方法
	 * @param userCode
	 * @param serviceSort
	 * @param year
	 * @param quarter
	 * @return
	 */
	public Map<String, Object> getOfflineData(String userCode , String serviceSort , Integer year , Integer quarter, String auditType){
		logger.info("进入获取线下活动数据方法，传入参数为："+serviceSort+","+year+","+quarter);
		//设置返回值
		Map<String, Object> result = new HashMap<String, Object>();
		
		//查询线下活动数据
		Map<String, String> getActivityCountParams = new HashMap<String, String>();
		getActivityCountParams.put("userCode", userCode);
		getActivityCountParams.put("serviceSort", serviceSort);
		getActivityCountParams.put("year", year.toString());
		getActivityCountParams.put("quarter", quarter.toString());
		getActivityCountParams.put("auditType", auditType);
		Map<String, Object> activityCountMap = exemplaryMatrixBackstageDAO.findOfflineActivityCount(getActivityCountParams);
		Integer	activityCount = Integer.parseInt(((BigDecimal)activityCountMap.get("count")).toString());
		Integer personQuantity = 0;
		Integer enterpriseQuantity = 0;
		Double totalExpend = 0.0;
		if (activityCount != 0) {
			personQuantity = Integer.parseInt(((BigDecimal)activityCountMap.get("personQuantity")).toString());
			enterpriseQuantity = Integer.parseInt(((BigDecimal)activityCountMap.get("enterpriseQuantity")).toString());
			totalExpend = (Double)activityCountMap.get("totalExpend");
		}
		logger.info("查询得到的线下活动总数为："+activityCount+"，服务人员总数为："+personQuantity+"，服务企业总数为："+enterpriseQuantity+"，支出总数："+totalExpend);
		result.put("offlineCount", activityCount);
		result.put("personQuantity", personQuantity);
		result.put("enterpriseQuantity", enterpriseQuantity);
		result.put("totalExpend", totalExpend);
		
		return result;
	}

	/**
	 * 获取区级报表审核列表
	 * @param params
	 * @return
	 */
	public Map<String, Object> findStatementAuditList(Map<String, String> params){
		//新建返回参数
		Map<String, Object> result = new HashMap<String, Object>();
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixBackstageDAO.findStatementAuditListCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<Map<String, Object>> statementAuditList = exemplaryMatrixBackstageDAO.findStatementAuditList(params);
		
		//处理结果
		if (0!=statementAuditList.size() && null!=statementAuditList) {
			logger.info("查询结果为："+statementAuditList.size());
			for (int i = 0; i < statementAuditList.size(); i++) {
				//查询合作服务机构信息
				Map<String, String> getCooperationFacilitatingAgencyParams = new HashMap<String, String>();
				getCooperationFacilitatingAgencyParams.put("userCode", (String)statementAuditList.get(i).get("userCode"));
				getCooperationFacilitatingAgencyParams.put("exemplaryMatrixApplicationId", ((Integer)statementAuditList.get(i).get("applicationId")).toString());
				
				List<CooperationFacilitatingAgency> cooperationFacilitatingAgencies = exemplaryMatrixApplicationService.getCooperationFacilitatingAgencyByParams(getCooperationFacilitatingAgencyParams);
				
				String coopService = "";
				if (0!=cooperationFacilitatingAgencies.size() && null!=cooperationFacilitatingAgencies) {
					for (int j = 0; j < cooperationFacilitatingAgencies.size(); j++) {
						coopService += cooperationFacilitatingAgencies.get(j).getServiceItems()+",";
					}
				}
				if(coopService!=null && !"".equals(coopService)){
					coopService = coopService.substring(0, coopService.length()-1);
				}
				statementAuditList.get(i).put("coopCount", cooperationFacilitatingAgencies.size());
				statementAuditList.get(i).put("coopService", coopService);
				
				//获取服务功能情况
				Map<String, String> getApplicationParams = new HashMap<String, String>();
				getApplicationParams.put("applicationId", ((Integer)statementAuditList.get(i).get("applicationId")).toString());
				ExemplaryMatrixApplication exemplaryMatrixApplication = exemplaryMatrixBackstageDAO.findApplicationById(getApplicationParams);
				
				String service = "";
				if (exemplaryMatrixApplication.getInformationService()!=null && !"".equals(exemplaryMatrixApplication.getInformationService().trim())) {
					service += "信息服务,";
				}
				if (exemplaryMatrixApplication.getTutorship()!=null && !"".equals(exemplaryMatrixApplication.getTutorship().trim())) {
					service += "创业辅导,";
				}
				if (exemplaryMatrixApplication.getInnovationSupport()!=null && !"".equals(exemplaryMatrixApplication.getInnovationSupport().trim())) {
					service += "创新支持,";
				}
				if (exemplaryMatrixApplication.getPersonnelTraining()!=null && !"".equals(exemplaryMatrixApplication.getPersonnelTraining().trim())) {
					service += "人员培训,";
				}
				if (exemplaryMatrixApplication.getMarketing()!=null && !"".equals(exemplaryMatrixApplication.getMarketing().trim())) {
					service += "市场营销,";
				}
				if (exemplaryMatrixApplication.getFinancingService()!=null && !"".equals(exemplaryMatrixApplication.getFinancingService().trim())) {
					service += "融资服务,";
				}
				if (exemplaryMatrixApplication.getManagementConsultancy()!=null && !"".equals(exemplaryMatrixApplication.getManagementConsultancy().trim())) {
					service += "管理咨询服务,";
				}
				if (exemplaryMatrixApplication.getOtherService()!=null && !"".equals(exemplaryMatrixApplication.getOtherService().trim())) {
					service += "其他服务,";
				}
				if(service!=null && !"".equals(service)){
					service = service.substring(0, service.length()-1);
				}
				statementAuditList.get(i).put("service", service);
				
				//获取服务活动各种数量
				String userCode = (String)statementAuditList.get(i).get("userCode");
				Integer year = (Integer)statementAuditList.get(i).get("year");
				Integer quarter = (Integer)statementAuditList.get(i).get("quarter");
				
				Map<String, Object> onlineData = null;
				Map<String, Object> offlineData = null;
				if ("1".equals(params.get("auditType"))) {
					onlineData = this.getOnlineDataForAuditType(userCode, "", year, quarter,"1");
					offlineData = this.getOfflineData(userCode, "", year, quarter,"1");
				}else {
					onlineData = this.getOnlineDataForAuditType(userCode, "", year, quarter,"0");
					offlineData = this.getOfflineData(userCode, "", year, quarter,"0");
				}
				
				
				Integer serviceCount = (Integer)onlineData.get("onlineCount")+(Integer)offlineData.get("offlineCount");
				Integer enterCount = (Integer)offlineData.get("enterpriseQuantity")+(Integer)onlineData.get("onlineEnterCount");
				Integer personCount = (Integer)onlineData.get("onlinePersonCount")+(Integer)offlineData.get("personQuantity");
				
				statementAuditList.get(i).put("serviceCount", serviceCount);
				statementAuditList.get(i).put("enterCount", enterCount);
				statementAuditList.get(i).put("personCount", personCount);
			}
		}
		result.put("statementAuditList", statementAuditList);
		
		//3.28新增计算合计方法
		Map<String, Object> data = this.getDataByDistrict(params);
		
		result.put("matrixCount", data.get("matrixCount"));
		result.put("floorSpaceE", data.get("floorSpaceE"));
		result.put("personnelQuantity", data.get("personnelQuantity"));
		result.put("tutorQuantity", data.get("tutorQuantity"));
		result.put("enterpriseCount", data.get("enterpriseCount"));
		result.put("smeCount", data.get("smeCount"));
		result.put("personnelQuantityE", data.get("personnelQuantityE"));
		result.put("totalAssets", data.get("totalAssets"));
		result.put("income", data.get("income"));
		result.put("coopCount", data.get("coopCount"));
		result.put("coopService", data.get("coopService"));
		result.put("serviceCount", data.get("serviceCount"));
		result.put("service", data.get("service"));
		result.put("enterCount", data.get("enterCount"));
		result.put("personCount", data.get("personCount"));
		result.put("incomeProportion", data.get("incomeProportion"));
		
		return result;
	}
	
	/**
	 * 获取每一个区的统计数据
	 * @return
	 */
	private Map<String, Object> getDataByDistrict(Map<String, String> params){
		Map<String, Object> result = new HashMap<String, Object>();
		params.put("startNum", "");
		params.put("pageSize", "");
		List<Map<String, Object>> statementAuditList1 = exemplaryMatrixBackstageDAO.findStatementAuditList(params);
		Double floorSpaceE = 0.0;
		Integer personnelQuantity = 0;
		Integer tutorQuantity = 0;
		Integer enterpriseCount = 0;
		Integer smeCount = 0;
		Integer personnelQuantityE = 0;
		Double totalAssets = 0.0;
		Double income = 0.0;
		Integer coopCount = 0 ;
		String coopService = "-";
		Integer serviceCount = 0;
		String service = "-";
		Integer enterCount = 0;
		Integer personCount = 0 ;
		Double incomeProportion = 0.0;
		
		List<ExemplaryMatrix> exemplaryMatrixs = exemplaryMatrixBackstageDAO.findExemplaryMatrixsByDistrict(params);
		
		
		//处理结果
		if (0!=statementAuditList1.size() && null!=statementAuditList1) {
			logger.info("查询结果为："+statementAuditList1.size());
			for (int j = 0; j < statementAuditList1.size(); j++) {
				floorSpaceE += (Double)statementAuditList1.get(j).get("floorSpaceE");
				personnelQuantity += (Integer)statementAuditList1.get(j).get("personnelQuantity");
				tutorQuantity += (Integer)statementAuditList1.get(j).get("tutorQuantity");
				enterpriseCount += (Integer)statementAuditList1.get(j).get("enterpriseCount");
				smeCount += (Integer)statementAuditList1.get(j).get("smeCount");
				personnelQuantityE += (Integer)statementAuditList1.get(j).get("personnelQuantityE");
				totalAssets += (Double)statementAuditList1.get(j).get("totalAssets");
				income += (Double)statementAuditList1.get(j).get("income");
				incomeProportion += (Double)statementAuditList1.get(j).get("incomeProportion");
				
				
				//查询合作服务机构信息
				Map<String, String> getCooperationFacilitatingAgencyParams = new HashMap<String, String>();
				getCooperationFacilitatingAgencyParams.put("userCode", (String)statementAuditList1.get(j).get("userCode"));
				getCooperationFacilitatingAgencyParams.put("exemplaryMatrixApplicationId", ((Integer)statementAuditList1.get(j).get("applicationId")).toString());
				
				List<CooperationFacilitatingAgency> cooperationFacilitatingAgencies = exemplaryMatrixApplicationService.getCooperationFacilitatingAgencyByParams(getCooperationFacilitatingAgencyParams);
				coopCount += cooperationFacilitatingAgencies.size();
				
				//获取服务活动各种数量
				String userCode = (String)statementAuditList1.get(j).get("userCode");
				Integer year = (Integer)statementAuditList1.get(j).get("year");
				Integer quarter = (Integer)statementAuditList1.get(j).get("quarter");
				
				Map<String, Object> onlineData = this.getOnlineDataForAuditType(userCode, "", year, quarter,"1");
				Map<String, Object> offlineData = this.getOfflineData(userCode, "", year, quarter,"1");
				
				serviceCount += (Integer)onlineData.get("onlineCount")+(Integer)offlineData.get("offlineCount");
				enterCount += (Integer)offlineData.get("enterpriseQuantity")+(Integer)onlineData.get("onlineEnterCount");;
				personCount += (Integer)onlineData.get("onlinePersonCount")+(Integer)offlineData.get("personQuantity");
			}
		}
		result.put("matrixCount", exemplaryMatrixs.size());
		result.put("floorSpaceE", floorSpaceE);
		result.put("personnelQuantity", personnelQuantity);
		result.put("tutorQuantity", tutorQuantity);
		result.put("enterpriseCount", enterpriseCount);
		result.put("smeCount", smeCount);
		result.put("personnelQuantityE", personnelQuantityE);
		result.put("totalAssets", totalAssets);
		result.put("income", income);
		result.put("coopCount", coopCount);
		result.put("coopService", coopService);
		result.put("serviceCount", serviceCount);
		result.put("service", service);
		result.put("enterCount", enterCount);
		result.put("personCount", personCount);
		result.put("incomeProportion", incomeProportion);
		
		return result;
	}
	
	
	/**
	 * 获取区级报表审核列表信息，不分页
	 * @param params
	 * @return
	 */
	public Map<String, Object> findStatementAuditListNoPage(Map<String, String> params){
		Map<String, Object> result = new HashMap<String, Object>();
		List<Map<String, Object>> statementAuditList = null;
		
		if("4".equals(params.get("quarter"))){
			statementAuditList = exemplaryMatrixBackstageDAO.findStatementAuditList(params) ;
			if (statementAuditList == null || statementAuditList.size() == 0) {
				params.put("quarter", "3");
				statementAuditList = exemplaryMatrixBackstageDAO.findStatementAuditList(params) ;
			}
			if (statementAuditList == null || statementAuditList.size() == 0) {
				params.put("quarter", "2");
				statementAuditList = exemplaryMatrixBackstageDAO.findStatementAuditList(params) ;
			}
			if (statementAuditList == null || statementAuditList.size() == 0) {
				params.put("quarter", "1");
				statementAuditList = exemplaryMatrixBackstageDAO.findStatementAuditList(params) ;
			}
		}else{
			statementAuditList = exemplaryMatrixBackstageDAO.findStatementAuditList(params) ;
		}
		
		String auditType = params.get("auditType");
		
		//处理结果
		if (0!=statementAuditList.size() && null!=statementAuditList) {
			logger.info("查询结果为："+statementAuditList.size());
			for (int i = 0; i < statementAuditList.size(); i++) {
				//查询合作服务机构信息
				Map<String, String> getCooperationFacilitatingAgencyParams = new HashMap<String, String>();
				getCooperationFacilitatingAgencyParams.put("userCode", (String)statementAuditList.get(i).get("userCode"));
				getCooperationFacilitatingAgencyParams.put("exemplaryMatrixApplicationId", ((Integer)statementAuditList.get(i).get("applicationId")).toString());
				
				List<CooperationFacilitatingAgency> cooperationFacilitatingAgencies = exemplaryMatrixApplicationService.getCooperationFacilitatingAgencyByParams(getCooperationFacilitatingAgencyParams);
				
				String coopService = "";
				if (0!=cooperationFacilitatingAgencies.size() && null!=cooperationFacilitatingAgencies) {
					for (int j = 0; j < cooperationFacilitatingAgencies.size(); j++) {
						coopService += cooperationFacilitatingAgencies.get(j).getServiceItems()+",";
					}
				}
				if (coopService!=null && !"".equals(coopService)) {
					coopService = coopService.substring(0, coopService.length()-1);
				}
				statementAuditList.get(i).put("coopCount", cooperationFacilitatingAgencies.size());
				statementAuditList.get(i).put("coopService", coopService);
				
				//获取服务功能情况
				Map<String, String> getApplicationParams = new HashMap<String, String>();
				getApplicationParams.put("applicationId", ((Integer)statementAuditList.get(i).get("applicationId")).toString());
				ExemplaryMatrixApplication exemplaryMatrixApplication = exemplaryMatrixBackstageDAO.findApplicationById(getApplicationParams);
				
				String service = "";
				if (exemplaryMatrixApplication.getInformationService()!=null && !"".equals(exemplaryMatrixApplication.getInformationService().trim())) {
					service += "信息服务,";
				}
				if (exemplaryMatrixApplication.getTutorship()!=null && !"".equals(exemplaryMatrixApplication.getTutorship().trim())) {
					service += "创业辅导,";
				}
				if (exemplaryMatrixApplication.getInnovationSupport()!=null && !"".equals(exemplaryMatrixApplication.getInnovationSupport().trim())) {
					service += "创新支持,";
				}
				if (exemplaryMatrixApplication.getPersonnelTraining()!=null && !"".equals(exemplaryMatrixApplication.getPersonnelTraining().trim())) {
					service += "人员培训,";
				}
				if (exemplaryMatrixApplication.getMarketing()!=null && !"".equals(exemplaryMatrixApplication.getMarketing().trim())) {
					service += "市场营销,";
				}
				if (exemplaryMatrixApplication.getFinancingService()!=null && !"".equals(exemplaryMatrixApplication.getFinancingService().trim())) {
					service += "融资服务,";
				}
				if (exemplaryMatrixApplication.getManagementConsultancy()!=null && !"".equals(exemplaryMatrixApplication.getManagementConsultancy().trim())) {
					service += "管理咨询服务,";
				}
				if (exemplaryMatrixApplication.getOtherService()!=null && !"".equals(exemplaryMatrixApplication.getOtherService().trim())) {
					service += "其他服务,";
				}
				
				if (service!=null && !"".equals(service)) {
					service = service.substring(0, service.length()-1);
				}
				statementAuditList.get(i).put("service", service);
				
				//获取服务活动各种数量
				String userCode = (String)statementAuditList.get(i).get("userCode");
				Integer year = (Integer)statementAuditList.get(i).get("year");
				Integer quarter = (Integer)statementAuditList.get(i).get("quarter");
				
				Map<String, Object> onlineData = this.getOnlineDataForAuditType(userCode, "", year, quarter,auditType);
				Map<String, Object> offlineData = this.getOfflineData(userCode, "", year, quarter,auditType);
				
				Integer serviceCount = (Integer)onlineData.get("onlineCount")+(Integer)offlineData.get("offlineCount");
				Integer enterCount = (Integer)offlineData.get("enterpriseQuantity")+(Integer)onlineData.get("onlineEnterCount");
				Integer personCount = (Integer)onlineData.get("onlinePersonCount")+(Integer)offlineData.get("personQuantity");
				
				statementAuditList.get(i).put("serviceCount", serviceCount);
				statementAuditList.get(i).put("enterCount", enterCount);
				statementAuditList.get(i).put("personCount", personCount);
				
				//获取上一年度服务企业数
				params.put("userCode", userCode);
				params.put("year", String.valueOf(year-1));
				logger.info("获取上年度服务企业数量，参数为："+params);
				List<Map<String, Object>> lastStatementAuditList = null;
				if("4".equals(params.get("quarter"))){
					lastStatementAuditList = exemplaryMatrixBackstageDAO.findStatementAuditList(params) ;
					if (lastStatementAuditList == null || lastStatementAuditList.size() == 0) {
						params.put("quarter", "3");
						lastStatementAuditList = exemplaryMatrixBackstageDAO.findStatementAuditList(params) ;
					}
					if (lastStatementAuditList == null || lastStatementAuditList.size() == 0) {
						params.put("quarter", "2");
						lastStatementAuditList = exemplaryMatrixBackstageDAO.findStatementAuditList(params) ;
					}
					if (lastStatementAuditList == null || lastStatementAuditList.size() == 0) {
						params.put("quarter", "1");
						lastStatementAuditList = exemplaryMatrixBackstageDAO.findStatementAuditList(params) ;
					}
				}else{
					lastStatementAuditList = exemplaryMatrixBackstageDAO.findStatementAuditList(params) ;
				}
				if (null != lastStatementAuditList && lastStatementAuditList.size()!=0) {
					logger.info("获取上年度服务企业数量，查询到的季度报表数量为："+lastStatementAuditList.size());
					Integer lastYear = (Integer)lastStatementAuditList.get(0).get("year");
					Integer lastQuarter = (Integer)lastStatementAuditList.get(0).get("quarter");
					Map<String, Object> lastOnlineData = this.getOnlineDataForAuditType(userCode, "", lastYear, lastQuarter,auditType);
					Map<String, Object> lastOfflineData = this.getOfflineData(userCode, "", lastYear, lastQuarter,auditType);
					Integer lastEnterCount = (Integer)lastOfflineData.get("enterpriseQuantity")+(Integer)lastOnlineData.get("onlineEnterCount");
					statementAuditList.get(i).put("lastEnterCount", lastEnterCount);
				}else{
					statementAuditList.get(i).put("lastEnterCount", 0);
				}
				
			}
		}
		result.put("statementAuditList", statementAuditList);
		return result;
	}
	
	/**
	 * 为导出季度报表处理数据
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> disposeDataForExportQuarterStatement(Map<String, String> params){
		//创建返回数据
		List<LinkedHashMap<String, Object>> result = new ArrayList<LinkedHashMap<String, Object>>();
		Map<String, Object> quarterStatementResult = this.findStatementAuditListNoPage(params);
		if (quarterStatementResult != null) {
			List<Map<String, Object>> quarterStatement = (List<Map<String,Object>>)quarterStatementResult.get("statementAuditList");
			Double floorSpaceECount = 0.0;
			Integer personnelQuantityCount = 0;
			Integer tutorQuantityCount = 0;
			Integer enterpriseCount = 0;
			Integer smeCount = 0;
			Integer personnelQuantityECount = 0;
			Double totalAssetsCount = 0.0;
			Double incomeCount = 0.0;
			Integer coopCount = 0;
			String coopService = "-";
			Integer serviceCount = 0;
			String service = "-";
			Integer enterCount = 0;
			Integer personCount = 0;
			Double incomeProportion = 0.0;
			
			
			if (null!=quarterStatement && 0!=quarterStatement.size()) {
				for (int i = 0; i < quarterStatement.size(); i++) {
					LinkedHashMap<String, Object> exeportResult = new LinkedHashMap<String, Object>();
					exeportResult.put("matrixName", quarterStatement.get(i).get("matrixName"));
					
					exeportResult.put("floorSpaceE", quarterStatement.get(i).get("floorSpaceE"));
					floorSpaceECount += (Double)quarterStatement.get(i).get("floorSpaceE");
					
					exeportResult.put("personnelQuantity", quarterStatement.get(i).get("personnelQuantity"));
					personnelQuantityCount += (Integer)quarterStatement.get(i).get("personnelQuantity");
					
					exeportResult.put("tutorQuantity", quarterStatement.get(i).get("tutorQuantity"));
					tutorQuantityCount += (Integer)quarterStatement.get(i).get("tutorQuantity");
					
					exeportResult.put("enterpriseCount", quarterStatement.get(i).get("enterpriseCount"));
					enterpriseCount += (Integer)quarterStatement.get(i).get("enterpriseCount");
					
					exeportResult.put("smeCount", quarterStatement.get(i).get("smeCount"));
					smeCount += (Integer)quarterStatement.get(i).get("smeCount");
					
					exeportResult.put("personnelQuantityE", quarterStatement.get(i).get("personnelQuantityE"));
					personnelQuantityECount += (Integer)quarterStatement.get(i).get("personnelQuantityE");
					
					exeportResult.put("totalAssets", quarterStatement.get(i).get("totalAssets"));
					totalAssetsCount += (Double)quarterStatement.get(i).get("totalAssets");
					
					exeportResult.put("income", quarterStatement.get(i).get("income"));
					incomeCount += (Double)quarterStatement.get(i).get("income");
					
					exeportResult.put("coopCount", quarterStatement.get(i).get("coopCount"));
					coopCount += (Integer)quarterStatement.get(i).get("coopCount");
					
					exeportResult.put("coopService", quarterStatement.get(i).get("coopService"));
					exeportResult.put("serviceCount", quarterStatement.get(i).get("serviceCount"));
					serviceCount += (Integer)quarterStatement.get(i).get("serviceCount");
					
					exeportResult.put("service", quarterStatement.get(i).get("service"));
					exeportResult.put("enterCount", quarterStatement.get(i).get("enterCount"));
					enterCount += (Integer)quarterStatement.get(i).get("enterCount");
					
					exeportResult.put("personCount", quarterStatement.get(i).get("personCount"));
					personCount += (Integer)quarterStatement.get(i).get("personCount");
					
					exeportResult.put("incomeProportion", quarterStatement.get(i).get("incomeProportion"));
					incomeProportion += (Double)quarterStatement.get(i).get("incomeProportion");
					
					result.add(exeportResult);
				}
			}
			LinkedHashMap<String, Object> exeportResult = new LinkedHashMap<String, Object>();
			exeportResult.put("matrixName", "合计");
			exeportResult.put("floorSpaceE", floorSpaceECount);
			exeportResult.put("personnelQuantity", personnelQuantityCount);
			exeportResult.put("tutorQuantity", tutorQuantityCount);
			exeportResult.put("enterpriseCount", enterpriseCount);
			exeportResult.put("smeCount", smeCount);
			exeportResult.put("personnelQuantityE", personnelQuantityECount);
			exeportResult.put("totalAssets", totalAssetsCount);
			exeportResult.put("income", incomeCount);
			exeportResult.put("coopCount", coopCount);
			exeportResult.put("coopService", coopService);
			exeportResult.put("serviceCount", serviceCount);
			exeportResult.put("service", service);
			exeportResult.put("enterCount", enterCount);
			exeportResult.put("personCount", personCount);
			exeportResult.put("incomeProportion", incomeProportion);
			result.add(exeportResult);
			
		}
		return result;
	}
	
	/**
	 * 为导出年度报表处理数据
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> disposeDataForExportYearStatement(Map<String, String> params){
		List<LinkedHashMap<String, Object>> result = new ArrayList<LinkedHashMap<String,Object>>();
		Map<String, Object> quarterStatementResult = this.findStatementAuditListNoPage(params);
		if (quarterStatementResult != null) {
			List<Map<String, Object>> quarterStatement = (List<Map<String,Object>>)quarterStatementResult.get("statementAuditList");
			Double floorSpaceECount = 0.0;
			Integer personnelQuantityCount = 0;
			Integer tutorQuantityCount = 0;
			Integer enterpriseCount = 0;
			Integer smeCount = 0;
			Integer personnelQuantityECount = 0;
			Double totalAssetsCount = 0.0;
			Double incomeCount = 0.0;
			Integer coopCount = 0;
			String coopService = "-";
			Integer serviceCount = 0;
			String service = "-";
			Integer lastEnterCount = 0;
			Integer enterCount = 0;
			Integer personCount = 0;
			Double incomeProportion = 0.0;
			
			Integer activityCount1 = 0;
			Integer enterCount1 = 0 ; 
			
			Integer activityCount2 = 0;
			Integer enterCount2 = 0 ; 
			
			Integer activityCount3 = 0;
			Integer enterCount3 = 0 ; 
			
			Integer activityCount4 = 0;
			Integer enterCount4 = 0 ; 
			Integer personnalCount4 = 0;
			
			Integer activityCount5 = 0;
			Integer enterCount5 = 0 ; 
			
			Integer activityCount6 = 0;
			Integer enterCount6 = 0 ; 
			Double tourongzijine6 = 0.0;
			
			Integer activityCount7 = 0;
			Integer enterCount7 = 0 ; 
			
			Integer activityCount8 = 0;
			Integer enterCount8 = 0 ; 
			
			Integer zhichijine = 0;
			
			
			if (null!=quarterStatement && 0!=quarterStatement.size()) {
				for (int i = 0; i < quarterStatement.size(); i++) {
					LinkedHashMap<String, Object> exeportResult = new LinkedHashMap<String, Object>();
					exeportResult.put("matrixName", quarterStatement.get(i).get("matrixName"));
					
					exeportResult.put("batch", "");
					
					exeportResult.put("floorSpaceE", quarterStatement.get(i).get("floorSpaceE"));
					floorSpaceECount += (Double)quarterStatement.get(i).get("floorSpaceE");
					
					exeportResult.put("personnelQuantity", quarterStatement.get(i).get("personnelQuantity"));
					personnelQuantityCount += (Integer)quarterStatement.get(i).get("personnelQuantity");
					
					exeportResult.put("tutorQuantity", quarterStatement.get(i).get("tutorQuantity"));
					tutorQuantityCount += (Integer)quarterStatement.get(i).get("tutorQuantity");
					
					exeportResult.put("enterpriseCount", quarterStatement.get(i).get("enterpriseCount"));
					enterpriseCount += (Integer)quarterStatement.get(i).get("enterpriseCount");
					
					exeportResult.put("smeCount", quarterStatement.get(i).get("smeCount"));
					smeCount += (Integer)quarterStatement.get(i).get("smeCount");
					
					exeportResult.put("personnelQuantityE", quarterStatement.get(i).get("personnelQuantityE"));
					personnelQuantityECount += (Integer)quarterStatement.get(i).get("personnelQuantityE");
					
					exeportResult.put("totalAssets", quarterStatement.get(i).get("totalAssets"));
					totalAssetsCount += (Double)quarterStatement.get(i).get("totalAssets");
					
					exeportResult.put("income", quarterStatement.get(i).get("income"));
					incomeCount += (Double)quarterStatement.get(i).get("income");
					
					exeportResult.put("incomeProportion", quarterStatement.get(i).get("incomeProportion"));
					incomeProportion += (Double)quarterStatement.get(i).get("incomeProportion");
					
					exeportResult.put("coopCount", quarterStatement.get(i).get("coopCount"));
					coopCount += (Integer)quarterStatement.get(i).get("coopCount");
					
					exeportResult.put("coopService", quarterStatement.get(i).get("coopService"));
					
					exeportResult.put("lastYear", quarterStatement.get(i).get("lastEnterCount"));
					lastEnterCount += (Integer)quarterStatement.get(i).get("lastEnterCount");
					
					exeportResult.put("enterCount", quarterStatement.get(i).get("enterCount"));
					enterCount += (Integer)quarterStatement.get(i).get("enterCount");
					
					exeportResult.put("serviceCount", quarterStatement.get(i).get("serviceCount"));
					serviceCount += (Integer)quarterStatement.get(i).get("serviceCount");
					
//					exeportResult.put("service", quarterStatement.get(i).get("service"));
					
					exeportResult.put("personCount", quarterStatement.get(i).get("personCount"));
					personCount += (Integer)quarterStatement.get(i).get("personCount");
					
					//查询具体数据
					Map<String, String> findDataParams = new HashMap<String, String>();
					findDataParams.put("userCode", (String)quarterStatement.get(i).get("userCode"));
					findDataParams.put("serviceYear", params.get("year"));
					findDataParams.put("serviceQuarter", params.get("quarter"));
					findDataParams.put("auditType", params.get("auditType"));
					Map<String, Object> findDataResult = this.findServieDataByParam(findDataParams);
					Map<String, Object> serviceData = (Map<String, Object>)findDataResult.get("serviceData");
					List<ExemplaryMatrixStatementManageView> exemplaryMatrixStatementManageView = (List<ExemplaryMatrixStatementManageView>)serviceData.get("exemplaryMatrixStatementManageViews");
					for (int j = 0; j < exemplaryMatrixStatementManageView.size(); j++) {
						if (j == 0) {
							exeportResult.put("activityCount"+j, exemplaryMatrixStatementManageView.get(j).getActivityCount()+exemplaryMatrixStatementManageView.get(j).getPublishInfoCount());
						}else{
							exeportResult.put("activityCount"+j, exemplaryMatrixStatementManageView.get(j).getActivityCount());
						}
						
						
						exeportResult.put("enterCount"+j, exemplaryMatrixStatementManageView.get(j).getEnterCount());
						if (j == 3) {
							exeportResult.put("personnalCount", exemplaryMatrixStatementManageView.get(j).getPersonCount());
							personnalCount4 += exemplaryMatrixStatementManageView.get(j).getPersonCount();
						}
						if (j == 5) {
							exeportResult.put("tourongzijine", exemplaryMatrixStatementManageView.get(j).getFinancingAmount());
							tourongzijine6 += exemplaryMatrixStatementManageView.get(j).getFinancingAmount();
						}
						
						if (j == 0) {
							activityCount1 += exemplaryMatrixStatementManageView.get(j).getActivityCount()+exemplaryMatrixStatementManageView.get(j).getPublishInfoCount();
							enterCount1 += exemplaryMatrixStatementManageView.get(j).getEnterCount();
						}else if (j == 1) {
							activityCount2 += exemplaryMatrixStatementManageView.get(j).getActivityCount();
							enterCount2 += exemplaryMatrixStatementManageView.get(j).getEnterCount();
						}else if (j == 2) {
							activityCount3 += exemplaryMatrixStatementManageView.get(j).getActivityCount();
							enterCount3 += exemplaryMatrixStatementManageView.get(j).getEnterCount();
						}else if (j == 3) {
							activityCount4 += exemplaryMatrixStatementManageView.get(j).getActivityCount();
							enterCount4 += exemplaryMatrixStatementManageView.get(j).getEnterCount();
						}else if (j == 4) {
							activityCount5 += exemplaryMatrixStatementManageView.get(j).getActivityCount();
							enterCount5 += exemplaryMatrixStatementManageView.get(j).getEnterCount();
						}else if (j == 5) {
							activityCount6 += exemplaryMatrixStatementManageView.get(j).getActivityCount();
							enterCount6 += exemplaryMatrixStatementManageView.get(j).getEnterCount();
						}else if (j == 6) {
							activityCount7 += exemplaryMatrixStatementManageView.get(j).getActivityCount();
							enterCount7 += exemplaryMatrixStatementManageView.get(j).getEnterCount();
						}else if (j == 7) {
							activityCount8 += exemplaryMatrixStatementManageView.get(j).getActivityCount();
							enterCount8 += exemplaryMatrixStatementManageView.get(j).getEnterCount();
						}
						
					}
					exeportResult.put("zhichijine", 0);
					result.add(exeportResult);
				}
			}
			LinkedHashMap<String, Object> exeportResult = new LinkedHashMap<String, Object>();
			exeportResult.put("matrixName", "合计");
			exeportResult.put("batch", "");
			exeportResult.put("floorSpaceE", floorSpaceECount);
			exeportResult.put("personnelQuantity", personnelQuantityCount);
			exeportResult.put("tutorQuantity", tutorQuantityCount);
			exeportResult.put("enterpriseCount", enterpriseCount);
			exeportResult.put("smeCount", smeCount);
			exeportResult.put("personnelQuantityE", personnelQuantityECount);
			exeportResult.put("totalAssets", totalAssetsCount);
			exeportResult.put("income", incomeCount);
			exeportResult.put("incomeProportion", incomeProportion);
			exeportResult.put("coopCount", coopCount);
			exeportResult.put("coopService", coopService);
			exeportResult.put("lastYear", lastEnterCount);
			exeportResult.put("enterCount", enterCount);
			exeportResult.put("serviceCount", serviceCount);
			//exeportResult.put("service", service);
			exeportResult.put("personCount", personCount);
			
			exeportResult.put("activityCount1", activityCount1);
			exeportResult.put("enterCount1", enterCount1);
			
			exeportResult.put("activityCount2", activityCount2);
			exeportResult.put("enterCount2", enterCount2);
			
			exeportResult.put("activityCount3", activityCount3);
			exeportResult.put("enterCount3", enterCount3);
			
			exeportResult.put("activityCount4", activityCount4);
			exeportResult.put("enterCount4", enterCount4);
			exeportResult.put("personnalCount4", personnalCount4);
			
			exeportResult.put("activityCount5", activityCount5);
			exeportResult.put("enterCount5", enterCount5);
			
			exeportResult.put("activityCount6", activityCount6);
			exeportResult.put("enterCount6", enterCount6);
			exeportResult.put("tourongzijine6", tourongzijine6);
			
			exeportResult.put("activityCount7", activityCount7);
			exeportResult.put("enterCount7", enterCount7);
			
			exeportResult.put("activityCount8", activityCount8);
			exeportResult.put("enterCount8", enterCount8);
			
			exeportResult.put("zhichijine", zhichijine);
			result.add(exeportResult);
		}
		
		
		
		return result;
	}
	
	/**
	 * 查询已经填写了报表的年份和季度
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> findHaveQuarterStatementTime(Map<String, String> params){
		return exemplaryMatrixBackstageDAO.findHaveQuarterStatementTime(params);
	}
	
	/**
	 * 保存服务情况汇总
	 * @param request
	 * @return
	 */
	public Integer saveExemplaryMatrixServiceSituation(HttpServletRequest request){
		Integer result = 0;
		
		String userCode = request.getParameter("userCode");
		String serviceYear = request.getParameter("serviceYear");
		String serviceQuarter = request.getParameter("serviceQuarter");
		
		logger.info("要添加的userCode为："+userCode+"，年份为："+serviceYear+"，季度为："+serviceQuarter);
		Map<String, String> params = new HashMap<String, String>();
		params.put("userCode", userCode);
		params.put("serviceYear", serviceYear);
		params.put("serviceQuarter", serviceQuarter);
		//执行删除操作
		exemplaryMatrixBackstageDAO.deleteExemplaryMatrixServiceSituationByParam(params);
		
		String[] serviceTypes = request.getParameterValues("serviceType");
		String[] serviceContents = request.getParameterValues("serviceContent");
		String[] serviceEffects = request.getParameterValues("serviceEffect");
		
		
		logger.info("传入参数条数为："+serviceTypes.length);
		
		for (int i = 0; i < serviceTypes.length; i++) {
			String[] serviceScopes = request.getParameterValues("serviceScope"+serviceTypes[i]);
			if (("".equals(serviceContents[i]) || serviceContents[i] == null) && 
					("".equals(serviceEffects[i]) || serviceEffects[i] == null) && 
					("".equals(serviceScopes) || serviceScopes == null)) {
				
				if ("103000006".equals(serviceTypes[i])) {
					String financingAmount = request.getParameter("financingAmount");
					if ("".equals(financingAmount) || financingAmount == null) {
						continue;
					}
				}else {
					continue;
				}
				
			}else {
				ExemplaryMatrixServiceSituation exemplaryMatrixServiceSituation = new ExemplaryMatrixServiceSituation();
				exemplaryMatrixServiceSituation.setUserCode(userCode);
				exemplaryMatrixServiceSituation.setServiceYear(Integer.parseInt(serviceYear));
				exemplaryMatrixServiceSituation.setServiceQuarter(Integer.parseInt(serviceQuarter));
				exemplaryMatrixServiceSituation.setServiceType(serviceTypes[i]);
				exemplaryMatrixServiceSituation.setServiceContent(serviceContents[i]);
				exemplaryMatrixServiceSituation.setServiceEffect(serviceEffects[i]);
				String serviceScope = "";
				for (int j = 0; j < serviceScopes.length; j++) {
					serviceScope += serviceScopes[j];
					if (j!=(serviceScopes.length-1)) {
						serviceScope += ",";
					}
				}
				exemplaryMatrixServiceSituation.setServiceScope(serviceScope);
				
				if ("103000006".equals(serviceTypes[i])) {
					String financingAmount = request.getParameter("financingAmount");
					exemplaryMatrixServiceSituation.setFinancingAmount(Double.parseDouble(financingAmount));
				}
				
				exemplaryMatrixServiceSituation.setAuditType("0");
				exemplaryMatrixServiceSituation.setCreateStamp(new Date());
				exemplaryMatrixServiceSituation.setUpdateStamp(new Date());
				
				result += exemplaryMatrixBackstageDAO.saveExemplaryMatrixServiceSituation(exemplaryMatrixServiceSituation);
			}
		}
		
		//20180403增加报表状态
		ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus =  new ExemplaryMatrixStatementStatus();
		exemplaryMatrixStatementStatus.setUserCode(userCode);
		exemplaryMatrixStatementStatus.setServiceYear(Integer.parseInt(serviceYear));
		exemplaryMatrixStatementStatus.setServiceQuarter(Integer.parseInt(serviceQuarter));
		exemplaryMatrixStatementStatus.setStatementName("情况总结");
		exemplaryMatrixStatementStatus.setStatus("1");
		exemplaryMatrixStatementStatus.setCreateStamp(new Date());
		exemplaryMatrixStatementStatus.setUpdateStamp(new Date());
		this.insertOrUpdateStatementStatus(exemplaryMatrixStatementStatus);
		
		logger.info("一共插入基地服务情况汇总条数为："+result);
		return result;
	}
	
	/**
	 * 通过userCode，year，quarter获取服务情况汇总信息
	 * @param params
	 * @return
	 */
	public List<ExemplaryMatrixServiceSituation> findExemplaryMatrixServiceSituationByParams(Map<String, String> params){
		return exemplaryMatrixBackstageDAO.findExemplaryMatrixServiceSituationByParams(params);
	}
	
	/**
	 * 通过userCode获取基地基本信息
	 * @param params
	 * @return
	 */
	public Map<String, Object> findMatrixBaseInfoByUserCode(Map<String, String> params){
		return exemplaryMatrixBackstageDAO.findMatrixBaseInfoByUserCode(params);
	}
	
	/**
	 * 根据参数获取服务能力提升数据
	 * @param params
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> findServiceAbilityPromoteByParams(Map<String, String> params){
		List<LinkedHashMap<String, Object>> result = new ArrayList<LinkedHashMap<String,Object>>();
		boolean officeFlag = false;
		boolean decoratingFlag = false;
		
		//获取办公能力升级情况
		List<Map<String, Object>> officeEquipmentList = exemplaryMatrixApplicationDAO.getOfficeEquipmentListByCodeForMap(params);
		if (null!=officeEquipmentList && 0!=officeEquipmentList.size()) {
			for (int i = 0; i < officeEquipmentList.size(); i++) {
				LinkedHashMap<String, Object> officeEquipment = new LinkedHashMap<String, Object>();
				officeEquipment.put("zhanwei", "");
				officeEquipment.put("neirong", "公共服务设备提升");
				officeEquipment.put("zhanwei1", "");
				officeEquipment.put("zhanwei2", "");
				officeEquipment.put("equipmentName", officeEquipmentList.get(i).get("equipmentName"));
				officeEquipment.put("zhanwei3", "");
				officeEquipment.put("zhanwei4", "");
				officeEquipment.put("amountInvested", officeEquipmentList.get(i).get("amountInvested"));
				officeEquipment.put("zhanwei5", "");
				officeEquipment.put("timeInvested", officeEquipmentList.get(i).get("timeInvested"));
				result.add(officeEquipment);
			}
		}else {
			officeFlag = true;
		}
		
		//获取装修改造升级情况
		List<Map<String, Object>> decorationList = exemplaryMatrixApplicationDAO.getDecorationListByCodeForMap(params);
		if (null!=decorationList && 0!=decorationList.size()) {
			for (int i = 0; i < decorationList.size(); i++) {
				LinkedHashMap<String, Object> decoration = new LinkedHashMap<String, Object>();
				decoration.put("zhanwei", "");
				decoration.put("neirong", "装修改造升级");
				decoration.put("zhanwei1", "");
				decoration.put("zhanwei2", "");
				decoration.put("contractName", decorationList.get(i).get("contractName"));
				decoration.put("zhanwei3", "");
				decoration.put("zhanwei4", "");
				decoration.put("amountInvested", decorationList.get(i).get("amountInvested"));
				decoration.put("zhanwei5", "");
				decoration.put("timeInvested", decorationList.get(i).get("timeInvested"));
				result.add(decoration);
			}
		}else {
			decoratingFlag = true;
		}
		
		//都没有查询到结果
		if (officeFlag && decoratingFlag) {
			LinkedHashMap<String, Object> noResult = new LinkedHashMap<String, Object>();
			noResult.put("noResult", "未查询到结果或该季度服务能力提升情况未通过区级审核");
			result.add(noResult);
		}
		
		return result;
	}
	
	/**
	 * 获取基地服务情况数据
	 * @param params
	 * @return
	 */
	public Map<String, String> findMatrixServiceInfo(Map<String, String> params){
		Map<String, String> result = new HashMap<String, String>();
		//查询服务情况
		List<ExemplaryMatrixServiceSituation> exemplaryMatrixServiceSituations = exemplaryMatrixBackstageDAO.findExemplaryMatrixServiceSituationByParams(params);
		if (null!=exemplaryMatrixServiceSituations && 0!=exemplaryMatrixServiceSituations.size()) {
			for (int i = 0; i < exemplaryMatrixServiceSituations.size(); i++) {
				ExemplaryMatrixServiceSituation exemplaryMatrixServiceSituation = exemplaryMatrixServiceSituations.get(i);
				if ("103000001".equals(exemplaryMatrixServiceSituation.getServiceType())) {
					result.put("103000001_serviceContent", exemplaryMatrixServiceSituation.getServiceContent());
					result.put("103000001_serviceEffect", exemplaryMatrixServiceSituation.getServiceEffect());
					result.put("103000001_serviceScope", exemplaryMatrixServiceSituation.getServiceScope());
				}
				
				if ("103000002".equals(exemplaryMatrixServiceSituation.getServiceType())) {
					result.put("103000002_serviceContent", exemplaryMatrixServiceSituation.getServiceContent());
					result.put("103000002_serviceEffect", exemplaryMatrixServiceSituation.getServiceEffect());
					result.put("103000002_serviceScope", exemplaryMatrixServiceSituation.getServiceScope());
				}
				
				if ("103000003".equals(exemplaryMatrixServiceSituation.getServiceType())) {
					result.put("103000003_serviceContent", exemplaryMatrixServiceSituation.getServiceContent());
					result.put("103000003_serviceEffect", exemplaryMatrixServiceSituation.getServiceEffect());
					result.put("103000003_serviceScope", exemplaryMatrixServiceSituation.getServiceScope());
				}
				
				if ("103000004".equals(exemplaryMatrixServiceSituation.getServiceType())) {
					result.put("103000004_serviceContent", exemplaryMatrixServiceSituation.getServiceContent());
					result.put("103000004_serviceEffect", exemplaryMatrixServiceSituation.getServiceEffect());
					result.put("103000004_serviceScope", exemplaryMatrixServiceSituation.getServiceScope());
				}
				
				if ("103000005".equals(exemplaryMatrixServiceSituation.getServiceType())) {
					result.put("103000005_serviceContent", exemplaryMatrixServiceSituation.getServiceContent());
					result.put("103000005_serviceEffect", exemplaryMatrixServiceSituation.getServiceEffect());
					result.put("103000005_serviceScope", exemplaryMatrixServiceSituation.getServiceScope());
				}
				
				if ("103000006".equals(exemplaryMatrixServiceSituation.getServiceType())) {
					result.put("103000006_serviceContent", exemplaryMatrixServiceSituation.getServiceContent());
					result.put("103000006_serviceEffect", exemplaryMatrixServiceSituation.getServiceEffect());
					result.put("103000006_serviceScope", exemplaryMatrixServiceSituation.getServiceScope());
				}
				
				if ("103000007".equals(exemplaryMatrixServiceSituation.getServiceType())) {
					result.put("103000007_serviceContent", exemplaryMatrixServiceSituation.getServiceContent());
					result.put("103000007_serviceEffect", exemplaryMatrixServiceSituation.getServiceEffect());
					result.put("103000007_serviceScope", exemplaryMatrixServiceSituation.getServiceScope());
				}
				
				if ("103000008".equals(exemplaryMatrixServiceSituation.getServiceType())) {
					result.put("103000008_serviceContent", exemplaryMatrixServiceSituation.getServiceContent());
					result.put("103000008_serviceEffect", exemplaryMatrixServiceSituation.getServiceEffect());
					result.put("103000008_serviceScope", exemplaryMatrixServiceSituation.getServiceScope());
				}
			}
		}
		
		if (null == result.get("103000001_serviceContent")) {
			result.put("103000001_serviceContent", "-");
			result.put("103000001_serviceEffect", "-");
			result.put("103000001_serviceScope", "-");
		}
		if (null == result.get("103000002_serviceContent")) {
			result.put("103000002_serviceContent", "-");
			result.put("103000002_serviceEffect", "-");
			result.put("103000002_serviceScope", "-");
		}
		if (null == result.get("103000003_serviceContent")) {
			result.put("103000003_serviceContent", "-");
			result.put("103000003_serviceEffect", "-");
			result.put("103000003_serviceScope", "-");
		}
		if (null == result.get("103000004_serviceContent")) {
			result.put("103000004_serviceContent", "-");
			result.put("103000004_serviceEffect", "-");
			result.put("103000004_serviceScope", "-");
		}
		if (null == result.get("103000005_serviceContent")) {
			result.put("103000005_serviceContent", "-");
			result.put("103000005_serviceEffect", "-");
			result.put("103000005_serviceScope", "-");
		}
		if (null == result.get("103000006_serviceContent")) {
			result.put("103000006_serviceContent", "-");
			result.put("103000006_serviceEffect", "-");
			result.put("103000006_serviceScope", "-");
		}
		if (null == result.get("103000007_serviceContent")) {
			result.put("103000007_serviceContent", "-");
			result.put("103000007_serviceEffect", "-");
			result.put("103000007_serviceScope", "-");
		}
		if (null == result.get("103000008_serviceContent")) {
			result.put("103000008_serviceContent", "-");
			result.put("103000008_serviceEffect", "-");
			result.put("103000008_serviceScope", "-");
		}
		
		
		//查询服务数量数据
		Map<String, Object> serviceDataMap = this.findServieDataByParam(params);
		Map<String, Object> serviceData = (Map<String, Object>)serviceDataMap.get("serviceData");
		List<ExemplaryMatrixStatementManageView> exemplaryMatrixStatementManageViews = (List<ExemplaryMatrixStatementManageView>)serviceData.get("exemplaryMatrixStatementManageViews");
		for (int i = 0; i < exemplaryMatrixStatementManageViews.size(); i++) {
			ExemplaryMatrixStatementManageView exemplaryMatrixStatementManageView = exemplaryMatrixStatementManageViews.get(i);
			
			if ("103000001".equals(exemplaryMatrixStatementManageView.getServiceSort())) {
				result.put("103000001_activityCount", exemplaryMatrixStatementManageView.getActivityCount().toString());
				result.put("103000001_enterCount", exemplaryMatrixStatementManageView.getEnterCount().toString());
				result.put("103000001_personCount", exemplaryMatrixStatementManageView.getPersonCount().toString());
				result.put("103000001_totalExpend", exemplaryMatrixStatementManageView.getTotalExpend().toString());
			}
			
			if ("103000002".equals(exemplaryMatrixStatementManageView.getServiceSort())) {
				result.put("103000002_activityCount", exemplaryMatrixStatementManageView.getActivityCount().toString());
				result.put("103000002_enterCount", exemplaryMatrixStatementManageView.getEnterCount().toString());
				result.put("103000002_personCount", exemplaryMatrixStatementManageView.getPersonCount().toString());
				result.put("103000002_totalExpend", exemplaryMatrixStatementManageView.getTotalExpend().toString());
			}
			
			if ("103000003".equals(exemplaryMatrixStatementManageView.getServiceSort())) {
				result.put("103000003_activityCount", exemplaryMatrixStatementManageView.getActivityCount().toString());
				result.put("103000003_enterCount", exemplaryMatrixStatementManageView.getEnterCount().toString());
				result.put("103000003_personCount", exemplaryMatrixStatementManageView.getPersonCount().toString());
				result.put("103000003_totalExpend", exemplaryMatrixStatementManageView.getTotalExpend().toString());
			}
			
			if ("103000004".equals(exemplaryMatrixStatementManageView.getServiceSort())) {
				result.put("103000004_activityCount", exemplaryMatrixStatementManageView.getActivityCount().toString());
				result.put("103000004_enterCount", exemplaryMatrixStatementManageView.getEnterCount().toString());
				result.put("103000004_personCount", exemplaryMatrixStatementManageView.getPersonCount().toString());
				result.put("103000004_totalExpend", exemplaryMatrixStatementManageView.getTotalExpend().toString());
			}
			
			if ("103000005".equals(exemplaryMatrixStatementManageView.getServiceSort())) {
				result.put("103000005_activityCount", exemplaryMatrixStatementManageView.getActivityCount().toString());
				result.put("103000005_enterCount", exemplaryMatrixStatementManageView.getEnterCount().toString());
				result.put("103000005_personCount", exemplaryMatrixStatementManageView.getPersonCount().toString());
				result.put("103000005_totalExpend", exemplaryMatrixStatementManageView.getTotalExpend().toString());
			}
			
			if ("103000006".equals(exemplaryMatrixStatementManageView.getServiceSort())) {
				result.put("103000006_activityCount", exemplaryMatrixStatementManageView.getActivityCount().toString());
				result.put("103000006_enterCount", exemplaryMatrixStatementManageView.getEnterCount().toString());
				result.put("103000006_personCount", exemplaryMatrixStatementManageView.getPersonCount().toString());
				result.put("103000006_totalExpend", exemplaryMatrixStatementManageView.getTotalExpend().toString());
			}
			
			if ("103000007".equals(exemplaryMatrixStatementManageView.getServiceSort())) {
				result.put("103000007_activityCount", exemplaryMatrixStatementManageView.getActivityCount().toString());
				result.put("103000007_enterCount", exemplaryMatrixStatementManageView.getEnterCount().toString());
				result.put("103000007_personCount", exemplaryMatrixStatementManageView.getPersonCount().toString());
				result.put("103000007_totalExpend", exemplaryMatrixStatementManageView.getTotalExpend().toString());
			}
			
			if ("103000008".equals(exemplaryMatrixStatementManageView.getServiceSort())) {
				result.put("103000008_activityCount", exemplaryMatrixStatementManageView.getActivityCount().toString());
				result.put("103000008_enterCount", exemplaryMatrixStatementManageView.getEnterCount().toString());
				result.put("103000008_personCount", exemplaryMatrixStatementManageView.getPersonCount().toString());
				result.put("103000008_totalExpend", exemplaryMatrixStatementManageView.getTotalExpend().toString());
			}
		}
		return result;
	}
	
	/**
	 * 通过区编号获取该区的示范基地列表
	 * @param parasm
	 * @return
	 */
	public List<Map<String, Object>> findMatrixListByDistrict(Map<String, String> params){
		//20170630新增，根据传入区县代码分区查询基地列表
		String district = params.get("district");
		logger.info("传入的区县代码为："+district);
		//20170630，如果传入的市级代码则将参数致空
		if ("".equals(district.trim()) || "120000".equals(district.trim())) {
			params.put("district", "");
		}
		return exemplaryMatrixApplicationDAO.findMatrixListForStatementList(params);
	}
	
	/**
	 * 数据统计页面，根据条件各种统计
	 * @param params
	 * @return
	 */
	public Map<String, Integer> findServiceCount(Map<String, String> params){
		Map<String, Integer> result = new HashMap<String, Integer>();
		
//		String district = params.get("district");
//		if ("".equals(district.trim()) || "120000".equals(district.trim())) {
//			params.put("district", "");
//		}
//		List<Map<String, Object>> dataList = exemplaryMatrixBackstageDAO.findMatrixInfoByParams(params);
//		Integer serviceCount = 0;
//		Integer onlineCount = 0;
//		Integer offlineCount = 0;
//		Integer personCount = 0;
//		Integer enterCount = 0;
//		if (null != dataList && 0!= dataList.size()) {
//			for (int i = 0; i < dataList.size(); i++) {
//				//查询每一条记录的服务次数
//				String userCode = (String)dataList.get(i).get("userCode");
//				Integer serviceYear = (Integer)dataList.get(i).get("serviceYear");
//				Integer serviceQuarter = (Integer)dataList.get(i).get("serviceQuarter");
//				String serviceSort = (String)dataList.get(i).get("serviceCode");
//				String auditType = "1";
//				
//				//分别处理每个分类
//				if ("103000001".equals(serviceSort)) {
//					//信息服务类别，对应八大服务的信息服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "100000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = this.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					onlineCount += onlineData.get("onlineCount");
//					
//					serviceCount += (Integer)offlineData.get("offlineCount");
//					offlineCount += (Integer)offlineData.get("offlineCount");
//					
//					personCount += onlineData.get("onlinePersonCount");
//					personCount += (Integer)offlineData.get("personQuantity");
//					
//					enterCount += (Integer)offlineData.get("enterpriseQuantity");
//				}else if ("103000002".equals(serviceSort)) {
//					//创业服务，对应八大服务的创业服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "103000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = this.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					onlineCount += onlineData.get("onlineCount");
//					
//					serviceCount += (Integer)offlineData.get("offlineCount");
//					offlineCount += (Integer)offlineData.get("offlineCount");
//					
//					personCount += onlineData.get("onlinePersonCount");
//					personCount += (Integer)offlineData.get("personQuantity");
//					
//					enterCount += (Integer)offlineData.get("enterpriseQuantity");
//				}else if ("103000003".equals(serviceSort)) {
//					//创新支持，对应八大服务的技术创新和质量服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "102000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = this.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					onlineCount += onlineData.get("onlineCount");
//					
//					serviceCount += (Integer)offlineData.get("offlineCount");
//					offlineCount += (Integer)offlineData.get("offlineCount");
//					
//					personCount += onlineData.get("onlinePersonCount");
//					personCount += (Integer)offlineData.get("personQuantity");
//					
//					enterCount += (Integer)offlineData.get("enterpriseQuantity");
//				}else if ("103000004".equals(serviceSort)) {
//					//人员培训，对应八大服务的人才与培训服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "101000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = this.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					onlineCount += onlineData.get("onlineCount");
//					
//					serviceCount += (Integer)offlineData.get("offlineCount");
//					offlineCount += (Integer)offlineData.get("offlineCount");
//					
//					personCount += onlineData.get("onlinePersonCount");
//					personCount += (Integer)offlineData.get("personQuantity");
//					
//					enterCount += (Integer)offlineData.get("enterpriseQuantity");
//				}else if ("103000005".equals(serviceSort)) {
//					//市场营销，对应八大服务的市场开拓服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "105000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = this.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					onlineCount += onlineData.get("onlineCount");
//					
//					serviceCount += (Integer)offlineData.get("offlineCount");
//					offlineCount += (Integer)offlineData.get("offlineCount");
//					
//					personCount += onlineData.get("onlinePersonCount");
//					personCount += (Integer)offlineData.get("personQuantity");
//					
//					enterCount += (Integer)offlineData.get("enterpriseQuantity");
//				}else if ("103000006".equals(serviceSort)) {
//					//投融资服务，对应八大服务的投融资服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "104000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = this.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					onlineCount += onlineData.get("onlineCount");
//					
//					serviceCount += (Integer)offlineData.get("offlineCount");
//					offlineCount += (Integer)offlineData.get("offlineCount");
//					
//					personCount += onlineData.get("onlinePersonCount");
//					personCount += (Integer)offlineData.get("personQuantity");
//					
//					enterCount += (Integer)offlineData.get("enterpriseQuantity");
//				}else if ("103000007".equals(serviceSort)) {
//					//管理咨询，对应八大服务的管理咨询服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "106000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = this.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					onlineCount += onlineData.get("onlineCount");
//					
//					serviceCount += (Integer)offlineData.get("offlineCount");
//					offlineCount += (Integer)offlineData.get("offlineCount");
//					
//					personCount += onlineData.get("onlinePersonCount");
//					personCount += (Integer)offlineData.get("personQuantity");
//					
//					enterCount += (Integer)offlineData.get("enterpriseQuantity");
//				}else if ("103000008".equals(serviceSort)) {
//					//专业服务，对应八大服务的法律服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "107000", serviceYear, serviceQuarter,auditType,true);
//					//查询线下数据
//					Map<String, Object> offlineData = this.getOfflineData(userCode, serviceSort, serviceYear, serviceQuarter,auditType);
//					serviceCount += onlineData.get("onlineCount");
//					onlineCount += onlineData.get("onlineCount");
//					
//					serviceCount += (Integer)offlineData.get("offlineCount");
//					offlineCount += (Integer)offlineData.get("offlineCount");
//					
//					personCount += onlineData.get("onlinePersonCount");
//					personCount += (Integer)offlineData.get("personQuantity");
//					
//					enterCount += (Integer)offlineData.get("enterpriseQuantity");
//				}
//			}
//		}
//		result.put("serviceCount", serviceCount);
//		result.put("onlineCount", onlineCount);
//		result.put("offlineCount", offlineCount);
//		result.put("personCount", personCount);
//		result.put("enterCount", enterCount);
		
		return result;
	}
	
	/**
	 * 数据统计页面，获取线上数据详情
	 * @param params
	 * @return
	 */
	public Map<String, Object> findOnlineDataDetail(Map<String, String> params){
		Map<String, Object> result = new HashMap<String, Object>();
//		String district = params.get("district");
//		if ("".equals(district.trim()) || "120000".equals(district.trim())) {
//			params.put("district", "");
//		}
//		List<Map<String, Object>> dataList = exemplaryMatrixBackstageDAO.findMatrixInfoByParams(params);
//		
//		Integer count1 = 0;
//		Integer count2 = 0;
//		Integer count3 = 0;
//		Integer count4 = 0;
//		Integer count5 = 0;
//		Integer count6 = 0;
//		Integer count7 = 0;
//		Integer count8 = 0;
//		
//		
//		if (null != dataList && 0!= dataList.size()) {
//			for (int i = 0; i < dataList.size(); i++) {
//				//查询每一条记录的服务次数
//				String userCode = (String)dataList.get(i).get("userCode");
//				Integer serviceYear = (Integer)dataList.get(i).get("serviceYear");
//				Integer serviceQuarter = (Integer)dataList.get(i).get("serviceQuarter");
//				String serviceSort = (String)dataList.get(i).get("serviceCode");
//				
//				//分别处理每个分类
//				if ("103000001".equals(serviceSort)) {
//					//信息服务类别，对应八大服务的信息服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "100000", serviceYear, serviceQuarter,"",true);
//					count1 += onlineData.get("onlineCount");
//				}else if ("103000002".equals(serviceSort)) {
//					//创业服务，对应八大服务的创业服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "103000", serviceYear, serviceQuarter,"",true);
//					count2 += onlineData.get("onlineCount");
//				}else if ("103000003".equals(serviceSort)) {
//					//创新支持，对应八大服务的技术创新和质量服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "102000", serviceYear, serviceQuarter,"",true);
//					count3 += onlineData.get("onlineCount");
//				}else if ("103000004".equals(serviceSort)) {
//					//人员培训，对应八大服务的人才与培训服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "101000", serviceYear, serviceQuarter,"",true);
//					count4 += onlineData.get("onlineCount");
//				}else if ("103000005".equals(serviceSort)) {
//					//市场营销，对应八大服务的市场开拓服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "105000", serviceYear, serviceQuarter,"",true);
//					count5 += onlineData.get("onlineCount");
//				}else if ("103000006".equals(serviceSort)) {
//					//投融资服务，对应八大服务的投融资服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "104000", serviceYear, serviceQuarter,"",true);
//					count6 += onlineData.get("onlineCount");
//				}else if ("103000007".equals(serviceSort)) {
//					//管理咨询，对应八大服务的管理咨询服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "106000", serviceYear, serviceQuarter,"",true);
//					count7 += onlineData.get("onlineCount");
//				}else if ("103000008".equals(serviceSort)) {
//					//专业服务，对应八大服务的法律服务
//					//查询线上数据
//					Map<String, Integer> onlineData = this.getOnlineData(userCode, "107000", serviceYear, serviceQuarter,"",true);
//					count8 += onlineData.get("onlineCount");
//				}
//			}
//		}
//		
//		List<Map<String, Object>> mapList = new ArrayList<Map<String,Object>>();
//		for (int j = 0; j < 8; j++) {
//			Map<String, Object> map = new HashMap<String, Object>();
//			if (j == 0) {
//				map.put("serviceName", "信息服务");
//				map.put("onlineCount", count1);
//			}else if (j == 1) {
//				map.put("serviceName", "创业辅导");
//				map.put("onlineCount", count2);
//			}else if (j == 2) {
//				map.put("serviceName", "创新支持");
//				map.put("onlineCount", count3);
//			}else if (j == 3) {
//				map.put("serviceName", "人员培训");
//				map.put("onlineCount", count4);
//			}else if (j == 4) {
//				map.put("serviceName", "市场营销");
//				map.put("onlineCount", count5);
//			}else if (j == 5) {
//				map.put("serviceName", "投融资服务");
//				map.put("onlineCount", count6);
//			}else if (j == 6) {
//				map.put("serviceName", "管理咨询");
//				map.put("onlineCount", count7);
//			}else if (j == 7) {
//				map.put("serviceName", "专业服务");
//				map.put("onlineCount", count8);
//			}
//			mapList.add(map);
//		}
//		result.put("dataList", mapList);
		return result;
	}
	
	/**
	 * 市级导出增加导出各个区的数据
	 * TODO
	 * @return
	 */
	public List<LinkedHashMap<String, Object>> exportQuarterStatementForCity(Map<String, String> params) {
		
		Integer matrixCount = 0;
		Double floorSpaceE = 0.0;
		Integer personnelQuantity = 0;
		Integer tutorQuantity = 0;
		Integer enterpriseCount = 0;
		Integer smeCount = 0;
		Integer personnelQuantityE = 0;
		Double totalAssets = 0.0;
		Double income = 0.0;
		Integer coopCount = 0 ;
		String coopService = "-";
		Integer serviceCount = 0;
		String service = "-";
		Integer enterCount = 0;
		Integer personCount = 0 ;
		Double incomeProportion = 0.0;
		
		
		List<LinkedHashMap<String, Object>> districtList = exemplaryMatrixBackstageDAO.findDistrictListByParamsForExport(params);
		logger.info("查询到的数据数量为："+districtList.size());
		
		if(0!= districtList.size() && null!=districtList){
			for (int i = 0; i < districtList.size(); i++) {
				params.put("district", (String)districtList.get(i).get("code"));
				Map<String, Object> data = this.getDataByDistrict(params);
				districtList.get(i).put("floorSpaceE", data.get("floorSpaceE"));
				districtList.get(i).put("personnelQuantity", data.get("personnelQuantity"));
				districtList.get(i).put("tutorQuantity", data.get("tutorQuantity"));
				districtList.get(i).put("enterpriseCount", data.get("enterpriseCount"));
				districtList.get(i).put("smeCount", data.get("smeCount"));
				districtList.get(i).put("personnelQuantityE", data.get("personnelQuantityE"));
				districtList.get(i).put("totalAssets", data.get("totalAssets"));
				districtList.get(i).put("income", data.get("income"));
				districtList.get(i).put("coopCount", data.get("coopCount"));
				districtList.get(i).put("coopService", data.get("coopService"));
				districtList.get(i).put("serviceCount", data.get("serviceCount"));
				districtList.get(i).put("service", data.get("service"));
				districtList.get(i).put("enterCount", data.get("enterCount"));
				districtList.get(i).put("personCount", data.get("personCount"));
				districtList.get(i).put("incomeProportion", data.get("incomeProportion"));
				
				districtList.get(i).remove("code");
				
				matrixCount +=(Integer)data.get("matrixCount");
				floorSpaceE += (Double)data.get("floorSpaceE");
				personnelQuantity += (Integer)data.get("personnelQuantity");
				tutorQuantity += (Integer)data.get("tutorQuantity");
				enterpriseCount += (Integer)data.get("enterpriseCount");
				smeCount += (Integer)data.get("smeCount");
				personnelQuantityE += (Integer)data.get("personnelQuantityE");
				totalAssets += (Double)data.get("totalAssets");
				income += (Double)data.get("income");
				incomeProportion += (Double)data.get("incomeProportion");
				serviceCount += (Integer)data.get("serviceCount");
				enterCount += (Integer)data.get("enterCount");
				personCount += (Integer)data.get("personCount");
				coopCount += (Integer)data.get("coopCount");
			}
		}
		
		LinkedHashMap<String, Object> allData = new LinkedHashMap<String, Object>();
		allData.put("name", "合计");
		allData.put("floorSpaceE", floorSpaceE);
		allData.put("personnelQuantity", personnelQuantity);
		allData.put("tutorQuantity", tutorQuantity);
		allData.put("enterpriseCount", enterpriseCount);
		allData.put("smeCount", smeCount);
		allData.put("personnelQuantityE", personnelQuantityE);
		allData.put("totalAssets", totalAssets);
		allData.put("income", income);
		allData.put("coopCount", coopCount);
		allData.put("coopService", coopService);
		allData.put("serviceCount", serviceCount);
		allData.put("service", service);
		allData.put("enterCount", enterCount);
		allData.put("personCount", personCount);
		allData.put("incomeProportion", "-");
		districtList.add(allData);
		
		return districtList;
	}
	
	/**
	 * 市级统计页面列表页
	 * @param params
	 * @return
	 */
	public Map<String, Object> findServiceDataStatisticsCity(Map<String, String> params){
		Map<String, Object> result = new HashMap<String, Object>();
		String district = params.get("district");
		
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixBackstageDAO.findDistrictCountByParams(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<Map<String, Object>> districtList = exemplaryMatrixBackstageDAO.findDistrictListByParams(params);
		logger.info("查询到的数据数量为："+districtList.size());
		
		if(0!= districtList.size() && null!=districtList){
			for (int i = 0; i < districtList.size(); i++) {
				params.put("district", (String)districtList.get(i).get("code"));
				Map<String, Object> data = this.getDataByDistrict(params);
				districtList.get(i).put("matrixCount", data.get("matrixCount"));
				districtList.get(i).put("floorSpaceE", data.get("floorSpaceE"));
				districtList.get(i).put("personnelQuantity", data.get("personnelQuantity"));
				districtList.get(i).put("tutorQuantity", data.get("tutorQuantity"));
				districtList.get(i).put("enterpriseCount", data.get("enterpriseCount"));
				districtList.get(i).put("smeCount", data.get("smeCount"));
				districtList.get(i).put("personnelQuantityE", data.get("personnelQuantityE"));
				districtList.get(i).put("totalAssets", data.get("totalAssets"));
				districtList.get(i).put("income", data.get("income"));
				districtList.get(i).put("coopCount", data.get("coopCount"));
				districtList.get(i).put("coopService", data.get("coopService"));
				districtList.get(i).put("serviceCount", data.get("serviceCount"));
				districtList.get(i).put("service", data.get("service"));
				districtList.get(i).put("enterCount", data.get("enterCount"));
				districtList.get(i).put("personCount", data.get("personCount"));
				districtList.get(i).put("incomeProportion", data.get("incomeProportion"));
			}
		}
		result.put("districtList", districtList);
		
		Integer matrixCount = 0;
		Double floorSpaceE = 0.0;
		Integer personnelQuantity = 0;
		Integer tutorQuantity = 0;
		Integer enterpriseCount = 0;
		Integer smeCount = 0;
		Integer personnelQuantityE = 0;
		Double totalAssets = 0.0;
		Double income = 0.0;
		Integer coopCount = 0 ;
		String coopService = "-";
		Integer serviceCount = 0;
		String service = "-";
		Integer enterCount = 0;
		Integer personCount = 0 ;
		Double incomeProportion = 0.0;
		
		params.put("startNum", "");
		params.put("pageSize", "");
		if("".equals(district)){
			params.put("district", "");
		}
		List<Map<String, Object>> districtList1 = exemplaryMatrixBackstageDAO.findDistrictListByParams(params);
		if(0!= districtList1.size() && null!=districtList1){
			for (int j = 0; j < districtList1.size(); j++) {
				params.put("district", (String)districtList1.get(j).get("code"));
				Map<String, Object> data = this.getDataByDistrict(params);
				
				matrixCount +=(Integer)data.get("matrixCount");
				floorSpaceE += (Double)data.get("floorSpaceE");
				personnelQuantity += (Integer)data.get("personnelQuantity");
				tutorQuantity += (Integer)data.get("tutorQuantity");
				enterpriseCount += (Integer)data.get("enterpriseCount");
				smeCount += (Integer)data.get("smeCount");
				personnelQuantityE += (Integer)data.get("personnelQuantityE");
				totalAssets += (Double)data.get("totalAssets");
				income += (Double)data.get("income");
				incomeProportion += (Double)data.get("incomeProportion");
				serviceCount += (Integer)data.get("serviceCount");
				enterCount += (Integer)data.get("enterCount");
				personCount += (Integer)data.get("personCount");
				coopCount += (Integer)data.get("coopCount");
			}
		}
		
		result.put("matrixCount", matrixCount);
		result.put("floorSpaceE", floorSpaceE);
		result.put("personnelQuantity", personnelQuantity);
		result.put("tutorQuantity", tutorQuantity);
		result.put("enterpriseCount", enterpriseCount);
		result.put("smeCount", smeCount);
		result.put("personnelQuantityE", personnelQuantityE);
		result.put("totalAssets", totalAssets);
		result.put("income", income);
		result.put("coopCount", coopCount);
		result.put("coopService", coopService);
		result.put("serviceCount", serviceCount);
		result.put("service", service);
		result.put("enterCount", enterCount);
		result.put("personCount", personCount);
		result.put("incomeProportion", incomeProportion);
		
		
		return result;
	}
	
	public Map<String, Object> findOnlineDataList(Map<String, String> params){
		Map<String, Object> result = new HashMap<String, Object>();
		
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixBackstageDAO.findOnlineDataListCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<ExemplaryMatrixOnlineData> exemplaryMatrixOnlineDatas = exemplaryMatrixBackstageDAO.findOnlineDataList(params);
		logger.info("查询到结果条数为："+exemplaryMatrixOnlineDatas.size());
		result.put("exemplaryMatrixOnlineDatas", exemplaryMatrixOnlineDatas);
		
		return result;
	}
	
	public Map<String, Object> findOfflineDataList(Map<String, String> params){
		Map<String, Object> result = new HashMap<String, Object>();
		
		//查询创业服务新闻总数
		Map<String, Object> countMap = exemplaryMatrixBackstageDAO.findOfflineDataListCount(params);
		//插入返回参数
		result.put("count", countMap.get("count"));
		
		int startIndex = Integer.parseInt(params.get("currentPage"));
		int pageSize = Integer.parseInt(params.get("pageSize"));
		Long countLong = Long.parseLong(String.valueOf(countMap.get("count")));
		PageBean pageBean = new PageBean(countLong, pageSize, startIndex);
		
		params.put("startNum", String.valueOf(pageBean.getStart()));
		params.put("pageSize", String.valueOf(pageSize));
		List<ExemplaryMatrixServiceData> exemplaryMatrixServiceDatas = exemplaryMatrixBackstageDAO.findOfflineDataList(params);
		logger.info("查询到结果条数为："+exemplaryMatrixServiceDatas.size());
		result.put("exemplaryMatrixServiceDatas", exemplaryMatrixServiceDatas);
		
		return result;
	}
	
	public Integer deleteServiceDataById(Map<String, String> params){
		//查询是不是还剩最后一条
		Map<String, String> getNumParams = new HashMap<String, String>();
		getNumParams.put("userCode", params.get("deleteUserCode"));
		getNumParams.put("serviceYear", params.get("deleteYear"));
		getNumParams.put("serviceQuarter", params.get("deleteQuarter"));
		List<ExemplaryMatrixServiceData> exemplaryMatrixServiceDatas = exemplaryMatrixBackstageDAO.findExemplaryMatrixServiceDataByParams(getNumParams);
		logger.info("查询得到的数量为："+exemplaryMatrixServiceDatas.size());
		if (null!=exemplaryMatrixServiceDatas && exemplaryMatrixServiceDatas.size()==1) {
			ExemplaryMatrixServiceData exemplaryMatrixServiceData = new ExemplaryMatrixServiceData();
			exemplaryMatrixServiceData.setUserCode(exemplaryMatrixServiceDatas.get(0).getUserCode());
			exemplaryMatrixServiceData.setServiceYear(exemplaryMatrixServiceDatas.get(0).getServiceYear());
			exemplaryMatrixServiceData.setServiceQuarter(exemplaryMatrixServiceDatas.get(0).getServiceQuarter());
			exemplaryMatrixServiceData.setSubmitType(exemplaryMatrixServiceDatas.get(0).getSubmitType());
			exemplaryMatrixServiceData.setAuditType(exemplaryMatrixServiceDatas.get(0).getAuditType());
			exemplaryMatrixServiceData.setRecommendations(exemplaryMatrixServiceDatas.get(0).getRecommendations());
			exemplaryMatrixBackstageDAO.saveExemplaryMatrixServiceData(exemplaryMatrixServiceData);
		}
		
		Integer result = 0;
		result += exemplaryMatrixBackstageDAO.deleteServiceDataById(params);
		result += exemplaryMatrixBackstageDAO.deleteOnlineDataById(params);
		return result;
	}
	
	public ExemplaryMatrixOnlineData findOnlineDataById(Map<String, String> params){
		return exemplaryMatrixBackstageDAO.findOnlineDataById(params);
	}
	
	/**
	 * 保存或更新报表填写状态
	 * @param exemplaryMatrixStatementStatus
	 * @return
	 */
	public Integer insertOrUpdateStatementStatus(ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus){
		Integer result = 0;
		ExemplaryMatrixStatementStatus exemplaryMatrixStatementStatus2 = exemplaryMatrixBackstageDAO.getStatementStatusByParams(exemplaryMatrixStatementStatus);
		logger.info("查询到的报表状态结果为："+exemplaryMatrixStatementStatus2);
		if (exemplaryMatrixStatementStatus2 == null) {
			logger.info("执行插入报表状态方法");
			result += exemplaryMatrixBackstageDAO.insertStatementStatus(exemplaryMatrixStatementStatus);
		}else {
			logger.info("执行更新报表状态方法");
			result += exemplaryMatrixBackstageDAO.updateStatementStatus(exemplaryMatrixStatementStatus);
		}
		
		return result;
	}
}
