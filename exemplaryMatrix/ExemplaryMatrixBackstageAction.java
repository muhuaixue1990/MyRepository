package com.zl.action;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


import javax.annotation.Resource;
import javax.servlet.ServletRequest;

import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.zl.bean.ExemplaryMatrixOnlineData;
import com.zl.bean.ExemplaryMatrixServiceData;
import com.zl.bean.ExemplaryMatrixServiceSituation;
import com.zl.bean.ExemplaryMatrixSettledEnterprise;
import com.zl.service.ExemplaryMatrixBackstageService;
import com.zl.utils.ExcelExp;
import com.zl.utils.LoadPropperties;
import com.zl.utils.PrintLine;
import com.zl.utils.XssExcelExp;
import com.zl.utils.ZipUtils;

/**
 * 示范基地后台Action
 * @author muhuaixue
 *
 */
@Controller
@Scope("prototype")
public class ExemplaryMatrixBackstageAction extends BaseAction{

	/**
	 * 序列化编号
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * 前台传到后台的参数
	 */
	private Map<String, String> params;
	
	/**
	 * 
	 */
	private ExemplaryMatrixServiceData exemplaryMatrixServiceData;
	
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
     * 示范基地后台service
     */
    private ExemplaryMatrixBackstageService exemplaryMatrixBackstageService;
    
    /**
     * 前台传过来的入驻企业信息
     */
    private ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise;

	public Map<String, String> getParams() {
		return params;
	}

	public void setParams(Map<String, String> params) {
		this.params = params;
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

	public ExemplaryMatrixBackstageService getExemplaryMatrixBackstageService() {
		return exemplaryMatrixBackstageService;
	}

	@Resource
	public void setExemplaryMatrixBackstageService(
			ExemplaryMatrixBackstageService exemplaryMatrixBackstageService) {
		this.exemplaryMatrixBackstageService = exemplaryMatrixBackstageService;
	}
	
	public ExemplaryMatrixSettledEnterprise getExemplaryMatrixSettledEnterprise() {
		return exemplaryMatrixSettledEnterprise;
	}

	public void setExemplaryMatrixSettledEnterprise(
			ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise) {
		this.exemplaryMatrixSettledEnterprise = exemplaryMatrixSettledEnterprise;
	}

	public InputStream getReturnMsg() {
		return returnMsg;
	}

	public void setReturnMsg(InputStream returnMsg) {
		this.returnMsg = returnMsg;
	}
	
	
	
	public ExemplaryMatrixServiceData getExemplaryMatrixServiceData() {
		return exemplaryMatrixServiceData;
	}

	public void setExemplaryMatrixServiceData(
			ExemplaryMatrixServiceData exemplaryMatrixServiceData) {
		this.exemplaryMatrixServiceData = exemplaryMatrixServiceData;
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
	 * 根据district，year，quarter导出基地季度报表
	 */
	public void exportMatrixQuarterStatement(){
		logger.info("进入根据userCode，year，quarter导出基地报表方法："+PrintLine.getInfo());
		try {
			//获取模板路径
			String path = this.getClass().getClassLoader().getResource("").getPath();
	        path = path.substring(0, path.lastIndexOf("classes"));
	        path = path + File.separator + "excelTemplet";
	        String srcPath = path + File.separator + "exportMatrixStatementTemplet.xlsx";
			//获取模板路径
			logger.info("模板路径为："+srcPath);
			
			
			//新建文件夹，将excel放进去，然后压缩，再下载
			//新建文件夹的路径
			String folderPath = LoadPropperties.getProperty("imagePath");
			
			//设置文件夹名字
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
			String folderName = simpleDateFormat.format(new Date())+"_quarterStatement";
			//整理文件夹路径
			folderPath = folderPath +  folderName;
			logger.info("文件夹路径为："+folderPath);
			//压缩文件路径
			String zipPath = folderPath+".zip";
			logger.info("压缩文件路径为："+zipPath);
			
			
			File folderFile = new File(folderPath);
			if (folderFile.exists()) {
				
	        } else {
	        	folderFile.mkdir();
	        }
			
			
			//获取参数
			String district = this.getRequest().getParameter("district");
			String year = this.getRequest().getParameter("year");
			String quarter = this.getRequest().getParameter("quarter");
			String auditType = this.getRequest().getParameter("auditType");
			String cityType = this.getRequest().getParameter("cityType");
			logger.info("传入参数为：district="+district+",year="+year+",quarter="+quarter+",auditType="+auditType+",cityType="+cityType);
			
			//根据区编号查询改区的示范基地列表
			Map<String, String> getMatrixListParam = new HashMap<String, String>();
			getMatrixListParam.put("serviceYear", year);
			getMatrixListParam.put("serviceQuarter", quarter);
			getMatrixListParam.put("auditType", auditType);
			getMatrixListParam.put("district", district);
			List<Map<String, Object>> matrixList = exemplaryMatrixBackstageService.findMatrixListByDistrict(getMatrixListParam);
			
			//循环处理数据，并放入到指定文件夹
			if (null!=matrixList && 0!=matrixList.size()) {
				logger.info("查询到的基地数量为："+matrixList.size());
				for (int i = 0; i < matrixList.size(); i++) {
					String userCode = (String)matrixList.get(i).get("userCode");
					//获取基地基本信息
					Map<String, String> getMatrixBaseInfoParam = new HashMap<String, String>();
					getMatrixBaseInfoParam.put("userCode", userCode);
					Map<String, Object> matrixBaseInfoParam = exemplaryMatrixBackstageService.findMatrixBaseInfoByUserCode(getMatrixBaseInfoParam);
					Map<String, String> matrixBaseInfoParam1 = this.mapUtil(matrixBaseInfoParam);
					
					//模板替换基本信息
					//传递模板地址和要操作的页签（处理第一页）
					ExcelExp matrixBaseInfoExp = new XssExcelExp(srcPath, 0);
					matrixBaseInfoParam1.put("title", year+"年度示范基地基本情况汇总表");
					//塞入基本信息
					matrixBaseInfoExp.replaceExcelData(matrixBaseInfoParam1);
					
					//获取基地环境改造情况
					Map<String, String> getEnvironmentRemouldParam = new HashMap<String, String>();
					getEnvironmentRemouldParam.put("matrixCode", userCode);
					getEnvironmentRemouldParam.put("year", year);
					getEnvironmentRemouldParam.put("month", quarter);
					getEnvironmentRemouldParam.put("auditType", auditType);
					
					List<LinkedHashMap<String, Object>> result = exemplaryMatrixBackstageService.findServiceAbilityPromoteByParams(getEnvironmentRemouldParam);
					logger.info("导出的环境改造能力提升数据条数："+result.size());
					
					//从第7行开始，增加列表总数的行数
					matrixBaseInfoExp.insertRows(7, result.size());
					wirteXssExcelForQuarterStatement(matrixBaseInfoExp,7,0,result);
					
					//合并单元格
					XSSFSheet sheet = matrixBaseInfoExp.getXssSheet();
					sheet.addMergedRegion(new CellRangeAddress(6,6+result.size(),0,0));
					for (int j = 0; j < result.size(); j++) {
						sheet.addMergedRegion(new CellRangeAddress((7+j),(7+j),1,3));
						sheet.addMergedRegion(new CellRangeAddress((7+j),(7+j),4,6));
						sheet.addMergedRegion(new CellRangeAddress((7+j),(7+j),7,8));
					}
					  
					
					//处理八大服务项目内容
					Map<String, String> getMatrixServiceInfoParam = new HashMap<String, String>();
					getMatrixServiceInfoParam.put("userCode", userCode);
					getMatrixServiceInfoParam.put("serviceYear", year);
					getMatrixServiceInfoParam.put("serviceQuarter", quarter);
					getMatrixServiceInfoParam.put("auditType", auditType);
					Map<String, String> matirxServiceInfo = exemplaryMatrixBackstageService.findMatrixServiceInfo(getMatrixServiceInfoParam);
					//塞入服务项目数据
					matrixBaseInfoExp.replaceExcelData(matirxServiceInfo);
					//新文件名
					String fileName = matrixBaseInfoParam1.get("matrixName")+".xlsx";

					
					String filePath = folderPath + File.separator + fileName;
					logger.info("开始写入文件夹");
					matrixBaseInfoExp.writeExcel(filePath);
				}
			}
			
			//导出季度大表
			exportQuarterStatement(folderPath,district,year,quarter,auditType);
			
			//市级导出增加导出各个区的数据
			if("city".equals(cityType)){
				exportQuarterStatementForCity(folderPath,district,year,quarter,auditType);
			}
			
			
			FileOutputStream fileOutputStream = new FileOutputStream(new File(zipPath));
			ZipUtils.toZip(folderPath, fileOutputStream,true);
			
			logger.info("执行到此，准备下载");
			this.download(folderName+".zip", zipPath);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 下载方法
	 * @param fileName
	 * @param filePath
	 */
	private void download(String fileName, String filePath) throws Exception{
		 //2.获取要下载的文件名
		fileName = URLEncoder.encode(fileName,"UTF-8");
		//3.设置content-disposition响应头控制浏览器以下载的形式打开文件
		this.getResponse().setHeader("content-disposition", "attachment;filename="+fileName);
		//4.获取要下载的文件输入流
		InputStream in = new FileInputStream(filePath);
		int len = 0;
		//5.创建数据缓冲区
		byte[] buffer = new byte[1024];
		//6.通过response对象获取OutputStream流
		OutputStream out = this.getResponse().getOutputStream();
		//7.将FileInputStream流写入到buffer缓冲区
		while ((len = in.read(buffer)) > 0) {
		//8.使用OutputStream将缓冲区的数据输出到客户端浏览器
		    out.write(buffer,0,len);
		}
		in.close();
		out.flush();
		out.close();
		
		//删除生成的压缩文件
		File deleteFile = new File(filePath);
		logger.info("要删除的文件为："+deleteFile);
		if (deleteFile.exists()) {
			deleteFile.delete();
		}
		
		String deleteFolderPath = filePath.substring(0, filePath.lastIndexOf("."));
		logger.info("要删除的文件夹为："+deleteFolderPath);
		delFolder(deleteFolderPath);
		
	}
	
	
	private static void delFolder(String folderPath) {
	     try {
	        delAllFile(folderPath); //删除完里面所有内容
	        String filePath = folderPath;
	        filePath = filePath.toString();
	        java.io.File myFilePath = new java.io.File(filePath);
	        myFilePath.delete(); //删除空文件夹
	     } catch (Exception e) {
	       e.printStackTrace(); 
	     }
	}
	private static boolean delAllFile(String path) {
		   boolean flag = false;
		   File file = new File(path);
		   if (!file.exists()) {
		     return flag;
		   }
		   if (!file.isDirectory()) {
		     return flag;
		   }
		   String[] tempList = file.list();
		   File temp = null;
		   for (int i = 0; i < tempList.length; i++) {
		      if (path.endsWith(File.separator)) {
		         temp = new File(path + tempList[i]);
		      } else {
		          temp = new File(path + File.separator + tempList[i]);
		      }
		      if (temp.isFile()) {
		         temp.delete();
		      }
		      if (temp.isDirectory()) {
		         delAllFile(path + "/" + tempList[i]);//先删除文件夹里面的文件
		         delFolder(path + "/" + tempList[i]);//再删除空文件夹
		         flag = true;
		      }
		   }
		   return flag;
		 }

	
	/**
	 * 生成季度大表
	 */
	private void exportQuarterStatement(String folderPath,String district,String year,String quarter,String auditType){
		logger.info("进入导出季度报表方法："+PrintLine.getInfo());
		try {
			String path = this.getClass().getClassLoader().getResource("").getPath();
	        path = path.substring(0, path.lastIndexOf("classes"));
	        path = path + File.separator + "excelTemplet";
	        String srcPath = path + File.separator + "exportQuarterStatementTemplet.xlsx";
			//获取模板路径
			logger.info("模板路径为："+srcPath);
			
			logger.info("需要导出的区县为："+district+"，年份为："+year+"，季度为："+quarter);
			
			//创建查询参数
			Map<String, String> getInfoParams = new HashMap<String, String>();
			if ("120000".equals(district)) {
				getInfoParams.put("district", "");
			}else{
				getInfoParams.put("district", district);
			}
			getInfoParams.put("year", year);
			getInfoParams.put("quarter", quarter);
			getInfoParams.put("auditType", auditType);
			
			//查询结果
			List<LinkedHashMap<String, Object>> infoList = exemplaryMatrixBackstageService.disposeDataForExportQuarterStatement(getInfoParams);
			logger.info("导出的数据条数为："+infoList.size());
			
			//传递模板地址和要操作的页签（处理第二页）
			ExcelExp applicationInfoExp = new XssExcelExp(srcPath, 0);
			
			Map<String, String> titleMap = new HashMap<String, String>();
			titleMap.put("title", year+"年天津市示范基地基本情况汇总表");
			applicationInfoExp.replaceExcelData(titleMap);
			
			//从第11行开始，增加列表总数的行数
			applicationInfoExp.insertRows(5, infoList.size());
			wirteXssExcelForQuarterStatement(applicationInfoExp,5,0,infoList);
			
			//导出，此处只封装了浏览器下载方式
			//调用downloadExcel，返回输出流给客户端
			String fileName = "";
			if ("1".equals(quarter)) {
				fileName = year+"年 I（1~3月）季度报表.xlsx";
			}else if("2".equals(quarter)){
				fileName = year+"年 II（1~6月）季度报表.xlsx";
			}else if("3".equals(quarter)){
				fileName = year+"年 III（1~9月）季度报表.xlsx";
			}else if("4".equals(quarter)){
				fileName = year+"年 IV（1~12月）季度报表.xlsx";
			}
			
			String filePath = folderPath + File.separator + fileName;
			logger.info("开始写入文件夹");
			applicationInfoExp.writeExcel(filePath);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 市级导出增加导出各个区的数据
	 * TODO
	 * @param folderPath
	 * @param district
	 * @param year
	 * @param quarter
	 * @param auditType
	 */
	private void exportQuarterStatementForCity(String folderPath,String district,String year,String quarter,String auditType){
		logger.info("进入市级导出各个区季度报表方法："+PrintLine.getInfo());
		try {
			String path = this.getClass().getClassLoader().getResource("").getPath();
	        path = path.substring(0, path.lastIndexOf("classes"));
	        path = path + File.separator + "excelTemplet";
	        String srcPath = path + File.separator + "exportQuarterStatementTemplet.xlsx";
			//获取模板路径
			logger.info("模板路径为："+srcPath);
			
			logger.info("需要导出的区县为："+district+"，年份为："+year+"，季度为："+quarter);
			
			//创建查询参数
			Map<String, String> getInfoParams = new HashMap<String, String>();
			if ("120000".equals(district)||"".equals(district)) {
				getInfoParams.put("district", "");
			}else{
				getInfoParams.put("district", district);
			}
			getInfoParams.put("year", year);
			getInfoParams.put("quarter", quarter);
			getInfoParams.put("auditType", auditType);
			
			//查询结果
			List<LinkedHashMap<String, Object>> infoList = exemplaryMatrixBackstageService.exportQuarterStatementForCity(getInfoParams);
			logger.info("导出的数据条数为："+infoList.size());
			
			//传递模板地址和要操作的页签（处理第二页）
			ExcelExp applicationInfoExp = new XssExcelExp(srcPath, 0);
			
			Map<String, String> titleMap = new HashMap<String, String>();
			titleMap.put("title", year+"年天津市示范基地基本情况汇总表");
			applicationInfoExp.replaceExcelData(titleMap);
			
			//从第11行开始，增加列表总数的行数
			applicationInfoExp.insertRows(5, infoList.size());
			wirteXssExcelForQuarterStatement(applicationInfoExp,5,0,infoList);
			
			//导出，此处只封装了浏览器下载方式
			//调用downloadExcel，返回输出流给客户端
			String fileName = "";
			if ("1".equals(quarter)) {
				fileName = year+"年 I（1~3月）各区季度报表.xlsx";
			}else if("2".equals(quarter)){
				fileName = year+"年 II（1~6月）各区季度报表.xlsx";
			}else if("3".equals(quarter)){
				fileName = year+"年 III（1~9月）各区季度报表.xlsx";
			}else if("4".equals(quarter)){
				fileName = year+"年 IV（1~12月）各区季度报表.xlsx";
			}
			
			String filePath = folderPath + File.separator + fileName;
			logger.info("开始写入文件夹");
			applicationInfoExp.writeExcel(filePath);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 为新增的格插入值方法(导出季度报表)
	 * @param excel
	 */
	private void wirteXssExcelForQuarterStatement(ExcelExp excel,
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
	 * 导出年度报表
	 */
	public void exportMatrixYearStatement(){
		logger.info("进入导出年度报表方法："+PrintLine.getInfo());
		try {
			String path = this.getClass().getClassLoader().getResource("").getPath();
	        path = path.substring(0, path.lastIndexOf("classes"));
	        path = path + File.separator + "excelTemplet";
	        String srcPath = path + File.separator + "exportYearStatementTemplet.xlsx";
			//获取模板路径
			logger.info("模板路径为："+srcPath);
			
			//根据参数查询数据
			String district = this.getRequest().getParameter("district");
			String year = this.getRequest().getParameter("year");
			String quarter = this.getRequest().getParameter("quarter");
			String auditType = this.getRequest().getParameter("auditType");
			logger.info("需要导出的区县为："+district+"，年份为："+year+"，季度为："+quarter);
			
			//创建查询参数
			Map<String, String> getInfoParams = new HashMap<String, String>();
			if("120000".equals(district)){
				getInfoParams.put("district", "");
			}else {
				getInfoParams.put("district", district);
			}
			getInfoParams.put("year", year);
			getInfoParams.put("quarter", quarter);
			getInfoParams.put("auditType", auditType);
			
			//查询结果
			List<LinkedHashMap<String, Object>> infoList = exemplaryMatrixBackstageService.disposeDataForExportYearStatement(getInfoParams);
			logger.info("导出的数据条数为："+infoList.size());
			
			//传递模板地址和要操作的页签（处理第二页）
			ExcelExp applicationInfoExp = new XssExcelExp(srcPath, 0);
			//替换表头
			Map<String, String> titleMap = new HashMap<String, String>();
			titleMap.put("title", year+"年度示范基地基本情况汇总表");
			titleMap.put("year1", String.valueOf(Integer.parseInt(year)-1)+"年");
			titleMap.put("year2", year+"年");
			applicationInfoExp.replaceExcelData(titleMap);
			
			//从第11行开始，增加列表总数的行数
			applicationInfoExp.insertRows(6, infoList.size());
			wirteXssExcelForQuarterStatement(applicationInfoExp,6,0,infoList);
			
			//导出，此处只封装了浏览器下载方式
			//调用downloadExcel，返回输出流给客户端
			String fileName = year+"年度报表.xlsx";
			logger.info("执行到此，准备下载");
			applicationInfoExp.downloadExcel(this.getRequest(),getResponse(), fileName);
		} catch (Exception e) {
			e.printStackTrace();
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
	 * 获取入驻企业列表
	 * @return
	 */
	public String findSettledEnterpriseList(){
		logger.info("获取入驻企业列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixBackstageService.findSettledEnterpriseList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("exemplaryMatrixSettledEnterprises", result.get("exemplaryMatrixSettledEnterprises"));
		
		return SUCCESS;
	}
	
	/**
	 * 通过id获取入驻企业信息
	 * @return
	 */
	public String findSettledEnterpriseById(){
		logger.info("进入通过id获取入驻企业信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		ExemplaryMatrixSettledEnterprise exemplaryMatrixSettledEnterprise = exemplaryMatrixBackstageService.findSettledEnterpriseById(params);
		if (null == exemplaryMatrixSettledEnterprise) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("exemplaryMatrixSettledEnterprise", exemplaryMatrixSettledEnterprise);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 通过id删除入驻企业信息
	 * @return
	 */
	public String deleteSettledEnterpriseById(){
		logger.info("进入通过id删除入驻企业信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Integer result = exemplaryMatrixBackstageService.deleteSettledEnterpriseById(params);
		if (result > 0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 插入/更新入驻企业信息
	 * @return
	 */
	public String saveOrUpdateSettledEnterprise(){
		logger.info("进入插入入驻企业信息方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixBackstageService.saveOrUpdateSettledEnterprise(exemplaryMatrixSettledEnterprise);
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
		String lookUrl = LoadPropperties.getProperty("saveDbPath");
				
		
		this.getResponse().setContentType("text/html;charset=UTF-8");
		//获取request对象
		ServletRequest request = this.getRequest();
		//从前台获得userCode
		String userCode = request.getParameter("userCode");
		logger.info("从前台获得的userCode为："+userCode);
		//从前台获得文件类型，用于分类保存
		String fileType = request.getParameter("fileType");
		logger.info("上传的文件类型为："+fileType);
		
		//20171221添加验证图片大小
		double size=((double)file.length())/1024/1024;
		if(size>3.0){
			//返回json
			this.returnMsg = new ByteArrayInputStream(("图片大小不得超过3M").getBytes("UTF-8"));
	        return SUCCESS;
		}
		
		
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
        
        this.returnMsg = new ByteArrayInputStream((lookUrl+fileName).getBytes("UTF-8"));
		
        return SUCCESS;
	}
	
	/**
	 * 上传rar方法
	 * @return
	 * @throws Exception 
	 */
	public String uploadRar() throws Exception{
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
	 * 上传入驻企业信息
	 * @return
	 * @throws Exception
	 */
	public String saveSettledEnterpriseForFile() throws Exception{
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
        
        int result = exemplaryMatrixBackstageService.saveSettledEnterpriseForFile(savePath, userCode);
        
        if (result > 0) {
        	this.returnMsg = new ByteArrayInputStream("1".getBytes("UTF-8"));
		}else if(result == 0){
			this.returnMsg = new ByteArrayInputStream("0".getBytes("UTF-8"));
		}else if (result == -1) {
			this.returnMsg = new ByteArrayInputStream("-1".getBytes("UTF-8"));
		}
        return SUCCESS;
	}
	
	
	/**
	 * 通过id更新入驻企业信息
	 * @return
	 */
	public String updateSettledEnterpriseById(){
		logger.info("进入通过id更新入驻企业信息方法:"+PrintLine.getInfo());
		Integer result = exemplaryMatrixBackstageService.updateSettledEnterpriseById(exemplaryMatrixSettledEnterprise);
		if (result > 0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 插入基地开展服务情况
	 * @return
	 */
	public String saveExemplaryMatrixServiceData(){
		logger.info("进入插入线下基地开展服务情况方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixBackstageService.saveExemplaryMatrixServiceData(exemplaryMatrixServiceData);
		logger.info("插入数量为："+result);
		if (result>0) {
			jsonMap.put("status",1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据
	 * @return
	 */
	public String findExemplaryMatrixServiceDataByParams(){
		logger.info("进入通过Usercode，year，quarter获取基地开展服务情况数据方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<ExemplaryMatrixServiceData> exemplaryMatrixServiceDatas = exemplaryMatrixBackstageService.findExemplaryMatrixServiceDataByParams(params);
		if (null!=exemplaryMatrixServiceDatas && exemplaryMatrixServiceDatas.size()!=0) {
			jsonMap.put("status", 1);
			jsonMap.put("exemplaryMatrixServiceDatas", exemplaryMatrixServiceDatas);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 通过Usercode，year，quarter获取基地开展服务情况数据（分页）
	 * @return
	 */
	public String findExemplaryMatrixServiceDataByParamsForPage(){
		logger.info("进入通过Usercode，year，quarter获取基地开展服务情况数据方法(分页)："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixBackstageService.findExemplaryMatrixServiceDataByParamsForPage(params);
		
		jsonMap.put("count", result.get("count"));
		jsonMap.put("serviceDataList", result.get("serviceDataList"));
		return SUCCESS;
	}
	
	/**
	 * 获取基地报表管理列表
	 * @return
	 */
	public String findStatementManageList(){
		logger.info("进入获取基地报表管理列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<Map<String, Object>> result = exemplaryMatrixBackstageService.findStatementManageList(params);
		if (null != result&& 0!=result.size()) {
			jsonMap.put("status", 1);
			jsonMap.put("statementManageList", result);
		}else {
			jsonMap.put("status", 0);
		}
		
		return SUCCESS;
	}
	
	/**
	 * 根据userCode，year，quarter统计这个季度的服务数据方法
	 * @return
	 */
	public String findServieDataByParam(){
		logger.info("进入根据userCode，year，quarter统计这个季度的服务数据方法:"+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixBackstageService.findServieDataByParam(params);
		if (result.get("serviceData") != null) {
			jsonMap.put("status", "1");
			jsonMap.put("serviceData", result.get("serviceData"));
		}else {
			jsonMap.put("status", "0");
		}
		return SUCCESS;
	}
	
	/**
	 * 获取区级报表审核列表
	 * @return
	 */
	public String findStatementAuditList(){
		logger.info("进入获取区级报表审核列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixBackstageService.findStatementAuditList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("statementAuditList", result.get("statementAuditList"));
		
		jsonMap.put("matrixCount", result.get("matrixCount"));
		jsonMap.put("floorSpaceE", result.get("floorSpaceE"));
		jsonMap.put("personnelQuantity", result.get("personnelQuantity"));
		jsonMap.put("tutorQuantity", result.get("tutorQuantity"));
		jsonMap.put("enterpriseCount", result.get("enterpriseCount"));
		jsonMap.put("smeCount", result.get("smeCount"));
		jsonMap.put("personnelQuantityE", result.get("personnelQuantityE"));
		jsonMap.put("totalAssets", result.get("totalAssets"));
		jsonMap.put("income", result.get("income"));
		jsonMap.put("coopCount", result.get("coopCount"));
		jsonMap.put("coopService", result.get("coopService"));
		jsonMap.put("serviceCount", result.get("serviceCount"));
		jsonMap.put("service", result.get("service"));
		jsonMap.put("enterCount", result.get("enterCount"));
		jsonMap.put("personCount", result.get("personCount"));
		jsonMap.put("incomeProportion", result.get("incomeProportion"));
		
		return SUCCESS;
	}
	
	/**
	 * 获取区级报表审核列表信息，不分页
	 * @return
	 */
	public String findStatementAuditListNoPage(){
		logger.info("进入获取区级报表审核列表信息，不分页方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixBackstageService.findStatementAuditListNoPage(params);
		if (result.get("statementAuditList") != null) {
			jsonMap.put("status", 1);
			jsonMap.put("statementAuditList", result.get("statementAuditList"));
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 查询已经填写了报表的年份和季度
	 * @return
	 */
	public String findHaveQuarterStatementTime(){
		logger.info("进入查询已经填写了报表的年份和季度方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		List<Map<String, Object>> result = exemplaryMatrixBackstageService.findHaveQuarterStatementTime(params);
		
		if (null!=result && 0!=result.size()) {
			jsonMap.put("status", 1);
			jsonMap.put("times", result);
		}else{
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 保存服务情况汇总
	 * @return
	 */
	public String saveExemplaryMatrixServiceSituation(){
		logger.info("进入保存服务情况汇总方法："+PrintLine.getInfo());
		Integer result = exemplaryMatrixBackstageService.saveExemplaryMatrixServiceSituation(this.getRequest());
		if (result >0) {
			jsonMap.put("status", 1);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
		
	}
	
	/**
	 * 通过userCode，year，quarter获取服务情况汇总信息
	 * @return
	 */
	public String findExemplaryMatrixServiceSituationByParams(){
		logger.info("进入通过userCode，year，quarter获取服务情况汇总信息方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		
		List<ExemplaryMatrixServiceSituation> exemplaryMatrixServiceSituations = exemplaryMatrixBackstageService.findExemplaryMatrixServiceSituationByParams(params);
		if (null != exemplaryMatrixServiceSituations && exemplaryMatrixServiceSituations.size()!=0) {
			jsonMap.put("status", 1);
			jsonMap.put("exemplaryMatrixServiceSituations", exemplaryMatrixServiceSituations);
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 数据统计页面，根据条件各种统计
	 * @return
	 */
	public String findServiceCount(){
		logger.info("进入数据统计页面，根据条件各种统计方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Integer> result = exemplaryMatrixBackstageService.findServiceCount(params);
		if (result != null) {
			jsonMap.put("status", 1);
			jsonMap.put("serviceCount", result.get("serviceCount"));
			jsonMap.put("onlineCount", result.get("onlineCount"));
			jsonMap.put("offlineCount", result.get("offlineCount"));
			jsonMap.put("personCount", result.get("personCount"));
			jsonMap.put("enterCount", result.get("enterCount"));
		}else {
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 数据统计页面，获取线上数据详情
	 * @return
	 */
	public String findOnlineDataDetail(){
		logger.info("进入获取线上数据详情方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixBackstageService.findOnlineDataDetail(params);
		if (null!=result) {
			jsonMap.put("status", 1);
			jsonMap.put("dataList", result.get("dataList"));
		}else{
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	
	//----------------------------------------------------------------------------------------------------------------------------------------------------------//
	//三月底这两天新增的代码
	/**
	 * 市级统计页面列表页
	 * @return
	 */
	public String findServiceDataStatisticsCity(){
		logger.info("进入市级统计页面列表页方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixBackstageService.findServiceDataStatisticsCity(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("districtList", result.get("districtList"));
		
		jsonMap.put("matrixCount", result.get("matrixCount"));
		jsonMap.put("floorSpaceE", result.get("floorSpaceE"));
		jsonMap.put("personnelQuantity", result.get("personnelQuantity"));
		jsonMap.put("tutorQuantity", result.get("tutorQuantity"));
		jsonMap.put("enterpriseCount", result.get("enterpriseCount"));
		jsonMap.put("smeCount", result.get("smeCount"));
		jsonMap.put("personnelQuantityE", result.get("personnelQuantityE"));
		jsonMap.put("totalAssets", result.get("totalAssets"));
		jsonMap.put("income", result.get("income"));
		jsonMap.put("coopCount", result.get("coopCount"));
		jsonMap.put("coopService", result.get("coopService"));
		jsonMap.put("serviceCount", result.get("serviceCount"));
		jsonMap.put("service", result.get("service"));
		jsonMap.put("enterCount", result.get("enterCount"));
		jsonMap.put("personCount", result.get("personCount"));
		jsonMap.put("incomeProportion", result.get("incomeProportion"));
		
		return SUCCESS;
	}
	
	
	/**
	 * 获取在线数据列表
	 * @return
	 */
	public String findOnlineDataList(){
		logger.info("进入 获取在线数据列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixBackstageService.findOnlineDataList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("exemplaryMatrixOnlineDatas", result.get("exemplaryMatrixOnlineDatas"));
		return SUCCESS;
	}
	
	/**
	 * 获取线下数据列表
	 * @return
	 */
	public String findOfflineDataList(){
		logger.info("进入获取线下数据列表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Map<String, Object> result = exemplaryMatrixBackstageService.findOfflineDataList(params);
		jsonMap.put("count", result.get("count"));
		jsonMap.put("exemplaryMatrixServiceDatas",result.get("exemplaryMatrixServiceDatas"));
		return SUCCESS;
	}
	
	/**
	 * 通过id删除服务数据表
	 * @return
	 */
	public String deleteServiceDataById(){
		logger.info("进入通过id删除服务数据表方法："+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		Integer result = exemplaryMatrixBackstageService.deleteServiceDataById(params);
		if (result >0) {
			jsonMap.put("status", 1);
		}else{
			jsonMap.put("status", 0);
		}
		return SUCCESS;
	}
	
	/**
	 * 根据serviceId查询线上数据表的数据
	 * @return
	 */
	public String findOnlineDataById(){
		logger.info("进入根据serviceId查询线上数据表的数据方法:"+PrintLine.getInfo());
		logger.info("传入参数为："+params);
		ExemplaryMatrixOnlineData exemplaryMatrixOnlineData = exemplaryMatrixBackstageService.findOnlineDataById(params);
		if (exemplaryMatrixOnlineData == null) {
			jsonMap.put("status", 0);
		}else {
			jsonMap.put("status", 1);
			jsonMap.put("exemplaryMatrixOnlineData", exemplaryMatrixOnlineData);
		}
		
		return SUCCESS;
	}
	
	
}
