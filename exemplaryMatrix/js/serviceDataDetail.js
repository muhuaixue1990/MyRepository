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
	$("#"+left).addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	getServiceDataList(getServiceDataListParams(serviceDataCurrentPage));
	
	$("#goBack").click(function(){
		history.back();
	})
})


/**
 * 获取服务数据参数
 */
function getServiceDataListParams(serviceDataCurrentPage){
	
	var params = {'params.userCode':matrixCode,
					'params.serviceYear':paramYear,
					'params.serviceQuarter':paramQuarter,
					'params.lineType':lineType,
					'params.activityClass':activityClass,
					'params.auditType':auditType,
					'params.currentPage':serviceDataCurrentPage,
				  	'params.pageSize':serviceDataPageSize};
	return params;
}

/**
 * 服务数据分页回调
 */
function serviceDataPageCallback(index,jq){
	serviceDataCurrentPage = index + 1;
	getServiceDataList(getServiceDataListParams(serviceDataCurrentPage));
}

/**
 * 获取服务数据列表
 * @param params
 */
function getServiceDataList(params){
	//清空列表
	$("#activityName").text("");
	$("#activityTime").text("");
	$("#activityAddress").text("");
	$("#activityClassName").text("");
	$("#enterpriseQuantity").text("");
	$("#personQuantity").text("");
	
	$("#totalExpend").text("");
	$("#personalExpend").text("");
	$("#siteExpend").text("");
	$("#dataExpend").text("");
	$("#cooperationOrganizationExpend").text("");
	$("#otherExpend").text("");
	
	$("#cooperationOrganization").val("");
	$("#activityOverview").val("");
	
	$("#activityInformPic").attr("src","")
	$("#activityCompletePic").attr("src","")
	$("#activityPartPic").attr("src","")
	$("#activityContentPic").attr("src","")
	$("#enterpriseDetail").attr("src","")
	$("#evaluatePic").attr("src","")
	$("#billPic").attr("src","")
	
	$("#cost").text("");
	
	
	
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findExemplaryMatrixServiceDataByParamsForPage.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			serviceDataTotalPage=Math.ceil(data['count']/serviceDataPageSize);
			var serviceDataList = data['serviceDataList'];
			
			if(serviceDataList.length!=0){
				for(var i=0; i<serviceDataList.length; i++){
					$("#activityName").text(serviceDataList[i].activityName);
					$("#activityTime").text(serviceDataList[i].activityTime);
					$("#activityAddress").text(serviceDataList[i].activityAddress);
					$("#activityClassName").text(serviceDataList[i].activityClassName);
					$("#enterpriseQuantity").text(serviceDataList[i].enterpriseQuantity);
					$("#personQuantity").text(serviceDataList[i].personQuantity);
					
					$("#totalExpend").text(serviceDataList[i].totalExpend+"万元");
					$("#personalExpend").text(serviceDataList[i].personalExpend+"万元");
					$("#siteExpend").text(serviceDataList[i].siteExpend+"万元");
					$("#dataExpend").text(serviceDataList[i].dataExpend+"万元");
					$("#cooperationOrganizationExpend").text(serviceDataList[i].cooperationOrganizationExpend+"万元");
					$("#otherExpend").text(serviceDataList[i].otherExpend+"万元");
					
					$("#cooperationOrganization").val(serviceDataList[i].cooperationOrganization);
					$("#activityOverview").val(serviceDataList[i].activityOverview);
					
					$("#activityInformPic").attr("src",serviceDataList[i].activityInformPic)
					$("#activityCompletePic").attr("src",serviceDataList[i].activityCompletePic)
					$("#activityPartPic").attr("src",serviceDataList[i].activityPartPic)
					$("#activityContentPic").attr("src",serviceDataList[i].activityContentPic)
					$("#enterpriseDetail").attr("src",serviceDataList[i].enterpriseDetail)
//					$("#evaluatePic").attr("src",serviceDataList[i].evaluatePic)
//					$("#billPic").attr("src",serviceDataList[i].billPic)
					$("#evaluatePic").html("<a href='"+serviceDataList[i].evaluatePic+"' style='text-decoration:underline;color:blue'>下载附件</a>")
					var billPic = serviceDataList[i].billPic;
					var billPicInput = billPic.substring(billPic.lastIndexOf("/")+1,billPic.length);
					if(billPicInput!=""){
						$("#billPic").html("<a href='"+serviceDataList[i].billPic+"' style='text-decoration:underline;color:blue'>下载附件</a>")
					}else{
						$("#billPic").html("<span>未上传附件</span>")
					}
					
					if(serviceDataList[i].cost == null || serviceDataList[i].cost == undefined || serviceDataList[i].cost == '0'){
						$("#cost").text("不收费");
					}else{
						$("#cost").text(serviceDataList[i].cost+"元");
					}
				}
			}else{
				alert("未查询到服务凭证数据！")
				history.back();
			}
			
			$("#serviceDataPage").pagination(serviceDataTotalPage,{
				callback: serviceDataPageCallback,
				items_per_page : 1,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : serviceDataCurrentPage - 1,
				link_to : 'javascript:void(0)'
			});
			$("#serviceDataTotalPage").text("共"+serviceDataTotalPage+"页");
			
		}
	})
}