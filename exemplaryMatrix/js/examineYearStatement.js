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
	//加高亮
	$("#exemplaryMatrixStetementList").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	getYearStatementYears();
	
	getMatrixInfoByCode();
	getList();
	
	if(type == '3'){
		$("#goBack").click(function(){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/statementListCity.jsp";
		})
	}else{
		$("#goBack").click(function(){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/statementList.jsp";
		})
	}
})


/**
 * 查看年报时获取哪年填写了报表
 */
function getYearStatementYears(){
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
 * 通过服务类别统计数量
 */
function getStatisticalByServiceType(){
	var year = $("#year").val();
	var auditType = "1";
	$("#statisticalByServiceTypeList").empty();
	var params = {"params.year":year,
					"params.auditType":auditType,
					"params.userCode":matrixCode};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getStatisticalByServiceType.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var result = data['result'];
				var html = "";
				for(var i=0;i<result.length;i++){
					html += '<tr>';
					html += '<td>'+result[i].serviceName+'</td>';
					html += '<td>'+result[i].count+'</td>';
					html += '</tr>';
				}
				
				$("#statisticalByServiceTypeList").append(html);
			}
		}
	})
	
	
}

function getList(){
	getStatisticalByServiceType();
	getOfficeEquipmentList(getOfficeEquipmentListParams(officeEquipmentCurrentPage));
	getDecorationList(getDecorationListParams(decorationCurrentPage));
	getQuarterStatement();
}


/**
 * 获取办公设备列表参数
 */
function getOfficeEquipmentListParams(officeEquipmentCurrentPage){
	
	var year = $("#year").val();
	var month = $("#month").val();
	var auditType = "1"
	
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
					html += '<td>'+monthlyOfficeEquipments[i].month+'</td>';
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
				html = "<tr><td>未查询到数据</td></tr>";
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
	var auditType = "1"
		
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
					html += '<td>'+monthlyDecorations[i].month+'</td>';
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
				html = "<tr><td>未查询到数据</td></tr>";
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
 * 获取第四季度报表信息
 */
function getQuarterStatement(){
	var year = $("#year").val();
	var quarter = 4;
	var auditType = 1;
	
	var params = {'params.userCode':matrixCode,
					'params.year':year,
					'params.quarter':quarter,
					'params.auditType':auditType};
	
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
					enterpriseHtml += '<td>'+quarterStatementList[i].enterpriseCount+'</td>';
					enterpriseHtml += '<td>'+quarterStatementList[i].totalAssetsE+'</td>';
					enterpriseHtml += '<td>'+quarterStatementList[i].incomeE+'</td>';
					enterpriseHtml += '<td>'+quarterStatementList[i].profitE+'</td>';
					enterpriseHtml += '<td>'+quarterStatementList[i].taxesE+'</td>';
					enterpriseHtml += '<td>'+quarterStatementList[i].personnelQuantityE+'</td>';
					enterpriseHtml += '<td>'+quarterStatementList[i].floorSpaceE+'</td>';
					enterpriseHtml += '</tr>';
					
					operatorHtml += '<tr>';
					operatorHtml += '<td>'+quarterStatementList[i].totalAssets+'</td>';
					operatorHtml += '<td>'+quarterStatementList[i].income+'</td>';
					operatorHtml += '<td>'+quarterStatementList[i].profit+'</td>';
					operatorHtml += '<td>'+quarterStatementList[i].taxes+'</td>';
					operatorHtml += '<td>'+quarterStatementList[i].personnelQuantity+'</td>';
					operatorHtml += '<td>'+quarterStatementList[i].tutorQuantity+'</td>';
					operatorHtml += '</tr>';
				}
			}else{
				enterpriseHtml = "<tr><td colspan='7'>未查询到数据或第四季度数据未通过审核</td></tr>";
				operatorHtml = "<tr><td colspan='6'>未查询到数据或第四季度数据未通过审核</td></tr>";
			}
			
			$("#enterpriseList").append(enterpriseHtml);
			$("#operatorList").append(operatorHtml);
		}
	})
}

