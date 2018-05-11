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
	$("#gotoMonthlyStatement").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	//验证身份，只有是示范基地的才能填写报表
	verifyIdentity();
	
	//获取列表
	getList(getListParams(currentPage));
	
	//查询按钮
	$("#search").click(function(){
		getList(getListParams(currentPage));
	})
	
})

//修改按钮
function modifyInfo(e){
	var yearAndQuarter = $(e).attr("name");
	var yearAndQuarterParam = yearAndQuarter.split(',')
	window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/quarterStatementOne.jsp?paramYear="+yearAndQuarterParam[0]+"&paramQuarter="+yearAndQuarterParam[1];
}

/**
 * 验证身份，只有是示范基地的才能填写报表
 */
function verifyIdentity(){
	var params = {'params.userCode':userCode}
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/findExemplaryMatrixInfoByUserCode.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("您提交的示范基地信息还未通过审核，请稍后再试！");
				window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoOne.jsp";
			}
		}
	})
}


/**
 * 获取入驻企业列表参数
 */
function getListParams(currentPage){
	
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	
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
	$("#statementList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findStatementManageList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var statementManageList = data['statementManageList'];
			var html = "";
			
			if(statementManageList.length > 0){
				for(var i=0; i<statementManageList.length; i++){
					html += '<tr>'
					html += '<td>'+statementManageList[i].serviceYear+'</td>'
					if(statementManageList[i].serviceQuarter == "1"){
						html += '<td>1-3</td>'
					}else if(statementManageList[i].serviceQuarter == "2"){
						html += '<td>1-6</td>'
					}else if(statementManageList[i].serviceQuarter == "3"){
						html += '<td>1-9</td>'
					}else if(statementManageList[i].serviceQuarter == "4"){
						html += '<td>1-12</td>'
					}
					var exemplaryMatrixStatementManageViews = statementManageList[i].exemplaryMatrixStatementManageViews;
					var activityCount = 0;
					for(var j=0;j<exemplaryMatrixStatementManageViews.length;j++){
						html += '<td>'+exemplaryMatrixStatementManageViews[j].onlineCount+'</td>'
						html += '<td>'+exemplaryMatrixStatementManageViews[j].offlineCount+'</td>'
						activityCount += exemplaryMatrixStatementManageViews[j].onlineCount;
						activityCount += exemplaryMatrixStatementManageViews[j].offlineCount;
					}
					html += '<td>'+activityCount+'</td>'
					if(statementManageList[i].submitType == "0"){
						html += '<td>未提交</td>'
						html += '<td>'
						html += '<a class="color_blue modifyStatement" href="javascript:void(0);" onclick="modifyInfo(this)" name="'+statementManageList[i].serviceYear+','+statementManageList[i].serviceQuarter+'">修改</a>'
						html += '</td>';
					}else if(statementManageList[i].submitType == "1" && statementManageList[i].auditType == "0"){
						html += '<td>已提交</td>'
						html += '<td>'
						html += '</td>';
					}else if(statementManageList[i].submitType == "1" && statementManageList[i].auditType == "1"){
						html += '<td>通过审核</td>'
						html += '<td>'
						html += '</td>';
					}else if(statementManageList[i].submitType == "1" && statementManageList[i].auditType == "2"){
						html += '<td>未审核</td>'
						html += '<td>'
						html += '<a class="color_blue modifyStatement" href="javascript:void(0);" onclick="modifyInfo(this)" name="'+statementManageList[i].serviceYear+','+statementManageList[i].serviceQuarter+'">修改</a>'
						html += '</td>';
					}
					html += '</tr>'
				}
				
			}else{
				html += "<tr><td colspan='21'>未查询到数据！</td></tr>"
			}
			
			
			$("#statementList").append(html);
			//datatables
			var table = $('.datalist').DataTable({
				"info":false,
				"ordering":false,
				"searching":false,
				"paging":false,
				retrieve: true,
				"scrollY":'auto', //DataTables的高
				"scrollX":"100%", //DataTables的宽
			})

			
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

