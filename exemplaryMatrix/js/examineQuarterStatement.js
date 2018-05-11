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
	
	
	//查看季度报表时获取哪年填写了报表
	getQuarterStatementYears();
	
	if(type == '3'){
		$("#goBack").click(function(){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/statementListCity.jsp";
		})
	}else{
		$("#goBack").click(function(){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/statementList.jsp";
		})
	}
	
	
	//审核报表时的返回按钮
	$(".auditGoBack").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/districtAuditMonthlyStatement.jsp";
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
 * 查看季度报表时获取哪年填写了报表
 */
function getQuarterStatementYears(){
	var params = {"params.userCode":matrixCode};
	//清空列表
	$("#year").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getQuarterStatementYears.action",
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
 * 审核报表时传入年份和月份参数
 */
function setParam(){
	var quarter = "";
	if(auditFlag == "1" && paramYear!="" && paramMonth!=""){
		//一月，四月，七月，十月为季度后首月，需要填写上一季度季度报表
		if(paramMonth == 1){
			paramYear = paramYear-1;
			quarter = 4;
		}else if(paramMonth == 4){
			quarter = 1;
		}else if(paramMonth == 7){
			quarter = 2;
		}else if(paramMonth == 10){
			quarter = 3;
		}
		
		$("#year option[value='"+paramYear+"']").attr("selected",true);
		$("#year").attr("disabled","disabled");
		$("#quarter option[value='"+quarter+"']").attr("selected",true);
		$("#quarter").attr("disabled","disabled");
	}else{
		var myDate = new Date();
		var year = myDate.getFullYear();
		var month = myDate.getMonth()+1;
		
		if(month == 1){
			year = year-1;
			quarter = 4;
		}else if(month == 4){
			quarter = 1;
		}else if(month == 7){
			quarter = 2;
		}else if(month == 10){
			quarter = 3;
		}
		$("#year option[value='"+year+"']").attr("selected",true);
		$("#quarter").selectOrDie('destroy');
		$("#quarter option[value='"+quarter+"']").attr("selected",true);
		$("#quarter").selectOrDie();
	}
	$("#year").selectOrDie('destroy');
	$("#year").selectOrDie();
	
	$("#quarter").selectOrDie('destroy');
	$("#quarter").selectOrDie();
}


/**
 * 判断按钮的展示
 */
function judgmentButton(){
	if(auditFlag=="" || auditFlag=="0"){
		$("#onlyExamine").show();
		$("#audit").hide();
	}else if(auditFlag=="1"){
		$("#onlyExamine").hide();
		$("#audit").show();
	}
}



function getList(){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	var auditType = "";
	
	if(auditFlag != "1"){
		auditType="1";
	}
	
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
			//20170629添加判断，审核后不展示审核按钮
			//TODO
			if(quarterStatementList!=""){
				if(quarterStatementList[0].auditType!="0" && auditFlag == "1"){
					$("#onlyExamine").show();
					$("#audit").hide();
					
					$("#goBack").unbind("click");
					//查看报表时的返回按钮
					$("#goBack").click(function(){
						window.location.href = rootPath+"/page/jsp/exemplaryMatrix/districtAuditMonthlyStatement.jsp";
					})
				}
			}
			
			
			
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
				enterpriseHtml = "<tr><td style='text-overflow: initial;overflow: visible;white-space: normal;'>未查询到数据或该季度数据未通过审核！</td></tr>";
				operatorHtml = "<tr><td colspan='6' style='text-overflow: initial;overflow: visible;white-space: normal;'>未查询到数据或该季度数据未通过审核！</td></tr>";
			}
			
			$("#enterpriseList").append(enterpriseHtml);
			$("#operatorList").append(operatorHtml);
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
