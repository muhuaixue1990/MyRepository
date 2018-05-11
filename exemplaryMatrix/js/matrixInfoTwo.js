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
	
	getBusinessCircumstanceByParams();
	
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoThree.jsp";
	})
	
	$("#lastStep").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoOne.jsp";
	})
	
	$("#nextStep").click(function(){
		if(check()){
			saveInfo();
		}
	})
	
	
	$("#developmentPlanningUrl").change(function () {
		upload($(this));
	})
	$("#managementSystemUrl").change(function () {
		upload($(this));
	})
	$("#goalOfDevelopmentUrl").change(function () {
		upload($(this));
	})
	$("#feeScaleUrl").change(function () {
		upload($(this));
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
		if(saveCheck()){
			saveInfo2();
		}
	})
	
	$('input[name="developmentPlanning"]').on('ifChecked', function(event){
		var value = $(this).val();
		if(value == "0"){
			$("input[name='exemplaryMatrixApplication.developmentPlanningUrl']").val("");
			$("#developmentPlanningUrlRight").hide();
		}
	});
	
	$('input[name="managementSystem"]').on('ifChecked', function(event){
		var value = $(this).val();
		if(value == "0"){
			$("input[name='exemplaryMatrixApplication.managementSystemUrl']").val("");
			$("#managementSystemUrlRight").hide();
		}
	});
	
	$("body").on("blur",".xiaoweiqiye",function(){
		var xiaoweiqiyeshu = parseInt($(this).val());
		var thisId = $(this).attr("id");
		var index = thisId.substring(thisId.lastIndexOf("_")+1,thisId.length);
		var ruzhuqiyeshu = parseInt($("#enterpriseQuantity_"+index).val());
		
		if(xiaoweiqiyeshu > ruzhuqiyeshu){
			$("#xiaoweiqiye_error_"+index).show();
			$("#xiaoweiqiye_error_"+index).text("其中小微企业数不能大于入驻企业数");
			xiaoweiqiyeFlag = false;
		}else{
			$("#xiaoweiqiye_error_"+index).hide();
			xiaoweiqiyeFlag = true;
		}
	})
	
	$("body").on("blur",".ruzhuqiye",function(){
		var ruzhuqiyeshu = parseInt($(this).val());
		var thisId = $(this).attr("id");
		var index = thisId.substring(thisId.lastIndexOf("_")+1,thisId.length);
		var xiaoweiqiyeshu = parseInt($("#smallMicroEnterpriseQuantity_"+index).val());
		
		if(xiaoweiqiyeshu > ruzhuqiyeshu){
			xiaoweiqiyeFlag = false;
		}else{
			$("#xiaoweiqiye_error_"+index).hide();
			xiaoweiqiyeFlag = true;
		}
	})
	
})


function check(){
	var flag = true ;
	$(".checkInfo").each(function(){
		var thisInput = $(this).val();
		if($.trim(thisInput) == ""){
			var str = $(this).parent().siblings("th").children().text();
			str = str.substring(0,str.length-1);
			if(str == ""){
				alert("基地为入驻企业提供办公、生产、服务场所（列举） 不能为空！");
			}else{
				alert(str+" 不能为空！");
			}
			flag = false;
			return flag;
		}
	})
		
	if(flag){
		var developmentPlanning = $("input[name='developmentPlanning']:checked").val();
		var managementSystem = $("input[name='managementSystem']:checked").val();
		if(developmentPlanning == "0"){
			$("input[name='exemplaryMatrixApplication.developmentPlanningUrl']").removeClass("checkImg");
		}
		if(managementSystem == "0"){
			$("input[name='exemplaryMatrixApplication.managementSystemUrl']").removeClass("checkImg");
		}
		
		$(".checkImg").each(function(){
			var thisInput = $(this).val();
			if($.trim(thisInput) == ""){
				var str = $(this).parent().parent().siblings("th").children().text();
				str = str.substring(0,str.length-1);
				alert("请上传,"+str);
				flag = false;
				return flag;
			}
		})
	}
	
	if(flag){
		var checkBCLength = $(".checkBC").length;
		$(".checkBC").each(function(index){
			if(index == (checkBCLength-1) || 
				index == (checkBCLength-2) || 
				index == (checkBCLength-3) || 
				index == (checkBCLength-4) || 
				index == (checkBCLength-5) || 
				index == (checkBCLength-6) || 
				index == (checkBCLength-7)){
				
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
	}
	
	if(flag){
		if(!xiaoweiqiyeFlag){
			alert("小微企业数不能大于入驻企业数，请修改");
			flag = false;
			return flag;
		}
	}
	
	//增加验证整数
	if(flag){
		var checkIntLength = $(".checkInt").length;
		$(".checkInt").each(function(index){
			if(index == (checkIntLength-1)||
					index == (checkIntLength-2)||
					index == (checkIntLength-3)||
					index == (checkIntLength-4)){
				
			}else{
				var reg=/^[0-9]\d*$/; //由 1-9开头 的正则表达式
				
				var thisInput = $(this).val();
				
				if($.trim(thisInput) != "" && !reg.test(thisInput)){
					var str = $(this).parent().siblings("th").children().text();
					str = str.substring(0,str.length-1);
					alert(str+" 只能为整数！");
					flag = false;
					return flag;
				}
			}
		})
	}
	
	return flag;
}

function saveCheck(){
	var flag = true ;
	
	//增加验证整数
	if(flag){
		var checkIntLength = $(".checkInt").length;
		$(".checkInt").each(function(index){
			if(index == (checkIntLength-1)||
					index == (checkIntLength-2)||
					index == (checkIntLength-3)||
					index == (checkIntLength-4)){
				
			}else{
				var reg=/^[0-9]\d*$/; //由 1-9开头 的正则表达式
				
				var thisInput = $(this).val();
				
				if($.trim(thisInput) != "" && !reg.test(thisInput)){
					var str = $(this).parent().siblings("th").children().text();
					str = str.substring(0,str.length-1);
					alert(str+" 只能为整数！");
					flag = false;
					return flag;
				}
			}
		})
	}
	
	return flag;
}


//上传文件
function upload(e){
	//获取当前input框id属性值
	var id = e.attr("id");
	if(id == "developmentPlanningUrl"){
		$("input[name='exemplaryMatrixApplication.developmentPlanningUrl']").val("");
	}else if(id == "managementSystemUrl"){
		$("input[name='exemplaryMatrixApplication.managementSystemUrl']").val("");
	}else if(id == "goalOfDevelopmentUrl"){
		$("input[name='exemplaryMatrixApplication.goalOfDevelopmentUrl']").val("");
	}else if(id == "feeScaleUrl"){
		$("input[name='exemplaryMatrixApplication.feeScaleUrl']").val("");
	}
	
	
	var $val = e.val();
	var shangchuanwenjianming = $val.substring($val.lastIndexOf("\\")+1,$val.length);
	//上传文件格式jpg,png
	var $form =$val.slice(-3,$val.length);
	if ($val!=""&&($form=="doc"||$form=="ocx"||$form=="rar"||$form=="zip")) {
		$.ajaxFileUpload({
	        url : rootPath+"/exemplaryMatrixApplication/uploadFile.action?userCode="+userCode+"&fileType="+id ,//用于文件上传的服务器端请求地址
	        secureuri : false,//一般设置为false
	        fileElementId : id,//文件上传空间的id属性  <input type="file" id="file" name="file" />
	        //dataType: 'json',//返回值类型 一般设置为json
	        success: function (data, status){
	        	alert("上传成功！");
	        	var fileName = $(data).text();
	        	if(id == "developmentPlanningUrl"){
	        		$("input[name='exemplaryMatrixApplication.developmentPlanningUrl']").val(fileName);
	        		$("#developmentPlanningUrlRight").show();
	        		$("#developmentPlanningUrlRight").attr("title",shangchuanwenjianming)
	        	}else if(id == "managementSystemUrl"){
	        		$("input[name='exemplaryMatrixApplication.managementSystemUrl']").val(fileName);
	        		$("#managementSystemUrlRight").show();
	        		$("#managementSystemUrlRight").attr("title",shangchuanwenjianming)
	        	}else if(id == "goalOfDevelopmentUrl"){
	        		$("input[name='exemplaryMatrixApplication.goalOfDevelopmentUrl']").val(fileName);
	        		$("#goalOfDevelopmentUrlRight").show();
	        		$("#goalOfDevelopmentUrlRight").attr("title",shangchuanwenjianming)
	        	}else if(id == "feeScaleUrl"){
	        		$("input[name='exemplaryMatrixApplication.feeScaleUrl']").val(fileName);
	        		$("#feeScaleUrlRight").show();
	        		$("#feeScaleUrlRight").attr("title",shangchuanwenjianming)
	        	}
	        },
	        error: function (data, status, e)//服务器响应失败处理函数
	        {
	            alert(e);
	        },
	        complete: function(xmlHttpRequest) {
	        	var count = Math.random();
	        	e.replaceWith('input type="file" class="matrixApplicationInfo" accept=".doc,.docx" id="'+id+'" name="file" style="title:'+count+'"');  
	        	$("#"+id+"").on("change", function(){  
	        		upload($(this));
                });
            }
	    });
	}else{
		alert("只能上传word或压缩文件！");
	}
}

function getMatrixInfoByCode(){
	$("#opticalFiber").val("");
	$("#wifi").val("");
	$("#broadband").val("");
	
	$("#goalOfDevelopment").val("");
	$("#feeScale").val("");
	
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
					$(".matrixApplicationInfo").attr("disabled","disabled");
					$(".checkBC").attr("readonly","readonly");
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
					$(".matrixApplicationInfo").attr("disabled","disabled");
					$(".checkBC").attr("readonly","readonly");
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
					$(".matrixApplicationInfo").attr("disabled","disabled");
					$(".checkBC").attr("readonly","readonly");
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
					$(".matrixApplicationInfo").attr("disabled","disabled");
					$(".checkBC").attr("readonly","readonly");
					$("#save").hide();
					$("#nextStep").hide();
					$("#cancel").show();
				}
				
				
				
				
				
				
				$("#opticalFiber").val(exemplaryMatrixApplication.opticalFiber);
				$("#wifi").val(exemplaryMatrixApplication.wifi);
				$("#broadband").val(exemplaryMatrixApplication.broadband);
				
				$("input[name='developmentPlanning'][value='"+exemplaryMatrixApplication.developmentPlanning+"']").attr("checked","true");
				$("input[name='managementSystem'][value='"+exemplaryMatrixApplication.managementSystem+"']").attr("checked","true");
        		
        		
        		var developmentPlanningUrl = exemplaryMatrixApplication.developmentPlanningUrl;
        		developmentPlanningUrl = developmentPlanningUrl.substring((developmentPlanningUrl.lastIndexOf('/')+1),developmentPlanningUrl.length);
        		
        		var managementSystemUrl = exemplaryMatrixApplication.managementSystemUrl;
        		managementSystemUrl = managementSystemUrl.substring((managementSystemUrl.lastIndexOf('/')+1),managementSystemUrl.length);
        		
        		var goalOfDevelopmentUrl = exemplaryMatrixApplication.goalOfDevelopmentUrl;
        		goalOfDevelopmentUrl = goalOfDevelopmentUrl.substring((goalOfDevelopmentUrl.lastIndexOf('/')+1),goalOfDevelopmentUrl.length);
        		
        		var feeScaleUrl = exemplaryMatrixApplication.feeScaleUrl;
        		feeScaleUrl = feeScaleUrl.substring((feeScaleUrl.lastIndexOf('/')+1),feeScaleUrl.length);
        		
        		if(developmentPlanningUrl!="" &&developmentPlanningUrl!="null" &&developmentPlanningUrl!=undefined){
        			$("#developmentPlanningUrlRight").show();
        			$("#developmentPlanningUrlRight").attr("title",developmentPlanningUrl)
        			$("input[name='exemplaryMatrixApplication.developmentPlanningUrl']").val(developmentPlanningUrl);
        		}
        		
        		if(managementSystemUrl!="" &&managementSystemUrl!="null" &&managementSystemUrl!=undefined){
        			$("#managementSystemUrlRight").show();
        			$("#managementSystemUrlRight").attr("title",managementSystemUrl)
        			$("input[name='exemplaryMatrixApplication.managementSystemUrl']").val(managementSystemUrl);
        		}
        		
        		if(goalOfDevelopmentUrl!="" &&goalOfDevelopmentUrl!="null" &&goalOfDevelopmentUrl!=undefined){
        			$("#goalOfDevelopmentUrlRight").show();
        			$("#goalOfDevelopmentUrlRight").attr("title",goalOfDevelopmentUrl)
        			$("input[name='exemplaryMatrixApplication.goalOfDevelopmentUrl']").val(goalOfDevelopmentUrl);
        		}
        		
        		if(feeScaleUrl!="" &&feeScaleUrl!="null" &&feeScaleUrl!=undefined){
        			$("#feeScaleUrlRight").show();
        			$("#feeScaleUrlRight").attr("title",feeScaleUrl)
        			$("input[name='exemplaryMatrixApplication.feeScaleUrl']").val(feeScaleUrl);
        		}
				
				
				$("#goalOfDevelopment").val(exemplaryMatrixApplication.goalOfDevelopment);
				$("#feeScale").val(exemplaryMatrixApplication.feeScale);
				
				applicationId = exemplaryMatrixApplication.id;
				$("input[name='applicationId']").val(exemplaryMatrixApplication.id);
				
				$("#providePlace").val(exemplaryMatrixApplication.providePlace);
			}
			
		}
	})
}





/**
 * 保存信息
 */
function saveInfo(){
	var providePlace = $("#providePlace").val();
	
	var opticalFiber = $("#opticalFiber").val();
	var wifi = $("#wifi").val();
	var broadband = $("#broadband").val();
	var developmentPlanning = $("input[name='developmentPlanning']:checked").val();
	var managementSystem = $("input[name='managementSystem']:checked").val();
	var goalOfDevelopment = $("#goalOfDevelopment").val();
	var feeScale = $("#feeScale").val();
	
	var developmentPlanningUrl = $("input[name='exemplaryMatrixApplication.developmentPlanningUrl']").val();
	var managementSystemUrl = $("input[name='exemplaryMatrixApplication.managementSystemUrl']").val();
	var goalOfDevelopmentUrl = $("input[name='exemplaryMatrixApplication.goalOfDevelopmentUrl']").val();
	var feeScaleUrl = $("input[name='exemplaryMatrixApplication.feeScaleUrl']").val();
	
	var params = {"exemplaryMatrixApplication.userCode":userCode,
					"exemplaryMatrixApplication.providePlace":providePlace,
					"exemplaryMatrixApplication.opticalFiber":opticalFiber,
					"exemplaryMatrixApplication.wifi":wifi,
					"exemplaryMatrixApplication.broadband":broadband,
					"exemplaryMatrixApplication.developmentPlanning":developmentPlanning,
					"exemplaryMatrixApplication.managementSystem":managementSystem,
					"exemplaryMatrixApplication.goalOfDevelopment":goalOfDevelopment,
					"exemplaryMatrixApplication.feeScale":feeScale,
					"exemplaryMatrixApplication.developmentPlanningUrl":developmentPlanningUrl,
					"exemplaryMatrixApplication.managementSystemUrl":managementSystemUrl,
					"exemplaryMatrixApplication.goalOfDevelopmentUrl":goalOfDevelopmentUrl,
					"exemplaryMatrixApplication.feeScaleUrl":feeScaleUrl}
	
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveOrUpdateApplication.action",
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
				saveBusinessCircumstance();
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
 * 保存经营情况方法
 */
function saveBusinessCircumstance(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveBusinessCircumstance.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#businessCircumstanceForm").serialize(),
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败！");
			}else{
				window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoThree.jsp";
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
 * 新增保存方法
 */
function saveInfo2(){
	var providePlace = $("#providePlace").val();
	
	var opticalFiber = $("#opticalFiber").val();
	var wifi = $("#wifi").val();
	var broadband = $("#broadband").val();
	var developmentPlanning = $("input[name='developmentPlanning']:checked").val();
	var managementSystem = $("input[name='managementSystem']:checked").val();
	var goalOfDevelopment = $("#goalOfDevelopment").val();
	var feeScale = $("#feeScale").val();
	
	var developmentPlanningUrl = $("input[name='exemplaryMatrixApplication.developmentPlanningUrl']").val();
	var managementSystemUrl = $("input[name='exemplaryMatrixApplication.managementSystemUrl']").val();
	var goalOfDevelopmentUrl = $("input[name='exemplaryMatrixApplication.goalOfDevelopmentUrl']").val();
	var feeScaleUrl = $("input[name='exemplaryMatrixApplication.feeScaleUrl']").val();
	
	var params = {"exemplaryMatrixApplication.userCode":userCode,
					"exemplaryMatrixApplication.providePlace":providePlace,
					"exemplaryMatrixApplication.opticalFiber":opticalFiber,
					"exemplaryMatrixApplication.wifi":wifi,
					"exemplaryMatrixApplication.broadband":broadband,
					"exemplaryMatrixApplication.developmentPlanning":developmentPlanning,
					"exemplaryMatrixApplication.managementSystem":managementSystem,
					"exemplaryMatrixApplication.goalOfDevelopment":goalOfDevelopment,
					"exemplaryMatrixApplication.feeScale":feeScale,
					"exemplaryMatrixApplication.developmentPlanningUrl":developmentPlanningUrl,
					"exemplaryMatrixApplication.managementSystemUrl":managementSystemUrl,
					"exemplaryMatrixApplication.goalOfDevelopmentUrl":goalOfDevelopmentUrl,
					"exemplaryMatrixApplication.feeScaleUrl":feeScaleUrl}
	
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveOrUpdateApplication.action",
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
				$.ajax({
					type: "post",
					url: rootPath+"/exemplaryMatrixApplication/saveBusinessCircumstance.action",
					async : false,
					timeout : 30000,
					dataType:'json',
					data: $("#businessCircumstanceForm").serialize(),
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
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (XMLHttpRequest.status == 901) {
				alert("您输入的参数含有非法字符！")
			}
		}
	})
}



/**
 * 进入页面获取经营情况列表
 */
function getBusinessCircumstanceByParams(){
	var params = {"params.userCode":userCode,
					"params.exemplaryMatrixApplicationId":applicationId};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getBusinessCircumstanceByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var businessCircumstances = data['businessCircumstances'];
				for(var i=0;i<businessCircumstances.length-1;i++){
					newBusinessCircumstance();
				}
				
				for(var i=0;i<businessCircumstances.length;i++){
					$("input[name='year']:eq("+i+")").val(businessCircumstances[i].year);
					$("input[name='operationRevenue']:eq("+i+")").val(businessCircumstances[i].operationRevenue);
					$("input[name='smallMicroEnterpriseQuantity']:eq("+i+")").val(businessCircumstances[i].smallMicroEnterpriseQuantity);
					$("input[name='personnelQuantity']:eq("+i+")").val(businessCircumstances[i].personnelQuantity);
					$("input[name='totalAssets']:eq("+i+")").val(businessCircumstances[i].totalAssets);
					$("input[name='enterpriseQuantity']:eq("+i+")").val(businessCircumstances[i].enterpriseQuantity);
					$("input[name='proportion']:eq("+i+")").val(businessCircumstances[i].proportion);
					
				}
			}
		}
	})
}


