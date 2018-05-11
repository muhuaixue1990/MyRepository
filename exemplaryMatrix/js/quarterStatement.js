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
 * 加载完成后执行
 */
$(function(){
	//边栏样式
	$("#entInfoSide li").removeAttr("class");
	$("#entBaseInfoSide").attr("class","subnav_1st subPass");
	$("#entPublicityInfoSide").attr("class","subPass");
	$("#entFinancialInfoSide").attr("class","subPass");
	$("#accountInfoSide").attr("class","subPass subnav_end");
	
	//边栏样式
	$(".sidebarCur").removeAttr("class");
	$("#gotoQuarterStatement").attr("class","sidebarCur");
	
//	getMatrixInfoByCode();
	
	 var date=new Date;
	 var year=date.getFullYear();
	 $("#newYearSpan").html("");
	 $("#newYearSpan").html(year+"年&nbsp;&nbsp;&nbsp;&nbsp;");
	 $("#newYear").val(year);
	
	
	//获取列表
	getList(getListParams(currentPage));
	
	$("#quarterStatementList").on("click",".quarterStatementModify",function(){
		var id = $(this).attr("name");
		findStatementById(id);
		layer.open({
			title:"新增季度情况",
			skin: 'zyPrint',//zy.css
			type:1,
			content: $(".printBox"),
			move: false,//禁止拖拽
			area: ['580px','500px']
		})
		
	})
	
	$("#search").click(function(){
		getList(getListParams(currentPage));
	})
	
	$("#save").click(function(){
		addQuarterStatement();
	})
	
	$("#cancel").click(function(){
		layer.close(layer.index);
	})
	
	findStatementByParam();
	
})


function getMatrixInfoByCode(){
	var params = {"params.userCode":userCode};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMatrixInfoByCode.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("您还未发起示范基地申请！")
				window.location.href = rootPath+"/page/jsp/enterpriseInfo/entInfoPage.jsp";
			}
			if(status == "1"){
				var exemplaryMatrixApplication = data['exemplaryMatrixApplication'];
				if(exemplaryMatrixApplication.cityAuditType != "2"){
					alert("您还未成为示范基地！")
					window.location.href = rootPath+"/page/jsp/exemplaryMatrix/resultForApplication.jsp";
				}
				
			}
			
		}
	})
}



/**
 * 获取季度报表列表参数
 */
function getListParams(currentPage){
	
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	
	var params = {'params.userCode':userCode,
					'params.year':year,
					'params.quarter':quarter,
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
 * 获取季度报表列表
 * @param params
 */
function getList(params){
	//清空列表
	$("#quarterStatementList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getQuarterStatementList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			var quarterStatementList = data['quarterStatementList'];
			var html = "";
			for(var i=0; i<quarterStatementList.length; i++){
				html += '<tr>'
				html += '<td width="15%">'+quarterStatementList[i].year+'</td>';
				html += '<td width="15%">'+quarterStatementList[i].quarter+'</td>';
				html += '<td width="15%" class="link_blue quarterStatementModify" name="'+quarterStatementList[i].id+'">修改</td>';
				html += '</tr>';
			}
			$("#quarterStatementList").append(html);
			
			
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
 * 添加季度报表
 */
function addQuarterStatement(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/addQuarterStatement.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#quarterStatementForm").serialize(),
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败");
			}else if(status == "1"){
				layer.close(layer.index);
				//获取列表
				getList(getListParams(currentPage));
			}
		}
	})
}

/**
 * 通过年份和季度查询季度报表
 */
function findStatementByParam(){
	$("#enterpriseCount").val("");
	$("#totalAssetsE").val("");
	$("#incomeE").val("");
	$("#profitE").val("");
	$("#taxesE").val("");
	$("#personnelQuantityE").val("");
	$("#floorSpaceE").val("");
	$("#totalAssets").val("");
	$("#income").val("");
	$("#profit").val("");
	$("#taxes").val("");
	$("#personnelQuantity").val("");
	$("#tutorQuantity").val("");
	
	var date = new Date;
	var year = date.getFullYear();
	var quarter = $("#newQuarter").val();
	var params = {"params.userCode":userCode,
					"params.year":year,
					"params.quarter":quarter};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/findStatementByParam.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == 1){
				var quarterStatement = data['quarterStatement'];
				$("#enterpriseCount").val(quarterStatement.enterpriseCount);
				$("#totalAssetsE").val(quarterStatement.totalAssetsE);
				$("#incomeE").val(quarterStatement.incomeE);
				$("#profitE").val(quarterStatement.profitE);
				$("#taxesE").val(quarterStatement.taxesE);
				$("#personnelQuantityE").val(quarterStatement.personnelQuantityE);
				$("#floorSpaceE").val(quarterStatement.floorSpaceE);
				$("#totalAssets").val(quarterStatement.totalAssets);
				$("#income").val(quarterStatement.income);
				$("#profit").val(quarterStatement.profit);
				$("#taxes").val(quarterStatement.taxes);
				$("#personnelQuantity").val(quarterStatement.personnelQuantity);
				$("#tutorQuantity").val(quarterStatement.tutorQuantity);
			}
		}
	})
}

function findStatementById(id){
	$("#enterpriseCount").val("");
	$("#totalAssetsE").val("");
	$("#incomeE").val("");
	$("#profitE").val("");
	$("#taxesE").val("");
	$("#personnelQuantityE").val("");
	$("#floorSpaceE").val("");
	$("#totalAssets").val("");
	$("#income").val("");
	$("#profit").val("");
	$("#taxes").val("");
	$("#personnelQuantity").val("");
	$("#tutorQuantity").val("");
	
	var params = {"params.id":id};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/findStatementByParam.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == 1){
				var quarterStatement = data['quarterStatement'];
				$("#newQuarter option[value='"+quarterStatement.quarter+"']").attr("selected",true);
				$("#newQuarter").selectOrDie('destroy');
				$('#newQuarter').selectOrDie();
				
				
				$("#enterpriseCount").val(quarterStatement.enterpriseCount);
				$("#totalAssetsE").val(quarterStatement.totalAssetsE);
				$("#incomeE").val(quarterStatement.incomeE);
				$("#profitE").val(quarterStatement.profitE);
				$("#taxesE").val(quarterStatement.taxesE);
				$("#personnelQuantityE").val(quarterStatement.personnelQuantityE);
				$("#floorSpaceE").val(quarterStatement.floorSpaceE);
				$("#totalAssets").val(quarterStatement.totalAssets);
				$("#income").val(quarterStatement.income);
				$("#profit").val(quarterStatement.profit);
				$("#taxes").val(quarterStatement.taxes);
				$("#personnelQuantity").val(quarterStatement.personnelQuantity);
				$("#tutorQuantity").val(quarterStatement.tutorQuantity);
			}
		}
	})
}