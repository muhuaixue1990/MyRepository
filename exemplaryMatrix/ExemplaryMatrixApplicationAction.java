package com.zl.action;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;

import net.sf.jxls.transformer.Workbook;

import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.sun.org.apache.xml.internal.serializer.ElemDesc;
import com.zl.bean.BusinessCircumstance;
import com.zl.bean.CooperationFacilitatingAgency;
import com.zl.bean.EnterpriseEvaluate;
import com.zl.bean.EnterpriseInfo;
import com.zl.bean.ExemplaryMatrix;
import com.zl.bean.ExemplaryMatrixApplication;
import com.zl.bean.ExemplaryMatrixRecommend;
import com.zl.bean.ExemplaryMatrixRecommendEvaluate;
import com.zl.bean.MonthlyServiceData;
import com.zl.bean.PersonnelList;
import com.zl.bean.QuarterStatement;
import com.zl.bean.ServiceFunction;
import com.zl.service.EnterpriseInfoService;
import com.zl.service.ExemplaryMatrixApplicationService;
import com.zl.utils.ExcelExp;
import com.zl.utils.LoadPropperties;
import com.zl.utils.PrintLine;
import com.zl.utils.XssExcelExp;

/**
 * 示范基地认证Action
 * @author Administrator
 *
 */
@Controller
@Scope("prototype")
public class ExemplaryMatrixApplicationAction extends BaseAction{

	/**
	 * 序列化编号
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * 前台传到后台的参数
	 */
	private Map<String, String> params;
	
	/**
	 * 前台传入季度报表对象
	 */
	private QuarterStatement quarterStatement;
	
	/**
	 * 前台传入申请表对象
	 */
	private ExemplaryMatrixApplication exemplaryMatrixApplication;
	
	/**
	 * 前台传入推荐主表信息
	 */
	private ExemplaryMatrixRecommend exemplaryMatrixRecommend;
	
	/**
	 * 前台传入推荐附表信息
	 */
	private ExemplaryMatrixRecommendEvaluate exemplaryMatrixRecommendEvaluate;
	
	/**
	 * 前台传入月度服务信息
	 */
	private MonthlyServiceData monthlyServiceData;
	
	/**
	 * 前台传入的人员列表
	 */
	private PersonnelList personnelList;
	
	/**
	 * 上传文件
	 */
	private File file;
	
	/**
	 * 上传文件名
	 */
	private String fileFileName;
    private String fileFileContentType;
	
    /**
   	 * 用于返回上传图片消息
   	 */
   	private InputStream returnMsg;
    
	/**
	 * 示范基地申请service
	 */
	private ExemplaryMatrixApplicationService exemplaryMatrixApplicationService;
	
	/**
	 * 企业基本信息Service
	 */
	private EnterpriseInfoService enterpriseInfoService;
	
	@Resource
	public void setEnterpriseInfoService(EnterpriseInfoService enterpriseInfoService) {
		this.enterpriseInfoService = enterpriseInfoService;
	}

	@Resource
	public void setExemplaryMatrixApplicationService(
			ExemplaryMatrixApplicationService exemplaryMatrixApplicationService) {
		this.exemplaryMatrixApplicationService = exemplaryMatrixApplicationService;
	}

	public Map<String, String> getParams() {
		return params;
	}

	public void setParams(Map<String, String> params) {
		this.params = params;
	}
	
	public QuarterStatement getQuarterStatement() {
		return quarterStatement;
	}

	public void setQuarterStatement(QuarterStatement quarterStatement) {
		this.quarterStatement = quarterStatement;
	}

	public ExemplaryMatrixApplication getExemplaryMatrixApplication() {
		return exemplaryMatrixApplication;
	}

	public void setExemplaryMatrixApplication(
			ExemplaryMatrixApplication exemplaryMatrixApplication) {
		this.exemplaryMatrixApplication = exemplaryMatrixApplication;
	}

	public ExemplaryMatrixRecommend getExemplaryMatrixRecommend() {
		return exemplaryMatrixRecommend;
	}

	public void setExemplaryMatrixRecommend(
			ExemplaryMatrixRecommend exemplaryMatrixRecommend) {
		this.exemplaryMatrixRecommend = exemplaryMatrixRecommend;
	}
	
	public ExemplaryMatrixRecommendEvaluate getExemplaryMatrixRecommendEvaluate() {
		return exemplaryMatrixRecommendEvaluate;
	}

	public void setExemplaryMatrixRecommendEvaluate(
			ExemplaryMatrixRecommendEvaluate exemplaryMatrixRecommendEvaluate) {
		this.exemplaryMatrixRecommendEvaluate = exemplaryMatrixRecommendEvaluate;
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

	public String getFileFileName() {
		return fileFileName;
	}

	public void setFileFileName(String fileFileName) {
		this.fileFileName = fileFileName;
	}

	public String getFileFileContentType() {
		return fileFileContentType;
	}

	public void setFileFileContentType(String fileFileContentType) {
		this.fileFileContentType = fileFileContentType;
	}
	
	public MonthlyServiceData getMonthlyServiceData() {
		return monthlyServiceData;
	}

	public void setMonthlyServiceData(MonthlyServiceData monthlyServiceData) {
		this.monthlyServiceData = monthlyServiceData;
	}

	public InputStream getReturnMsg() {
		return returnMsg;
	}

	public void setReturnMsg(InputStream returnMsg) {
		this.returnMsg = returnMsg;
	}
	
	public PersonnelList getPersonnelList() {
		return personnelList;
	}

	public void setPersonnelList(PersonnelList personnelList) {
		this.personnelList = personnelList;
	}

	/**
	 * 是否能导出示范基地申请表方法
	 */
	public String isExportExemplaryMatrixApplicationExcel(){
		
		//根据参数查询示范基地申请表基本信息
		String userCode = this.getRequest().getParameter("userCode");
		logger.info("需要导出的userCode为："+userCode);
		
		Map<String, String> findApplicationParam = new HashMap<String, String>();
		findApplicationParam.put("userCode", userCode);
		
		Map<String, Object> applicationInfo = exemplaryMatrixApplicationService.getMatrixInfoMapByCode(findApplicationParam);
		Map<String, String> applicationInfoForExport = this.mapUtil(applicationInfo);
		
		//根据参数查询企业基本信息
		Map<Object, Object> enterpriseInfoMap = enterpriseInfoService.selectEnterpriseInfoByUserCode(userCode);
		EnterpriseInfo enterpriseInfo = (EnterpriseInfo)enterpriseInfoMap.get("Object");
		//导入企业基本信息
		applicationInfoForExport = this.setEnterpriseInfo(applicationInfoForExport,enterpriseInfo);
		
		logger.info("导出的基本信息为："+applicationInfoForExport);
		
		//获取需要导出的申请表id
		String applicationId = applicationInfoForExport.get("id");
		logger.info("需要导出的申请表的id为："+applicationId);
		
		
		//获取经营情况参数
		Map<String, String> getDataParams = new HashMap<String, String>();
		getDataParams.put("userCode", userCode);
		getDataParams.put("exemplaryMatrixApplicationId", applicationId);
		
		List<LinkedHashMap<String, Object>> businessCircumstanceList = exemplaryMatrixApplicationService.getBusinessCircumstanceMapByParams(getDataParams);
		logger.info("查询经营情况总数为："+businessCircumstanceList.size());
		List<LinkedHashMap<String, Object>>  cooperationFacilitatingAgencyMapList = exemplaryMatrixApplicationService.getCooperationFacilitatingAgencyMapByParams(getDataParams);
		logger.info("查询合作服务机构总数为："+cooperationFacilitatingAgencyMapList.size());
		List<LinkedHashMap<String, Object>> serviceFunctionMapList = exemplaryMatrixApplicationService.getServiceFunctionMapByParams(getDataParams);
		logger.info("查询服务功能总数为："+serviceFunctionMapList.size());
		List<LinkedHashMap<String, Object>> personnelListMapList = exemplaryMatrixApplicationService.getPersonnelListMapByParams(getDataParams);
		logger.info("查询到人员信息总数为："+personnelListMapList.size());
		if(personnelListMapList.size()>=10){
			this.jsonMap.put("status", "1");
		}
		return SUCCESS;
	}
	
	/**
	 * 导出示范基地申请表方法
	 */
	public void exportExemplaryMatrixApplicationExcel(){
		logger.info("进入导出示范基地申请表方法："+PrintLine.getInfo());
		try {
			String path = this.getClass().getClassLoader().getResource("").getPath();
	        path = path.substring(0, path.lastIndexOf("classes"));
	        path = path + File.separator + "excelTemplet";
	        String srcPath = path + File.separator + "exemplaryMatrixApplication.xlsx";
			//获取模板路径
			logger.info("模板路径为："+srcPath);
			
			//根据参数查询示范基地申请表基本信息
			String userCode = this.getRequest().getParameter("userCode");
			logger.info("需要导出的userCode为："+userCode);
			
			Map<String, String> findApplicationParam = new HashMap<String, String>();
			findApplicationParam.put("userCode", userCode);
			
			Map<String, Object> applicationInfo = exemplaryMatrixApplicationService.getMatrixInfoMapByCode(findApplicationParam);
			Map<String, String> applicationInfoForExport = this.mapUtil(applicationInfo);
			
			//根据参数查询企业基本信息
			Map<Object, Object> enterpriseInfoMap = enterpriseInfoService.selectEnterpriseInfoByUserCode(userCode);
			EnterpriseInfo enterpriseInfo = (EnterpriseInfo)enterpriseInfoMap.get("Object");
			//导入企业基本信息
			applicationInfoForExport = this.setEnterpriseInfo(applicationInfoForExport,enterpriseInfo);
			
			logger.info("导出的基本信息为："+applicationInfoForExport);
			
			//获取需要导出的申请表id
			String applicationId = applicationInfoForExport.get("id");
			logger.info("需要导出的申请表的id为："+applicationId);
			
			//传递模板地址和要操作的页签（处理第三页）
			ExcelExp applicationInfoExp = new XssExcelExp(srcPath, 2);
			//塞入基本信息
			applicationInfoExp.replaceExcelData(applicationInfoForExport);
			
			//获取经营情况参数
			Map<String, String> getDataParams = new HashMap<String, String>();
			getDataParams.put("userCode", userCode);
			getDataParams.put("exemplaryMatrixApplicationId", applicationId);
			
			List<LinkedHashMap<String, Object>> businessCircumstanceList = exemplaryMatrixApplicationService.getBusinessCircumstanceMapByParams(getDataParams);
			logger.info("查询经营情况总数为："+businessCircumstanceList.size());
			
			//从第16行开始，增加列表总数的行数
			applicationInfoExp.insertRows(16, businessCircumstanceList.size());
			wirteXssExcel(applicationInfoExp,16,2,businessCircumstanceList);
			
			//合并单元格(20180321新增)
			XSSFSheet sheet = applicationInfoExp.getXssSheet();
			sheet.addMergedRegion(new CellRangeAddress(15,15+businessCircumstanceList.size(),1,1));
			sheet.addMergedRegion(new CellRangeAddress(13,17+businessCircumstanceList.size(),0,0));
			
			//开始处理第四页
			applicationInfoExp.doSheet(3);
			//塞入基本信息
			applicationInfoExp.replaceExcelData(applicationInfoForExport);
			
			List<LinkedHashMap<String, Object>>  cooperationFacilitatingAgencyMapList = exemplaryMatrixApplicationService.getCooperationFacilitatingAgencyMapByParams(getDataParams);
			logger.info("查询合作服务机构总数为："+cooperationFacilitatingAgencyMapList.size());
			
			//从第1行开始，增加列表总数的行数
			applicationInfoExp.insertRows(1, cooperationFacilitatingAgencyMapList.size());
			wirteXssExcel(applicationInfoExp,1,1,cooperationFacilitatingAgencyMapList);
			
			List<LinkedHashMap<String, Object>> serviceFunctionMapList = exemplaryMatrixApplicationService.getServiceFunctionMapByParams(getDataParams);
			logger.info("查询服务功能总数为："+serviceFunctionMapList.size());
			
			applicationInfoExp.insertRows((1+cooperationFacilitatingAgencyMapList.size()+1), serviceFunctionMapList.size());
			wirteXssExcel(applicationInfoExp,(1+cooperationFacilitatingAgencyMapList.size()+1),1,serviceFunctionMapList);
			
			
			//合并单元格(20180321新增)
			XSSFSheet sheet1 = applicationInfoExp.getXssSheet();
			sheet1.addMergedRegion(new CellRangeAddress(0,0+cooperationFacilitatingAgencyMapList.size(),0,0));
			sheet1.addMergedRegion(new CellRangeAddress(1+cooperationFacilitatingAgencyMapList.size(),9+cooperationFacilitatingAgencyMapList.size()+serviceFunctionMapList.size(),0,0));
			
			
			//开始处理第五页
			applicationInfoExp.doSheet(4);
			//塞入基本信息
			applicationInfoExp.replaceExcelData(applicationInfoForExport);
			
			//开始处理第六页
			applicationInfoExp.doSheet(5);
			
			List<LinkedHashMap<String, Object>> personnelListMapList = exemplaryMatrixApplicationService.getPersonnelListMapByParams(getDataParams);
			logger.info("查询到人员信息总数为："+personnelListMapList.size());
			
			applicationInfoExp.insertRows(3, personnelListMapList.size());
			wirteXssExcel(applicationInfoExp,3,0,personnelListMapList);
			
			
			//开始处理第七页
//			applicationInfoExp.doSheet(6);
//			
//			List<LinkedHashMap<String, Object>> enterpriseEvaluateMapList = exemplaryMatrixApplicationService.getEnterpriseEvaluateMapByParams(getDataParams);
//			logger.info("查询得到的入驻企业评价总数为："+enterpriseEvaluateMapList.size());
//			
//			applicationInfoExp.insertRows(4, enterpriseEvaluateMapList.size());
//			wirteXssExcelForEvaluate(applicationInfoExp,4,0,enterpriseEvaluateMapList);
			
			//导出，此处只封装了浏览器下载方式
			//调用downloadExcel，返回输出流给客户端
			String fileName = "export1.xlsx";
			
			logger.info("执行到此，准备下载");
			applicationInfoExp.downloadExcel(this.getRequest(),getResponse(), fileName);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 将企业基本信息导入到示范基地基本信息map中
	 * @param map
	 * @param enterpriseInfo
	 * @return
	 */
	private Map<String, String> setEnterpriseInfo(Map<String, String> map,EnterpriseInfo enterpriseInfo){
		map.put("companyName", enterpriseInfo.getCompanyName());
		map.put("registeredCapital", String.valueOf(enterpriseInfo.getRegisteredCapital()));
		map.put("legalRepresentative", enterpriseInfo.getLegalRepresentative());
		map.put("website", enterpriseInfo.getWebsite());
		return map;
	}
	
	/**
	 * 转换map格式
	 * @param map
	 * @return
	 */
	private Map<String, String> mapUtil(Map<String, Object> map){
		Map<String, String> resultMap = new HashMap<String, String>();
		for (String key : map.keySet()) {
			resultMap.put(key, String.valueOf(map.get(key)));
		}
		return resultMap;
	}
	
	/**
	 * 为新增的格插入值方法
	 * @param excel
	 */
	private void wirteXssExcel(ExcelExp excel,
								Integer startRow, 
								Integer startColumn,
								List<LinkedHashMap<String, Object>> data){
		XSSFSheet sheet = excel.getXssSheet();
		
		XSSFCellStyle xssfCellStyle = excel.getXssWb().createCellStyle();
		xssfCellStyle.setBorderBottom(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setBorderTop(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setBorderRight(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setBorderLeft(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setAlignment(XSSFCellStyle.ALIGN_CENTER);
		
		for (int i = 0; i < data.size(); i++) {
			XSSFRow row = sheet.createRow(i+startRow);
			int j = 0;
			Iterator<String> it = data.get(i).keySet().iterator();
			while (it.hasNext()) {
				row.createCell(startColumn+j).setCellValue(String.valueOf(data.get(i).get(it.next())));
				row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
				j++;
			}
		}
	}
	
	/**
	 * 为新增的格插入值方法(入驻企业评价表)
	 * @param excel
	 */
	private void wirteXssExcelForEvaluate(ExcelExp excel,
								Integer startRow, 
								Integer startColumn,
								List<LinkedHashMap<String, Object>> data){
		XSSFSheet sheet = excel.getXssSheet();
		
		XSSFCellStyle xssfCellStyle = excel.getXssWb().createCellStyle();
		xssfCellStyle.setBorderBottom(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setBorderTop(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setBorderRight(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setBorderLeft(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setAlignment(XSSFCellStyle.ALIGN_CENTER);
		
		for (int i = 0; i < data.size(); i++) {
			XSSFRow row = sheet.createRow(i+startRow);
			
			int j = 0;
			Iterator<String> it = data.get(i).keySet().iterator();
			while (it.hasNext()) {
				String key = it.next();
				if ("evaluate".equals(key)) {
					String evaluate = String.valueOf(data.get(i).get(key));
					if ("2".equals(evaluate)) {
						row.createCell(startColumn+j).setCellValue("√");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					}else if ("1".equals(evaluate)) {
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					
						j++;
						row.createCell(startColumn+j).setCellValue("√");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					}else if ("0".equals(evaluate)) {
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("√");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					}
				}else {
					row.createCell(startColumn+j).setCellValue(String.valueOf(data.get(i).get(key)));
					row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
				}
				j++;
			}
		}
	}
	
	
	
	/**
	 * 导出示范基地区级推荐表方法
	 */
	public void exportExemplaryMatrixRecommend(){
		logger.info("进入导出示范基地区级推荐表方法："+PrintLine.getInfo());
		try {
			String path = this.getClass().getClassLoader().getResource("").getPath();
	        path = path.substring(0, path.lastIndexOf("classes"));
	        path = path + File.separator + "excelTemplet";
	        String srcPath = path + File.separator + "exemplaryMatrixRecommend.xlsx";
			//获取模板路径
			logger.info("模板路径为："+srcPath);
			
			//根据参数查询示范基地申请表基本信息
			String userCode = this.getRequest().getParameter("applicationUserCode");
			logger.info("需要导出的userCode为："+userCode);
			
			//获取需要导出的基地申请表id
			String exemplaryMatrixApplicationId = this.getRequest().getParameter("applicationId");
			logger.info("需要导出的申请表的id为："+exemplaryMatrixApplicationId);
			
			//创建查询参数
			Map<String, String> getResultParam = new HashMap<String, String>();
			getResultParam.put("userCode", userCode);
			getResultParam.put("exemplaryMatrixApplicationId", exemplaryMatrixApplicationId);
			
			//获取推荐主表信息
			Map<String, Object> exemplaryMatrixRecommend = exemplaryMatrixApplicationService.getExemplaryMatrixRecommendMapByParams(getResultParam);
			
			//转化推荐主表
			Map<String, String> exemplaryMatrixRecommendMap = this.mapUtil(exemplaryMatrixRecommend);
			
			String evaluativeMethods = exemplaryMatrixRecommendMap.get("evaluativeMethods");
			evaluativeMethods = evaluativeMethods.replaceAll("0", "上门拜访");
			evaluativeMethods = evaluativeMethods.replaceAll("1", "电话询问");
			evaluativeMethods = evaluativeMethods.replaceAll("2", "网络互动");
			evaluativeMethods = evaluativeMethods.replaceAll("3", "书面征求");
			evaluativeMethods = evaluativeMethods.replaceAll("4", "其他");
			evaluativeMethods = evaluativeMethods.substring(0, evaluativeMethods.length()-1);
			
			exemplaryMatrixRecommendMap.put("evaluativeMethods", evaluativeMethods);
			
			//传递模板地址和要操作的页签（处理第二页）
			ExcelExp applicationInfoExp = new XssExcelExp(srcPath, 1);
			//塞入基本信息
			applicationInfoExp.replaceExcelData(exemplaryMatrixRecommendMap);
			
			List<LinkedHashMap<String, Object>> exemplaryMatrixRecommendEvaluateMapList = exemplaryMatrixApplicationService.getExemplaryMatrixRecommendEvaluateMapList(getResultParam);
			logger.info("查询推荐附表条数为："+exemplaryMatrixRecommendEvaluateMapList.size());
			
			//从第11行开始，增加列表总数的行数
			applicationInfoExp.insertRows(11, exemplaryMatrixRecommendEvaluateMapList.size());
			wirteXssExcelForRecommendEvaluate(applicationInfoExp,11,0,exemplaryMatrixRecommendEvaluateMapList);
			
			//导出，此处只封装了浏览器下载方式
			//调用downloadExcel，返回输出流给客户端
			String fileName = "export1.xlsx";
			logger.info("执行到此，准备下载");
			applicationInfoExp.downloadExcel(this.getRequest(),getResponse(), fileName);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 为新增的格插入值方法(区级推荐附表)
	 * @param excel
	 */
	private void wirteXssExcelForRecommendEvaluate(ExcelExp excel,
								Integer startRow, 
								Integer startColumn,
								List<LinkedHashMap<String, Object>> data){
		XSSFSheet sheet = excel.getXssSheet();
		
		XSSFCellStyle xssfCellStyle = excel.getXssWb().createCellStyle();
		xssfCellStyle.setBorderBottom(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setBorderTop(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setBorderRight(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setBorderLeft(XSSFCellStyle.BORDER_THIN);
		xssfCellStyle.setAlignment(XSSFCellStyle.ALIGN_CENTER);
		
		for (int i = 0; i < data.size(); i++) {
			XSSFRow row = sheet.createRow(i+startRow);
			
			int j = 0;
			Iterator<String> it = data.get(i).keySet().iterator();
			while (it.hasNext()) {
				String key = it.next();
				if ("accord".equals(key)) {
					String accord = String.valueOf(data.get(i).get(key));
					if ("2".equals(accord)) {
						row.createCell(startColumn+j).setCellValue("√");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					}else if ("1".equals(accord)) {
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					
						j++;
						row.createCell(startColumn+j).setCellValue("√");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					}else if ("0".equals(accord)) {
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("√");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					}
				}else if ("evaluate".equals(key)) {
					String evaluate = String.valueOf(data.get(i).get(key));
					if ("2".equals(evaluate)) {
						row.createCell(startColumn+j).setCellValue("√");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					}else if ("1".equals(evaluate)) {
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					
						j++;
						row.createCell(startColumn+j).setCellValue("√");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					}else if ("0".equals(evaluate)) {
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
						
						j++;
						row.createCell(startColumn+j).setCellValue("√");
						row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
					}
				}else {
					row.createCell(startColumn+j).setCellValue(String.valueOf(data.get(i).get(key)));
					row.getCell(startColumn+j).setCellStyle(xssfCellStyle);
				}
				j++;
			}
		}
	}
	
	
	
	/**
	 * 获取当前时间方法
	 * @return
	 */
	public String getNowTime(){
		logger.info("进入获取当前时间方法："+PrintLine.getInfo());
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String nowTime = simpleDateFormat.format(new Date());
		logger.info("当前系统时间为："+nowTime);
		jsonMap.put("nowTime", nowTime);
		return SUCCESS;
	}

	/**
	 * 通过UserCode获取申请结果
	 * @return
	 */
	public String getResultForApplicationByUserCode(){
		logger.info("进入通过UserCode获取申请结果方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		ExemplaryMatrixApplication exemplaryMatrixApplication = exemplaryMatrixApplicationService.getResultForApplicationByUserCode(params);
		if (null != exemplaryMatrixApplication) {
			jsonMap.put("status", 1);
			jsonMap.put("exemplaryMatrixApplication", exemplaryMatrixApplication);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 获取月度服务数据列表
	 * @return
	 */
	public String getServiceDataList(){
		logger.info("进入获取月度服务数据列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getServiceDataList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("serviceDataList", result.get("serviceDataList"));
		
		return SUCCESS;
	}
	
	/**
	 * 获取月度服务能力升级情况列表
	 * @return
	 */
	public String getOfficeEquipmentList(){
		logger.info("进入获取月度服务能力升级情况列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getOfficeEquipmentList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("officeEquipmentList", result.get("officeEquipmentList"));
		
		return SUCCESS;
	}
	
	/**
	 * 20170630 获取月度报表列表
	 * @return
	 */
	public String getMonthlyStatementList(){
		logger.info("进入获取月度报表列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getMonthlyStatementList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("monthlyStatementList", result.get("monthlyStatementList"));
		
		return SUCCESS;
	}
	
	/**
	 * 获取季度报表列表
	 * @return
	 */
	public String getQuarterStatementList(){
		logger.info("进入获取季度报表列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getQuarterStatementList(params);
		jsonMap.put("quarterStatementList", result.get("quarterStatementList"));
		
		return SUCCESS;
	}
	
	/**
	 * 新增、修改季度报表
	 * @return
	 */
	public String addQuarterStatement(){
		logger.info("进入新增季度报表方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.saveQuarterStatement(quarterStatement);
		logger.info("插入结果为："+result);
		if (result>0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 查看报表列表时获取基地列表
	 * @return
	 */
	public String getMatrixListForStatementList(){
		logger.info("进入获取基地列表方法："+PrintLine.getInfo());
		logger.info("查询参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.findMatrixListForStatementList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("exemplaryMatrixApplicationList", result.get("exemplaryMatrixApplicationList"));
		
		return SUCCESS;
	}
	
	/**
	 * 查看月报查询服务数据列表
	 * @return
	 */
	public String getServiceDataListByCode(){
		logger.info("进入查看月报查询服务数据列表方法："+PrintLine.getInfo());
		logger.info("查询参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getServiceDataListByCode(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("monthlyServiceDatas", result.get("monthlyServiceDatas"));
		
		return SUCCESS;
	}
	
	/**
	 * 查看月报查询办公设备升级
	 * @return
	 */
	public String getOfficeEquipmentListByCode(){
		logger.info("进入查看月报查询办公设备升级方法："+PrintLine.getInfo());
		logger.info("查询参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getOfficeEquipmentListByCode(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("monthlyOfficeEquipments", result.get("monthlyOfficeEquipments"));
		
		return SUCCESS;
	}
	
	/**
	 * 查看月报查询装修改造升级 
	 * @return
	 */
	public String getDecorationListByCode(){
		logger.info("进入查看月报查询装修改造升级 方法："+PrintLine.getInfo());
		logger.info("查询参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getDecorationListByCode(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("monthlyDecorations", result.get("monthlyDecorations"));
		
		return SUCCESS;
	}

	/**
	 * 通过code获取基地信息
	 * 20170630增加条件，申报年份为当前年份
	 * 2018去掉申报年份条件
	 * @return
	 */
	public String getMatrixInfoByCode(){
		logger.info("进入通过code获取基地信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		ExemplaryMatrixApplication exemplaryMatrixApplication = exemplaryMatrixApplicationService.getMatrixInfoByCode(params);
		if (null == exemplaryMatrixApplication) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("exemplaryMatrixApplication", exemplaryMatrixApplication);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 查看季度报表，入驻企业信息
	 * @return
	 */
	public String getEnterpriseList(){
		logger.info("进入查看季度报表，入驻企业信息方法："+PrintLine.getInfo());
		logger.info("查询参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getDecorationListByCode(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("monthlyDecorations", result.get("monthlyDecorations"));
		
		return SUCCESS;
	}
	
	/**
	 * 通过参数查询季度报表 
	 * @return
	 */
	public String findStatementByParam(){
		logger.info("进入通过年份和季度查询季度报表 方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		QuarterStatement quarterStatement = exemplaryMatrixApplicationService.findStatementByParam(params);
		if (null == quarterStatement) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("quarterStatement", quarterStatement);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 保存或更新申请表
	 * @return
	 */
	public String saveOrUpdateApplication(){
		logger.info("进入保存或更新申请表方法："+PrintLine.getInfo());
		
		Map<String, Integer> result = exemplaryMatrixApplicationService.saveOrUpdateApplication(exemplaryMatrixApplication);
		Integer saveOrUpdateResult= result.get("saveOrUpdateResult");
		Integer id = result.get("id");
		
		logger.info("保存/更新结果为："+result);
		if (saveOrUpdateResult>0) {
			jsonMap.put("status", 1);
			jsonMap.put("id", id);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 保存经营情况方法
	 * @return
	 */
	public String saveBusinessCircumstance(){
		logger.info("进入保存经营情况方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.saveBusinessCircumstance(getRequest());
		logger.info("插入数量为："+result);
		if (result>0) {
			jsonMap.put("status",1);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 根据userCode和applicationId获取经营情况列表
	 * @return
	 */
	public String getBusinessCircumstanceByParams(){
		logger.info("进入根据userCode和applicationId获取经营情况列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<BusinessCircumstance> businessCircumstances = exemplaryMatrixApplicationService.getBusinessCircumstanceByParams(params);
		if (0==businessCircumstances.size() || null == businessCircumstances) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("businessCircumstances", businessCircumstances);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 新增合作服务机构信息 
	 * @return
	 */
	public String saveCooperationFacilitatingAgency(){
		logger.info("进入新增合作服务机构信息方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.saveCooperationFacilitatingAgency(getRequest());
		logger.info("插入数量为："+result);
		if (result>0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 通过userCode和applicationId获取合作服务机构信息
	 * @return
	 */
	public String getCooperationFacilitatingAgencyByParams(){
		logger.info("进入通过userCode和applicationId获取合作服务机构信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<CooperationFacilitatingAgency> cooperationFacilitatingAgencies = exemplaryMatrixApplicationService.getCooperationFacilitatingAgencyByParams(params);
		if (0==cooperationFacilitatingAgencies.size() || null == cooperationFacilitatingAgencies) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("cooperationFacilitatingAgencies", cooperationFacilitatingAgencies);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 新增服务功能信息
	 * @return
	 */
	public String saveServiceFunction(){
		logger.info("进入新增合作服务机构信息方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.saveServiceFunction(getRequest());
		logger.info("插入数量为："+result);
		if (result>0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 通过userCode和applicationId获取服务功能信息
	 */
	public String getServiceFunctionByParams(){
		logger.info("进入通过userCode和applicationId获取服务功能信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<ServiceFunction> serviceFunctions = exemplaryMatrixApplicationService.getServiceFunctionByParams(params);
		if (0==serviceFunctions.size() || null == serviceFunctions) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("serviceFunctions", serviceFunctions);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 保存管理和服务人员名单及职称情况信息
	 * @return
	 */
	public String savePersonnelList(){
		logger.info("进入保存管理和服务人员名单及职称情况信息方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.savePersonnelList(personnelList);
		logger.info("插入数量为："+result);
		if (result>0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 通过id获取管理和服务人员名单及职称情况信息
	 * @return
	 */
	public String getPersonnelListById(){
		logger.info("进入通过id获取管理和服务人员名单及职称情况信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		PersonnelList personnelList = exemplaryMatrixApplicationService.getPersonnelListById(params);
		if (personnelList == null) {
			jsonMap.put("status", 0);
		}else{
			jsonMap.put("status", 1);
			jsonMap.put("personnelList", personnelList);
		}
		return SUCCESS;
	}
	
	/**
	 * 通过id删除管理和服务人员名单及职称情况信息
	 * @return
	 */
	public String deletePersonnelListById(){
		logger.info("进入通过id删除管理和服务人员名单及职称情况信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Integer result = exemplaryMatrixApplicationService.deletePersonnelListById(params);
		if (result >0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 通过userCode和applicationId获取管理和服务人员名单及职称情况信息
	 * TODO
	 */
	public String getPersonnelListByParams(){
		logger.info("进入通过userCode和applicationId获取管理和服务人员名单及职称情况信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getPersonnelListByParams(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("personnelList", result.get("personnelList"));
		return SUCCESS;
	}
	
	/**
	 * 通过userCode和applicationId获取管理和服务人员名单及职称情况信息(不分页)
	 * @return
	 */
	public String getPersonnelListByParamsNoPage(){
		logger.info("进入通过userCode和applicationId获取管理和服务人员名单及职称情况信息(不分页)方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<PersonnelList> personnelLists = exemplaryMatrixApplicationService.getPersonnelListByParamsNoPage(params);
		if (personnelLists!=null && 0!=personnelLists.size()) {
			jsonMap.put("status", 1);
			jsonMap.put("personnelLists", personnelLists);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 保存入驻企业评价信息
	 * @return
	 */
	public String saveEnterpriseEvaluate(){
		logger.info("进入保存管理和服务人员名单及职称情况信息方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.saveEnterpriseEvaluate(getRequest());
		logger.info("插入数量为："+result);
		if (result>0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 通过userCode和applicationId获取入驻企业评价信息
	 */
	public String getEnterpriseEvaluateByParams(){
		logger.info("进入通过userCode和applicationId获取入驻企业评价信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<EnterpriseEvaluate> enterpriseEvaluates = exemplaryMatrixApplicationService.getEnterpriseEvaluateByParams(params);
		if (0==enterpriseEvaluates.size() || null == enterpriseEvaluates) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("enterpriseEvaluates", enterpriseEvaluates);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 区属推荐获取列表
	 * @return
	 */
	public String districtAuditGetList(){
		logger.info("进入区属推荐获取列表方法："+PrintLine.getInfo());
		logger.info("查询参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.districtAuditGetList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("matrixList", result.get("matrixList"));
		
		return SUCCESS;
	}
	
	/**
	 * 市级审核获取列表
	 * @return
	 */
	public String cityAuditGetList(){
		logger.info("进入市级推荐获取列表方法："+PrintLine.getInfo());
		logger.info("查询参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.cityAuditGetList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("matrixList", result.get("matrixList"));
		
		return SUCCESS;
	}
	
	/**
	 * 第三方审核获取列表
	 * @return
	 */
	public String thirdPartyAuditGetList(){
		logger.info("进入第三方推荐获取列表方法："+PrintLine.getInfo());
		logger.info("查询参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.thirdPartyAuditGetList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("matrixList", result.get("matrixList"));
		
		return SUCCESS;
	}
	
	/**
	 * 保存推荐主表信息
	 * @return
	 */
	public String saveExemplaryMatrixRecommend(){
		logger.info("进入保存推荐主表信息方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.saveExemplaryMatrixRecommend(exemplaryMatrixRecommend);
		if (result > 0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 保存推荐表附表方法
	 * @return
	 */
	public String saveExemplaryMatrixRecommendEvaluate(){
		logger.info("进入保存推荐表附表方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.saveExemplaryMatrixRecommendEvaluate(getRequest());
		logger.info("插入数量为："+result);
		if (result>0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 20170717修改点
	 * 保存推荐附表方法（新）
	 * @return
	 */
	public String saveExemplaryMatrixRecommendEvaluateNew(){
		logger.info("进入保存推荐表附表方法（新）："+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.saveExemplaryMatrixRecommendEvaluateNew(exemplaryMatrixRecommendEvaluate);
		logger.info("插入结果为："+result);
		if (result>0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 审核方法
	 * @return
	 */
	public String audit(){
		logger.info("进入审核方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Integer result = exemplaryMatrixApplicationService.audit(params);
		if (result>0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 通过参数获取推荐主表内容
	 * @return
	 */
	public String getExemplaryMatrixRecommendByParams(){
		logger.info("进入通过参数获取推荐主表内容方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		ExemplaryMatrixRecommend exemplaryMatrixRecommend = exemplaryMatrixApplicationService.getExemplaryMatrixRecommendByParams(params);
		if (null == exemplaryMatrixRecommend) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("exemplaryMatrixRecommend", exemplaryMatrixRecommend);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 获取推荐附表
	 * @return
	 */
	public String getExemplaryMatrixRecommendEvaluateList(){
		logger.info("进入获取推荐附表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<ExemplaryMatrixRecommendEvaluate> exemplaryMatrixRecommendEvaluates = exemplaryMatrixApplicationService.getExemplaryMatrixRecommendEvaluateList(params);
		if (null!=exemplaryMatrixRecommendEvaluates && 0!=exemplaryMatrixRecommendEvaluates.size()) {
			jsonMap.put("status", 1);
			jsonMap.put("exemplaryMatrixRecommendEvaluates", exemplaryMatrixRecommendEvaluates);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 通过id获取推荐附表信息
	 * @return
	 */
	public String getExemplaryMatrixRecommendEvaluateById(){
		logger.info("进入通过id获取推荐附表信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		ExemplaryMatrixRecommendEvaluate exemplaryMatrixRecommendEvaluate = exemplaryMatrixApplicationService.getExemplaryMatrixRecommendEvaluateById(params);
		if (null == exemplaryMatrixRecommendEvaluate) {
			jsonMap.put("status",0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("exemplaryMatrixRecommendEvaluate", exemplaryMatrixRecommendEvaluate);
		}
		return SUCCESS;
	}
	
	/**
	 * 通过id删除推荐附表信息
	 * @return
	 */
	public String deleteExemplaryMatrixRecommendEvaluateById(){
		logger.info("进入通过id删除推荐附表信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Integer result = exemplaryMatrixApplicationService.deleteExemplaryMatrixRecommendEvaluateById(params);
		if (result > 0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	
	/**
	 * 上传内容方法
	 * @return
	 * @throws Exception 
	 */
	public String uploadFile() throws Exception{
		logger.info("进入示范基地上传内容方法："+PrintLine.getInfo());
		String path = LoadPropperties.getProperty("imagePath");
		
		this.getResponse().setContentType("text/html;charset=UTF-8");
		//获取request对象
		ServletRequest request = this.getRequest();
		//从前台获得userCode
		String userCode = request.getParameter("userCode");
		logger.info("从前台获得的userCode为："+userCode);
		//从前台获得文件类型，用于分类保存
		String fileType = request.getParameter("fileType");
		logger.info("上传的文件类型为："+fileType);
		
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String timeString = simpleDateFormat.format(new Date());
		
		//获取上传的文件名
		String fileName = this.getFileFileName();
		//重新拼装文件名,使用当前用户userCode对照片命名，重复上传则替换
		fileName = userCode+"_"+fileType+"_"+timeString+fileName.substring(fileName.indexOf("."));
		
		String savePath = path + fileName;
		logger.info("保存文件路径为："+savePath);
		
		File uploadFile = this.getFile();
		
		//创建输入流读取文件
		FileInputStream fileInputStream = new FileInputStream(uploadFile);
//		//拼接保存路径
//		String saveDbPath = LoadPropperties.getProperty("saveDbPath")+fileName;
//		logger.info("保存数据库路径为："+saveDbPath);
		
		//创建输出流保存文件
		FileOutputStream outputStream = new FileOutputStream(savePath);
		//创建byte数组写文件
		byte[] buf = new byte[1024];
        int length = 0;
        while ((length = fileInputStream.read(buf)) != -1) {
            outputStream.write(buf, 0, length);
        }
        fileInputStream.close();
        outputStream.flush();
        outputStream.close();
        
        this.returnMsg = new ByteArrayInputStream(fileName.getBytes("UTF-8"));
		
        return SUCCESS;
	}
	
	/**
	 * 保存月度服务信息
	 * @return
	 */
	public String saveMonthlyServiceData(){
		logger.info("进入保存月度服务信息方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.saveMonthlyServiceData(getRequest());
		logger.info("一共新增数据条数为："+result);
		if (result >0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 通过id查询月度服务信息
	 * @return
	 */
	public String getMonthlyServiceDataById(){
		logger.info("进入通过id查询月度服务信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		MonthlyServiceData monthlyServiceData = exemplaryMatrixApplicationService.getMonthlyServiceDataById(params);
		if (null == monthlyServiceData) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("monthlyServiceData", monthlyServiceData);
		}
		return SUCCESS;
	}
	
	/**
	 * 保存月度报表——办公设备方法
	 * @return
	 */
	public String saveMonthlyOfficeEquipment(){
		logger.info("进入保存月度报表——办公设备方法:"+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.saveMonthlyOfficeEquipment(getRequest());
		logger.info("一共新增数据条数："+result);
		if (result>0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 保存月度报表——装修改造
	 * @return
	 */
	public String saveMonthlyDecoration(){
		logger.info("进入保存月度报表——装修改造方法:"+PrintLine.getInfo());
		Integer result = exemplaryMatrixApplicationService.saveMonthlyDecoration(getRequest());
		logger.info("一共新增数据条数："+result);
		if (result>0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 通过服务类别统计数量
	 * @return
	 */
	public String getStatisticalByServiceType(){
		logger.info("进入通过服务类别统计数量方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<Map<String, Object>> result = exemplaryMatrixApplicationService.getStatisticalByServiceType(params);
		if (null!=result && 0!=result.size()) {
			jsonMap.put("status", 1);
			jsonMap.put("result", result);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 创业创新首页查询基地信息列表
	 * @return
	 */
	public String getMatrixForIndexByParams(){
		logger.info("进入创业创新首页查询基地信息列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getMatrixForIndexByParams(params);
		
		jsonMap.put("count", result.get("count"));
		jsonMap.put("matrixList", result.get("matrixList"));
		
		
		return SUCCESS;
	}
	
	/**
	 * 提交申请
	 * @return
	 */
	public String submitMatrixApplication(){
		logger.info("进入提交申请方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Integer result = exemplaryMatrixApplicationService.submitMatrixApplication(params);
		if (result>0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 通过年月信息获取办公设备升级装修改造升级记录
	 * @return
	 */
	public String getOfficeEquipmentAndDecorationByParams(){
		logger.info("进入通过年月信息获取办公设备升级装修改造升级记录方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, List<Map<String, Object>>> result = exemplaryMatrixApplicationService.getOfficeEquipmentAndDecorationByParams(params);
		if (result == null || 
				result.get("officeEquipmentList") == null || 
				result.get("officeEquipmentList").size() == 0 || 
				result.get("decorationList") == null || 
				result.get("decorationList").size() == 0 ) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("officeEquipmentList", result.get("officeEquipmentList"));
			jsonMap.put("decorationList", result.get("decorationList"));
		}
		
		return SUCCESS;
	}
	
	/**
	 * 通过userCode和年月获取月度服务信息
	 * @return
	 */
	public String getMonthlyServiceDataByYearAndMonth(){
		logger.info("进入通过userCode和年月获取月度服务信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<MonthlyServiceData> monthlyServiceDatas = exemplaryMatrixApplicationService.getMonthlyServiceDataByYearAndMonth(params);
		if (null == monthlyServiceDatas || 0==monthlyServiceDatas.size()) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("monthlyServiceDatas", monthlyServiceDatas);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 区级审核月度报表页面获取列表
	 * @return
	 */
	public String getMonthlyStatementListForAudit(){
		logger.info("进入区级审核月度报表页面获取列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getMonthlyStatementListForAudit(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("monthlyStatementList", result.get("monthlyStatementList"));
		
		return SUCCESS;
	}
	
	/**
	 * 区级审核月度报表操作
	 * @return
	 */
	public String districtAuditStatement(){
		logger.info("进入区级审核月度报表操作方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Integer result = exemplaryMatrixApplicationService.districtAuditStatement(params);
		if (result > 0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 查看月报时获取哪年填写了报表
	 * @return
	 */
	public String getMonthlyStatementYears(){
		logger.info("进入查看月报时获取哪年填写了报表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<Map<String, Object>> years = exemplaryMatrixApplicationService.getMonthlyStatementYears(params);
		if(null == years || 0==years.size()){
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("years", years);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 查看季度报表时获取哪年填写了报表
	 * @return
	 */
	public String getQuarterStatementYears(){
		logger.info("进入查看季度报表时获取哪年填写了报表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<Map<String, Object>> years = exemplaryMatrixApplicationService.getQuarterStatementYears(params);
		if(null == years || 0==years.size()){
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("years", years);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 数据统计页面获取信息
	 * @return
	 */
	public String getServiceDataStatistics(){
		logger.info("进入数据统计页面获取信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getServiceDataStatistics(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("serviceDataStatisticsList", result.get("serviceDataStatisticsList"));
		return SUCCESS;
	}
	
	/**
	 * 数据统计页面获取服务总数
	 * 20170719添加统计服务人数总计
	 * @return
	 */
	public String getSumForService(){
		logger.info("进入数据统计页面获取服务总数方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getSumForService(params);
		jsonMap.put("sumForService", result.get("count"));
		jsonMap.put("sumForPerson", result.get("number"));
		jsonMap.put("sumForEnterNumber", result.get("enterNumber"));
		return SUCCESS;
	}
	
	/**
	 * 获取数据统计详细信息方法
	 * @return
	 */
	public String getServiceDataStatisticsDetailList(){
		logger.info("进入获取数据统计详细信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getServiceDataStatisticsDetailList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("detailList", result.get("detailList"));
		
		return SUCCESS;
	}
	
	/**
	 * 获取申报年限列表
	 * @return
	 */
	public String getApplicationYearList(){
		logger.info("进入获取申报年限列表方法："+PrintLine.getInfo());
		List<Map<String, Object>> applicationYearList = exemplaryMatrixApplicationService.getApplicationYearList();
		if (null!=applicationYearList && 0!=applicationYearList.size()) {
			jsonMap.put("status", 1);
			jsonMap.put("applicationYearList", applicationYearList);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 递交第三方方法
	 * @return
	 */
	public String sendToThirdParty(){
		logger.info("进入递交第三方方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Integer result = exemplaryMatrixApplicationService.sendToThirdParty(params);
		if (result >0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 提交月报
	 * @return
	 */
	public String submitMonthlyStatement() {
		logger.info("进入提交月报方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Integer result = exemplaryMatrixApplicationService.submitMonthlyStatement(params);
		if(result > 0){
			jsonMap.put("status", 1);
		}else if(result == 0){
			jsonMap.put("status", 0);
		}else if (result == -1) {
			jsonMap.put("status", -1);
		}else if (result == -2) {
			jsonMap.put("status", -2);
		}else if (result == -3) {
			jsonMap.put("status", -3);
		}
		return SUCCESS;
	}
	
	/**
	 * 提交月报
	 * @return
	 */
	public String submitMonthlyStatementForSeven() {
		logger.info("进入提交月报（七月）方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Integer result = exemplaryMatrixApplicationService.submitMonthlyStatementSeven(params);
		if(result > 0){
			jsonMap.put("status", 1);
		}else if(result == 0){
			jsonMap.put("status", 0);
		}else if (result == -1) {
			jsonMap.put("status", -1);
		}else if (result == -2) {
			jsonMap.put("status", -2);
		}else if (result == -3) {
			jsonMap.put("status", -3);
		}
		return SUCCESS;
	}
	
	/**
	 * 获取未填写当前月份月报的示范基地数量
	 * @return
	 */
	public String getSumForMatrixNoMonthly(){
		logger.info("进入获取未填写当前月份月报的示范基地数量方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getSumForMatrixNoMonthly(params);
		jsonMap.put("count", result.get("count"));
		return SUCCESS;
	}
	
	/**
	 * 获取未填写当前月份月报的示范基地详情
	 * @return
	 */
	public String getMatrixNoMonthlyDetailList(){
		logger.info("进入获取未填写当前月份月报的示范基地详情方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixApplicationService.getMatrixNoMonthlyDetailList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("detailList", result.get("detailList"));
		return SUCCESS;
	}
	
	/**
	 * 2018新增需求，区级将示范基地信息退回
	 * @return
	 */
	public String sendBackMatrixInfo(){
		logger.info("进入2018新增需求，区级将示范基地信息退回方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Integer result = exemplaryMatrixApplicationService.sendBackMatrixInfo(params);
		
		if (result >= 2) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}

	/**
	 * 通过userCode获取示范基地表信息，用来验证该基地是否示范基地
	 * @return
	 */
	public String findExemplaryMatrixInfoByUserCode(){
		logger.info("进入通过userCode获取示范基地表信息，用来验证该基地是否示范基地方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		ExemplaryMatrix exemplaryMatrix = exemplaryMatrixApplicationService.findExemplaryMatrixInfoByUserCode(params);
		if (exemplaryMatrix == null) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
		}
		return SUCCESS;
	}
	
}
