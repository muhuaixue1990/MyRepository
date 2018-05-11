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
	$("#exemplaryMatrixStetementList").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	
	getMatrixList(getListParams(currentPage));
	
	$("#goBack").click(function(){
		if("120000" == district){
//			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/statementListCity.jsp";
			window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/cityMatrixUserManage.jsp";
		}else{
			window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/districtMatrixManage.jsp";
		}
	})
})


/**
 * 获取基地表参数
 */
function getListParams(currentPage){
	
	//增加所属区查询根据区划分示范基地
	var params = {'params.userCode':userCode,
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
	getMatrixList(getListParams(currentPage));
}

/**
 * 获取基地列表
 * @param params
 */
function getMatrixList(params){
	//清空列表
	$("#matrixNoMonthlyDetailList").empty();
	$("#sumOfMatrixNoMonthly").text("")
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMatrixNoMonthlyDetailList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
//			$("#sumOfMatrixNoMonthly").val(data['count']);
			$("#sumOfMatrixNoMonthly").append('<span class="ml15">未填写当季度报表基地数量：</span>'+data['count']+'家');
			
			var detailList = data['detailList'];
			var html = "";
			if(detailList.length!=0){
				for(var i=0; i<detailList.length; i++){
					html += '<tr>';
					html += '<td width="25%">'+detailList[i].matrixName+'</td>';
					if(district=="120000"){
						html += '<td width="25%">'+detailList[i].district+'</td>';
					}
					html += '<td width="25%">'+detailList[i].contacter+'</td>';
					html += '<td width="25%">'+detailList[i].contactPhone+'</td>';
					html += '</tr>';
				}
			}else{
				html += '<tr><td>未查询到数据</td></tr>';
			}
			
			$("#matrixNoMonthlyDetailList").append(html);
			
			
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