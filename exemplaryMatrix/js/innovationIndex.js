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

//加载完成后执行
$(function(){
	//头的样式
	$("#navigationBar li").removeAttr("class");
	$("#special").attr("class","current");
	
	getDistrict();
	getMatrixForIndexByParams(getListParams(currentPage,code));
	
	$("#application").click(function(){
		window.location.href = rootPath+"/page/jsp/exemplaryMatrix/applicationOne.jsp";
	})
	
	getNews();
	
	$("#newsUl").on("click",".detailA",function(){
		var id = $(this).attr("name");
		window.location.href = rootPath+"/page/jsp/news/newsInfo.jsp?id="+id;
	})
	
	$("#districtList li").click(function(){
		code = $(this).attr("name");
		getMatrixForIndexByParams(getListParams(currentPage,code));
		$("#districtList>li").removeClass("li_top_cur");
		$(this).addClass("li_top_cur");
	})
	
	$("#matrixList").on("click",".leeMore1",function(){
		var userCode = $(this).attr("name");
		window.location.href = rootPath + "/page/jsp/facilitatingAgency/detailForFacilitatingAgency.jsp?entUserCode="+userCode;
	})
	
})

function getNews(){
	$("#newsUl").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/entrepreneurship/getNews.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			var news = data['news'];
			var html = "";
			if(news.length>10){
				for(var i=0;i<10;i++){
					html += '<li><a name="'+news[i].id+'" class="detailA">'+news[i].publishTitle+'</a></li>';
				}
			}else if(news.length>0 && news.length<=10){
				for(var i=0;i<news.length;i++){
					html += '<li><a name="'+news[i].id+'" class="detailA">'+news[i].publishTitle+'</a></li>';
				}
			}
			$("#newsUl").append(html);
		}
	})
}

function getListParams(currentPage,code){
	var params = {'params.code':code,
					'params.currentPage':currentPage,
				  	'params.pageSize':pageSize};
	return params;
}

/**
 * 分页回调
 */
function pageCallback(index,jq){
	currentPage = index + 1;
	getMatrixForIndexByParams(getListParams(currentPage,code));
}

/**
 * 创业创新首页查询基地信息列表
 * @param params
 */
function getMatrixForIndexByParams(params){
	$("#matrixList").empty();
	$.ajax({
		type: "post",
		url: rootPath+"/exemplaryMatrixApplication/getMatrixForIndexByParams.action",
		async : false,
		timeout : 30000,
		dataType:'json',
		data: params , 
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			totalPage=Math.ceil(data['count']/pageSize);
			
			var matrixList = data['matrixList'];
			var html = "";
			for(var i=0; i<matrixList.length; i++){
				html += '<li>'
				html += '<img src="'+matrixList[i].enterpriseLogoPic+'" alt="">'
				html += '<ul class="h154">'
				html += '<li>'
				html += '<span>基地名称：</span>'
				html += '<p>'+matrixList[i].matrixName+'</p>'
				html += '</li>'
				html += '<li>'
				html += '<span>基地地址：</span>'
				html += '<p>'+matrixList[i].matrixAddress+'</p>'
				html += '</li>'
				html += '<li>'
				html += '<span>联系人：</span>'
				html += '<p>'+matrixList[i].contacter+'</p>'
				html += '</li>'
				html += '<li>'
				html += '<span>联系电话：</span>'
				html += '<b>'+matrixList[i].contactPhone+'<a class="leeMore1" name="'+matrixList[i].userCode+'">【详情】</a></b>'
				html += '</li>'
				html += '<li>'
				html += '</ul>'
				html += '</li>'
				
				
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

//获取诉求类别方法
function getDistrict(){
	$("#districtList").empty();
	//拼接请求参数
	var param = {'params.group':'district',
					'params.parent':'120000'};
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
			if(1==status){
				var sysCodes = data['sysCodes'];
				var html = "";
				html += '<li class="li_top_cur" name="">全市</li>';
				for(var i=0;i<sysCodes.length;i++){
					html += '<li name="'+sysCodes[i].code+'">'+sysCodes[i].name+'</li>'
				}
				$("#districtList").append(html);
			}
		}
	})
}