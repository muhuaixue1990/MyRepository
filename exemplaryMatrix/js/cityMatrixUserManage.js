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

var  page  =  1 ;
var  pageSize  =  10 ;
var  layer1;
var  layer2;

/**
 * 加载后执行
 */
$(function(){
	//加高亮
	$("#exemplaryMatrixUserManage").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	//查询区的下拉框
	getDistrictSelect();
	getExemplaryMatrixUserList();
	//绑定搜索按钮
	$("#search").click(function(){
		getExemplaryMatrixUserList();
	})
	//查询未填写当季度季报的企业数量
	getSumForMatrixNoMonthly();
	//当月未填写月报示范基地详情按钮
	$("#matrixNoMonthlyDetail").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/matrixNoMonthlyDetail.jsp";
	})
	
})


//获取列表
function getExemplaryMatrixUserList(){

	page = 1;
	var url = getUrl();
	var params = getParams();
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
			resetPagination();
			clearTarget();
			showData(data);
		},
		error:function(){
			alert("查询失败");
		}	
	});
	

}

function getExemplaryMatrixUserListCallback(index){
	//获取无条件查询的url
	var url=getUrl();
	var newPage=index+1;
	page = newPage;
	var params=getParams();
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
			resetPagination();
			clearTarget();
			showData(data);
		},
		error:function(){
			alert("查询失败");
		}	
	});


	
}






//数据显示的方法
function showData(data){
	//数据填充
	if(data.result==1){
	    //获取html模板
		var html=getHtml();
		//定义一个数组，用来接收格式化合的数据   
	    var arr = [];   
	    //对数据进行遍历   (数据格式统一，data.data.data为需要迭代的数据list)
	    $.each(data.data.data, function(index, o) {
	        //这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.
	    	if(index%2==0){
	    		o.color = "bgf6"
	    	}else{
	    		o.color = ""
	    	}
	        arr.push(formatTemplate(o, html)); 		            
	    });   
		
	    //把数组化成字符串，并添加到模板标签的父标签中去。   
	    $('#matrixList').append(arr.join(''));
		
	    var total_page=Math.ceil(data.data.total/pageSize);
	    //设置分页
	    $("#pagination").pagination(data.data.total,{
			callback: getExemplaryMatrixUserListCallback,
			items_per_page : pageSize,				
			prev_text:"上一页",
			next_text:"下一页",
			num_edge_entries : 3,			//边缘值
			ellipse_text : '...',			//边缘显示
			num_display_entries : 10,		//显示条数
			current_page : page-1,
			link_to : 'javascript:void(0)'
		});
		$("#totalpage").text("共"+total_page+"页");  
	    
	}
	return;
}


function getUrl(){
	var url=rootPath+"/exemplaryMatrixFront/getExemplaryMatrixUserList.action";
	return url;
}

function getParams(){
	//参数获取
	var params;
	var matrixName = $("#matrixName").val();
	var district = $("#districtForSearch").val();
	
	params={
			"params.district":district,
			"params.matrixName":matrixName,
			"params.page":page,
			"params.pageSize":pageSize
		   }
	
	return params;
}

//重置分页
function resetPagination(){
	$("#pagination").remove();
	$("#totalpage").remove();
	var $pagination=$("<div id='pagination' class='pagination'></div>");
	$("#paginationParent").append($pagination);
	var $totalPage=$("<span id='totalpage' class='total_page'></span>");
	$("#paginationParent").append($totalPage);
	$("#totalpage").text("共0页");
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

//获取数据模板
function getHtml(){
	var html=$('script[type="text/template_exemplaryMatrixUserList"]').html();
	return html;
}

//清空数据填充区域
function clearTarget(){
	$("#matrixList").empty();
}

//导向方法
function checkData(matrixCode,status){
	if(status == "add"){
		$("#passwordLi").show();
		$("#userCodelayer").val("");
		$("#username").attr("disabled",false);
		$("#username").css({ "background-color": "#fff"});
		$("#username").attr("title","账号");
		openLayer("添加示范基地");
	}else if(status == "detial"){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/districtExamineInfoOne.jsp?applicationUserCode="+matrixCode+"&examineFlag="+(-1);
	}else if(status == "jdbb"){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixManageStatementDetail.jsp?matrixCode="+matrixCode;
	}else if(status == "ndhz"){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixManageStatementDetailYear.jsp?matrixCode="+matrixCode;
	}else if(status == "update"){
		$("#username").attr("disabled",true);
		$("#username").css({ "background-color": "#f6f6f6"});
		openLayer("修改示范基地");
		getData(matrixCode);
	}else if(status == "delete"){
		if(confirm("确定删除此示范基地账户？")){
			deleteData(matrixCode);
		}
	}else if(status == "updateUsers"){
		openLayer2("批量导入用户");
	}
	
}

//查找
function getData(matrixCode){
	var params={
			"params.userCode":matrixCode,
			"params.page":1,
			"params.pageSize":10
		   }
	var url=getUrl();
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
				$("#userCodelayer").val(obj.userCode);
				$("#matrixNameLayer").val(obj.matrixName);
				$("#username").val(obj.username);
				$("#passwordLi").hide();
				$("#contacter").val(obj.contacter);
				$("#contactPhone").val(obj.contactPhone);
				$("#username").attr("title",obj.username);
			}
		},
		error:function(){
			alert("查询失败");
		}	
	});
	
}

//保存基地
function saveData(){
	var password = $("#password").val();
	var username = $("#username").val();
	var matrixName = $("#matrixNameLayer").val();
	var contacter = $("#contacter").val();
	var contactPhone = $("#contactPhone").val();
	var params={
				"params.matrixName":matrixName,
				"params.username":username,
				"params.password":faultylabs.MD5(password),
				"params.contacter":contacter,
				"params.contactPhone":contactPhone
			    }
	$.ajax({
		type : "post",
		url : rootPath+"/exemplaryMatrixFront/saveExemplaryMatrixUser.action",
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : params,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			if(data.status=="1"){
				alert("保存成功");
				layer.close(layer1);
				getExemplaryMatrixUserList();
				getSumForMatrixNoMonthly();//获取未填日报数
			}else if(data.status=="-100"){
				alert("用户名前缀非法，请修改");
			}else if(data.status=="-1000"){
				alert("该基地名称已经注册");
			}else if(data.status=="-10000"){
				alert("该手机号已经被注册，请更换");
			}
		},
		error:function(){
			alert("操作失败");
		}	
	});
}

//更新基地
function updateData(){

	var username = $("#username").val();
	var matrixName = $("#matrixNameLayer").val();
	var contacter = $("#contacter").val();
	var contactPhone = $("#contactPhone").val();
	var userCode = $("#userCodelayer").val();
	var params={
				"params.userCode":userCode,
				"params.matrixName":matrixName,
				"params.username":username,
				"params.contacter":contacter,
				"params.contactPhone":contactPhone
			    }
	$.ajax({
		type : "post",
		url : rootPath+"/exemplaryMatrixFront/updateExemplaryMatrixUser.action",
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : params,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			if(data.status=="1"){
				alert("保存成功");
				layer.close(layer1);
				getExemplaryMatrixUserList();
				getSumForMatrixNoMonthly();//获取未填日报数
			}else{
				alert("保存失败");
			}
		},
		error:function(){
			alert("操作失败");
		}	
	});

}

//删除基地
function deleteData(matrixCode){
	var params={"params.userCode":matrixCode}
	$.ajax({
		type : "post",
		url : rootPath+"/exemplaryMatrixFront/deleteExemplaryMatrixUser.action",
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : params,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			if(data.status=="1"){
				alert("删除成功");
				getExemplaryMatrixUserList();
				getSumForMatrixNoMonthly();//获取未填日报数
			}else{
				alert("删除失败");
			}
		},
		error:function(){
			alert("操作失败");
		}	
	});
}


//打开弹窗
function openLayer(title){
	layer1 = layer.open({
    	title:title,
        skin:"titorange",
        type:1,//可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        content:$('#addUserInfo'),
        btn: ['确定','取消'],
        btn1: function(index, layer){
        	var userCodeLayer = $("#userCodelayer").val();
        	if(userCodeLayer == ""){
        		if(examine(1)){
        			saveData();
        		}
        	}else{
        		if(examine(2)){
        			updateData();
        		}
        	}
        },
        btn2: function(index, layer){
        	// 按钮取消的回调
        },
        area: ['367px', 'auto'],
        success: function(layer, index){
        	// 打开时，清除之前输入内容
        	$('#addUserInfo ul li').each(function(){
        		$(this).find('input[type=text]').val('');
        	});
        }
	});
}

//打开弹窗
function openLayer2(title){
	layer2 = layer.open({
    	title:title,
        skin:"titorange",
        type:1,//可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        content:$('#addUsers'),
        btn: ['确定','取消'],
        btn1: function(index, layer){
        	window.layer.close(index);
        },
        btn2: function(index, layer){
        	// 按钮取消的回调
        },
//        area: ['367px', '280px'],
        success: function(layer, index){
        	
        }
	});
}


/**
 * 获取当月未填写月报示范基地数量
 */
function getSumForMatrixNoMonthly(){
	$("sumForMatrixNoMonthly").text(0)
	var params = {"params.district":district};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getSumForMatrixNoMonthly.action",
		async : false,
		timeout : 30000,
		data:params,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			$("#sumForMatrixNoMonthly").text(data['count']);
		}
	})
}





/**
 * 获取所在区列表
 */
function getDistrictSelect(){
	//清空十大服务下拉框
	$(".districtSelect").empty();
	//拼接请求参数
	var param = {'params.group':'district','params.parent':'120000'};
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
				for(var i=0;i<sysCodes.length;i++){
					html += "<option value='"+sysCodes[i].code+"'>"+sysCodes[i].name+"</option>";
				}
				$(".districtSelect").append(html);
				$(".districtSelect").selectOrDie('destroy');
				$(".districtSelect").selectOrDie();
			}
		}
	})
}

//校验
function examine(type){
	if(type == 1){
		var password = $("#password").val();
		var username = $("#username").val();
		var matrixName = $("#matrixNameLayer").val();
		var contacter = $("#contacter").val();
		var contactPhone = $("#contactPhone").val();
		
//		var reg1 = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/; //手机号校验
		var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;  
		var isMob=/^((\+?86)|(\+86))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;  

		var reg2=new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/); //密码校验
		
		if(matrixName == ""){
			alert("请输入基地名称");
			return false;
		}
		if(username == ""){
			alert("请输入账号");
			return false;
		}
		if(checkUsername(username)){
			alert("账号重复，请重新填写");
			return false;
		}
		if(password == ""){
			alert("请输入密码");
			return false;
		}
		if(contacter == ""){
			alert("请输入联系人");
			return false;
		}
		if(contactPhone == ""){
			alert("请输入联系电话");
			return false;
		}
		if(isPhone.test(contactPhone)==false&&isMob.test(contactPhone)==false){
			alert("电话号码格式不正确");
			return false;
		}
		if(reg2.test(password)==false||password.length<8||password.length>15){
			alert("密码为8到15位的字母和数字，请修改");
			return false;
		}
		if(username.length<4||username.length>60){
			alert("账号长度为4至60个字符，请修改");
			return false;
		}
		if(matrixName.length<0||matrixName.length>30){
			alert("基地名称长度为0至30个字符，请修改");
			return false;
		}
		if(contacter.length<0||contacter.length>10){
			alert("联系人长度为0至10个字符，请修改");
			return false;
		}
		return true;
		
	}else if(type == 2){
//		var reg1 = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/; //手机号校验
		var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;  
		var isMob=/^((\+?86)|(\+86))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;  

		var matrixName = $("#matrixNameLayer").val();
		var contacter = $("#contacter").val();
		var contactPhone = $("#contactPhone").val();
		
		if(matrixName == ""){
			alert("请输入基地名称");
			return false;
		}
		if(contacter == ""){
			alert("请输入联系人");
			return false;
		}
		if(contactPhone == ""){
			alert("请输入联系电话");
			return false;
		}
		if(isPhone.test(contactPhone)==false&&isMob.test(contactPhone)==false){
			alert("电话号码格式不正确");
			return false;
		}
		if(matrixName.length<0||matrixName.length>30){
			alert("基地名称长度为0至30个字符，请修改");
			return false;
		}
		if(contacter.length<0||contacter.length>10){
			alert("联系人长度为0至10个字符，请修改");
			return false;
		}
		return true;
	}
	
}

//验证用户名重复
function checkUsername(username){
	var ishad=false;
	//用户名重复性校验
	var param={
			"user.username":username
	}
	//向后台请求，查询用户名是否重复
	$.ajax({
		type : "post",
		url : rootPath + "/system/checkUsername.action",
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : param,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			if(data.status==0){
				ishad=true;
			}
		},
		error:function(){
			alert("查询异常");
			ishad=true;
		}
	});
	return ishad;
}



function uploadExcel(e) {
	//console.info("进入上传"+id)
	var id = $(e).attr("id");
	var $val = $(e).val();
	var $form = $val.slice($val.indexOf('.')+1, $val.length);
	if ($val != "" && ($form == "xls" || $form == "XLS")) {
		$.ajaxFileUpload({
			url : rootPath+"/exemplaryMatrixFront/updateExemplaryMatrixUserMany.action",// 用于文件上传的服务器端请求地址
			secureuri : false,// 一般设置为false
			fileElementId : id,// 文件上传空间的id属性 <input type="file" id="file" name="file" />
			dataType : 'json',// 返回值类型 一般设置为json
			success: function(data, status){ // 服务器成功响应处理函数
				var isQualified = data['isQualified'];
				if(isQualified == "true"){
					alert("上传成功！");
					var file = $("#excelImport");
					file.after(file.clone().val(""));
					file.remove();
					layer.close(layer2);
					getExemplaryMatrixUserList();
				}else{
					alert(isQualified);
					var file = $("#excelImport");
					file.after(file.clone().val(""));
					file.remove();
				}
			},
			error: function(data, status, e){ // 服务器响应失败处理函数
//				alert(status)
//				alert(e);
				alert("服务器原因上传失败！");
				var file = $("#excelImport");
				file.after(file.clone().val(""));
				file.remove();
			}
		})
	}else{
		alert('上传Excel文件与模版格式不符！！！');
		var file = $("#excelImport");
		file.after(file.clone().val(""));
		file.remove();
//		$(e).remove();
	}
}
function tochange(){
	$("#excelImport").click();
}

