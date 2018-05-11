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
	
	//上传压缩文件按钮
	$(".uploadRarBtn").change(function(){
		uploadRar($(this));
	})
	
	//保存按钮
	$("#save").click(function(){
		saveInfo();
	})
	
	
	if(serviceId != ""){
		getInfoByParams();
		$("#serviceId").val(serviceId);
		$("#serviceType").val(serviceType);
	}
	
	
	//取消按钮
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/onlineDataList.jsp?year="+paramYear+"&quarter="+paramQuarter;
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
	
	$("#serviceYear").val(paramYear);
	$("#serviceQuarter").val(paramQuarter);
	
	$(".radioInput").click(function(){
		var value = $(this).children("input").val();
		if(value == "0"){
			$("input[name='exemplaryMatrixServiceData.cost']").attr("disabled","disabled");
		}else{
			$("input[name='exemplaryMatrixServiceData.cost']").removeAttr("disabled");
		}
	})
	
	
	$(".checkNum").keyup(function () {
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
	
	$("input[name='exemplaryMatrixServiceData.totalExpend']").keyup(function(){
		var value = $(this).val();
		if(value=='0' || value=='0.0' ||value== '0.00'){
			$("#billPic_0").attr("disabled","disabled");
			$("#billPicInput0").val("");
			$("#billPicRight0").hide();
		}else{
			$("#billPic_0").removeAttr("disabled");
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
 * 进入页面之后根据userCode，year，quarter获取服务情况信息
 */
function getInfoByParams(){
	var params = {"params.serviceId":serviceId}
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
				
				for(var i=0;i<exemplaryMatrixServiceDatas.length;i++){
					$("#id").val(exemplaryMatrixServiceDatas[i].id);
					
					var activityInformPic = exemplaryMatrixServiceDatas[i].activityInformPic;
					var activityInformPicInput = activityInformPic.substring(activityInformPic.lastIndexOf("/")+1,activityInformPic.length);
					$("input[name='exemplaryMatrixServiceData.activityInformPic']:eq("+i+")").val(activityInformPicInput);
					$("input[name='exemplaryMatrixServiceData.activityInformPic']:eq("+i+")").parent().next("div").children("img").attr("src",activityInformPic);
		        	$("input[name='exemplaryMatrixServiceData.activityInformPic']:eq("+i+")").parent().next("div").show();
		        	
		        	var activityCompletePic = exemplaryMatrixServiceDatas[i].activityCompletePic;
					var activityCompletePicInput = activityCompletePic.substring(activityCompletePic.lastIndexOf("/")+1,activityCompletePic.length);
					$("input[name='exemplaryMatrixServiceData.activityCompletePic']:eq("+i+")").val(activityCompletePicInput);
					$("input[name='exemplaryMatrixServiceData.activityCompletePic']:eq("+i+")").parent().next("div").children("img").attr("src",activityCompletePic);
		        	$("input[name='exemplaryMatrixServiceData.activityCompletePic']:eq("+i+")").parent().next("div").show();
		        	
		        	var activityPartPic = exemplaryMatrixServiceDatas[i].activityPartPic;
					var activityPartPicInput = activityPartPic.substring(activityPartPic.lastIndexOf("/")+1,activityPartPic.length);
					$("input[name='exemplaryMatrixServiceData.activityPartPic']:eq("+i+")").val(activityPartPicInput);
					$("input[name='exemplaryMatrixServiceData.activityPartPic']:eq("+i+")").parent().next("div").children("img").attr("src",activityPartPic);
		        	$("input[name='exemplaryMatrixServiceData.activityPartPic']:eq("+i+")").parent().next("div").show();
		        	
		        	var activityContentPic = exemplaryMatrixServiceDatas[i].activityContentPic;
					var activityContentPicInput = activityContentPic.substring(activityContentPic.lastIndexOf("/")+1,activityContentPic.length);
					$("input[name='exemplaryMatrixServiceData.activityContentPic']:eq("+i+")").val(activityContentPicInput);
					$("input[name='exemplaryMatrixServiceData.activityContentPic']:eq("+i+")").parent().next("div").children("img").attr("src",activityContentPic);
		        	$("input[name='exemplaryMatrixServiceData.activityContentPic']:eq("+i+")").parent().next("div").show();
		        	
		        	var evaluatePic = exemplaryMatrixServiceDatas[i].evaluatePic;
					var evaluatePicInput = evaluatePic.substring(evaluatePic.lastIndexOf("/")+1,evaluatePic.length);
					$("input[name='exemplaryMatrixServiceData.evaluatePic']:eq("+i+")").val(evaluatePicInput);
					$("#evaluatePicRight0").show();
					$("#evaluatePicRight0").attr("title",evaluatePicInput)
					/*$("input[name='exemplaryMatrixServiceData.evaluatePic']:eq("+i+")").parent().next("div").children("img").attr("src",evaluatePic);
		        	$("input[name='exemplaryMatrixServiceData.evaluatePic']:eq("+i+")").parent().next("div").show();*/
		        	
		        	var billPic = exemplaryMatrixServiceDatas[i].billPic;
					var billPicInput = billPic.substring(billPic.lastIndexOf("/")+1,billPic.length);
					if(billPicInput!=""){
						$("input[name='exemplaryMatrixServiceData.billPic']:eq("+i+")").val(billPicInput);
						$("#billPicRight0").show();
						$("#billPicRight0").attr("title",billPicInput)
					}
					
					/*$("input[name='exemplaryMatrixServiceData.billPic']:eq("+i+")").parent().next("div").children("img").attr("src",billPic);
		        	$("input[name='exemplaryMatrixServiceData.billPic']:eq("+i+")").parent().next("div").show();*/
		        	
		        	var enterpriseDetail = exemplaryMatrixServiceDatas[i].enterpriseDetail;
					var enterpriseDetailInput = enterpriseDetail.substring(enterpriseDetail.lastIndexOf("/")+1,enterpriseDetail.length);
					$("input[name='exemplaryMatrixServiceData.enterpriseDetail']:eq("+i+")").val(enterpriseDetailInput);
					$("input[name='exemplaryMatrixServiceData.enterpriseDetail']:eq("+i+")").parent().next("div").children("img").attr("src",enterpriseDetail);
		        	$("input[name='exemplaryMatrixServiceData.enterpriseDetail']:eq("+i+")").parent().next("div").show();
					
					
					
					
					$("input[name='exemplaryMatrixServiceData.activityName']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].activityName);
					$("input[name='exemplaryMatrixServiceData.activityTime']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].activityTime);
					$("input[name='exemplaryMatrixServiceData.activityAddress']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].activityAddress);
					$("input[name='exemplaryMatrixServiceData.personQuantity']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].personQuantity);
					$("input[name='exemplaryMatrixServiceData.enterpriseQuantity']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].enterpriseQuantity);
					$("textarea[name='exemplaryMatrixServiceData.cooperationOrganization']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].cooperationOrganization);
					
					$("textarea[name='exemplaryMatrixServiceData.activityOverview']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].activityOverview);
					//执行计数方法
					limWord("#activityOverview_"+i,1000,"#activityOverviewJishu_"+i);
					
					
					$("input[name='exemplaryMatrixServiceData.totalExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].totalExpend);
					if(exemplaryMatrixServiceDatas[i].totalExpend=='0' || exemplaryMatrixServiceDatas[i].totalExpend=='0.0' ||exemplaryMatrixServiceDatas[i].totalExpend== '0.00'){
						$("#billPic_0").attr("disabled","disabled");
						$("#billPicInput0").val("");
						$("#billPicRight0").hide();
					}
					$("input[name='exemplaryMatrixServiceData.personalExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].personalExpend);
					$("input[name='exemplaryMatrixServiceData.siteExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].siteExpend);
					$("input[name='exemplaryMatrixServiceData.dataExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].dataExpend);
					$("input[name='exemplaryMatrixServiceData.cooperationOrganizationExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].cooperationOrganizationExpend);
					$("input[name='exemplaryMatrixServiceData.otherExpend']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].otherExpend);
					
					
					$("select[name='exemplaryMatrixServiceData.activityClass']:eq("+i+") option[value='"+exemplaryMatrixServiceDatas[i].activityClass+"']").attr("selected",true);
					$("select[name='exemplaryMatrixServiceData.activityClass']:eq("+i+")").selectOrDie('destroy');
					$("select[name='exemplaryMatrixServiceData.activityClass']:eq("+i+")").selectOrDie();
					
					if(exemplaryMatrixServiceDatas[i].cost == null){
						$("input[name='cost'][value='0']").attr("checked","checked");
						$("input[name='exemplaryMatrixServiceData.cost']").attr("disabled","disabled");
					}else{
						$("input[name='cost'][value='1']").attr("checked","checked");
						$("input[name='exemplaryMatrixServiceData.cost']:eq("+i+")").val(exemplaryMatrixServiceDatas[i].cost);
					}
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
					window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/onlineDataList.jsp?year="+paramYear+"&quarter="+paramQuarter;
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
			var thisInput = $(this).val();
			if($.trim(thisInput) == ""){
				var str = $(this).prevAll("span").text();
				str = str.substring(0,str.lastIndexOf(":"));
				alert(str+" 不能为空！");
				flag = false;
				return flag;
			}
	})
	
	//验证图片上传类型一
	if(flag){
		var checkImageOneLength = $(".checkImageOne").length;
		$(".checkImageOne").each(function(index){
			var thisInput = $(this).val();
			if($.trim(thisInput) == ""){
				var str = $(this).parent().prev("span").text();
				str = str.substring(0,str.lastIndexOf(":"));
				alert("请上传："+str);
				flag = false;
				return flag;
			}
		})
	}
	
	//验证图片上传类型二
	if(flag){
		var checkImageTwoLength = $(".checkImageTwo").length;
		$(".checkImageTwo").each(function(index){
			var thisInput = $(this).val();
			if($.trim(thisInput) == ""){
				var str = $(this).parent().parent().prev("span").text();
				str = str.substring(0,str.lastIndexOf(":"));
				alert("请上传："+str);
				flag = false;
				return flag;
			}
		})
	}
	
	if(flag){
		var thisInput = $("#billPicInput0").val();
		var attrValue = $("#billPic_0").attr("disabled");
		if($.trim(thisInput) == "" && attrValue != 'disabled'){
			var str = $("#billPicInput0").parent().prev("span").text();
			str = str.substring(0,str.lastIndexOf(":"));
			alert("请上传："+str);
			flag = false;
			return flag;
		}
	}
	
	//验证服务人数不是整数
	if(flag){
		var checkPersonQuantityLength = $("input[name='personQuantity']").length;
		$("input[name='exemplaryMatrixServiceData.personQuantity']").each(function(index){
			var reg=/^[1-9]\d*$/; //由 1-9开头 的正则表达式
			
			var thisInput = $(this).val();
			
			if($.trim(thisInput) != "" && (isNaN(thisInput) || !reg.test(thisInput))){
				alert("服务人数必须为正整数")
				flag = false;
				return flag;
			}
		})
	}
	
	//验证服务企业数必须为整数
	if(flag){
		var checkEnterpriseQuantityLength = $("input[name='enterpriseQuantity']").length;
		$("input[name='exemplaryMatrixServiceData.enterpriseQuantity']").each(function(index){
			var reg=/^[1-9]\d*$/; //由 1-9开头 的正则表达式
			
			var thisInput = $(this).val();
			
			if($.trim(thisInput) != "" && (isNaN(thisInput) || !reg.test(thisInput))){
				alert("服务企业数必须为正整数")
				flag = false;
				return flag;
			}
		})
	}
	
	//验证各种费用只能是数字
	if(flag){
		var checkNumLength = $(".checkNum").length;
		$(".checkNum").each(function(index){
			var thisInput = $(this).val();
			if($.trim(thisInput) != "" && isNaN(thisInput)){
				var str = $(this).prev("span").text();
				str = str.substring(0,str.lastIndexOf(":"));
				alert(str+" 只能填写数字。");
				flag = false;
				return flag;
			}
		})
	}
	
	//验证活动情况简述不少于200字
	if(flag){
		var activityOverviewLength = $(".activityOverview").length;
		$(".activityOverview").each(function(index){
			var thisInput = $(this).val();
			if($.trim(thisInput).length<200){
				$(this).prev("b").text("活动情况不得少于200字");
				$(this).prev("b").show();
				$(this).addClass("error");
				
				alert("活动情况不得少于200字")
				flag = false;
				return flag;
			}
		})
	}
	
	//验证是否收费不能为空
	if(flag){
		var costFlag = $("input[name='cost']:checked").val();
		if(costFlag == '0'){
			
		}else{
			var cost = $("input[name='exemplaryMatrixServiceData.cost']").val();
			if($.trim(cost)==""){
				alert("请填写收费金额！");
				flag = false;
				return flag;
			}else if(isNaN(cost)){
				alert("收费金额只能是数字！");
				flag = false;
				return flag;
			}
		}
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
	if ($val!=""&&($form=="jpg"||$form=="png"||$form=="JPG"||$form=="PNG")) {
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

//上传文件
function uploadRar(e){
	var id = e.attr("id");
	var className = e.attr("class");
	var index = id.substring(id.lastIndexOf("_")+1,id.length);
	var fileType = id.substring(0,id.lastIndexOf("_"));
	var $val = e.val();
	
	var shangchuanwenjianming = $val.substring($val.lastIndexOf("\\")+1,$val.length);
	//上传文件格式jpg,png
	var $form =$val.slice(-3,$val.length);
	if ($val!=""&&($form=="zip" || $form=="rar")) {
		$.ajaxFileUpload({
	        url : rootPath+"/exemplaryMatrixApplication/uploadFile.action?userCode="+userCode+"&fileType="+fileType ,//用于文件上传的服务器端请求地址
	        secureuri : false,//一般设置为false
	        fileElementId : id,//文件上传空间的id属性  <input type="file" id="file" name="file" />
	        //dataType: 'json',//返回值类型 一般设置为json
	        success: function (data, status){
	        	alert("上传成功！");
	        	var fileName = $(data).text();
	        	
	        	var inputId = id.substring(0,id.lastIndexOf("_"))+"Input"+index;
	        	$("#"+inputId).val(fileName);
	        	
	        	var imgId = id.substring(0,id.lastIndexOf("_"))+"Right"+index
	        	$("#"+imgId).show();
	        	$("#"+imgId).attr("title",shangchuanwenjianming);
	        },
	        error: function (data, status, e)//服务器响应失败处理函数
	        {
	            alert(e);
	        },
	        complete: function(xmlHttpRequest) {
	        	var count = Math.random();
	        	e.replaceWith('input type="file" class="'+className+'" accept=".zip,.rar" name="file" style="title:'+count+'" id="'+id+'"');  
	        	$("#"+id).on("change", function(){  
	        		uploadRar($(this));
                });
            }
	    });
	}else{
		alert("只能上传压缩文件！");
	}
}