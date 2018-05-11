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
	$("#exemplaryMatrixStetementListCity").addClass("leeOn");
	$(".leeOn").parents(".hsubnav").find("dl").show();
	$(".leeOn").parents(".hsubnav").find(".nav_title").addClass("on");
	$(".leeOn").parents(".hsubnav").find("i").addClass("open");
	$(".leeOn").parents("dd").show();
	
	//查询区的下拉框
	getDistrictSelect();
	
	//获取当前时间
	getNowTime();
	
	getList(getListParams(currentPage));
	
	$("#search").click(function(){
		getList(getListParams(currentPage));
	})
	
	//查询未填写当季度季报的企业数量
	getSumForMatrixNoMonthly();
	
	//当月未填写月报示范基地详情按钮
	$("#matrixNoMonthlyDetail").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/matrixNoMonthlyDetail.jsp";
	})
	
	//设置年份和季度下拉框
	getMonthlyStatementYears();
	
	//查看基地详细信息
	$("#matrixList").on("click",".examinInfo",function(){
		var matrixCode = $(this).attr("name");
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/districtExamineInfoOne.jsp?applicationUserCode="+matrixCode+"&examineFlag="+(-1);
	})
	
	
	//查看基地季度报表详情
	$("#matrixList").on("click",".examinQuarterStatement",function(){
		var matrixCode = $(this).attr("name");
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixManageStatementDetail.jsp?matrixCode="+matrixCode;
	})
	
	
	//查看基地年度报表详情
	$("#matrixList").on("click",".examinQuarterStatementYear",function(){
		var matrixCode = $(this).attr("name");
		window.location.href = rootPath+"/page/jsp/exemplaryMatrixNew/matrixManageStatementDetailYear.jsp?matrixCode="+matrixCode;
	})
	
	//导出季度报表按钮
	$("#exportQuarterStatement").click(function(){
		window.location.href = rootPath+"/exemplaryMatrixBackstage/exportMatrixQuarterStatement.action?district="+$("#districtForDownload").val()+"&year="+$("#year").val()+"&quarter="+$("#quarter").val()+"&auditType=1";
	})
	
	//导出年度报表按钮
	$("#exportYearStatement").click(function(){
		window.location.href = rootPath+"/exemplaryMatrixBackstage/exportMatrixYearStatement.action?district="+$("#districtForDownload").val()+"&year="+$("#year").val()+"&quarter=4&auditType=1";
	})
})

/**
 * 获取当前时间
 */
function getNowTime(){
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
	//设置年份
	year = nowTime.substring(0,4);
	
	var month = nowTime.substring(5,7);
	month = parseInt(month);
	if(month>=1 && month<=3){
		quarter = 1;
	}else if(month>=4 && month<=6){
		quarter = 2;
	}else if(month>=7 && month<=9){
		quarter = 3;
	}else if(month>=10 && month<=12){
		quarter = 4;
	}
}


/**
 * 设置年份和季度下拉框
 */
function getMonthlyStatementYears(){
	//清空列表
	$("#year").empty();
	$("#quarter").empty();
	
	var params = {"params.district":district}
	
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixBackstage/findHaveQuarterStatementTime.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var htmlYear = '';
			var htmlQuarter = '';
			
			var status = data['status'];
			if(status == 0){
				htmlYear += '<option value="">无数据</option>';
				htmlQuarter += '<option value="">无数据</option>';
			
			}else if(status == 1){
				var times = data['times'];
				for(var i=0;i<times.length;i++){
					if(times[i].serviceQuarter == quarter){
						htmlQuarter += '<option value="'+times[i].serviceQuarter+'" selected="selected">'+times[i].serviceQuarter+'</option>'
					}else{
						htmlQuarter += '<option value="'+times[i].serviceQuarter+'">'+times[i].serviceQuarter+'</option>'
					}
					
					if(i!=0){
						if(times[i].serviceYear == times[i-1].serviceYear){
							continue;
						}
					}
					if(times[i].serviceYear == year){
						htmlYear += '<option value="'+times[i].serviceYear+'" selected="selected">'+times[i].serviceYear+'</option>'
					}else{
						htmlYear += '<option value="'+times[i].serviceYear+'">'+times[i].serviceYear+'</option>'
					}
					
				}
			}
			$("#year").append(htmlYear);
			$("#year").selectOrDie('destroy');
			$("#year").selectOrDie();
			
			$("#quarter").append(htmlQuarter);
			$("#quarter").selectOrDie('destroy');
			$("#quarter").selectOrDie();
		}
	})
}


/**
 * 获取示范基地列表参数
 */
function getListParams(currentPage){
	
	var matrixName = $("#matrixName").val();
	
	//增加所属区查询根据区划分示范基地
	var params = {'params.userCode':userCode,
					'params.matrixName':matrixName,
					'params.district':$("#districtForSearch").val(),
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
 * 获取基地列表
 * @param params
 */
function getList(params){
	//清空列表
	$("#matrixList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMatrixListForStatementList.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params,
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			var exemplaryMatrixApplicationList = data['exemplaryMatrixApplicationList'];
			var html = "";
			if(exemplaryMatrixApplicationList.length!=0){
				for(var i=0; i<exemplaryMatrixApplicationList.length; i++){
					if(i%2 == 0){
						html += '<tr class="bgf6">'
					}else{
						html += '<tr class="">'
					}
					html += '<td  width=""><a href="javascript:;" class="color_blue examinInfo" name="'+exemplaryMatrixApplicationList[i].userCode+'">'+exemplaryMatrixApplicationList[i].matrixName+'</a></td>'
					html += '<td  width="">'+exemplaryMatrixApplicationList[i].district+'</td>'
					html += '<td  width=""><a href="javascript:;" class="color_blue examinQuarterStatement" name="'+exemplaryMatrixApplicationList[i].userCode+'">查看</a></td>'
					html += '<td  width=""><a href="javascript:;" class="color_blue examinQuarterStatementYear" name="'+exemplaryMatrixApplicationList[i].userCode+'">查看</a></td>'
					html += '</tr>'
				}
			}else{
				html = "<tr><td>未查询到数据</td></tr>";
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