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
	
	//处理时间及标题
	disposeTime();
	
	//获取区列表
	getDistrict();
	//获取基地申请表信息
	matrixApplicationByCode();
	
	//获取服务类型方法
	getServiceType();
	
	//进入页面后根据参数获取信息
	getInfo();
	
	//保存按钮
	$("#save").click(function(){
		saveData();
	})
	
	//上一步
	$("#lastStep").click(function(){
		window.location.href = rootPath + "/page/jsp/exemplaryMatrixNew/quarterStatementOne.jsp?paramYear="+paramYear+"&paramQuarter="+paramQuarter;
	})
	
	//下一步
	$("#nextStep").click(function(){
		nextStep();
	})
	
	$("textarea[name=serviceContent]").keyup(function(){
		var id = $(this).attr("id");
		var showId = id+"Show"
		limWord("#"+id,200,"#"+showId);
	})
	$("textarea[name=serviceEffect]").keyup(function(){
		var id = $(this).attr("id");
		var showId = id+"Show"
		limWord("#"+id,200,"#"+showId);
	})
	
	//全市
	$(".allCity").on("ifClicked",function(event){
		var index = $(this).attr("name");
		index = index.substring(7,index.length);
		if(event.target.checked){
			$('input[type="checkbox"][name="serviceScope'+index+'"]').iCheck('uncheck');
		}else{
			$('input[type="checkbox"][name="serviceScope'+index+'"]').iCheck('check');
		}
	});
	
	$(".district").on("ifClicked",function(event){
		var index = $(this).attr("name");
		index = index.substring(12,index.length);
		if(event.target.checked){
			$('input[type="checkbox"][name="allCity'+index+'"]').iCheck('uncheck');
		}else{
			var i = $('input[type="checkbox"][name="serviceScope'+index+'"]:checked').length;
			if(i == 15){
				$('input[type="checkbox"][name="allCity'+index+'"]').iCheck('check');
			}
		}
	})
	
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/statementManage_new.jsp";
	})
	
})

/**
 * 处理时间及标题
 */
function disposeTime(){
	$("#title").text("");
	var text = ""
	if(paramQuarter == 1){
		text += paramYear+"年I(1~3月)（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 2){
		text += paramYear+"年II(1~6月)（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 3){
		text += paramYear+"年III(1~9月)（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 4){
		text += paramYear+"年IV(1~12月)（请填写季度累计值，部分数据为代入值）";
	}
	$("#title").text(text);
}

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

/**
 * 获取区列表
 */
function getDistrict(){
	//拼接请求参数
	var param = {'params.group':'district','params.parent':'120000'};
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
			districts = data['sysCodes'];
		}
	})
}

/**
 * 获取服务类型方法
 */
function getServiceType(){
	$("#serviceForm").empty();
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
				html += '<input type="text" style="display:none" name="userCode" />';
				html += '<input type="text" style="display:none" name="serviceYear" />';
				html += '<input type="text" style="display:none" name="serviceQuarter" />';
				
				var index = 0;
				for(var i=0;i<sysCodes.length;i++){
					if(!informationService && sysCodes[i].code=="103000001"){
						continue;
					}else if(!tutorship && sysCodes[i].code=="103000002"){
						continue;
					}else if(!innovationSupport && sysCodes[i].code=="103000003"){
						continue;
					}else if(!personnelTraining && sysCodes[i].code=="103000004"){
						continue;
					}else if(!marketing && sysCodes[i].code=="103000005"){
						continue;
					}else if(!financingService && sysCodes[i].code=="103000006"){
						continue;
					}else if(!managementConsultancy && sysCodes[i].code=="103000007"){
						continue;
					}else if(!otherService && sysCodes[i].code=="103000008"){
						continue;
					}
					
					index ++;
					if(index == 1){
						html += '<div class="conBg">'
					}else{
						html += '<div class="conBg mt-20">'
					}
					
					html += '<input type="text" style="display:none" value="'+sysCodes[i].code+'" name="serviceType">'
					
					html += '<div class="adminTit-s p-0-all">'+sysCodes[i].name+'</div>'
					html += '<div class="jdbb_box">'
					html += '<ul>'
					html += '<li class="mt-20">'
					html += '<span class="mr5"><i class="require mr5 v-a-t mt4"></i>服务内容简述：<br/>(还可以输入<b class="limitedW" id="serviceContent'+sysCodes[i].code+'Show">200</b>字)  </span>'
					html += '<textarea class="textarea_new_01 checkInfo" name="serviceContent" id="serviceContent'+sysCodes[i].code+'"></textarea>'
					html += '</li>'
					html += '<li class="mt-20">'
					html += '<span class="mr5"><i class="require mr5 v-a-t mt4"></i>服务效果：<br/>(还可以输入<b class="limitedW" id="serviceEffect'+sysCodes[i].code+'Show">200</b>字)</span>'
					html += '<textarea class="textarea_new_01 checkInfo" name="serviceEffect" id="serviceEffect'+sysCodes[i].code+'"></textarea>'
					html += '</li>'
					html += '<li class="check_area_box mt-20">'
					html += '<span><i class="require mr5 v-a-t mt4"></i>服务范围：</span>'
					html += '<p class="checkP">'
					html += '<label><input type="checkbox" name="allCity'+sysCodes[i].code+'" value="" class="allCity"/><span>全市</span></label>' 
					for(var j=0;j<districts.length;j++){
						html += '<label><input type="checkbox" name="serviceScope'+sysCodes[i].code+'" value="'+districts[j].name+'" class="district"/><span>'+districts[j].name+'</span></label> '
					}
					html += '</p>'
					html += '</li>'
					if(sysCodes[i].code == '103000006'){
						html += '<li class="mt-20">'
						html += '<span style="vertical-align: middle">实现投融资金额：</span>'
						html += '<input type="text" name="financingAmount" class="mr5">万元'
						html += '</li>'
					}
					html += '</ul>'
					html += '<div class="clear"></div>'
					html += '</div>'
					html += '</div>'
				}
			}
			$("#serviceForm").append(html);
		}
	})
}

/**
 * 保存方法
 */
function saveData(){
	if(check()){
		$("input[name='userCode']").val(userCode);
		$("input[name='serviceYear']").val(paramYear);
		$("input[name='serviceQuarter']").val(paramQuarter);
		
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixBackstage/saveExemplaryMatrixServiceSituation.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: $("#serviceForm").serialize(),
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("保存失败！");
				}else{
					alert("保存成功！");
					window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/statementManage_new.jsp";
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
 * 获取信息方法
 */
function getInfo(){
	var params = {"params.userCode":userCode,
					"params.serviceYear":paramYear, 
					"params.serviceQuarter":paramQuarter}
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findExemplaryMatrixServiceSituationByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var exemplaryMatrixServiceSituations = data['exemplaryMatrixServiceSituations'];
				for(var i=0;i<exemplaryMatrixServiceSituations.length;i++){
					var serviceType = exemplaryMatrixServiceSituations[i].serviceType;
					var index = serviceType.substring(8,serviceType.length);
					$("#serviceContent"+serviceType).val(exemplaryMatrixServiceSituations[i].serviceContent);
					limWord("#serviceContent"+serviceType,200,"#serviceContent"+serviceType+"Show");
					
					$("#serviceEffect"+serviceType).val(exemplaryMatrixServiceSituations[i].serviceEffect);
					limWord("#serviceEffect"+serviceType,200,"#serviceEffect"+serviceType+"Show");
					
					
					var serviceScopes = exemplaryMatrixServiceSituations[i].serviceScope.split(",");
					if(serviceScopes.length == 16){
						$("input:checkbox[name='allCity"+serviceType+"']").attr('checked','true');
					}
					for(var j=0;j<serviceScopes.length;j++){
						$("input:checkbox[name='serviceScope"+serviceType+"'][value='"+serviceScopes[j]+"']").attr('checked','true');
					}
					
					if(serviceType == '103000006'){
						$("input[name='financingAmount']").val(exemplaryMatrixServiceSituations[i].financingAmount);
					}
				}
			}
		}
	})
}

/**
 * 下一步方法
 */
function nextStep(){
	if(check()){
		$("input[name='userCode']").val(userCode);
		$("input[name='serviceYear']").val(paramYear);
		$("input[name='serviceQuarter']").val(paramQuarter);
		
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixBackstage/saveExemplaryMatrixServiceSituation.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: $("#serviceForm").serialize(),
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("保存失败！");
				}else{
					alert("保存成功！");
					window.location.href = rootPath + "/page/jsp/exemplaryMatrix/monthlyServiceAbility.jsp?paramYear="+paramYear+"&paramQuarter="+paramQuarter
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
	var flag = true
	$(".checkInfo").each(function(index){
		var thisInput = $(this).val();
		if($.trim(thisInput) == ""){
			var string1 = $(this).prev("span").text();
			string1 = string1.substring(0,string1.lastIndexOf("："));
			var string2 = $(this).parent().parent().parent().prev("div").text();
			alert(string2 +" 的 "+ string1+" 不能为空！");
			flag = false;
			return flag;
		}
	})
	
	if(flag){
		$(".checkP").each(function(index){
			var name = $(this).children().children().find("input[class='district']").attr("name");
			var string1 = $(this).prev("span").text();
			string1 = string1.substring(0,string1.lastIndexOf("："));
			var string2 = $(this).parent().parent().parent().prev("div").text();
			if ($(":checkbox[name="+name+"]:checked").size() == 0) {
				alert("请选择 "+string2+" 的 "+string1);
				flag = false;
				return flag;
			}
		})
	}
	
	if(flag){
		var length = $("input[name='financingAmount']").length;
		if(length!=0){
			var thisInput = $("input[name='financingAmount']").val();
			if(thisInput.trim() == ""){
				var string1 = $("input[name='financingAmount']").prev("span").text();
				string1 = string1.substring(0,string1.lastIndexOf("："));
				var string2 = $("input[name='financingAmount']").parent().parent().parent().prev("div").text();
				alert(string2 +" 的 "+ string1+" 不能为空！");
				flag = false;
				return flag;
			}
		}
	}
	
	return flag;
}

/**
 * 通过code查询申请表，获取服务类别
 */
function matrixApplicationByCode(){
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
				//提供八个服务
				if(exemplaryMatrixApplication.informationService == null){
					informationService = false;
				}
				
				if(exemplaryMatrixApplication.tutorship == null){
					tutorship = false;
				}
				
				if(exemplaryMatrixApplication.innovationSupport == null){
					innovationSupport = false;
				}
				
				if(exemplaryMatrixApplication.personnelTraining == null){
					personnelTraining = false;
				}
				
				if(exemplaryMatrixApplication.marketing == null){
					marketing = false;
				}
				
				if(exemplaryMatrixApplication.financingService == null){
					financingService = false;
				}
				
				if(exemplaryMatrixApplication.managementConsultancy == null){
					managementConsultancy = false;
				}
				
				if(exemplaryMatrixApplication.otherService == null){
					otherService = false;
				}
			}
			if(!informationService && !tutorship && !innovationSupport && !personnelTraining && !marketing && !financingService && !managementConsultancy && !otherService){
				alert("您未填写示范基地信息页中的服务情况，请移步至示范基地信息页进行信息完善！");
				window.location.href = rootPath + "/page/jsp/exemplaryMatrixNew/matrixInfoOne.jsp"
			}
		
		
		}
	})
}