//获得当前工程路径方法
function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
//    return(localhostPaht+projectName);
    return(projectName);
}

//将当前工程路径保存为成员变量供其他方法使用
var rootPath = getRootPath();


/**
 * 加载完执行
 */
$(function(){
	//加高亮
	$("#gotoThirdPartyAudit").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	getEnterpriseInfo(); 
	getMatrixInfoByCode();
	getBusinessCircumstanceByParams();
	getCooperationFacilitatingAgencyByParams();
	getServiceFunctionByParams();
	getPersonnelListByParams();
	getEnterpriseEvaluateByParams();
	
	$("#goBack").click(function(){
		window.location.href = window.location.href = rootPath+"/page/jsp/exemplaryMatrix/thirdPartyAuditList.jsp"
	})
	
	$("#nextStep").click(function(){
		window.location.href = window.location.href = rootPath+"/page/jsp/exemplaryMatrix/thirdPartyExamineInfoTwo.jsp?applicationUserCode="+applicationUserCode+"&applicationId="+applicationId+"&auditType="+auditType+"&auditFlag="+auditFlag;
	})
	
	getJiezhiriqi();
})


/**
 * 获取截止日期方法
 */
function getJiezhiriqi(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getNowTime.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var nowTime = data['nowTime'];
			var year = nowTime.substring(0,4);
			$("#jiezhiriqi").html("");
			$("#jiezhiriqi").html("申报单位从业人员数量（人）：<br>（截至"+(year-1)+"年12月31日）");
		}
	})
}

/**
 * 获取机构基本信息
 */
function getEnterpriseInfo(){
	//公司名
	$("#companyName").text("");
	
	//法人代表
	$("#legalRepresentative").text("");
	//注册资本
	$("#registeredCapital").text("");
	//企业网址
	$("#website").text("");
	
	//拼接请求参数
	var param = {'params.userCode':applicationUserCode};
	$.ajax({
		type: "post",
		url: rootPath+"/enterpriseInfo/selectEnterpriseInfoByUserCode.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: param,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			var enterpriseInfo = data['EnterpriseInfo'];
			if(1==status){
				
				//公司名
				$("#companyName").text(enterpriseInfo.companyName);
				
				//法人代表
				$("#legalRepresentative").text(enterpriseInfo.legalRepresentative);
				//注册资本
				$("#registeredCapital").text(enterpriseInfo.registeredCapital);
				//企业网址
				$("#website").text(enterpriseInfo.website);
			}
		}
	})
}

/**
 * 通过code获取基地信息
 */
function getMatrixInfoByCode(){
	$("#matrixName").text("");
	$("#establishTime").text("");
	$("#matrixAddress").text("");
	$("#competentDepartment").text("");
	$("#projectArea").text("");
	$("#buildingArea").text("");
	$("#ownArea").text("");
	$("#rentArea").text("");
	$("#commonalityArea").text("");
	$("#personnelQuantity").text("");
	$("#serviceStaff").text("");
	$("#instructorQuantity").text("");
	$("#facilitatingAgency").text("");
	$("#enterpriseQuantity").text("");
	
	$("#opticalFiber").text("");
	$("#broadband").text("");
	$("#wifi").text("");
	
	$("#developmentPlanning").text("");
	
	$("#goalOfDevelopment").text("");
	
	$("#managementSystem").text("");
	
	$("#feeScale").text("");
	
	$("#informationService").text("");
	$("#tutorship").text("");
	$("#innovationSupport").text("");
	$("#personnelTraining").text("");
	$("#marketing").text("");
	$("#financingService").text("");
	$("#managementConsultancy").text("");
	$("#otherService").text("");
	
	$("#modelSelfreport").text("");
	
	//联系人
	$("#contacter").text("");
	//联系电话
	$("#contactPhone").text("");
	
	$("#providePlace").text("");
	
	var params = {"params.userCode":applicationUserCode
					//,"params.applicationYear":applicationYear
					};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMatrixInfoByCode.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var exemplaryMatrixApplication = data['exemplaryMatrixApplication'];
				applicationId = exemplaryMatrixApplication.id;
				
				//联系人
				$("#contacter").text(exemplaryMatrixApplication.contacter);
				//联系电话
				$("#contactPhone").text(exemplaryMatrixApplication.contactPhone);
				$("#matrixName").text(exemplaryMatrixApplication.matrixName);
				$("#establishTime").text(exemplaryMatrixApplication.establishTime);
				$("#matrixAddress").text(exemplaryMatrixApplication.matrixAddress);
				$("#competentDepartment").text(exemplaryMatrixApplication.competentDepartment);
				$("#projectArea").text(exemplaryMatrixApplication.projectArea);
				$("#buildingArea").text(exemplaryMatrixApplication.buildingArea);
				$("#ownArea").text(exemplaryMatrixApplication.ownArea);
				$("#rentArea").text(exemplaryMatrixApplication.rentArea);
				$("#commonalityArea").text(exemplaryMatrixApplication.commonalityArea);
				$("#personnelQuantity").text(exemplaryMatrixApplication.personnelQuantity);
				$("#serviceStaff").text(exemplaryMatrixApplication.serviceStaff);
				$("#instructorQuantity").text(exemplaryMatrixApplication.instructorQuantity);
				$("#facilitatingAgency").text(exemplaryMatrixApplication.facilitatingAgency);
				$("#enterpriseQuantity").text(exemplaryMatrixApplication.enterpriseQuantity);
				
				$("#opticalFiber").text(exemplaryMatrixApplication.opticalFiber);
				$("#broadband").text(exemplaryMatrixApplication.broadband);
				$("#wifi").text(exemplaryMatrixApplication.wifi);
				
				var developmentPlanning = exemplaryMatrixApplication.developmentPlanning;
				if(developmentPlanning=="1"){
					$("#developmentPlanning").html("是&nbsp;&nbsp;&nbsp;&nbsp;<a href='"+exemplaryMatrixApplication.developmentPlanningUrl+"' style='text-decoration:underline;color:blue'>下载附件</a>");
				}else if(developmentPlanning == "0"){
					$("#developmentPlanning").text("否");
				}
				
				//基地年度发展目标
				var goalOfDevelopment = exemplaryMatrixApplication.goalOfDevelopment+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='"+exemplaryMatrixApplication.goalOfDevelopmentUrl+"' style='text-decoration:underline;color:blue'>下载附件</a>"
				$("#goalOfDevelopment").html(goalOfDevelopment);
				
				var managementSystem = exemplaryMatrixApplication.managementSystem;
				if(managementSystem == "1"){
					$("#managementSystem").html("是&nbsp;&nbsp;&nbsp;&nbsp;<a href='"+exemplaryMatrixApplication.managementSystemUrl+"' style='text-decoration:underline;color:blue'>下载附件</a>");
				}else if(managementSystem == "0"){
					$("#managementSystem").text("否");
				}
				
				var feeScale = exemplaryMatrixApplication.feeScale+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='"+exemplaryMatrixApplication.feeScaleUrl+"' style='text-decoration:underline;color:blue'>下载附件</a>"
				$("#feeScale").html(feeScale);
				
				//提供八个服务
				if(exemplaryMatrixApplication.informationService == null){
					$("#informationService").text("");
				}else{
					$("#informationService").text(exemplaryMatrixApplication.informationService);
				}
				
				if(exemplaryMatrixApplication.tutorship == null){
					$("#tutorship").text("");
				}else{
					$("#tutorship").text(exemplaryMatrixApplication.tutorship);
				}
				
				if(exemplaryMatrixApplication.innovationSupport == null){
					$("#innovationSupport").text("");
				}else{
					$("#innovationSupport").text(exemplaryMatrixApplication.innovationSupport);
				}
				
				if(exemplaryMatrixApplication.personnelTraining == null){
					$("#personnelTraining").text("");
				}else{
					$("#personnelTraining").text(exemplaryMatrixApplication.personnelTraining);
				}
				
				if(exemplaryMatrixApplication.marketing == null){
					$("#marketing").text("");
				}else{
					$("#marketing").text(exemplaryMatrixApplication.marketing);
				}
				
				if(exemplaryMatrixApplication.financingService == null){
					$("#financingService").text("");
				}else{
					$("#financingService").text(exemplaryMatrixApplication.financingService);
				}
				
				if(exemplaryMatrixApplication.managementConsultancy == null){
					$("#managementConsultancy").text("");
				}else{
					$("#managementConsultancy").text(exemplaryMatrixApplication.managementConsultancy);
				}
				
				if(exemplaryMatrixApplication.otherService == null){
					$("#otherService").text("");
				}else{
					$("#otherService").text(exemplaryMatrixApplication.otherService);
				}
				
				$("#modelSelfreport").text(exemplaryMatrixApplication.modelSelfreport);
				
				$("#providePlace").text(exemplaryMatrixApplication.providePlace);
			}
		}
	})
}

/**
 * 经营情况列表
 */
function getBusinessCircumstanceByParams(){
	$("#businessCircumstance").empty();
	
	var params = {"params.userCode":applicationUserCode,
					"params.exemplaryMatrixApplicationId":applicationId};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getBusinessCircumstanceByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var businessCircumstances = data['businessCircumstances'];
				var html = "";
				for(var i=0;i<businessCircumstances.length;i++){
					html += '<tr>';
					html += '<td width="10%">'+businessCircumstances[i].year+'</td>';
					html += '<td width="12%">'+businessCircumstances[i].totalAssets+'</td>';
					html += '<td width="15%">'+businessCircumstances[i].operationRevenue+'</td>';
					html += '<td width="15%">'+businessCircumstances[i].enterpriseQuantity+'</td>';
					html += '<td width="15%">'+businessCircumstances[i].smallMicroEnterpriseQuantity+'</td>';
					html += '<td width="18%" >'+businessCircumstances[i].proportion+'</td>';
					html += '<td width="15%" >'+businessCircumstances[i].personnelQuantity+'</td>';
					html += '</tr>';
				}
				$("#businessCircumstance").append(html);
			}
		}
	})
}

/**
 * 合作服务机构信息
 */
function getCooperationFacilitatingAgencyByParams(){
	$("#cooperationFacilitatingAgency").empty();
	
	var params = {"params.userCode":applicationUserCode,
					"params.exemplaryMatrixApplicationId":applicationId};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getCooperationFacilitatingAgencyByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var cooperationFacilitatingAgencies = data['cooperationFacilitatingAgencies'];
				var html = "";
				for(var i=0;i<cooperationFacilitatingAgencies.length;i++){
					html += '<tr>';
					html += '<td width="30%">'+cooperationFacilitatingAgencies[i].cooperativeFacilitatingAgencyName+'</td>';
					html += '<td width="40%">'+cooperationFacilitatingAgencies[i].serviceItems+'</td>';
					html += '<td width="30%">'+cooperationFacilitatingAgencies[i].signingTime+'</td>';
					html += '</tr>';
				}
				$("#cooperationFacilitatingAgency").append(html);
				
			}
		}
	})
}

/**
 * 服务功能
 */
function getServiceFunctionByParams(){
	$("#serviceFunction").empty();
	
	var params = {"params.userCode":applicationUserCode,
					"params.exemplaryMatrixApplicationId":applicationId};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getServiceFunctionByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var serviceFunctions = data['serviceFunctions'];
				var html = "";
				for(var i=0;i<serviceFunctions.length;i++){
					html += '<tr>';
					html += '<td width="30%">'+serviceFunctions[i].serviceItems+'</td>';
					html += '<td width="40%">'+serviceFunctions[i].serviceScale+'</td>';
					html += '<td width="30%">'+serviceFunctions[i].proportion+'</td>';
					html += '</tr>';
				}
			}
			$("#serviceFunction").append(html);
		}
	})
}

/**
 * 管理服务人员名单
 */
function getPersonnelListByParams(){
	$("#personnelList").empty();
	
	var params = {"params.userCode":applicationUserCode,
					"params.exemplaryMatrixApplicationId":applicationId};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getPersonnelListByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var personnelLists = data['personnelLists'];
				var html = "";
				for(var i=0;i<personnelLists.length;i++){
					html += '<tr>';
					html += '<td width="10%">'+personnelLists[i].no+'</td>';
					html += '<td width="10%">'+personnelLists[i].name+'</td>';
					if(personnelLists[i].sex == "1"){
						html += '<td width="10%">男</td>';
					}else if(personnelLists[i].sex == "0"){
						html += '<td width="10%">女</td>';
					}
					html += '<td width="10%">'+personnelLists[i].age+'</td>';
					html += '<td width="15%">'+personnelLists[i].educationBackground+'</td>';
					html += '<td width="12%">'+personnelLists[i].duty+'</td>';
					html += '<td width="13%">'+personnelLists[i].professionalTitle+'</td>';
					html += '<td width="20%">'+personnelLists[i].jobContent+'</td>';
					html += '</tr>';
				}
				$("#personnelList").append(html);
			}
		}
	})
}

/**
 * 入驻企业评价
 */
function getEnterpriseEvaluateByParams(){
	$("#enterpriseEvaluate").empty();
	
	var params = {"params.userCode":applicationUserCode,
					"params.exemplaryMatrixApplicationId":applicationId};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getEnterpriseEvaluateByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var enterpriseEvaluates = data['enterpriseEvaluates'];
				var html = "";
				for(var i=0;i<enterpriseEvaluates.length;i++){
					html += '<tr>';
					html += '<td width="7%">'+enterpriseEvaluates[i].no+'</td>';
					html += '<td width="13%">'+enterpriseEvaluates[i].enterpriseName+'</td>';
					html += '<td width="15%">'+enterpriseEvaluates[i].legalRepresentative+'</td>';
					html += '<td width="10%">'+enterpriseEvaluates[i].entryTime+'</td>';
					html += '<td width="10%">'+enterpriseEvaluates[i].personnelQuantity+'</td>';
					html += '<td width="12%">'+enterpriseEvaluates[i].contactPhone+'</td>';
					html += '<td width="20%">'+enterpriseEvaluates[i].enjoyService+'</td>';
					if(enterpriseEvaluates[i].evaluate == "2"){
						html += '<td width="13%">很满意</td>';
					}else if(enterpriseEvaluates[i].evaluate == "1"){
						html += '<td width="13%">基本满意</td>';
					}else if(enterpriseEvaluates[i].evaluate == "0"){
						html += '<td width="13%">不满意</td>';
					}
					
					html += '</tr>';
				}
				$("#enterpriseEvaluate").append(html);
			}
		}
	})
}
