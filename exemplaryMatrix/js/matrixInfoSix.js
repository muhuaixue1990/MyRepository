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
	//加高亮
	$("#gotoMatrixInfoManage").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	
	getMatrixInfoByCode();
	getPersonnelListByParams();
	
	$("#lastStep").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoFive.jsp";
	})
	
	$("#nextStep").click(function(){
		savePersonnelList();
		
	})
	
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoSeven.jsp";
	})
	
	//新增保存方法
	$("#save").click(function(){
		saveInfo();
	})
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
				alert("您还未填写基地基本情况，请按照步骤填写！");
//				window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationOne.jsp";
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
					$(".matrixApplicationInfo").attr("readonly","readonly");
					$(".matrixApplicationInfoRadio").iCheck('disable');
					$("#save").hide();
					$("#nextStep").hide();
					$("#cancel").show();
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
					$("#nextStep").hide();
					$("#cancel").show();
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
					$("#nextStep").hide();
					$("#cancel").show();
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
					$("#nextStep").hide();
					$("#cancel").show();
				}
				applicationId = exemplaryMatrixApplication.id;
				$("input[name='applicationId']").val(exemplaryMatrixApplication.id);
			}
			
		}
	})
}





/**
 * 保存管理和服务人员名单及职称情况信息
 */
function savePersonnelList(){
	if(check()){
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/savePersonnelList.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: $("#personnelListForm").serialize(),
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("保存失败！");
				}else{
					window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoSeven.jsp";
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
		url: rootPath+"/exemplaryMatrixApplication/savePersonnelList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#personnelListForm").serialize(),
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
	var flag = true;
	var checkLength = $(".matrixApplicationInfo").length;
	$(".matrixApplicationInfo").each(function(index){
		if(index == (checkLength-1) || 
			index == (checkLength-2) || 
			index == (checkLength-3) || 
			index == (checkLength-4) || 
			index == (checkLength-5) || 
			index == (checkLength-6)){
			
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
		$("input[name='age']").each(function(index){
			if($.trim($(this).val())!="" && isNaN($(this).val())){
				alert("年龄只能输入数字！请检查");
				flag=false;
				return flag;
			}
			
		})
	}
	/*if(flag){
		$("input[name='sex']").each(function(index){
			if($.trim($(this).val())!="" && $.trim($(this).val())!="男" && $.trim($(this).val())!="女"){
				alert("性别只能填写“男”或“女”！请检查");
				flag=false;
				return flag;
			}
		})
	}*/
	
	return flag;
}

/**
 * 进入页面获取管理和服务人员名单及职称情况信息
 */
function getPersonnelListByParams(){
	var params = {"params.userCode":userCode,
					"params.exemplaryMatrixApplicationId":applicationId};
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
				var personnelLists = data['personnelLists'];
				for(var i=0;i<personnelLists.length-1;i++){
					newPersonnelList();
				}
				
				for(var i=0;i<personnelLists.length;i++){
					$("input[name='no']:eq("+i+")").val(personnelLists[i].no);
					
					$("input[name='sex"+i+"'][value="+personnelLists[i].sex+"]").iCheck('check');
					
					$("input[name='educationBackground']:eq("+i+")").val(personnelLists[i].educationBackground);
					$("input[name='professionalTitle']:eq("+i+")").val(personnelLists[i].professionalTitle);
					$("input[name='name']:eq("+i+")").val(personnelLists[i].name);
					$("input[name='age']:eq("+i+")").val(personnelLists[i].age);
					$("input[name='duty']:eq("+i+")").val(personnelLists[i].duty);
					$("input[name='jobContent']:eq("+i+")").val(personnelLists[i].jobContent);
				}
			}
		}
	})
}