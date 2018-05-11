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
	$("#exemplaryMatrixServiceDataStatisticsCity").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	//获取当前时间
	getNowTime();
	//设置年份和季度下拉框
	getMonthlyStatementYears();
	
	//查询所属区
	getDistrict();
	
	//获取列表
	getList(getListParams(currentPage));
	
	//查询按钮
	$("#search").click(function(){
		getList(getListParams(currentPage));
	})
	
	$("#districtAuditStatementList").on("click",".detail",function(){
		var matrixCode = $(this).attr("name");
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixManageStatementDetail.jsp?matrixCode="+matrixCode+"&left=exemplaryMatrixServiceDataStatisticsCity";
	})
	
	//导出季度报表按钮
	$("#exportQuarterStatement").click(function(){
		window.location.href = rootPath+"/exemplaryMatrixBackstage/exportMatrixQuarterStatement.action?district="+paramDistrict+"&year="+$("#year").val()+"&quarter="+$("#quarter").val()+"&auditType=1&cityType=city";
	})
	
	//导出年度报表按钮
	$("#exportYearStatement").click(function(){
		window.location.href = rootPath+"/exemplaryMatrixBackstage/exportMatrixYearStatement.action?district="+paramDistrict+"&year="+$("#year").val()+"&quarter=4&auditType=1";
	})
})


/**
 * 获取区列表
 */
function getDistrict(){
	//拼接请求参数
	var param = {'params.code':paramDistrict};
	$.ajax({
		type: "post",
		url: rootPath+"/sysCode/getSysCodeByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: param,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['result'];
			var sysCodes = data['sysCodes'];
			if(1==status){
				districtName = sysCodes[0].name;
			}
		}
	})
}

/**
 * 获取入驻企业列表参数
 */
function getListParams(currentPage){
	
	var matrixName = $("#matrixName").val();
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	
	var params = {'params.district':paramDistrict,
					'params.matrixName':matrixName,
					'params.year':year,
					'params.quarter':quarter,
					'params.auditType':'1',
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
			
			
			html += '<tr>';
			/*html += '<td title="">合计（'+data["matrixCount"]+'）</td>';*/
			html += '<td title=""></td>';
			html += '<td title=""></td>';
			html += '<td title="">合计</td>'
			html += '<td title="">'+data["floorSpaceE"]+'</td>';
			html += '<td title="">'+data["personnelQuantity"]+'</td>';
			html += '<td title="">'+data["tutorQuantity"]+'</td>';
			html += '<td title="">'+data["enterpriseCount"]+'</td>';
			html += '<td title="">'+data["smeCount"]+'</td>';
			html += '<td title="">'+data["personnelQuantityE"]+'</td>';
			html += '<td title="">'+data["totalAssets"]+'</td>';
			html += '<td title="">'+data["income"]+'</td>';
			html += '<td title="">'+data["coopCount"]+'</td>';
			html += '<td title="">'+data["coopService"]+'</td>';
			html += '<td title="">'+data["serviceCount"]+'</td>';
			html += '<td title="">'+data["service"]+'</td>';
			html += '<td title="">'+data["enterCount"]+'</td>';
			html += '<td title="">'+data["personCount"]+'</td>';
			/*html += '<td title="">'+data["incomeProportion"]+'</td>';*/
			html += '<td title="">-</td>';
			html += '</tr>';
			
			
			if(statementAuditList.length > 0){
				for(var i=0; i<statementAuditList.length; i++){
					var startNo = (currentPage-1)*10;
					
					html += '<tr>';
					html += '<td>'+(startNo+i+1)+'</td>';
					html += '<td>'+districtName+'</td>';
					html += '<td title="'+statementAuditList[i].matrixName+'" name="'+statementAuditList[i].userCode+'" class="detail" style="color:blue;cursor:pointer;text-decoration: underline">'+statementAuditList[i].matrixName+'</td>';
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
					html += '</tr>';
					/*$('.dataTables_wrapper, .pagebox').show()
					$('.no-data').hide()*/
				}
			}else{
				/*$('.dataTables_wrapper, .pagebox').hide()
				$('.no-data').show()*/
				alert("未查询到数据");
				html += '<tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>';
			}
			
			
			$("#districtAuditStatementList").append(html);
			var table = $('.datalist').DataTable(datatables_options);
			
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
}

/**
 * 设置年份和季度下拉框
 */
function getMonthlyStatementYears(){
	//清空列表
	$("#year").empty();
	
	var params = {"params.district":paramDistrict}
	
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
			var htmlQuarter = '';
			
			var status = data['status'];
			if(status == 0){
				htmlYear += '<option value="">无数据</option>';
			
			}else if(status == 1){
				var times = data['times'];
				for(var i=0;i<times.length;i++){
					if(times[i].serviceQuarter == paramQuarter){
						htmlQuarter += '<option value="'+times[i].serviceQuarter+'" selected="selected">'+times[i].serviceQuarter+'</option>'
					}else{
						htmlQuarter += '<option value="'+times[i].serviceQuarter+'">'+times[i].serviceQuarter+'</option>'
					}
					
					if(i!=0){
						if(times[i].serviceYear == times[i-1].serviceYear){
							continue;
						}
					}
					if(times[i].serviceYear == paramYear){
						htmlYear += '<option value="'+times[i].serviceYear+'" selected="selected">'+times[i].serviceYear+'</option>'
					}else{
						htmlYear += '<option value="'+times[i].serviceYear+'">'+times[i].serviceYear+'</option>'
					}
					
				}
			}
			$("#year").append(htmlYear);
			$("#year").selectOrDie('destroy');
			$("#year").selectOrDie();
			
			$("#quarter option[value='"+paramQuarter+"']").attr("selected","selected");
			$("#quarter").selectOrDie('destroy');
			$("#quarter").selectOrDie();
		}
	})
}