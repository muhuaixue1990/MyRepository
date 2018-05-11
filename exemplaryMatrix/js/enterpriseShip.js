/** 本页列表数据的格式
 *	{
 * 		"status": 1,
 * 		"data": {
 *   		"page": 1,
 *   		"pageSize": 5,
 *   		"total": 0,
 *   		"data": [
 *     
 *   		]
 * 		},
 * 		"msg": "success"
 *	}
 * */
//默认分页
var pageSize=10;
$(function(){
	//头的样式
	$("#navigationBar li").removeAttr("class");
	$("#serviceModule").attr("class","current");
	//进入页面首先进行页面初始化，查询服务分类信息
	$.ajax({
		type : "post",
		async : false,
		url: $("#rootPath").val() + "/serviceItems/selectServiceType.action",
		timeout : 30000,
		dataType : 'json',
		data : {},
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			//数据填充
			if(data.status==1){
				//获取四个html模板
				var notypeHtml=$('script[type="text/template_service_type_notype"]').html();
				var firstHtml=$('script[type="text/template_service_type_first"]').html();
				var commonHtml=$('script[type="text/template_service_type_common"]').html();
				var otherHtml=$('script[type="text/template_service_type_other"]').html();
		        //定义一个数组，用来接收格式化合的数据   
		        var arr = [];   
		        //对数据进行遍历   (数据格式统一，data.data.data为需要迭代的数据list)
		        //计数器
		        var count=0;
		        arr.push(notypeHtml);
		        $.each(data.data, function(index, o) {   
		            //这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
		            if(count==0){		            	
		            	arr.push(formatTemplate(o,firstHtml)); 		            
		            }
		            else if(count==data.data.length-1){
		            	arr.push(formatTemplate(o, otherHtml));
		            }
		            else{		            	
		            	arr.push(formatTemplate(o, commonHtml));
		            }
		            count++;
		        });   
		        //把数组化成字符串，并添加到模板标签的父标签中去。   
		        $('#serviceType').append(arr.join(''));
			}
		},
		error:function(e){
			alert("页面加载异常");
		}
	});
	//进入页面后，获取url中传递的参数，根据参数选中相应选项，并查询，url中需要三个参数，searchType,serviceType,district
	if(typeof(getParamArr())!='undefined'){
		//获取url参数
		var paramArr=getParamArr();
		var searchType=paramArr[0];
		var serviceType=paramArr[1];
		var district=paramArr[2];
		//选中相应的标签
		if(searchType!="-1"){
			//选中相应的查询类别
			$("#searchType>li[value="+searchType+"]").addClass("classify_cur");
			$("#searchType>li[value="+searchType+"]").siblings().removeClass("classify_cur");;
		}
		if(serviceType!="0"){
			$("#serviceType>li[value='"+serviceType+"']").addClass('li_top_cur');
			$("#serviceType>li[value='"+serviceType+"']").siblings().removeClass('li_top_cur');
		}
		if(district!="120000"){
			$("#district>li[value='"+district+"']").addClass('li_top_cur');
			$("#district>li[value='"+district+"']").siblings().removeClass('li_top_cur');
		}
		//根据页面条件查询
		//查找类型不为空时
		if(typeof($("#searchType>li[class='classify_cur']").val())=='undefined'){
			alert("请选择查找类型");
			return;
		}
		//根据选择的不同类型设置页面的html
		createHtmlBySearchType();
		//根据条件查询
		selectByPageExample();
	}	
	/**
	 * 页面上一共有六类点击事件
	 * 	1、点击找服务，找机构、找需求、找活动分别无条件查询
	 * 	2、点击服务父分类，页面组合查询，页面所有条件全部作为查询条件
	 * 	3、点击服务子分类，页面组合查询，页面所有条件全部作为查询条件
	 * 	4、点击服务区域，页面组合查询，页面所有条件全部作为查询条件
	 * 	5、点击好评率或服务次数，页面组合查询，页面所有条件全部作为查询条件
	 * 	6、点击关键词，页面组合查询，页面所有条件全部作为查询条件
	 * 分析：
	 * 	根据不同的searchtype作为判断条件，为html和url赋值，后台的查询方法有两个，一个为无条件查询，一个为全条件查询
	 * 	查询1，使用无条件查询，2、3、4、5、6使用全条件查询
	 * 分类：
	 * 	查询1：无条件查询
	 * 	查询5：需要根据点击设置按钮的值，全条件查询
	 * 	查询2：需要两个查询，首先根据父类查询子类，其次根据全条件查询
	 * 	查询3：出现事件冒泡，全条件查询
	 * 查询4、6：全条件查询
	 * */
	//为找服务、找机构等不同的li绑定事件
	//此绑定事件为页面查询1（已完成）
	$("#searchType").children().click(function(){
		//原跳转
		//var path=$("#rootPath").val()+"/page/jsp/facilitatingAgency/facilitatingAgencyList.jsp?searchType="+$(this).val()+"&serviceType="+"000000"+"&district=120000"
		//window.location.href=path;
		
		
		
		//现跳转
		var path=window.location.href.split("?")[0]+"?searchType="+$(this).val()+"&serviceType="+"000000"+"&district=120000"
		window.location.href=path;
		
		
		/*
		//为选中li添加样式，删除兄弟节点样式
		$(this).addClass("classify_cur");
		$(this).siblings().removeClass("classify_cur");
		//设置动态的html
		createHtmlBySearchType();
		//隐藏子分类显示框 
		$("#subtype_ul").children().remove();
	    $("#subtype_ul").hide();
		//步骤1：重置页面，并添加样式
		//好评率和服务次数排序按钮value设置为0
		$("#scoreSortButton").val("0");
		$("#serviceCountSortButton").val("0");
		//搜索框清空
		$("#keyword").val("");
		//服务分类和和地区分类变为不限
		$("#noServiceType").addClass("li_top_cur");
		$("#noServiceType").siblings().removeClass("li_top_cur");
		//地区清空
		$("#allDistrict").addClass("li_top_cur");
		$("#allDistrict").nextAll().removeClass("li_top_cur");	
		//默认第一页
		var page=1;
		//页面查询
		//根据大分类获取数据模板和无条件查询的url
		var html=getHtml();
		var url=getUrl();
		//获取无条件查询的参数
		var param=getParamMapNoExample(page,pageSize);
		//步骤4：点击相应节点发送相应的ajax请求，url和html模版在之前判断选择赋值
		$.ajax({
			type : "post",
			url : url,
			async : false,
			timeout : 30000,
			dataType : 'json',
			data : param,
			beforeSend : function(XMLHttpRequest) {
			},
			success:function(data){
				//重置分页(删除原分页div和显示总页数span，并增加新的div和span)
				resetPagination();
				//清除目标区域的li（targetUL为填充数据的目标区域）
				clearTarget();
				//显示无条件查询数据
				showData(data);
			},
			error:function(){
				alert("查询失败1");
			}	
		});
		//如果为找需求，需要添加星星
		createScoreImg();
		//修改样式
		addRightStyle();
		*/	
	});
	//排序按钮添加事件，每点击一次都更新状态，是否排序
	//(逻辑为，点击一次同时改变自己状态和兄弟状态，连点两次不改变自身状态和兄弟状态，这样保证两个按钮最多一个为1，可以同时为0)
	//为两个排序按钮同时添加点击事件，为查询5（已完成）
	//只有找服务和找机构用到此方法
	$("#sort>li").click(function(){
		//步骤1：设置自己和兄弟按钮的value
		if($(this).val()=='0'){
			if($(this).siblings().val()=='0'){				
				$(this).val("1");
				//$("#scoreSortImg").show();
			}
			else{
				$(this).val("1");
				//$("#scoreSortImg").hide();
				$(this).siblings().val("0");
			}
		}
		else
			$(this).val('0');		
		//默认第一页
		var page=1;
		//步骤2：获取页面参数
		var paramArr=getPageParamObject();
		if(paramArr[0]=="-1"){
			alert("请选择查询项目");
			return;
		}
		//根据大分类获取页面条件查询的url和数据模板
		var html=getHtml();
		var url=getUrlByExample();
		//获取参数对象
		var param=getParamMap(page, pageSize);
		//步骤4：清楚目标区域的li（targetUL为填充数据的目标区域）
        $("#targetUL").children().remove();
		//步骤5：根据页面条件向后台发送ajax请求，获取数据并填充数据
		$.ajax({
			type : "post",
			url : url,
			async : false,
			timeout : 30000,
			dataType : 'json',
			data : param,
			beforeSend : function(XMLHttpRequest) {
			},
			success:function(data){
				//重置分页
				resetPagination();
				//数据填充
				if(data.status==1){
					//html模版已经在之前获取
			        //定义一个数组，用来接收格式化合的数据   
			        var arr = [];   
			        //对数据进行遍历   (数据格式统一，data.data.data为需要迭代的数据list)
			        $.each(data.data.data, function(index, o) {   
			            //这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
			            arr.push(formatTemplate(o, html)); 		            
			        });   
			        //把数组化成字符串，并添加到模板标签的父标签中去。   
			        $('#targetUL').append(arr.join(''));
				}
				//设置分页
				var total_page=Math.ceil(data.data.total/pageSize);
				//设置分页
				$("#pagination").pagination(data.data.total,{
					callback:selectByExample,
					items_per_page : pageSize,				
					prev_text:"上一页",
					next_text:"下一页",
					num_edge_entries : 3,			//边缘值
					ellipse_text : '...',			//边缘显示
					num_display_entries : 10,		//显示条数
					current_page : 0,
					link_to : 'javascript:void(0)'
				});
				$("#totalPage").text("共"+total_page+"页");
			},
			error:function(){
				alert("查询异常");
			}
		});
		//如果为找需求，需要添加星星
		createScoreImg();
		//修正样式
		addRightStyle();
	});
	
	//为每个父类型，地区，关键词绑定事件，为查询2（已完成）
	$("#serviceType>li").click(function(){
		//添加样式
		$(this).addClass('li_top_cur').find('.li_down').show();
		$(this).siblings().removeClass('li_top_cur');
		
		//向后台查询子类型，并生成对应的html
		var serviceType=$(this).val();
		if(serviceType=="000000"){
			//如果为0，则直接清空目标区域，隐藏显示框
	        $("#subtype_ul").children().remove();
	        $("#subtype_ul").hide();
		}
		else{
			//后台查数据(第一个ajax的参数)
			var param={
					"serviceItems.serviceType":serviceType
			}
			//第一个ajax请求，请求子类型
			$.ajax({
				type : "post",
				//根据服务父类型查询所有服务子类型（公共方法，定义在serviceItemsAction里）
				url : $("#rootPath").val() + "/serviceItems/selectSubTypeByParentType.action",
				async : false,
				timeout : 30000,
				dataType : 'json',
				data : param,
				beforeSend : function(XMLHttpRequest) {
				},
				success:function(data){
					//数据填充
					if(data.status==1){
						//获取模板上的HTML(此方式为html数据填充方式)   
						var html = $('script[type="text/template_serviceSubtype"]').html();   
						//定义一个数组，用来接收格式化合的数据   
						var arr = [];   
						//对数据进行遍历   
						$.each(data.data, function(index, o) {   
							//这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
							arr.push(formatTemplate(o, html)); 		            
						});   
						//清楚目标区域的li
						$("#subtype_ul").children().remove();
						//把数组化成字符串，并添加到模板标签的父标签中去。   
						$('#subtype_ul').append(arr.join(''));
						$("#subtype_ul").show();
					}
				},
				error:function(){
					alert("异常");
				}			
			});
		}
		if(typeof($("#searchType>li[class='classify_cur']").val())=='undefined'){
			alert("请选择查找类型");
			return;
		}
		//清空数据
		clearTarget();
		//重置分页
		resetPagination();
		//return;
		
		
		//判断用户是否选中查询类型，如果未选中，直接返回，并提示用户选择查询类型
		if(typeof($("#searchType>li[class='classify_cur']").val())=='undefined'){
			alert("请选择查找类型");
			return;
		}
		
		/*
		//活动列表不点击父类不查询
		if($("#searchType>li[class='classify_cur']").val()=='3'){
			//清空数据
			clearTarget();
			//重置分页
			resetPagination();
			return;
		}
		*/
		
		//默认首页
		var page=1;
		//获取数据模板
		var html=getHtml();
		//获取页面条件查询的url
		var url=getUrlByExample();
		//获取页面查询的参数对象
		var secondParam=getParamMap(page, pageSize)
		//第二个ajax请求，请求服务机构数据，后期可能有变化，根据search的类型判断到底是哪个请求，此处直接请求服务机构
		$.ajax({
			type : "post",
			//根据不同查找类型判断赋值url
			url : url,
			async : false,
			timeout : 30000,
			dataType : 'json',
			data : secondParam,
			beforeSend : function(XMLHttpRequest) {
			},
			success:function(data){
				//数据填充
				if(data.status==1){ 
					//重置分页
					resetPagination();
					//清空目标区域
					clearTarget();
					//数据展示
					showData(data);
				}
			},
			error:function(){
				alert("异常");
			}			
		});
		//如果为找需求，需要添加星星
		createScoreImg();
		//修正样式
		addRightStyle();
	});
	//为地区绑定事件
	$("#district>li").click(function(){
		//为自己绑定样式
		$(this).addClass("li_top_cur");
		$(this).siblings().removeClass("li_top_cur");
		//判断用户是否选中查询类型，如果未选中，直接返回，并提示用户选择查询类型
		if(typeof($("#searchType>li[class='classify_cur']").val())=='undefined'){
			alert("请选择查找类型");
			return;
		}
		//默认首页
		var page=1;
		//获取数据模板
		var html=getHtml();
		//获取页面条件查询的url
		var url=getUrlByExample();
		//获取页面查询的参数对象
		var secondParam=getParamMap(page, pageSize)
		//第二个ajax请求，请求服务机构数据，后期可能有变化，根据search的类型判断到底是哪个请求，此处直接请求服务机构
		$.ajax({
			type : "post",
			//根据不同查找类型判断赋值url
			url : url,
			async : false,
			timeout : 30000,
			dataType : 'json',
			data : secondParam,
			beforeSend : function(XMLHttpRequest) {
			},
			success:function(data){
				//数据填充
				if(data.status==1){  
					//重置分页
					resetPagination();
					//清空目标区域
					clearTarget();
					//数据展示
					showDataByExample(data);
				}
			},
			error:function(){
				alert("异常");
			}			
		});
		//如果为找需求，需要添加星星
		createScoreImg();
		//修正样式
		addRightStyle();
	});
	//为地区和关键词绑定事件
	$("#keywordSearchButton").click(function(){
		//判断用户是否选中查询类型，如果未选中，直接返回，并提示用户选择查询类型
		if(typeof($("#searchType>li[class='classify_cur']").val())=='undefined'){
			alert("请选择查找类型");
			return;
		}
		//默认首页
		var page=1;
		//获取数据模板
		var html=getHtml();
		//获取页面条件查询的url
		var url=getUrlByExample();
		//获取页面查询的参数对象
		var secondParam=getParamMap(page, pageSize)
		//第二个ajax请求，请求服务机构数据，后期可能有变化，根据search的类型判断到底是哪个请求，此处直接请求服务机构
		$.ajax({
			type : "post",
			//根据不同查找类型判断赋值url
			url : url,
			async : false,
			timeout : 30000,
			dataType : 'json',
			data : secondParam,
			beforeSend : function(XMLHttpRequest) {
			},
			success:function(data){
				//数据填充
				if(data.status==1){  
					//重置分页
					resetPagination();
					//清空目标区域
					clearTarget();
					//数据展示
					showDataByExample(data);
				}
			},
			error:function(){
				alert("异常");
			}			
		});
		//如果为找需求，需要添加星星
		createScoreImg();
		//修正样式
		addRightStyle();
	});
	
	
	//活动分类按钮绑定事件
	$("#act_first,#act_second").click(function(){
		//点击添加样式
		$(this).addClass("cur");
		$(this).siblings().removeClass("cur");
		
		//默认首页
		var page=1;
		//获取数据模板
		var html=getHtml();
		//获取页面条件查询的url
		var url=getUrlByExample();
		//获取页面查询的参数对象
		var secondParam=getParamMap(page, pageSize);
		
		
		$.ajax({
			type : "post",
			//无条件查询所有的服务
			url : url,
			async : false,
			timeout : 30000,
			dataType : 'json',
			data : secondParam,
			beforeSend : function(XMLHttpRequest) {
			},
			success:function(data){
				if(data.status==1){
					//重置分页
					resetPagination();
					//清空数据填充区域
					clearTarget();
					//数据回显
					showDataByExample(data);
				}
				else{
					alert("查询失败2");
				}	
			},
			error:function(e){
			}
		});
	});
	
	//20170320创业服务
	//当选择的服务类型为创业服务的时候显示创业服务特有栏目框
	if(serviceType == "103000"){
		$("#entrepreneurshipDiv").show();
		$("#partingLine").show();
		getEntrepreneurshipNews(getEntrepreneurshipParams(entrepreneurshipCurrentPage));
		
		//为新闻详情绑定事件
		$("#entrepreneurshipList").on("click",".detailOfNews",function(e){
			//获取新闻id
			var id = $(this).attr('id');
			window.location.href=$("#rootPath").val()+"/page/jsp/news/newsInfo.jsp?id="+id;
		})
	}else{
		$("#entrepreneurshipDiv").hide();
		$("#partingLine").hide();
	}
	
	
	
})

//20170320创业服务获取参数
function getEntrepreneurshipParams(entrepreneurshipCurrentPage){
	var params = {'params.currentPage':entrepreneurshipCurrentPage,
				  	'params.pageSize':entrepreneurshipPageSize};
	return params;
}

//分页回调
function entrepreneurshipPageCallback(index,jq){
	entrepreneurshipCurrentPage = index + 1;
	getEntrepreneurshipNews(getEntrepreneurshipParams(entrepreneurshipCurrentPage));
}

//20170320创业服务
function getEntrepreneurshipNews(params){
	$("#entrepreneurshipList").empty();
	$.ajax({
		type: "post",
		url: $("#rootPath").val()+"/entrepreneurship/getEntrepreneurshipNews.action",
		async : false,
		data : params,
		dataType:'json',
		beforeSend: function(XMLHttpRequest){},
		success: function(data, textStatus){
			// 向上取整
			entrepreneurshipTotalPage=Math.ceil(data['count']/entrepreneurshipPageSize);
			var news = data['newsList'];
			var html = "";
			for(var i=0; i<news.length; i++){
				html += '<li class="detailOfNews" id='+news[i].id+'>';
				html +=	'<h1 class="ov"><span class="percent80_PJY ellipsis_PJY curp fl ">'+news[i].publishTitle+'</span><span class="timeWord_PJY fr">'+news[i].publishTime.substring(0,10)+'</span></h1>';
				html += '</li>';
			}
			$("#entrepreneurshipList").append(html);
			
			$("#entrepreneurshipPage").pagination(entrepreneurshipTotalPage,{
				callback: entrepreneurshipPageCallback,
				items_per_page : 1,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : entrepreneurshipCurrentPage - 1,
				link_to : 'javascript:void(0)'
			});
			$("#entrepreneurshipTotalPage").text("共"+entrepreneurshipTotalPage+"页");
			
		}
	})
}



//绑定在服务子分类上的方法，并阻止事件冒泡
function serviceSubtypeClick(event,element){
	//组织事件冒泡
	stopEventBubble(event);
	serviceTypeSec = $(element).val();
	
	//console.log(serviceTypeSec)	
	
	//点击添加样式
	//element.parentNode.childNodes.setAttribute("class","")
	$("#subtype_ul li").removeClass("li_down_cur")
	element.setAttribute("class","li_down_cur");
	
	//$(this).addClass("li_down_cur");
	//$(event.target).siblings().removeClass("li_down_cur");
	
	//默认第一页
	var page=1;
	//根据页面查找类型获取数据模板
	var html=getHtml();
	//获取url
	var url=getUrlByExample();
	//获取参数map
	var param=getParamMap(page, pageSize)
	//发送ajax请求，查询属于子分类的服务机构
	$.ajax({
		type : "post",
		//无条件查询所有的服务
		url : url,
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : param,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			
			if(data.status==1){  				
				//重置分页
				resetPagination();
				//清空目标区域
				clearTarget();
				//数据回显
				showDataByExample(data);
				//修改样式
				addRightStyle();
			}
		},
		error:function(){
			alert("查询失败4");
		}
	});
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
//获取页面参数条件，并返回页面条件的数组（顺序为）searchType;serviceType;serviceSubtype;district;scoreSort;serviceCountSort;keyword;
function getPageParamObject(){
	var param=new Array();
	//获取查找类型的参数，当参数为-1时代表未选中查找类型，查找类型可能未undifined，此时值设为-1(类型为字符串)
	var searchType=$("#searchType>li[class='classify_cur']").val();
	if(typeof($("#searchType>li[class='classify_cur']").val())=='undefined'){
		var searchType="-1";
	}
	//获取服务分类的参数（类型为数字）
	var serviceType=$("#serviceType>li[class='li_top_cur']").val()
	//获取服务子分类的参数，服务子分类可能为undefined，此时值为000000，类型为字符串
	var serviceSubtype=$("#subtype_ul>li[class='li_down_cur']").val();
	if(typeof(serviceSubtype)=='undefined'){
		serviceSubtype=0;
	}
	//获取地区的参数，类型为数字
	var district=$("#district>li[class='li_top_cur']").val();
	//获取是否按得分排序的参数
	var scoreSort=$("#scoreSortButton").val();
	//获取是否按服务次数排序的参数
	var serviceCountSort=$("#serviceCountSortButton").val();
	//获取关键词参数
	var keyword=$("#keyword").val();
	//赋值并返回
	param[0]=searchType;
	param[1]=serviceType;
	param[2]=serviceSubtype;
	param[3]=district;
	param[4]=scoreSort;
	param[5]=serviceCountSort;
	param[6]=keyword;
	return param;
}
//获取url中传递参数的方法，封装为数组顺序为searchType,serviceType,district
function getParamArr(){
	//获取url中传递的参数
	var url=window.location.href;
	//return url.split("?")[1].split("=")[1];
	var arr=url.split("?");
	if(arr.length==1){
		//说明没有类型参数
		return;
	}
	var returnArr=new Array(3);
	var entryArr=arr[1].split("&");
	for(var a=0;a<3;a++){
		var tempArr=entryArr[a].split("=");
		returnArr[a]=tempArr[1];
	}
	return returnArr;
};
//动态创建好评得分图片的方法
function createScoreImg(){
	if($("#searchType>li[class='classify_cur']").val()=='0'){
		$(".img_span").each(function(){
			//获取总得分和总服务次数
			var transactionCount=$(this).next().val();
			var summarySource=$($(this).children("input")[0]).val();
			//获取好评数，迭代产生图片标签，并加入当前标签内
			//得到总分，除以总服务数，得到服务平均分，并四舍五入
			var score=Math.round(summarySource/transactionCount);
			//迭代，生成星星的图片，并追加到好评率的li中
			for(var a=0;a<score;a++){
				var $img=$("<img>");
				$img[0].src=$("#rootPath").val()+"/page/images/xing.png";
				$(this).after($img);
			}
		});
	}
}
//根据大分类得到html数据模板
function getHtml(){
	//获取节点的value，根据value判断ajax请求的url和相应的数据模板
	if($("#searchType>li[class='classify_cur']").val()=='0'){
		var html=$('script[type="text/template_service_items"]').html();
	}
	if($("#searchType>li[class='classify_cur']").val()=='1'){
		var html=$('script[type="text/template_facilitating_agency_info"]').html();
	}
	if($("#searchType>li[class='classify_cur']").val()=='2'){
		var html=$('script[type="text/template_requirement_items"]').html();
	}
	if($("#searchType>li[class='classify_cur']").val()=='3'){
		var html=$('script[type="text/template_activity_items"]').html();
	}
	return html;
}
//根据大分类获取无条件查询url
function getUrl(){
	//获取节点的value，根据value判断ajax请求的url和相应的数据模板
	if($("#searchType>li[class='classify_cur']").val()=='0'){
		var url=$("#rootPath").val() + "/serviceItems/serviceList.action";
	}
	if($("#searchType>li[class='classify_cur']").val()=='1'){
		var url=$("#rootPath").val() + "/facilitatingAgencySupport/facilitatingAgencyInfoList.action";
	}
	if($("#searchType>li[class='classify_cur']").val()=='2'){
		var url=$("#rootPath").val() + "/requirementItems/selectRequirementItem.action";
	}
	if($("#searchType>li[class='classify_cur']").val()=='3'){
		var url=$("#rootPath").val() + "/activityItems/selectActivityItemsByItems.action";
	}
	return url;
}
//根据大分类获取页面条件查询的url
function getUrlByExample(){
	if($("#searchType>li[class='classify_cur']").val()=='0'){
		var url=$("#rootPath").val() + "/serviceItems/selectServiceItemsByExample.action";
	}
	if($("#searchType>li[class='classify_cur']").val()=='1'){
		var url=$("#rootPath").val() + "/facilitatingAgencySupport/facilitatingAgencyInfoListByExample.action";
	}
	if($("#searchType>li[class='classify_cur']").val()=='2'){
		var url=$("#rootPath").val() + "/requirementItems/selectRequirementItemByExample.action";
	}
	if($("#searchType>li[class='classify_cur']").val()=='3'){
		var url=$("#rootPath").val() + "/activityItems/selectActivityItemsByItems.action";
	}
	return url;
}
//根据大分类查询，无条件，分页回调
function selectBySearchType(index){
	
	var searchTypeCode=$("#searchType>li[class='classify_cur']").val();
	
	//获取html数据模板
	var html=getHtml();
	//获取无条件查询的url
	var url=getUrl();
	
	var param=getParamMapNoExample(index+1, pageSize);
	
	//步骤：点击相应节点发送相应的ajax请求，url和html模版在之前判断选择赋值
	$.ajax({
		type : "post",
		url : url,
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : param,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			//重置分页
			resetPagination();
			//清空目标区域
			clearTarget();
			
			//根据类型判断显示数据
			
			//根据查找类型判断显示方法
			if(searchTypeCode=='0'||searchTypeCode=="1"||searchTypeCode=="2"){
				//显示数据（条件）
				//数据填充
				if(data.status==1){
					//获取html模板
					var html=getHtml();
					//定义一个数组，用来接收格式化合的数据   
					var arr = [];   
					//对数据进行遍历   (数据格式统一，data.data.data为需要迭代的数据list)
					$.each(data.data.data, function(index, o) {   
						//这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
						arr.push(formatTemplate(o, html)); 		            
					});   
					//把数组化成字符串，并添加到模板标签的父标签中去。   
					$('#targetUL').append(arr.join(''));			        	
					var total_page=Math.ceil(data.data.total/pageSize);
					//设置分页
					$("#pagination").pagination(data.data.total,{
						//有条件的分页回调
						callback: selectBySearchType,
						items_per_page : pageSize,				
						prev_text:"上一页",
						next_text:"下一页",
						num_edge_entries : 3,			//边缘值
						ellipse_text : '...',			//边缘显示
						num_display_entries : 10,		//显示条数
						current_page : index,
						link_to : 'javascript:void(0)'
					});
					$("#totalPage").text("共"+total_page+"页");      
				}
				//添加星星图片的方法
				createScoreImg();
				//修正样式
				addRightStyle();
			}
			if(searchTypeCode=='3'){
				var list=data['ActivityItemsList'];
				//活动类型
				var activityType = data['activityType'];
				if(list!=null){
					//获取html模板
					var html=getHtml();
					//定义一个数组，用来接收格式化合的数据   
					var arr = [];   
					//对数据进行遍历   (数据格式统一，data.data.data为需要迭代的数据list)
					$.each(list, function(index, o) {   
						//这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
						arr.push(formatTemplate(o, html)); 		            
					});   
					//把数组化成字符串，并添加到模板标签的父标签中去。   
					$('#activityItemsList').append(arr.join(''));
					
					var total_page=Math.ceil(data.countTotal/pageSize);
					//设置分页
					$("#pagination").pagination(data.countTotal,{
						//有条件的分页回调
						callback: selectByExample,
						items_per_page : pageSize,				
						prev_text:"上一页",
						next_text:"下一页",
						num_edge_entries : 3,			//边缘值
						ellipse_text : '...',			//边缘显示
						num_display_entries : 10,		//显示条数
						current_page : 0,
						link_to : 'javascript:void(0)'
					});
					$("#totalPage").text("共"+total_page+"页");  
				}
				return;
			}					
			//显示数据
			showData();
		},
		error:function(){
			alert("查询失败5");
		}	
	});
	//添加星星图片的方法
	createScoreImg();
}
//重置分页
function resetPagination(){
	$("#pagination").remove();
	$("#totalPage").remove();
	var $pagination=$("<div id='pagination' class='pagination'></div>");
	$("#paginationParent").append($pagination);
	var $totalPage=$("<span id='totalPage' class='totalpage'></span>");
	$("#paginationParent").append($totalPage);
	$("#totalpage").text("共0页");
}
//根据大分类获取页面查询的参数对象（用于带条件查询）
function getParamMap(page,pageSize){
	//先获取页面参数数组
	var paramArr=getPageParamObject();
	//判断大分类并创建参数对象
	if($("#searchType>li[class='classify_cur']").val()=='0'){
		var param={
				"serviceItems.serviceType":paramArr[1],
				"serviceItems.serviceSubtype":paramArr[2],
				"serviceItems.serviceDistrict":paramArr[3],
				"isScoreSort":paramArr[4],
				"isServiceCountSort":paramArr[5],
				"keyword":paramArr[6],
				//默认分页
				"page":page,
				"pageSize":pageSize
		}
	}
	if($("#searchType>li[class='classify_cur']").val()=='1'){
		var param={
				"facilitatingAgencyInfo.serviceDistrict":paramArr[3],
				"serviceItems.serviceType":paramArr[1],
				"serviceItems.serviceSubtype":paramArr[2],
				"keyword":paramArr[6],
				"isScoreSort":paramArr[4],
				"isServiceCountSort":paramArr[5],
				"page":page,//默认分页，第一页
				"pageSize":pageSize//默认分页，每页5条数据
		}
	}
	if($("#searchType>li[class='classify_cur']").val()=='2'){
		var param={
				"page":page,
				"pageSize":pageSize,
				"district":paramArr[3],
				"requirement_srv_type":paramArr[1],
				"requirement_srv_subtype":paramArr[2],
				"requirement_title":paramArr[6]
		}
	}
	if($("#searchType>li[class='classify_cur']").val()=='3'){
		if(paramArr[3]==120000){
			paramArr[3]="";
		}
		if(paramArr[1]==0){
			paramArr[1]="";
		}
		if(paramArr[2]==0){
			paramArr[2]="";
		}
		activityType=parseInt($(".cur").val());
		var param= {	
				"params.addressDistrict":paramArr[3],
				"params.serviceType":paramArr[1],
				"params.activityType":activityType,
				"params.currentPage":page,
			  	"params.pageSize":pageSize,
			  	"params.serviceSubType":paramArr[2]
		};
	}
	return param;
}
//获取无条件的页面参数
function getParamMapNoExample(page,pageSize){
	//先获取页面参数数组
	var paramArr=getPageParamObject();
	//判断大分类并创建参数对象
	if($("#searchType>li[class='classify_cur']").val()=='0'){
		var param={
				//默认分页
				"page":page,
				"pageSize":pageSize
		}
	}
	if($("#searchType>li[class='classify_cur']").val()=='1'){
		var param={
				"page":page,//默认分页，第一页
				"pageSize":pageSize//默认分页，每页5条数据
		}
	}
	if($("#searchType>li[class='classify_cur']").val()=='2'){
		var param={
				"page":page,
				"pageSize":pageSize
		}
	}
	if($("#searchType>li[class='classify_cur']").val()=='3'){
		var param= {	
				"params.addressDistrict":"",
				"params.serviceType":"",
				"params.activityType":1,//默认为活动预告
				"params.currentPage":page,
			  	"params.pageSize":pageSize
		};
	}
	return param;
}
//阻止事件冒泡
function stopEventBubble(event){
	//传入event，阻止事件冒泡
	var e = window.event|| event; 
	if ( e.stopPropagation ){ //如果提供了事件对象，则这是一个非IE浏览器 
		e.stopPropagation(); 
	}else{ 
		//兼容IE的方式来取消事件冒泡 
		window.event.cancelBubble = true; 
	}
}
//页面条件查询的方法
function selectByPageExample(){
	//默认首页
	var page=1;
	//获取数据模板
	var html=getHtml();
	//获取页面条件查询的url
	var url=getUrlByExample();
	//获取页面查询的参数对象
	var secondParam=getParamMap(page, pageSize)
	//第二个ajax请求，请求服务机构数据，后期可能有变化，根据search的类型判断到底是哪个请求，此处直接请求服务机构
	$.ajax({
		type : "post",
		//根据不同查找类型判断赋值url
		url : url,
		async : false,
		timeout : 30000,
		dataType : 'json',
		data : secondParam,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			//重置分页(删除原分页div和显示总页数span，并增加新的div和span)
			resetPagination();
			//清除目标区域的li（targetUL为填充数据的目标区域）
			clearTarget();
			//显示数据
			showDataByExample(data);
		},
		error:function(){
			alert("异常");
		}			
	});
	//添加星星图片
	createScoreImg();
}
//根据页面条件查询，页面条件，分页回调
function selectByExample(index){
	
	//还差一个判断语句
	var searchTypeCode=$("#searchType>li[class='classify_cur']").val();
	
	//获取数据模板
	var html=getHtml();
	//获取条件查询的url
	var url=getUrlByExample();
	//获取条件查询的页面参数
	var param=getParamMap(index+1, pageSize)
	//步骤：清楚目标区域的li（targetUL为填充数据的目标区域）
    //$("#targetUL").children().remove();	
	//步骤：点击相应节点发送相应的ajax请求，url和html模版在之前判断选择赋值
	$.ajax({
		type : "post",
		url : url,
		async : false,
		timeout : 30000,
		dataType : 'json',
		data :param,
		beforeSend : function(XMLHttpRequest) {
		},
		success:function(data){
			//重置分页
			resetPagination();
			//清除目标区域的li（targetUL为填充数据的目标区域）
			clearTarget();
			//数据显示
			//根据查找类型判断显示方法
			if(searchTypeCode=='0'||searchTypeCode=="1"||searchTypeCode=="2"){
				//显示数据（条件）
				//数据填充
				if(data.status==1){
					//获取html模板
					var html=getHtml();
					//定义一个数组，用来接收格式化合的数据   
					var arr = [];   
					//对数据进行遍历   (数据格式统一，data.data.data为需要迭代的数据list)
					$.each(data.data.data, function(index, o) {   
						//这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
						arr.push(formatTemplate(o, html)); 		            
					});   
					//把数组化成字符串，并添加到模板标签的父标签中去。   
					$('#targetUL').append(arr.join(''));			        	
					var total_page=Math.ceil(data.data.total/pageSize);
					//设置分页
					$("#pagination").pagination(data.data.total,{
						//有条件的分页回调
						callback: selectByExample,
						items_per_page : pageSize,				
						prev_text:"上一页",
						next_text:"下一页",
						num_edge_entries : 3,			//边缘值
						ellipse_text : '...',			//边缘显示
						num_display_entries : 10,		//显示条数
						current_page : index,
						link_to : 'javascript:void(0)'
					});
					$("#totalPage").text("共"+total_page+"页");      
				}
				//添加星星图片的方法
				createScoreImg();
				//修正样式
				addRightStyle();
			}
			if(searchTypeCode=='3'){
				var list=data['ActivityItemsList'];
				//活动类型
				var activityType = data['activityType'];
				if(list!=null){
					//获取html模板
					var html=getHtml();
					//定义一个数组，用来接收格式化合的数据   
					var arr = [];   
					//对数据进行遍历   (数据格式统一，data.data.data为需要迭代的数据list)
					$.each(list, function(index, o) {   
						//这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
						arr.push(formatTemplate(o, html)); 		            
					});   
					//把数组化成字符串，并添加到模板标签的父标签中去。   
					$('#activityItemsList').append(arr.join(''));
					
					var total_page=Math.ceil(data.countTotal/pageSize);
					//设置分页
					$("#pagination").pagination(data.countTotal,{
						//有条件的分页回调
						callback: selectByExample,
						items_per_page : pageSize,				
						prev_text:"上一页",
						next_text:"下一页",
						num_edge_entries : 3,			//边缘值
						ellipse_text : '...',			//边缘显示
						num_display_entries : 10,		//显示条数
						current_page : 0,
						link_to : 'javascript:void(0)'
					});
					$("#totalPage").text("共"+total_page+"页");  
				}
				return;
			}	
		},
		error:function(){
			alert("查询失败6");
		}
	});
}
//根据searchType在页面显示相应的html组件
function createHtmlBySearchType(){
	//隐藏所有动态的html构件
	//找机构找需求找服务的html
	$("#searchFacilitatingAgencyAndServiceItemsAndRequirementItems").hide();
	//找活动的html
	$("#searchActity").hide();
	//推荐项目或机构的html
	$("#recommond").hide();
	
	
	//如果没有一个查询类型被选中则清空页面所有的相关动态html
	if(typeof($("#searchType>li[class='classify_cur']").val())=='undefined'){
		$("#searchFacilitatingAgencyAndServiceItemsAndRequirementItems").hide();
		$("#searchActity").hide();
		$("#recommond").hide();
	}
	if($("#searchType>li[class='classify_cur']").val()=='0'){
		//找服务
		$("#searchActity").hide();
		$("#searchFacilitatingAgencyAndServiceItemsAndRequirementItems").show();
		$("#sort").show();
		$("#searchTypeTitle").html("服务项目");
		$("#recommond").show();
		$("#recommond_title").html("推荐机构");
	}
	if($("#searchType>li[class='classify_cur']").val()=='1'){
		//找机构
		$("#searchActity").hide();
		$("#searchFacilitatingAgencyAndServiceItemsAndRequirementItems").show();
		$("#sort").show();
		$("#searchTypeTitle").html("服务机构");
		$("#recommond").show();
		$("#recommond_title").html("推荐项目");
	}
	if($("#searchType>li[class='classify_cur']").val()=='2'){
		//找需求
		$("#searchActity").hide();
		$("#searchFacilitatingAgencyAndServiceItemsAndRequirementItems").show();
		$("#sort").hide();
		$("#searchTypeTitle").html("企业需求");
		$("#recommond").show();
		$("#recommond_title").html("推荐机构");
	}
	if($("#searchType>li[class='classify_cur']").val()=='3'){
		//找活动
		$("#searchActity").show();
		$("#searchFacilitatingAgencyAndServiceItemsAndRequirementItems").hide();
		$("#sort").hide();
		$("#recommond").hide();
	}
}
//创建推荐的方法(未完成 )
function createRecommond(){
	if($("#recommond_title").html()=="推荐机构"){
		//推荐机构的数据模版
		var html=$('script[type="text/template_recommond_facilitating_agency"]').html();
	}
	if($("#recommond_title").html()=="推荐项目"){
		//推荐服务项目的数据模版
		var html=$('script[type="text/template_recommond_service_items"]').html();
	}
}
//服务详情的跳转方法
function serviceItemsDesc(a){
	var id=$(a).next().val();
	window.location.href=$("#rootPath").val()+"/page/jsp/service/service_item_desc.jsp?searchType=0&id="+id;
}
//诉求详情的跳转方法
function requirementItemsDesc(a){
	var requirementSn=$(a).next().val();
	window.location.href=$("#rootPath").val()+"/page/jsp/requirementItems/detailForRequirementItems.jsp?requirementSn="+requirementSn;
}
//根据不同类型数据填充的方法，带分页(有条件情况下)
function showDataByExample(data){
	var searchTypeCode=$("#searchType>li[class='classify_cur']").val();
	if(searchTypeCode=='0'||searchTypeCode=="1"||searchTypeCode=="2"){
		//数据填充
		if(data.status==1){
	        //获取html模板
			var html=getHtml();
			//定义一个数组，用来接收格式化合的数据   
	        var arr = [];   
	        //对数据进行遍历   (数据格式统一，data.data.data为需要迭代的数据list)
	        $.each(data.data.data, function(index, o) {   
	            //这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
	            arr.push(formatTemplate(o, html)); 		            
	        });   
	        //把数组化成字符串，并添加到模板标签的父标签中去。   
	        $('#targetUL').append(arr.join(''));
	        	
	        var total_page=Math.ceil(data.data.total/pageSize);
			//设置分页
			$("#pagination").pagination(data.data.total,{
				//有条件的分页回调
				callback: selectByExample,
				items_per_page : pageSize,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : 0,
				link_to : 'javascript:void(0)'
			});
			$("#totalPage").text("共"+total_page+"页");      
		}
		return;
	}
	if(searchTypeCode=='3'){
		var list=data['ActivityItemsList'];
		//活动类型
		var activityType = data['activityType'];
		if(list!=null){
			//获取html模板
			var html=getHtml();
			//定义一个数组，用来接收格式化合的数据   
	        var arr = [];   
	        //对数据进行遍历   (数据格式统一，data.data.data为需要迭代的数据list)
	        $.each(list, function(index, o) {   
	            //这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
	            arr.push(formatTemplate(o, html)); 		            
	        });   
	        //把数组化成字符串，并添加到模板标签的父标签中去。   
	        $('#activityItemsList').append(arr.join(''));
	        
	        var total_page=Math.ceil(data.countTotal/pageSize);
			//设置分页
			$("#pagination").pagination(data.countTotal,{
				//有条件的分页回调
				callback: selectByExample,
				items_per_page : pageSize,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : 0,
				link_to : 'javascript:void(0)'
			});
			$("#totalPage").text("共"+total_page+"页");  
		}
		return;
	}
}
//根据不同类型数据填充的方法，带分页(无条件情况下)
function showData(data){
	var searchTypeCode=$("#searchType>li[class='classify_cur']").val();
	if(searchTypeCode=='0'||searchTypeCode=="1"||searchTypeCode=="2"){
		//数据填充
		if(data.status==1){
	        //获取html模板
			var html=getHtml();
			//定义一个数组，用来接收格式化合的数据   
	        var arr = [];   
	        //对数据进行遍历   (数据格式统一，data.data.data为需要迭代的数据list)
	        $.each(data.data.data, function(index, o) {   
	            //这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
	            arr.push(formatTemplate(o, html)); 		            
	        });   
	        //把数组化成字符串，并添加到模板标签的父标签中去。   
	        $('#targetUL').append(arr.join(''));
	        	
	        var total_page=Math.ceil(data.data.total/pageSize);
			//设置分页
			$("#pagination").pagination(data.data.total,{
				callback: selectBySearchType,
				items_per_page : pageSize,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : 0,
				link_to : 'javascript:void(0)'
			});
			$("#totalPage").text("共"+total_page+"页");      
		}
		return;
	}
	if(searchTypeCode=='3'){
		var list=data['ActivityItemsList'];
		//活动类型
		var activityType = data['activityType'];
		if(list!=null){
			//获取html模板
			var html=getHtml();
			//定义一个数组，用来接收格式化合的数据   
	        var arr = [];   
	        //对数据进行遍历   (数据格式统一，data.data.data为需要迭代的数据list)
	        $.each(list, function(index, o) {   
	            //这里取到o就是上面data.data.list数组中的值, formatTemplate是最开始定义的方法.   
	            arr.push(formatTemplate(o, html)); 		            
	        });   
	        //把数组化成字符串，并添加到模板标签的父标签中去。   
	        $('#activityItemsList').append(arr.join(''));
	        
	        
	        
	        var total_page=Math.ceil(data.countTotal/pageSize);
			//设置分页
			$("#pagination").pagination(data.countTotal,{
				callback: selectBySearchType,
				items_per_page : pageSize,				
				prev_text:"上一页",
				next_text:"下一页",
				num_edge_entries : 3,			//边缘值
				ellipse_text : '...',			//边缘显示
				num_display_entries : 10,		//显示条数
				current_page : 0,
				link_to : 'javascript:void(0)'
			});
			$("#totalPage").text("共"+total_page+"页");  
		}
		return;
	}
}




//清空数据填充位置的方法
function clearTarget(){
	var searchTypeCode=$("#searchType>li[class='classify_cur']").val();
	if(searchTypeCode=='0'||searchTypeCode=="1"||searchTypeCode=="2"){
		$("#targetUL").children().remove();
	}
	if(searchTypeCode=="3"){
		$("#activityItemsList").children().remove();
	}
}

//点击显示服务机构详情
function facilitatingAgencyDesc(usercode){
	window.location.href=$("#rootPath").val()+"/page/jsp/facilitatingAgency/detailForFacilitatingAgency.jsp?entUserCode="+usercode;
}

//页面显示后给最右的数据添加的样式
function addRightStyle(){
	//根据选中的类型判断一下
	var searchTypeCode=$("#searchType>li[class='classify_cur']").val();
	if(searchTypeCode=='0'||searchTypeCode=="1"||searchTypeCode=="2"){	
		$("#targetUL>li").each(function(index,e){
			if((index+1)%5==0){
				$(e).attr("style","margin-right: 0px;")
			}
		});
	}
}