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
	$("#gotoMonthlyStatement").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	//获取服务类别方法
	getServiceType();
	
	//上传图片按钮
	$(".uploadBtn").change(function () {
		upload($(this));
	})
	
	//保存按钮
	$("#save").click(function(){
		saveInfo();
	})
	
	//处理时间及标题
	disposeTime();
	
	//进入页面之后根据userCode，year，quarter获取服务情况信息
	getInfoByParams();
	
	//下一步按钮
	$("#nextStep").click(function(){
		nextStep();
	})
	
	//取消按钮
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/statementManage.jsp";
	})
	
	//计数
	$("body").on("keyup",".activityOverview",function(){
		var id=$(this).attr("id");
		var index = id.substring(id.lastIndexOf("_")+1,id.length);
		limWord("#"+id,1000,"#activityOverviewJishu_"+index);
	})
	
	//增加活动情况少于200字的验证
	$(".activityOverview").blur(function(){
		var activityOverview = $(this).val();
		if($.trim(activityOverview).length<200){
			$(this).prev("b").text("活动情况不得少于200字");
			$(this).prev("b").show();
			$(this).addClass("error");
		}
	})
})

//计算字数方法
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

/**
 * 处理时间及标题
 */
function disposeTime(){
	$("#title").text("");
	var text = ""
	if(paramQuarter == 1){
		text += paramYear+"年1~3月（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 2){
		text += paramYear+"年4~6月（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 3){
		text += paramYear+"年7~9月（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 4){
		text += paramYear+"年10~12月（请填写季度累计值，部分数据为代入值）";
	}
	$("#title").text(text);
	
	$("#serviceYear").val(paramYear);
	$("#serviceQuarter").val(paramQuarter);
}

/**
 * 进入页面之后根据userCode，year，quarter获取服务情况信息
 */
function getInfoByParams(){
	var params = {"params.userCode":userCode,
					"params.serviceYear":$("#serviceYear").val(),
					"params.serviceQuarter":$("#serviceQuarter").val()}
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findExemplaryMatrixServiceDataByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == 0){
				
			}else if(status == 1){
				var exemplaryMatrixServiceDatas = data['exemplaryMatrixServiceDatas'];
				
				for(var i=0;i<exemplaryMatrixServiceDatas.length-1;i++){
					addNewClone();
				}
				
				for(var i=0;i<exemplaryMatrixServiceDatas.length;i++){
					var activityInformPic = exemplaryMatrixServiceDatas[i].activityInformPic;
					var activityInformPicInput = activityInformPic.substring(activityInformPic.lastIndexOf("/")+1,activityInformPic.length);
					$("input[name='activityInformPic']:eq("+i+")").val(activityInformPicInput);
					$("input[name='activityInformPic']:eq("+i+")").parent().next("div").children("img").attr("src",activityInformPic);
		        	$("input[name='activityInformPic']:eq("+i+")").parent().next("div").show();
		        	
		        	var activityCompletePic = exemplaryMatrixServiceDatas[i].activityCompletePic;
					var activityCompletePicInput = activityCompletePic.substring(activityCompletePic.lastIndexOf("/")+1,activityCompletePic.length);
					$("input[name='activityCompletePic']:eq("+i+")").val(activityCompletePicInput);
					$("input[name='activityCompletePic']:eq("+i+")").parent().next("div").children("img").attr("src",activityCompletePic);
		        	$("input[name='activityCompletePic']:eq("+i+")").parent().next("div").show();
		        	
		        	var activityPartPic = exemplaryMatrixServiceDatas[i].activityPartPic;
					var activityPartPicInput = activityPartPic.substring(activityPartPic.lastIndexOf("/")+1,activityPartPic.length);
					$("input[name='activityPartPic']:eq("+i+")").val(activityPartPicInput);
					$("input[name='activityPartPic']:eq("+i+")").parent().next("div").children("img").attr("src",activityPartPic);
		        	$("input[name='activityPartPic']:eq("+i+")").parent().next("div").show();
		        	
		        	var activityContentPic = exemplaryMatrixServiceDatas[i].activityContentPic;
					var activityContentPicInput = activityContentPic.substring(activityContentPic.lastIndexOf("/")+1,activityContentPic.length);
					$("input[name='activityContentPic']:eq("+i+")").val(activityContentPicInput);
					$("input[name='activityContentPic']:eq("+i+")").parent().next("div").children("img").attr("src",activityContentPic);
		        	$("input[name='activityContentPic']:eq("+i+")").parent().next("div").show();
		        	
		        	var evaluatePic = exemplaryMatrixServiceDatas[i].evaluatePic;
					var evaluatePicInput = evaluatePic.substring(evaluatePic.lastIndexOf("/")+1,evaluatePic.length);
					$("input[name='evaluatePic']:eq("+i+")").val(evaluatePicInput);
					$("input[name='evaluatePic']:eq("+i+")").parent().next("div").children("img").attr("src",evaluatePic);
		        	$("input[name='evaluatePic']:eq("+i+")").parent().next("div").show();
		        	
		        	var billPic = exemplaryMatrixServiceDatas[i].billPic;
					var billPicInput = billPic.substring(billPic.lastIndexOf("/")+1,billPic.length);
					$("input[name='billPic']:eq("+i+")").val(billPicInput);
					$("input[name='billPic']:eq("+i+")").parent().next("div").children("img").attr("src",billPic);
		        	$("input[name='billPic']:eq("+i+")").parent().next("div").show();
		        	
		        	var enterpriseDetail = exemplaryMatrixServiceDatas[i].enterpriseDetail;
					var enterpriseDetailInput = enterpriseDetail.substring(enterpriseDetail.lastIndexOf("/")+1,enterpriseDetail.length);
					$("input[name='enterpriseDetail']:eq("+i+")").val(enterpriseDetailInput);
					$("input[name='enterpriseDetail']:eq("+i+")").parent().next("div").children("img").attr("src",enterpriseDetail);
		        	$("input[name='enterpriseDetail']:eq("+i+")").parent().next("div").show();
					
					
					
					
					$("input[name='activityName']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].activityName);
					$("input[name='activityTime']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].activityTime);
					$("input[name='activityAddress']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].activityAddress);
					$("input[name='personQuantity']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].personQuantity);
					$("input[name='enterpriseQuantity']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].enterpriseQuantity);
					$("textarea[name='cooperationOrganization']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].cooperationOrganization);
					
					$("textarea[name='activityOverview']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].activityOverview);
					//执行计数方法
					limWord("#activityOverview_"+i,1000,"#activityOverviewJishu_"+i);
					
					
					$("input[name='totalExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].totalExpend);
					$("input[name='personalExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].personalExpend);
					$("input[name='siteExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].siteExpend);
					$("input[name='dataExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].dataExpend);
					$("input[name='cooperationOrganizationExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].cooperationOrganizationExpend);
					$("input[name='otherExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].otherExpend);
					
					
					$("select[name='activityClass']:eq("+i+") option[value='"+exemplaryMatrixServiceDatas[i].activityClass+"']").attr("selected",true);
					$("select[name='activityClass']:eq("+i+")").selectOrDie('destroy');
					$("select[name='activityClass']:eq("+i+")").selectOrDie();
				}
			}
		}
	})
	
}

/**
 * 获取服务类别方法
 */
function getServiceType(){
	//清空十大服务下拉框
	$(".serviceType").empty();
	//拼接请求参数
	var param = {'params.group':'pioneer_service_type','params.parent':'0'};
	$.ajax({
		type: "post",
		url: rootPath+"/sysCode/getSysCodeByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: param,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['result'];
			var sysCodes = data['sysCodes'];
			if(1==status){
				var html = ""
				for(var i=0;i<sysCodes.length;i++){
					html += "<option value='"+sysCodes[i].code+"'>"+sysCodes[i].name+"</option>";
				}
				$(".serviceType").append(html);
				$(".serviceType").selectOrDie('destroy');
				$(".serviceType").selectOrDie();
			}
		}
	})
}

/**
 * 保存方法
 */
function saveInfo(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/saveExemplaryMatrixServiceData.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#exemplaryMatrixServiceDataForm").serialize(),
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

/**
 * 下一步
 */
function nextStep(){
	if(check()){
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixBackstage/saveExemplaryMatrixServiceData.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: $("#exemplaryMatrixServiceDataForm").serialize(),
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("保存失败！");
				}else{
					alert("保存成功！");
					window.location.href = rootPath + "/page/jsp/exemplaryMatrixNew/quarterStatementTwo.jsp?paramYear="+paramYear+"&paramQuarter="+paramQuarter
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
 * 验证方法
 */
function check(){
	var flag = true ;
	var checkParamLength = $(".checkInfo").length;
	$(".checkInfo").each(function(index){
		if(index == (checkParamLength-1) || 
			index == (checkParamLength-2) || 
			index == (checkParamLength-3) || 
			index == (checkParamLength-4) || 
			index == (checkParamLength-5) ||
			index == (checkParamLength-6) ||
			index == (checkParamLength-7) ||
			index == (checkParamLength-8) ||
			index == (checkParamLength-9) ||
			index == (checkParamLength-10) ||
			index == (checkParamLength-11) ||
			index == (checkParamLength-12) ||
			index == (checkParamLength-13)){
			
		}else{
			var thisInput = $(this).val();
			if($.trim(thisInput) == ""){
				var str = $(this).prev("span").text();
				str = str.substring(0,str.lastIndexOf(":"));
				alert(str+" 不能为空！");
				flag = false;
				return flag;
			}
		}
	})
	
	//验证图片上传类型一
	if(flag){
		var checkImageOneLength = $(".checkImageOne").length;
		$(".checkImageOne").each(function(index){
			if(index == (checkImageOneLength-1) || 
				index == (checkImageOneLength-2) || 
				index == (checkImageOneLength-3) || 
				index == (checkImageOneLength-4) || 
				index == (checkImageOneLength-5)){
				
			}else{
				var thisInput = $(this).val();
				if($.trim(thisInput) == ""){
					var str = $(this).parent().prev("span").text();
					str = str.substring(0,str.lastIndexOf(":"));
					alert("请上传："+str);
					flag = false;
					return flag;
				}
			}
		})
	}
	
	//验证图片上传类型二
	if(flag){
		var checkImageTwoLength = $(".checkImageTwo").length;
		$(".checkImageTwo").each(function(index){
			if(index == (checkImageTwoLength-1) || 
				index == (checkImageTwoLength-2)){
				
			}else{
				var thisInput = $(this).val();
				if($.trim(thisInput) == ""){
					var str = $(this).parent().parent().prev("span").text();
					str = str.substring(0,str.lastIndexOf(":"));
					alert("请上传："+str);
					flag = false;
					return flag;
				}
			}
		})
	}
	
	//验证服务人数不是整数
	if(flag){
		var checkPersonQuantityLength = $("input[name='personQuantity']").length;
		$("input[name='personQuantity']").each(function(index){
			if(index == (checkPersonQuantityLength-1)){
				
			}else{
				var reg=/^[1-9]\d*$/; //由 1-9开头 的正则表达式
				
				var thisInput = $(this).val();
				
				if($.trim(thisInput) != "" && !reg.test(thisInput)){
					alert("服务人数必须为正整数！")
					flag = false;
					return flag;
				}
			}
		})
	}
	
	//验证服务企业数必须为整数
	if(flag){
		var checkEnterpriseQuantityLength = $("input[name='enterpriseQuantity']").length;
		$("input[name='enterpriseQuantity']").each(function(index){
			if(index == (checkEnterpriseQuantityLength-1)){
				
			}else{
				var reg=/^[1-9]\d*$/; //由 1-9开头 的正则表达式
				
				var thisInput = $(this).val();
				
				if($.trim(thisInput) != "" && !reg.test(thisInput)){
					alert("服务企业必须为正整数！")
					flag = false;
					return flag;
				}
			}
		})
	}
	
	//验证各种费用只能是数字
	if(flag){
		var checkNumLength = $(".checkNum").length;
		$(".checkNum").each(function(index){
			if(index == (checkNumLength-1)||
				index == (checkNumLength-2)||
				index == (checkNumLength-3)||
				index == (checkNumLength-4)||
				index == (checkNumLength-5)||
				index == (checkNumLength-6)){
				
			}else{
				var thisInput = $(this).val();
				if($.trim(thisInput) != "" && isNaN(thisInput)){
					var str = $(this).prev("span").text();
					str = str.substring(0,str.lastIndexOf(":"));
					alert(str+" 只能填写数字。");
					flag = false;
					return flag;
				}
			}
		})
	}
	
	//验证活动情况简述不少于200字
	if(flag){
		var activityOverviewLength = $(".activityOverview").length;
		$(".activityOverview").each(function(index){
			if(index == (activityOverviewLength-1)){
				
			}else{
				var thisInput = $(this).val();
				if($.trim(thisInput).length<200){
					$(this).prev("b").text("活动情况不得少于200字");
					$(this).prev("b").show();
					$(this).addClass("error");
					
					alert("第" +(index+1)+"条服务情况中的活动情况不得少于200字")
					flag = false;
					return flag;
				}
			}
		})
	}
	return flag;
}


/**
 * 上传图片
 * @param e
 */
function upload(e){
	//获取当前input框id属性值
	var id = e.attr("id");
	var index = id.substring(id.lastIndexOf("_")+1,id.length);
	
	var $val = e.val();
	//上传文件格式jpg,png
	var $form =$val.slice(-3,$val.length);
	if ($val!=""&&($form=="jpg"||$form=="png")) {
		$.ajaxFileUpload({
	        url : rootPath+"/exemplaryMatrixBackstage/uploadFile.action?userCode="+userCode+"&fileType="+id ,//用于文件上传的服务器端请求地址
	        secureuri : false,//一般设置为false
	        fileElementId : id,//文件上传空间的id属性  <input type="file" id="file" name="file" />
	        //dataType: 'json',//返回值类型 一般设置为json
	        success: function (data, status){
	        	var allFileName = $(data).text();
	        	if("图片大小不得超过3M" == allFileName){
	        		alert(allFileName);
	        	}else{
	        		alert("上传成功！");
	        		$("#"+id).parent().next("div").children("img").attr("src",allFileName);
		        	$("#"+id).parent().next("div").show();
		        	
		        	var fileName = allFileName.substring(allFileName.lastIndexOf("/")+1,allFileName.length);
		        	var inputId = id.substring(0,id.lastIndexOf("_"))+"Input"+index;
		        	$("#"+inputId).val(fileName);
	        	}
	        },
	        error: function (data, status, e)//服务器响应失败处理函数
	        {
	            alert(e);
	        },
	        complete: function(xmlHttpRequest) {
	        	var count = Math.random();
	        	e.replaceWith('input type="file" class="inputBtn" accept="image/jpeg,image/gif,image/png" id="'+id+'" name="file" style="title:'+count+'"');
	        	$(".uploadBtn").unbind();
	        	$(".uploadBtn").on("change", function(){  
	        		upload($(this));
                });
            }
	    });
	}else{
		alert("只能上传图片文件！");
	}
}

