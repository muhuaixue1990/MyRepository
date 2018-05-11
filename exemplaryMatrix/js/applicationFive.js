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

//加载完成后执行
$(function(){
	//头的样式
	$("#navigationBar li").removeAttr("class");
	$("#special").attr("class","current");
	
	$(".step").removeClass("on");
	$("#goFive").addClass("on");
	$("#stepDiv").removeClass("a1").removeClass("a2").removeClass("a3").removeClass("a4").removeClass("a5").removeClass("a6").removeClass("a7");
	$("#stepDiv").addClass("a5");
	
	getMatrixInfoByCode();
	
	$("#lastStep").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationFour.jsp";
	})
	
	$("#nextStep").click(function(){
		saveOrUpdateApplication();
	})
	
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/home.jsp";
	})
	
	//新增保存方法
	$("#save").click(function(){
		saveInfo();
	})
})


function getMatrixInfoByCode(){
	$("#modelSelfreport").val("");
	
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
				alert("您还未填写基地基本情况，请按照步骤填写！");
				window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationOne.jsp";
			}
			
			if(status == "1"){
				var exemplaryMatrixApplication = data['exemplaryMatrixApplication'];
				
				if(exemplaryMatrixApplication.type == "0"
					&& exemplaryMatrixApplication.districtAuditType == "0"
					&& exemplaryMatrixApplication.cityAuditType == "0"
					&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "0"
							&& exemplaryMatrixApplication.cityAuditType == "0"
							&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
					$(".matrixApplicationInfo").attr("disabled","disabled");
					$("#save").hide();
					$("#nextStep").hide();
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "1"
							&& exemplaryMatrixApplication.cityAuditType == "0"
							&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& exemplaryMatrixApplication.cityAuditType == "0"
							&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
					$(".matrixApplicationInfo").attr("disabled","disabled");
					$("#save").hide();
					$("#nextStep").hide();
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& exemplaryMatrixApplication.cityAuditType == "3"
							&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& (exemplaryMatrixApplication.cityAuditType == "3"||exemplaryMatrixApplication.cityAuditType=="0")
							&& exemplaryMatrixApplication.thirdPartyAuditType == "1"){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& (exemplaryMatrixApplication.cityAuditType == "3"||exemplaryMatrixApplication.cityAuditType=="0")
							&& exemplaryMatrixApplication.thirdPartyAuditType == "2"){
					$(".matrixApplicationInfo").attr("disabled","disabled");
					$("#save").hide();
					$("#nextStep").hide();
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& exemplaryMatrixApplication.cityAuditType == "1"
							&& (exemplaryMatrixApplication.thirdPartyAuditType == "2" || exemplaryMatrixApplication.thirdPartyAuditType == "1")){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& exemplaryMatrixApplication.cityAuditType == "2"
							&& (exemplaryMatrixApplication.thirdPartyAuditType == "2" || exemplaryMatrixApplication.thirdPartyAuditType == "1")){
					$(".matrixApplicationInfo").attr("disabled","disabled");
					$("#save").hide();
					$("#nextStep").hide();
				}
				
				
				
				
				$("#modelSelfreport").val(exemplaryMatrixApplication.modelSelfreport);
//				limWord(".textarea01",400,".limitedW");
			}
			
		}
	})
}





/**
 * 保存/更新示范基地申请表
 */
function saveOrUpdateApplication(){
	if(check()){
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/saveOrUpdateApplication.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: $("#applicationForm").serialize(),
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("保存失败！");
				}else{
					window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationSix.jsp";
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
 * 新增保存方法
 */
function saveInfo(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveOrUpdateApplication.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#applicationForm").serialize(),
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败！");
			}else{
				alert("保存成功！");
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
	var flag = true ; 
	var modelSelfreport = $("#modelSelfreport").val();
	if($.trim(modelSelfreport) == ""){
		alert("示范性自述不能为空！");
		flag = false;
		return flag;
	}
	if($.trim(modelSelfreport).length > 400){
		alert("示范性自述不能超过400字！")
		flag = false;
		return flag;
	}
	return flag;
}