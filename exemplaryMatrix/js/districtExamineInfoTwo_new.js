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
 * 加载完成后执行
 */
$(function(){
	//加高亮
	$("#exemplaryMatrixRecommend").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	getMatrixInfoByCode();
	getExemplaryMatrixRecommendByParams();
	getExemplaryMatrixRecommendEvaluateList();
	
	
	$("#goBack").click(function(){
		window.location.href = rootPath + "/page/jsp/exemplaryMatrix/districtAuditList.jsp";
	})
	
	$("#save").click(function(){
		saveExemplaryMatrixRecommend();
	})
	
	//弹窗1
	$(".addBtn1_w").click(function () {
		//解绑事件
		$("#saveExemplaryMatrixRecommendEvaluate").unbind("click");
		
		$("#cancelExemplaryMatrixRecommendEvaluate").unbind("click");
		
		var index1=layer.open({
			title:"新增月度服务数据",
			skin:"addPop_w",
			type:1,//可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
			content:$('.addPop1_w'),
//					btn: ['保存并新增','保存并退出', '取消'],
			//  shade: 0,//遮罩，如需要此处去掉
//					id:"pop1",
			move: false,//禁止拖拽
			area: ['1000px', '400px'],
			cancel:function(){
				layer.close(index1);
				$("input[name='evaluateId']").val("");
				$("input[name='enterpriseName']").val("");
				$("input[name='name']").val("");
				$("input[name='duty']").val("");
				$("input[name='contactPhone']").val("");
				$("input[name='enjoyService']").val("");
				$("input[name='accord'][value=2]").iCheck('check');
				$("input[name='evaluate'][value=2]").iCheck('check');
			},
			// scrollbar: false
			/*yes: function(index, layero){
				//do something
				alert("确定按钮");
				layer.close(index1); //如果设定了yes回调，需进行手工关闭
			}*/
		})
		/*$(".addPop1_w .btn_border,.addPop1_w .btn_solid").click(function(){
			layer.close(index1)
		})*/
		
		//保存推荐附表按钮
		$("#saveExemplaryMatrixRecommendEvaluate").click(function(){
			saveExemplaryMatrixRecommendEvaluate(index1);
		})
		//取消按钮
		$("#cancelExemplaryMatrixRecommendEvaluate").click(function(){
			layer.close(index1)
			$("input[name='evaluateId']").val("");
			$("input[name='enterpriseName']").val("");
			$("input[name='name']").val("");
			$("input[name='duty']").val("");
			$("input[name='contactPhone']").val("");
			$("input[name='enjoyService']").val("");
			$("input[name='accord'][value=2]").iCheck('check');
			$("input[name='evaluate'][value=2]").iCheck('check');
		})
	})
	
	$("#evaluationOpinions").keyup(function(){
		limWord("#evaluationOpinions",300,"#evaluationOpinionsShow");
	})
})

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

function changeTit(){
	$(".advceVid_PJY input").on("ifChecked",function(){
		var con=$(this).parent().next().html();
		$(this).parent().parent().parent().parent().next().find(".con_PJY").html(con+"理由：")
	});
}


/**
 * 通过code获取基地信息
 */
function getMatrixInfoByCode(){
	var params = {"params.userCode":applicationUserCode
					//,"params.applicationYear":paramApplicationYear
					};
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
				$("input[name='flag'][value='"+exemplaryMatrixApplication.districtAuditType+"']").attr("checked","true");
				if(exemplaryMatrixApplication.districtAuditType == "2"){
					$("#cause").text("推荐理由：")
				}else if(exemplaryMatrixApplication.districtAuditType == "1"){
					$("#cause").text("不推荐理由：")
				}
			}
		}
	})
}

/**
 * 通过参数获取推荐主表内容
 */
function getExemplaryMatrixRecommendByParams(){
	var params = {"params.userCode":applicationUserCode,
					"params.exemplaryMatrixApplicationId":applicationId}
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getExemplaryMatrixRecommendByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var exemplaryMatrixRecommend = data['exemplaryMatrixRecommend'];
				
				var evaluativeMethods = exemplaryMatrixRecommend.evaluativeMethods;
				var evaluativeMethodsArray = evaluativeMethods.split(",");
				for(var i=0;i<evaluativeMethodsArray.length-1;i++){
					$("input[name='evaluativeMethods'][value='"+evaluativeMethodsArray[i]+"']").attr("checked","true");
				}
				var evaluationOpinions = exemplaryMatrixRecommend.evaluationOpinions;
				$("#evaluationOpinions").val(evaluationOpinions);
				limWord("#evaluationOpinions",300,"#evaluationOpinionsShow");
				var recommendations = exemplaryMatrixRecommend.recommendations;
				$("#recommendations").val(recommendations);
			}
		}
	})
}


/**
 * 获取推荐附表内容
 */
function getExemplaryMatrixRecommendEvaluateList(){
	//查询推荐表前将推荐附表长度置为0
	evaluateLength = 0;
	
	$("#exemplaryMatrixRecommendEvaluateList").empty();
	var params = {"params.userCode":applicationUserCode,
					"params.exemplaryMatrixApplicationId":applicationId}
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getExemplaryMatrixRecommendEvaluateList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var html = "";
			var status = data['status'];
			if(status == "1"){
				var exemplaryMatrixRecommendEvaluates = data['exemplaryMatrixRecommendEvaluates'];
				if(exemplaryMatrixRecommendEvaluates.length>0){
					//设置推荐附表长度
					evaluateLength  = exemplaryMatrixRecommendEvaluates.length;
					for(var i=0;i<exemplaryMatrixRecommendEvaluates.length;i++){
						html += '<tr>';
						html += '<td width="10%">'+exemplaryMatrixRecommendEvaluates[i].enterpriseName+'</td>';
						html += '<td width="10%">'+exemplaryMatrixRecommendEvaluates[i].name+'</td>';
						html += '<td width="10%">'+exemplaryMatrixRecommendEvaluates[i].duty+'</td>';
						html += '<td width="10%">'+exemplaryMatrixRecommendEvaluates[i].contactPhone+'</td>';
						html += '<td width="20%" title="'+exemplaryMatrixRecommendEvaluates[i].enjoyService+'">'+exemplaryMatrixRecommendEvaluates[i].enjoyService+'</td>';
						var accord = exemplaryMatrixRecommendEvaluates[i].accord;
						if(accord == "2"){
							html += '<td width="15%">很符合</td>';
						}else if(accord == "1"){
							html += '<td width="15%">一般</td>';
						}else if(accord == "0"){
							html += '<td width="15%">不符合</td>';
						}
						
						var evaluate = exemplaryMatrixRecommendEvaluates[i].evaluate;
						if(evaluate == "2"){
							html += '<td width="15%">很满意</td>';
						}else if(evaluate == "1"){
							html += '<td width="15%">基本满意</td>';
						}else if(evaluate == "0"){
							html += '<td width="15%">不满意</td>';
						}
						
						html += '<td width="10%"><a href="javascript:;" onclick="modifyExemplaryMatrixRecommendEvaluate('+exemplaryMatrixRecommendEvaluates[i].id+')">修改</a>&nbsp;&nbsp;&nbsp;'; 
						html += '<a href="javascript:;" onclick="deleteExemplaryMatrixRecommendEvaluate('+exemplaryMatrixRecommendEvaluates[i].id+')">删除</a></td></tr>'
					}
				}
			}else if(status == '0'){
				html += '<tr><td>未查询到任何数据</td></tr>';
			}
			$("#exemplaryMatrixRecommendEvaluateList").append(html);
		}
	})
}

/**
 * 修改推荐附表信息
 */
function modifyExemplaryMatrixRecommendEvaluate(id){
	var params={"params.id":id};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getExemplaryMatrixRecommendEvaluateById.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == '0'){
				alert("获取推荐附表信息失败！");
			}else if(status == '1'){
				//塞值
				var exemplaryMatrixRecommendEvaluate = data['exemplaryMatrixRecommendEvaluate'];
				
				$("input[name='evaluateId']").val(exemplaryMatrixRecommendEvaluate.id);
				$("input[name='enterpriseName']").val(exemplaryMatrixRecommendEvaluate.enterpriseName);
				$("input[name='name']").val(exemplaryMatrixRecommendEvaluate.name);
				$("input[name='duty']").val(exemplaryMatrixRecommendEvaluate.duty);
				$("input[name='contactPhone']").val(exemplaryMatrixRecommendEvaluate.contactPhone);
				$("input[name='enjoyService']").val(exemplaryMatrixRecommendEvaluate.enjoyService);
				$("input[name='accord'][value="+exemplaryMatrixRecommendEvaluate.accord+"]").iCheck('check');
				$("input[name='evaluate'][value="+exemplaryMatrixRecommendEvaluate.evaluate+"]").iCheck('check');
				
				//调用按钮点击事件弹出弹出框
				$(".addBtn1_w").click();
			}
		}
	})
}

/**
 * 删除推荐附表信息
 * @param id
 */
function deleteExemplaryMatrixRecommendEvaluate(id){
	if(confirm("确定删除这条记录吗？")){
		var params={"params.id":id};
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/deleteExemplaryMatrixRecommendEvaluateById.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: params,
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == '0'){
					alert("删除失败！");
				}else if(status == '1'){
					alert("删除成功！");
					getExemplaryMatrixRecommendEvaluateList();
				}
			}
		})
	}
}

/**
 * 推荐操作
 * @param flag
 * @param index
 */
function audit(flag,index){
	if(check()){
		var evaluativeMethods = "";
		$("[name='evaluativeMethods']:checked").each(function(){ 
			evaluativeMethods += $(this).val()+",";
		})
		
		var evaluationOpinions = $("#evaluationOpinions").val();
		var recommendations = $("#recommendations").val();
		if($.trim(recommendations) == ""){
			if(flag == "2"){
				alert("推荐理由不能为空！");
			}else if(flag == "1"){
				alert("不推荐理由不能为空！");
			}
		}else{
			var params1 = {"exemplaryMatrixRecommend.userCode":applicationUserCode,
							"exemplaryMatrixRecommend.exemplaryMatrixApplicationId":applicationId,
							"exemplaryMatrixRecommend.evaluativeMethods":evaluativeMethods,
							"exemplaryMatrixRecommend.evaluationOpinions":evaluationOpinions,
							"exemplaryMatrixRecommend.recommendations":recommendations}

			$.ajax({
				type: "post",
				url: rootPath+"/exemplaryMatrixApplication/saveExemplaryMatrixRecommend.action",
				async : false,
				timeout : 30000,
				dataType:'json',
				data: params1,
				beforeSend: function(XMLHttpRequest){},
				success: function(data, textStatus){
					var status = data['status'];
					if(status == "0"){
						alert("操作失败！");
					}else{
						
					}
				}
			})
			
			var params = "";
			if(flag == "2"){
				params = {"params.applicationUserCode":applicationUserCode,
							"params.userCode":userCode,
							"params.auditType":"district",
							"params.flag":flag}
			}else if(flag == "1"){
				params = {"params.applicationUserCode":applicationUserCode,
							"params.userCode":userCode,
							"params.auditType":"district",
							"params.flag":flag}
			}
			$.ajax({
				type: "post",
				url: rootPath+"/exemplaryMatrixApplication/audit.action",
				async : false,
				timeout : 30000,
				dataType:'json',
				data: params,
				beforeSend: function(XMLHttpRequest){},
				success: function(data, textStatus){
					var status = data['status'];
					if(status == "0"){
						alert("操作失败！");
					}else{
						alert("操作成功！");
						layer.close(index);
						
						//发送站内信
						if(flag == "2"){
							sendletter(applicationUserCode,"您提交的示范基地申请区级政府已推荐，请点击查看",2,applicationId,"22011");
						}else if(flag == "1"){
							sendletter(applicationUserCode,"您提交的示范基地申请区级政府未推荐，请点击查看",2,applicationId,"22011");
						}
						
						window.location.href = rootPath + "/page/jsp/exemplaryMatrix/districtAuditList.jsp";
					}
				}
			})
		}
	}
}


/**
 * 保存推荐表信息
 */
function saveExemplaryMatrixRecommend(){
	var evaluativeMethods = "";
	$("[name='evaluativeMethods']:checked").each(function(){ 
		evaluativeMethods += $(this).val()+",";
	})
	
	var evaluationOpinions = $("#evaluationOpinions").val();
	
	
	var params = {"exemplaryMatrixRecommend.userCode":applicationUserCode,
					"exemplaryMatrixRecommend.exemplaryMatrixApplicationId":applicationId,
					"exemplaryMatrixRecommend.evaluativeMethods":evaluativeMethods,
					"exemplaryMatrixRecommend.evaluationOpinions":evaluationOpinions}
	
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveExemplaryMatrixRecommend.action",
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
				alert("保存成功！");
			}
		}
	})
}

/**
 * 保存推荐表附表
 */
function saveExemplaryMatrixRecommendEvaluate(index1){
	if(checkEvaluate()){
		var id = $("input[name='evaluateId']").val();
		var enterpriseName = $("input[name='enterpriseName']").val();
		var name = $("input[name='name']").val();
		var duty = $("input[name='duty']").val();
		var contactPhone = $("input[name='contactPhone']").val();
		var enjoyService = $("input[name='enjoyService']").val();
		var accord = $("input[name='accord']:checked").val();
		var evaluate = $("input[name='evaluate']:checked").val();
		
		var params = {"exemplaryMatrixRecommendEvaluate.id":id,
						"exemplaryMatrixRecommendEvaluate.userCode":applicationUserCode,
						"exemplaryMatrixRecommendEvaluate.exemplaryMatrixApplicationId":applicationId,
						"exemplaryMatrixRecommendEvaluate.enterpriseName":enterpriseName,
						"exemplaryMatrixRecommendEvaluate.name":name,
						"exemplaryMatrixRecommendEvaluate.duty":duty,
						"exemplaryMatrixRecommendEvaluate.contactPhone":contactPhone,
						"exemplaryMatrixRecommendEvaluate.enjoyService":enjoyService,
						"exemplaryMatrixRecommendEvaluate.accord":accord,
						"exemplaryMatrixRecommendEvaluate.evaluate":evaluate
						}
		
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/saveExemplaryMatrixRecommendEvaluateNew.action",
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
					alert("保存成功！");
					layer.close(index1);
					getExemplaryMatrixRecommendEvaluateList();
					$("input[name='evaluateId']").val("");
					$("input[name='enterpriseName']").val("");
					$("input[name='name']").val("");
					$("input[name='duty']").val("");
					$("input[name='contactPhone']").val("");
					$("input[name='enjoyService']").val("");
					$("input[name='accord'][value=2]").iCheck('check');
					$("input[name='evaluate'][value=2]").iCheck('check');
				}
			}
		})
	}
}

/**
 * 验证推荐附表是否为空
 */
function checkEvaluate(){
	var flag = true;
	var checkEvaluateLength = $(".checkEvaluate").length;
	$(".checkEvaluate").each(function(index){
		var thisInput = $(this).val();
		if($.trim(thisInput) == ""){
			var str = $(this).parent().prev("td").text();
			str = str.substring(0,str.length-1);
			alert(str+" 不能为空！");
			flag = false;
			return flag;
		}
	})
	return flag;
}

function check(){
	var flag = true;
	var evaluativeMethods = "";
	$("[name='evaluativeMethods']:checked").each(function(){ 
		evaluativeMethods += $(this).val()+",";
	})
	if($.trim(evaluativeMethods) == ""){
		alert("请选择测评方法");
		flag = false;
		return flag;
	}
	if(flag){
//		var result = $("input[name='flag']:checked").val();
		var evaluationOpinions = $("#evaluationOpinions").val();
		var recommendations = $("#recommendations").val();
		if($.trim(evaluationOpinions) == ""){
			alert("企业对创业创新基地的具体评价及意见 不能为空");
			flag = false;
			return flag;
		}
//		if(result == "2" && $.trim(recommendations) == ""){
//			alert("推荐理由 不能为空");
//			var flag = false;
//			return flag;
//		}
//		if(result == "1" && $.trim(recommendations) == ""){
//			alert("不推荐理由 不能为空");
//			var flag = false;
//			return flag;
//		}
	}
	if(flag){
		if(evaluateLength == 0){
			alert("未填写抽样企业信息，不得执行推荐操作！");
			flag = false;
			return flag;
		}
	}
	return flag;
}