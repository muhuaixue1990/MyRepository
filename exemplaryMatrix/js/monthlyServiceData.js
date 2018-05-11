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
	//获取服务类别
	getServiceType();
	
	//加高亮
	$("#gotoMonthlyStatement").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	//不要验证是否发起了申请，任何人都可以填写月报
	/*getMatrixInfoByCode();*/
	
	if(paramYear=="" && paramMonth == ""){
	}else{
		modifyFlag = true;
	}
	
	if(modifyFlag){
		getMonthlyServiceDataInfo();
	}else{
		getTitle();
	}
	
	//保存按钮
	$("#save").click(function(){
		saveInfo();
	})
	
	$("#nextStep").click(function(){
		saveMonthlyServiceData();
	})
	
	$("#cancel").click(function(){
		window.location.href = rootPath + "/page/jsp/exemplaryMatrix/monthlyStatement_new.jsp"
	})
	
	//上传照片
	$("#meetingPicture1").change(function () {
		upload($(this));
	})
	
	//计算字数
	limWord("#sketch0",1000,"#sketchShow0");
	
	$("#sketch0").keyup(function(){
		limWord("#sketch0",1000,"#sketchShow0");
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
				alert("您今年还没有发起过申请，暂不能填写月报！");
				window.location.href = rootPath+"/page/jsp/exemplaryMatrix/monthlyStatement_new.jsp";
			}
		}
	})
}



function getTitle(){
	var nowTime = "";
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
	var year = nowTime.substring(0,4);
	var month = nowTime.substring(5,7);
	month = parseInt(month);
	var adminTitle = year+"年 "+month+"月";
	$("#adminTitle").html(adminTitle);
	$("input[name='year']").val(year);
	$("input[name='month']").val(month);
}

/**
 * 传入参数的话直接查询数据库获取月报信息
 */
function getMonthlyServiceDataInfo(){
	var adminTitle = paramYear+"年 "+paramMonth+"月";
	$("#adminTitle").html(adminTitle);
	$("input[name='year']").val(paramYear);
	$("input[name='month']").val(paramMonth);
	
	var params = {"params.userCode":userCode,"params.year":paramYear,"params.month":paramMonth};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMonthlyServiceDataByYearAndMonth.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == 1){
				var monthlyServiceDatas = data['monthlyServiceDatas'];
				for(var i=0;i<monthlyServiceDatas.length-1;i++){
					addMonthlyServiceData();
				}
				
				for(var i=0;i<monthlyServiceDatas.length;i++){
					$("select[name='serviceType']:eq("+i+") option[value='"+monthlyServiceDatas[i].serviceClass+"']").attr("selected",true);
					$("select[name='serviceType']:eq("+i+")").selectOrDie('destroy');
					$("select[name='serviceType']:eq("+i+")").selectOrDie();
					
					$("input[name='time']:eq("+i+")").val(monthlyServiceDatas[i].time);
					$("input[name='site']:eq("+i+")").val(monthlyServiceDatas[i].site);
					$("input[name='title']:eq("+i+")").val(monthlyServiceDatas[i].title);
					$("input[name='number']:eq("+i+")").val(monthlyServiceDatas[i].number);
					//新增
					$("input[name='enterNumber']:eq("+i+")").val(monthlyServiceDatas[i].enterNumber);
					
					$("#pathInput"+(i+1)).val(monthlyServiceDatas[i].picture);
					if(monthlyServiceDatas[i].picture!="" && monthlyServiceDatas[i].picture!=null && monthlyServiceDatas[i].picture!=undefined){
						$("#pictureRight"+(i+1)).show();
					}
					/*$("#fileName"+(i+1)).text("");
					$("#fileName"+(i+1)).text(monthlyServiceDatas[i].picture);*/
					$("textarea[name='sketch']:eq("+i+")").val(monthlyServiceDatas[i].sketch);
					
					limWord("#sketch"+i,1000,"#sketchShow"+i);
				}
			}
		}
	})
}


//上传文件
function upload(e){
//	$("input[name='monthlyServiceData.picture']").val("");
	//获取当前input框id属性值
	var id = e.attr("id");
	var $val = e.val();
	var fileType = id.substring(0,14);
	
	//20170630添加
	var className = e.attr("class");
	var classNames = className.split(" ");
	var index = classNames[2].substring(8,classNames[1].length);
	
	//上传文件格式jpg,png
	var $form =$val.slice(-3,$val.length);
	if ($val!=""&&($form=="zip" || $form=="rar")) {
		$.ajaxFileUpload({
	        url : rootPath+"/exemplaryMatrixApplication/uploadFile.action?userCode="+userCode+"&fileType="+fileType ,//用于文件上传的服务器端请求地址
	        secureuri : false,//一般设置为false
	        fileElementId : id,//文件上传空间的id属性  <input type="file" id="file" name="file" />
	        //dataType: 'json',//返回值类型 一般设置为json
	        success: function (data, status){
	        	alert("上传成功！");
	        	var fileName = $(data).text();
	        	$("#pathInput"+index).val(fileName);
	        	
	        	$("#pictureRight"+index).show();
	        	/*$("#fileName"+index).text("");
				$("#fileName"+index).text(fileName);*/
	        },
	        error: function (data, status, e)//服务器响应失败处理函数
	        {
	            alert(e);
	        },
	        complete: function(xmlHttpRequest) {
	        	var count = Math.random();
	        	e.replaceWith('input type="file" class="'+className+'" accept=".zip,.rar" name="file" style="title:'+count+'" id="'+id+'"');  
	        	$("#"+id).on("change", function(){  
	        		upload($(this));
                });
            }
	    });
	}else{
		alert("只能上传压缩文件！");
	}
}

/**
 * 获取服务类别方法
 */
function getServiceType(){
	//清空十大服务下拉框
	$(".serviceType").empty();
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
				for(var i=0;i<sysCodes.length;i++){
					html += "<option value='"+sysCodes[i].code+"'>"+sysCodes[i].name+"</option>";
				}
				$(".serviceType").append(html);
				$(".serviceType").selectOrDie('destroy');
				$(".serviceType").selectOrDie();
			}
		}
	})
}

/**
 * 保存按钮
 */
function saveInfo(){
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
				alert("保存失败！");
			}else if(status == "1"){
				alert("保存成功！");
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
 * 保存月度服务数据方法
 */
function saveMonthlyServiceData(){
	if(check()){
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
					alert("保存失败！");
				}else if(status == "1"){
					if(modifyFlag){
						window.location.href = rootPath + "/page/jsp/exemplaryMatrix/monthlyServiceAbility.jsp?paramYear="+paramYear+"&paramMonth="+paramMonth;
					}else{
						window.location.href = rootPath + "/page/jsp/exemplaryMatrix/monthlyServiceAbility.jsp"
					}
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

function check(){
	var flag = true ;
	var checkParamLength = $(".checkParam").length;
	$(".checkParam").each(function(index){
		if(index == (checkParamLength-1) || 
			index == (checkParamLength-2) || 
			index == (checkParamLength-3) || 
			index == (checkParamLength-4) || 
			index == (checkParamLength-5) ||
			index == (checkParamLength-6)){
			
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
		var checkPictureLength = $(".checkPicture").length;
		$(".checkPicture").each(function(index){
			if(index == (checkPictureLength-1)){
				
			}else{
				var thisInput = $(this).val();
				var thisId = $(this).attr("id");
				thisId = thisId.substring(9,thisId.length);
				if($.trim(thisInput) == ""){
					var str = $(this).parent().parent().prev("td").text();
					str = str.substring(0,str.length-1);
					alert("请上传：基地开展服务情况"+thisId+" "+str);
					flag = false;
					return flag;
				}
			}
		})
	}
	
	if(flag){
		var checkIntLength = $(".checkInt").length;
		$(".checkInt").each(function(index){
			if(index == (checkIntLength-1)){
				
			}else{
				var thisInput = $(this).val();
				var g = /^[1-9]*[1-9][0-9]*$/;
				if(thisInput == 0){
					
				}else{
					if(!g.test(thisInput)){
				    	alert("基地开展服务情况"+(index+1)+" 人员规模应填写正整数！");
				    	flag = false;
						return flag;
				    }
				}
			}
		})
	}
	
	return flag;
}