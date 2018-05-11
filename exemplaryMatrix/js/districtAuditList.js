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
	
	//获取当前时间
	getNowTime();
	//获取最近一条区推荐时间记录
	getDistrictRecommendTime();
	
	//不考虑申请年份
	//getApplicationYearList();
	
	//获取列表
	getList(getListParams(currentPage));
	
	$("#search").click(function(){
		getList(getListParams(currentPage));
	})
	
	$("#matrixList").on("click",".examine",function(){
		var applicationUserCode = $(this).attr("name");
		var examineFlag = $(this).attr("id");
		//var applicationYear = $("#applicationYearList").val();
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/districtExamineInfoOne.jsp?applicationUserCode="+applicationUserCode+"&examineFlag="+examineFlag;
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
 * 获取最近一条区推荐时间记录
 */
function getDistrictRecommendTime(){
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
					recommendStartTime = "1990-01-01T00:00:00";
					recommendEndTime = "1990-01-01T00:00:00";
				}else{
					recommendStartTime = publicNew.recommend_start_time;
					recommendEndTime = publicNew.recommend_end_time;
				}
				
			}
		}
	})
}

/**
 * 判断时间
 */
function judgmentTime(){
	recommendStartTime = recommendStartTime.replace("T"," ");
	recommendEndTime = recommendEndTime.replace("T"," ");
	if(dateCompare(nowTime,recommendStartTime) && dateCompare(recommendEndTime,nowTime)){
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
	var year = nowTime.substring(0,4);
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

/**
 * 获取查询参数
 * @param currentPage
 * @returns {___anonymous4309_4526}
 */
function getListParams(currentPage){
	
	var type = $("#type").val();
	var matrixName = $("#matrixName").val();
	//var applicationYear = $("#applicationYearList").val();
	
	var params = {'params.type':type,
					'params.matrixName':matrixName,
					//'params.applicationYear':applicationYear, 
					'params.district':district, 
					'params.currentPage':currentPage,
				  	'params.pageSize':pageSize};
	return params;
}

/**
 * 分页回调
 */
function pageCallback(index,jq){
	currentPage = index + 1;
	getList(getListParams(currentPage));
}

function getList(params){
	//清空列表
	$("#matrixList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/districtAuditGetList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var matrixList = data['matrixList'];
			var html = "";
			if(matrixList.length>0){
				for(var i=0; i<matrixList.length; i++){
					html += '<tr>'
					html += '<td>'+matrixList[i].matrixName+'</td>'
					html += '<td>'+matrixList[i].contacter+'</td>'
					html += '<td>'+matrixList[i].contactPhone+'</td>'
					html += '<td>'+(matrixList[i].updateStamp).substring(0,10)+'</td>';
					if(undefined == matrixList[i].districtAuditTime){
						html += '<td></td>'
					}else{
						html += '<td>'+(matrixList[i].districtAuditTime).substring(0,10)+'</td>'				
					}
					
					
					if(matrixList[i].districtAuditType == "0"){
						html += '<td class="cgreen">待推荐</td>'
					}else if(matrixList[i].districtAuditType == "1"){
						html += '<td class="cgreen">不推荐</td>'
					}else if(matrixList[i].districtAuditType == "2"){
						html += '<td class="cgreen">已推荐</td>'
					}
					
					//判断是否可以进行操作
					if(judgmentAudit(matrixList[i])){
						html += '<td class="link_blue"><a class="examine" name="'+matrixList[i].userCode+'" id="1">推荐</a></td>'
					}else{
						html += '<td class="link_blue"><a class="examine" name="'+matrixList[i].userCode+'" id="0">查看</a></td>'
					}
					
					
					html += '</tr>';
				}
			}else{
				html += '<tr><td>未查询到数据</td></tr>'
			}
			
			$("#matrixList").append(html);
			
			
			$("#page").pagination(totalPage,{
				callback: pageCallback,
				items_per_page : 1,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : currentPage - 1,
				link_to : 'javascript:void(0)'
			});
			$("#totalPage").text("共"+totalPage+"页");
			
		}
	})
}

/**
 * 判断是否进行推荐
 */
function judgmentAudit(matrixApplication){
	var auditFlag = true;
	
//	//当前年份
//	var year = nowTime.substring(0,4);
//	//当前选定的申请时间
//	var applicationYear = $("#applicationYearList").val();
//	
//	//不是本年，只能查看不能审核;
//	if(year != applicationYear){
//		auditFlag = false;
//	}
	
//	//是本年
//	if(auditFlag){
	//市级撤回的不考虑推荐时间
	if(matrixApplication.cityAuditType == "3"){
		//未推荐进行推荐,20170608修改，不推荐的可以继续推荐，已经推荐的不可以进行操作
		if(matrixApplication.districtAuditType == "0" || matrixApplication.districtAuditType == "1"){
			auditFlag = true;
		}else if(matrixApplication.districtAuditType == "2"){
			auditFlag = false;
		}
	}else{
		//在推荐时间范围内
		if(judgmentTime()){
			//市级和第三方都没有操作的时候，区级还可以修改推荐结果。
			if(matrixApplication.cityAuditType == "0" && matrixApplication.thirdPartyAuditType == "0"){
				//20170608新增已经推荐的只能查看不推荐的可以再进行推荐
				if(matrixApplication.districtAuditType=="2"){
					auditFlag = false;
				}else if(matrixApplication.districtAuditType=="1" || matrixApplication.districtAuditType=="0"){
					auditFlag = true;
				}
			}else{
				auditFlag = false;
			}
		}else{
			auditFlag = false;
		}
	}
//	}
	return auditFlag;
}