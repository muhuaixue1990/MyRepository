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
	if(userTypeForDetail == "3"){
		//加高亮
		$("#exemplaryMatrixUserManage").addClass("leeOn");
		$(".leeOn").parents(".hsubnav").find("dl").show();
		$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
		$(".leeOn").parents(".hsubnav").find("i").addClass("open");
		$(".leeOn").parents("dd").show();
	}else if(userTypeForDetail == "6"){
		//加高亮
		$("#exemplaryMatrixStetementList").addClass("leeOn");
		$(".leeOn").parents(".hsubnav").find("dl").show();
		$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
		$(".leeOn").parents(".hsubnav").find("i").addClass("open");
		$(".leeOn").parents("dd").show();
	}
	
	//获取基地信息
	getMatrixInfoByCode();
	
	//设置标题方法
	setTitle();
	
	//获取当前时间
	getNowTime();
	
	//设置年份和季度下拉框
	getMonthlyStatementYears();
	
	//获取数据方法
	getList();
	
	//查询按钮
	$("#search").click(function(){
		getList();
	})
	
	if(userTypeForDetail == "3"){
		//返回按钮
		$("#goBack").click(function(){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/cityMatrixUserManage.jsp";
		})
	}else if(userTypeForDetail == "6"){
		//返回按钮
		$("#goBack").click(function(){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/districtMatrixManage.jsp";
		})
	}
	
	//线上详情
	$("#serviceDataTable").on("click",".serviceDataDetail",function(){
		var name = $(this).attr("name");
		var nameAttr = name.split(",");
		var userCode = nameAttr[0];
		var paramYear = nameAttr[1];
		var paramQuarter = nameAttr[2];
		var lineType = nameAttr[3];
		var activityClass = nameAttr[4];
		var auditType = nameAttr[5];
		if(userTypeForDetail == '3'){
			window.location.href = rootPath + "/page/jsp/exemplaryMatrixNew/serviceDataDetail.jsp?userCode="+userCode+"&paramYear="+paramYear+"&paramQuarter="+paramQuarter+"&lineType="+lineType+"&activityClass="+activityClass+"&auditType="+auditType+"&left=exemplaryMatrixStetementListCity";
		}else if(userTypeForDetail == '6'){
			window.location.href = rootPath + "/page/jsp/exemplaryMatrixNew/serviceDataDetail.jsp?userCode="+userCode+"&paramYear="+paramYear+"&paramQuarter="+paramQuarter+"&lineType="+lineType+"&activityClass="+activityClass+"&auditType="+auditType+"&left=exemplaryMatrixStetementList";
		}
	})
})

/**
 * 查询报表方法
 */
function getList(){
	getServiceData();
	getOfficeEquipmentList(getOfficeEquipmentListParams(officeEquipmentCurrentPage));
	getDecorationList(getDecorationListParams(decorationCurrentPage));
	getQuarterInfo();
}

/**
 * 获取服务数据统计表方法
 */
function getServiceData(){
	var params = {'params.userCode':matrixCode,
					'params.serviceYear':$("#year").val(),
					'params.serviceQuarter':"4",
					'params.auditType':'1'};
	var paramYear = $("#year").val();
	var paramQuarter = '4';
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findServieDataByParam.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("查询该基地线服务数据失败！")
			}else if(status == "1"){
				var serviceData = data['serviceData'];
				$("#serviceDataTable").empty();
				var html = "";
				var exemplaryMatrixStatementManageViews = serviceData.exemplaryMatrixStatementManageViews;
				var activityCount = 0;
				var onlineCount = 0;
				var offlineCount = 0;
				var personnalCount = 0;
				for(var i=0;i<exemplaryMatrixStatementManageViews.length;i++){
					html += '<tr>'
						if(i == 0){
							html += '<td rowspan="2" width="116">信息服务</td>'
							html += '<td width="270">线上活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',online,103000001,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].onlineCount+'</td>'
							html += '</tr>'
							html += '<tr>'
							html += '<td>线下活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',offline,103000001,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].offlineCount+'</td>'
							html += '</tr>'
						}else if(i == 1){
							html += '<td rowspan="2" width="116">创业服务</td>'
							html += '<td width="270">线上活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',online,103000002,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].onlineCount+'</td>'
							html += '</tr>'
							html += '<tr>'
							html += '<td>线下活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',offline,103000002,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].offlineCount+'</td>'
							html += '</tr>'
						}else if(i == 2){
							html += '<td rowspan="2" width="116">创新支持</td>'
							html += '<td width="270">线上活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',online,103000003,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].onlineCount+'</td>'
							html += '</tr>'
							html += '<tr>'
							html += '<td>线下活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',offline,103000003,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].offlineCount+'</td>'
							html += '</tr>'
						}else if(i == 3){
							html += '<td rowspan="2" width="116">人员培训</td>'
							html += '<td width="270">线上活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',online,103000004,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].onlineCount+'</td>'
							html += '</tr>'
							html += '<tr>'
							html += '<td>线下活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',offline,103000004,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].offlineCount+'</td>'
							html += '</tr>'
						}else if(i == 4){
							html += '<td rowspan="2" width="116">市场营销</td>'
							html += '<td width="270">线上活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',online,103000005,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].onlineCount+'</td>'
							html += '</tr>'
							html += '<tr>'
							html += '<td>线下活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',offline,103000005,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].offlineCount+'</td>'
							html += '</tr>'
						}else if(i == 5){
							html += '<td rowspan="2" width="116">投融资服务</td>'
							html += '<td width="270">线上活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',online,103000006,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].onlineCount+'</td>'
							html += '</tr>'
							html += '<tr>'
							html += '<td>线下活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',offline,103000006,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].offlineCount+'</td>'
							html += '</tr>'
						}else if(i == 6){
							html += '<td rowspan="2" width="116">管理咨询</td>'
							html += '<td width="270">线上活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',online,103000007,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].onlineCount+'</td>'
							html += '</tr>'
							html += '<tr>'
							html += '<td>线下活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',offline,103000007,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].offlineCount+'</td>'
							html += '</tr>'
						}else if(i == 7){
							html += '<td rowspan="2" width="116">专业服务</td>'
							html += '<td width="270">线上活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',online,103000008,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].onlineCount+'</td>'
							html += '</tr>'
							html += '<tr>'
							html += '<td>线下活动</td>'
							html += '<td class="serviceDataDetail" name="'+matrixCode+','+paramYear+','+paramQuarter+',offline,103000008,1" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews[i].offlineCount+'</td>'
							html += '</tr>'
						}
					
//					html += '<tr>'
//					html += '<td>服务人数</td>'
//					html += '<td>'+exemplaryMatrixStatementManageViews[i].personCount+'</td>'
//					html += '</tr>'
						
					activityCount += exemplaryMatrixStatementManageViews[i].onlineCount;
					activityCount += exemplaryMatrixStatementManageViews[i].offlineCount;
					onlineCount += exemplaryMatrixStatementManageViews[i].onlineCount;
					offlineCount += exemplaryMatrixStatementManageViews[i].offlineCount;
					personnalCount += exemplaryMatrixStatementManageViews[i].personCount;
				}
				html += '<tr>'
				html += '<td colspan="2">总计</td>'
				html += '<td colspan="2" style="text-align:center">'+activityCount+'次</td>'
//					html += '<span class="ml30 mr40">'+activityCount+'次</span>'
//					html += '<span class="ml30 mr40">线上服务活动数： <b class="fs-16 fw_b_zy">'+onlineCount+'</b> 次</span>'
//					html += '<span class="ml30 mr40">线下服务活动数： <b class="fs-16 fw_b_zy">'+offlineCount+'</b> 次</span>'
//					html += '<span class="ml30">服务人数： <b class="fs-16 fw_b_zy">'+personnalCount+'</b> 人</span>'
//					html += '</td>'
                html += '</tr>'
                $("#serviceDataTable").append(html);
			}
		}
	})
}


/**
 * 获取办公设备列表参数
 */
function getOfficeEquipmentListParams(officeEquipmentCurrentPage){
	
	var year = $("#year").val();
	
	var params = {'params.matrixCode':matrixCode,
					'params.year':$("#year").val(),
					'params.allYear':"yes",
					'params.currentPage':officeEquipmentCurrentPage,
				  	'params.pageSize':officeEquipmentPageSize,
				  	'params.auditType':'1'};
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
					if(monthlyOfficeEquipments[i].month=="" || monthlyOfficeEquipments[i].month == null || monthlyOfficeEquipments[i].month == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyOfficeEquipments[i].month+'">'+monthlyOfficeEquipments[i].month+'</td>'
					}
						
					if(monthlyOfficeEquipments[i].equipmentName=="" || monthlyOfficeEquipments[i].equipmentName == null || monthlyOfficeEquipments[i].equipmentName == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyOfficeEquipments[i].equipmentName+'">'+monthlyOfficeEquipments[i].equipmentName+'</td>'
					}
					
					if(monthlyOfficeEquipments[i].count=="" || monthlyOfficeEquipments[i].count == null || monthlyOfficeEquipments[i].count == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyOfficeEquipments[i].count+'">'+monthlyOfficeEquipments[i].count+'</td>'
					}
					
					if(monthlyOfficeEquipments[i].invoiceNo=="" || monthlyOfficeEquipments[i].invoiceNo == null || monthlyOfficeEquipments[i].invoiceNo == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyOfficeEquipments[i].invoiceNo+'">'+monthlyOfficeEquipments[i].invoiceNo+'</td>'
					}
					
					if(monthlyOfficeEquipments[i].amountInvested=="" || monthlyOfficeEquipments[i].amountInvested == null || monthlyOfficeEquipments[i].amountInvested == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyOfficeEquipments[i].amountInvested+'">'+monthlyOfficeEquipments[i].amountInvested+'</td>'
					}
					
					if(monthlyOfficeEquipments[i].timeInvested=="" || monthlyOfficeEquipments[i].timeInvested == null || monthlyOfficeEquipments[i].timeInvested == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyOfficeEquipments[i].timeInvested+'">'+monthlyOfficeEquipments[i].timeInvested+'</td>'
					}
					
					html += '</tr>';
				}
			}else{
				html = "<tr><td>未查询到数据或当季度数据未通过审核！</td></tr>";
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
	
	var params = {'params.matrixCode':matrixCode,
					'params.year':$("#year").val(),
					'params.allYear':"yes",
					'params.currentPage':decorationCurrentPage,
				  	'params.pageSize':decorationPageSize,
				  	'params.auditType':'1'};
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
					
					if(monthlyDecorations[i].month=="" || monthlyDecorations[i].month == null || monthlyDecorations[i].month == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyDecorations[i].month+'">'+monthlyDecorations[i].month+'</td>';
					}
					
					if(monthlyDecorations[i].contractName=="" || monthlyDecorations[i].contractName == null || monthlyDecorations[i].contractName == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyDecorations[i].contractName+'">'+monthlyDecorations[i].contractName+'</td>';
					}
					
					if(monthlyDecorations[i].contractNo=="" || monthlyDecorations[i].contractNo == null || monthlyDecorations[i].contractNo == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyDecorations[i].contractNo+'">'+monthlyDecorations[i].contractNo+'</td>';
					}
					
					if(monthlyDecorations[i].contractContents=="" || monthlyDecorations[i].contractContents == null || monthlyDecorations[i].contractContents == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyDecorations[i].contractContents+'">'+monthlyDecorations[i].contractContents+' </td>';
					}
					
					if(monthlyDecorations[i].invoiceNo=="" || monthlyDecorations[i].invoiceNo == null || monthlyDecorations[i].invoiceNo == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyDecorations[i].invoiceNo+'">'+monthlyDecorations[i].invoiceNo+'</td>';
					}
					
					if(monthlyDecorations[i].amountInvested=="" || monthlyDecorations[i].amountInvested == null || monthlyDecorations[i].amountInvested == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyDecorations[i].amountInvested+'">'+monthlyDecorations[i].amountInvested+'</td>';
					}
					
					if(monthlyDecorations[i].timeInvested=="" || monthlyDecorations[i].timeInvested == null || monthlyDecorations[i].timeInvested == undefined){
						html += '<td> —— </td>'
					}else{
						html += '<td title="'+monthlyDecorations[i].timeInvested+'">'+monthlyDecorations[i].timeInvested+'</td>';
					}
					html += '</tr>';
				}
			}else{
				html = "<tr><td>未查询到数据或当季度数据未通过审核！</td></tr>";
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


/**
 * 获取原有季度列表信息
 */
function getQuarterInfo(){
	var params = {'params.userCode':matrixCode,
					'params.year':$("#year").val(),
					'params.allYear':"yes",
					'params.auditType':'1'};
	
	//清空列表
	$("#enterpriseList").empty();
	//清空列表
	$("#operatorList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getQuarterStatementList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var quarterStatementList = data['quarterStatementList'];
			var enterpriseHtml = "";
			var operatorHtml = "";
			if(quarterStatementList.length!=0){
				for(var i=0; i<quarterStatementList.length; i++){
					enterpriseHtml += '<tr>';
					enterpriseHtml += '<td title="">'+quarterStatementList[i].quarter+'</td>';
					enterpriseHtml += '<td title="'+quarterStatementList[i].enterpriseCount+'">'+quarterStatementList[i].enterpriseCount+'</td>';
					enterpriseHtml += '<td title="'+quarterStatementList[i].smeCount+'">'+quarterStatementList[i].smeCount+'</td>';
					enterpriseHtml += '<td title="'+quarterStatementList[i].totalAssetsE+'">'+quarterStatementList[i].totalAssetsE+'</td>';
					enterpriseHtml += '<td title="'+quarterStatementList[i].incomeE+'">'+quarterStatementList[i].incomeE+'</td>';
					enterpriseHtml += '<td title="'+quarterStatementList[i].profitE+'">'+quarterStatementList[i].profitE+'</td>';
					enterpriseHtml += '<td title="'+quarterStatementList[i].taxesE+'">'+quarterStatementList[i].taxesE+'</td>';
					enterpriseHtml += '<td title="'+quarterStatementList[i].personnelQuantityE+'">'+quarterStatementList[i].personnelQuantityE+'</td>';
					enterpriseHtml += '<td title="'+quarterStatementList[i].floorSpaceE+'">'+quarterStatementList[i].floorSpaceE+'</td>';
					enterpriseHtml += '</tr>';
					
					operatorHtml += '<tr>';
					operatorHtml += '<td title="">'+quarterStatementList[i].quarter+'</td>';
					operatorHtml += '<td title="'+quarterStatementList[i].totalAssets+'">'+quarterStatementList[i].totalAssets+'</td>';
					operatorHtml += '<td title="'+quarterStatementList[i].income+'">'+quarterStatementList[i].income+'</td>';
					operatorHtml += '<td title="'+quarterStatementList[i].profit+'">'+quarterStatementList[i].profit+'</td>';
					operatorHtml += '<td title="'+quarterStatementList[i].taxes+'">'+quarterStatementList[i].taxes+'</td>';
					operatorHtml += '<td title="'+quarterStatementList[i].personnelQuantity+'">'+quarterStatementList[i].personnelQuantity+'</td>';
					operatorHtml += '<td title="'+quarterStatementList[i].tutorQuantity+'">'+quarterStatementList[i].tutorQuantity+'</td>';
					operatorHtml += '<td width="220" title="'+quarterStatementList[i].incomeProportion+'">'+quarterStatementList[i].incomeProportion+'</td>';
					operatorHtml += '</tr>';
				}
			}else{
				enterpriseHtml = "<tr><td style='text-overflow: initial;overflow: visible;white-space: normal;'>未查询数据！</td></tr>";
				operatorHtml = "<tr><td colspan='6' style='text-overflow: initial;overflow: visible;white-space: normal;'>未查询到数据！</td></tr>";
			}
			
			$("#enterpriseList").append(enterpriseHtml);
			$("#operatorList").append(operatorHtml);
		}
	})
}




/**
 * 获取当前时间
 */
function getNowTime(){
	var nowTime = "";
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getNowTime.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			nowTime = data['nowTime'];
		}
	})
	//设置年份
	year = nowTime.substring(0,4);
}

/**
 * 设置年份和季度下拉框
 */
function getMonthlyStatementYears(){
	//清空列表
	$("#year").empty();
	
	var params = {"params.userCode":matrixCode}
	
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findHaveQuarterStatementTime.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var htmlYear = '';
			
			var status = data['status'];
			if(status == 0){
				htmlYear += '<option value="'+year+'">'+year+'</option>';
			
			}else if(status == 1){
				var times = data['times'];
				for(var i=0;i<times.length;i++){
					if(i!=0){
						if(times[i].serviceYear == times[i-1].serviceYear){
							continue;
						}
					}
					if(times[i].serviceYear == year){
						htmlYear += '<option value="'+times[i].serviceYear+'" selected="selected">'+times[i].serviceYear+'</option>'
					}else{
						htmlYear += '<option value="'+times[i].serviceYear+'">'+times[i].serviceYear+'</option>'
					}
				}
			}
			$("#year").append(htmlYear);
			$("#year").selectOrDie('destroy');
			$("#year").selectOrDie();
		}
	})
}


/**
 * 设置标题方法
 */
function setTitle(){
	$("#title").text("");
	var title = matrixName+" 基地";
	$("#title").text(title);
}


/**
 * 通过code获取基地信息
 */
function getMatrixInfoByCode(){
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
				matrixName = exemplaryMatrixApplication.matrixName;
			}else if(status == "0"){
				alert("查询基地信息失败");
			}
		}
	})
}