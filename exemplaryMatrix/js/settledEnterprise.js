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
	$("#gotoSettledEnterpriseManage").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	$("body").on("keyup","#productProfession",function(){
		limWord('#productProfession',1000,'.textNum i')
	})
	
	//验证身份，只有是示范基地的才能填写报表
	verifyIdentity();
	
	getList(getListParams(currentPage));
	
	//查询按钮
	$("#search").click(function(){
		getList(getListParams(currentPage));
	})
	
	//新建入驻企业弹窗
//	注：新增（.insertBtn_0307）、查看（.selectBtn_0307）、修改（.updateBtn_0307）按钮点击都有弹窗，字段一样只写了一个
	$("body").on("click",".insertBtn_0307",function () {
		layer.open({
			title:"企业信息详情",
			skin:"compInfo_0307",
			type:1,//可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
			content:$('.addCompInfo'),
			btn: ['确定','取消'],
			btn1: function(index, layero){
				//按钮确定的回调
				saveOrUpdateSettledEnterprise(index);
			},
			btn2: function(index, layero){
				//按钮取消的回调
				//清空文本框
				$(".empty").val("");
				$("#contactPhone_error").hide();
				limWord('#productProfession',1000,'.textNum i')
				$("#uploadBtn").parent().next("div").children("img").attr("src","");
	        	$("#uploadBtn").parent().next("div").hide();
			},
			area: ['470px', '550px'],
			cancel:function(index){
				layer.close(index);
				//清空文本框
				$(".empty").val("");
				$("#contactPhone_error").hide();
				limWord('#productProfession',1000,'.textNum i')
				$("#uploadBtn").parent().next("div").children("img").attr("src","");
	        	$("#uploadBtn").parent().next("div").hide();
			}
		})
	});
	
	//上传图片按钮
	$("#uploadBtn").change(function () {
		upload($(this));
	})
	
	//修改按钮
	$("#settledEnterpriseList").on("click",".modifyBtn",function(){
		var id = $(this).attr("name");
		//执行修改方法
		mofifyInfo(id);
	})
	
	//删除按钮
	$("#settledEnterpriseList").on("click",".deleteBtn",function(){
		var id = $(this).attr("name");
		//执行删除方法
		deleteById(id);
	})
	
	
	//查看企业信息
	$("#settledEnterpriseList").on("click",".examineInfo",function(){
		var id = $(this).attr("name");
		//执行查看信息方法
		examineInfo(id);
	})
	
	//导入
	$("#saveByfile").change(function(){
		uploadInfo($(this));
	})
	
	//20180321添加手机号格式验证
	$("#contactPhone").blur(function(){
		var phone=$.trim($(this).val());
		//非空校验
		if(phone==""){
			$(this).val("");
			$("#contactPhone_error").text("联系电话为空");
			$("#contactPhone_error").show();
			$(this).addClass("error");
			//refreshCode();
			return;
		}
		//格式校验
		var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/; 
		var isPhone = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
		var isPhone2 = /^\d{7,8}(-\d{1,6})?$/;
		if(reg.test(phone)==false && isPhone.test(phone)==false && isPhone2.test(phone)==false){
			//格式错误
			$("#contactPhone_error").text("联系电话格式不正确");
			$("#contactPhone_error").show();
			$(this).addClass("error");
			//refreshCode();
			return;
		}
		$("#contactPhone_error").hide();
		$(this).removeClass("error");
	});
})

/**
 * 验证身份，只有是示范基地的才能填写报表
 */
function verifyIdentity(){
	var params = {'params.userCode':userCode}
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/findExemplaryMatrixInfoByUserCode.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("您提交的示范基地信息还未通过审核，请稍后再试！");
				window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoOne.jsp";
			}
		}
	})
}

/**
 * 导入企业信息
 */
function uploadInfo(e){
	//获取当前input框id属性值
	var id = e.attr("id");
	var $val = e.val();
	//上传文件格式jpg,png
	var $form =$val.slice(-4,$val.length);
	if ($val!=""&&$form=="xlsx") {
		$.ajaxFileUpload({
	        url : rootPath+"/exemplaryMatrixBackstage/saveSettledEnterpriseForFile.action?userCode="+userCode+"&fileType="+id ,//用于文件上传的服务器端请求地址
	        secureuri : false,//一般设置为false
	        fileElementId : id,//文件上传空间的id属性  <input type="file" id="file" name="file" />
	        //dataType: 'json',//返回值类型 一般设置为json
	        success: function (data, status){
	        	var status = $(data).text();
	        	if(status == "1"){
	        		alert("导入成功！");
	        		getList(getListParams(currentPage));
	        	}else if(status == "0"){
	        		alert("导入失败！")
	        	}else if(status == "-1"){
	        		alert("您上传的并非模板文件，请重新上传！")
	        	}
	        },
	        error: function (data, status, e)//服务器响应失败处理函数
	        {
	            alert(e);
	        },
	        complete: function(xmlHttpRequest) {
	        	var count = Math.random();
	        	e.replaceWith('input type="file" class="inputBtn" accept=".xlsx" id="'+id+'" name="file" style="title:'+count+'"');  
	        	$("#"+id+"").on("change", function(){  
	        		uploadInfo($(this));
                });
            }
	    });
	}else{
		alert("只能上传Excel文件！");
	}
}


/**
 * 查看信息方法
 * @param id
 */
function examineInfo(id){
	var params = {"params.id":id};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findSettledEnterpriseById.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("查询信息失败！");
			}else if(status == "1"){
				var exemplaryMatrixSettledEnterprise = data['exemplaryMatrixSettledEnterprise'];
				$("#id").val(exemplaryMatrixSettledEnterprise.id);
				$("#enterName").val(exemplaryMatrixSettledEnterprise.enterName);
				$("#registeredAddress").val(exemplaryMatrixSettledEnterprise.registeredAddress);
				$("#legalRepresentative").val(exemplaryMatrixSettledEnterprise.legalRepresentative);
				$("#contacter").val(exemplaryMatrixSettledEnterprise.contacter);
				$("#contactPhone").val(exemplaryMatrixSettledEnterprise.contactPhone);
				$("#productProfession").val(exemplaryMatrixSettledEnterprise.productProfession);
				var allPicture = exemplaryMatrixSettledEnterprise.picture;
				var fileName = allPicture.substring(allPicture.lastIndexOf("/")+1,allPicture.length);
	        	if(fileName!="" && fileName!='null'){
	        		$("#uploadBtn").parent().next("div").children("img").attr("src",allPicture);
		        	$("#uploadBtn").parent().next("div").show();
		        	$("#picture").val(fileName);
	        	}
				limWord('#productProfession',1000,'.textNum i')
				$(".empty").attr("readonly","readonly");
				
				$("#uploadBtn").attr("disabled","disabled");
				$(".tip_close2").attr("style","display:none");
				
				layer.open({
					title:"企业信息详情",
					skin:"compInfo_0307",
					type:1,//可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
					content:$('.addCompInfo'),
					btn: ['确定','取消'],
					btn1: function(index, layero){
						//按钮确定的回调
						$(".empty").val("");
						$("#contactPhone_error").hide();
						limWord('#productProfession',1000,'.textNum i')
						$(".empty").removeAttr("readonly");
						layer.close(index);
						$("#uploadBtn").parent().next("div").children("img").attr("src","");
			        	$("#uploadBtn").parent().next("div").hide();
			        	$("#uploadBtn").removeAttr("disabled")
			        	$(".tip_close2").removeAttr("style")
			        	$("#id").val("");
					},
					btn2: function(index, layero){
						//按钮取消的回调
						//清空文本框
						$(".empty").val("");
						$("#contactPhone_error").hide();
						limWord('#productProfession',1000,'.textNum i')
						$(".empty").removeAttr("readonly");
						$("#uploadBtn").parent().next("div").children("img").attr("src","");
			        	$("#uploadBtn").parent().next("div").hide();
			        	$("#uploadBtn").removeAttr("disabled")
			        	$(".tip_close2").removeAttr("style")
			        	$("#id").val("");
					},
					area: ['470px', '550px'],
					cancel:function(index){
						layer.close(index);
						//清空文本框
						$(".empty").val("");
						$("#contactPhone_error").hide();
						limWord('#productProfession',1000,'.textNum i')
						$(".empty").removeAttr("readonly");
						$("#uploadBtn").parent().next("div").children("img").attr("src","");
			        	$("#uploadBtn").parent().next("div").hide();
			        	$("#uploadBtn").removeAttr("disabled")
			        	$(".tip_close2").removeAttr("style")
			        	$("#id").val("");
					}
				})
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
 * 删除方法
 * @param id
 */
function deleteById(id){
//	删除弹窗
	layer.open({
		title:"提示",
		skin:"compInfo_0307",
		type:1,
		content:$(".delCompInfo"),
		btn: ['确定','取消'],
		btn1: function(index, layero){
			//按钮确定的回调
			var params = {"params.id":id}
			$.ajax({
				type: "post",
				url: rootPath+"/exemplaryMatrixBackstage/deleteSettledEnterpriseById.action",
				async : false,
				timeout : 30000,
				dataType:'json',
				data: params,
				beforeSend: function(XMLHttpRequest){},
				success: function(data, textStatus){
					var status = data['status'];
					if(status == "0"){
						alert("删除失败！");
					}else if(status == "1"){
						alert("删除成功！");
						layer.close(index);
						getList(getListParams(currentPage));
					}
				}
			})
		},
		btn2: function(index, layero){
			//按钮取消的回调
		},
		area: ['500px', '200px']
	})
}

/**
 * 修改方法
 * @param id
 */
function mofifyInfo(id){
	var params = {"params.id":id};
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findSettledEnterpriseById.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var status = data['status'];
			if(status == "0"){
				alert("查询信息失败！");
			}else if(status == "1"){
				var exemplaryMatrixSettledEnterprise = data['exemplaryMatrixSettledEnterprise'];
				$("#id").val(exemplaryMatrixSettledEnterprise.id);
				$("#enterName").val(exemplaryMatrixSettledEnterprise.enterName);
				$("#registeredAddress").val(exemplaryMatrixSettledEnterprise.registeredAddress);
				$("#legalRepresentative").val(exemplaryMatrixSettledEnterprise.legalRepresentative);
				$("#contacter").val(exemplaryMatrixSettledEnterprise.contacter);
				$("#contactPhone").val(exemplaryMatrixSettledEnterprise.contactPhone);
				$("#productProfession").val(exemplaryMatrixSettledEnterprise.productProfession);
				
				var allPicture = exemplaryMatrixSettledEnterprise.picture;
				var fileName = allPicture.substring(allPicture.lastIndexOf("/")+1,allPicture.length);
	        	if(fileName!="" && fileName!='null'){
	        		$("#uploadBtn").parent().next("div").children("img").attr("src",allPicture);
		        	$("#uploadBtn").parent().next("div").show();
		        	$("#picture").val(fileName);
	        	}
	        	
				
				limWord('#productProfession',1000,'.textNum i')
				
				
				layer.open({
					title:"企业信息详情",
					skin:"compInfo_0307",
					type:1,//可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
					content:$('.addCompInfo'),
					btn: ['确定','取消'],
					btn1: function(index, layero){
						//按钮确定的回调
						saveOrUpdateSettledEnterprise(index);
						$("#id").val("");
					},
					btn2: function(index, layero){
						//按钮取消的回调
						//清空文本框
						$(".empty").val("");
						$("#contactPhone_error").hide();
						limWord('#productProfession',1000,'.textNum i')
						$("#uploadBtn").parent().next("div").children("img").attr("src","");
			        	$("#uploadBtn").parent().next("div").hide();
			        	$("#id").val("");
					},
					area: ['470px', '550px'],
					cancel:function(index){
						layer.close(index);
						//清空文本框
						$(".empty").val("");
						$("#contactPhone_error").hide();
						limWord('#productProfession',1000,'.textNum i')
						$("#uploadBtn").parent().next("div").children("img").attr("src","");
			        	$("#uploadBtn").parent().next("div").hide();
			        	$("#id").val("");
					}
				})
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
 * 插入/更新数据
 */
function saveOrUpdateSettledEnterprise(index){
	if(check()){
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixBackstage/saveOrUpdateSettledEnterprise.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: $("#settledEnterPriseForm").serialize(),
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("保存失败！");
				}else if(status == "1"){
					alert("保存成功！");
					layer.close(index);
					getList(getListParams(currentPage));
					//清空文本框
					$(".empty").val("");
					$("#contactPhone_error").hide();
					limWord('#productProfession',1000,'.textNum i')
					$("#uploadBtn").parent().next("div").children("img").attr("src","");
		        	$("#uploadBtn").parent().next("div").hide();
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
 * 验证参数是否为空方法
 */
function check(){
	var flag = true
	$(".checkMsg").each(function(){
		var thisInput = $(this).val();
		if($.trim(thisInput) == ""){
			var str = $(this).siblings("span").text();
			str = str.substring(0,str.length-1);
			alert(str+" 不能为空！");
			flag = false;
			return flag;
		}
	})
	//20180321添加手机号验证
	if(flag){
		var phone = $("#contactPhone").val();
		//格式校验
		var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/; 
		var isPhone = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
		var isPhone2 = /^\d{7,8}(-\d{1,6})?$/;
		if(reg.test(phone)==false && isPhone.test(phone)==false && isPhone2.test(phone)==false){
			alert("联系电话格式不正确！");
			$("#contactPhone_error").text("联系电话格式不正确");
			$("#contactPhone_error").show();
			flag = false;
			return flag;
		}
	}
	return flag;
}

//上传文件
function upload(e){
	//获取当前input框id属性值
	var id = e.attr("id");
	var $val = e.val();
	//上传文件格式jpg,png
	var $form =$val.slice(-3,$val.length);
	if ($val!=""&&($form=="jpg"||$form=="png"||$form=="PNG"||$form=="JPG")) {
		$.ajaxFileUpload({
	        url : rootPath+"/exemplaryMatrixBackstage/uploadFile.action?userCode="+userCode+"&fileType="+id ,//用于文件上传的服务器端请求地址
	        secureuri : false,//一般设置为false
	        fileElementId : id,//文件上传空间的id属性  <input type="file" id="file" name="file" />
	        //dataType: 'json',//返回值类型 一般设置为json
	        success: function (data, status){
	        	var allFileName = $(data).text();
	        	if("图片大小不得超过3M" == allFileName){
	        		alert(allFileName);
	        	}else{
	        		alert("上传成功！");
	        		$("#"+id).parent().next("div").children("img").attr("src",allFileName);
		        	$("#"+id).parent().next("div").show();
		        	
		        	var fileName = allFileName.substring(allFileName.lastIndexOf("/")+1,allFileName.length);
		        	$("#picture").val(fileName);
	        	}
	        },
	        error: function (data, status, e)//服务器响应失败处理函数
	        {
	            alert(e);
	        },
	        complete: function(xmlHttpRequest) {
	        	var count = Math.random();
	        	e.replaceWith('input type="file" class="inputBtn" accept="image/jpeg,image/gif,image/png" id="'+id+'" name="file" style="title:'+count+'"');  
	        	$("#"+id+"").on("change", function(){  
	        		upload($(this));
                });
            }
	    });
	}else{
		alert("只能上传图片文件！");
	}
}


/**
 * 获取入驻企业列表参数
 */
function getListParams(currentPage){
	
	var enterName = $("#enterNameParam").val();
	
	var params = {'params.userCode':userCode,
					'params.enterName':enterName,
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

/**
 * 获取月报列表方法
 */
function getList(params){
	//清空列表
	$("#settledEnterpriseList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findSettledEnterpriseList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var exemplaryMatrixSettledEnterprises = data['exemplaryMatrixSettledEnterprises'];
			var html = "";
			if(exemplaryMatrixSettledEnterprises.length > 0){
				for(var i=0; i<exemplaryMatrixSettledEnterprises.length; i++){
					html += '<tr class="bgf6">';
					html += '<td  width=""><a href="javascript:;" class="color_blue selectBtn_0307 examineInfo" name="'+exemplaryMatrixSettledEnterprises[i].id+'">'+exemplaryMatrixSettledEnterprises[i].enterName+'</a></td>';
					html += '<td  width="">'+exemplaryMatrixSettledEnterprises[i].legalRepresentative+'</td>';
					html += '<td  width="">'+exemplaryMatrixSettledEnterprises[i].contacter+'</td>';
					html += '<td  width="">'+exemplaryMatrixSettledEnterprises[i].contactPhone+'</td>';
					html += '<td  width="">';
					html += '<a class="color_blue updateBtn_0307 modifyBtn" name="'+exemplaryMatrixSettledEnterprises[i].id+'">修改</a>';
					html += '<a class="color_blue deleteBtn_0307 deleteBtn" name="'+exemplaryMatrixSettledEnterprises[i].id+'">删除</a>';
					html += '</td>';
					html += '</tr>';
				}
			}else{
				html += '<tr><td>未查询到数据</td></tr>'
			}
			
			$("#settledEnterpriseList").append(html);
			
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