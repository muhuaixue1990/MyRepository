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
	
	//获取已有信息
	getQuarterStatement();
	
	//获取上季度数据
	getQuarterStatementLastQuarter();
	
	$(".checkParams").focus(function(){
		if(paramQuarter != '1'){
			var thisId = $(this).attr("id");
			$("#"+thisId+"_last").css('visibility','visible');	
		}
	})
	
	$(".checkParams").blur(function(){
		if(paramQuarter != '1'){
			var thisId = $(this).attr("id");
			$("#"+thisId+"_last").css('visibility','hidden');
		}
	})
	
	//上一步
	$("#lastStep").click(function(){
		window.location.href = rootPath + "/page/jsp/exemplaryMatrix/monthlyServiceAbility.jsp?paramYear="+paramYear+"&paramQuarter="+paramQuarter;
	})
	
	//取消按钮
	$("#cancel").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/statementManage_new.jsp";
	})
	
	//保存按钮
	$("#save").click(function(){
		if(check()){
			addQuarterStatement();
		}
	})
	
	//提交按钮
	$("#submit").click(function(){
		if(confirm("确认提交吗？")){
			submit();
		}
	})
	
	/*$(".double").keyup(function () {
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
    });*/
})

/**
 * 提交月报
 */
function submit(){
	var saveFlag = false;
	var params = {"params.userCode":userCode,
					"params.year":paramYear,
					"params.quarter":paramQuarter}
	if(check()){
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/addQuarterStatement.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: $("#quarterStatementForm").serialize(),
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("保存失败");
				}else if(status = "1"){
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
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/submitMonthlyStatement.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: params,
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("提交失败！");
				}else if(status == "1"){
					alert("提交成功！");
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
 * 查上个季度的数据
 */
function getQuarterStatementLastQuarter(){
	var lastQuarter = 0;
	if(paramQuarter == '1'){
		
	}else{
		lastQuarter = parseInt(paramQuarter)-1
		var params = {"params.userCode":userCode,
						"params.year":paramYear,
						"params.quarter":lastQuarter};
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/findStatementByParam.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: params,
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == 0){
					
				}else if(status == 1){
					var quarterStatement = data['quarterStatement'];
					$("#enterpriseCount_last").text("上季度："+quarterStatement.enterpriseCount);
					$("#smeCount_last").text("上季度："+quarterStatement.smeCount);
					$("#totalAssetsE_last").text("上季度："+quarterStatement.totalAssetsE);
					$("#incomeE_last").text("上季度："+quarterStatement.incomeE);
					$("#profitE_last").text("上季度："+quarterStatement.profitE);
					$("#taxesE_last").text("上季度："+quarterStatement.taxesE);
					$("#personnelQuantityE_last").text("上季度："+quarterStatement.personnelQuantityE);
					$("#floorSpaceE_last").text("上季度："+quarterStatement.floorSpaceE);
					$("#totalAssets_last").text("上季度："+quarterStatement.totalAssets);
					$("#income_last").text("上季度："+quarterStatement.income);
					$("#profit_last").text("上季度："+quarterStatement.profit);
					$("#taxes_last").text("上季度："+quarterStatement.taxes);
					$("#personnelQuantity_last").text("上季度："+quarterStatement.personnelQuantity);
					$("#tutorQuantity_last").text("上季度："+quarterStatement.tutorQuantity);
					$("#incomeProportion_last").text("上季度："+quarterStatement.incomeProportion);
				}
			}
		})
	}
}

/**
 * 传入参数的话直接查询数据库获取季度报表信息
 */
function getQuarterStatement(){
	var adminTitle = "";
	if(paramQuarter == 1){
		adminTitle += paramYear+"年I(1~3月)（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 2){
		adminTitle += paramYear+"年II(1~6月)（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 3){
		adminTitle += paramYear+"年III(1~9月)（请填写季度累计值，部分数据为代入值）";
	}else if(paramQuarter == 4){
		adminTitle += paramYear+"年IV(1~12月)（请填写季度累计值，部分数据为代入值）";
	}
	$("#adminTitle").html(adminTitle);
	
	$("input[name='quarterStatement.year']").val(paramYear);
	$("input[name='quarterStatement.quarter']").val(paramQuarter);
	
	
	var params = {"params.userCode":userCode,
					"params.year":paramYear,
					"params.quarter":paramQuarter};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/findStatementByParam.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == 0){
				
			}else if(status == 1){
				var quarterStatement = data['quarterStatement'];
				$("#enterpriseCount").val(quarterStatement.enterpriseCount);
				$("#smeCount").val(quarterStatement.smeCount);
				$("#totalAssetsE").val(quarterStatement.totalAssetsE);
				$("#incomeE").val(quarterStatement.incomeE);
				$("#profitE").val(quarterStatement.profitE);
				$("#taxesE").val(quarterStatement.taxesE);
				$("#personnelQuantityE").val(quarterStatement.personnelQuantityE);
				$("#floorSpaceE").val(quarterStatement.floorSpaceE);
				$("#totalAssets").val(quarterStatement.totalAssets);
				$("#income").val(quarterStatement.income);
				$("#profit").val(quarterStatement.profit);
				$("#taxes").val(quarterStatement.taxes);
				$("#personnelQuantity").val(quarterStatement.personnelQuantity);
				$("#tutorQuantity").val(quarterStatement.tutorQuantity);
				$("#incomeProportion").val(quarterStatement.incomeProportion);
			}
		}
	})
	
}

/**
 * 添加季度报表
 */
function addQuarterStatement(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/addQuarterStatement.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#quarterStatementForm").serialize(),
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败");
			}else if(status = "1"){
				alert("保存成功！");
				window.location.href = rootPath + "/page/jsp/exemplaryMatrixNew/statementManage_new.jsp";
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
	
	var checkParamsLength = $(".checkParams").length;
	$(".checkParams").each(function(index){
		var thisInput = $(this).val();
		if($.trim(thisInput) == ""){
			var str = $(this).parent().prev("td").text();
			str = str.substring(0,str.length-1);
			alert(str+" 不能为空！");
			flag = false;
			return flag;
		}
	})
	
	if(flag){
		$(".checkParams").each(function(index){
			var thisInput = $(this).val();
			if($.trim(thisInput)!="" && isNaN(thisInput)){
				var str = $(this).parent().prev("td").text();
				str = str.substring(0,str.length-1);
				alert(str+" 只能填写数字！");
				flag = false;
				return flag;
			}
		})
	}
	
	
	if(flag){
		var checkIntLength = $(".checkInt").length;
		$(".checkInt").each(function(index){
			var reg=/^[0-9]\d*$/; //由 1-9开头 的正则表达式
			
			var thisInput = $(this).val();
			
			if($.trim(thisInput) != "" && !reg.test(thisInput)){
				alert("人员数量必须为正整数！")
				flag = false;
				return flag;
			}
		})
	}
	
	return flag;
}