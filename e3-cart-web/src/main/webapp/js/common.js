(function(window) {
	var document = window.document,
	alert = window.alert,
	confirm = window.confirm
	$ = window.jQuery;
	var SF = {
		Config: {},
		Widget: {},
		App: {},
		Static: {}
	};
	var hostUrl = document.location.host;
	var urlArr = hostUrl.split('.');
	var domain = urlArr[1]+'.'+urlArr[2];
	var PASSPORT_URL = 'http://passport.'+domain;
	var SF_STATIC_BASE_URL = 'http://i.'+domain+'/com';
	var SF_WWW_HTML_URL = 'http://www.'+domain+'/html';
	
	SF.loadJs = function(sid, callback, dequeue) {
		SF.loadJs.loaded = SF.loadJs.loaded || {};
		SF.loadJs.packages = SF.loadJs.packages || {
			'jquery.thickbox': {
				'js': [SF_STATIC_BASE_URL + '/js/jquery/jquery.thickbox.js'],
				'check': function() {
					return !!window.tb_show;
				}
			},
			'jquery.select': {
				'js': [SF_STATIC_BASE_URL + '/js/jquery/jquery.select.js?v=20130811'],
				'check': function() {
					return !!$.fn.relateSelect;
				}
			},
			'data.city': {
				'js': [SF_STATIC_BASE_URL + '/js/data/region_data.js'],
				'depends': ['jquery.select'],
				'check': function() {
					return !!window.REGION_DATA;
				}
			},
			'data.city_new': {
				'js': [SF_WWW_HTML_URL + '/js/region_data_new.js'],
				'depends': ['jquery.select'],
				'check': function() {
					return !!window.REGION_DATA;
				}
			},
			'data.category': {
				'js': ['/cate/category/'],
				'depends': ['jquery.select'],
				'check': function() {
					return !!window.CATEGORY;
				}
			}
		};

		if (!dequeue) {
			$(window).queue('loadJs', function() {
				SF.loadJs(sid, callback, true);
			});
			$(window).queue('loadJsDone', function(){
				$(window).dequeue('loadJs');
			});
			if ($(window).queue('loadJsDone').length == 1) {
				$(window).dequeue('loadJs');
			}
			return;
		}

		function collect(sid) {
			var jsCollect =[], packages = SF.loadJs.packages[sid], i, l;
			if (packages) {
				if (packages.depends) {
					l = packages.depends.length;
					for (i = 0; i < l; i++) {
						jsCollect = jsCollect.concat(collect(packages.depends[i]));
					}
				}
				if ($.isFunction(packages.check) && !packages.check()) {
					jsCollect = jsCollect.concat(packages.js);
				}
			}
			return jsCollect;
		}

		function load(url) {
			return jQuery.ajax({
				crossDomain: true,
				cache: true,
				type: "GET",
				url: url,
				dataType: "script",
				async: false,
				scriptCharset: "UTF-8"
			});
		}

		var js = collect(sid), deferreds = [], l = js.length, i;
		for (i = 0; i < l; i++) {
			deferreds.push(load(js[i]));
		}
		$.when.apply($, deferreds).then(function() {
			$(window).dequeue('loadJsDone');
			$.isFunction(callback) && callback.call(document);
		}, function() {
			$(window).dequeue('loadJsDone');
		})
	};

	SF.t = function(code) {
		if (window.MSG && window.MSG[code]) {
			return window.MSG[code];
		}
		return code;
	};

	SF.Widget = {
		// 下拉菜单显隐
		pop: function(s) {
			if ($(s).data('SF_BIND_POP')) {
				return;
			}
			var $c = $(s),
			setting = $c.data('pop') || {};
			$c.bind({
				mouseover: function(e) {
					if (setting.pop) {
						$(setting.pop, $c).show();
					}
					if (setting.icon && setting.iconClass) {
						$(setting.icon, $c).addClass(setting.iconClass);
					}
				},
				mouseout: function(e) {
					if (setting.pop) {
						$(setting.pop, $c).hide();
					}
					if (setting.icon && setting.iconClass) {
						$(setting.icon, $c).removeClass(setting.iconClass);
					}
				}
				
			});
			$c.data('SF_BIND_POP', true);
			$c.triggerHandler('mouseover');
			return;
		},

		// 打开 thickbox 遮罩层
		tbOpen: function(caption, url, imageGroup) {
			function show() {
				window.tb_show(caption, url, imageGroup);
			}
			SF.loadJs('jquery.thickbox', show);
		},
		// 关闭 thickbox 遮罩层
		tbClose: function() {
			window.tb_remove();
		},
		// 用户登陆层
		login: function(backurl, reload) {
			var url;
			var backurlArr
			backurl = (typeof(backurl) === 'undefined' || !backurl) ? window.location.href : backurl;
			//过滤回调地址锚点
			backurlArr = backurl.split('#');
			$.ajax({
				  type: 'GET',
				  async: false,
				  dataType: "jsonp",
				  jsonp:"callback",
				  url: 'http://www.'+domain+"/ajaxSetCity/getCasLoginUrl/",
				  success: function(str){
					if(1==str.status){
						backurl =PASSPORT_URL+'/?returnUrl='+backurlArr[0];
						reload = (typeof(reload) === 'undefined') ? ($.param({service : backurl})) : ($.param({service : backurl, reload: Number(reload)}));
						url = str.casDomain+'/cas/login?loginpage=popup&'+reload+'&TB_iframe&height=478&width=390';
					}else{
						reload = (typeof(reload) === 'undefined') ? ($.param({returnUrl : backurlArr[0]})) : ($.param({returnUrl : backurlArr[0], reload: Number(reload)}));
						url = PASSPORT_URL+'/login/ajax/?' + reload + '&TB_iframe&height=435&width=346';
					}
					//url = PASSPORT_URL+'/login/ajax/?' + reload + '&TB_iframe&height=435&width=346';
					SF.Widget.tbOpen('<strong>您还未登录</strong>', url, 'scrolling=no');
				  }
			});	
		},
		// 分类联动
		category: function(s, options) {
			function relateSelect() {
				var defaults = {
					data: window.CATEGORY
				};
				$(s).relateSelect($.extend(defaults, options || {}));
			}
			SF.loadJs('data.category', relateSelect);
		},
		// 省市联动
		city: function(s, options) {
			function relateSelect() {
				var defaults = {
					data: window.REGION_DATA
				};
				$(s).relateSelect($.extend(defaults, options || {}));
			}
			SF.loadJs('data.city', relateSelect);
		},
		
		// 省市联动new
		city_new: function(s, options) {
			function relateSelect() {
				var defaults = {
					data: window.REGION_DATA
				};
				$(s).relateSelect($.extend(defaults, options || {}));
			}
			SF.loadJs('data.city_new', relateSelect);
		},
		//添加class
		addClass:function(s,onClass){
			$(s).hover(function(){
				$(this).addClass(onClass);
			},function(){
				$(this).removeClass(onClass);
			});
		},
		//搜索框默认值
		tipTxt: function(name){
			$(name).each(function(){
				var oldVal = $(this).val();
				$(this).css({"color":"#888"})
				.focus(function(){
					if($(this).val()!=oldVal){$(this).css({"color":"#000"})}else{$(this).val("").css({"color":"#888"})}
				})
				.blur(function(){
					if($(this).val()==""){$(this).val(oldVal).css({"color":"#888"})}
				})
				.keydown(function(){
					$(this).css({"color":"#000"})
				})
			})
		},
		// 标签切换
		tabs: function(s, e) {
			e = e || "mouseover";
			$(function() {
				$(s).bind(e, function(e) {
					if (e.target === this){
						var tabs = $(this).parent().parent().children("li");
						var panels = $(this).parent().parent().parent().children(".SF-tabs-box");
						var index = $.inArray(this, $(this).parent().parent().find("a"));
						if (panels.eq(index)[0]) {
							tabs.removeClass("SF-tabs-hover");
							tabs.eq(index).addClass("SF-tabs-hover");
							panels.addClass("SF-tabs-hide");
							panels.eq(index).removeClass("SF-tabs-hide");
						}
					}
				});
			});
		},
		Subtr:function(arg1,arg2){
			var r1,r2,m,n;
			try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
			try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
			m=Math.pow(10,Math.max(r1,r2));
			n=(r1>=r2)?r1:r2;
			return ((arg1*m-arg2*m)/m).toFixed(n);
		},
		Add:function(arg1,arg2){
			var r1,r2,m;
			try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
			try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
			m=Math.pow(10,Math.max(r1,r2))
			return (arg1*m+arg2*m)/m
		},
		Acc:function(arg1,arg2){
			var t1=0,t2=0,r1,r2;
			try{t1=arg1.toString().split(".")[1].length}catch(e){}
			try{t2=arg2.toString().split(".")[1].length}catch(e){}
			with(Math){
				r1=Number(arg1.toString().replace(".",""))
				r2=Number(arg2.toString().replace(".",""))
				return (r1/r2)*pow(10,t2-t1);
			}
		},
		Mul:function(arg1,arg2)
		{
			var m=0,s1=arg1.toString(),s2=arg2.toString();
			try{m+=s1.split(".")[1].length}catch(e){}
			try{m+=s2.split(".")[1].length}catch(e){}
			return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
		},
		//日期选择器
		datepicker: function(o) {
			$(o).datepicker({
				dateFormat: 'yy-mm-dd',
				monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				dayNamesMin: ['日','一','二','三','四','五','六']
			});
		},
		strCount:function(str){
			var byteLen = 0;
			var strLen  = str.length;
			if(strLen){
				for(var i = 0; i < strLen; i++){
					if(str.charCodeAt(i)>255)
						byteLen += 1;
					else
						byteLen += 0.5;	//0.5不存在精度问题
				}
			}
			return byteLen;
		},
		refreshOrder:function(order_id, html){
			$('#order_' + order_id).replaceWith(html);
			var location = window.location.href;
			if (location.match(/order\/list/g)){
				// todo nothing
			}else{
				window.location.reload();
			}
		},
		checkTextarea:function(chkname,titname,maxnum){
			$(chkname).keyup(function(){
				var flTxt = Math.floor(maxnum-SF.Widget.txtLength(chkname));
				$(titname).html("您还可以输入"+flTxt+"个字");
				if(flTxt < 0){
					$(titname).html("<div style='color:#FF6600;'>您输入的字数已超出范围，不可以再输入</div>");
				}
			})
		},
		txtLength:function(chkname){
			var getTextarea = $(chkname).val();
			var firstLength = 0;
			for(var i=0;i<getTextarea.length;i++){
				var rs = SF.Widget.GetContentLanguage(getTextarea.substring(i,i+1));
				if(rs == "en"){
					firstLength += 0.5;
				}else{
					firstLength += 1;
				}
			}
			return firstLength;
		},
		checkEmail:function(str) {
			return str.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1;
		},
		GetContentLanguage:function(content){
			var rex;
			rex=content.charCodeAt();
			if (rex<=127) {
				return "en";
			}
		}
	};

	SF.App = {
		topSearch: function(s) {
			if ($(s).data('SF_BIND_FOCUS')) {
				return;
			}
			var $e = $(s);
			$e.bind({
				'focusin': function(e) {
					$e.removeClass('search_goods');
				},
				'focusout': function(e) {
					if ($.trim($e.val()) === '') {
						$e.addClass('search_goods');
					}
				}
			});
			$e.data('SF_BIND_FOCUS', true);
			$e.triggerHandler('focusin');
			return;
		}
	};
	window.SF = SF;
}(window));

//table tr.sflist
$(document).ready(function(){
	$('.sflist').hover(
		function() {$(this).addClass('off2');},
		function() {$(this).removeClass('off2');}
	);
});

//公用js类库
var COMSTATIC = {};
//手机正则校验
COMSTATIC.mobile_preg = function(mobile){
	var mobile_preg = /^1[3|4|5|7|8][0-9]{9}$/;
	var string = $.trim(mobile);
	if(mobile_preg.test(string)){
		return true;
	}
	return false;
}
//邮箱正则校验
COMSTATIC.mail_preg = function(mail){
	var mail_preg =  /^\w+([-+.\']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	var string = $.trim(mail);
	if(mail_preg.test(string)){
		return true;
	}
	return false;
}

var lenpoints = function(pwd) {
	if (pwd.length <6||pwd.length >20) {
		return 0;
	};
	if (pwd.length >= 6 && pwd.length <= 7) {
		return 10;
	};
	if (pwd.length >= 8) {
		return 25;
	};
	return 0;
};
var pwdTotal = function(pwd) {
	if (!pwd || pwd == 'undefined') {
		return - 1;
	};
	if(lenpoints(pwd)==0){
		return 0;
	}
	var digit01 = /^[0-9]+$/;
	var digit10 = /[0-9]+/;
	var digit02 = /^[a-z]+$/;
	var digit20 = /[a-z]+/;
	var digit03 = /^[A-Z]+$/;
	var digit30 = /[A-Z]+/;
	var digitStr = /[a-zA-Z]/;
	var digitOther = /[_]+/;
	var safeStr =/^[0-9a-zA-z_]+$/;
	var totalPoints =0;
	if(!safeStr.test(pwd)){
		return -1;
	}

	if (digit20.test(pwd) && digit30.test(pwd)) {
		totalPoints += 20;
	};
	var pwd_num = 0;
	var t_num = 0;
	var pwd_mi=0;
	var pwd_max=0;
	for (var i = 0; i <= pwd.length; i++) {
		if (digit01.test(pwd.substr(i, 1))) {
			pwd_num++;
		}
		if (digitOther.test(pwd.substr(i, 1))) {
			t_num++;
		}
		if (digit02.test(pwd.substr(i, 1))) {
			pwd_mi ++;
		}
		if (digit03.test(pwd.substr(i, 1))) {
			pwd_max ++;
		}
	};
	if(pwd_mi&&!pwd_max){
		totalPoints += 10;
	}
	if(!pwd_mi&&pwd_max){
		totalPoints += 10;
	}
	if (pwd_num >= 1 && pwd_num < 3) {
		totalPoints += 10;
	};
	if (pwd_num >= 3) {
		totalPoints += 20;
	};
	if (t_num == 1) {
		totalPoints += 10;
	};
	if (t_num > 1) {
		totalPoints += 25;
	};
	if (digit20.test(pwd) && digit30.test(pwd) && digit10.test(pwd) && digitOther.test(pwd)) {
		totalPoints+=lenpoints(pwd);
		return totalPoints += 20;
	}
	if (digitStr.test(pwd) && digit10.test(pwd) && digitOther.test(pwd)) {
		totalPoints+=lenpoints(pwd);
		return totalPoints += 3;
	};
	if (digitStr.test(pwd) && digit10.test(pwd)) {
		totalPoints+=lenpoints(pwd);
		return totalPoints += 2;
	};
	if(totalPoints==0){
		return -1;
	}
	totalPoints+=lenpoints(pwd);
	return totalPoints;
}
var doGetCoupon = function(id, key){
    $.ajax({
        url: '/CouponDraw/draw/',
        data: {cid:id, key:key},
        type : 'POST',
        dataType: 'json',
        success: function(resp) {
            if (resp) {
                if (resp.flag == 1) {
                    $.alerts.okButton = '查看优惠券';
                    $.alerts.alert(resp.msg,'提示',function(){
                        location.href = resp.url;
                    });
                } else if (resp.flag == 2) {
                    $.alerts.alert(resp.msg, '提示');
                } else if (resp.flag == 3) {
                    SF.Widget.login(window.location.href);
                } else if (resp.flag == 0) {
                    $.alerts.alert(resp.msg, '错误');
                }
            } else {
                $.alerts.alert('优惠券异常', '错误');
            }
        },
        error: function() {
            $.alerts.alert('优惠券异常', '错误');
        }
    });
};

