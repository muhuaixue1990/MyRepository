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
	$("#exemplaryMatrixMonthlyAudit").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	
	//获取当前时间
	getNowTime();
	//获取列表
	getList(getListParams(currentPage));
	
	//查询按钮
	$("#search").click(function(){
		getList(getListParams(currentPage));
	})
	
	//审核通过按钮
	$("#districtAuditStatementList").on("click",".passBtn",function(){
		var auditParam= $(this).attr("name");
		var auditParamArray = auditParam.split(',')
		if(confirm("确定审核通过？")){
			auditStatement("1",auditParamArray[0],auditParamArray[1],auditParamArray[2],"",-1);
		}
	})
	
	//审核不通过按钮
	$("#districtAuditStatementList").on("click",".noPassBtn",function(){
		var auditParam= $(this).attr("name");
		$("#recommendations").val("");
		var index = layer.open({
			title:"区中小企业工作主管部门意见",
			type:1,//可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
			content:$(".unCrossB_w1"),
			btn: ['确定', '取消'],
			//  shade: 0,//遮罩，如需要此处去掉
			id:"pop1",
			move: false,//禁止拖拽
			area: ['460px', 'auto'],
			// scrollbar: false
			btn1: function(index, layero){
				var recommendations = $("#recommendations").val();
				var auditParamArray = auditParam.split(',')
				auditStatement("2",auditParamArray[0],auditParamArray[1],auditParamArray[2],recommendations,index);
			},
			btn2:function(){
				
			}
		})
	})
	
	//查看按钮
	$("#districtAuditStatementList").on("click",".examineBtn",function(){
		var examineParam= $(this).attr("name");
		var examineParamArray = examineParam.split(',')
		window.location.href = rootPath + "/page/jsp/exemplaryMatrixNew/districtAuditStatementDetail.jsp?matrixCode="+examineParamArray[0]+"&paramYear="+examineParamArray[1]+"&paramQuarter="+examineParamArray[2]
		
	})
})


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
	
	var month = nowTime.substring(5,7);
	month = parseInt(month);
	if(month>=1 && month<=3){
		quarter = 1;
	}else if(month>=4 && month<=6){
		quarter = 2;
	}else if(month>=7 && month<=9){
		quarter = 3;
	}else if(month>=10 && month<=12){
		quarter = 4;
	}
	
	if(quarter == '1'){
		$("#quarter option[value='"+quarter+"']").attr("selected","selected");
		$("#quarter").selectOrDie('destroy');
		$("#quarter").selectOrDie();
	}else{
		var quarterInt = parseInt(quarter);
		$("#quarter option[value='"+(quarterInt-1)+"']").attr("selected","selected");
		$("#quarter").selectOrDie('destroy');
		$("#quarter").selectOrDie();
	}
	
}

/**
 * 获取入驻企业列表参数
 */
function getListParams(currentPage){
	
	var matrixName = $("#matrixName").val();
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	
	var params = {'params.district':district,
					'params.matrixName':matrixName,
					'params.year':year,
					'params.quarter':quarter,
					'params.satementList':'1',
					'params.currentPage':currentPage,
				  	'params.pageSize':pageSize};
	return params;
}

/**
 * 分页回调
 */
function pageCallback(index,jq){
	currentPage = index + 1;
	getList(getListParams(currentPage));
}

/**
 * 获取月报列表方法
 */
function getList(params){
	
	var datatables_options = {
			"info": false,
			"ordering": false,
			"searching": false,
			"paging": false,
			"bAutoWidth": false,
			"bPaginate": false,
			"bFilter": false,
			"bInfo": false,
			"bStateSave": false,
			"iCookieDuration": 0,
			"bScrollAutoCss": true,
			"bProcessing": true,
			"bJQueryUI": false,
			retrieve: true
		};

		datatables_options["sScrollY"] = "auto";
		datatables_options["sScrollX"] = "100%";
		datatables_options["bScrollCollapse"] = true;

		// add this  
		datatables_options["sScrollXInner"] = '1801px';
		var table = $('.datalist').DataTable(datatables_options);
		 
	//清空列表
	$("#districtAuditStatementList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findStatementAuditList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var statementAuditList = data['statementAuditList'];
			var html = "";
			
			
			if(statementAuditList.length > 0){
				for(var i=0; i<statementAuditList.length; i++){
					html += '<tr>';
					html += '<td title="'+statementAuditList[i].matrixName+'" width="149">'+statementAuditList[i].matrixName+'</td>';
					html += '<td title="">'+statementAuditList[i].year+'</td>';
					if(statementAuditList[i].quarter == "1"){
						html += '<td title="">I(1-3月)</td>';
					}else if(statementAuditList[i].quarter == "2"){
						html += '<td title="">II(1-6月)</td>';
					}else if(statementAuditList[i].quarter == "3"){
						html += '<td title="">III(1-9月)</td>';
					}else if(statementAuditList[i].quarter == "4"){
						html += '<td title="">IV(1-12月)</td>';
					}
					
					html += '<td title="">'+statementAuditList[i].floorSpaceE+'</td>';
					html += '<td title="">'+statementAuditList[i].personnelQuantity+'</td>';
					html += '<td title="">'+statementAuditList[i].tutorQuantity+'</td>';
					html += '<td title="">'+statementAuditList[i].enterpriseCount+'</td>';
					html += '<td title="">'+statementAuditList[i].smeCount+'</td>';
					html += '<td title="">'+statementAuditList[i].personnelQuantityE+'</td>';
					html += '<td title="">'+statementAuditList[i].totalAssets+'</td>';
					html += '<td title="">'+statementAuditList[i].income+'</td>';
					html += '<td title="">'+statementAuditList[i].coopCount+'</td>';
					html += '<td title="'+statementAuditList[i].coopService+'">'+statementAuditList[i].coopService+'</td>';
					html += '<td title="">'+statementAuditList[i].serviceCount+'</td>';
					html += '<td title="'+statementAuditList[i].service+'">'+statementAuditList[i].service+'</td>';
					html += '<td title="">'+statementAuditList[i].enterCount+'</td>';
					html += '<td title="">'+statementAuditList[i].personCount+'</td>';
					html += '<td title="">'+statementAuditList[i].incomeProportion+'</td>';
					html += '<td>';
					html += '<a href="javascript:;" class="color_blue mr5 examineBtn" name="'+statementAuditList[i].userCode+','+statementAuditList[i].year+','+statementAuditList[i].quarter+','+statementAuditList[i].matrixName+'">查看</a>';
					html += '<a href="javascript:;" class="color_blue mr5 passBtn" name="'+statementAuditList[i].userCode+','+statementAuditList[i].year+','+statementAuditList[i].quarter+'">通过</a>';
					html += '<a href="javascript:;" class="color_blue noPassBtn" name="'+statementAuditList[i].userCode+','+statementAuditList[i].year+','+statementAuditList[i].quarter+'">不通过</a>';
					html += '</td>';
					html += '</tr>';
					/*$('.dataTables_wrapper, .pagebox').show()
					$('.no-data').hide()*/
				}
			}else{
				/*$('.dataTables_wrapper, .pagebox').hide()
				$('.no-data').show()*/
				html += '<tr><td colspan="19">未查询到数据！</td></tr>';
			}
			
			
			$("#districtAuditStatementList").append(html);
			
			
			$("#page").pagination(totalPage,{
				callback: pageCallback,
				items_per_page : 1,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : currentPage - 1,
				link_to : 'javascript:void(0)'
			});
			$("#totalPage").text("共"+totalPage+"页");
		}
	})
	
	
}

/**
 * 审核报表方法
 * @param auditType
 */
function auditStatement(auditType,matrixCode,paramYear,paramQuarter,recommendations,index){
	var params;
	if(auditType == '1'){
		params = {"params.matrixCode":matrixCode,
					"params.year":paramYear,
					"params.quarter":paramQuarter,
					"params.auditType":auditType}
	}else if(auditType == '2'){
		params = {"params.matrixCode":matrixCode,
					"params.year":paramYear,
					"params.quarter":paramQuarter,
					"params.auditType":auditType,
					"params.recommendations":recommendations}
	}
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
					sendletter(matrixCode,"您提交的季度报表区级审核已通过，请点击查看",2,"暂时没有","22012");
				}else if(auditType == "2"){
					sendletter(matrixCode,"您提交的季度报表区级审核未通过，请点击查看",2,"暂时没有","22012");
					layer.close(index);
				}
				//获取列表
				getList(getListParams(currentPage));
			}else if(status == "0"){
				alert("审核失败！");
			}
		}
	})
}

//发送站内信
function sendletter(receiveUserCode,letterContent,triggerType,triggerCode,typeId){
	var rootPath = location.pathname.substring(0, location.pathname.substr(1).indexOf('/') + 1);
	var param = {
			"params.receiveUserCode" : receiveUserCode,        
			"params.letterContent" : letterContent,
			"params.triggerType" : triggerType,
			"params.triggerCode" : triggerCode,
			"params.typeId" : typeId
		}
	$.ajax({
		type: "post",
		url: rootPath+"/triggerLetter/createTriggerLetter.action",
		data: param,
		async : false,
		timeout : 30000,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			if(data.status == 1){
//				alert("已发送站内信");
			}
		}
	})
}