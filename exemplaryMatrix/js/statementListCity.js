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
	$("#exemplaryMatrixStetementListCity").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	getDistrictSelect();
	
	getMatrixList(getListParams(currentPage));
	
	$("#search").click(function(){
		getMatrixList(getListParams(currentPage));
	})
	
	$("#matrixList").on("click",".detailForMonthly",function(){
		var userCode = $(this).attr("name");
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/examineMonthlyStatement.jsp?matrixCode="+userCode;
	})
	
	$("#matrixList").on("click",".detailForQuarter",function(){
		var userCode = $(this).attr("name");
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/examineQuarterStatement.jsp?matrixCode="+userCode;
	})
	
	$("#matrixList").on("click",".detailForYear",function(){
		var userCode = $(this).attr("name");
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/examineYearStatement.jsp?matrixCode="+userCode;
	})
	
	//获取当月未填写月报示范基地数量
	getSumForMatrixNoMonthly();
	
	//当月未填写月报示范基地详情按钮
	$("#matrixNoMonthlyDetail").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/matrixNoMonthlyDetail.jsp";
	})
})

/**
 * 获取当月未填写月报示范基地数量
 */
function getSumForMatrixNoMonthly(){
	var params = {"params.district":district};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getSumForMatrixNoMonthly.action",
		async : false,
		data:params,
		timeout : 30000,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			$("#sumForMatrixNoMonthly").val(data['count']);
		}
	})
}

/**
 * 获取所在区列表
 */
function getDistrictSelect(){
	//清空十大服务下拉框
	$("#districtSelect").empty();
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
				var html = ""
				html += "<option value=''>全部</option>";
				for(var i=0;i<sysCodes.length;i++){
					html += "<option value='"+sysCodes[i].code+"'>"+sysCodes[i].name+"</option>";
				}
				$("#districtSelect").append(html);
				$("#districtSelect").selectOrDie('destroy');
				$("#districtSelect").selectOrDie();
			}
		}
	})
}

/**
 * 获取基地表参数
 */
function getListParams(currentPage){
	
	var matrixName = $("#matrixName").val();
	var districtParam = $("#districtSelect").val();
	if(districtParam == ""){
		
	}else{
		district = districtParam;
	}
	
	//增加所属区查询根据区划分示范基地
	var params = {'params.userCode':userCode,
					'params.matrixName':matrixName,
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
	$("#matrixList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMatrixListForStatementList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			var exemplaryMatrixApplicationList = data['exemplaryMatrixApplicationList'];
			var html = "";
			if(exemplaryMatrixApplicationList.length!=0){
				for(var i=0; i<exemplaryMatrixApplicationList.length; i++){
					html +=  '<tr>';
					html +=  '<td>'+exemplaryMatrixApplicationList[i].matrixName+'</td>';
					html +=  '<td>'+exemplaryMatrixApplicationList[i].district+'</td>';
					html +=  '<td class="link_blue"><a class=" undL2_zy detailForMonthly" name='+exemplaryMatrixApplicationList[i].userCode+'>查看</a></td>';
					html +=  '<td class="link_blue"><a class=" undL2_zy detailForQuarter" name='+exemplaryMatrixApplicationList[i].userCode+'>查看</a></td>';
					html +=  '<td class="link_blue"><a class=" undL2_zy detailForYear" name='+exemplaryMatrixApplicationList[i].userCode+'>查看</a></td>';
					html +=  '</tr>';
				}
			}else{
				html = "<tr><td>未查询到数据</td></tr>";
			}
			
			$("#matrixList").append(html);
			
			
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