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
	$("#exemplaryMatrixMonthlyAudit").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	getDate();
	
	getList(getListParams(currentPage));
	
	$("#search").click(function(){
		getList(getListParams(currentPage));
	})
	
	$("#monthlyStatementList").on("click",".detail",function(){
		var param = $(this).attr("name");
		var params = param.split(",");
		var year = params[0];
		var month = params[1];
		var matrixCode = params[2];
		
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/examineMonthlyStatement.jsp?paramYear="+year+"&paramMonth="+month+"&matrixCode="+matrixCode+"&auditFlag=1";
	})
	
})

/**
 * 获取当前时间
 */
function getDate(){
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth()+1;
	$("#year").val(year);
	$("#month option[value='"+month+"']").attr("selected",true);
	$("#month").selectOrDie('destroy');
	$('#month').selectOrDie();
}

/**
 * 获取列表参数
 */
function getListParams(currentPage){
	
	var matrixName = $("#matrixName").val();
	var year = $("#year").val();
	var month = $("#month").val();
	
	var params = {'params.matrixName':matrixName,
					'params.year':year,
					'params.month':month,
					'params.district':district,
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
 * 获取列表
 * @param params
 */
function getList(params){
	//清空列表
	$("#monthlyStatementList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMonthlyStatementListForAudit.action",
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
			for(var i=0; i<monthlyStatementList.length; i++){
				html += '<tr>';
				html += '<td>'+monthlyStatementList[i].matrixName+'</td>';
				html += '<td>'+monthlyStatementList[i].year+'</td>';
				html += '<td>'+monthlyStatementList[i].month+'</td>';
				if(monthlyStatementList[i].auditType == 1){
					html += '<td>已通过</td>';
					html += '<td class="link_blue undL_zy detail" name="'+monthlyStatementList[i].year+','+monthlyStatementList[i].month+','+monthlyStatementList[i].userCode+'">查看</td>';
				}else if(monthlyStatementList[i].auditType == 2){
					html += '<td>未通过</td>';
					html += '<td class="link_blue undL_zy detail" name="'+monthlyStatementList[i].year+','+monthlyStatementList[i].month+','+monthlyStatementList[i].userCode+'">查看</td>';
				}else if(monthlyStatementList[i].auditType == 0){
					html += '<td>待审核</td>';
					html += '<td class="link_blue undL_zy detail" name="'+monthlyStatementList[i].year+','+monthlyStatementList[i].month+','+monthlyStatementList[i].userCode+'">审核</td>';
				}
				
				html += '</tr>';
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