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
 * 加载后执行
 */
$(function(){
	if(auditFlag=="1"){
		//加高亮
		$("#exemplaryMatrixMonthlyAudit").addClass("leeOn");
		$(".leeOn").parents(".hsubnav").find("dl").show();
		$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
		$(".leeOn").parents(".hsubnav").find("i").addClass("open");
		$(".leeOn").parents("dd").show();
	}else{
		//加高亮
		$("#exemplaryMatrixStetementList").addClass("leeOn");
		$(".leeOn").parents(".hsubnav").find("dl").show();
		$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
		$(".leeOn").parents(".hsubnav").find("i").addClass("open");
		$(".leeOn").parents("dd").show();
	}
	
	//获取填写了月报的年份并插入下拉框
	getMonthlyStatementYears();
	
	if(type == '3'){
		$("#goBack").click(function(){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/statementListCity.jsp";
		})
	}else{
		$("#goBack").click(function(){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/statementList.jsp";
		})
	}
	//审核报表时的返回按钮（两个返回）
	$(".auditGoBack").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/districtAuditMonthlyStatement.jsp";
	})
	//审核报表时的下一步按钮
	$("#nextStep").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/examineQuarterStatement.jsp?paramYear="+paramYear+"&paramMonth="+paramMonth+"&matrixCode="+matrixCode+"&auditFlag=1";
	})
	
	//通过按钮
	$("#pass").click(function(){
		if(confirm("确定审核通过？")){
			auditStatement(1);
		}
	})
	//不通过按钮
	$("#noPass").click(function(){
		if(confirm("确定审核不通过？")){
			//不通过状态置成2
			auditStatement(2);
		}
	})
	
	getMatrixInfoByCode();
	
	//审核报表时传入参数
	setParam();
	
	//判断按钮展示
	judgmentButton();
	
	getList();
})

/**
 * 查看月报时获取哪年填写了报表
 */
function getMonthlyStatementYears(){
	var params = {"params.userCode":matrixCode};
	//清空列表
	$("#year").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMonthlyStatementYears.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var myDate = new Date();
			var year = myDate.getFullYear();
			var html = "";
			var status = data['status'];
			if(status == 0){
				html += '<option value="'+year+'">'+year+'</option>';
			}else if(status == 1){
				var years = data['years'];
				for(var i=0;i<years.length;i++){
					if(years[i].year == year){
						html += '<option value="'+years[i].year+'" selected="selected">'+years[i].year+'</option>'
					}else{
						html += '<option value="'+years[i].year+'">'+years[i].year+'</option>'
					}
				}
			}
			$("#year").append(html);
			$("#year").selectOrDie('destroy');
			$("#year").selectOrDie();
		}
	})
}

/**
 * 审核报表方法
 * @param auditType
 */
function auditStatement(auditType){
	var params = {"params.matrixCode":matrixCode,
					"params.year":paramYear,
					"params.month":paramMonth,
					"params.auditType":auditType}
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/districtAuditStatement.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				alert("审核成功！");
				//发送站内信
				if(auditType == "1"){
					sendletter(matrixCode,"您提交的月报区级审核已通过，请点击查看",2,"暂时没有","22012");
				}else if(auditType == "2"){
					sendletter(matrixCode,"您提交的月报区级审核未通过，请点击查看",2,"暂时没有","22012");
				}
				
				window.location.href = rootPath+"/page/jsp/exemplaryMatrix/districtAuditMonthlyStatement.jsp";
			}else if(status == "0"){
				alert("审核失败！");
			}
		}
	})
}

/**
 * 审核是根据传入的参数往年和月里塞值，查看时根据当前日期往年和月里塞值
 */
function setParam(){
	if(auditFlag == "1" && paramYear!="" && paramMonth!=""){
		$("#year option[value='"+paramYear+"']").attr("selected",true);
		$("#year").attr("disabled","disabled");
		
		$("#month option[value='"+paramMonth+"']").attr("selected",true);
		$("#month").attr("disabled","disabled");
	}else{
		var myDate = new Date();
		var year = myDate.getFullYear();
		var month = myDate.getMonth()+1;
		
		$("#year option[value='"+year+"']").attr("selected",true);
		$("#month").selectOrDie('destroy');
		$("#month option[value='"+month+"']").attr("selected",true);
		$("#month").selectOrDie();
	}
	
	$("#year").selectOrDie('destroy');
	$("#year").selectOrDie();
	
	$("#month").selectOrDie('destroy');
	$("#month").selectOrDie();
}

/**
 * 判断按钮的展示
 */
function judgmentButton(){
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth()+1;
	var nextStepFlag = false;
	
	//一月，四月，七月，十月为季度后首月，需要填写上一季度季度报表
	if(month == 1 || month == 4 || month == 7 || month == 10){
		nextStepFlag = true;
	}
	
	
	if(auditFlag=="" || auditFlag=="0"){
		$("#onlyExamine").show();
		$("#audit").hide();
		$("#haveNextStep").hide();
	}else if(auditFlag=="1" && nextStepFlag){
		$("#onlyExamine").hide();
		$("#audit").hide();
		$("#haveNextStep").show();
	}else if(auditFlag=="1" && !nextStepFlag){
		$("#onlyExamine").hide();
		$("#audit").show();
		$("#haveNextStep").hide();
	}
}

/**
 * 通过code获取基地信息
 */
function getMatrixInfoByCode(){
	$("#matrixName").text("");
	var params = {"params.userCode":matrixCode};
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
				$("#matrixName").text(exemplaryMatrixApplication.matrixName);
			}else if(status == "0"){
				alert("查询基地信息失败");
			}
		}
	})
}

/**
 * 查询月度报表方法
 */
function getList(){
	getServiceDataList(getServiceDataListParams(serviceDataCurrentPage));
	getOfficeEquipmentList(getOfficeEquipmentListParams(officeEquipmentCurrentPage));
	getDecorationList(getDecorationListParams(decorationCurrentPage));
}

/**
 * 获取服务数据参数
 */
function getServiceDataListParams(serviceDataCurrentPage){
	
	var year = $("#year").val();
	var month = $("#month").val();
	
	var auditType = "";
	if(auditFlag != "1"){
		auditType="1";
	}
	
	var params = {'params.matrixCode':matrixCode,
					'params.year':year,
					'params.month':month,
					'params.auditType':auditType,
					'params.currentPage':serviceDataCurrentPage,
				  	'params.pageSize':serviceDataPageSize};
	return params;
}

/**
 * 服务数据分页回调
 */
function serviceDataPageCallback(index,jq){
	serviceDataCurrentPage = index + 1;
	getServiceDataList(getServiceDataListParams(serviceDataCurrentPage));
}

/**
 * 获取服务数据列表
 * @param params
 */
function getServiceDataList(params){
	//清空列表
	$("#serviceDataList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getServiceDataListByCode.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			serviceDataTotalPage=Math.ceil(data['count']/serviceDataPageSize);
			var monthlyServiceDatas = data['monthlyServiceDatas'];
			
			//20170629添加判断，审核后不展示审核按钮
			//TODO
			if(monthlyServiceDatas!=""){
				if(monthlyServiceDatas[0].auditType!="0" && auditFlag == "1"){
					$("#audit").hide();
					
					$("#goBack").unbind("click");
					//查看报表时的返回按钮
					$("#goBack").click(function(){
						window.location.href = rootPath+"/page/jsp/exemplaryMatrix/districtAuditMonthlyStatement.jsp";
					})
				}
			}
			
			
			var html = "";
			if(monthlyServiceDatas.length!=0){
				for(var i=0; i<monthlyServiceDatas.length; i++){
					html += '<tr>'
					html += '<td>'+monthlyServiceDatas[i].serviceClass+'</td>';
					html += '<td>'+monthlyServiceDatas[i].time+'</td>';
					html += '<td>'+monthlyServiceDatas[i].site+'</td>';
					html += '<td>'+monthlyServiceDatas[i].title+'</td>';
					html += '<td>'+monthlyServiceDatas[i].number+'</td>';
					html += '<td>'+monthlyServiceDatas[i].enterNumber+'</td>';
					html += '<td class="link_blue"><a class=" undL2_zy" href="'+monthlyServiceDatas[i].picture+'">下载</a></td>';
					html += '<td>'+monthlyServiceDatas[i].sketch+'</td>';
					html += '</tr>';
				}
			}else{
				html = "<tr><td>未查询到数据或当月数据未通过审核！</td></tr>";
			}
			
			$("#serviceDataList").append(html);
			
			
			$("#serviceDataPage").pagination(serviceDataTotalPage,{
				callback: serviceDataPageCallback,
				items_per_page : 1,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : serviceDataCurrentPage - 1,
				link_to : 'javascript:void(0)'
			});
			$("#serviceDataTotalPage").text("共"+serviceDataTotalPage+"页");
			
		}
	})
}




/**
 * 获取办公设备列表参数
 */
function getOfficeEquipmentListParams(officeEquipmentCurrentPage){
	
	var year = $("#year").val();
	var month = $("#month").val();
	
	var auditType = "";
	if(auditFlag != "1"){
		auditType="1";
	}
	
	var params = {'params.matrixCode':matrixCode,
					'params.year':year,
					'params.month':month,
					'params.auditType':auditType,
					'params.currentPage':officeEquipmentCurrentPage,
				  	'params.pageSize':officeEquipmentPageSize};
	return params;
}

/**
 * 服务数据分页回调
 */
function officeEquipmentPageCallback(index,jq){
	officeEquipmentCurrentPage = index + 1;
	getOfficeEquipmentList(getOfficeEquipmentListParams(officeEquipmentCurrentPage));
}

/**
 * 获取服务数据列表
 * @param params
 */
function getOfficeEquipmentList(params){
	//清空列表
	$("#officeEquipmentList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getOfficeEquipmentListByCode.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			officeEquipmentTotalPage=Math.ceil(data['count']/officeEquipmentPageSize);
			
			var monthlyOfficeEquipments = data['monthlyOfficeEquipments'];
			var html = "";
			if(monthlyOfficeEquipments.length!=0){
				for(var i=0; i<monthlyOfficeEquipments.length; i++){
					html += '<tr>'
					if(monthlyOfficeEquipments[i].equipmentName=="" || monthlyOfficeEquipments[i].equipmentName == null || monthlyOfficeEquipments[i].equipmentName == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td>'+monthlyOfficeEquipments[i].equipmentName+'</td>'
					}
					
					if(monthlyOfficeEquipments[i].count=="" || monthlyOfficeEquipments[i].count == null || monthlyOfficeEquipments[i].count == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td>'+monthlyOfficeEquipments[i].count+'</td>'
					}
					
					if(monthlyOfficeEquipments[i].invoiceNo=="" || monthlyOfficeEquipments[i].invoiceNo == null || monthlyOfficeEquipments[i].invoiceNo == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td>'+monthlyOfficeEquipments[i].invoiceNo+'</td>'
					}
					
					html += '</tr>';
				}
			}else{
				html = "<tr><td>未查询到数据或当月数据未通过审核！</td></tr>";
			}
			
			$("#officeEquipmentList").append(html);
			
			
			$("#officeEquipmentPage").pagination(officeEquipmentTotalPage,{
				callback: officeEquipmentPageCallback,
				items_per_page : 1,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : officeEquipmentCurrentPage - 1,
				link_to : 'javascript:void(0)'
			});
			$("#officeEquipmentTotalPage").text("共"+officeEquipmentTotalPage+"页");
			
		}
	})
}




/**
 * 获取装修改造参数
 */
function getDecorationListParams(decorationCurrentPage){
	
	var year = $("#year").val();
	var month = $("#month").val();
	
	var auditType = "";
	if(auditFlag != "1"){
		auditType="1";
	}
	
	
	var params = {'params.matrixCode':matrixCode,
					'params.year':year,
					'params.month':month,
					'params.auditType':auditType,
					'params.currentPage':decorationCurrentPage,
				  	'params.pageSize':decorationPageSize};
	return params;
}

/**
 * 装修改造分页回调
 */
function decorationPageCallback(index,jq){
	decorationCurrentPage = index + 1;
	getDecorationList(getDecorationListParams(decorationCurrentPage));
}

/**
 * 获取装修改造列表
 * @param params
 */
function getDecorationList(params){
	//清空列表
	$("#decorationList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getDecorationListByCode.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			decorationTotalPage=Math.ceil(data['count']/decorationPageSize);
			
			var monthlyDecorations = data['monthlyDecorations'];
			var html = "";
			if(monthlyDecorations.length!=0){
				for(var i=0; i<monthlyDecorations.length; i++){
					html += '<tr>';
					if(monthlyDecorations[i].contractName=="" || monthlyDecorations[i].contractName == null || monthlyDecorations[i].contractName == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td>'+monthlyDecorations[i].contractName+'</td>';
					}
					
					if(monthlyDecorations[i].contractNo=="" || monthlyDecorations[i].contractNo == null || monthlyDecorations[i].contractNo == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td>'+monthlyDecorations[i].contractNo+'</td>';
					}
					
					if(monthlyDecorations[i].contractContents=="" || monthlyDecorations[i].contractContents == null || monthlyDecorations[i].contractContents == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td>'+monthlyDecorations[i].contractContents+' </td>';
					}
					
					if(monthlyDecorations[i].invoiceNo=="" || monthlyDecorations[i].invoiceNo == null || monthlyDecorations[i].invoiceNo == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td>'+monthlyDecorations[i].invoiceNo+'</td>';
					}
					html += '</tr>';
				}
			}else{
				html = "<tr><td>未查询到数据或当月数据未通过审核！</td></tr>";
			}
			
			$("#decorationList").append(html);
			
			
			$("#decorationPage").pagination(decorationTotalPage,{
				callback: decorationPageCallback,
				items_per_page : 1,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : decorationCurrentPage - 1,
				link_to : 'javascript:void(0)'
			});
			$("#decorationTotalPage").text("共"+decorationTotalPage+"页");
			
		}
	})
}