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
	//获取区列表
	getDistrict();
	
	
	//获取列表
	getList(getListParams(currentPage));
	
	//查询按钮
	$("#search").click(function(){
		getList(getListParams(currentPage));
	})
	
	//导出季度报表按钮
	$("#exportQuarterStatement").click(function(){
		window.location.href = rootPath+"/exemplaryMatrixBackstage/exportMatrixQuarterStatement.action?district="+$("#paramDistrict").val()+"&year="+$("#year").val()+"&quarter="+$("#quarter").val()+"&auditType=1&cityType=city";
	})
	
	//导出年度报表按钮
	$("#exportYearStatement").click(function(){
		window.location.href = rootPath+"/exemplaryMatrixBackstage/exportMatrixYearStatement.action?district="+$("#paramDistrict").val()+"&year="+$("#year").val()+"&quarter=4&auditType=1";
	})
	
	$("#districtAuditStatementList").on("click",".districtDetail",function(){
		var code = $(this).attr("name");
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/serviceDataStatisticsDetail_new.jsp?district="+code+"&paramYear="+$("#year").val()+"&paramQuarter="+$("#quarter").val()
		
	})
	
})
/**
 * 获取入驻企业列表参数
 */
function getListParams(currentPage){
	
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	
	var params = {'params.district':$("#paramDistrict").val(),
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
		url: rootPath+"/exemplaryMatrixBackstage/findServiceDataStatisticsCity.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var districtList = data['districtList'];
			var html = "";
			
			
			html += '<tr>';
			html += '<td title="">合计</td>';
			html += '<td title="合计">'+data["matrixCount"]+'</td>';
			html += '<td title="合计">'+data["floorSpaceE"]+'</td>';
			html += '<td title="合计">'+data["personnelQuantity"]+'</td>';
			html += '<td title="合计">'+data["tutorQuantity"]+'</td>';
			html += '<td title="合计">'+data["enterpriseCount"]+'</td>';
			html += '<td title="合计">'+data["smeCount"]+'</td>';
			html += '<td title="合计">'+data["personnelQuantityE"]+'</td>';
			html += '<td title="合计">'+data["totalAssets"]+'</td>';
			html += '<td title="合计">'+data["income"]+'</td>';
			html += '<td title="合计">'+data["coopCount"]+'</td>';
			html += '<td title="合计">'+data["coopService"]+'</td>';
			html += '<td title="合计">'+data["serviceCount"]+'</td>';
			html += '<td title="合计">'+data["service"]+'</td>';
			html += '<td title="合计">'+data["enterCount"]+'</td>';
			html += '<td title="合计">'+data["personCount"]+'</td>';
//			html += '<td title="合计">'+data["incomeProportion"]+'</td>';
			html += '<td title="合计">-</td>';
			html += '</tr>';
			
			
			if(districtList.length > 0){
				for(var i=0; i<districtList.length; i++){
					html += '<tr>';
					html += '<td title="" class="districtDetail" name="'+districtList[i].code+'" style="color:blue;cursor:pointer;text-decoration: underline">'+districtList[i].name+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].matrixCount+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].floorSpaceE+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].personnelQuantity+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].tutorQuantity+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].enterpriseCount+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].smeCount+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].personnelQuantityE+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].totalAssets+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].income+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].coopCount+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].coopService+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].serviceCount+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].service+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].enterCount+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].personCount+'</td>';
					html += '<td title="'+districtList[i].name+'">'+districtList[i].incomeProportion+'</td>';
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
	
	var params = {"params.district":""}
	
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
	})
}


/**
 * 获取区列表
 */
function getDistrict(){
	//清空十大服务下拉框
	$("#paramDistrict").empty();
	//拼接请求参数
	var param = {'params.group':'district','params.parent':'120000'};
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
				var html = "";
				html += "<option value=''>全部</option>";
				for(var i=0;i<sysCodes.length;i++){
					html += "<option value='"+sysCodes[i].code+"'>"+sysCodes[i].name+"</option>";
				}
				$("#paramDistrict").append(html);
				$("#paramDistrict").selectOrDie('destroy');
				$("#paramDistrict").selectOrDie();
			}
		}
	})
}
