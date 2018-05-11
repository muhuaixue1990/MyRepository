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
	//加高亮
	$("#exemplaryMatrixAudit").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	//获取当前时间
	getNowTime();
	
	//getApplicationYearList();
	
	
	//获取列表
	getList(getListParams(currentPage));
	
	$("#search").click(function(){
		getList(getListParams(currentPage));
	})
	
	$("#matrixList").on("click",".examine",function(){
		var applicationUserCode = $(this).attr("name");
		//var applicationYear = $("#applicationYearList").val();
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/cityExamineInfoOne.jsp?applicationUserCode="+applicationUserCode+"&sendThirdTypeFlag="+sendThirdTypeFlag;
	})
	
	$("#sendThirdTypeBtn").click(function(){
		sendToThirdParty();
	})
})

/**
 * 获取当前时间
 */
function getNowTime(){
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
}

/**
 * 递交第三方方法
 */
function sendToThirdParty(){
	//var year = nowTime.substring(0,4);
	
	//var params = {'params.applicationYear':year};
	if(confirm("确定将审核数据递交到第三方？")){
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/sendToThirdParty.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			//data:params,
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("递交失败！");
				}else if(status == "1"){
					alert("递交成功！");
					location.reload();
				}
			}
		})
	}
}

/**
 * 获取申请年限列表方法
 */
function getApplicationYearList(){
	$("#applicationYearList").empty();
	var year = nowTime.substring(0,4);
	var haveThisYear = false ; 
	
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getApplicationYearList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			var html = "";
			if(status == "0"){
				html += '<option value="'+year+'">'+year+'</option>';
			}else if(status == "1"){
				var applicationYearList = data['applicationYearList'];
				for(var i=0;i<applicationYearList.length;i++){
					if(year == applicationYearList[i].applicationYear){
						html += '<option value="'+applicationYearList[i].applicationYear+'" selected="selected">'+applicationYearList[i].applicationYear+'</option>';
						haveThisYear = true;
					}else{
						html += '<option value="'+applicationYearList[i].applicationYear+'">'+applicationYearList[i].applicationYear+'</option>';
					}
				}
				if(!haveThisYear){
					html += '<option value="'+year+'" selected="selected">'+year+'</option>';
				}
			}
			$("#applicationYearList").append(html);
			$("#applicationYearList").selectOrDie('destroy');
			$("#applicationYearList").selectOrDie();
		}
	})
}

function getListParams(currentPage){
	
	var type = $("#type").val();
	var matrixName = $("#matrixName").val();
	//var applicationYear = $("#applicationYearList").val();
	
	var params = {'params.type':type,
					'params.matrixName':matrixName,
					//'params.applicationYear':applicationYear, 
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

function getList(params){
	//清空列表
	$("#matrixList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/cityAuditGetList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var matrixList = data['matrixList'];
			var html = "";
			if(matrixList.length > 0){
				for(var i=0; i<matrixList.length; i++){
					if(!sendThirdTypeFlag){
						if(matrixList[i].sendThirdType == "1"){
							sendThirdTypeFlag = true;
						}
					}
					
					html += '<tr>';
					html += '<td width="20%">'+matrixList[i].matrixName+'</td>';
					html += '<td width="11%">'+matrixList[i].district+'</td>';
					html += '<td width="11%">'+matrixList[i].contacter+'</td>';
					html += '<td width="12%">'+matrixList[i].contactPhone+'</td>';
					html += '<td width="12%">'+matrixList[i].districtAuditTime.substring(0,10)+'</td>';
					if(undefined == matrixList[i].cityAuditTime){
						html += '<td width="12%"></td>';
					}else{
						html += '<td width="12%">'+matrixList[i].cityAuditTime.substring(0,10)+'</td>';
					}
					
					if(matrixList[i].cityAuditType == "0"){
						html += '<td width="10%">待审核</td>';
					}else if(matrixList[i].cityAuditType == "1"){
						html += '<td width="10%">未通过</td>';
					}else if(matrixList[i].cityAuditType == "2"){
						html += '<td width="10%">已通过</td>';
					}else if(matrixList[i].cityAuditType == "3"){
						html += '<td width="10%">已撤销</td>';
					}else{
						html += '<td width="10%"></td>';
					}
					
					if(matrixList[i].thirdPartyAuditType == "0"){
						html += '<td width="12%" class="link_blue examine" name="'+matrixList[i].userCode+'">查看</td>';
					}else if((matrixList[i].thirdPartyAuditType == "1" || matrixList[i].thirdPartyAuditType == "2")&&
							matrixList[i].cityAuditType == "0"){
						html += '<td width="12%" class="link_blue examine" name="'+matrixList[i].userCode+'">审核</td>';
					}else if((matrixList[i].thirdPartyAuditType == "1" || matrixList[i].thirdPartyAuditType == "2")&&
							(matrixList[i].cityAuditType == "1"||matrixList[i].cityAuditType == "2")){
						html += '<td width="12%" class="link_blue examine" name="'+matrixList[i].userCode+'">查看</td>';
					}
					
					html += '</tr>';
				}
			}else{
				html += '<tr><td>未查询到数据！</td></tr>'
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
			
			if(sendThirdTypeFlag){
				$("#sendThirdType").val("已递交第三方");
				/*$("#sendThirdTypeBtn").hide();*/
			}else{
				$("#sendThirdType").val("未递交第三方");
				/*$("#sendThirdTypeBtn").show();*/
			}
			
		}
	})
}