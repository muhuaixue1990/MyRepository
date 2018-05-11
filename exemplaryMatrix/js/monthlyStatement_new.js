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
	
	getThisMonthData();
	
	getList(getListParams(currentPage));
	
	$("#createStatemt").click(function(){
		window.location.href = rootPath + "/page/jsp/exemplaryMatrix/monthlyServiceData.jsp"
	})
	
	$("#searchStatement").click(function(){
		getList(getListParams(currentPage));
	})
	
	//给修改按钮预绑定按钮
	$("#monthlyStatementList").on("click",".modify",function(){
		var className = $(this).attr("name");
		var classNames = className.split(",");
		var year = classNames[0];
		var month = classNames[1];
		window.location.href = rootPath + "/page/jsp/exemplaryMatrix/monthlyServiceData.jsp?paramYear="+year+"&paramMonth="+month;
		
	})
})



/**
 * 获取月报列表参数
 */
function getListParams(currentPage){
	
	var year = $("#year").val();
	var month = $("#month").val();
	
	var params = {'params.userCode':userCode,
					'params.year':year,
					'params.month':month,
					'params.currentPage':currentPage,
				  	'params.pageSize':pageSize};
	return params;
}

/**
 * 月报分页回调
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
	$("#monthlyStatementList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMonthlyStatementList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var monthlyStatementList = data['monthlyStatementList'];
			var html = "";
			if(monthlyStatementList.length > 0){
				for(var i=0; i<monthlyStatementList.length; i++){
					html += '<tr>'
					html += '<td width="15%">'+monthlyStatementList[i].year+'</td>';
					html += '<td width="15%">'+monthlyStatementList[i].month+'</td>';
					var submitType = false;
					if(monthlyStatementList[i].submitType == "1"){
						if(monthlyStatementList[i].auditType == "1"){
							html += '<td width="15%">已通过</td>';
						}else if(monthlyStatementList[i].auditType == "0"){
							html += '<td width="15%">已提交</td>';
						}else if(monthlyStatementList[i].auditType == "2"){
							html += '<td width="15%">未通过</td>';
						}
						submitType = true;
					}else if(monthlyStatementList[i].submitType == "0"){
						html += '<td width="15%">未提交</td>';
						submitType = false;
					}
					
					if(monthlyStatementList[i].auditType == "1"){
						html += '<td width="15%" class="link_blue modify"></td>';
					}else if(monthlyStatementList[i].auditType == "0" && submitType){
						html += '<td width="15%" class="link_blue modify"></td>';
					}else if(monthlyStatementList[i].auditType == "0" && !submitType){
						html += '<td width="15%" class="link_blue modify" name="'+monthlyStatementList[i].year+','+monthlyStatementList[i].month+'">修改</td>';
					}else if(monthlyStatementList[i].auditType == "2" && submitType){
						html += '<td width="15%" class="link_blue modify" name="'+monthlyStatementList[i].year+','+monthlyStatementList[i].month+'">修改</td>';
					}
					html += '</tr>';
				}
			}else{
				html += '<tr><td>未查询到数据</td></tr>'
			}
			
			$("#monthlyStatementList").append(html);
			
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
 * 获取本月数据，如果本月已填，则隐藏新增按钮。
 */
function getThisMonthData(){
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
	
	var year = nowTime.substring(0,4);
	var month = nowTime.substring(5,7);
	month = parseInt(month);	
	
	var params = {"params.userCode":userCode,"params.year":year,"params.month":month};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMonthlyServiceDataByYearAndMonth.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == 1){
				$("#createStatemt").hide();
			}else if(status == 0){
				$("#createStatemt").show();
			}
		}
	})
}