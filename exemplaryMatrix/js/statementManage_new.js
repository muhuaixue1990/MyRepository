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
	//获取当前时间
	getNowTime();
	
	$("#search").click(function(){
		getList();
	})
	
	getList();
	
	$("#submit").click(function(){
		if(checkTime()){
			if(month == '07'){
				if(confirm("确认提交2018年度第一、二期及2017年第四期的数据吗？")){
					submit();
				}
			}else{
				if(confirm("确认提交上一季度数据吗？")){
					submit();
				}
			}
		}else{
			alert("只有每个季度起始月的1-10日可以提交上季度报表！")
		}
		
	})
	
	
	$("#statementListHead").on("click",".tianbao",function(){
		var params = $(this).attr("name");
		var paramsArry = params.split(",");
		var index = paramsArry[0]
		var paramQuarter = paramsArry[1]
		if(index == '0'){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/quarterStatement_new.jsp?paramYear="+$("#year").val()+"&paramQuarter="+paramQuarter;
		}else if(index == '1'){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrix/monthlyServiceAbility.jsp?paramYear="+$("#year").val()+"&paramQuarter="+paramQuarter;
		}else if(index == '2'){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/onlineDataList.jsp?year="+$("#year").val()+"&quarter="+paramQuarter;
		}else if(index == '3'){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/offlineDataList.jsp?year="+$("#year").val()+"&quarter="+paramQuarter;
		}else if(index == '4'){
			window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/quarterStatementTwo.jsp?paramYear="+$("#year").val()+"&paramQuarter="+paramQuarter;
		}
	})
	
	
	
	$("#statementListHead").on("click",".gotoServiceDataDetail",function(){
		var param = $(this).attr("name");
		var paramArry = param.split(',');
		var index = paramArry[0];
		var activityClass = ''
		if(index == '0'){
			activityClass = '103000001'
		}else if(index == '1'){
			activityClass = '103000002'
		}else if(index == '2'){
			activityClass = '103000003'
		}else if(index == '3'){
			activityClass = '103000004'
		}else if(index == '4'){
			activityClass = '103000005'
		}else if(index == '5'){
			activityClass = '103000006'
		}else if(index == '6'){
			activityClass = '103000007'
		}else if(index == '7'){
			activityClass = '103000008'
		}
		
		window.location.href = rootPath + "/page/jsp/exemplaryMatrixNew/serviceDataDetailForMatrix.jsp?paramYear="+paramArry[1]+"&paramQuarter="+paramArry[2]+"&lineType="+paramArry[3]+"&activityClass="+activityClass+"&auditType=";
	})
	
	$("#statementListHead").on("click",".gotoAllServiceDataDetail",function(){
		var param = $(this).attr("name");
		var paramArry = param.split(',');
		window.location.href = rootPath + "/page/jsp/exemplaryMatrixNew/serviceDataDetailForMatrix.jsp?paramYear="+paramArry[0]+"&paramQuarter="+paramArry[1];
	})
})

/**
 * 验证只有每个季度首月1-10日可以提交报表
 */
function checkTime(){
	if((dateCompare(nowTime,year+"-01-01 00:00:00") && dateCompare(year+"-01-10 23:59:59",nowTime))||
			(dateCompare(nowTime,year+"-04-01 00:00:00") && dateCompare(year+"-04-10 23:59:59",nowTime))||
			(dateCompare(nowTime,year+"-07-01 00:00:00") && dateCompare(year+"-07-10 23:59:59",nowTime))||
			(dateCompare(nowTime,year+"-10-01 00:00:00") && dateCompare(year+"-10-10 23:59:59",nowTime))){
		return true;
	}else{
		return false;
	}
}

function submit(){
	var yearInt = parseInt(year);
	var params = "";
	if(month == '01'){
		params = {"params.userCode":userCode,
					"params.year":(yearInt-1),
					"params.quarter":"4"}
	}else if(month == '04'){
		params = {"params.userCode":userCode,
					"params.year":year,
					"params.quarter":"1"}
	}else if(month == '07'){
		params = {"params.userCode":userCode,
					"params.year":year,
					"params.quarter":"2"}
	}else if(month == '10'){
		params = {"params.userCode":userCode,
					"params.year":year,
					"params.quarter":"3"}
	}
	
	if(month == '07'){
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/submitMonthlyStatementForSeven.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: params,
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("提交失败！");
				}else if(status == "-1"){
					alert("您未填写所提交期的基地运营情况，不能执行提交操作。");
				}else if(status == "-2"){
					alert("您已经提交过该期的报表了，不能重复操作。");
				}else if(status == "-3"){
					alert("所提交期报表已经通过审核，不能重复操作。");
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
	}else{
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
				}else if(status == "-1"){
					alert("您未填写上一期的基地运营情况，不能执行提交操作。");
				}else if(status == "-2"){
					alert("您已经提交过上一期的报表了，不能重复操作。");
				}else if(status == "-3"){
					alert("上期报表已经通过审核，不能重复操作。");
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
 * 获取当前时间
 */
function getNowTime(){
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getNowTime.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			nowTime = data['nowTime'];
		}
	})
	//设置年份
	year = nowTime.substring(0,4);
	
	month = nowTime.substring(5,7);
	
	var monthInt = parseInt(month);
	if(monthInt>=1 && monthInt<=3){
		quarter = 1;
	}else if(monthInt>=4 && monthInt<=6){
		quarter = 2;
	}else if(monthInt>=7 && monthInt<=9){
		quarter = 3;
	}else if(monthInt>=10 && monthInt<=12){
		quarter = 4;
	}
}

/**
 * 获取月报列表方法
 */
function getList(){
	var paramYear = $("#year").val();
	var params = {'params.userCode':userCode,
					'params.serviceYear':paramYear};
	
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findStatementManageList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == '0'){
				alert("查询数据失败！");
			}else if(status == '1'){
				//清空列表
				$("#statementListHead").empty();
				
				var statementManageList = data['statementManageList'];
				var html = "";
				if(statementManageList.length > 0){
					
					var serviceYear = "";
					//填报期
					var quarter1 = "";
					var quarter2 = "";
					var quarter3 = "";
					var quarter4 = "";
					
					//审核状态
					var submitType1 = "";
					var auditType1 = "";
					
					var submitType2 = "";
					var auditType2 = "";
					
					var submitType3 = "";
					var auditType3 = "";
					
					var submitType4 = "";
					var auditType4 = "";
					
					var exemplaryMatrixStatementManageViews1
					var exemplaryMatrixStatementManageViews2
					var exemplaryMatrixStatementManageViews3
					var exemplaryMatrixStatementManageViews4
					
					var count1 = 0
					var count2 = 0
					var count3 = 0
					var count4 = 0
					
					var exemplaryMatrixStatementStatus1
					var exemplaryMatrixStatementStatus2
					var exemplaryMatrixStatementStatus3
					var exemplaryMatrixStatementStatus4
					
					var tianbao1;
					var tianbao2;
					var tianbao3;
					var tianbao4;
					
					var recommendations1;
					var recommendations2;
					var recommendations3;
					var recommendations4;
					
					for(var i=0;i<statementManageList.length;i++){
						if(i==0){
							serviceYear =statementManageList[i].serviceYear;
							quarter1 = statementManageList[i].serviceQuarter;
							submitType1 = statementManageList[i].submitType;
							auditType1 = statementManageList[i].auditType;
							recommendations1 = statementManageList[i].recommendations;
							exemplaryMatrixStatementManageViews1 = statementManageList[i].exemplaryMatrixStatementManageViews;
							exemplaryMatrixStatementStatus1 = statementManageList[i].exemplaryMatrixStatementStatus;
						}else if(i==1){
							quarter2 = statementManageList[i].serviceQuarter;
							submitType2 = statementManageList[i].submitType;
							auditType2 = statementManageList[i].auditType;
							recommendations2 = statementManageList[i].recommendations;
							exemplaryMatrixStatementManageViews2 = statementManageList[i].exemplaryMatrixStatementManageViews;
							exemplaryMatrixStatementStatus2 = statementManageList[i].exemplaryMatrixStatementStatus;
						}else if(i==2){
							quarter3 = statementManageList[i].serviceQuarter;
							submitType3 = statementManageList[i].submitType;
							auditType3 = statementManageList[i].auditType;
							recommendations3 = statementManageList[i].recommendations;
							exemplaryMatrixStatementManageViews3 = statementManageList[i].exemplaryMatrixStatementManageViews;
							exemplaryMatrixStatementStatus3 = statementManageList[i].exemplaryMatrixStatementStatus;
						}else if(i==3){
							quarter4 = statementManageList[i].serviceQuarter;
							submitType4 = statementManageList[i].submitType;
							auditType4 = statementManageList[i].auditType;
							recommendations4 = statementManageList[i].recommendations;
							exemplaryMatrixStatementManageViews4 = statementManageList[i].exemplaryMatrixStatementManageViews;
							exemplaryMatrixStatementStatus4 = statementManageList[i].exemplaryMatrixStatementStatus;
						}
					}
					
					for(var i=0;i<exemplaryMatrixStatementManageViews1.length;i++){
						count1 += exemplaryMatrixStatementManageViews1[i].onlineCount;
						count1 += exemplaryMatrixStatementManageViews1[i].offlineCount;
					}
					for(var i=0;i<exemplaryMatrixStatementManageViews2.length;i++){
						count2 += exemplaryMatrixStatementManageViews2[i].onlineCount;
						count2 += exemplaryMatrixStatementManageViews2[i].offlineCount;
					}

					for(var i=0;i<exemplaryMatrixStatementManageViews3.length;i++){
						count3 += exemplaryMatrixStatementManageViews3[i].onlineCount;
						count3 += exemplaryMatrixStatementManageViews3[i].offlineCount;
					}

					for(var i=0;i<exemplaryMatrixStatementManageViews4.length;i++){
						count4 += exemplaryMatrixStatementManageViews4[i].onlineCount;
						count4 += exemplaryMatrixStatementManageViews4[i].offlineCount;
					}

					
					
					html += '<tr>'
					html += '<th colspan="2" width="195">填报年份</th>'
					html += '<td>'+serviceYear+'</td>'
					html += '<td>'+serviceYear+'</td>'
					html += '<td>'+serviceYear+'</td>'
					html += '<td>'+serviceYear+'</td>'
					html += '</tr>'
					
					html += '<tr>'
					html += '<th colspan="2">填报期</th>'
					if(quarter1 == '1'){
						html += '<td>Ⅰ（1~3月）</td>'
					}
					if(quarter2 == '2'){
						html += '<td>Ⅱ（1~6月）</td>'
					}
					if(quarter3 == '3'){
						html += '<td>Ⅲ（1~9月）</td>'
					}
					if(quarter4 == '4'){
						html += '<td>Ⅳ（1~12月）</td>'
					}
					html += '</tr>'
					
					//审核状态
					html += '<tr>'
					html += '<th colspan="2">状态</th>'
					
					//加2017判断
					if(paramYear == '2017'){
						html += '<td>-</td>'
					}else{
						if(submitType1 == '1' && auditType1 == '0'){
							html += '<td>已提交</td>'
						}else if(submitType1 == '1' && auditType1 == '1'){
							html += '<td>通过审核</td>'
						}else if(submitType1 == '1' && auditType1 == '2'){
							html += '<td title="'+recommendations1+'" style="color:red;cursor:pointer">未通过审核</td>'
						}else if(submitType1 == '0' && auditType1 == '0'){
							html += '<td>未提交</td>'
						}
					}
					
					
					if(paramYear == '2017'){
						html += '<td>-</td>'
					}else{
						if(submitType2 == '1' && auditType2 == '0'){
							html += '<td>已提交</td>'
						}else if(submitType2 == '1' && auditType2 == '1'){
							html += '<td>通过审核</td>'
						}else if(submitType2 == '1' && auditType2 == '2'){
							html += '<td title="'+recommendations2+'" style="color:red;cursor:pointer">未通过审核</td>'
						}else if(submitType2 == '0' && auditType2 == '0'){
							if(paramYear == year && quarter < quarter2){
								html += '<td>-</td>'
							}else{
								html += '<td>未提交</td>'
							}
						}
					}
					
					
					if(paramYear == '2017'){
						html += '<td>-</td>'
					}else{
						if(submitType3 == '1' && auditType3 == '0'){
							html += '<td>已提交</td>'
						}else if(submitType3 == '1' && auditType3 == '1'){
							html += '<td>通过审核</td>'
						}else if(submitType3 == '1' && auditType3 == '2'){
							html += '<td title="'+recommendations3+'" style="color:red;cursor:pointer">未通过审核</td>'
						}else if(submitType3 == '0' && auditType3 == '0'){
							if(paramYear == year && quarter < quarter3){
								html += '<td>-</td>'
							}else{
								html += '<td>未提交</td>'
							}
						}
					}
					
					
					if(submitType4 == '1' && auditType4 == '0'){
						html += '<td>已提交</td>'
					}else if(submitType4 == '1' && auditType4 == '1'){
						html += '<td>通过审核</td>'
					}else if(submitType4 == '1' && auditType4 == '2'){
						html += '<td title="'+recommendations4+'" style="color:red;cursor:pointer">未通过审核</td>'
					}else if(submitType4 == '0' && auditType4 == '0'){
						if(paramYear == year && quarter < quarter4){
							html += '<td>-</td>'
						}else{
							html += '<td>未提交</td>'
						}
					}
					html += '</tr>'
						
						
						
					for(var i =0 ; i<5; i++){
						if(i == 3){
							continue;
						}
						if(i==0){
							//运营情况
							html += '<tr>';
							html += '<th colspan="2">基地运营情况</th>'
						}else if(i==1){
							//服务能力升级情况
							html += '<tr>';
							html += '<th colspan="2">服务能力升级情况</th>'
						}else if(i==2){
							//线上服务佐证	
							html += '<tr>';
							html += '<th colspan="2">上传服务佐证</th>'
						}else if(i==3){
							//线下服务佐证	
							html += '<tr>';
							html += '<th colspan="2">线下服务佐证</th>'
						}else if(i==4){
							//服务情况总结
							html += '<tr>';
							html += '<th colspan="2">服务情况总结</th>'
						}
						
						//第一季度填报
						if(paramYear == "2017"){
							tianbao1 = '<td>-</td>'
						}else{
							if(submitType1 == '1' && auditType1 == '0'){
								if(i == 0){
									tianbao1 = '<td>已完成</td>'
								}else if(i == 1){
									tianbao1 = '<td>已完成</td>'
								}else if(i == 2){
									tianbao1 = '<td>已完成</td>'
								}else if(i == 3){
									tianbao1 = '<td>已完成</td>'
								}else if(i == 4){
									tianbao1 = '<td>已完成</td>'
								}
								//html += '<td>已完成</td>'
							}else if(submitType1 == '1' && auditType1 == '1'){
								if(i == 0){
									tianbao1 = '<td>已完成</td>'
								}else if(i == 1){
									tianbao1 = '<td>已完成</td>'
								}else if(i == 2){
									tianbao1 = '<td>已完成</td>'
								}else if(i == 3){
									tianbao1 = '<td>已完成</td>'
								}else if(i == 4){
									tianbao1 = '<td>已完成</td>'
								}
								//html += '<td>已完成</td>'
							}else if(submitType1 == '1' && auditType1 == '2'){
								if(exemplaryMatrixStatementStatus1 != ""){
									if(i == 0){
										for(var j=0;j<exemplaryMatrixStatementStatus1.length;j++){
											if(exemplaryMatrixStatementStatus1[j].statementName == '运营' && exemplaryMatrixStatementStatus1[j].status== '1'){
												tianbao1 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
												break;
											}else{
												tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
											}
										}
									}else if(i ==1){
										for(var j=0;j<exemplaryMatrixStatementStatus1.length;j++){
											if(exemplaryMatrixStatementStatus1[j].statementName == '服务升级' && exemplaryMatrixStatementStatus1[j].status== '1'){
												tianbao1 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
												break;
											}else{
												tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
											}
										}
									}else if(i ==2){
										for(var j=0;j<exemplaryMatrixStatementStatus1.length;j++){
											if(exemplaryMatrixStatementStatus1[j].statementName == '线上服务' && exemplaryMatrixStatementStatus1[j].status== '1'){
												tianbao1 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
												break;
											}else{
												tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
											}
										}
									}else if(i ==3){
										for(var j=0;j<exemplaryMatrixStatementStatus1.length;j++){
											if(exemplaryMatrixStatementStatus1[j].statementName == '线下服务' && exemplaryMatrixStatementStatus1[j].status== '1'){
												tianbao1 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
												break;
											}else{
												tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
											}
										}
									}else if(i ==4){
										for(var j=0;j<exemplaryMatrixStatementStatus1.length;j++){
											if(exemplaryMatrixStatementStatus1[j].statementName == '情况总结' && exemplaryMatrixStatementStatus1[j].status== '1'){
												tianbao1 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
												break;
											}else{
												tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
											}
										}
									}
								}else{
									if(i == 0){
										tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
									}else if(i == 1){
										tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
									}else if(i == 2){
										tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
									}else if(i == 3){
										tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
									}else if(i == 4){
										tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
									}
								}
							}else if(submitType1 == '0' && auditType1 == '0'){
								if(exemplaryMatrixStatementStatus1 != ""){
									if(i == 0){
										for(var j=0;j<exemplaryMatrixStatementStatus1.length;j++){
											if(exemplaryMatrixStatementStatus1[j].statementName == '运营' && exemplaryMatrixStatementStatus1[j].status== '1'){
												tianbao1 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
												break;
											}else{
												tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
											}
										}
									}else if(i ==1){
										for(var j=0;j<exemplaryMatrixStatementStatus1.length;j++){
											if(exemplaryMatrixStatementStatus1[j].statementName == '服务升级' && exemplaryMatrixStatementStatus1[j].status== '1'){
												tianbao1 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
												break;
											}else{
												tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
											}
										}
									}else if(i ==2){
										for(var j=0;j<exemplaryMatrixStatementStatus1.length;j++){
											if(exemplaryMatrixStatementStatus1[j].statementName == '线上服务' && exemplaryMatrixStatementStatus1[j].status== '1'){
												tianbao1 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
												break;
											}else{
												tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
											}
										}
									}else if(i ==3){
										for(var j=0;j<exemplaryMatrixStatementStatus1.length;j++){
											if(exemplaryMatrixStatementStatus1[j].statementName == '线下服务' && exemplaryMatrixStatementStatus1[j].status== '1'){
												tianbao1 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
												break;
											}else{
												tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
											}
										}
									}else if(i ==4){
										for(var j=0;j<exemplaryMatrixStatementStatus1.length;j++){
											if(exemplaryMatrixStatementStatus1[j].statementName == '情况总结' && exemplaryMatrixStatementStatus1[j].status== '1'){
												tianbao1 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
												break;
											}else{
												tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
											}
										}
									}
								}else{
									if(i == 0){
										tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
									}else if(i == 1){
										tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
									}else if(i == 2){
										tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
									}else if(i == 3){
										tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
									}else if(i == 4){
										tianbao1 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
									}
									//html += '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter1+'">填报</a></td>'
								}
							}
						}
						
						
						//第二季度填报
						if(paramYear == "2017"){
							tianbao2 = '<td>-</td>'
						}else{
							if(paramYear == year && quarter < quarter2){
								if(i == 0){
									tianbao2 = '<td>未开始</td>'
								}else if(i == 1){
									tianbao2 = '<td>未开始</td>'
								}else if(i == 2){
									tianbao2 = '<td>未开始</td>'
								}else if(i == 3){
									tianbao2 = '<td>未开始</td>'
								}else if(i == 4){
									tianbao2 = '<td>未开始</td>'
								}
							}else{
								if(submitType2 == '1' && auditType2 == '0'){
									if(i == 0){
										tianbao2 = '<td>已完成</td>'
									}else if(i == 1){
										tianbao2 = '<td>已完成</td>'
									}else if(i == 2){
										tianbao2 = '<td>已完成</td>'
									}else if(i == 3){
										tianbao2 = '<td>已完成</td>'
									}else if(i == 4){
										tianbao2 = '<td>已完成</td>'
									}
								}else if(submitType2 == '1' && auditType2 == '1'){
									if(i == 0){
										tianbao2 = '<td>已完成</td>'
									}else if(i == 1){
										tianbao2 = '<td>已完成</td>'
									}else if(i == 2){
										tianbao2 = '<td>已完成</td>'
									}else if(i == 3){
										tianbao2 = '<td>已完成</td>'
									}else if(i == 4){
										tianbao2 = '<td>已完成</td>'
									}
								}else if(submitType2 == '1' && auditType2 == '2'){
									if(exemplaryMatrixStatementStatus2 != ""){
										if(i == 0){
											for(var j=0;j<exemplaryMatrixStatementStatus2.length;j++){
												if(exemplaryMatrixStatementStatus2[j].statementName == '运营' && exemplaryMatrixStatementStatus2[j].status== '1'){
													tianbao2 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
													break;
												}else{
													tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
												}
											}
										}else if(i ==1){
											for(var j=0;j<exemplaryMatrixStatementStatus2.length;j++){
												if(exemplaryMatrixStatementStatus2[j].statementName == '服务升级' && exemplaryMatrixStatementStatus2[j].status== '1'){
													tianbao2 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
													break;
												}else{
													tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
												}
											}
										}else if(i ==2){
											for(var j=0;j<exemplaryMatrixStatementStatus2.length;j++){
												if(exemplaryMatrixStatementStatus2[j].statementName == '线上服务' && exemplaryMatrixStatementStatus2[j].status== '1'){
													tianbao2 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
													break;
												}else{
													tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
												}
											}
										}else if(i ==3){
											for(var j=0;j<exemplaryMatrixStatementStatus2.length;j++){
												if(exemplaryMatrixStatementStatus2[j].statementName == '线下服务' && exemplaryMatrixStatementStatus2[j].status== '1'){
													tianbao2 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
													break;
												}else{
													tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
												}
											}
										}else if(i ==4){
											for(var j=0;j<exemplaryMatrixStatementStatus2.length;j++){
												if(exemplaryMatrixStatementStatus2[j].statementName == '情况总结' && exemplaryMatrixStatementStatus2[j].status== '1'){
													tianbao2 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
													break;
												}else{
													tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
												}
											}
										}
									}else{
										if(i == 0){
											tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
										}else if(i == 1){
											tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
										}else if(i == 2){
											tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
										}else if(i == 3){
											tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
										}else if(i == 4){
											tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
										}
									}
								}else if(submitType2 == '0' && auditType2 == '0'){
									if(exemplaryMatrixStatementStatus2 != ""){
										if(i == 0){
											for(var j=0;j<exemplaryMatrixStatementStatus2.length;j++){
												if(exemplaryMatrixStatementStatus2[j].statementName == '运营' && exemplaryMatrixStatementStatus2[j].status== '1'){
													tianbao2 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
													break;
												}else{
													tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
												}
											}
										}else if(i ==1){
											for(var j=0;j<exemplaryMatrixStatementStatus2.length;j++){
												if(exemplaryMatrixStatementStatus2[j].statementName == '服务升级' && exemplaryMatrixStatementStatus2[j].status== '1'){
													tianbao2 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
													break;
												}else{
													tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
												}
											}
										}else if(i ==2){
											for(var j=0;j<exemplaryMatrixStatementStatus2.length;j++){
												if(exemplaryMatrixStatementStatus2[j].statementName == '线上服务' && exemplaryMatrixStatementStatus2[j].status== '1'){
													tianbao2 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
													break;
												}else{
													tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
												}
											}
										}else if(i ==3){
											for(var j=0;j<exemplaryMatrixStatementStatus2.length;j++){
												if(exemplaryMatrixStatementStatus2[j].statementName == '线下服务' && exemplaryMatrixStatementStatus2[j].status== '1'){
													tianbao2 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
													break;
												}else{
													tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
												}
											}
										}else if(i ==4){
											for(var j=0;j<exemplaryMatrixStatementStatus2.length;j++){
												if(exemplaryMatrixStatementStatus2[j].statementName == '情况总结' && exemplaryMatrixStatementStatus2[j].status== '1'){
													tianbao2 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
													break;
												}else{
													tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
												}
											}
										}
									}else{
										if(i == 0){
											tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
										}else if(i == 1){
											tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
										}else if(i == 2){
											tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
										}else if(i == 3){
											tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
										}else if(i == 4){
											tianbao2 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter2+'">填报</a></td>'
										}
									}
								}
							}
						}
						
						
						//第三季度填报
						if(paramYear == "2017"){
							tianbao3 = '<td>-</td>'
						}else{
							if(paramYear == year && quarter < quarter3){
								if(i == 0){
									tianbao3 = '<td>未开始</td>'
								}else if(i == 1){
									tianbao3 = '<td>未开始</td>'
								}else if(i == 2){
									tianbao3 = '<td>未开始</td>'
								}else if(i == 3){
									tianbao3 = '<td>未开始</td>'
								}else if(i == 4){
									tianbao3 = '<td>未开始</td>'
								}
							}else{
								if(submitType3 == '1' && auditType3 == '0'){
									if(i == 0){
										tianbao3 = '<td>已完成</td>'
									}else if(i == 1){
										tianbao3 = '<td>已完成</td>'
									}else if(i == 2){
										tianbao3 = '<td>已完成</td>'
									}else if(i == 3){
										tianbao3 = '<td>已完成</td>'
									}else if(i == 4){
										tianbao3 = '<td>已完成</td>'
									}
								}else if(submitType3 == '1' && auditType3 == '1'){
									if(i == 0){
										tianbao3 = '<td>已完成</td>'
									}else if(i == 1){
										tianbao3 = '<td>已完成</td>'
									}else if(i == 2){
										tianbao3 = '<td>已完成</td>'
									}else if(i == 3){
										tianbao3 = '<td>已完成</td>'
									}else if(i == 4){
										tianbao3 = '<td>已完成</td>'
									}
								}else if(submitType3 == '1' && auditType3 == '2'){
									if(exemplaryMatrixStatementStatus3 != ""){
										if(i == 0){
											for(var j=0;j<exemplaryMatrixStatementStatus3.length;j++){
												if(exemplaryMatrixStatementStatus3[j].statementName == '运营' && exemplaryMatrixStatementStatus3[j].status== '1'){
													tianbao3 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
													break;
												}else{
													tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
												}
											}
										}else if(i ==1){
											for(var j=0;j<exemplaryMatrixStatementStatus3.length;j++){
												if(exemplaryMatrixStatementStatus3[j].statementName == '服务升级' && exemplaryMatrixStatementStatus3[j].status== '1'){
													tianbao3 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
													break;
												}else{
													tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
												}
											}
										}else if(i ==2){
											for(var j=0;j<exemplaryMatrixStatementStatus3.length;j++){
												if(exemplaryMatrixStatementStatus3[j].statementName == '线上服务' && exemplaryMatrixStatementStatus3[j].status== '1'){
													tianbao3 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
													break;
												}else{
													tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
												}
											}
										}else if(i ==3){
											for(var j=0;j<exemplaryMatrixStatementStatus3.length;j++){
												if(exemplaryMatrixStatementStatus3[j].statementName == '线下服务' && exemplaryMatrixStatementStatus3[j].status== '1'){
													tianbao3 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
													break;
												}else{
													tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
												}
											}
										}else if(i ==4){
											for(var j=0;j<exemplaryMatrixStatementStatus3.length;j++){
												if(exemplaryMatrixStatementStatus3[j].statementName == '情况总结' && exemplaryMatrixStatementStatus3[j].status== '1'){
													tianbao3 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
													break;
												}else{
													tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
												}
											}
										}
									}else{
										if(i == 0){
											tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
										}else if(i == 1){
											tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
										}else if(i == 2){
											tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
										}else if(i == 3){
											tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
										}else if(i == 4){
											tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
										}
									}
								}else if(submitType3 == '0' && auditType3 == '0'){
									if(exemplaryMatrixStatementStatus3 != ""){
										if(i == 0){
											for(var j=0;j<exemplaryMatrixStatementStatus3.length;j++){
												if(exemplaryMatrixStatementStatus3[j].statementName == '运营' && exemplaryMatrixStatementStatus3[j].status== '1'){
													tianbao3 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
													break;
												}else{
													tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
												}
											}
										}else if(i ==1){
											for(var j=0;j<exemplaryMatrixStatementStatus3.length;j++){
												if(exemplaryMatrixStatementStatus3[j].statementName == '服务升级' && exemplaryMatrixStatementStatus3[j].status== '1'){
													tianbao3 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
													break;
												}else{
													tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
												}
											}
										}else if(i ==2){
											for(var j=0;j<exemplaryMatrixStatementStatus3.length;j++){
												if(exemplaryMatrixStatementStatus3[j].statementName == '线上服务' && exemplaryMatrixStatementStatus3[j].status== '1'){
													tianbao3 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
													break;
												}else{
													tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
												}
											}
										}else if(i ==3){
											for(var j=0;j<exemplaryMatrixStatementStatus3.length;j++){
												if(exemplaryMatrixStatementStatus3[j].statementName == '线下服务' && exemplaryMatrixStatementStatus3[j].status== '1'){
													tianbao3 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
													break;
												}else{
													tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
												}
											}
										}else if(i ==4){
											for(var j=0;j<exemplaryMatrixStatementStatus3.length;j++){
												if(exemplaryMatrixStatementStatus3[j].statementName == '情况总结' && exemplaryMatrixStatementStatus3[j].status== '1'){
													tianbao3 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
													break;
												}else{
													tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
												}
											}
										}
									}else{
										if(i == 0){
											tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
										}else if(i == 1){
											tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
										}else if(i == 2){
											tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
										}else if(i == 3){
											tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
										}else if(i == 4){
											tianbao3 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter3+'">填报</a></td>'
										}
									}
								}
							}
						}
						
						
						//第四季度填报
						if(paramYear == year && quarter < quarter4){
							if(i == 0){
								tianbao4 = '<td>未开始</td>'
							}else if(i == 1){
								tianbao4 = '<td>未开始</td>'
							}else if(i == 2){
								tianbao4 = '<td>未开始</td>'
							}else if(i == 3){
								tianbao4 = '<td>未开始</td>'
							}else if(i == 4){
								tianbao4 = '<td>未开始</td>'
							}
						}else{
							if(submitType4 == '1' && auditType4 == '0'){
								if(i == 0){
									tianbao4 = '<td>已完成</td>'
								}else if(i == 1){
									tianbao4 = '<td>已完成</td>'
								}else if(i == 2){
									tianbao4 = '<td>已完成</td>'
								}else if(i == 3){
									tianbao4 = '<td>已完成</td>'
								}else if(i == 4){
									tianbao4 = '<td>已完成</td>'
								}
							}else if(submitType4 == '1' && auditType4 == '1'){
								if(i == 0){
									tianbao4 = '<td>已完成</td>'
								}else if(i == 1){
									tianbao4 = '<td>已完成</td>'
								}else if(i == 2){
									tianbao4 = '<td>已完成</td>'
								}else if(i == 3){
									tianbao4 = '<td>已完成</td>'
								}else if(i == 4){
									tianbao4 = '<td>已完成</td>'
								}
							}else if(submitType4 == '1' && auditType4 == '2'){
								if(exemplaryMatrixStatementStatus4 != ""){
									if(i == 0){
										for(var j=0;j<exemplaryMatrixStatementStatus4.length;j++){
											if(exemplaryMatrixStatementStatus4[j].statementName == '运营' && exemplaryMatrixStatementStatus4[j].status== '1'){
												tianbao4 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
												break;
											}else{
												tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
											}
										}
									}else if(i ==1){
										for(var j=0;j<exemplaryMatrixStatementStatus4.length;j++){
											if(exemplaryMatrixStatementStatus4[j].statementName == '服务升级' && exemplaryMatrixStatementStatus4[j].status== '1'){
												tianbao4 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
												break;
											}else{
												tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
											}
										}
									}else if(i ==2){
										for(var j=0;j<exemplaryMatrixStatementStatus4.length;j++){
											if(exemplaryMatrixStatementStatus4[j].statementName == '线上服务' && exemplaryMatrixStatementStatus4[j].status== '1'){
												tianbao4 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
												break;
											}else{
												tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
											}
										}
									}else if(i ==3){
										for(var j=0;j<exemplaryMatrixStatementStatus4.length;j++){
											if(exemplaryMatrixStatementStatus4[j].statementName == '线下服务' && exemplaryMatrixStatementStatus4[j].status== '1'){
												tianbao4 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
												break;
											}else{
												tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
											}
										}
									}else if(i ==4){
										for(var j=0;j<exemplaryMatrixStatementStatus4.length;j++){
											if(exemplaryMatrixStatementStatus4[j].statementName == '情况总结' && exemplaryMatrixStatementStatus4[j].status== '1'){
												tianbao4 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
												break;
											}else{
												tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
											}
										}
									}
								}else{
									if(i == 0){
										tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
									}else if(i == 1){
										tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
									}else if(i == 2){
										tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
									}else if(i == 3){
										tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
									}else if(i == 4){
										tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
									}
								}
							}else if(submitType4 == '0' && auditType4 == '0'){
								if(exemplaryMatrixStatementStatus4 != ""){
									if(i == 0){
										for(var j=0;j<exemplaryMatrixStatementStatus4.length;j++){
											if(exemplaryMatrixStatementStatus4[j].statementName == '运营' && exemplaryMatrixStatementStatus4[j].status== '1'){
												tianbao4 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
												break;
											}else{
												tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
											}
										}
									}else if(i ==1){
										for(var j=0;j<exemplaryMatrixStatementStatus4.length;j++){
											if(exemplaryMatrixStatementStatus4[j].statementName == '服务升级' && exemplaryMatrixStatementStatus4[j].status== '1'){
												tianbao4 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
												break;
											}else{
												tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
											}
										}
									}else if(i ==2){
										for(var j=0;j<exemplaryMatrixStatementStatus4.length;j++){
											if(exemplaryMatrixStatementStatus4[j].statementName == '线上服务' && exemplaryMatrixStatementStatus4[j].status== '1'){
												tianbao4 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
												break;
											}else{
												tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
											}
										}
									}else if(i ==3){
										for(var j=0;j<exemplaryMatrixStatementStatus4.length;j++){
											if(exemplaryMatrixStatementStatus4[j].statementName == '线下服务' && exemplaryMatrixStatementStatus4[j].status== '1'){
												tianbao4 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
												break;
											}else{
												tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
											}
										}
									}else if(i ==4){
										for(var j=0;j<exemplaryMatrixStatementStatus4.length;j++){
											if(exemplaryMatrixStatementStatus4[j].statementName == '情况总结' && exemplaryMatrixStatementStatus4[j].status== '1'){
												tianbao4 = '<td><a class="color00b971 tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
												break;
											}else{
												tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
											}
										}
									}
								}else{
									if(i == 0){
										tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
									}else if(i == 1){
										tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
									}else if(i == 2){
										tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
									}else if(i == 3){
										tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
									}else if(i == 4){
										tianbao4 = '<td><a class="color_blue tianbao" href="javascript:;" name="'+i+','+quarter4+'">填报</a></td>'
									}
								}
							}
						}
						
						html += tianbao1;
						html += tianbao2;
						html += tianbao3;
						html += tianbao4;
						html += '</tr>'
					}
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					
					html += '<tr class="table-more-prev">'
					html += '<td colspan="6" style="padding: 0;border:0">'
					html += '<table class="table-layout4 td-h-30" style="width:1018px;margin-top: -1px;">'
					html += '<tr>'
					html += '<th colspan="2" width="195">总计</th>'
					if(paramYear == "2017"){
						html += '<td>-</td>'
					}else{
						html += '<td name="'+$("#year").val()+',1" class="gotoAllServiceDataDetail" style="color:blue;cursor:pointer">'+count1+'</td>'
					}
					if(paramYear == "2017"){
						html += '<td>-</td>'
					}else{
						if(paramYear == year && quarter < quarter2){
							html += '<td>-</td>'
						}else{
							html += '<td name="'+$("#year").val()+',2" class="gotoAllServiceDataDetail" style="color:blue;cursor:pointer">'+count2+'</td>'
						}
					}
					
					if(paramYear == "2017"){
						html += '<td>-</td>'
					}else{
						if(paramYear == year && quarter < quarter3){
							html += '<td>-</td>'
						}else{
							html += '<td name="'+$("#year").val()+',3" class="gotoAllServiceDataDetail" style="color:blue;cursor:pointer">'+count3+'</td>'
						}
					}
					
					if(paramYear == year && quarter < quarter4){
						html += '<td>-</td>'
					}else{
						html += '<td name="'+$("#year").val()+',4" class="gotoAllServiceDataDetail" style="color:blue;cursor:pointer">'+count4+'</td>'
					}
					html += '</tr>'
					for(var j=0 ; j<exemplaryMatrixStatementManageViews1.length;j++){
						if(j == 0){
							html += '<tr>'
							html += '<th rowspan="2">信息服务</th>'
						}else if(j == 1){
							html += '<tr>'
							html += '<th rowspan="2">创业辅导</th>'
						}else if(j == 2){
							html += '<tr>'
							html += '<th rowspan="2">创新支持</th>'
						}else if(j == 3){
							html += '<tr>'
							html += '<th rowspan="2">人员培训</th>'
						}else if(j == 4){
							html += '<tr>'
							html += '<th rowspan="2">市场营销</th>'
						}else if(j == 5){
							html += '<tr>'
							html += '<th rowspan="2">投融资服务</th>'
						}else if(j == 6){
							html += '<tr>'
							html += '<th rowspan="2">管理咨询</th>'
						}else if(j == 7){
							html += '<tr>'
							html += '<th rowspan="2">专业服务</th>'
						}
						html += '<th>线上</th>'
						if(paramYear == "2017"){
							html += '<td>-</td>'
						}else{
							html += '<td name="'+j+','+$("#year").val()+',1,online," class="gotoServiceDataDetail" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews1[j].onlineCount+'</td>'
						}
						
						if(paramYear == "2017"){
							html += '<td>-</td>'
						}else{
							if(paramYear == year && quarter < quarter2){
								html += '<td>-</td>'
							}else{
								html += '<td name="'+j+','+$("#year").val()+',2,online," class="gotoServiceDataDetail" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews2[j].onlineCount+'</td>'
							}
						}
						
						if(paramYear == "2017"){
							html += '<td>-</td>'
						}else{
							if(paramYear == year && quarter < quarter3){
								html += '<td>-</td>'
							}else{
								html += '<td name="'+j+','+$("#year").val()+',3,online," class="gotoServiceDataDetail" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews3[j].onlineCount+'</td>'
							}
						}
						
						
						if(paramYear == year && quarter < quarter4){
							html += '<td>-</td>'
						}else{
							html += '<td name="'+j+','+$("#year").val()+',4,online," class="gotoServiceDataDetail" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews4[j].onlineCount+'</td>'
						}
						
						
						
						html += '</tr>'
						html += '<tr>'
						html += '<th>线下</th>'
						if(paramYear == "2017"){
							html += '<td>-</td>'
						}else{
							html += '<td name="'+j+','+$("#year").val()+',1,offline," class="gotoServiceDataDetail" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews1[j].offlineCount+'</td>'
						}
						
						if(paramYear == "2017"){
							html += '<td>-</td>'
						}else{
							if(paramYear == year && quarter < quarter2){
								html += '<td>-</td>'
							}else{
								html += '<td name="'+j+','+$("#year").val()+',2,offline," class="gotoServiceDataDetail" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews2[j].offlineCount+'</td>'
							}
						}
						
						if(paramYear == "2017"){
							html += '<td>-</td>'
						}else{
							if(paramYear == year && quarter < quarter3){
								html += '<td>-</td>'
							}else{
								html += '<td name="'+j+','+$("#year").val()+',3,offline," class="gotoServiceDataDetail" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews3[j].offlineCount+'</td>'
							}
						}
						
						if(paramYear == year && quarter < quarter4){
							html += '<td>-</td>'
						}else{
							html += '<td name="'+j+','+$("#year").val()+',4,offline," class="gotoServiceDataDetail" style="color:blue;cursor:pointer">'+exemplaryMatrixStatementManageViews4[j].offlineCount+'</td>'
						}
						
						html += '</tr>'
					}
				}
				html += '</table>'
				html += '</td>'
				html += '</tr>'
				html += '<tr class="table-more">'
				html += '<td colspan="6" class="bodl0"><i></i><span>显示全部</span></td>'
				html += '</tr>'
				$("#statementListHead").append(html);
			}
		}
	})
}

