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
	$("#goSeven").addClass("on");
	$("#stepDiv").removeClass("a1").removeClass("a2").removeClass("a3").removeClass("a4").removeClass("a5").removeClass("a6").removeClass("a7");
	$("#stepDiv").addClass("a7");
	
	getMatrixInfoByCode();
	getEnterpriseEvaluateByParams();
	
	$("#lastStep").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationSix.jsp";
	})
	
	$("#save").click(function(){
		saveEnterpriseEvaluate();
	})
	
	$("#submit").click(function(){
		var result = confirm("确定提交申请？")
		if(result == true){
			submitMatrixApplication();
		}
	})
	
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/home.jsp";
	})
	
	$("#exportApplication").click(function(){
		exportApplication();
	})
	
	//验证第三页和第六页填写情况
	checkPageThreeAndPageSix();
})

/**
 * 验证第三页和第六页填写情况
 */
function checkPageThreeAndPageSix(){
	var params = {"params.userCode":userCode,
					"params.exemplaryMatrixApplicationId":applicationId};
	$.ajax({
	type: "post",
	url: rootPath+"/exemplaryMatrixApplication/getCooperationFacilitatingAgencyByParams.action",
	async : false,
	timeout : 30000,
	dataType:'json',
	data: params,
	beforeSend: function(XMLHttpRequest){},
	success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				pageThree = true;
			}else{
				pageThree = false;
			}
		}
	})
	
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getPersonnelListByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				pageSix = true;
			}else{
				pageSix = false;
			}
		}
	})
}

/**
 * 导出方法
 */
function exportApplication(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/exportExemplaryMatrixApplicationExcel.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
		}
	})
}

/**
 * 提交申请
 */
function submitMatrixApplication(){
	if(check()){
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/saveEnterpriseEvaluate.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: $("#enterpriseEvaluateForm").serialize(),
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("保存失败！");
				}else if(status == "1"){
					saveFlag = true;
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status == 901) {
					alert("您输入的参数含有非法字符！")
				}
			}
		})
	}
	
	if(saveFlag){
		//增加前几页非空验证
		if(pageOne && pageTwo && pageThree && pageFour && pageFive && pageSix){
			submitFlag = true;
		}else if(!pageOne){
			alert("示范基地申请表第一页未填写，请填写！");
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationOne.jsp";
		}else if(!pageTwo){
			alert("示范基地申请表第二页未填写，请填写！");
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationTwo.jsp";
		}else if(!pageThree){
			alert("示范基地申请表第三页未填写，请填写！");
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationThree.jsp";
		}else if(!pageFour){
			alert("示范基地申请表第四页未填写，请填写！");
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationFour.jsp";
		}else if(!pageFive){
			alert("示范基地申请表第五页未填写，请填写！");
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationFive.jsp";
		}else if(!pageSix){
			alert("示范基地申请表第六页未填写，请填写！");
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationSix.jsp";
		}
		
		if(submitFlag){
			var params = {"params.userCode":userCode};
			$.ajax({
				type: "post",
				url: rootPath+"/exemplaryMatrixApplication/submitMatrixApplication.action",
				async : false,
				timeout : 30000,
				dataType:'json',
				data: params,
				beforeSend: function(XMLHttpRequest){},
				success: function(data, textStatus){
					var status = data['status'];
					if(status == "1"){
						alert("提交成功！");
						window.location.href = rootPath+"/page/jsp/exemplaryMatrix/resultForApplication.jsp";
					}else if(status == "0"){
						alert("提交失败！");
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					if (XMLHttpRequest.status == 901) {
						alert("您输入的参数含有非法字符！")
					}
				}
			})
		}else{
			alert("提交失败！");
		}
		
	}
	
}

/**
 * 获取申请表信息
 */
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
				pageOne = false;
				alert("您还未填写基地基本情况，请按照步骤填写！");
				window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationOne.jsp";
			}
			if(status == "1"){
				//增加判断
				pageOne = true;
				
				var exemplaryMatrixApplication = data['exemplaryMatrixApplication'];
				
				if(exemplaryMatrixApplication.type == "0"
					&& exemplaryMatrixApplication.districtAuditType == "0"
					&& exemplaryMatrixApplication.cityAuditType == "0"
					&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "0"
							&& exemplaryMatrixApplication.cityAuditType == "0"
							&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
					$(".matrixApplicationInfo").attr("readonly","readonly");
					$(".matrixApplicationInfoRadio").iCheck('disable');
					$("#save").hide();
					$("#submit").hide();
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "1"
							&& exemplaryMatrixApplication.cityAuditType == "0"
							&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& exemplaryMatrixApplication.cityAuditType == "0"
							&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
					$(".matrixApplicationInfo").attr("readonly","readonly");
					$(".matrixApplicationInfoRadio").iCheck('disable');
					$("#save").hide();
					$("#submit").hide();
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
					$(".matrixApplicationInfo").attr("readonly","readonly");
					$(".matrixApplicationInfoRadio").iCheck('disable');
					$("#save").hide();
					$("#submit").hide();
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& exemplaryMatrixApplication.cityAuditType == "1"
							&& (exemplaryMatrixApplication.thirdPartyAuditType == "2" || exemplaryMatrixApplication.thirdPartyAuditType == "1")){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& exemplaryMatrixApplication.cityAuditType == "2"
							&& (exemplaryMatrixApplication.thirdPartyAuditType == "2" || exemplaryMatrixApplication.thirdPartyAuditType == "1")){
					$(".matrixApplicationInfo").attr("readonly","readonly");
					$(".matrixApplicationInfoRadio").iCheck('disable');
					$("#save").hide();
					$("#submit").hide();
				}
				
				
				
				
				applicationId = exemplaryMatrixApplication.id;
				$("input[name='applicationId']").val(exemplaryMatrixApplication.id);
			}
			
			
			//增加提交判断
			if($.trim(exemplaryMatrixApplication.wifi) == ""){
				pageTwo = false;
			}else{
				pageTwo = true;
			}
			if($.trim(exemplaryMatrixApplication.informationService) == "" && 
					$.trim(exemplaryMatrixApplication.tutorship) == "" && 
					$.trim(exemplaryMatrixApplication.innovationSupport) == "" && 
					$.trim(exemplaryMatrixApplication.personnelTraining) == "" && 
					$.trim(exemplaryMatrixApplication.marketing) == "" && 
					$.trim(exemplaryMatrixApplication.financingService) == "" && 
					$.trim(exemplaryMatrixApplication.managementConsultancy) == "" && 
					$.trim(exemplaryMatrixApplication.otherService) == ""){
				pageFour = false;
			}else{
				pageFour = true;
			}
			if($.trim(exemplaryMatrixApplication.modelSelfreport) == "" ){
				pageFive = false;
			}else{
				pageFive = true;
			}
			
			
		}
	})
}

/**
 * 保存入驻企业评价信息
 */
function saveEnterpriseEvaluate(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveEnterpriseEvaluate.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#enterpriseEvaluateForm").serialize(),
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败！");
			}else if(status == "1"){
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
	var flag = true;
	var checkInfoLength = $(".checkInfo").length;
	$(".checkInfo").each(function(index){
		if(index == (checkInfoLength-1) || 
			index == (checkInfoLength-2) || 
			index == (checkInfoLength-3) || 
			index == (checkInfoLength-4) || 
			index == (checkInfoLength-5) || 
			index == (checkInfoLength-6)){
			
		}else{
			var thisInput = $(this).val();
			if($.trim(thisInput) == ""){
				var str = $(this).parent().siblings("th").children().text();
				str = str.substring(0,str.length-1);
				alert(str+" 不能为空！");
				flag = false;
				return flag;
			}
		}
	})
	if(flag){
		var checkIntLength = $(".checkInt").length;
		$(".checkInt").each(function(index){
			if(index == (checkIntLength-1)){
				
			}else{
				var thisInput = $(this).val();
				var g = /^[1-9]*[1-9][0-9]*$/;
				if(thisInput == 0){
					
				}else{
					if(!g.test(thisInput)){
				    	alert("入驻企业评价"+(index+1)+" 从业人数应填写正整数！");
				    	flag = false;
						return flag;
				    }
				}
			}
		})
	}
	return flag;
}

/**
 * 进入页面获取管理和服务人员名单及职称情况信息
 */
function getEnterpriseEvaluateByParams(){
	var params = {"params.userCode":userCode,
					"params.exemplaryMatrixApplicationId":applicationId};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getEnterpriseEvaluateByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var enterpriseEvaluates = data['enterpriseEvaluates'];
				for(var i=0;i<enterpriseEvaluates.length-1;i++){
					newEnterpriseEvaluate();
				}
				
				for(var i=0;i<enterpriseEvaluates.length;i++){
					$("input[name='no']:eq("+i+")").val(enterpriseEvaluates[i].no);
					$("input[name='legalRepresentative']:eq("+i+")").val(enterpriseEvaluates[i].legalRepresentative);
					$("input[name='personnelQuantity']:eq("+i+")").val(enterpriseEvaluates[i].personnelQuantity);
					$("input[name='enjoyService']:eq("+i+")").val(enterpriseEvaluates[i].enjoyService);
					$("input[name='enterpriseName']:eq("+i+")").val(enterpriseEvaluates[i].enterpriseName);
					$("input[name='entryTime']:eq("+i+")").val(enterpriseEvaluates[i].entryTime);
					$("input[name='contactPhone']:eq("+i+")").val(enterpriseEvaluates[i].contactPhone);
					$("input[name='evaluate"+i+"'][value="+enterpriseEvaluates[i].evaluate+"]").iCheck('check');
					
				}
			}
		}
	})
}