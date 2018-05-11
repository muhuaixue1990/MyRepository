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
	getServiceFunctionByParams();
	
	$("#lastStep").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoThree.jsp";
	})
	
	$("#nextStep").click(function(){
		if(check()){
			saveServiceFunction();
		}
	})
	
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoFive.jsp";
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
	
	
	//计算八个输入框剩余字数
	limWord("#informationService",500,"#informationServiceNo");
	limWord("#tutorship",500,"#tutorshipNo");
	limWord("#innovationSupport",500,"#innovationSupportNo");
	limWord("#personnelTraining",500,"#personnelTrainingNo");
	limWord("#marketing",500,"#marketingNo");
	limWord("#financingService",500,"#financingServiceNo");
	limWord("#managementConsultancy",500,"#managementConsultancyNo");
	limWord("#otherService",500,"#otherServiceNo");
	
	$("#informationService").keyup(function(){
		limWord("#informationService",500,"#informationServiceNo");
	})
	
	$("#tutorship").keyup(function(){
		limWord("#tutorship",500,"#tutorshipNo");
	})
	
	$("#innovationSupport").keyup(function(){
		limWord("#innovationSupport",500,"#innovationSupportNo");
	})
	
	$("#personnelTraining").keyup(function(){
		limWord("#personnelTraining",500,"#personnelTrainingNo");
	})
	
	$("#marketing").keyup(function(){
		limWord("#marketing",500,"#marketingNo");
	})
	
	$("#financingService").keyup(function(){
		limWord("#financingService",500,"#financingServiceNo");
	})
	
	$("#managementConsultancy").keyup(function(){
		limWord("#managementConsultancy",500,"#managementConsultancyNo");
	})
	
	$("#otherService").keyup(function(){
		limWord("#otherService",500,"#otherServiceNo");
	})
	
	
	//计数
	$("body").on("keyup",".serviceScale",function(){
		var id=$(this).attr("id");
		var index = id.substring(id.lastIndexOf("_")+1,id.length);
		limWord("#"+id,300,"#serviceScaleShow_"+index);
	})
	
})

/**
 * 计算剩余字数方法
 * @param ele
 * @param num
 * @param show
 */
function limWord(ele,num,show){
        var n2=$(ele).val().length;
        if(n2>0&&n2<=num){
            $(show).html(num-n2);
        }else if(n2>num){
            $(show).html(0);
            var text=$(ele).val();
            var html=text.slice(0,num);
            $(ele).val(html)
        }else{
            $(show).html(num);
        }
        $(ele).on("input propertychange",function(){
            if($.syncProcessSign) return ;
            $.syncProcessSign = true;
            var val=$(this).val();
            var n1=val.length;
            if(n1<num){
                $(show).html(num-n1)
            }else{
                var html=val.slice(0,num);
                $(this).val(html);
                $(show).html(0)
            }
            $.syncProcessSign = false;
        })
    }


function check(){
	var flag = true;
	var checkSFLength = $(".checkSF").length;
	$(".checkSF").each(function(index){
		if(index == (checkSFLength-1) || 
			index == (checkSFLength-2) || 
			index == (checkSFLength-3)){
			
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
	//增加判断
	//先判断否的数量，是否超过四个
	if(flag){
		var serviceNo = 0;
		$(".checkInfo").each(function(){
			if($(this).attr("disabled") == undefined){
				serviceNo++
			}
		})
		if(serviceNo < 4){
			alert("您至少要填写4项服务内容!")
			flag = false;
			return flag;
		}
	}
	if(flag){
		$(".checkInfo").each(function(){
			if($(this).attr("disabled") != undefined){
				
			}else{
				var thisInput = $(this).val();
				if($.trim(thisInput) == ""){
					var str = $(this).parent().siblings("th").children().text();
					str = str.substring(0,str.length-1);
					//修改，将不能为空去掉
					alert(str+" ");
					flag = false;
					return flag;
				}
			}
		})
	}
	
	return flag;
}

function getMatrixInfoByCode(){
	$("#informationService").val("");
	$("#tutorship").val("");
	$("#innovationSupport").val("");
	$("#personnelTraining").val("");
	$("#marketing").val("");
	$("#financingService").val("");
	$("#managementConsultancy").val("");
	$("#otherService").val("");
	
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
					$(".checkSF").attr("readonly","readonly");
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
					$(".checkSF").attr("readonly","readonly");
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
					$(".checkSF").attr("readonly","readonly");
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
					$(".checkSF").attr("readonly","readonly");
					$("#save").hide();
					$("#nextStep").hide();
					$("#cancel").show();
				}
				
				
				
				if(exemplaryMatrixApplication.informationService == null){
					$("input[name='radio1'][value='0']").iCheck('check');
					checkNo($("input[name='radio1'][value='0']"));
				}else{
					$("#informationService").val(exemplaryMatrixApplication.informationService);
				}
				
				if(exemplaryMatrixApplication.tutorship == null){
					$("input[name='radio2'][value='0']").iCheck('check');
					checkNo($("input[name='radio2'][value='0']"));
				}else{
					$("#tutorship").val(exemplaryMatrixApplication.tutorship);
				}
				
				if(exemplaryMatrixApplication.innovationSupport == null){
					$("input[name='radio3'][value='0']").iCheck('check');
					checkNo($("input[name='radio3'][value='0']"));
				}else{
					$("#innovationSupport").val(exemplaryMatrixApplication.innovationSupport);
				}
				
				if(exemplaryMatrixApplication.personnelTraining == null){
					$("input[name='radio4'][value='0']").iCheck('check');
					checkNo($("input[name='radio4'][value='0']"));
				}else{
					$("#personnelTraining").val(exemplaryMatrixApplication.personnelTraining);
				}
				
				if(exemplaryMatrixApplication.marketing == null){
					$("input[name='radio5'][value='0']").iCheck('check');
					checkNo($("input[name='radio5'][value='0']"));
				}else{
					$("#marketing").val(exemplaryMatrixApplication.marketing);
				}
				
				if(exemplaryMatrixApplication.financingService == null){
					$("input[name='radio6'][value='0']").iCheck('check');
					checkNo($("input[name='radio6'][value='0']"));
				}else{
					$("#financingService").val(exemplaryMatrixApplication.financingService);
				}
				
				if(exemplaryMatrixApplication.managementConsultancy == null){
					$("input[name='radio7'][value='0']").iCheck('check');
					checkNo($("input[name='radio7'][value='0']"));
				}else{
					$("#managementConsultancy").val(exemplaryMatrixApplication.managementConsultancy);
				}
				
				if(exemplaryMatrixApplication.otherService == null){
					$("input[name='radio8'][value='0']").iCheck('check');
					checkNo($("input[name='radio8'][value='0']"));
				}else{
					$("#otherService").val(exemplaryMatrixApplication.otherService);
				}
				
				applicationId = exemplaryMatrixApplication.id;
				$("input[name='applicationId']").val(exemplaryMatrixApplication.id);
				
				
				
				limWord("#informationService",500,"#informationServiceNo");
				limWord("#tutorship",500,"#tutorshipNo");
				limWord("#innovationSupport",500,"#innovationSupportNo");
				limWord("#personnelTraining",500,"#personnelTrainingNo");
				limWord("#marketing",500,"#marketingNo");
				limWord("#financingService",500,"#financingServiceNo");
				limWord("#managementConsultancy",500,"#managementConsultancyNo");
				limWord("#otherService",500,"#otherServiceNo");
				
			}
			
		}
	})
}

/**
 * 选择no时候的方法
 */
function checkNo(e){
	var id = e.parents('td').find('textarea').attr("id");
	var numberId = id+"No";
	e.parents('td').find('textarea').val("");
	limWord("#"+id,500,"#"+numberId);
	
	e.parents('td').find('textarea').attr('disabled',true)
}




/**
 * 新增服务功能信息
 */
function saveServiceFunction(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveServiceFunction.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#serviceFunctionForm").serialize(),
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败！");
			}else{
				saveOrUpdateApplication();
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
function saveInfo(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveServiceFunction.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#serviceFunctionForm").serialize(),
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败！");
			}else{
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
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (XMLHttpRequest.status == 901) {
				alert("您输入的参数含有非法字符！")
			}
		}
	})
}


/**
 * 进入页面获取合作服务机构列表
 */
function getServiceFunctionByParams(){
	var params = {"params.userCode":userCode,
					"params.exemplaryMatrixApplicationId":applicationId};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getServiceFunctionByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var serviceFunctions = data['serviceFunctions'];
				for(var i=0;i<serviceFunctions.length-1;i++){
					newServiceFunction();
				}
				
				for(var i=0;i<serviceFunctions.length;i++){
					$("input[name='serviceItems']:eq("+i+")").val(serviceFunctions[i].serviceItems);
					$("input[name='proportion']:eq("+i+")").val(serviceFunctions[i].proportion);
					$("textarea[name='serviceScale']:eq("+i+")").val(serviceFunctions[i].serviceScale);
					limWord("#serviceScale_"+i,300,"#serviceScaleShow_"+i);
				}
			}
		}
	})
}

/**
 * 保存/更新示范基地申请表
 */
function saveOrUpdateApplication(){
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
				window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoFive.jsp";
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (XMLHttpRequest.status == 901) {
				alert("您输入的参数含有非法字符！")
			}
		}
	})
}