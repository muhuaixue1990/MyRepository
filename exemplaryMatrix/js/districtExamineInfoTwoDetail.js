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
	$("#exemplaryMatrixRecommend").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	getExemplaryMatrixRecommendByParams();
	getExemplaryMatrixRecommendEvaluateList();
	getMatrixInfoByCode();
	
	
	$("#goBack").click(function(){
		window.location.href = window.location.href = rootPath+"/page/jsp/exemplaryMatrix/districtAuditList.jsp"
	})
	
})

/**
 * 通过code获取基地信息
 */
function getMatrixInfoByCode(){
	var myDate = new Date();
	var year = myDate.getFullYear();
	
	var params = {"params.userCode":applicationUserCode
					//,"params.applicationYear":paramApplicationYear
					};
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
			if(status == "1"){
				var exemplaryMatrixApplication = data['exemplaryMatrixApplication'];
				$("input[name='flag'][value='"+exemplaryMatrixApplication.districtAuditType+"']").iCheck('check');
				if(exemplaryMatrixApplication.districtAuditType == "2"){
					$("#cause").text("推荐理由：")
				}else if(exemplaryMatrixApplication.districtAuditType == "1"){
					$("#cause").text("不推荐理由：")
				}
			}
		}
	})
}



/**
 * 通过参数获取推荐主表内容
 */
function getExemplaryMatrixRecommendByParams(){
	var params = {"params.userCode":applicationUserCode,
					"params.exemplaryMatrixApplicationId":applicationId}
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getExemplaryMatrixRecommendByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var exemplaryMatrixRecommend = data['exemplaryMatrixRecommend'];
				
				var evaluativeMethods = exemplaryMatrixRecommend.evaluativeMethods;
				var evaluativeMethodsArray = evaluativeMethods.split(",");
				for(var i=0;i<evaluativeMethodsArray.length-1;i++){
					$("input[name='evaluativeMethods'][value='"+evaluativeMethodsArray[i]+"']").iCheck('check')
					/*$("input[name='evaluativeMethods'][value='"+evaluativeMethodsArray[i]+"']").attr("checked","checked");*/
				}
				var evaluationOpinions = exemplaryMatrixRecommend.evaluationOpinions;
				$("#evaluationOpinions").val(evaluationOpinions);
				var recommendations = exemplaryMatrixRecommend.recommendations;
				$("#recommendations").val(recommendations);
			}
		}
	})
}

/**
 * 获取推荐附表内容
 */
function getExemplaryMatrixRecommendEvaluateList(){
	$("#exemplaryMatrixRecommendEvaluateList").empty();
	
	var params = {"params.userCode":applicationUserCode,
					"params.exemplaryMatrixApplicationId":applicationId}
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getExemplaryMatrixRecommendEvaluateList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var exemplaryMatrixRecommendEvaluates = data['exemplaryMatrixRecommendEvaluates'];
				var html = "";
				for(var i=0;i<exemplaryMatrixRecommendEvaluates.length;i++){
					html += '<tr>';
					html += '<td width="20%">'+exemplaryMatrixRecommendEvaluates[i].enterpriseName+'</td>';
					html += '<td width="10%">'+exemplaryMatrixRecommendEvaluates[i].name+'</td>';
					html += '<td width="10%">'+exemplaryMatrixRecommendEvaluates[i].duty+'</td>';
					html += '<td width="10%">'+exemplaryMatrixRecommendEvaluates[i].contactPhone+'</td>';
					html += '<td width="20%">'+exemplaryMatrixRecommendEvaluates[i].enjoyService+'</td>';
					var accord = exemplaryMatrixRecommendEvaluates[i].accord;
					if(accord == "2"){
						html += '<td width="20%">很符合</td>';
					}else if(accord == "1"){
						html += '<td width="20%">一般</td>';
					}else if(accord == "0"){
						html += '<td width="20%">不符合</td>';
					}
					
					var evaluate = exemplaryMatrixRecommendEvaluates[i].evaluate;
					if(evaluate == "2"){
						html += '<td width="10%">很满意</td>';
					}else if(evaluate == "1"){
						html += '<td width="10%">基本满意</td>';
					}else if(evaluate == "0"){
						html += '<td width="10%">不满意</td>';
					}
					html += '</tr>';
				}
				
				$("#exemplaryMatrixRecommendEvaluateList").append(html);
			}
		}
	})
}