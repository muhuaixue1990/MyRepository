/**
 * 示范基地前台详情页
 */
//获得当前工程路径方法

var keyid=window.location.href.split("?")[1].split("&")[0].split("=")[1];

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
	getExemplaryMatrixDetailsForFront();
	getExemplaryMatrixNewsForFront();
	getExemplaryMatrixServiceItemsForFront();
	getExemplaryMatrixActivityAdvanceForFront();
	getExemplaryMatrixActivityShowForFront();
	getExemplaryMatrixSettledEnterpriseForFront();
	$('.sfjd').kxbdSuperMarquee({
        distance:837,
        time:4,
        direction:'left',
        btnGo:{left:'.sfjd-box-layout4 .shifan-goL-layout4',right:'.sfjd-box-layout4 .shifan-goR-layout4'}
    });
    $('.sfjd_active_boxs').kxbdSuperMarquee({
        distance:832,
        time:4,
        direction:'left',
        btnGo:{left:'.actives-layout4 .shifan-goL-layout4',right:'.actives-layout4 .shifan-goR-layout4'}
    });
    $('.sfjd_active_shows').kxbdSuperMarquee({
        distance:1250,
        time:4,
        direction:'up',
        btnGo:{up:'.sfjd_active_shows-box .shifan-goU-layout4',down:'.sfjd_active_shows-box .shifan-goD-layout4'}
    });
    $(".sfjd_jd-text").mCustomScrollbar({
        theme: "dark",
        scrollbarPosition:"outside"
    });
})


function getExemplaryMatrixDetailsForFront(){
	var params;
	params={
			"params.keyid":keyid,
		   }
	var url = getUrl(1);
	$.ajax({
		type : "post",
		url : url,
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : params,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			if(data.result==1){
				var obj = data.data.data[0];
				$("#matrixName").empty().append(obj.matrixName);
				$("#contacter").empty().append("联系人："+obj.contacter);
				$("#contactPhone").empty().append("电话："+obj.contactPhone);
				$("#registeredAddress").empty().append(obj.matrixAddress);
				$("#registeredAddress").attr('title',obj.matrixAddress);
				$("#enterpriseAppearancePic").attr('src',obj.enterpriseAppearancePic);
				$("#enterpriseProfile").empty().append(obj.enterpriseProfile);
			}
		},
		error:function(){
			alert("查询失败");
		}	
	});
}


function getExemplaryMatrixNewsForFront(){
	var params;
	params={
			"params.keyid":keyid,
		   }
	var url = getUrl(2);
	$.ajax({
		type : "post",
		url : url,
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : params,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			if(data.result==1){
				var html=getHtml(2);
				var arr = [];   
				$.each(data.data.data, function(index, o) {
			        //这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
					o.src = rootPath+"/page/desc.jsp?id="+o.id;
					o.publishTime = o.publishTime.substring(0,10);
			        arr.push(formatTemplate(o, html)); 		
			    }); 
				if(data.data.data.length >= 5){
					var newsmore = rootPath+"/page/noticeThreeLevelList.jsp?type=searchByCustomUserid_3_"+data.data.data[0].publisherId;//参数用下划线间隔第一个是标识按id查询第二个是新闻类型第三个是id号
					$('#newsmore').attr("href",newsmore);
				}else{
					$('#newsmore').empty();
				}
				$('#newsList').append(arr.join(''));
			}
		},
		error:function(){
			alert("查询失败");
		}	
	});
	
	
}



function getExemplaryMatrixServiceItemsForFront(){
	var params;
	params={
			"param.page":1,
			"param.pageSize":20,
			"param.isVerify":1,
			"param.putaway":1,
			"param.userCode":keyid,
			"param.keyword":"",
			"param.sortByScore":1,
			"param.sortByServiceTime":0,
		   }
	
	var url = getUrl(3);
	$.ajax({
		type : "post",
		url : url,
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : params,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
//			if(data.result==1){
				var html=getHtml(3);
				var arr = [];   
				$.each(data.data.data, function(index, o) {
//	        		if(serviceType=="105000"){
//	        			o.isNew="";
//	        		}
//	        		else{        			
	        			o.create_stamp=o.create_stamp.split("T")[0];
	        			var date=new Date();
	        			var year=date.getFullYear();
	        			var month=date.getMonth()+1;
	        			var day=date.getDate();
	        			if(o.create_stamp.split("-")[0]==year&&o.create_stamp.split("-")[1]==month&&o.create_stamp.split("-")[2]==day){
	        				o.isNew='<img src="/tjsmesp/page/img/isNew.gif" style="height:24px;width:24px;display:inline-block">'
	        			}
	        			else{
	        				o.isNew="";
	        			}
//	        		}
	        		if(typeof(o.transaction_count)=="undefined"){o.transaction_count=0}
	        		if(o.item_type=='1'){
	        			o.item_type="<i class='gy_icon'></i>";
	        		}
	        		else{
	        			o.item_type="";
	        		}
	            	//解析好评率
	        		var imgElementYes="<i class=\"fill\"></i>";
	        		var imgElementNo=" <i class=\"empty\"></i>";
	            	var summaryScore=Math.floor(o.score);
	            	o.summary_score="";
	            	for(var a=1;a<=5;a++){
	            		if(a<=summaryScore){
	            			o.summary_score+=imgElementYes;
	            		}
	            		else{
	            			o.summary_score+=imgElementNo;
	            		}
	            	}
	            	//解析地区
	            	var disArr=o.service_district.split(",")
	            	o.service_district="";
	            	for(var b=0;b<disArr.length;b++){
	            		
	            		if(disArr[b]=="120000"){
	            			o.service_district="全市";
	            			break;
	            		}
	            		else if(disArr[b]=="120101")
	            			o.service_district+="和平区";
	            		else if(disArr[b]=="120103")
	            			o.service_district+="河西区";
	            		else if(disArr[b]=="120102")
	            			o.service_district+="河东区";
	            		else if(disArr[b]=="120106")
	            			o.service_district+="红桥区";
	            		else if(disArr[b]=="120113")
	            			o.service_district+="北辰区";
	            		else if(disArr[b]=="120104")
	            			o.service_district+="南开区";
	            		else if(disArr[b]=="120105")
	            			o.service_district+="河北区";
	            		else if(disArr[b]=="120111")
	            			o.service_district+="西青区";
	            		else if(disArr[b]=="120110")
	            			o.service_district+="东丽区";
	            		else if(disArr[b]=="120112")
	            			o.service_district+="津南区";
	            		else if(disArr[b]=="120114")
	            			o.service_district+="武清区";
	            		else if(disArr[b]=="120225")
	            			o.service_district+="蓟州区";
	            		else if(disArr[b]=="120116")
	            			o.service_district+="滨海新区";
	            		else if(disArr[b]=="120221")
	            			o.service_district+="宁河区";
	            		else if(disArr[b]=="120115")
	            			o.service_district+="宝坻区";
	            		else if(disArr[b]=="120223")
	            			o.service_district+="静海区";
	            		else if(disArr[b]=="120110")
	            			o.service_district+="东丽区";
	            	}
	            	 
	            	if(typeof(o.is_charge)=="undefined"||o.is_charge==1){
	            		if(typeof(o.unit_price)=="undefined"){
	                		o.unit_price = "";
	                		o.unit = "";
	                	}
	            	}else{
	            		o.unit_price = "不收费";
	            	}
	            	if(typeof(o.charge_type)=="undefined"||o.charge_type==3){
	            		o.charge_type = "标准收费";
	            	}else if(o.charge_type==1){
	            		o.charge_type = "面议";
	            	}else if(o.charge_type==2){
	            		o.charge_type = "电联";
	            	}
	            	//轮播
	            	if(index%6 == 0){
	            		o.start = "<div class=\"sfjd_service\">";
	            	}else{
	            		o.start = "";
	            	}
	            	if(index%6 == 5){
	            		o.end = "</div>";
	            	}else if(index == data.data.data.length-1){
	            		o.end = "</div>";
	            	}else{
	            		o.end = "";
	            	}
	            	arr.push(formatTemplate(o, html));
				}); 
				$('#serviceItems').append(arr.join(''));
				
//			}
		},
		error:function(){
			alert("查询失败");
		}	
	});
	
	
}

//活动预告
function getExemplaryMatrixActivityAdvanceForFront(){
	$('#ActivityAdvance').empty();
	var params;
	params={
			'params.userCode':keyid,
			'params.currentPage':1,
		  	'params.pageSize':100,
		  	'params.userCodeApp':userCodeApp,}
	var url = getUrl(4);
	$.ajax({
		type : "post",
		url : url,
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : params,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
//			if(data.result==1){
				var html=getHtml(4);
				var arr = [];   
				$.each(data.noticeOfActivityList, function(index, o) {
					o.activityStartDate = o.activityStartDate.substring(0,10);
					o.activityEndDate = o.activityEndDate.substring(0,10);
					o.detialsUrl = rootPath + "/page/jsp/activeItems/activityItemsDetial_new.jsp?activityType=1&activityItemId="+o.id;
					if(typeof(o.unitPrice)=="undefined"){
						o.unitPrice = "0";
					}
					if(o.canApply == "1"){
						if(o.haveApply == "1"){
							o.applyStateStr = "已报名";
							o.applyState = "0";
							o.applytype = "0";
							o.btn = "btn_status_01";
						}else if(o.haveApply == "0"){
							if(o.applyFlag == "1"){
								//添加验证，只能个人用户报名
								if(sessionUserType == "0" && sessionType == "2"){
									o.applyStateStr = "报名";
									o.applyState = "1";
									o.applytype = "1";
									o.btn = "btn_status_02";
								}else if(sessionUserType == "0" && (sessionType == "0" || sessionType == "1")){
									//机构和企业报名入口
									o.applyStateStr = "报名";
									o.applyState = "1";
									o.applytype = "2";
									o.btn = "btn_status_02";
								}else{
									o.applyStateStr = "";
								}
							}else if(o.applyFlag == "0"){
								o.applyStateStr = "";
							}
						}
					}else if(o.canApply == "0"){
						o.applyStateStr = "预热中";
						o.applyState = "0";
						o.applytype = "0";
						o.btn = "btn_status_01";
					}
					//轮播
	            	if(index%4 == 0){
	            		o.start = "<div class=\"sfjd_active_box\"  >";
	            	}else{
	            		o.start = "";
	            	}
	            	if(index%4 == 3){
	            		o.end = "</div>";
	            	}else if(index == data.noticeOfActivityList.length-1){
	            		o.end = "</div>";
	            	}else{
	            		o.end = "";
	            	}
	            	arr.push(formatTemplate(o, html));
				}); 
				$('#ActivityAdvance').append(arr.join(''));
//			}
		},
		error:function(){
			alert("查询失败");
		}	
	});
	
}

//活动展示
function getExemplaryMatrixActivityShowForFront(){
	$('#ActivityShow').empty();
	var params;
	params={
			'params.userCode':keyid,
			'params.currentPage':1,
		  	'params.pageSize':100,
		  	'params.userCodeApp':userCodeApp,}
	var url = getUrl(5);
	$.ajax({
		type : "post",
		url : url,
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : params,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
//			if(data.result==1){
				var html=getHtml(5);
				var arr = [];   
				$.each(data.activityShowList, function(index, o) {
					o.detialsUrl = rootPath + "/page/jsp/activeItems/activityItemsDetial_new.jsp?activityType=2&activityItemId="+o.id;
					if(o.haveLogin == "1"){
						//已经登录状态
						if(o.haveApply == "1" && o.haveScore == "0"){
							o.applyState = "1";
							o.evaluateStyle = "btn_status_03";
							o.evaluateStr = "去评价";
							//已经报名且没有评分，可以评分
						}else if(o.haveApply == "0" || (o.haveApply == "1"&& o.haveScore == "1")){
							o.applyState = "0";
							o.evaluateStyle = "btn_status_01";
							o.evaluateStr = "去评价";
							//没报名，或者报名已经评分的不能再评分
						}
					}else if(o.haveLogin == "0"){
						o.applyState = "0";
						o.evaluateStyle = "";
						o.evaluateStr = "";
						//没登录状态
					}
					//轮播
	            	if(index%5 == 0){
	            		o.start = "<div class=\"sfjd_active_show\">";
	            	}else{
	            		o.start = "";
	            	}
	            	if(index%5 == 4){
	            		o.end = "</div>";
	            	}else if(index == data.activityShowList.length-1){
	            		o.end = "</div>";
	            	}else{
	            		o.end = "";
	            	}
	            	arr.push(formatTemplate(o, html));
				}); 
				$('#ActivityShow').append(arr.join(''));
//			}
		},
		error:function(){
			alert("查询失败");
		}	
	});
	
}


function getExemplaryMatrixSettledEnterpriseForFront(){
	var params;
	params={
			"params.keyid":keyid,
		   }
	var url = getUrl(6);
	$.ajax({
		type : "post",
		url : url,
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : params,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			if(data.result==1){
				var html=getHtml(6);
				var arr = [];  
				var picturePath = data.data.picturePath;
				$.each(data.data.data, function(index, o) {
			        //这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法. 
					o.pictureUrl = picturePath+o.picture;
			        arr.push(formatTemplate(o, html)); 		
			    }); 
				$('#rzqyList').append(arr.join(''));
			}
		},
		error:function(){
			alert("查询失败");
		}	
	});
	
	
}

//活动报名
function activityAdvanceBtn1(applyState,applytype,id,userCode){
	event.preventDefault();
	if(applyState == 0){
		return;
	}else if(applyState == 1){
		if(applytype == 1){//个人报名
			if(userCodeApp == ""){
				alert("请先登录！");
			}else{
				applyActivity(id,userCode);
			}
		}else if(applytype == 2){//机构企业报名
			var index = layer.open({
				title:"参加活动名单",
				skin: 'zyPrint',
				type:1,
				content: $(".nameBox"),
				area: ['500px','520px'],
				btn:['确定','取消'],
				btn1: function(index, layero){
					applyActivityForEnter(id,userCode,index);
				},
				success:function(){
					/*$(".demo").eq(0).find(".tip_close2").addClass("hide")*/
					$("body").on("click",".addnameul",function(){
						var demo_clone = $(".demo").clone().last();
						$(".nameBox").append(demo_clone);
						var n = $(".nameBox ul").length;
						for(var i=1;i<=n;i++){
				        	$(".nameBox li.lineH36>span").last().text(i);
				        }
						/*$(".nameBox ul:first-child li:last-child").hide();*/
						$(".nameBox ul:last-child input[name='applyPersonName']").val("");
						$(".nameBox ul:last-child input[name='applyPersonPhone']").val("");
						$(".demo .tip_close2").removeClass("hide")
						$(".demo").eq(0).find(".tip_close2").addClass("hide")
					})
					$("body").on("click",".tip_close2",function(){
						$(this).parents('ul').remove();
						var n = $(".nameBox ul").length;
						for(var i=1;i<=n;i++){
							$(".nameBox li.lineH36>span:eq("+(i-1)+")").text(i);
				        }
					})
					
				}
			})
		
		}
	}
	
}

/**
 * 活动报名（企业，机构）
 */
function applyActivityForEnter(activityId,activityUserCode,index){
	//设置参数
	$(".activityIdInput").each(function(){
		$(this).val(activityId);
	})
	$(".activityUserCodeInput").each(function(){
		$(this).val(activityUserCode);
	})
	$(".userCodeAppInput").each(function(){
		$(this).val(userCodeApp);
	})
	
	if(userCodeApp == ""){
		alert("请先登录！");
	}else{
		if(checkApplyInfo()){
			$.ajax({
				type: "post",
				url: rootPath+"/activityTransaction/applyActivityForEnter.action",
				async : false,
				timeout : 30000,
				dataType:'json',
				data: $("#applyForm").serialize(),
				beforeSend: function(XMLHttpRequest){},
				success: function(data, textStatus){
					var status = data['status'];
					if(status == "1"){
						alert("报名成功！");
						layer.close(index);
						getExemplaryMatrixActivityAdvanceForFront();
					}else if(status == "-1"){
						alert("报名人数超过活动上限人数，请重新填写！");
					}else if(status == "0"){
						alert("报名失败！");
					}
				}
			})
		}
	}

}

/**
 * 报名活动(个人)
 */
function applyActivity(activityId,activityUserCode){
	if(userCodeApp == ""){
		alert("请先登录！");
	}else{
		var params = {"activityTransactions.activityItemId":activityId,
				"activityTransactions.userCode":activityUserCode,
				"activityTransactions.userCodeApp":userCodeApp,
				"activityTransactions.personName":sessionName,
				"activityTransactions.phone":sessionMobilePhone,
				"activityTransactions.parendCode":sessionParentCode,
				"activityTransactions.userLevel":sessionUserLevel};
		$.ajax({
			type: "post",
			url: rootPath+"/activityTransaction/applyActivity.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: params,
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "1"){
					alert("报名成功！");
					getExemplaryMatrixActivityAdvanceForFront();
				}else if(status == "0"){
					alert("报名失败！");
				}
			}
		})
	}
}


/**
 * 活动评价
 */
function activityShowBtn1(applyState,id){
	event.preventDefault();
	if(applyState == 0){
//		alert("不能评价");
	}else if(applyState == 1){
		if(userCodeApp == ""){
			alert("请先登录！");
		}else{
			var activityId = id;
			layer.open({
				title:"活动评价",
				type:1,
				content: $(".hdpjBox"),
				area: ['610px','400px'],
				success:function(){
					//打分1
					$(".starList_w1>li").click(function(){
						$(this).parent().siblings().find('span').addClass('fontff6');
						$(".starList_w1>li>a").removeClass("bg_startY");
						var n=$(this).index();
						$('.starList_w1>li:lt('+(n+1)+')').children().addClass("bg_startY");
						//评价
						/* $(".argument_w1").eq(n).removeClass("disP_N_w").siblings().addClass("disP_N_w"); */
					})
					//打分2
					$(".starList_w2>li").click(function(){
						$(this).parent().siblings().find('span').addClass('fontff6');
						$(".starList_w2>li>a").removeClass("bg_startY");
						var n=$(this).index();
						$('.starList_w2>li:lt('+(n+1)+')').children().addClass("bg_startY");
						//评价
						/* $(".argument_w2").eq(n).removeClass("disP_N_w").siblings().addClass("disP_N_w"); */
					})
					//打分3
					$(".starList_w3>li").click(function(){
						$(this).parent().siblings().find('span').addClass('fontff6');
						$(".starList_w3>li>a").removeClass("bg_startY");
						var n=$(this).index();
						$('.starList_w3>li:lt('+(n+1)+')').children().addClass("bg_startY");
						//评价
						/* $(".argument_w3").eq(n).removeClass("disP_N_w").siblings().addClass("disP_N_w"); */
					})
				},
				btn:["确定","取消"],
				btn1:function(index){
					activityEvaluation(activityId,index);
				},
				btn2:function(){
					$(".starList_w1 li a").removeClass("bg_startY");
					$(".starList_w2 li a").removeClass("bg_startY");
					$(".starList_w3 li a").removeClass("bg_startY");
					$("#evaluation").val("");
				},
				cancel:function(){
					$(".starList_w1 li a").removeClass("bg_startY");
					$(".starList_w2 li a").removeClass("bg_startY");
					$(".starList_w3 li a").removeClass("bg_startY");
					$("#evaluation").val("");
				}
			});
		}
		
	}
}


/**
 * 评价活动
 */
function activityEvaluation(activityId,index){
	var user_evaluation1 = $(".starList_w1 .bg_startY").length;
	var user_evaluation2 = $(".starList_w2 .bg_startY").length;
	var user_evaluation3 = $(".starList_w3 .bg_startY").length;
	var remark_contents = $("#evaluation").val();
	
	var flag = false;
	if(user_evaluation1 == 0 || user_evaluation2 == 0 || user_evaluation3 == 0 || $.trim(remark_contents)== "" ){
		if(confirm("评分有0分项或未填写意见，是否给予当前活动如此评价？")){
			flag = true;
		}
	}else{
		flag = true;
	}
	
	
	if(flag){
		var params = {"activityTransactions.activityItemId":activityId,
				"activityTransactions.userCodeApp":userCodeApp,
				"activityTransactions.userEvaluation1":user_evaluation1,
				"activityTransactions.userEvaluation2":user_evaluation2,
				"activityTransactions.userEvaluation3":user_evaluation3,
				"activityTransactions.remarkContents":remark_contents};
		$.ajax({
			type: "post",
			url: rootPath+"/activityTransaction/activityEvaluation.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: params,
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "1"){
					alert("评价成功！");
					$(".starList_w1 li a").removeClass("bg_startY"); 
					$(".starList_w2 li a").removeClass("bg_startY");
					$(".starList_w3 li a").removeClass("bg_startY");
					$("#evaluation").val("");
					getExemplaryMatrixActivityShowForFront();
					layer.close(index);
				}else if(status == "0"){
					alert("评价失败！");
				}
			}
		})
	}
}



/**
 * 企业集体报名时候的非空验证
 */
function checkApplyInfo(){
	var flag = true;
	$(".applyPersonNameInput").each(function(){
		var thisInput = $(this).val();
		if($.trim(thisInput) == ""){
			alert("姓名不能为空！");
			flag = false;
			return flag;
		}
	})
	if(flag){
		$(".applyPersonPhoneInput").each(function(){
			var thisInput = $(this).val();
			if($.trim(thisInput) == ""){
				alert("电话不能为空！");
				flag = false;
				return flag;
			}
		})
	}
	if(flag){
		$(".applyPersonPhoneInput").each(function(){
			var thisInput = $(this).val();
			var isPhone = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
			var isMob=/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
			if (isMob.test(thisInput)||isPhone.test(thisInput)) {
				 
			 }else {
				alert("报名电话格式不正确！");
				flag = false;
				return flag;
			 }
		})
	}
	return flag;
}



//跳转服务项目的详情
function serviceItemsDesc(id,website,moduleType,serviceType,serviceSubType){
	//对市场开拓中的三级分类进行查询 serviceType=105000:市场开拓   serviceSubType=105001~105003:市场开拓三级分类
	if(serviceType == "105000"){ 
		//示范工业园区
		if(serviceSubType == "105001" || moduleType == "105001"){
			window.location.href=rootPath+"/page/jsp/service/service_item_dig_desc.jsp?searchType=0&id="+id;
		}else if(serviceSubType == "105003" || moduleType == "105003"){
			window.location.href=rootPath+"/page/jsp/service/service_item_conference_desc.jsp?searchType=0&id="+id;
		}else{
			window.location.href=rootPath+"/page/jsp/service/service_item_desc.jsp?searchType=0&id="+id;
		}
	}else{
		if(website && website != 'undefined' && serviceType == '100000') {
			if(website.indexOf('http') == 0) {
				location.href = website;
			} else {
				location.href = 'http://' + website;
			}
		} 
		else{			  
			window.location.href=rootPath+"/page/jsp/service/service_item_desc.jsp?searchType=0&id="+id;
		}
	}
	
}


function getUrl(type){//type:1(基地详情介绍);2(新闻);3(服务项目);4(活动预告);5(活动展示);6(入驻企业)
	var url;
	if(type == 1){
		url=rootPath+"/exemplaryMatrixFront/getExemplaryMatrixDetailsForFront.action";
	}else if(type == 2){
		url=rootPath+"/exemplaryMatrixFront/getExemplaryMatrixNewsForFront.action";
	}else if(type == 3){
		url=rootPath+"/serviceItems/selectServiceItems.action";
	}else if(type == 4){
		url=rootPath+"/activityItems/findNoticeOfActivityList.action";
	}else if(type == 5){
		url=rootPath+"/activityItems/findActivityShowList.action";
	}else if(type == 6){
		url=rootPath+"/exemplaryMatrixFront/getExemplaryMatrixSettledEnterpriseForFront.action";
	}
	return url;
}

function getHtml(type){//type:1(基地详情介绍);2(新闻);3(服务项目);4(活动预告);5(活动展示);6(入驻企业)
	var html;
	if(type == 1){
		
	}else if(type == 2){
		var html=$('script[type="text/template_exemplaryMatrixNews"]').html();
	}else if(type == 3){
		var html=$('script[type="text/template_exemplaryMatrixServiceItem"]').html();
	}else if(type == 4){
		var html=$('script[type="text/template_exemplaryMatrixActivityAdvance"]').html();
	}else if(type == 5){
		var html=$('script[type="text/template_exemplaryMatrixActivityShow"]').html();
	}else if(type == 6){
		var html=$('script[type="text/template_exemplaryMatrixSettledEnterprise"]').html();
	}
	return html;
}



//数据填充方法
function formatTemplate(dta, tmpl) {   
    var format = {   
        name: function(x) {   
            return x;   
        }   
    };   
    return tmpl.replace(/{(\w+)}/g, function(m1, m2) {   
        if (!m2)   
            return "";   
        return (format && format[m2]) ? format[m2](dta[m2]) : dta[m2];   
    });   
}