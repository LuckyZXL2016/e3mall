function getCookie (name) {
 var arg = name + "=";
 var alen = arg.length;
 var clen = document.cookie.length;
 var i = 0;
 while (i < clen) {
  var j = i + alen;
  if (document.cookie.substring(i, j) == arg) return getCookieVal (j);
  i = document.cookie.indexOf(" ", i) + 1;
  if (i == 0) break;
 }
 return null;
}

function setCookie(name, value, expires, path, domain, secure)
{
  var today = new Date();
  var expiry = new Date(today.getTime() + 100000 * 24 * 60 * 60 * 1000);
  if(expires==''||expires==null)
  {
 	expires=expiry;
  }
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;

}

function delCookie(name) {
 expdate = new Date();
 expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
 setCookie(name, "", "", "/", "", "");
}


var expdate= new Date();

function getCookieVal (offset) {
 var endstr = document.cookie.indexOf (";", offset);
 if (endstr == -1) endstr = document.cookie.length;
 return unescape(document.cookie.substring(offset, endstr));
}
$.fn.dropdown = function(b, c) {
	if (this.length) {
		"function" == typeof b && (c = b, b = {});
		var d = $.extend({
			event: "mouseover",
			current: "hover",
			delay: 0
		}, b || {}),
			e = "mouseover" == d.event ? "mouseout" : "mouseleave";
		$.each(this, function() {
			var b = null,
				f = null,
				g = !1;
			$(this).bind(d.event, function() {
				if (g) clearTimeout(f);
				else {
					var e = $(this);
					b = setTimeout(function() {
						e.addClass(d.current), g = !0, c && c(e)
					}, d.delay)
				}
			}).bind(e, function() {
				if (g) {
					var c = $(this);
					f = setTimeout(function() {
						c.removeClass(d.current), g = !1
					}, d.delay)
				} else clearTimeout(b)
			})
		})
	}
};
var dhlist = 1;
$(function(){
	getAllCity();
	$("#public_cate").live("mouseenter",function(){
		var dhDivObj = $("#allSort");
		if(dhlist==1){
			$.get("/html/web/_public/_ajaxStaticMenu.html?v20140430",{},function(data) {
				dhDivObj.html(data);
				dhlist = 2;
			});
		}
		$("#public_cate").addClass("hover");
		$("#booksort").find(".item").removeClass("hover");
	});
	$("#public_cate").live("mouseleave",function(){
		$("#public_cate").removeClass("hover");
		$("#booksort").find(".item").removeClass("hover");
	});
	
	
	$(".topMenu .menus").dropdown({
        delay: 50
    }), $(".allCat").dropdown({
        delay: 50
    }, function() {
    }), $("#topCart").dropdown({
        delay: 50
    }, function() {
		$("#cat_form13").show();
        $("#cat_form13 li").length && $("#topCart").find("s").addClass("setCart");
    }), $(".topMenu .tShow").dropdown({
        delay: 50
    });
	if($(".topMenu .d2 .dd").length){
		$(".topMenu .d2 .dd").append('<div class="client-promo"><a href="http://app.e3mall.cn#trackref=sfbest_Uhead_Uhead_head_app2" target="_blank" rel="nofollow">先摇券 后买单</a></div>');
	}
	if($(".f_ios").length){
		$(".f_ios").find("li:first").html('<a target="_blank" href="http://app.e3mall.cn">手机客户端</a>');
	}
	var win_all = $("#header").width();
	var ZnowTime = new Date().getTime();
	//移动广告语	
	if (ZnowTime >=1420992000000 && ZnowTime<=1423583999000){
		$("#phone_time").html("客户端首单签收后<br><em>返满200减20元券</em>")
		$(".client-promo a").html('App首单签收后 返20元满减券');
	}
	//右侧浮动
	if(ZnowTime >= 1414771200000 && ZnowTime<=1416239999000){
		$('.index_rfloat').html('<a href="/html/activity/1414059494.html" target="_blank"><img src="http://p.e3mall.cn/gold/images/20141113/20141113111801929.jpg"></a><div class="J_rclose">关闭</div>');
		$('.index_rfloat').show();
	}
	$('.app-android').attr('href','http://android.e3mall.cn/sfandroid');
	//右侧广告位关闭
	if ($(".index_rfloat").length){$(".J_rclose").click(function(){$(".index_rfloat").hide();});}
	//隐藏会员俱乐部入口
	//$(".allCat").find("dl").eq(2).find("dd a").last().hide();
 //$("#login").after("<li id='qiyeLogin'><a href='http://www.sfme.me/login.jhtml' target='_blank' rel='nofollow'>员工福利</a></li>");
});

$("#booksort .item").live("mouseenter",function(){
    $(this).addClass("hover");
});
$("#booksort .item").live("mouseleave",function(){
	$(this).removeClass("hover");
});

function isOnline(wwwurl,homeurl,passporturl){
	$.getJSON( wwwurl+"/ajax/isOnline/?callback=?", function( data ) {
		if (data.welcome){
			passporturl = passporturl.replace('https', 'http');
			$('#login').html('<span class="logininfo"> '+data.welcome+'</span> <a href="'+passporturl+'/service/logout/?returnUrl='+escape(document.location.href)+'">[退出]</a>'); 
		}else{
			//var nickName = decodeURI(getCookie('_nickName'));
			var nickName = decodeURI(decodeURI(escape(getCookie('_nickName'))));
			nickName = nickName?nickName:'嘿';
			nickName = 'false'==nickName?'嘿':nickName;
			nickName = 'null'==nickName?'嘿':nickName;
			var welComeMsg = '';
			if('嘿' == nickName){
				welComeMsg = nickName+'，欢迎来宜立方商城！';
			}else{
				welComeMsg = nickName+'，欢迎您！';
			}
			$('#login').html(welComeMsg+'<a href="'+passporturl+'/?returnUrl='+escape(document.location.href)+'">请登录</a> | <a href="'+passporturl+'/reg/?returnUrl='+escape(document.location.href)+'">免费注册</a>');
		}
		if(data.qqcb){
			$('#qqcb').html(data.qqcb); 
		}
	});
}

function setCity(wwwUrl,provinceId,cityId,countyId){
	var provinceId = provinceId?provinceId:2;
	var cityId = cityId?cityId:52;
	var countyId = countyId?countyId:500;
	var townid = 0;
	var today = new Date();
	var expiry = new Date(today.getTime() + 3600 * 24 * 30 * 3 * 1000);
	var domain = window.location.host;
	domain = domain.substring(domain.indexOf('.'));
	setCookie('provinceid',provinceId,expiry,'/',domain);
	setCookie('cityid',cityId,expiry,'/',domain);
	setCookie('areaid',countyId,expiry,'/',domain);
	setCookie('townid',townid,expiry,'/',domain);
	window.location.reload();
//	$.ajax({
//		url  : wwwUrl+'/AjaxSetCity/Changecity/',
//		dataType: "jsonp",  
//		jsonp:"callback",
//		data : {provinceid:provinceId,cityid:cityId,areaid:countyId},
//		success: function(str){
//			window.location.reload();
//		}
//	});
}

function getAllCity(){
	
}

function showShadow(){
	var h = $(document).height();
	$('#screen').css({ 'height': h });	
	$('#screen').show();
	$('.indexshadow').center();
	$('.indexshadow').show();
}	

//取URLs
function GetRequests() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        if (str.indexOf("&") != -1) {
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        } else {
            theRequest[str.split("=")[0]] = unescape(str.split("=")[1]);
        }
    }
    return theRequest;
}
//如果是IPAD APP清除 头底部
$(document).ready(function(){
	//var browser = navigator.userAgent.toLowerCase();
	//alert(browser);
	//if(browser.indexOf('ipod')!=-1){
		var request = GetRequests();
		if(getCookie('device') == 3 || request.device == 3){
			if(getCookie('device') != 3){
				var today = new Date();
				var expires = new Date(today.getTime() + 24 * 60 * 60 * 1000);
				setCookie('device',3,expires,'/');
			}
			$('.topMenu').remove();
			$('#header').remove();
			$('.mainNav').remove();
			$('#footer').remove();
			$(".side-wrap").remove();
			//$("#side_app").remove();
			$(".p-btn").remove();
	
			var fenlei = /(http:\/\/www\.t\.com)?\/fresh\/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)\.html/g;
			var pinpai = /\/pinpai\/(\d+)-(\d+)\.html/g;
			var guanjianzi = /(http:\/\/www\.t\.com)?\/productlist\/search\?inputBox=(\d+)\&keyword=([0-9a-zA-Z%])?(#.+)?/g;
			var xiangqing = /(http:\/\/www\.t\.com)?\/html\/products\/(\d+)\/(\d+)\.html(#.+)?/g;

			$("a").each(function(){
				//console.log($(this).attr('href'));
				//替换分类 http://www.bbest.com/fresh/64-0-0-0-0-2-0-0-0-0-0.html
				$(this).attr('href', $(this).attr('href').replace(fenlei,"sfbesttoresource://resourceType=3&resourceCommonID=$2"));
				//替换品牌 /pinpai/322-2491.html
				$(this).attr('href', $(this).attr('href').replace(pinpai,"sfbesttoresource://resourceType=4&resourceCommonID=$2"));
				//替换关键字 /productlist/search?inputBox=0&keyword=%E9%98%BF%E5%85%8B%E8%8B%8F%E8%8B%B9%E6%9E%9C http://www.bbest.com/productlist/search?inputBox=1&keyword=%E9%98%BF%E5%85%8B%E8%8B%8F%E8%8B%B9%E6%9E%9C#trackref=sfbest_Uhead_Uhead_head_Keywords1
				$(this).attr('href', $(this).attr('href').replace(guanjianzi,"sfbesttoresource://resourceType=2&resourceCommonID=$3"));
				//替换详情页 http://www.bbest.com/html/products/57/1800056021.html#trackref=sfbest_channel_fresh_floor1_item6  /html/products/9/1800008834.html
				$(this).attr('href', $(this).attr('href').replace(xiangqing,"sfbest://$3.html"));		
			})
	  
	  
		}
	//}
});
