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
	
	getSumForService();
	getOnlineDataDetail();
	getServiceDataStatisticsDetailList(getListParams(currentPage));
	
	$("#goBack").click(function(){
		window.location.href = rootPath + "/page/jsp/exemplaryMatrix/serviceDataStatistics.jsp";
	})
})

/**
 * 获取活动次数方法
 */
function getSumForService(){
	if(paramDistrict == ""){
		var params = {'params.matrixName':matrixName,
						'params.serviceType':serviceType,
						'params.year':year,
						'params.quarter':quarter,
						'params.district':district};
	}else{
		var params = {'params.matrixName':matrixName,
						'params.serviceType':serviceType,
						'params.year':year,
						'params.quarter':quarter,
						'params.district':paramDistrict};
	}
	
	
	
	$("#sumForService").val("");
	$("#onlineCount").val("");
	$("#offlineCount").val("");
	$("#sumForPerson").val("");
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
				$("#onlineCount").val(data['onlineCount']);
				$("#offlineCount").val(data['offlineCount']);
				$("#sumForPerson").val(data['personCount']);
			}
		}
	})
}

/**
 * 获取线上数据详情
 */
function getOnlineDataDetail(){
	$("#onlineList").empty();
	if(paramDistrict == ""){
		var params = {'params.matrixName':matrixName,
						'params.serviceType':serviceType,
						'params.year':year,
						'params.quarter':quarter,
						'params.district':district,
						'params.currentPage':currentPage,
					  	'params.pageSize':pageSize};
	}else{
		var params = {'params.matrixName':matrixName,
						'params.serviceType':serviceType,
						'params.year':year,
						'params.quarter':quarter,
						'params.district':paramDistrict,
						'params.currentPage':currentPage,
					  	'params.pageSize':pageSize};
	}
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findOnlineDataDetail.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == '1'){
				var dataList = data['dataList'];
				var html = "";
				for(var i=0;i<dataList.length;i++){
					html += '<tr>';
					html += '<td>'+dataList[i].serviceName+'</td>';
					html += '<td>'+dataList[i].onlineCount+'</td>';
					html += '</tr>';
				}
				
			}
			$("#onlineList").append(html);
		}
	})
	
}

/**
 * 获取数据统计详情页参数
 */
function getListParams(currentPage){
	if(paramDistrict == ""){
		var params = {'params.matrixName':matrixName,
						'params.serviceType':serviceType,
						'params.year':year,
						'params.quarter':quarter,
						'params.district':district,
						'params.currentPage':currentPage,
					  	'params.pageSize':pageSize};
	}else{
		var params = {'params.matrixName':matrixName,
						'params.serviceType':serviceType,
						'params.year':year,
						'params.quarter':quarter,
						'params.district':paramDistrict,
						'params.currentPage':currentPage,
					  	'params.pageSize':pageSize};
	}
	
	return params;
}

/**
 * 数据统计详情页分页回调
 */
function pageCallback(index,jq){
	currentPage = index + 1;
	getServiceDataStatisticsDetailList(getListParams(currentPage));
}


/**
 * 获取数据统计详细信息方法
 */
function getServiceDataStatisticsDetailList(params){
	$("#serviceDataStatisticsDetailList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getServiceDataStatisticsDetailList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var html = "";
			var detailList = data['detailList'];
			
			if(detailList.length>0){
				for(var i=0;i<detailList.length;i++){
					html += '<tr>';
					html += '<td width="10%">'+detailList[i].year+'</td>';
					html += '<td width="10%">'+detailList[i].quarter+'</td>';
					html += '<td width="25%">'+detailList[i].activityName+'</td>';
					html += '<td width="13%">'+detailList[i].serviceType+'</td>';
					html += '<td width="30%">'+detailList[i].matrixName+'</td>';
					html += '<td width="12%">'+detailList[i].personQuantity+'</td>';
					html += '</tr>';
				}
			}else{
				html += '<tr><td>未查询到数据！</td></tr>'
			}
			
			$("#serviceDataStatisticsDetailList").append(html);
			
			
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