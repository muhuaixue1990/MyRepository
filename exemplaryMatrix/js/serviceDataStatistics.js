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

$(function(){
	//加高亮
	$("#exemplaryMatrixServiceDataStatistics").addClass("leeOn");
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
	
	//如果用户是区级用户就隐藏所属区选项
	if(userType == "6"){
		$("#suoshuqu").hide();
	}
	
	//获取服务类别列表
	getServiceType();
	
	getList(getListParams(currentPage));
	
	$("#search").click(function(){
		getList(getListParams(currentPage));
	})
	
	//点击详情
	$("#examineDetail").click(function(){
		var matrixName = $("#matrixName").val();
		var paramDistrict = $("#paramDistrict").val();
		var serviceType = $("#serviceType").val();
		var year = $("#year").val();
		var quarter = $("#quarter").val();
		
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/serviceDataStatisticsDetail.jsp?matrixName="+matrixName+"&paramDistrict="+paramDistrict+"&serviceType="+serviceType+"&year="+year+"&quarter="+quarter;
	})
	
	//加上正序倒序排列
/*	$(".sortTh i").click(function(){
		sortId = "";
		sortType = "";
		noasc
		$(this).addClass('sortable').siblings('th').removeClass('sortable');
		$(this).siblings().find('i').addClass('down').removeClass('up');
		if($(this).hasClass('up')){
			$(this).addClass('down').removeClass('up');
			
		}else if($(this).hasClass('down')){
			$(this).addClass('up').removeClass('down');
		}
		
		sortId = $(this).parent().attr("id");
		sortType = $(this).attr("class");
		
		getList(getListParams(currentPage,sortId,sortType));
	});*/
	$("body").on("click",".sortTh i",function(){
		sortId = "";
		sortType = "";
		if($(this).hasClass('up')){
			$(this).removeClass('up').addClass('down');
			
		}else if($(this).hasClass('down')){
			$(this).removeClass('down').addClass('up');
		}else{
			$(this).addClass('down');
		}
		
		
		sortId = $(this).parent().attr("id");
		sortType = $(this).attr("class");
		
		getList(getListParams(currentPage,sortId,sortType));
	});
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
}

/**
 * 设置年份和季度下拉框
 */
function getMonthlyStatementYears(){
	//清空列表
	$("#year").empty();
	$("#quarter").empty();
	
	var params = {"params.district":district}
	
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
				htmlQuarter += '<option value="">无数据</option>';
			
			}else if(status == 1){
				var times = data['times'];
				for(var i=0;i<times.length;i++){
					if(times[i].serviceQuarter == quarter){
						htmlQuarter += '<option value="'+times[i].serviceQuarter+'" selected="selected">'+times[i].serviceQuarter+'</option>'
					}else{
						htmlQuarter += '<option value="'+times[i].serviceQuarter+'">'+times[i].serviceQuarter+'</option>'
					}
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
			
			$("#quarter").append(htmlQuarter);
			$("#quarter").selectOrDie('destroy');
			$("#quarter").selectOrDie();
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

/**
 * 获取服务类别列表
 */
function getServiceType(){
	//清空十大服务下拉框
	$("#service_type").empty();
	//拼接请求参数
	var param = {'params.group':'pioneer_service_type','params.parent':'0'};
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
				$("#service_type").append(html);
				$("#service_type").selectOrDie('destroy');
				$("#service_type").selectOrDie();
			}
		}
	})
}


/**
 * 获取统计数据参数
 */
function getListParams(currentPage,type,sortType){
	
	var matrixName = $("#matrixName").val();
	var paramDistrict = $("#paramDistrict").val();
	var serviceType = $("#service_type").val();
	
	if(paramDistrict == ""){
		//修改往里面传入排序条件
		if(type == ""){
			var params = {'params.userCode':userCode,
							'params.matrixName':matrixName,
							'params.serviceType':serviceType,
							'params.year':$("#year").val(),
							'params.quarter':$("#quarter").val(),
							'params.district':district,
							'params.currentPage':currentPage,
						  	'params.pageSize':pageSize};
		}else{
			var params = {'params.userCode':userCode,
							'params.matrixName':matrixName,
							'params.serviceType':serviceType,
							'params.year':$("#year").val(),
							'params.quarter':$("#quarter").val(),
							'params.district':district,
							'params.currentPage':currentPage,
							'params.type':type,
							'params.sortType':sortType,
						  	'params.pageSize':pageSize};
		}
	}else{
		//修改往里面传入排序条件
		if(type == ""){
			var params = {'params.userCode':userCode,
							'params.matrixName':matrixName,
							'params.serviceType':serviceType,
							'params.year':$("#year").val(),
							'params.quarter':$("#quarter").val(),
							'params.district':paramDistrict,
							'params.currentPage':currentPage,
						  	'params.pageSize':pageSize};
		}else{
			var params = {'params.userCode':userCode,
							'params.matrixName':matrixName,
							'params.serviceType':serviceType,
							'params.year':$("#year").val(),
							'params.quarter':$("#quarter").val(),
							'params.district':paramDistrict,
							'params.currentPage':currentPage,
							'params.type':type,
							'params.sortType':sortType,
						  	'params.pageSize':pageSize};
		}
	}
	
	
	
	return params;
}

/**
 * 获取统计数据回调
 */
function pageCallback(index,jq){
	currentPage = index + 1;
	getList(getListParams(currentPage,sortId,sortType));
}

/**
 * 获取统计数据
 */
function getList(params){
	$("#sumForService").val("");
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findServiceCount.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == '1'){
				$("#sumForService").val(data['serviceCount']);
			}
		}
	})
	
	//清空列表
	$("#serviceDataStatisticsList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getServiceDataStatistics.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var serviceDataStatisticsList = data['serviceDataStatisticsList'];
			var html = "";
			if(serviceDataStatisticsList.length >0){
				for(var i=0; i<serviceDataStatisticsList.length; i++){
					html += '<tr>';
					html += '<td>'+serviceDataStatisticsList[i].matrix_name+'</td>';
					html += '<td>'+serviceDataStatisticsList[i].district+'</td>';
					html += '<td>'+serviceDataStatisticsList[i].serviceYear+'</td>';
					html += '<td>'+serviceDataStatisticsList[i].serviceQuarter+'</td>';
					html += '<td>'+serviceDataStatisticsList[i].serviceType+'</td>';
					html += '<td>'+serviceDataStatisticsList[i].serviceCount+'</td>';
					html += '</tr>';
				}
			}else{
				html += "<tr><td>未查询到数据</td></tr>";
			}
			
			$("#serviceDataStatisticsList").append(html);
			//表格隔行变色；
		    $(".tableWrapper_zy table tr:odd").addClass("tr_even");
			
			
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