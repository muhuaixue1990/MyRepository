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

//加载后执行
$(function(){
	//加高亮
	$("#gotoResultForApplication").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	
	//获取当前时间
	getNowTime();
	//获取最近一条申报时间记录
	getDeclareTime();
	
	getApplicationYearList();
	
	getResultForApplication();
	$("#resultTable").on("click","#modification",function(){
		var id = $(this).attr("name");
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationOne.jsp";
	})
	
})



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
}

/**
 * 获取最近一条申报时间记录
 */
function getDeclareTime(){
	var params = {"param.page":1,
					"param.pageSize":5,
					"param.sortByIsDeclare":"1",
					"param.sortByTime":"1",
					"param.type":"3",
					"param.declareType":"4",
					"param.serviceType":"103000"};
	$.ajax({
		type: "post",
		url: rootPath+"/publishInfo/selectPlatformPublishInfoByDistrictAndTypeAndServiceType.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data:params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var result = data['result'];
				var dataList = data.data.data;
				var publicNew = dataList[0];
				
				if(publicNew == undefined){
					declareStartTime = "1990-01-01T00:00:00";
					declareEndTime = "1990-01-01T00:00:00";
				}else{
					declareStartTime = publicNew.declare_start_time;
					declareEndTime = publicNew.declare_end_time;
				}
				
			}
		}
	})
}

/**
 * 判断时间
 */
function judgmentTime(){
	declareStartTime = declareStartTime.replace("T"," ");
	declareEndTime = declareEndTime.replace("T"," ");
	if(dateCompare(nowTime,declareStartTime) && dateCompare(declareEndTime,nowTime)){
		return true;
	}else{
		return false;
	}
}

/**
 * 获取申请年限列表方法
 */
function getApplicationYearList(){
	$("#applicationYearList").empty();
	var myDate = new Date();
	var year = myDate.getFullYear();
	var haveThisYear = false ; 
	
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getApplicationYearList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			var html = "";
			if(status == "0"){
				html += '<option value="'+year+'">'+year+'</option>';
			}else if(status == "1"){
				var applicationYearList = data['applicationYearList'];
				for(var i=0;i<applicationYearList.length;i++){
					if(year == applicationYearList[i].applicationYear){
						html += '<option value="'+applicationYearList[i].applicationYear+'" selected="selected">'+applicationYearList[i].applicationYear+'</option>';
						haveThisYear = true;
					}else{
						html += '<option value="'+applicationYearList[i].applicationYear+'">'+applicationYearList[i].applicationYear+'</option>';
					}
				}
				if(!haveThisYear){
					html += '<option value="'+year+'" selected="selected">'+year+'</option>';
				}
			}
			$("#applicationYearList").append(html);
			$("#applicationYearList").selectOrDie('destroy');
			$("#applicationYearList").selectOrDie();
		}
	})
}

//获取申请结果
function getResultForApplication(){
	$("#resultTable").empty();
	var applicationYear = $("#applicationYearList").val();

	var params = {"params.userCode":userCode,
					"params.applicationYear":applicationYear};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getResultForApplicationByUserCode.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			var html = "";
			if(status == '1'){
				var exemplaryMatrixApplication = data['exemplaryMatrixApplication'];
				//提交状态
				var type = exemplaryMatrixApplication.type ; 
				//区级推荐状态
				var districtAuditType = exemplaryMatrixApplication.districtAuditType;
				//市级审核状态
				var cityAuditType = exemplaryMatrixApplication.cityAuditType;
				//第三方审核状态
				var thirdPartyAuditType = exemplaryMatrixApplication.thirdPartyAuditType;
				
				//区级审核时间
				var districtAuditTime = exemplaryMatrixApplication.districtAuditTime;
				//区级审核人
				var districtAuditUser = exemplaryMatrixApplication.districtAuditUser;
				
				var flag = false;
				
				html += '<tr>';
				html += '<td width="25%">'+exemplaryMatrixApplication.matrixName+'</td>';
				if(type == "0"
					&& districtAuditType == "0"
					&& cityAuditType == "0"
					&& thirdPartyAuditType == "0"){
					//增加判断，区级审核时间和区级审核人都有的情况下，显示“区及审核未通过”
					if(districtAuditTime!=null && districtAuditUser!=null){
						html += '<td width="15%">区级不推荐</td>';
					}else{
						html += '<td width="15%">待提交</td>';
					}
					flag = true;
				}else if(type == "1"
							&& districtAuditType == "0"
							&& cityAuditType == "0"
							&& thirdPartyAuditType == "0"){
							html += '<td width="15%">已提交</td>';
				}else if(type == "1"
							&& districtAuditType == "1"
							&& cityAuditType == "0"
							&& thirdPartyAuditType == "0"){
							html += '<td width="15%">区级不推荐</td>';
							flag = true;
				}else if(type == "1"
							&& districtAuditType == "2"
							&& cityAuditType == "0"
							&& thirdPartyAuditType == "0"){
							html += '<td width="15%">区级已推荐</td>';
				}else if(type == "1"
							&& districtAuditType == "2"
							&& cityAuditType == "3"
							&& thirdPartyAuditType == "0"){
							html += '<td width="15%">市级政府退回</td>';
							flag = true;
				}else if(type == "1"
							&& districtAuditType == "2"
							&& (cityAuditType == "3"||cityAuditType=="0")
							&& thirdPartyAuditType == "1"){
							html += '<td width="15%">第三方专家不推荐</td>';
							flag = true;
				}else if(type == "1"
							&& districtAuditType == "2"
							&& (cityAuditType == "3"||cityAuditType=="0")
							&& thirdPartyAuditType == "2"){
							html += '<td width="15%">第三方专家推荐</td>';
				}else if(type == "1"
							&& districtAuditType == "2"
							&& cityAuditType == "1"
							&& (thirdPartyAuditType == "2" || thirdPartyAuditType == "1")){
							html += '<td width="15%">市级审核未通过</td>';
							flag = true;
				}else if(type == "1"
							&& districtAuditType == "2"
							&& cityAuditType == "2"
							&& (thirdPartyAuditType == "2" || thirdPartyAuditType == "1")){
							html += '<td width="15%">市级审核通过</td>';
							
				}
				/*html += '<td width="42%"></td>';*/
				if(flag && judgmentTime()){
					html += '<td width="18%" class="link_blue" id="modification" name="'+exemplaryMatrixApplication.userCode+'">修改</td>';
				}else{
					html += '<td width="18%" class="link_blue"></td>';
				}
				
				html += '</tr>';
				
			}else if(status == '0'){
				/*alert("您还未发起示范基地申请！");
				window.location.href = rootPath+"/page/jsp/enterpriseInfo/entInfoPage.jsp";*/
				html +='<tr><td>您还未发起示范基地申请！</td></tr>'
			}
			$("#resultTable").append(html);
		}
	})
}