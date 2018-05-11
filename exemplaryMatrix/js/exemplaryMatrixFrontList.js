/**
 * 示范基地前台
 */

var  page  =  1 ;
var  pageSize  =  9 ;



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
	var epage = getCookie("epage");
	if(epage>1){
		page = epage;
		delCookie("epage");
	}
	getExemplaryMatrixList();
})

//获取示范基地列表
function getExemplaryMatrixList(page1){
	if(isnull(page1)){
		page = page1
	}
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

function goExemplaryMatrix(userCode){
	setCookie("epage",page);
	window.location.href=rootPath+"/page/jsp/exemplaryMatrixNew/exemplaryMatrixFrontDetails.jsp?keyid="+userCode;
}

function getUrl(){
	var url=rootPath+"/exemplaryMatrixFront/getExemplaryMatrixListForFront.action";
	return url;
}

function getParams(){
	//参数获取
	var params;
	var district = $("#district").val();
	var companyName = $("#companyName").val();
	
	params={
			"params.district":district,
			"params.companyName":companyName,
			"params.page":page,
			"params.pageSize":pageSize
		   }
	
	return params;
}

//获取示范基地列表分页回调
function getExemplaryMatrixListCallback(index){
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


//清空数据填充区域
function clearTarget(){
	$("#exemplaryMatrixList").empty();
}

//重置分页
function resetPagination(){
	$("#pagination").remove();
	$("#totalpage").remove();
	var $pagination=$("<div id='pagination' class='pagination'></div>");
	$("#paginationParent").append($pagination);
	var $totalPage=$("<span id='totalpage' class='totalpage'></span>");
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
	var html=$('script[type="text/template_exemplaryMatrixList"]').html();
	return html;
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
	    	if(o.enterpriseLogoPic == null || o.enterpriseLogoPic == '' || typeof(o.enterpriseLogoPic) == "undefined" ){
	    		o.enterpriseLogoPic = rootPath+"/page/imgs/sfjd_no_img.png"
	    	}
	        //这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
	        arr.push(formatTemplate(o, html)); 		            
	    });   
		
	    //把数组化成字符串，并添加到模板标签的父标签中去。   
	    $('#exemplaryMatrixList').append(arr.join(''));
	    var $height = $(window).height()-$('.header-layout4').height()-$('.footer_warp').outerHeight()-$('.minH1').outerHeight()-38
	    $('.minH').css('minHeight',$height)
		
	    var total_page=Math.ceil(data.data.total/pageSize);
	    //设置分页
	    $("#pagination").pagination(data.data.total,{
			callback: getExemplaryMatrixListCallback,
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

function setCookie(name,value)
{
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name)
{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
}

function delCookie(name)
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null)
	document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function  isnull(str){
	if(typeof(str) != "undefined"&&str!=null&&str!=""){
		return true;
	}else{
		return false;
	}
}

