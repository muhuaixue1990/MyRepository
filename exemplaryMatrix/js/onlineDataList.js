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
	$("#gotoMonthlyStatement").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	//获取列表
	getList(getListParams(currentPage));
	
	disposeTime();
	
	
	$("#onlineDataList").on("click",".tianbao",function(){
		var params = $(this).attr("name");
		var paramsArry = params.split(",")
		var serviceId = paramsArry[0];
		var serviceType = paramsArry[1]
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/onlineData.jsp?paramYear="+year+"&paramQuarter="+quarter+"&serviceId="+serviceId+"&serviceType="+serviceType;
	})
	
	
	$("#goBack").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/statementManage_new.jsp";
	})
	
	
	//合并了线下新增的
	$("#newOfflineData").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/offlineData.jsp?paramYear="+year+"&paramQuarter="+quarter;
	})
	$("#onlineDataList").on("click",".tianbaoOffline",function(){
		var params = $(this).attr("name");
		var paramsArry = params.split(",")
		var serviceId = paramsArry[0];
		var serviceType = paramsArry[1]
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/offlineData.jsp?paramYear="+year+"&paramQuarter="+quarter+"&serviceId="+serviceId+"&serviceType="+serviceType;
	})
	$("#onlineDataList").on("click",".deleteData",function(){
		var params = $(this).attr("name");
		var paramsArry = params.split(",")
		var serviceId = paramsArry[0];
		var serviceType = paramsArry[1]
		var deleteYear = paramsArry[2]
		var deleteQuarter = paramsArry[3]
		var deleteUserCode = paramsArry[4]
		if(confirm("确定删除吗？")){
			deleteData(serviceId,deleteYear,deleteQuarter,deleteUserCode)
		};
	})
	
})

function deleteData(serviceId,deleteYear,deleteQuarter,deleteUserCode){
	var params = {"params.serviceId":serviceId,"params.deleteYear":deleteYear,"params.deleteQuarter":deleteQuarter,"params.deleteUserCode":deleteUserCode};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/deleteServiceDataById.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == '1'){
				alert("删除成功！");
				getList(getListParams(currentPage));
			}else{
				alert("删除失败！");
			}
		}
	})
}

/**
 * 处理时间及标题
 */
function disposeTime(){
	$("#title").text("");
	var text = ""
	if(quarter == 1){
		text += year+"年I(1~3月)服务佐证";
	}else if(quarter == 2){
		text += year+"年II(1~6月)服务佐证";
	}else if(quarter == 3){
		text += year+"年III(1~9月)服务佐证";
	}else if(quarter == 4){
		text += year+"年IV(1~12月)服务佐证";
	}
	$("#title").text(text);
}


/**
 * 获取入驻企业列表参数
 */
function getListParams(currentPage){
	
	var params = {'params.userCode':userCode,
					'params.serviceYear':year,
					'params.serviceQuarter':quarter,
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
		 
	//清空列表
	$("#onlineDataList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findOnlineDataList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var exemplaryMatrixOnlineDatas = data['exemplaryMatrixOnlineDatas'];
			var html = "";
			
			if(exemplaryMatrixOnlineDatas.length > 0){
				for(var i=0; i<exemplaryMatrixOnlineDatas.length; i++){
					html += '<tr>'
					html += '<td>'+exemplaryMatrixOnlineDatas[i].serviceName+'</td>'
					html += '<td>'+exemplaryMatrixOnlineDatas[i].serviceTime+'</td>'
					html += '<td>'+exemplaryMatrixOnlineDatas[i].serviceSort+'</td>'
					if(exemplaryMatrixOnlineDatas[i].serviceAddress == null){
						html += '<td title="">-</td>'
					}else{
						html += '<td title="'+exemplaryMatrixOnlineDatas[i].serviceAddress+'">'+exemplaryMatrixOnlineDatas[i].serviceAddress+'</td>'
					}
					if(exemplaryMatrixOnlineDatas[i].lineType == 'online'){
						html += '<td>线上</td>'
					}else{
						html += '<td>线下</td>'
					}
					if(exemplaryMatrixOnlineDatas[i].haveType == '1'){
						html += '<td>已填报</td>'
					}else{
						html += '<td>未填报</td>'
					}
					html += '<td>'
					if(exemplaryMatrixOnlineDatas[i].lineType == 'online'){
						html += '<a class="color_blue tianbao" name="'+exemplaryMatrixOnlineDatas[i].id+','+exemplaryMatrixOnlineDatas[i].serviceType+'">填报</a>'
					}else{
						html += '<a class="color_blue tianbaoOffline" name="'+exemplaryMatrixOnlineDatas[i].id+','+exemplaryMatrixOnlineDatas[i].serviceType+'">修改</a> <a class="color_blue deleteData" name="'+exemplaryMatrixOnlineDatas[i].id+','+exemplaryMatrixOnlineDatas[i].serviceType+','+year+','+quarter+','+userCode+'">删除</a>'
					}
					html += '</td>'
					html += '</tr>'
				}
			}else{
				html += '<tr><td>未查询到数据！</td></tr>';
			}
			
			
			$("#onlineDataList").append(html);
			
			
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
