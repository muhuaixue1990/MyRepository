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

$(function(){
	//加高亮
	$("#gotoMonthlyStatement").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	//上一步
	$("#lastStep").click(function(){
		window.location.href = rootPath + "/page/jsp/exemplaryMatrixNew/quarterStatementTwo.jsp?paramYear="+paramYear+"&paramQuarter="+paramQuarter;
	})
	
	//取消按钮
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/statementManage_new.jsp";
	})
	
	//保存按钮
	$("#save").click(function(){
		if(saveCheck()){
			saveMonthlyOfficeEquipment();
		}
	})
	
	//下一步按钮
	$("#nextStep").click(function(){
		submit();
	})
	
	//查询存储结果
	getMonthlyServiceAbility();
	
	//计算字数
	limWord("#contractContents0",1000,"#contractContentsShow0");
	
	$("#sketch0").keyup(function(){
		limWord("#contractContents0",1000,"#contractContentsShow0");
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




/**
 * 下一步方法
 */
function submit(){
	if(check()){
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/saveMonthlyOfficeEquipment.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: $("#monthlyOfficeEquipmentForm").serialize(),
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("保存失败！");
				}else if(status == "1"){
					$.ajax({
						type: "post",
						url: rootPath+"/exemplaryMatrixApplication/saveMonthlyDecoration.action",
						async : false,
						timeout : 30000,
						dataType:'json',
						data: $("#monthlyDecorationForm").serialize(),
						beforeSend: function(XMLHttpRequest){},
						success: function(data, textStatus){
							var status = data['status'];
							if(status == "0"){
								alert("保存失败！");
							}else if(status == "1"){
								alert("保存成功！");
								window.location.href = rootPath + "/page/jsp/exemplaryMatrix/quarterStatement_new.jsp?paramYear="+paramYear+"&paramQuarter="+paramQuarter;
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
}

/**
 * 传入参数的话直接查询数据库获取月度服务能力升级情况
 */
function getMonthlyServiceAbility(){
	var adminTitle = "";
	
	if(paramQuarter == 1){
		adminTitle += paramYear+"年I (1~3月)（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 2){
		adminTitle += paramYear+"年II (1~6月)（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 3){
		adminTitle += paramYear+"年III (1~9月)（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 4){
		adminTitle += paramYear+"年IV (1~12月)（请填写季度累计值，部分数据为代入值）";
	}
	
	$("#adminTitle").html(adminTitle);
	$("input[name='year']").val(paramYear);
	$("input[name='month']").val(paramQuarter);
	
	
	var params = {"params.matrixCode":userCode,"params.year":paramYear,"params.month":paramQuarter};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getOfficeEquipmentAndDecorationByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				
			}else if(status == "1"){
				var officeEquipmentList = data['officeEquipmentList'];
				var decorationList = data['decorationList'];
				
				for(var i=0;i<officeEquipmentList.length-1;i++){
					newMonthlyOfficeEquipment()
				}
				for(var i=0;i<officeEquipmentList.length;i++){
					$("input[name='monthlyOfficeEquipment.equipmentName']:eq("+i+")").val(officeEquipmentList[i].equipmentName);
					$("input[name='monthlyOfficeEquipment.count']:eq("+i+")").val(officeEquipmentList[i].count);
					$("input[name='monthlyOfficeEquipment.invoiceNo']:eq("+i+")").val(officeEquipmentList[i].invoiceNo);
					$("input[name='monthlyOfficeEquipment.amountInvested']:eq("+i+")").val(officeEquipmentList[i].amountInvested);
					$("input[name='monthlyOfficeEquipment.timeInvested']:eq("+i+")").val(officeEquipmentList[i].timeInvested);
				}
				
				
				for(var i=0;i<decorationList.length-1;i++){
					newDecoration()
				}
				for(var i=0;i<decorationList.length;i++){
					$("input[name='monthlyDecoration.contractName']:eq("+i+")").val(decorationList[i].contractName);
					$("input[name='monthlyDecoration.contractNo']:eq("+i+")").val(decorationList[i].contractNo);
					$("textarea[name='monthlyDecoration.contractContents']:eq("+i+")").val(decorationList[i].contractContents);
					$("input[name='monthlyDecoration.invoiceNo']:eq("+i+")").val(decorationList[i].invoiceNo);
					$("input[name='monthlyDecoration.amountInvested']:eq("+i+")").val(decorationList[i].amountInvested);
					$("input[name='monthlyDecoration.timeInvested']:eq("+i+")").val(decorationList[i].timeInvested);
					
					limWord("#contractContents"+i,1000,"#contractContentsShow"+i);
				}
			}
		}
	})
	
}

/**
 * 保存月度报表——办公设备方法
 */
function saveMonthlyOfficeEquipment(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveMonthlyOfficeEquipment.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#monthlyOfficeEquipmentForm").serialize(),
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败！");
			}else if(status == "1"){
				saveMonthlyDecoration();
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
 * 保存月度报表——装修改造
 */
function saveMonthlyDecoration(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveMonthlyDecoration.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#monthlyDecorationForm").serialize(),
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败！");
			}else if(status == "1"){
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

/**
 * 非空验证
 */
function check(){
	var flag = true ;
	
	var checkOfficeLength = $(".checkOffice").length;
	$(".checkOffice").each(function(index){
		if(index == (checkOfficeLength-1) || 
			index == (checkOfficeLength-2) || 
			index == (checkOfficeLength-3) ||
			index == (checkOfficeLength-4) || 
			index == (checkOfficeLength-5)){
			
		}else{
			var thisInput = $(this).val();
			if($.trim(thisInput) == ""){
				var str = $(this).parent().prev("td").text();
				str = str.substring(0,str.length-1);
				alert(str+" 不能为空！");
				flag = false;
				return flag;
			}
		}
	})
	
	if(flag){
		var checkDecorationLength = $(".checkDecoration").length;
		$(".checkDecoration").each(function(index){
			if(index == (checkDecorationLength-1) || 
				index == (checkDecorationLength-2) || 
				index == (checkDecorationLength-3) ||
				index == (checkDecorationLength-4) ||
				index == (checkDecorationLength-5) ||
				index == (checkDecorationLength-6)){
				
			}else{
				var thisInput = $(this).val();
				if($.trim(thisInput) == ""){
					var str = $(this).parent().prev("td").text();
					str = str.substring(0,str.length-1);
					alert(str+" 不能为空！");
					flag = false;
					return flag;
				}
			}
		})
	}
	
	if(flag){
		var checkGonggongNo = $(".gonggongNo").length;
		$(".gonggongNo").each(function(index){
			if(index == (checkGonggongNo-1)){
				
			}else{
				var thisInput = $(this).val();
				if(thisInput.length>9){
					alert("公共服务设备"+(index+1)+" 发票票号不能超过9位！")
					flag = false;
					return flag;
				}
			}
		})
	}
	
	if(flag){
		var checkZhuangxiuNo = $(".zhuangxiuNo").length;
		$(".zhuangxiuNo").each(function(index){
			if(index == (checkGonggongNo-1)){
				
			}else{
				var thisInput = $(this).val();
				if(thisInput.length>9){
					alert("装修改造"+(index+1)+" 发票票号不能超过9位！")
					flag = false;
					return flag;
				}
			}
		})
	}
	
	return flag;
}

function saveCheck(){
	var flag = true;
	var checkNum1Length = $(".checkNum1").length;
	$(".checkNum1").each(function(index){
		if(index == (checkNum1Length-1)){
			
		}else{
			var thisInput = $(this).val();
			if($.trim($(this).val())!="" && isNaN($(this).val())){
				var str = $(this).parent().prev("td").text();
				str = str.substring(0,str.length-1);
				alert(str+" 只能是数字！");
				flag = false;
				return flag;
			}
		}
	})
	
	if(flag){
		var checkNum2Length = $(".checkNum2").length;
		$(".checkNum2").each(function(index){
			if(index == (checkNum2Length-1)){
				
			}else{
				var thisInput = $(this).val();
				if($.trim($(this).val())!="" && isNaN($(this).val())){
					var str = $(this).parent().prev("td").text();
					str = str.substring(0,str.length-1);
					alert(str+" 只能是数字！");
					flag = false;
					return flag;
				}
			}
		})
	}
	
	if(flag){
		var checkInt1Length = $(".checkInt1").length;
		$(".checkInt1").each(function(index){
			if(index == (checkInt1Length-1)){
				
			}else{
				var reg=/^[1-9]\d*$/; //由 1-9开头 的正则表达式
				var thisInput = $(this).val();
				if($.trim(thisInput) != "" && !reg.test(thisInput)){
					var str = $(this).parent().prev("td").text();
					str = str.substring(0,str.length-1);
					alert(str+" 只能是正整数！");
					flag = false;
					return flag;
				}
			}
		})
	}
	
	if(flag){
		var checkInt2Length = $(".checkInt2").length;
		$(".checkInt2").each(function(index){
			if(index == (checkInt2Length-1)){
				
			}else{
				var reg=/^[1-9]\d*$/; //由 1-9开头 的正则表达式
				var thisInput = $(this).val();
				if($.trim(thisInput) != "" && !reg.test(thisInput)){
					var str = $(this).parent().prev("td").text();
					str = str.substring(0,str.length-1);
					alert(str+" 只能是正整数！");
					flag = false;
					return flag;
				}
			}
		})
	}
	return flag;
		
}