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
	$("#exemplaryMatrixRecommend").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	getMatrixInfoByCode();
	getExemplaryMatrixRecommendByParams();
	getExemplaryMatrixRecommendEvaluateList();
	
	
	$("#goBack").click(function(){
		window.location.href = rootPath + "/page/jsp/exemplaryMatrix/districtAuditList.jsp";
	})
	
	$("#save").click(function(){
		if(check()){
			saveExemplaryMatrixRecommend();
		}
	})
	
})

/**
 * 新增框
 */
function newExemplaryMatrixRecommendEvaluate(){
	var clone=$(".classDemo_PJY>.class_PJY").clone(true);
	$(".classList_PJY").append(clone);
	var startNum=$(".classList_PJY>div").length;
	for(var i=1;i<=startNum;i++){
		$($(".classList_PJY>div").get(i-1)).find(".newAccord").attr("name","accord"+(i-1));
		$($(".classList_PJY>div").get(i-1)).find(".newEvaluate").attr("name","evaluate"+(i-1));
		$($(".classList_PJY>div").get(i-1)).find(".bianhao").val(i);
		$($(".classList_PJY>div").get(i-1)).find(".randomTitle_PJY").html("抽样企业"+i)
		if(i == startNum){
			$($(".classList_PJY>div").get(i-1)).find("input[name='accord"+(i-1)+"'][value='2']").iCheck('check');
			$($(".classList_PJY>div").get(i-1)).find("input[name='evaluate"+(i-1)+"'][value='2']").iCheck('check');
		}
	}
	$('input').iCheck('destroy')
	$('input').iCheck({
		checkboxClass: 'icheckbox_square-orange',
		radioClass: 'iradio_square-orange'
	});
	changeTit();
}

function changeTit(){
	$(".advceVid_PJY input").on("ifChecked",function(){
		var con=$(this).parent().next().html();
		$(this).parent().parent().parent().parent().next().find(".con_PJY").html(con+"理由：")
	});
}


/**
 * 通过code获取基地信息
 */
function getMatrixInfoByCode(){
	var params = {"params.userCode":applicationUserCode,
					"params.applicationYear":paramApplicationYear};
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
				$("input[name='flag'][value='"+exemplaryMatrixApplication.districtAuditType+"']").attr("checked","true");
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
					$("input[name='evaluativeMethods'][value='"+evaluativeMethodsArray[i]+"']").attr("checked","true");
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
				for(var i=0;i<exemplaryMatrixRecommendEvaluates.length-1;i++){
					newExemplaryMatrixRecommendEvaluate();
				}
				
				for(var i=0;i<exemplaryMatrixRecommendEvaluates.length;i++){
					$("input[name='enterpriseName']:eq("+i+")").val(exemplaryMatrixRecommendEvaluates[i].enterpriseName);
					$("input[name='name']:eq("+i+")").val(exemplaryMatrixRecommendEvaluates[i].name);
					$("input[name='duty']:eq("+i+")").val(exemplaryMatrixRecommendEvaluates[i].duty);
					$("input[name='contactPhone']:eq("+i+")").val(exemplaryMatrixRecommendEvaluates[i].contactPhone);
					$("input[name='enjoyService']:eq("+i+")").val(exemplaryMatrixRecommendEvaluates[i].enjoyService);
					$("input[name='accord"+i+"'][value="+exemplaryMatrixRecommendEvaluates[i].accord+"]").iCheck('check');
					$("input[name='evaluate"+i+"'][value="+exemplaryMatrixRecommendEvaluates[i].evaluate+"]").iCheck('check');
				}
				
			}
		}
	})
}


function audit(flag,index){
	var evaluativeMethods = "";
	$("[name='evaluativeMethods']:checked").each(function(){ 
		evaluativeMethods += $(this).val()+",";
	})
	
	var evaluationOpinions = $("#evaluationOpinions").val();
	var recommendations = $("#recommendations").val();
	if($.trim(recommendations) == ""){
		if(flag == "2"){
			alert("推荐理由不能为空！");
		}else if(flag == "1"){
			alert("不推荐理由不能为空！");
		}
	}else{
		var params1 = {"exemplaryMatrixRecommend.userCode":applicationUserCode,
						"exemplaryMatrixRecommend.exemplaryMatrixApplicationId":applicationId,
						"exemplaryMatrixRecommend.evaluativeMethods":evaluativeMethods,
						"exemplaryMatrixRecommend.evaluationOpinions":evaluationOpinions,
						"exemplaryMatrixRecommend.recommendations":recommendations}

		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/saveExemplaryMatrixRecommend.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: params1,
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("操作失败！");
				}else{
					saveExemplaryMatrixRecommendEvaluate("audit");
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status == 901) {
					alert("您输入的参数含有非法字符！")
				}
			}
		})
		
		var params = "";
		if(flag == "2"){
			params = {"params.applicationUserCode":applicationUserCode,
						"params.userCode":userCode,
						"params.auditType":"district",
						"params.flag":flag}
		}else if(flag == "1"){
			params = {"params.applicationUserCode":applicationUserCode,
						"params.userCode":userCode,
						"params.auditType":"district",
						"params.flag":flag}
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
					alert("操作失败！");
				}else{
					alert("操作成功！");
					layer.close(index);
					window.location.href = rootPath + "/page/jsp/exemplaryMatrix/districtAuditList.jsp";
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status == 901) {
					alert("您输入的参数含有非法字符！")
				}
			}
		})
	}
}


/**
 * 保存推荐表信息
 */
function saveExemplaryMatrixRecommend(){
	var evaluativeMethods = "";
	$("[name='evaluativeMethods']:checked").each(function(){ 
		evaluativeMethods += $(this).val()+",";
	})
	
	var evaluationOpinions = $("#evaluationOpinions").val();
	
	
//	var recommendations = $("#recommendations").val();
	var params = {"exemplaryMatrixRecommend.userCode":applicationUserCode,
					"exemplaryMatrixRecommend.exemplaryMatrixApplicationId":applicationId,
					"exemplaryMatrixRecommend.evaluativeMethods":evaluativeMethods,
					"exemplaryMatrixRecommend.evaluationOpinions":evaluationOpinions
//					,"exemplaryMatrixRecommend.recommendations":recommendations
					}
	
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveExemplaryMatrixRecommend.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败！");
			}else{
				saveExemplaryMatrixRecommendEvaluate("save");
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (XMLHttpRequest.status == 901) {
				alert("您输入的参数含有非法字符！")
			}
		}
	})
}

/**
 * 保存推荐表附表
 */
function saveExemplaryMatrixRecommendEvaluate(msg){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveExemplaryMatrixRecommendEvaluate.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#exemplaryMatrixRecommendEvaluateForm").serialize(),
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败！");
			}else{
				if("save" == msg){
					alert("保存成功！");
				}
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (XMLHttpRequest.status == 901) {
				alert("您输入的参数含有非法字符！")
			}
		}
	})
}

function check(){
	var flag = true;
	var evaluativeMethods = "";
	$("[name='evaluativeMethods']:checked").each(function(){ 
		evaluativeMethods += $(this).val()+",";
	})
	if($.trim(evaluativeMethods) == ""){
		alert("请选择测评方法");
		flag = false;
		return flag;
	}
	if(flag){
		var checkEvaluateLength = $(".checkEvaluate").length;
		$(".checkEvaluate").each(function(index){
			if(index == (checkEvaluateLength-1) || 
				index == (checkEvaluateLength-2) || 
				index == (checkEvaluateLength-3) || 
				index == (checkEvaluateLength-4) || 
				index == (checkEvaluateLength-5)){
				
			}else{
				var thisInput = $(this).val();
				if($.trim(thisInput) == ""){
					var str = $(this).parent().prev("td").text();
					str = str.substring(0,str.length-1);
					alert(str+" 不能为空！");
					flag = false;
					return flag;
				}
			}
		})
	}
	if(flag){
//		var result = $("input[name='flag']:checked").val();
		var evaluationOpinions = $("#evaluationOpinions").val();
		var recommendations = $("#recommendations").val();
		if($.trim(evaluationOpinions) == ""){
			alert("企业对创业创新基地的具体评价及意见 不能为空");
			var flag = false;
			return flag;
		}
//		if(result == "2" && $.trim(recommendations) == ""){
//			alert("推荐理由 不能为空");
//			var flag = false;
//			return flag;
//		}
//		if(result == "1" && $.trim(recommendations) == ""){
//			alert("不推荐理由 不能为空");
//			var flag = false;
//			return flag;
//		}
	}
	
	return flag;
}