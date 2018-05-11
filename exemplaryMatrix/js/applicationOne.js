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
	$("#goOne").addClass("on");
	$("#stepDiv").removeClass("a1").removeClass("a2").removeClass("a3").removeClass("a4").removeClass("a5").removeClass("a6").removeClass("a7");
	$("#stepDiv").addClass("a1");
	
	//20170913添加验证，个人用户无法进入申报页面
	if(type != "1" && type != "0"){
		alert("您不是企业或认证通过的服务机构！");
		history.back();
	}
	
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/home.jsp";
	})
	
	getMatrixInfoByCode();
	getEnterpriseInfo();
	
	$("#nextStep").click(function(){
		saveOrUpdateApplication();
		
	})
	
	
	$(".double").keyup(function () {
        var reg = $(this).val().match(/\d+\.?\d{0,2}/);
        var txt = '';
        if (reg != null) {
            txt = reg[0];
        }
        $(this).val(txt);
    }).change(function () {
        $(this).keypress();
        var v = $(this).val();
        if (/\.$/.test(v))
        {
            $(this).val(v.substr(0, v.length - 1));
        }
    });
	
	//新增保存方法
	$("#save").click(function(){
		saveInfo();
	})
	
	getJiezhiriqi();
	
	
	//20170613新增验证
	$("#ownArea,#rentArea").blur(function(){
		if(!checkZiyouZuyong()){
			alert("自有面积与租用面积的和不能大于建筑面积！");
			window.getSelection().removeAllRanges();
		}
	})
	$("#commonalityArea").blur(function(){
		if(!checkGonggongfuwu()){
			alert("公共服务场所面积不能大于或等于建筑面积！");
			window.getSelection().removeAllRanges();
		}
	})
})

/**
 * 获取截止日期方法
 */
function getJiezhiriqi(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getNowTime.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var nowTime = data['nowTime'];
			var year = nowTime.substring(0,4);
			$("#jiezhiriqi").html("");
			$("#jiezhiriqi").html("申报单位从业人员数量&nbsp;&nbsp;&nbsp;&nbsp;<br>(截止至"+(year-1)+"年12月31日)：");
		}
	})
}


function getMatrixInfoByCode(){
	$("#establishTime").val("");
	$("#matrixName").val("");
	$("#matrixAddress").val("");
	$("#competentDepartment").val("");
	
	$("#projectArea").val("");
	$("#ownArea").val("");
	$("#commonalityArea").val("");
	$("#buildingArea").val("");
	$("#rentArea").val("");
	
	$("#personnelQuantity").val("");
	$("#serviceStaff").val("");
	$("#facilitatingAgency").val("");
	$("#providePlace").val("");
	$("#instructorQuantity").val("");
	$("#enterpriseQuantity").val("");
	
	//增加联系人联系电话
	$("#contacter").val("");
	$("#contactPhone").val("");
	
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
				
				
				$("#establishTime").val(exemplaryMatrixApplication.establishTime);
				$("#matrixName").val(exemplaryMatrixApplication.matrixName);
				$("#matrixAddress").val(exemplaryMatrixApplication.matrixAddress);
				$("#competentDepartment").val(exemplaryMatrixApplication.competentDepartment);
				
				$("#projectArea").val(exemplaryMatrixApplication.projectArea);
				$("#ownArea").val(exemplaryMatrixApplication.ownArea);
				$("#commonalityArea").val(exemplaryMatrixApplication.commonalityArea);
				$("#buildingArea").val(exemplaryMatrixApplication.buildingArea);
				$("#rentArea").val(exemplaryMatrixApplication.rentArea);
				
				$("#personnelQuantity").val(exemplaryMatrixApplication.personnelQuantity);
				$("#serviceStaff").val(exemplaryMatrixApplication.serviceStaff);
				$("#facilitatingAgency").val(exemplaryMatrixApplication.facilitatingAgency);
//				$("#providePlace").val(exemplaryMatrixApplication.providePlace);
				$("#instructorQuantity").val(exemplaryMatrixApplication.instructorQuantity);
				$("#enterpriseQuantity").val(exemplaryMatrixApplication.enterpriseQuantity);
				
				//增加联系人联系电话
				$("#contacter").val(exemplaryMatrixApplication.contacter);
				$("#contactPhone").val(exemplaryMatrixApplication.contactPhone);
			}
			
		}
	})
}

/**
 * 获取机构基本信息
 */
function getEnterpriseInfo(){
	//公司名
	$("#companyName").val("");
	//法人代表
	$("#legalRepresentative").val("");
	//注册资本
	$("#registeredCapital").val("");
	//企业网址
	$("#website").val("");
	
	//拼接请求参数
	var param = {'params.userCode':userCode};
	$.ajax({
		type: "post",
		url: rootPath+"/enterpriseInfo/selectEnterpriseInfoByUserCode.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: param,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(1==status){
				var enterpriseInfo = data['EnterpriseInfo'];
				if(enterpriseInfo.companyName == ""||enterpriseInfo.companyName == null || enterpriseInfo.companyName==undefined){
					alert("您还未填写企业基本信息，请完善！");
					window.location.href = rootPath+"/page/jsp/enterpriseInfo/entInfoPage.jsp";
				}
				
				//公司名
				$("#companyName").val(enterpriseInfo.companyName);
				
				/*if($.trim($("#contacter").val()) == ""){
					//联系人
					$("#contacter").val(enterpriseInfo.contacter);
				}
				
				if($.trim($("#contactPhone").val()) == ""){
					//联系电话
					$("#contactPhone").val(enterpriseInfo.contactPhone);
				}*/
				
				//法人代表
				$("#legalRepresentative").val(enterpriseInfo.legalRepresentative);
				//注册资本
				$("#registeredCapital").val(enterpriseInfo.registeredCapital+" 万元");
				//企业网址
				$("#website").val(enterpriseInfo.website);
			}else if(status == 0){
				alert("您还未填写企业基本信息，请完善！");
				window.location.href = rootPath+"/page/jsp/enterpriseInfo/entInfoPage.jsp";
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
				}else if(status == "1"){
					id = data['id'];
					window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationTwo.jsp";
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
 * 保存操作
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
	var flag = true
	$(".matrixApplicationInfo").each(function(){
		var thisInput = $(this).val();
		if($.trim(thisInput) == ""){
			var str = $(this).parent().siblings("th").children().text();
			str = str.substring(0,str.length-1);
			alert(str+" 不能为空！");
			flag = false;
			return flag;
		}
	})
	if(flag){
		if(!checkZiyouZuyong()){
			alert("自有面积与租用面积的和不能大于建筑面积！");
			flag = false;
			return flag;
		}
	}
	if(flag){
		if(!checkGonggongfuwu()){
			alert("公共服务服务场所面积不能大于或等于建筑面积！");
			flag = false;
			return flag;
		}
	}
	return flag;
}

/**
 * 验证自有+租用面积不大于建筑面积
 * @returns {Boolean}
 */
function checkZiyouZuyong(){
	var ownArea = $("#ownArea").val();
	var rentArea = $("#rentArea").val();
	var buildingArea = $("#buildingArea").val();
	ownArea = $.trim(ownArea)==""?0:parseFloat(ownArea);
	rentArea = $.trim(rentArea)==""?0:parseFloat(rentArea);
	buildingArea = $.trim(buildingArea)==""?0:parseFloat(buildingArea);
	if((ownArea+rentArea)>buildingArea){
		return false;
	}else{
		return true;
	}
}

/**
 * 验证公共服务面积不大于建筑面积
 * @returns {Boolean}
 */
function checkGonggongfuwu(){
	var commonalityArea = $("#commonalityArea").val();
	var buildingArea = $("#buildingArea").val();
	commonalityArea = $.trim(commonalityArea)==""?0:parseFloat(commonalityArea);
	buildingArea = $.trim(buildingArea)==""?0:parseFloat(buildingArea);
	if(commonalityArea>=buildingArea){
		return false;
	}else{
		return true;
	}
}