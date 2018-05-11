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
	//边栏样式
	$("#entInfoSide li").removeAttr("class");
	$("#entBaseInfoSide").attr("class","subnav_1st subPass");
	$("#entPublicityInfoSide").attr("class","subPass");
	$("#entFinancialInfoSide").attr("class","subPass");
	$("#accountInfoSide").attr("class","subPass subnav_end");
	
	//边栏样式
	$(".sidebarCur").removeAttr("class");
	$("#gotoMonthlyStatement").attr("class","sidebarCur");
	
//	getMatrixInfoByCode();
	
	//获取服务类别
	getServiceType();
	
	//获取月度服务数据列表
	getServiceDataList(getServiceDataListParams(serviceDataCurrentPage));
	
	//绑定修改方法
	$("#serviceDataList").on("click",".serviceDataModify",function(){
		var id = $(this).attr("name");
		getMonthlyServiceDataById(id);
	})
	
	//搜索方法
	$("#serviceDataSearch").click(function(){
		getServiceDataList(getServiceDataListParams(serviceDataCurrentPage));
	})
	
	
	
	//获取月度服务能力升级情况列表
	getOfficeEquipmentList(getOfficeEquipmentListParams(officeEquipmentCurrentPage));
	
	//绑定修改方法
	$("#officeEquipmentList").on("click",".officeEquipmentModify",function(){
		var params = $(this).attr("name");
		getOfficeEquipmentAndDecorationByParams(params);
		
	})
	
	//搜索方法
	$("#officeEquipmentSearch").click(function(){
		getOfficeEquipmentList(getOfficeEquipmentListParams(officeEquipmentCurrentPage));
	})
	
	
	 var date=new Date;
	 var year=date.getFullYear();
	 $(".nowYear").text("");
	 $(".nowYear").text(year+"年");
	 $(".nowYearInput").val(year);
	
	//上传照片
	$("#meetingPicture").change(function () {
		upload($(this));
	})
	
	//点击保存，保存月度服务信息
	$("#saveMonthlyServiceData").click(function(){
		saveMonthlyServiceData();
	})
	
	$("#cancelMonthlyServiceData").click(function(){
		location.reload();
	})
	
})

function getMatrixInfoByCode(){
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
			if(status == "0"){
				alert("您还未发起示范基地申请！")
				window.location.href = rootPath+"/page/jsp/enterpriseInfo/entInfoPage.jsp";
			}
			if(status == "1"){
				var exemplaryMatrixApplication = data['exemplaryMatrixApplication'];
				if(exemplaryMatrixApplication.cityAuditType != "2"){
					alert("您还未成为示范基地！")
					window.location.href = rootPath+"/page/jsp/exemplaryMatrix/resultForApplication.jsp";
				}
				
			}
			
		}
	})
}





//上传文件
function upload(e){
	$("input[name='monthlyServiceData.picture']").val("");
	//获取当前input框id属性值
	var id = e.attr("id");
	var $val = e.val();
	//上传文件格式jpg,png
	var $form =$val.slice(-3,$val.length);
	if ($val!=""&&($form=="png"||$form=="jpg"||$form=="JPG")) {
		$.ajaxFileUpload({
	        url : rootPath+"/exemplaryMatrixApplication/uploadFile.action?userCode="+userCode+"&fileType="+id ,//用于文件上传的服务器端请求地址
	        secureuri : false,//一般设置为false
	        fileElementId : id,//文件上传空间的id属性  <input type="file" id="file" name="file" />
	        //dataType: 'json',//返回值类型 一般设置为json
	        success: function (data, status){
	        	alert("上传成功！");
	        	var fileName = $(data).text();
	        	$("input[name='monthlyServiceData.picture']").val(fileName);
	        },
	        error: function (data, status, e)//服务器响应失败处理函数
	        {
	            alert(e);
	        },
	        complete: function(xmlHttpRequest) {
	        	var count = Math.random();
	        	e.replaceWith('input type="file" class="hideBtn w155 disP_N_w" accept="image/*" id="'+id+'" name="file" style="title:'+count+'"');  
	        	$("#"+id+"").on("change", function(){  
	        		upload($(this));
                });
            }
	    });
	}
}

/**
 * 保存月度服务报表
 */
function saveMonthlyServiceData(){
	 var date=new Date;
	 var year=date.getFullYear();
	 $(".nowYearInput").val(year);
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/saveMonthlyServiceData.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: $("#monthlyServiceDataForm").serialize(),
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("保存失败");
			}else if(status == "1"){
				location.reload();
			}
		}
	})
}

/**
 * 通过id获取月度服务信息id
 */
function getMonthlyServiceDataById(id){
	var params = {"params.id":id};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMonthlyServiceDataById.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
			}else if(status == "1"){
				var monthlyServiceData = data['monthlyServiceData'];
				$("input[name='monthlyServiceData.id']").val(monthlyServiceData.id);
				$("input[name='monthlyServiceData.userCode']").val(monthlyServiceData.userCode);
				$("input[name='monthlyServiceData.year']").val(monthlyServiceData.year);
				
				$("#monthlyServiceDataMonth option[value='"+monthlyServiceData.month+"']").attr("selected",true);
				$("#monthlyServiceDataMonth").selectOrDie('destroy');
				$('#monthlyServiceDataMonth').selectOrDie();
				
				
				$("#newServiceType option[value='"+monthlyServiceData.serviceClass+"']").attr("selected",true);
				$("#newServiceType").selectOrDie('destroy');
				$('#newServiceType').selectOrDie();
				
				$("input[name='monthlyServiceData.time']").val(monthlyServiceData.time);
				$("input[name='monthlyServiceData.site']").val(monthlyServiceData.site);
				$("input[name='monthlyServiceData.title']").val(monthlyServiceData.title);
				$("input[name='monthlyServiceData.number']").val(monthlyServiceData.number);
				$("input[name='monthlyServiceData.picture']").val(monthlyServiceData.picture);
				$("textarea[name='monthlyServiceData.sketch']").val(monthlyServiceData.sketch);
				
				
				
				
				var index1=layer.open({
					title:"修改月度服务数据",
					skin:"addPop_w",
					type:1,//可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
					content:$('.addPop1_w'),
//					btn: ['保存并新增','保存并退出', '取消'],
					//  shade: 0,//遮罩，如需要此处去掉
//					id:"pop1",
					move: false,//禁止拖拽
					area: ['510px', '550px'],
					// scrollbar: false
//					yes: function(index, layero){
//						//do something
//						layer.close(index); //如果设定了yes回调，需进行手工关闭
//					}
				})
				$(".addPop1_w .btn_border,.addPop1_w .btn_solid").click(function(){
					layer.close(index1)
				})
			}
		}
	})
}

/**
 * 保存月度报表——办公设备方法
 */
function saveMonthlyOfficeEquipment(){
	 var date=new Date;
	 var year=date.getFullYear();
	 $(".nowYearInput").val(year);
	var month = $("#tanchuang2Month").val();
	$("input[name='monthlyOfficeEquipmentMonth']").val(month);
	
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
			}
		}
	})
}

/**
 * 保存月度报表——装修改造
 */
function saveMonthlyDecoration(){
	var date=new Date;
	var year=date.getFullYear();
	$(".nowYearInput").val(year);
	var month = $("#tanchuang2Month").val();
	$("input[name='monthlyDecorationMonth']").val(month);
	
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
			}
		}
	})
}

/**
 * 通过年月信息获取办公设备升级装修改造升级记录
 */
function getOfficeEquipmentAndDecorationByParams(params){
	var paramsArray = params.split(",");
	var year = paramsArray[0];
	var month = paramsArray[1];
	var getParams = {"params.matrixCode":userCode,"params.year":year,"params.month":month};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getOfficeEquipmentAndDecorationByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: getParams,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "1"){
				var index1=layer.open({
					title:"新增月度服务能力升级情况",
					skin:"addPopRe_w",
					type:1,//可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
					content:$('.addPop2_w'),
					btn: ['保存','取消'],
					//  shade: 0,//遮罩，如需要此处去掉
//					id:"pop2",
					move: false,//禁止拖拽
					area: ['510px', '500px'],
					// scrollbar: false
					yes: function(index, layero){
						saveMonthlyOfficeEquipment();
						saveMonthlyDecoration();
						$("#monthlyOfficeEquipmentForm")[0].reset();
						$("#monthlyDecorationForm")[0].reset();
						getOfficeEquipmentList(getOfficeEquipmentListParams(officeEquipmentCurrentPage));
						location.reload();
						/* alert(111);
						//do something
						layer.close(index); //如果设定了yes回调，需进行手工关闭 */
					},
					btn2:function(index, layero){
						location.reload();
					}
				})
				
				var officeEquipmentList = data['officeEquipmentList'];
				var decorationList = data['decorationList'];
				
				for(var i=0;i<officeEquipmentList.length-1;i++){
					newMonthlyOfficeEquipment()
				}
				for(var i=0;i<officeEquipmentList.length;i++){
					$("input[name='monthlyOfficeEquipment.equipmentName']:eq("+i+")").val(officeEquipmentList[i].equipmentName);
					$("input[name='monthlyOfficeEquipment.count']:eq("+i+")").val(officeEquipmentList[i].count);
					$("input[name='monthlyOfficeEquipment.invoiceNo']:eq("+i+")").val(officeEquipmentList[i].invoiceNo);
					if(i == 1){
						$("input[name='monthlyOfficeEquipment.equipmentName']:eq("+(i+1)+")").val(officeEquipmentList[i].equipmentName);
						$("input[name='monthlyOfficeEquipment.count']:eq("+(i+1)+")").val(officeEquipmentList[i].count);
						$("input[name='monthlyOfficeEquipment.invoiceNo']:eq("+(i+1)+")").val(officeEquipmentList[i].invoiceNo);
					}
				}
				
				
				for(var i=0;i<decorationList.length-1;i++){
					newDecoration()
				}
				for(var i=0;i<decorationList.length;i++){
					$("input[name='monthlyDecoration.contractName']:eq("+i+")").val(decorationList[i].contractName);
					$("input[name='monthlyDecoration.contractNo']:eq("+i+")").val(decorationList[i].contractNo);
					$("textarea[name='monthlyDecoration.contractContents']:eq("+i+")").val(decorationList[i].contractContents);
					$("input[name='monthlyDecoration.invoiceNo']:eq("+i+")").val(decorationList[i].invoiceNo);
					if(i == 1){
						$("input[name='monthlyDecoration.contractName']:eq("+(i+1)+")").val(decorationList[i].contractName);
						$("input[name='monthlyDecoration.contractNo']:eq("+(i+1)+")").val(decorationList[i].contractNo);
						$("textarea[name='monthlyDecoration.contractContents']:eq("+(i+1)+")").val(decorationList[i].contractContents);
						$("input[name='monthlyDecoration.invoiceNo']:eq("+(i+1)+")").val(decorationList[i].invoiceNo);
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
	$(".serviceType").selectOrDie('destroy');
	
	$("#newServiceType").empty();
	$("#newServiceType").selectOrDie('destroy');
	//拼接请求参数
	var param = {'params.group':'service_type','params.parent':'0'};
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
				html += "<option value=''>全部</option>";
				var newHtml = "";
				for(var i=0;i<sysCodes.length;i++){
					html += "<option value="+sysCodes[i].code+">"+sysCodes[i].name+"</option>";
					newHtml += "<option value="+sysCodes[i].code+">"+sysCodes[i].name+"</option>";
				}
				$(".serviceType").append(html);
				$('.serviceType').selectOrDie();
				
				$("#newServiceType").append(newHtml);
				$('#newServiceType').selectOrDie();
			}
		}
	})
}

/**
 * 获取月度服务数据列表参数
 */
function getServiceDataListParams(serviceDataCurrentPage){
	
	var serviceDataYear = $("#serviceDataYear").val();
	var serviceDataSearchMonth = $("#serviceDataSearchMonth").val();
	var serviceDataServiceType = $("#serviceDataServiceType").val();
	var serviceDataTitle = $("#serviceDataTitle").val();
	
	var params = {'params.userCode':userCode,
					'params.serviceDataYear':serviceDataYear,
					'params.serviceDataSearchMonth':serviceDataSearchMonth,
					'params.serviceDataServiceType':serviceDataServiceType,
					'params.serviceDataTitle':serviceDataTitle,
					'params.currentPage':serviceDataCurrentPage,
				  	'params.pageSize':serviceDataPageSize};
	return params;
}

/**
 * 月度服务数据分页回调
 */
function serviceDataPageCallback(index,jq){
	serviceDataCurrentPage = index + 1;
	getServiceDataList(getServiceDataListParams(serviceDataCurrentPage));
}

/**
 * 获取月度服务数据列表
 */
function getServiceDataList(params){
	//清空列表
	$("#serviceDataList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getServiceDataList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			serviceDataTotalPage=Math.ceil(data['count']/serviceDataPageSize);
			var serviceDataList = data['serviceDataList'];
			var html = "";
			for(var i=0; i<serviceDataList.length; i++){
				html += '<tr>'
				html += '<td width="15%">'+serviceDataList[i].year+'</td>';
				html += '<td width="15%">'+serviceDataList[i].month+'</td>';
				html += '<td width="20%">'+serviceDataList[i].serviceClass+'</td>';
				html += '<td width="35%">'+serviceDataList[i].title+'</td>';
				html += '<td width="15%" class="link_blue serviceDataModify" name="'+serviceDataList[i].id+'">修改</td>';
				html += '</tr>';
			}
			$("#serviceDataList").append(html);
			
			
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




/**
 * 获取月度服务能力升级情况列表参数
 */
function getOfficeEquipmentListParams(officeEquipmentCurrentPage){
	
	var officeEquipmentYear = $("#officeEquipmentYear").val();
	var officeEquipmentMonth = $("#officeEquipmentMonth").val();
	
	var params = {'params.userCode':userCode,
					'params.officeEquipmentYear':officeEquipmentYear,
					'params.officeEquipmentMonth':officeEquipmentMonth,
					'params.currentPage':officeEquipmentCurrentPage,
				  	'params.pageSize':officeEquipmentPageSize};
	return params;
}

/**
 * 月度服务能力升级回调
 */
function officeEquipmentPageCallback(index,jq){
	officeEquipmentCurrentPage = index + 1;
	getOfficeEquipmentList(getOfficeEquipmentListParams(officeEquipmentCurrentPage));
}

/**
 * 获取月度服务能力升级情况列表
 */
function getOfficeEquipmentList(params){
	//清空列表
	$("#officeEquipmentList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getOfficeEquipmentList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			officeEquipmentTotalPage=Math.ceil(data['count']/officeEquipmentPageSize);
			var officeEquipmentList = data['officeEquipmentList'];
			var html = "";
			for(var i=0; i<officeEquipmentList.length; i++){
				html += '<tr>'
				html += '<td width="15%">'+officeEquipmentList[i].year+'</td>';
				html += '<td width="15%">'+officeEquipmentList[i].month+'</td>';
				html += '<td width="15%" class="link_blue officeEquipmentModify" name="'+officeEquipmentList[i].year+','+officeEquipmentList[i].month+'">修改</td>';
				html += '</tr>';
			}
			$("#officeEquipmentList").append(html);
			
			
			$("#officeEquipmentPage").pagination(officeEquipmentTotalPage,{
				callback: officeEquipmentPageCallback,
				items_per_page : 1,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : officeEquipmentCurrentPage - 1,
				link_to : 'javascript:void(0)'
			});
			$("#officeEquipmentTotalPage").text("共"+officeEquipmentTotalPage+"页");
		}
	})
}

