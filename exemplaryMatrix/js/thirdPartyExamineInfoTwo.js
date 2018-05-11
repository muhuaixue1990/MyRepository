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
	$("#gotoThirdPartyAudit").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	getExemplaryMatrixRecommendByParams();
	getExemplaryMatrixRecommendEvaluateList();
	
	initButton();
	
	$("#goBack").click(function(){
		window.location.href = window.location.href = rootPath+"/page/jsp/exemplaryMatrix/thirdPartyAuditList.jsp"
	})
})

/**
 * 根据审核状态和是否审核开关初始化页面
 */
function initButton(){
//	var nowTime = "";
//	$.ajax({
//		type: "post",
//		url: rootPath+"/exemplaryMatrixApplication/getNowTime.action",
//		async : false,
//		timeout : 30000,
//		dataType:'json',
//		beforeSend: function(XMLHttpRequest){},
//		success: function(data, textStatus){
//			nowTime = data['nowTime'];
//		}
//	})
	
//	var nowYear = nowTime.substring(0,4);
//	var nowTimeFlag = false;
//	if(nowYear == paramApplicationYear){
//		nowTimeFlag = true;
//	}else{
//		nowTimeFlag = false;
//	}
	
	
	if(auditType=="" && auditFlag==""){
		//第一次进入第三方审核，隐藏说明
		$("#opinionTr").hide();
	}else{
		//查询推荐/不推荐理由
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
					$("#opinionShow").val(exemplaryMatrixApplication.opinion);
				}
			}
		})
		
		if(auditType == "1"){
			$("#opinionTitle").text("");
			$("#opinionTitle").text("不推荐理由：");
			$("#noRecommend").hide();
			$("#recommend").hide();
		}else if(auditType == "2"){
			$("#opinionTitle").text("");
			$("#opinionTitle").text("推荐理由：");
			$("#noRecommend").hide();
			$("#recommend").hide();
		}
		
		/*if(auditFlag == "true" && nowTimeFlag){
			//第三方推荐后就不再展示推荐按钮
			if(exemplaryMatrixApplication.thirdPartyAuditType!='0'){
				$("#noRecommend").hide();
				$("#recommend").hide();
			}
		}else if(auditFlag == "true" && !nowTimeFlag){
			
		}else if(auditFlag == "false"){
			$("#noRecommend").hide();
			$("#recommend").hide();
		}*/
	}
}

function audit(flag){
	var opinion = $("#opinion").val();
	var params = "";
	if(flag == "2"){
		params = {"params.applicationUserCode":applicationUserCode,
					"params.userCode":userCode,
					"params.auditType":"thirdParty",
					"params.flag":flag,
					"params.opinion":opinion}
	}else if(flag == "1"){
		params = {"params.applicationUserCode":applicationUserCode,
					"params.userCode":userCode,
					"params.auditType":"thirdParty",
					"params.flag":flag,
					"params.opinion":opinion}
	}
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/audit.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("审核失败！");
			}else{
				alert("审核成功！");
				//发站内信
				if(flag == "1"){
					sendletter(applicationUserCode,"您提交的示范基地申请第三方机构审核未通过，请点击查看",2,applicationId,"22011");
				}else if(flag == "2"){
					sendletter(applicationUserCode,"您提交的示范基地申请第三方机构审核已通过，请点击查看",2,applicationId,"22011");
				}
				
				window.location.href = rootPath+"/page/jsp/exemplaryMatrix/thirdPartyAuditList.jsp";
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
					$("input[name='evaluativeMethods'][value='"+evaluativeMethodsArray[i]+"']").iCheck('check');
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