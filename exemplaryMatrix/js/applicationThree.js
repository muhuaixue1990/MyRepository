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
	$("#goThree").addClass("on");
	$("#stepDiv").removeClass("a1").removeClass("a2").removeClass("a3").removeClass("a4").removeClass("a5").removeClass("a6").removeClass("a7");
	$("#stepDiv").addClass("a3");
	
	getMatrixInfoByCode();
	getCooperationFacilitatingAgencyByParams();
	
	$("#lastStep").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationTwo.jsp";
	})
	
	$("#nextStep").click(function(){
		saveCooperationFacilitatingAgency();
	})
	
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/home.jsp";
	})
	
	//新增保存方法
	$("#save").click(function(){
		saveInfo();
	})
	
	//计算字数
	limWord("#serviceItems0",1000,"#serviceItemsNo0");
	
	$("#serviceItems0").keyup(function(){
		limWord("#serviceItems0",1000,"#serviceItemsNo0");
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
					$(".matrixApplicationInfo").attr("readonly","readonly");
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
					$(".matrixApplicationInfo").attr("readonly","readonly");
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
					$(".matrixApplicationInfo").attr("readonly","readonly");
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
					$(".matrixApplicationInfo").attr("readonly","readonly");
					$("#save").hide();
					$("#nextStep").hide();
				}
				
				applicationId = exemplaryMatrixApplication.id;
				$("input[name='applicationId']").val(exemplaryMatrixApplication.id);
			}
			
		}
	})
}

/**
 * 新增合作服务机构信息
 */
function saveCooperationFacilitatingAgency(){
	if(check()){
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/saveCooperationFacilitatingAgency.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: $("#cooperationFacilitatingAgencyForm").serialize(),
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("保存失败！");
				}else{
					window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationFour.jsp";
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
		url: rootPath+"/exemplaryMatrixApplication/saveCooperationFacilitatingAgency.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#cooperationFacilitatingAgencyForm").serialize(),
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
	var flag = true
	var checkLength = $(".matrixApplicationInfo").length;
	$(".matrixApplicationInfo").each(function(index){
		if(index == (checkLength-1) || 
			index == (checkLength-2) || 
			index == (checkLength-3)){
			
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
	return flag;
}


/**
 * 进入页面获取合作服务机构列表
 */
function getCooperationFacilitatingAgencyByParams(){
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
				var cooperationFacilitatingAgencies = data['cooperationFacilitatingAgencies'];
				for(var i=0;i<cooperationFacilitatingAgencies.length-1;i++){
					newCooperationFacilitatingAgencie();
				}
				
				for(var i=0;i<cooperationFacilitatingAgencies.length;i++){
					$("input[name='cooperativeFacilitatingAgencyName']:eq("+i+")").val(cooperationFacilitatingAgencies[i].cooperativeFacilitatingAgencyName);
					$("input[name='signingTime']:eq("+i+")").val(cooperationFacilitatingAgencies[i].signingTime);
					$("textarea[name='serviceItems']:eq("+i+")").val(cooperationFacilitatingAgencies[i].serviceItems);
					
					limWord("#serviceItems"+i,1000,"#serviceItemsNo"+i);
				}
			}else if(status == '0'){
				newCooperationFacilitatingAgencie();
				newCooperationFacilitatingAgencie();
			}
		}
	})
}