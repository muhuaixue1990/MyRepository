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
	$("#gotoMatrixInfoManage").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	$("body").on("keyup","#jobContent",function(){
		limWord('#jobContent',500,'#jobContentShow i')
	})
	
	getMatrixInfoByCode();
	
	getList(getListParams(currentPage));
	
	
	$("#lastStep").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixInfoFive.jsp";
	})
	
	//新增
	$("#addPersonnel").click(function(){
		add();
	})
	
	//删除按钮
	$("#personnelList").on("click",".deleteBtn",function(){
		var id = $(this).attr("name");
		//执行删除方法
		deleteById(id);
	})
	
	//修改按钮
	$("#personnelList").on("click",".modifyBtn",function(){
		var id = $(this).attr("name");
		//执行修改方法
		mofifyInfo(id);
	})
	
	//完成按钮
	$("#complete").click(function(){
		if(personnelListSize < 10){
			alert("请最少填写十条管理和服务人员名单及职称情况！");
		}else{
			window.location.href = rootPath+"/page/jsp/enterpriseInfo/entConsoleIndex.jsp";
		}
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
				alert("您还未填写基地基本情况，请按照步骤填写！");
//				window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationOne.jsp";
			}
			
			if(status == "1"){
				var exemplaryMatrixApplication = data['exemplaryMatrixApplication'];
				
				if(exemplaryMatrixApplication.type == "0"
					&& exemplaryMatrixApplication.districtAuditType == "0"
					&& exemplaryMatrixApplication.cityAuditType == "0"
					&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "0"
							&& exemplaryMatrixApplication.cityAuditType == "0"
							&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
					$(".matrixApplicationInfo").attr("readonly","readonly");
					$(".matrixApplicationInfoRadio").iCheck('disable');
					$("#save").hide();
					$("#nextStep").hide();
					$("#cancel").show();
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "1"
							&& exemplaryMatrixApplication.cityAuditType == "0"
							&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& exemplaryMatrixApplication.cityAuditType == "0"
							&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
					$(".matrixApplicationInfo").attr("readonly","readonly");
					$(".matrixApplicationInfoRadio").iCheck('disable');
					$("#save").hide();
					$("#nextStep").hide();
					$("#cancel").show();
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& exemplaryMatrixApplication.cityAuditType == "3"
							&& exemplaryMatrixApplication.thirdPartyAuditType == "0"){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& (exemplaryMatrixApplication.cityAuditType == "3"||exemplaryMatrixApplication.cityAuditType=="0")
							&& exemplaryMatrixApplication.thirdPartyAuditType == "1"){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& (exemplaryMatrixApplication.cityAuditType == "3"||exemplaryMatrixApplication.cityAuditType=="0")
							&& exemplaryMatrixApplication.thirdPartyAuditType == "2"){
					$(".matrixApplicationInfo").attr("readonly","readonly");
					$(".matrixApplicationInfoRadio").iCheck('disable');
					$("#save").hide();
					$("#nextStep").hide();
					$("#cancel").show();
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& exemplaryMatrixApplication.cityAuditType == "1"
							&& (exemplaryMatrixApplication.thirdPartyAuditType == "2" || exemplaryMatrixApplication.thirdPartyAuditType == "1")){
				}else if(exemplaryMatrixApplication.type == "1"
							&& exemplaryMatrixApplication.districtAuditType == "2"
							&& exemplaryMatrixApplication.cityAuditType == "2"
							&& (exemplaryMatrixApplication.thirdPartyAuditType == "2" || exemplaryMatrixApplication.thirdPartyAuditType == "1")){
					$(".matrixApplicationInfo").attr("readonly","readonly");
					$(".matrixApplicationInfoRadio").iCheck('disable');
					$("#save").hide();
					$("#nextStep").hide();
					$("#cancel").show();
				}
				applicationId = exemplaryMatrixApplication.id;
				$("input[name='personnelList.exemplaryMatrixApplicationId']").val(exemplaryMatrixApplication.id);
			}
			
		}
	})
}


/**
 * 获取入驻企业列表参数
 */
function getListParams(currentPage){
	var params = {'params.userCode':userCode,
					'params.exemplaryMatrixApplicationId':applicationId,
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
	$("#personnelList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getPersonnelListByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var personnelList = data['personnelList'];
			var html = "";
			if(personnelList.length > 0){
				personnelListSize = personnelList.length;
				
				for(var i=0; i<personnelList.length; i++){
					html += '<tr>'
					html += '<td>'+personnelList[i].name+'</td>'
					if(personnelList[i].sex == '1'){
						html += '<td>男</td>'
					}else if(personnelList[i].sex == '0'){
						html += '<td>女</td>'
					}
					html += '<td>'+personnelList[i].age+'</td>'
					html += '<td>'+personnelList[i].educationBackground+'</td>'
					html += '<td title="'+personnelList[i].duty+'">'+personnelList[i].duty+'</td>'
					html += '<td title="'+personnelList[i].professionalTitle+'">'+personnelList[i].professionalTitle+'</td>'
					html += '<td title="'+personnelList[i].jobContent+'">'+personnelList[i].jobContent+'</td>'
					html += '<td>'
					html += '<a class="color_blue modifyBtn" name="'+personnelList[i].id+'">修改</a>'
					html += '<a class="color_blue deleteBtn" name="'+personnelList[i].id+'">删除</a>'
					html += '</td>'
					html += '</tr>'
				}
			}else{
				html += '<tr><td>未查询到数据</td></tr>'
			}
			
			$("#personnelList").append(html);
			
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
 * 添加按钮
 */
function add(){
	var index = layer.open({
		title:"新增管理和服务人员名单及职称情况",
		skin:"compInfo_0307",
		type:1,
		content:$('.addCompInfo'),
		btn: ['确定','取消'],
		btn1: function(index, layero){
			savePersonnelList(index);
			getList(getListParams(currentPage));
		},
		btn2: function(index, layero){
			//按钮取消的回调
			$(".empty").val("");
			limWord('#jobContent',500,'#jobContentShow i')
		},
		area: ['493px', '550px'],
		cancel:function(index){
			layer.close(index);
			//清空文本框
			$(".empty").val("");
			limWord('#jobContent',500,'#jobContentShow i')
		}
	})
}

/**
 * 保存管理和服务人员名单及职称情况信息
 */
function savePersonnelList(index){
	if(check()){
		$.ajax({
			type: "post",
			url: rootPath+"/exemplaryMatrixApplication/savePersonnelList.action",
			async : false,
			timeout : 30000,
			dataType:'json',
			data: $("#personnelListForm").serialize(),
			beforeSend: function(XMLHttpRequest){},
			success: function(data, textStatus){
				var status = data['status'];
				if(status == "0"){
					alert("保存失败！");
				}else{
					alert("保存成功！");
					layer.close(index);
					$(".empty").val("");
					limWord('#jobContent',500,'#jobContentShow i')
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
 * 验证
 */
function check(){
	var flag = true;
	var checkLength = $(".matrixApplicationInfo").length;
	$(".matrixApplicationInfo").each(function(index){
			var thisInput = $(this).val();
			if($.trim(thisInput) == ""){
				var str = $(this).parent().siblings("span").text();
				str = str.substring(0,str.length-1);
				alert(str+" 不能为空！");
				flag = false;
				return flag;
			}
	})
	
	if(flag){
		$("input[name='personnelList.age']").each(function(index){
			if($.trim($(this).val())!="" && isNaN($(this).val())){
				alert("年龄只能输入数字！请检查");
				flag=false;
				return flag;
			}
			
		})
	}
	
	if(flag){
		var reg=/^[1-9]\d*$/; //由 1-9开头 的正则表达式
		
		var age = $("input[name='personnelList.age']").val();
		
		if($.trim(age) != "" && !reg.test(age)){
			alert("年龄只能是正整数！请检查")
			flag = false;
			return flag;
		}
	}
	return flag;
}

function deleteById(id){
	layer.open({
		title:"提示",
		content:"确认删除该条记录吗？",
		btn: ['确 定', '取 消'],
		skin:'no-mb',
		area: ['325px', 'auto'],
		btn1:function(index, layero){    //button 确定
			//按钮确定的回调
			var params = {"params.id":id}
			$.ajax({
				type: "post",
				url: rootPath+"/exemplaryMatrixApplication/deletePersonnelListById.action",
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
		btn2:function(){                //button取消

		},

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
		url: rootPath+"/exemplaryMatrixApplication/getPersonnelListById.action",
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
				var personnelList = data['personnelList'];
				$("#id").val(personnelList.id);
				$("#name").val(personnelList.name);
				$("#age").val(personnelList.age);
				$("#educationBackground").val(personnelList.educationBackground);
				$("#duty").val(personnelList.duty);
				$("#professionalTitle").val(personnelList.professionalTitle);
				$("#jobContent").val(personnelList.jobContent);
				$("input[name='personnelList.sex'][value="+personnelList.sex+"]").iCheck('check');
				
				limWord('#jobContent',500,'#jobContentShow i')
				
				var index = layer.open({
					title:"修改管理和服务人员名单及职称情况",
					skin:"compInfo_0307",
					type:1,
					content:$('.addCompInfo'),
					btn: ['确定','取消'],
					btn1: function(index, layero){
						savePersonnelList(index);
						getList(getListParams(currentPage));
					},
					btn2: function(index, layero){
						//按钮取消的回调
						$(".empty").val("");
						limWord('#jobContent',500,'#jobContentShow i')
					},
					area: ['493px', '550px'],
					cancel:function(index){
						layer.close(index);
						//清空文本框
						$(".empty").val("");
						limWord('#jobContent',500,'#jobContentShow i')
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