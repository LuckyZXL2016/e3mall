/**
 * used in product detail page
 *
 * @author mengfankang@sf-express.com
 * @since 2014-03-20
 */
(function(){
    var Goods = Goods || {};
	_SF_CFG.pid = _SF_CFG.parentId?_SF_CFG.parentId:_SF_CFG.productId;
	_SF_CFG.maxStockNum = 99;
	_SF_CFG.stockStatus = 0;

    //基础公共方法
    //Ajax参数
    Goods.initOpts = function(append) {
        var opts = {
            async: true,
            dataType: 'json',
            timeout: 10000,
            type : 'GET',
            error: Goods.errorEvent
        }
        if (!append) {
            return opts;
        }
        for (var i in append) {
            opts[i] = append[i];
        }
        return opts;
    };

    //Ajax Get 请求
    Goods.ajaxGet = function(opts) {
        var options = Goods.initOpts({
            url: opts.url,
            //success: (typeof opts.callback === 'function') ? opts.callback : Goods.defaultCallback
            success: function(resp) {
                if (resp.status == 1) {
                    if (typeof opts.callback === 'function') {
                        opts.callback(resp.data);
                    } else {
                        Goods.defaultCallback(resp.data);
                    }
                } else {
                    Goods.errorEvent(resp);
                }
            }
        });
        Goods.ajax(options);
    };

    //Ajax Post请求
    Goods.ajaxPost = function(opts) {
        var options = Goods.initOpts({
            url: opts.url,
            data: opts.data || {},
            type : 'POST',
            success: function(resp) {
                if (resp && resp.status == 1) {
                    if (typeof opts.callback === 'function') {
                        opts.callback(resp.data);
                    } else {
                        Goods.defaultCallback(resp.data);
                    }
                } else {
                    Goods.errorEvent(resp);
                }
            }
        });
        Goods.ajax(options);
    };

    Goods.ajax = function(opts) {
        $.ajax(opts);
    };

    Goods.defaultCallback = function(resp) {
    };

    Goods.errorEvent = function(resp) {
    };

    /************以下为基础Ajax请求**********/

    Goods.activity = function(product_id, callback, warehouseId) {
	var buyNum =  getUserBuyNum(product_id);
        Goods.ajaxPost({
            'url' : '/goods/activity/',
            'data': {'product_id': product_id,'num':buyNum, 'warehouse_id':warehouseId},
            'callback': callback
        });
    };

    Goods.stock = function(product_id, callback) {
	var buyNum =  getUserBuyNum(product_id);
        var price  = _SF_CFG.sfprice;
        Goods.ajaxPost({
            'url' : '/goods/stock/',
            'data': {'product_id': product_id,'num':buyNum,'price':price},
            'callback': callback
        });
    };

    Goods.shipfee = function(product_id, callback){
	var buyNum =  getUserBuyNum(product_id);
        var price  = _SF_CFG.sfprice;
        Goods.ajaxPost({
            'url' : '/goods/shipfee/',
            'data': { 'product_id': product_id, 'num':buyNum, 'price':price },
            'callback': callback
        });
    };

    //组合商品信息
    Goods.package = function(product_id, callback) {
		var buyNum = $("#number_"+product_id).val();
        Goods.ajaxPost({
            'url' : '/goods/package/',
            'data': {'product_id': product_id,'buy_num':buyNum},
            'callback': callback
        });
    };

    //单品价格
    Goods.price = function(product_id, callback) {
		var buyNum =  getUserBuyNum(product_id);
        Goods.ajaxPost({
            'url': '/goods/price/',
            'data': {'product_id' : product_id,'num':buyNum},
            'callback': callback
        });
    }

    //父子商品
    Goods.fatherson = function(product_id, parent_id, curr_url, callback) {
        Goods.ajaxPost({
            'url': '/goods/fatherson/',
            'data': {'product_id' : product_id, 'parent_id': parent_id, 'curr_url': curr_url},
            'callback':callback
        });
    }

    //获取时效
    Goods.time = function(callback) {
        Goods.ajaxPost({
            'url': '/goods/time/',
            'callback' : callback
        });
    }

    //获取相关品牌
    Goods.brands = function(tcid, cid, callback) {
        Goods.ajaxPost({
            'url': '/goods/relateBrand/',
            'data' : {'cid': cid, 'categoryOne': tcid},
            'callback': callback
        });
    }

    //获取相关商品
    Goods.zuheProduct = function(pids, callback) {
        Goods.ajaxPost({
            'url': '/goods/relation/',
            'data' : {'pids': pids},
            'callback': callback
        });
    }

    //历史访问
    Goods.history = function(product_id) {
        Goods.ajaxPost({
            'url': '/goods/history/',
            'data' : {'pid': product_id}
        });
    }

    //购买此商品的顾客还购买了
    Goods.buyrebuy = function(product_id, callback) {
        Goods.ajaxPost({
            'url': '/goods/buyrebuy/',
            'data' : {'pid': product_id},
            'callback': callback
        });
    }

    //浏览了该商品的顾客还浏览了
    Goods.browserbrowse = function(product_id, callback) {
        Goods.ajaxPost({
            'url': '/goods/browserbrowse/',
            'data': { 'pid': product_id},
            'callback' : callback
        });
    }

    //获取地区列表
    Goods.getRegion = function(callback) {
		var is_sfv = (3==_SF_CFG.businessModel)?1:0;
        Goods.ajaxPost({
            'url': '/goods/getRegion/',
			'data':{'is_sfv':is_sfv},
            'callback': callback
        });
    }

	//常用地址
	window.changeRegion = function(p,c,a,t){
		$.post("/product/changecity/",{provinceid:p,cityid:c,areaid:a,townid:t},function(str){
			Goods.getOldRegion(Goods.regionOldTpl);
			changeOpen();
		});
	}

    //切换城市
    Goods.changeCity = function(provinceid, cityid, areaid, townid, sfv){
        Goods.ajaxPost({
            'url': '/goods/changecity/',
            'data': { 'areaid': areaid, 'cityid': cityid, 'provinceid': provinceid, 'townid': townid, 'is_sfv':sfv}
        });
    }

    //获取评论
    Goods.getPl = function(pid, page, number, callback) {
        Goods.ajaxPost({
            'url': '/comments/ajaxPl/',
            'data': {'pid': pid, 'page': page, 'pageNum': number,'type': _SF_CFG.commentType},
            'callback': callback
        });
    }

    //获取晒单
    Goods.getSd = function(pid, page, number, ctype, callback) {
        Goods.ajaxPost({
            'url': '/comments/ajaxSd/',
            'data': {'pid': pid, 'page': page, 'pageNum': number, 'ctype': ctype},
            'callback': callback
        });
    }

    //获取预售信息
    Goods.preSell = function(product_id, callback) {
        Goods.ajaxPost({
            'url': '/goods/getPreSell/',
            'data': {'pid': product_id},
            'callback': callback
        });
    }

    //获取商品标签图片
    Goods.productIcon = function(product_id, callback) {
        Goods.ajaxPost({
            'url': '/goods/productIcon/',
            'data': {'pid': product_id},
            'callback': callback
        });
    }

    //销售排行
    Goods.saleTop = function (cid, callback) {
        Goods.ajaxPost({
            'url': '/goods/saletop/',
            'data': {'cid': cid},
            'callback': callback
        });
    }

    //获取地区老方法
    Goods.getOldRegion = function(callback){
		var is_sfv = (3==_SF_CFG.businessModel)?1:0;
        Goods.ajax({
            async: true,
            timeout: 10000,
            type : 'POST',
            url: '/product/getRegion/',
			data: {'is_sfv':is_sfv},
            success: callback
        });
    }

    //推荐商品
    Goods.recommendProduct = function(pid, callback) {
        Goods.ajaxPost({
            'url': '/goods/recommend/',
            'data': {'pid': pid},
            'callback': callback
        });
    }

    //浏览最终购买
    Goods.viewBuy = function(pid, callback) {
        Goods.ajaxPost({
            'url': '/goods/viewBuy/',
            'data': {'pid': pid},
            'callback': callback
        });
    }

    //收藏还收藏了
    Goods.userStore = function(pid, callback) {
        Goods.ajaxPost({
            'url': '/goods/userStore/',
            'data': {'pid': pid},
            'callback': callback
        });
    }

    /************以下为 Util 方法**********/

    //更改购买数量
    //type: 1数量减一，2数量加一，3初始化最小值，4检查库存
    Goods.changeNum = function(type) {

        var nbtnObj = $("#number_" + _SF_CFG.productId);
        var number = nbtnObj.val();

        if (_SF_CFG.buyNumber && number != parseInt(number)) {
            number = _SF_CFG.buyNumber;
        }

        //调整显示数量方法,Ajax回调用
        var CallbackChangeNumber = function(data) {
            _SF_CFG.maxStockNum = 99;
            if (type == 2){
                number++;
            }
            if (number >= _SF_CFG.maxBuy && _SF_CFG.maxStockNum>=99) {
                number = _SF_CFG.maxBuy;
                $("#add-sell-num").addClass('disable');
            }else if(number>=_SF_CFG.maxStockNum){
				number = _SF_CFG.maxStockNum;
                $("#add-sell-num").addClass('disable');
			}else {
                $("#add-sell-num").removeClass('disable');
            }
            if (number <= _SF_CFG.minBuy) {
                number = _SF_CFG.minBuy;
                $("#reduce-sell-num").addClass('disable');
            } else {
                $("#reduce-sell-num").removeClass('disable');
            }
            nbtnObj.val(number);
        }
        if (type == 2 || type == 4) {
			var buyNum = parseInt(number)+1;
			buyNum = type==2?buyNum:number;
			CallbackChangeNumber();
        } else if (type == 1){
			var buyNum = parseInt(number)-1;
			CallbackChangeNumber();
            number = (number - 1);
            if (number <= _SF_CFG.minBuy) {
                number = _SF_CFG.minBuy;
                $("#reduce-sell-num").addClass('disable');
            } else {
                $("#reduce-sell-num").removeClass('disable');
            }
            if(number >= _SF_CFG.maxBuy) {
                number = _SF_CFG.maxBuy;
                $("#add-sell-num").addClass('disable');
            }else if(number>=_SF_CFG.maxStockNum){
				number = _SF_CFG.maxStockNum;
                $("#add-sell-num").addClass('disable');
			}else {
                $("#add-sell-num").removeClass('disable');
            }
            nbtnObj.val(number);
        } else if (type == 3) {
            number = _SF_CFG.minBuy;
            nbtnObj.val(number);
        }
        _SF_CFG.buyNumber = number;
    }

    //抢购倒计时方法
    Goods.qiangGouRun = function(){
        Goods.ajax({
            async: true,
            dataType: 'json',
            timeout: 10000,
            type : 'POST',
            url: '/ajax/getQingGouByPid',
            data: {'productid': _SF_CFG.productId},
            success: function(data){
                if (data.status == 1) {
                    var startTime = data.startTime,
                        stopTime = data.stopTime,
                        adWord = data.ad_word,
                        nowTime = data.nowtimes + 1,
                        tObj,
                        diffTime;
                    var CountdownTime = function(){
                            var day, hour, minute, second;
                            diffTime = stopTime - nowTime;
                            day = Math.floor(diffTime / 86400);
                            hour = Math.floor((diffTime % 86400) / 3600);
                            minute = Math.floor((diffTime % 3600) / 60);
                            second = diffTime % 60;
                            if (diffTime >= 0 && nowTime >= startTime) {
                                $("#qianggou-sf").html('仅剩： '+day+' 天 '+hour+' 小时 '+minute+' 分 '+second+' 秒');
                            } else {
                                if (typeof tObj == 'number') clearInterval(tObj);
                                Goods.price(_SF_CFG.productId, Goods.priceTpl)
                            }
                            nowTime += 1;
                        }
                    tObj = setInterval(CountdownTime, 1000);
                }
            },
            error: Goods.errorEvent
        });
    }

    //控制相关品牌的展示隐藏
    Goods.brandToggle = function() {
        if($("#brandCon ul li a").length > 6){
            var $brands =$("#brandCon ul li a:gt(5)");
            $brands.hide();
            $("#brandCon").find("b").removeClass().addClass("hide");
            $("#brandCon span").addClass("clickShow");
            $(".clickShow").toggle(function(){
                $brands.show();
                $(this).find("b").removeClass().addClass("show");
            },function(){
                $brands.hide();
                $(this).find("b").removeClass().addClass("hide");
            })
        } else {
            $(".clickShow").hide();
        }
    }

    //控制关联商品宽度
    Goods.groupShow = function(id) {
        var groupPro = $(id).find("li").outerWidth() * ($(id).find("li").length);
        $(id).css("width",groupPro);
        $(id).find("li:last").find("b").hide();
		if($(id).find("li").length < 5){
	    	$("#zuhe").find(".suits").css("overflow-x","hidden");
		} else {
	    	$("#zuhe").find(".suits").css("overflow-x","auto");
        }
    }

	//控制关联套装商品宽度
    Goods.packageShow = function() {
        $("#package").find("ul").each(function(){
		    var t = $(this),
			    i = t.find("li"),
			    w = i.outerWidth(),
				l = i.length;
		    t.css("width",w * l);
			t.find("li:last").find("b").hide();
			if(l < 6){
	    		t.parent().css("overflow-x","hidden");
			} else {
	    		t.parent().css("overflow-x","auto");
            }
		})
    }

    //计算组合商品价格
    Goods.calculateZuhePrice = function() {
        var totalprice = 0;
        var totalsfprice = 0;
        //关联商品
        $('.gbatch:checked').each(
            function (){
                totalprice += parseFloat($(this).attr('price'));
                totalsfprice += parseFloat($(this).attr('sfprice'));
            }
        );
        //主商品
        totalprice += parseFloat(_SF_CFG.price);
        totalsfprice += parseFloat(_SF_CFG.sfprice);
        $('#totalprice').html(parseFloat(totalprice).toFixed(2));
        $('#youhuiprice-sf').html(parseFloat(totalsfprice-totalprice).toFixed(2));
    }

    //晒单跳转
    Goods.gotosun = function(pid, type) {
        $.post("/comments/isSunProduct/id/"+pid+"/ctype/"+type,null,function(data){
            if(data.data == 0){
                jAlert(data.info,'提示信息');
            }else if(data.data == 2){
                jAlert(data.info,'提示信息',function(e){
                    if(e){
                        SF.Widget.login();
                    }
                });
            }else if (data.data == 1)
            {
                window.open( _SF_CFG.homeurl + '/comments/index/pid/'+pid+'/doname/slist');
            }
        },"json");
    }

    //评论跳转
    Goods.gotoPl = function () {
        $.post("/mark/isPlProduct/id/"+ _SF_CFG.productId +"/flag/0",null,function(data){
            if(data.data == 0){
                //jAlert(data.info,'提示信息');
				$.alerts.okButton = '确定';
				jAlertNew(1, 0, 368, '<div class="sd_word1">'+data.info+'</div>', '提示');
				$.cookie('flagComment','', { expires:-1});
            }else if(data.data == 2){
				$.cookie('flagComment', '1');
				var currentUrl = window.location.href;
				var currentUrlArr =  currentUrl.split('.html');
				var myCurrentUrl = currentUrlArr[0]+".html#flagComment"+currentUrlArr[1];
				SF.Widget.login(myCurrentUrl);
            }else if (data.data == 1) {  //发表评价
                window.open( _SF_CFG.homeurl + '/comments/index/pid/'+ _SF_CFG.productId);
            }
        },"json");
    }

    //格式化时间戳
    Goods.formatDateTime = function(time) {
        var T = new Date(time * 1000),
            checkTime = function(i){
                if ( i < 10 ) {
                    i = "0" + i;
                }
                return i;
            },
            timeString = T.getFullYear()
                       + "-"
                       + checkTime(T.getMonth() + 1)
                       + "-"
                       + checkTime(T.getDate())
                       + ' '
                       + checkTime(T.getHours())
                       + ':'
                       + checkTime(T.getMinutes());
        return timeString;
    }

    //处理收藏
    Goods.addFav = function(This) {
        $.post("/favorites/create/product_id/" + _SF_CFG.productId + "/",{ispresale: _SF_CFG.presellId },function(str){
            if(str.status == 2){
                //document.location.href= _SF_CFG.passporturl + '?returnUrl='+document.location.href;
				$.cookie('flagAddFav','1');
				var currentUrl = window.location.href;
				var currentUrlArr =  currentUrl.split('.html');
				var myCurrentUrl = currentUrlArr[0]+".html?flagAddFav=1"+currentUrlArr[1];
				SF.Widget.login(myCurrentUrl);
            }else{
				$.cookie('flagAddFav','', { expires:-1});
                var html = '<div class="pWindow" id="pFavorite">'
                         + '<div class="cm">'
                         + '<div class="hd">'
                         + '<span class="getIt">' + (str.status == 1 ? '收藏成功': '您已收藏过') + '</span><span class="showOther"><a href="'+ _SF_CFG.homeurl +'/favorites/index/" target="_blank">查看收藏夹</a></span>'
                         + '</div>'
                         + '<div class="bd" id="faved-also-fav-sf">'
                         + '更多值得收藏商品加载中...'
                         + '</div><div class="pClose" onclick="$(\'#pFavorite\').hide();"></div></div>';

                var body = $('body');
                body.find('#pFavorite').remove();
                body.append($(html));
                var top = $(This).offset().top + 20,left = $(This).offset().left -200;
                $("#pFavorite").css({"top":top,"left":left}).show();
                Goods.userStore(_SF_CFG.productId, Goods.userStoreTpl);
            }
        },"json");
    }

	//处理到货通知
    Goods.arrivalNotice = function(This) {
        $.post("/Goods/ArrivalNotice/product_id/" + _SF_CFG.productId + "/",{ispresale: _SF_CFG.presellId },function(str){
            if(str.status == 2){
                SF.Widget.login();
            }else{
				$("#user_email").val(str.data.user_email)
				$("#user_mobile").val(str.data.user_mobile)
				var top = $(This).offset().top -5,left = $(This).offset().left -91;
                $("#win1").css({"top":top,"left":left, "position": "absolute"}).show();
				$("#mobile_error").hide();
				$("#email_error").hide();
				$("#mobileDiv").removeClass('okBorder');
				$("#emailDiv").removeClass('okBorder');
            }
        },"json");
    }

	//处理到货通知
    Goods.arrivalNoticeDo = function() {
		var flag = $("input[name='flag']:checked").val();
		var user_email = $("#user_email").val();
		var user_mobile = $("#user_mobile").val();
		$("#mobileDiv").removeClass('okBorder');
		$("#emailDiv").removeClass('okBorder');
		$("#email_error").hide();
		$("#mobile_error").hide();
		if(1==flag){
			if(user_email){
				var mailReg = /^[a-zA-Z1-9_\.-][a-zA-Z0-9_.-]{3,}@([a-zA-Z0-9_-]+\.){1,5}[A-Za-z]{2,4}$/;
				if(!mailReg.test(user_email)){
					$("#email_error").html('邮箱格式不正确，请重新输入');
					$("#email_error").show();
					$("#emailDiv").addClass('okBorder');
					return false;
				}
			}else{
				$("#email_error").html('请输入您的邮箱地址');
				$("#email_error").show();
				$("#emailDiv").addClass('okBorder');
				return false;
			}
		}
		if(2==flag){
			var user_mobile = $("#user_mobile").val();
			if(user_mobile){
				var mobileReg = /^13[0-9]{1}[0-9]{8}$|147[0-9]{8}$|15[012356789]{1}[0-9]{8}$|18[0256789]{1}[0-9]{8}$|170[0-9]{8}$/;
				if(!mobileReg.test(user_mobile)){
					$("#mobile_error").html('手机格式不正确，请重新输入');
					$("#mobile_error").show();
					$("#mobileDiv").addClass('okBorder');
					return false;
				}
			}else{
				$("#mobile_error").html('请输入您的手机号码');
				$("#mobile_error").show();
				$("#mobileDiv").addClass('okBorder');
				return false;
			}
		}
		if(1!=flag && 2!=flag){
			jAlert('请选择到货通知方式');
			return false;
		}
        $.post("/Goods/ArrivalNoticeDo/product_id/" + _SF_CFG.productId + "/",{flag:flag,user_email:user_email,user_mobile:user_mobile},function(str){
            if(str.status == 2){
                jAlert('未登录');
            }else{
				if(0 == str.status){
					 var top = $("#arrival_notice").offset().top -5,left = $("#arrival_notice").offset().left -91;
					 $("#win1").hide();
					 $("#win2").css({"top":top,"left":left, "position": "absolute"}).show();
				}else{
					jAlert(str.data);
				}
            }
        },"json");
    }
	

    //服务承诺异步加载
    Goods.fuwu = function(){
        var $this = $(this);
        $.post("/goods/fuwu/", {'mod':_SF_CFG.businessModel}, function(r){
            $("#div-params").html(r);
        }, 'json');
    }

    //饮食文化异步加载
    Goods.yinshi = function() {
        var $this = $(this);
        $.post("/goods/article/", {pid: _SF_CFG.productId}, Goods.articleTpl, 'json');
    }

    /************以下为处理展示方法**********/

    //配送时效
    Goods.timeTpl = function (data) {
        var timeStr = '';
        if (_SF_CFG.businessModel == 4 || _SF_CFG.businessModel == 7) {
            //timeStr = '由商家发货，预计发货后<strong>'+data+'</strong>送达';
        } else if (_SF_CFG.businessModel == 3 && _SF_CFG.oneCategoryId == 8) {
            timeStr = '原产地直供，发货后预计<strong>2-5天</strong>内为您送达';
        } else if (_SF_CFG.businessModel == 3) {
            timeStr = '原产地直供，发货后预计<strong>2-5天</strong>内为您送达';
        } else if (data == '24小时' || data == '48小时') {
            timeStr = '预计<strong>' + data + '</strong>内为您送达';
        } else if (data == '0') {//配送时效为0时增加的判断 
            timeStr = '';
        } else {
            timeStr = '预计2-5天内为您送达';
        }
        $("#time-sf").show().html(timeStr);
    }
    //配送时效
    Goods.timeTplBook = function (data) {
        var timeStr = '';
        if (_SF_CFG.businessModel == 4 || _SF_CFG.businessModel == 7) {
            $("#time-sf").show().html('可预订');
        } else if (_SF_CFG.businessModel == 3) {
            timeStr = '原产地直供，发货后预计<strong>2-5天</strong>内为您送达';
        } else if (data == '24小时' || data == '48小时') {
            timeStr = '到货后，预计<strong>' + data + '</strong>内为您送达';
        } else if (data == '0') {//配送时效为0时增加的判断 
            timeStr = '';
        } else {
            timeStr = '预计2-5天内为您送达';
        }
        $("#time-sf").show().html(timeStr);
    }

    //处理库存在页面的展示
    Goods.stockTpl = function(data) {
        var stockId = parseInt(data.stock);
        var warehouseId = parseInt(data.warehouse);
	_SF_CFG.stockStatus = stockId;
        switch(stockId) {
            case 1: //缺货
            case 6: //已下架
            case 7: //缺货
                $("#buy-nogood-sf").show();    //显示无货
                $("#buy-btn-sf").hide();       //购买btn
                $("#time-sf").hide();          //配送时效显示
                $("#buy-canntsend-sf").hide(); //无法送达
                $("#add-cart-r-btn-sf").hide();//浮动层加入购物车
                $("#zuhe").hide();             //关联商品
                $("#package").hide();          //礼包
                $("#promotion-sf").hide();     //活动隐藏
		$("#viewBuyDiv").hide();       //浏览此商品的顾客还买了
                Goods.viewBuy(_SF_CFG.productId, Goods.viewBuyTpl);
                break;
            case 2: //可预订
                $("#buy-nogood-sf").hide();    //无货
                $("#buy-btn-sf").show();       //购买btn
                Goods.timeTplBook(data.time);//配送时效显示
                $("#buy-canntsend-sf").hide(); //无法送达
                $("#finalbuy-sf").hide();      //浏览还购买
                $("#add-cart-r-btn-sf").show();//浮动层加入购物车
                $("#zuhe").show();             //关联商品
                $("#package").show();          //礼包
                Goods.activity(_SF_CFG.productId, Goods.activityTpl, warehouseId);
                0 !== $("#groupPro0").length && Goods.groupShow("#groupPro0");
		0 !== $("#package").length && Goods.packageShow();
		$("#viewBuyDiv").show();
		Goods.viewBuy(_SF_CFG.productId, Goods.viewBuyLeftTpl);//浏览最终购买了
                break;
            case 3: //无法送达
                $("#buy-nogood-sf").hide();    //无货
                $("#buy-btn-sf").hide();       //购买btn
                $("#time-sf").hide();          //配送时效显示
                $("#buy-canntsend-sf").show(); //无法送达
                $("#buy-cancel-sf").hide();    //已下架
                $("#add-cart-r-btn-sf").hide();//浮动层加入购物车
                $("#zuhe").hide();             //关联商品
                $("#package").hide();          //礼包
		$("#viewBuyDiv").hide();       //浏览此商品的顾客还买了
                Goods.viewBuy(_SF_CFG.productId, Goods.viewBuyTpl);
                Goods.activity(_SF_CFG.productId, Goods.activityTpl, warehouseId);
                break;
            default: //默认处理 4现货 5有货
	        if(_SF_CFG.businessModel == 4){
                    Goods.timeTpl(data.time); //获取商家配送时效
		}else{
		    //Goods.time(Goods.timeTpl); //获取配送时效
		    Goods.timeTpl(data.time);
                }
                $("#buy-btn-sf").show(); //显示购买btn
                $("#buy-nogood-sf").hide();    //无货
                $("#buy-canntsend-sf").hide(); //无法送达
                $("#buy-cancel-sf").hide();    //已下架
                $("#finalbuy-sf").hide();      //浏览还购买
                $("#add-cart-r-btn-sf").show();//浮动层加入购物车
                $("#zuhe").show();             //关联商品
                $("#package").show();          //礼包
                Goods.activity(_SF_CFG.productId, Goods.activityTpl, warehouseId);
                0 !== $("#groupPro0").length && Goods.groupShow("#groupPro0");
                0 !== $("#package").length && Goods.packageShow();
                $("#viewBuyDiv").show();
                Goods.viewBuy(_SF_CFG.productId, Goods.viewBuyLeftTpl);//浏览最终购买了
                break;
        }
        //将模板插入页面中
        $("#stock").html(stockId);
        _SF_CFG.warehouse = data.warehouse;
        Goods.GoogleTpl();
        Goods.shipfeeTpl(data);
    }

    Goods.shipfeeTpl = function(data) {
        if (data.code != 255) {
            var shipFeeDiv = function(fee) {
                if($('.pFreight').length == 0) {
                    var shipFeeDivHtml = '<div class="pItemsStock pFreight"> <div class="dt">运费：</div> <div class="dd"> ￥ <em>0</em> </div> </div>';
                    $('.pItemsStock').after(shipFeeDivHtml);
                }
                if (fee > 0) {
                    $('.pFreight em').html(fee);
                }
            }
            if (_SF_CFG.stockStatus != 3) {
                shipFeeDiv(data.shipfee);
            } else {
                if ($('.pFreight').length > 0) {
                    $('.pFreight').remove();
                }
            }
        }
    }

    //处理价格显示
    Goods.priceTpl = function(data) {
        var tpl = '',
            pricetpl,
            sfpricetpl,
            price = data.price,
            sfprice = data.sfprice,
            fprice,
            dom;
        switch(data.type) {
            case 1:
                fprice = price.toString().split('.');
                if (fprice.length > 1) {
                    sfpricetpl = '<strong class="price">' + fprice[0] + '<span>.' + fprice[1] + '</span></strong>';
                } else {
                    sfpricetpl = '<strong class="price">' + fprice[0] + '</strong>';
                }
                var sfpriceStr = '';
                if (sfprice) {
                    //sfpriceStr = '<span class="dd">￥' + sfprice + '</span>';
                }
                tpl = '<div class="priceBox"><span class="dt">抢购价：</span><span class="rmb">￥</span>' + sfpricetpl
                    + '<span class="dt"></span>'+sfpriceStr+'</div><div class="daoJiShi" id="qianggou-sf"></div>';
                break;
            case 2:
                fprice = price.toString().split('.');
                if (fprice.length > 1) {
                    sfpricetpl = '<strong class="price">' + fprice[0] + '<span>.' + fprice[1] + '</span></strong>';
                } else {
                    sfpricetpl = '<strong class="price">' + fprice[0] + '</strong>';
                }
                var sfpriceStr = '';
                if (sfprice) {
                    //sfpriceStr = '<span class="dd">￥' + sfprice + '</span>';
                }
                tpl = '<div class="priceBox"><span class="dt">优选价：</span><span class="rmb">￥</span>'
                    + sfpricetpl
                    + '<span class="dt"></span>'+sfpriceStr+'</div>';
                break;
            case 3:
                sfprice = sfprice.toString().split('.');
                if (sfprice.length > 1) {
                    sfpricetpl = '<strong class="price">' + sfprice[0] + '<span>.' + sfprice[1] + '</span></strong>';
                } else {
                    sfpricetpl = '<strong class="price">' + sfprice[0] + '</strong>';
                }
                var priceStr = '';
                if (price) {
                    priceStr = '<span class="rmb">￥</span><span class="dd2">' + price + '</span>';
                }
                tpl = '<div class="priceBox"><span class="dt">优选价：</span><span class="rmb">￥</span>'
                    + sfpricetpl
                    + '<span class="dt">银卡及以上会员价：</span>'+priceStr+'</div>';
                break;
            case 32:
                sfprice = sfprice.toString().split('.');
                if (sfprice.length > 1) {
                    sfpricetpl = '<strong class="price">' + sfprice[0] + '<span>.' + sfprice[1] + '</span></strong>';
                } else {
                    sfpricetpl = '<strong class="price">' + sfprice[0] + '</strong>';
                }
                var priceStr = '';
                if (price) {
                    priceStr = '<span class="rmb">￥</span><span class="dd2">' + price + '</span>';
                }
                tpl = '<div class="priceBox"><span class="dt">优选价：</span><span class="rmb">￥</span>'
                    + sfpricetpl
                    + '<span class="dt">金卡及以上会员价：</span>'+priceStr+'</div>';
                break;
            case 33:
                sfprice = sfprice.toString().split('.');
                if (sfprice.length > 1) {
                    sfpricetpl = '<strong class="price">' + sfprice[0] + '<span>.' + sfprice[1] + '</span></strong>';
                } else {
                    sfpricetpl = '<strong class="price">' + sfprice[0] + '</strong>';
                }
                var priceStr = '';
                if (price) {
                    priceStr = '<span class="rmb">￥</span><span class="dd2">' + price + '</span>';
                }
                tpl = '<div class="priceBox"><span class="dt">优选价：</span><span class="rmb">￥</span>'
                    + sfpricetpl
                    + '<span class="dt">钻石卡会员价：</span>'+priceStr+'</div>';
                break;
            case 4:
                fprice = sfprice.toString().split('.');
                if (fprice.length > 1) {
                    sfpricetpl = '<strong class="price">' + fprice[0] + '<span>.' + fprice[1] + '</span></strong>';
                } else {
                    sfpricetpl = '<strong class="price">' + fprice[0] + '</strong>';
                }
                //if (price) {
                //    tpl = '<div class="priceBox"><span class="dt">优选价：</span><span class="rmb">￥</span>'+ sfpricetpl + '<span class="dt"></span>' + price + '</span></div>';
                //} else {
                    tpl = '<div class="priceBox"><span class="dt">优选价：</span><span class="rmb">￥</span>'+ sfpricetpl + '</div>';
                //}
                break;
            default:
                fprice = sfprice.toString().split('.');
                if (fprice.length > 1) {
                    sfpricetpl = '<strong class="price">' + fprice[0] + '<span>.' + fprice[1] + '</span></strong>';
                } else {
                    sfpricetpl = '<strong class="price">' + fprice[0] + '</strong>';
                }
                //if(price){
                //    tpl = '<div class="priceBox"><span class="dt">优选价：</span><span class="rmb">￥</span>' + sfpricetpl + '<span class="dt"></span><span class="dd">￥' + price + '</span></div>';
                //} else {
                    tpl = '<div class="priceBox"><span class="dt">优选价：</span><span class="rmb">￥</span>' + sfpricetpl + '</div>';
                //}

                break;
        }
        tpl += '<div class="boxWb"></div>';
        $("#price-sf").html(tpl);
        if (data.type == 1) {
            Goods.qiangGouRun();
        }
        _SF_CFG.sfprice = sfprice;
        _SF_CFG.price = price ? price : sfprice ;
        Goods.productStamp();
        Goods.GoogleTpl();
    }

    //活动显示
    Goods.activityTpl = function(data) {
        //修改广告语
        if(data.adword){
            $("#adword-sf").attr("class","");
            changeGoodsAdwordClass(data.adword);
        }else{
            $("#adword-sf").attr("class","");
            data.adword = '';
            changeGoodsAdwordClass(data.adword);
        }
        if(data.maxbuy>_SF_CFG.maxBuy){
            $("#add-sell-num").removeClass('disable');
        }
        _SF_CFG.minBuy = data.minbuy;
        _SF_CFG.maxBuy = data.maxbuy;
        var buyNum = $("#number_"+_SF_CFG.productId).val();
        if(undefined==buyNum){
            buyNum=1
        }
        //当用购买的最小数量，小于规定的最小数量时才初始化最小数量
        if(parseInt(buyNum)<parseInt(data.minbuy)){
                Goods.changeNum(3);
        }
        //写入活动信息
        var tpl = '', act, item;
        if (data.activityCount) {
            var act = data.activityList;
            if (act[10002]) {
                item = act[10002];
                tpl += '<li class="promotion"><span class="ct">直降</span><span class="cm">指定商品已优惠' + item.price + '元</span><span class="clear"></span></li>';
            }
            if (act[10006]) {
                item = act[10006];
                tpl += '<li class="promotion"><span class="ct">下单立减</span><span class="cm">指定商品下单后即可立减'+ item.price  +'元</span><span class="clear"></span></li>';
            }
            if (act[10004]) {
                item = act[10004];
                if (item.count && item.count > 0) {
                    for ( var i in item.list) {
                        var sitem = item.list[i];
                        if (sitem.url) {
                            tpl += '<li class="pGifts"><span class="ct">买赠</span>';
                            tpl += sitem.img ? '<span class="cp"><a href="'+sitem.url+'" target="_blank"><img src="'+ sitem.img +'" /></a></span>' : '';
                            tpl += '<span class="cm"><a href="'+ sitem.url +'" target="_blank">'+ sitem.product_name +'*'+ sitem.product_num +'</a></span></li>';
                        } else {
                            tpl += '<li class="pGifts"><span class="ct">买赠</span>';
                            tpl += sitem.img ? '<span class="cp"><img src="'+ sitem.img +'" /></span>' : '';
                            tpl += '<span class="cm">'+ sitem.product_name +'*'+ sitem.product_num +'</span></li>';
                        }
                    }
                }
            }
            if (act[10008]) {
                item = act[10008];
                tpl += '<li class="promotion"><span class="ct">满减</span><span class="cm">';
                if (item.url) {
                    tpl += '<a href="'+ item.url +'" target="_blank">指定商品参加满'+ item.full  +'元减'+ item.reduct +'元的活动</a>';
                } else {
                    tpl += '指定商品参加满'+ item.full  +'元减'+ item.reduct +'元的活动';
                }
                tpl += '</span><span class="clear"></span></li>';
            }
            if (act[10012]) {
                item = act[10012];
                tpl += '<li class="promotion"><span class="ct">满返</span><span class="cm">';
                if (item.url) {
                    tpl += '<a href="'+ item.url +'" target="_blank">指定商品参加满'+ item.full  +'元返优惠券的活动</a>';
                } else {
                    tpl += '指定商品参加满'+ item.full  +'元返优惠券的活动';
                }
                tpl += '</span><span class="clear"></span></li>';
            }
            if (act[10005]) {
                item = act[10005];
                tpl += '<li class="promotion"><span class="ct">满赠</span><span class="cm">';
                if (item.url) {
                    tpl += '<a href="'+ item.url +'" target="_blank">指定商品参加满'+ item.full  +'元送赠品的活动</a>';
                } else {
                    tpl += '指定商品参加满'+ item.full  +'元送赠品的活动';
                }
                tpl += '</span><span class="clear"></span></li>';
            }
            if (act[10016]) {
                if (act[10016].count > 0) {
                    var jjgFirst = '', jjgList = '', number = 1, linkA = '', linkB = '';
                    for (var i in act[10016].list) {
                        item = act[10016].list[i];
                        if (act[10016].url) {
                            linkA = '<a href="'+ act[10016].url +'" target="_blank">';
                            linkB = '</a>';
                        }
                        if (number == 1) {
                            jjgFirst += '<span class="fl">' + linkA  + '指定商品参加满'+ item.full +'元加' + item.add + '元换购的活动'+ linkB +'</span>';
                            if (act[10016].count > 1) {
                                jjgFirst += '<b></b>';
                            }
                        }
                        if (act[10016].count > 1) {
                            jjgList += '<dd>'+ linkA +'指定商品参加满'+item.full+'元加'+ item.add +'元换购的活动'+ linkB +'</dd>';
                        }
                        number++;
                    }
                    if (jjgList) {
                        jjgList = '<div style="display:none;" class="sdd"><span class="ct">加价购</span><dl style="height:66px;overflow:hidden;overflow-y:auto;">' + jjgList + '</dl></div>';
                    }
                    tpl += '<li class="promotion" ><div class="ct">加价购</div><div class="fl scm" id="jjgou">'+ jjgFirst + jjgList +'<span class="clear"></span></div><span class="clear"></span></li>';
                }
            }
            if (act[10003]) {
                item = act[10003];
                tpl += '<li class="promotion"><span class="ct">特殊商品</span><span class="cm">指定商品下单后即可得'+ item.multiples +'倍积分</span><span class="clear"></span></li>';
            }
            if (act['S10015']) {
                item = act['S10015'];
                tpl += '<li class="promotion"><span class="ct">限时抢购</span><span class="cm">限时抢购价'+ item.price +'元   手机客户端用户专享</span><span class="clear"></span></li>';
            }
            if (act['NM']) {
                item = act['NM'];
                tpl += '<li class="promotion"><span class="ct">N元M件</span><span class="cm"><a href="'+ item.url +'" target="_blank">' + item.name + '</a></span><span class="clear"></span></li>';
            }
            if (act['GF']) {
                item = act['GF'];
                tpl += '<li class="promotion"><span class="ct">赠品</span><span class="cm">单笔订单订购' + item.number + '件赠送手提袋。</span><span class="clear"></span></li>';
            }

            tpl = '<div class="dt">促销信息：</div>'
                + '<div class="dd"><ul class="promoBox">'
                + tpl
                + '</ul></div><span class="clear"></span>';
            $("#promotion-sf").show().html(tpl);
            //加价购需要写入事件
            $("#jjgou").mouseenter(function() {
                $(this).find(".sdd").show();
            }).mouseleave(function() {
                $(this).find(".sdd").hide();
            });
        } else {
            $("#promotion-sf").hide();
        }
    }

    //地区显示
    Goods.regionTpl = function(data) {
        var regionShow, //库存地址展示
            regionTitle, //库存地址展示title
            regionList; //地区Tab列表
        regionShow = data.province.region_name;
        regionList = '<li><a data-widget="province" href="javascript:void(0);" title="' + data.province.region_name + '"><em>' + data.province.region_name + '</em><i></i></a></li>';
        if (data.province.municipality == '0') {
            regionShow += data.city.region_name;
            regionList += '<li><a data-widget="city" href="javascript:void(0);" title="' + data.city.region_name + '"><em>' + data.city.region_name + '</em><i></i></a></li>';
        }
        regionShow += data.area.region_name;
        regionTitle = data.province.region_name
                    + data.city.region_name
                    + data.area.region_name;
        if (data.town) {
            regionShow += data.town.region_name;
            regionTitle += data.town.region_name;
            regionList += '<li><a data-widget="area" href="javascript:void(0);" title="' + data.area.region_name + '"><em>' + data.area.region_name + '</em><i></i></a></li>';
            regionList += '<li><a data-widget="town" class="hover" href="javascript:void(0);" title="' + data.town.region_name + '"><em>' + data.town.region_name + '</em><i></i></a></li>';
        } else {
            regionList += '<li><a data-widget="area" class="hover" href="javascript:void(0);" title="' + data.area.region_name + '"><em>' + data.area.region_name + '</em><i></i></a></li>';
        }
        $("#region-t-sf").html(regionShow).attr('title', regionTitle);
        $("#store-selector").find('.tab').html(regionList);
        //省市区切换
        $("#store-selector").find('.mt a').click(function(){
            var ts = $(this);
            var id = ts.attr('data-widget');
            $("#store-selector .mt a").removeClass('hover');
            $("#store-selector .mc").hide();
            $("#stock_" + id + "_item").show();
            ts.addClass('hover');
        });
        //写入省数据
        var provinceStr = '';
        if (data.provincelist) {
            for( var i in data.provincelist) {
                var arr = data.provincelist[i];
                provinceStr += '<li ' + arr.classStyle +'><a href="javascript:void(0);" is-last="' + arr.is_last + '"  data-value="'+arr.region_id+'">' + arr.region_name + '</a></li>';
            }
        }
        $("#stock_province_item ul").html(provinceStr);

        //如果不是直辖市，写入城市
        var cityStr = '';
        if (data.citylist && data.province.municipality == '0') {
            for (var i in data.citylist) {
                var arr = data.citylist[i];
                cityStr += '<li ' + arr.classStyle +'><a href="javascript:void(0);" is-last="' + arr.is_last + '"  data-value="'+arr.region_id+'">' + arr.region_name + '</a></li>';
            }
        }
        $("#stock_city_item ul").html(cityStr);

        //写入区
        var areaStr = '';
        if (data.arealist) {
            for (var i in data.arealist) {
                var arr = data.arealist[i];
                areaStr += '<li ' + arr.classStyle +'><a href="javascript:void(0);" is-last="' + arr.is_last + '"  data-value="'+arr.region_id+'">' + arr.region_name + '</a></li>';
            }
        }
        $("#stock_area_item ul").html(areaStr);

        //写入街道
        var townStr = '';
        if (data.townlist) {
            for (var i in data.townlist) {
                var arr = data.townlist[i];
                townStr += '<li ' + arr.classStyle +'><a href="javascript:void(0);" is-last="' + arr.is_last + '"  data-value="'+arr.region_id+'">' + arr.region_name + '</a></li>';
            }
        }
        $("#stock_town_item ul").html(townStr);
    }

    //地区显示老方法
    Goods.regionOldTpl = function(str) {
        if(str){
            $("#regionSf").html(str);
        }
    }

    //父子商品展示
    Goods.fathersonTpl = function(data) {
        var str = '';
        if (data.count > 0) {
            for (var i in data.list) {
                var arr = data.list[i];
                str += '<li ' + (arr.eqcurrUrl == '1' ? 'class="selected"': '') + '><a class="typeBlock" href="'+arr.url+'">'+arr.name+'</a><span></span></li>';
            }
        }
        $("#fatherson-sf").html(str);
    }

    //右上角标签展示
    Goods.productIconTpl = function(data) {
        var str = '';
        if (data) {
          for ( var i in data) {
                    if(data[i].indexOf('productattr3')>0){
                        str += '<li class="has_poptip attr3"><img src="' + data[i] + '">';
                        str += '</li><script>0 !== $(".has_poptip").length && poptipShow();</script>';
                    //}else if(data[i].indexOf('e3033e46c7067234571e13c215481d1d')>0){//D
                    }else if(data[i].indexOf('87dff42bd2505998a3d1c4a01949b7cc')>0){
                        str += '<li class="has_poptip"><img src="' + data[i] + '">';
                        str += '</li><script>0 !== $(".has_poptip").length && poptipShow();</script>';
            }else{
                        str += '<li><img src="' + data[i] + '"></li>';
                    }
          }
        }
        $('#points-sf').html(str);
    }

    //处理评论数据(包括第一屏右侧好评度)
    Goods.commentTpl = function(data) {
        //如果第一页，刷新首屏右侧
        if (_SF_CFG.commentPage == 1 && data && _SF_CFG.commentType == 0) {
            $("#positive-sf").attr('style', data.score.positive + '%');
            $("#positive-num-sf").html(data.score.positive);
            //写入最新好评
            if (data.best.author && data.best.comment) {
                var str = '<dt><a href="javascript:ToCommentPosition();">'+ data.pageCount[0] +' 条评论</a></dt>'
                        + '<dd><b></b><div><span>'+ data.best.author +'：<a href="javascript:ToCommentPosition();">'+ data.best.comment +'</a></span></div></dd>';
                $("#bestComment-sf").html(str);
            }else{
                if(data.pageCount[0]>0){
                     var str = '<dt><a href="javascript:ToCommentPosition();">'+ data.pageCount[0] +' 条评论</a></dt>';
                    $("#bestComment-sf").html(str);
                }
            }
            $("#user-comment-sf").html(data.score.positive);

            var sorceListStr = '';
            sorceListStr += '<dl><dt>好评</dt><dd class="pBar"><div style="width:'+ data.score.positive +'px;"></div></dd><dd>'+ data.score.positive +'%</dd></dl>';
            sorceListStr += '<dl><dt>中评</dt><dd class="pBar"><div style="width:'+ data.score.middle +'px;"></div></dd><dd>'+ data.score.middle +'%</dd></dl>';
            sorceListStr += '<dl><dt>差评</dt><dd class="pBar"><div style="width:'+ data.score.bad +'px;"></div></dd><dd>'+ data.score.bad +'%</dd></dl>';
            $("#sorce-star-sf").html(sorceListStr);
            $(".comment-total-sf").html(data.pageCount[0]);
            if(0==data.pageCount[0]){
                var str = '<dd><b></b><div><span><p>还没人评论哦！</p><p><a href="javascript:Goods.gotoPl()" class="green">马上评价</a></p></span></div></dd>';
                $("#bestComment-sf").html(str);
            }
            var fontIndex = 0;
            $("#comment-filter-sf").find('font').each(function(){
                $(this).html('('+data.pageCount[fontIndex]+')');
                fontIndex++;
            });
        }
        if (_SF_CFG.commentPage == 1 && data.pageCount[0] < 1) {
            $(".showAll").hide();
        }

        //写入评论列表
        var commentsStr = '';
        if (data.pageCount[_SF_CFG.commentType]) {
            for (var i in data.data) {
                var comment = data.data[i];
                commentsStr += '<li><div class="user">';
                //等级
                if (comment.rankInfo) {
                    commentsStr += '<div class="uIcon"><img src="' + comment.rankInfo.rankImg  + '" border="0" /></div><div class="uName">'+ comment.rankInfo.rankName +'</div>';
                }
                commentsStr += '<div class="uLevel">' + comment.author + '</div></div>';
                commentsStr += '<div class="item"><div class="topic">';
                //评论标题
                if (comment.comment_score) {
                    commentsStr += '<span class="s"><b class="star'+comment.comment_score+'"></b></span>';
                }
                if (comment.new_title) {
                    commentsStr += '<div class="ct"><a href="/review/0/'+ _SF_CFG.productId +'/'+ comment.comments_id +'" target="_blank">' + comment.new_title + '</a></div>';
                }
                commentsStr += '<span class="t">'+ Goods.formatDateTime(comment.time)  +'</span>';
                commentsStr += (comment.comment_from ? '<span class="w">'+(comment.comment_from_url ? '<a href="'+comment.comment_from_url+'" target="_blank">': '')+'来自'+comment.comment_from + (comment.comment_from_url ? '</a>': '') + '</span>' : '') + '</div>';
                commentsStr += '<div class="itemCont"><dl class="c"><dt>评价内容：</dt><dd>'+comment.comment+'</dd></dl>';
                if (comment.comments_for) {
                    commentsStr += '<dl class="r"><dt>客服回复：</dt><dd>'+ comment.comments_for +'</dd></dl>';
                }
                commentsStr += '</div>';
                if (comment.images) {
                    commentsStr += '<ul class="sunImg">';
                    for(var i = 0; i < comment.images.length; i++) {
                        commentsStr += '<li><a target="_blank" href="/review/0/'+ _SF_CFG.productId +'/'+ comment.comments_id +'"><img src="'+ comment.images[i] +'" width="65" height="65"></a></li>';
                    }
                    commentsStr += '<li><a target="_blank" href="/review/0/'+ _SF_CFG.productId +'/'+ comment.comments_id +'" class="ui-sun-more">查看晒单</a></li>';
                    commentsStr += '</ul>';
                }
                commentsStr += '<div class="pLike"><a title="'+(comment.have_liked ? '已赞过' : '赞')+'" href="javascript:void(0);" class="comment-like-sf '+ (comment.have_liked ? 'click': '') +'" has-liked="'+comment.have_liked+'" comment-id="'+ comment.comments_id +'" like-number="'+comment.comment_like+'"><b></b>'+(comment.comment_like > 0 ? comment.comment_like: '赞')+'</a></div>';
                commentsStr += '</div><div class="corner"><div class="aBg"></div><div class="aCt"></div></div></li>';
            }
        }
        $("#have-none-comments").remove();
        $("#comment-lists-sf").html('');
        if (commentsStr == '') {
            var tipshtml = '<div id="have-none-comments" style="padding-left:10px;">还木有评价额，快抢沙发吧！</div>';
            if (_SF_CFG.commentType > 0) {
                tipshtml = '<div id="have-none-comments" style="padding-left:10px;">暂无评价数据！</div>';
            }
            $(tipshtml).insertBefore($("#comment-lists-sf"));
        } else {
            $("#comment-lists-sf").html(commentsStr);
            $(".comment-like-sf").click(function(){
                var commentLike = $(this),
                    commentId = commentLike.attr('comment-id'),
                    hasLiked = commentLike.attr('has-liked'),
                    number = commentLike.attr('like-number');
                if (hasLiked == '0') {
                    $.post("/comments/addLike/", {'cid' : commentId}, function(r){
                        if (r.error == 2) {
                            SF.Widget.login(window.location.href);
                        } else if (r.error) {
                            //jAlert(r.msg);
                        } else {
                            commentLike.attr('has-liked', 1);
                            commentLike.attr('title', '已赞过');
                            commentLike.addClass('click');
                            if (number > 0) {
                                commentLike.html('<b></b> '+(Number(number)+1));
                            } else {
                                commentLike.html('<b></b> 1');
                            }
                        }
                    }, 'json');
                }
            });
        }

        //写入分页信息
        if (data.pagestr) {
            $("#comment-ajax-page-sf").html(data.pagestr);
        }
    }

    //相关品牌
    Goods.brandsTpl = function(data){
        var brandStr = '';
        if (data.count) {
            var sortNumber = 1;
            for (var i in data.list) {
                var arr = data.list[i];
                brandStr += '<a target="_blank" href="'+ arr.url +'#sfbest_item_'+ _SF_CFG.number +'_brand_'+ sortNumber +'" title="'+ arr.name +'">'+ arr.name +'</a>';
                sortNumber++;
            }
            brandStr = '<h2 class="t">相关品牌</h2><ul class="pClass"><li>' + brandStr + '</li></ul><span class="clickShow"><b class="hide"></b></span>';
            $("#brandCon").show().html(brandStr);
            Goods.brandToggle();
        }
    }

    //销售排行
    Goods.saleTopTpl = function(data) {
        var saleStr = '',
            number = 1,
            arr,
            classFore,
            imgStt,
            priceStr;
        if (data.count) {
            for (var i in data.list) {
                var arr = data.list[i];
                if (number < 4) {
                    classFore = 'class="fore"';
                    imgStr = '<div class="p-img"><a target="_blank" href="'+ arr.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_hot_'+number+'"><img src="'+ arr.img +'" onerror="this.src=\'' + arr.errorimg + '\'" ></a></div>';
                    priceStr = '<div class="p-price">￥'+ arr.price +'</div>';
                } else {
                    classFore = '';
                    imgStr = '';
                    priceStr = '';
                }
                if (number == data.count) {
                    classFore = 'class="last"';
                }
                saleStr += '<li '+ classFore +' >';
                saleStr += imgStr;
                saleStr += '<div class="p-name"><a target="_blank" href="'+ arr.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_hot_'+number+'">'+ arr.title +'</a></div>';
                saleStr += priceStr
                saleStr += '</li>';
                number++;
            }
            saleStr = '<div class="ct"><h2>热销排行</h2></div><div class="cm"><ul class="l-hot">' + saleStr + '</ul></div>';
            $("#saletop-sf").show().html(saleStr);
        }
    }

    //组合商品
    Goods.zuheProductTpl = function(data) {
        var zuheStr = '',
            sortNumber = 0,
            arr;
        if (data) {
            for (var i in data) {
                arr = data[i];
                sortNumber++;
                zuheStr += '<li><b></b><div class="pic"><a target="_blank" href="'+ arr.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_Combination_'+sortNumber+'"><img onerror="this.src=\''+ arr.errorimg  +'\'" alt="' + arr.name + '" src="'+ arr.img +'"></a></div><div class="pname"><a target="_blank" title="' +arr.name+ '" href="'+arr.url+'#trackref=sfbest_item_'+_SF_CFG.number+'_Combination_'+sortNumber+'">'+arr.name+'</a></div><div class="price"><span><input type="checkbox" sfprice="'+ arr.sfprice +'"  price="'+arr.price+'" value="'+ arr.pid +'" name="" class="gbatch">'+arr.str+'：'+arr.price+'元</span></div></li>';
            }
        }
        if (!zuheStr) {
            $("#zuhe").hide();
        } else {
            $("#groupPro0").html(zuheStr);
            0 !== $("#groupPro0").length && Goods.groupShow("#groupPro0");
            Goods.calculateZuhePrice();
            //为组合商品绑定计算价格事件
            $('.gbatch').click(Goods.calculateZuhePrice);
        }
    }

    //组合套装
    Goods.packageTpl = function(data) {
        var pack, item, packStr = '', packItemStr, sortPackNumber = 0, sortProductNumber = 0;
        if (data.count) {
            for (var i in data.list) {
                pack = data.list[i];
                packItemStr = '';
                sortPackNumber++;
                if (pack.list) {
                    for ( var j in pack.list) {
                        item = pack.list[j];
                        sortProductNumber++;
                        packItemStr += '<li><b></b><div class="pic"><a target="_blank" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_Suit_'+sortPackNumber + '_' + sortProductNumber+'"><img onerror="this.src=\''+ item.errorimg + '\'" alt="' + item.name + '" src="'+ item.image +'"></a></div><div class="pname"><a target="_blank" title="' +item.name+ '" href="'+item.url+'#trackref=sfbest_item_'+_SF_CFG.number+'_Suit_'+sortPackNumber + '_' + sortProductNumber+'">'+item.name+'</a></div><div class="price"><span>'+ item.priceStr + item.price +'元</span></div></li>';

                    }
                }
                packStr += '<div class="pGroup"><div class="ct"><a href="' + pack.url + '" target="_blank" title="'+ pack.name +'">'+ pack.name +'</a></div><div class="cm"><div class="groupCon"><div class="suits"><ul>'
                        + packItemStr
                        + '</ul></div>'
                        + '<div class="infos"><b></b><div class="gPrice">优惠价格：<strong>￥<span>'+ pack.price  +'</span></strong></div><div class="gBtn"><a href="javascript:void(0);" onclick="cartAdd('+ pack.id +', 1, '+ data.siteId +', 0, 1, this, 3)" class="pbtn3">加入购物车</a></div></div></div></div></div>';
            }
        }
        $("#package").html(packStr);
        0 !== $("#package").length && Goods.packageShow();
    }

    //晒单展示
    Goods.sdTpl = function(data) {
        var sdStr = '', item, img;
        if (data.pageCount) {
            for ( var i in data.data) {
                item = data.data[i];
                sdStr += '<div class="pItem"><div class="user">';
                if (item.rankInfo) {
                    sdStr += '<div class="uIcon"><img src="'+ item.rankInfo.rankImg +'" border="0" /></div>';
                    sdStr += '<div class="uName">'+ item.rankInfo.rankName +'</div>';
                }
                sdStr += '<div class="uLevel">' + item.author + '</div></div>';
                sdStr += '<div class="item"><div class="topic">';
                    sdStr += '<strong class="ct"><a href="/shaidan/0/'+ _SF_CFG.productId +'/'+ item.comments_id +'" target="_blank">'+ item.title +'</a></strong><span class="t">'+ item.time +'</span></div>';
                sdStr += '<div class="sunTxt">' + item.comment + '</div>';
                sdStr += '<ul class="sunImg">';
                if (item.imags) {
                    for (var j in item.imags) {
                        img = item.imags[j];
                        sdStr += '<li><img title="'+ item.title +'" src="' + img.img + '" width="65" height="65"></li>';
                    }
                }
                sdStr += '</ul></div><div class="corner"><div class="aBg"></div><div class="aCt"></div></div></div>';
            }

        }
        if (_SF_CFG.sdPage == 1) {
            $(".sd-total-sf").html(data.pageCount);
        }
        if (sdStr == '') {
            $('<div style="padding:10px 0 0 10px;">暂无晒单，快抢沙发吧！</div>').insertBefore($('#sd-lists-sf'));
        } else {
            $("#sd-lists-sf").html(sdStr);
        }

        //写入分页信息
        if (data.pagestr) {
            $("#sd-ajax-page-sf").html(data.pagestr);
        }
    }

    //购买此商品的顾客最终购买了
    Goods.buyrebuyTpl = function(data) {
        var buyStr = '', item, sortNumber = 0;
        if (data) {
            for (var i in data) {
                item = data[i];
                sortNumber++;
                buyStr += '<li>';
                buyStr += '<div class="p-img"><a target="_blank" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_buy1_'+sortNumber+'"><img src="' + item.img + '"></a></div>';
                if (item.adword) {
                    buyStr += '<div class="title-a"><a target="_blank" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_buy1_'+sortNumber+'">'+ item.name +'</a></div>';
                    buyStr += '<div class="title-b">' + item.adword + '</div>';
                } else {
                    buyStr += '<div class="title-c"><a target="_blank" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_buy1_'+sortNumber+'">'+ item.name +'</a></div>';
                }
                buyStr += '<div class="p-price">￥'+ item.price +'</div>';
                buyStr += '</li>';
            }
        }
        $("#buyrebuy-sf").html(buyStr);
    }

    //逛
    Goods.getHistory = function (){
        $.post("/product/guang/",{},function(str){
            if(str){
                $("#history_con").html(str);
            }
        });
    }

    //set 历史访问
    Goods.setHistory = function() {
        $.post("/product/history/id/" + _SF_CFG.productId,{style:1},function(str){ });
    }

    //购买此商品的顾客还购买了(购买弹层用)
    Goods.buyAlsoBuy = function(data) {
        var buyStr = '', number = 4;
        if (data) {
            var sortNumber = 1;
            for (var i in data) {
                if (number < 1) break;
                var item = data[i];
                buyStr += '<li><div class="pic">';
                buyStr += '<a target="_blank" href="'+ item.url +'#sfbest_item_'+ _SF_CFG.number +'_buy2_'+ sortNumber +'"><img onerror="this.src=\''+ item.errorimg +'\'" alt="'+ item.name  +'" src="'+ item.img +'"></a>';
                buyStr += '</div><div class="pname"><a target="_blank" title="'+ item.name +'" href="'+ item.url +'#sfbest_item_' + _SF_CFG.number + '_buy2_'+ sortNumber +'">' + item.name +'</a></div>';
                buyStr += '<div class="price"><span>￥'+ item.price +'</span></div></li>';
                number--;
                sortNumber++;
            }
        }
        if (buyStr) {
            buyStr = '<div class="bd"><div class="dt">购买过该商品的用户还购买了</div><div class="dd"><ul class="item">' + buyStr + '</ul></div></div>'
            $("#elsebuy").html(buyStr);
        }else{
            $("#elsebuy").hide();
        }
    }

    //浏览此商品的顾客还浏览了
    Goods.browserbrowseTpl = function(data) {
        var buyStr = '', item, sortNumber = 0;
        if (data) {
            for (var i in data) {
                item = data[i];
                sortNumber++;
                buyStr += '<li>';
                buyStr += '<div class="p-img"><a target="_blank" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_see_'+sortNumber+'"><img src="' + item.img + '"></a></div>';
                if (item.adword) {
                    buyStr += '<div class="title-a"><a target="_blank" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_see_'+sortNumber+'">'+ item.name +'</a></div>';
                    buyStr += '<div class="title-b">' + item.adword + '</div>';
                } else {
                    buyStr += '<div class="title-c"><a target="_blank" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_see_'+sortNumber+'">'+ item.name +'</a></div>';
                }
                buyStr += '<div class="p-price">￥'+ item.price +'</div>';
                buyStr += '</li>';
            }
        }
        $("#browserbrowse-sf").html(buyStr);
    }

    //处理预售
    Goods.preSellTpl = function(data) {
        if (data.presell) { //有预售
            //商品名称前增加预售汉字 start
            var goodsName = $("#base_name-sf").html();
            goodsName = goodsName.replace(/<span>(.*?)<\/strong>/gi,'');
            goodsName = '<span></span><strong class="ys_title">【预售】</strong>'+goodsName;
            $("#base_name-sf").html(goodsName);
            changeGoodsNameClass(goodsName);
            //商品名称前增加预售汉字 end
            var item, fprice, sfpricetpl, tpl, preSellStr = '';

            _SF_CFG.sfprice = data.sfprice;
            _SF_CFG.price = data.presell.price;
            _SF_CFG.warehouse = data.siteId;

            if (data.presell.warn) {
                for (var i in data.presell.warn) {
                    item = data.presell.warn[i];
                    preSellStr += item;
                }
            }
            preSellStr = '<dl><dt><div class="yushou'+ data.presell.stateid +'"></div></dt><dd>'
                       + preSellStr
                       + '</dd></dl>';
            $("#presell-info-sf").show().html(preSellStr);

            if (data.presell.stateid == 1) {
                $("#buy-nogood-sf").hide();    //无货
                $("#buy-btn-sf").show(); //显示购买btn
                $("#finalbuy-sf").hide();//看过该商品的用户最终购买了改为我们为您推荐了
                $("#viewBuyDiv").show();
                Goods.viewBuy(_SF_CFG.productId, Goods.viewBuyLeftTpl);//浏览最终购买了
            } else {
                $("#add-cart-r-btn-sf").hide();
                $("#buy-nogood-sf").show();
                $("#buy-btn-sf").hide();
                $("#viewBuyDiv").hide();       //浏览此商品的顾客还买了
                Goods.viewBuy(_SF_CFG.productId, Goods.viewBuyTpl);//我们为您推荐了
            }
            if(data.cansale == false){
                $("#buy-nogood-sf").hide();    //无货
                $("#buy-btn-sf").hide();        //显示购买btn
                $("#buy-canntsend-sf").show(); //无法送达
            }else{
                $("#buy-canntsend-sf").hide(); //无法送达
            }

            //预售价
            fprice = _SF_CFG.price.toString().split('.');
            if (fprice.length > 1) {
                sfpricetpl = '<strong class="price">' + fprice[0] + '.<span>' + fprice[1] + '</span></strong>';
            } else {
                sfpricetpl = '<strong class="price">' + fprice[0] + '</strong>';
            }
            if (_SF_CFG.sfprice) {
                tpl = '<div class="priceBox"><span class="dt">预售价：</span><span class="rmb">￥</span>'
                + sfpricetpl
                + '<span class="dt"></span></div><div class="daoJiShi" id="qianggou-sf"></div>';
            } else {
                tpl = '<div class="priceBox"><span class="dt">预售价：</span><span class="rmb">￥</span>'
                + sfpricetpl
                + '<span class="dt"></span></div><div class="daoJiShi" id="qianggou-sf"></div>';
            }
            tpl += '<div class="boxWb"></div>';
            $("#price-sf").html(tpl);
            //处理预售购物车按钮
            $("#cart-add-btn-sf").html('<a href="javascript:void(0)" onclick="addPresale('+_SF_CFG.productId+');"><b></b>预约购买</a>');
            $("#cart-add-btn-sf").addClass('preBtn');
			$('#quickBuy').css('display','none');
            $("#sendTime").show();
            $("#sendTime").html(data.presell.sendTime);
            $("#add-cart-r-btn-sf").removeClass().addClass('pre-btn');
            $("#add-cart-r-btn-sf").html('<a href="javascript:void(0);" onclick="addPresale('+ _SF_CFG.productId +')">预约购买</a>');
            Goods.productStamp();
            //隐藏促销信息
            $("#promotion-sf").hide();
        } else { //无预售，则读取库存
            $("#presell-info-sf").hide();
            var goodsName = $("#base_name-sf").html();
            //去除预售汉字start
            goodsName = goodsName.replace(/<span>(.*?)<\/strong>/gi,'');
            $("#base_name-sf").attr('title',goodsName);
            $("#base_name-sf").html(goodsName);
            Goods.price(_SF_CFG.productId, Goods.priceTpl);
            Goods.stock(_SF_CFG.productId, Goods.stockTpl);
            //去除预售汉字end
        }
    }

    //推荐商品展示
    Goods.recommendTpl = function(data) {
        var recStr = '';
        if (data) {
            var sortNumber = 1;
            for (var i in data) {
                var item = data[i];
                recStr += '<li><div class="p-img">';
                recStr += '<a target="_blank" href="'+ item.url +'#sfbest_item_'+_SF_CFG.number+'_recommended_'+ sortNumber +'">';
                recStr += '<img onerror="this.src=\''+ item.errorimg +'\'" src="' + item.image + '">';
                recStr += '</a></div>';
                if (item.price) {
                    //if (item.sfprice) {
                    //    recStr += '<div class="p-price"><span class="p-now">￥<strong>'+ item.price +'</strong></span><span class="p-nor">￥'+ item.sfprice +'</span></div>';
                    //} else {
                        recStr += '<div class="p-price"><span class="p-now">￥<strong>'+ item.price +'</strong></span></div>';
                    //}
                } else {
                    recStr += '<div class="p-price"><span class="p-now">￥<strong>'+ item.sfprice +'</strong></span></div>';
                }
                recStr += '<div class="title-c"><a target="_blank" href="'+ item.url +'#sfbest_item_'+_SF_CFG.number+'_recommended_'+ sortNumber +'">' + item.name + '</a></div></li>';
                sortNumber++;
            }
            if (recStr) {
                recStr = '<div class="ct"><h2>根据浏览为您推荐</h2></div><div class="cm" id="recomm_list"><a href="javascript:void(0);" class="btn-reco" id="btn_prev"><b></b></a><a href="javascript:void(0);" class="btn-reco" id="btn_next"><b></b></a><div id="p_view"><ul class="p-view">' + recStr + '</ul></div><span class="clear"></span></div>';
                $("#recommend-by-view-sf").show().html(recStr);
            }
        }
    }

    //浏览最终购买展示
    Goods.viewBuyTpl = function(data) {
        var viewStr = '', sortNumber = 0;
        if (data) {
            for (var i in data) {
                var item = data[i];
                sortNumber++;
                viewStr += '<li><div class="pic"><a target="_blank" href="'+item.url+'#trackref=sfbest_item_'+_SF_CFG.number+'_Soldout_'+ sortNumber +'"><img onerror="this.src=\''+item.errorimg+'\'" alt="'+item.name+'" src="'+item.image+'"></a></div>';
                viewStr += '<div class="pname"><a target="_blank" title="'+item.name+'" href="'+item.url+'#trackref=sfbest_item_'+_SF_CFG.number+'_Soldout_'+sortNumber+'">'+item.name+'</a></div>';
                viewStr += '<div class="price"><span>￥'+ item.price +'</span></div></li>';
            }
            if (viewStr) {
                viewStr = '<div class="cm"><div class="dt">我们为您推荐了</div><div class="dd"><ul class="item">' + viewStr + '</ul></div></div><div class="pClose" onclick="$(\'#finalbuy-sf\').hide();"></div>';
                $("#finalbuy-sf").show().html(viewStr);
            }
        }
    }

    //浏览最终购买左侧展示
    Goods.viewBuyLeftTpl = function(data) {
        var buyStr = '', item, sortNumber = 0;

        if (data) {
            for (var i in data) {
                item = data[i];
                sortNumber++;
                buyStr += '<li>';
                buyStr += '<div class="p-img"><a target="_blank" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_Soldout_'+sortNumber+'"><img onerror="this.src=\''+item.errorimg+'\'" src="' + item.image + '"></a></div>';
                if (item.adword) {
                    buyStr += '<div class="title-a"><a target="_blank" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_Soldout_'+sortNumber+'">'+ item.name +'</a></div>';
                    buyStr += '<div class="title-b">' + item.adword + '</div>';
                } else {
                    buyStr += '<div class="title-c"><a target="_blank" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_Soldout_'+sortNumber+'">'+ item.name +'</a></div>';
                }
                buyStr += '<div class="p-price">￥'+ item.price +'</div>';
                buyStr += '</li>';
            }
        }
        $("#viewBuyDiv").hide();
        if(buyStr){
            $("#viewbuy-sf").html(buyStr);
            $("#viewBuyDiv").show();
        }
    }

    //收藏还收藏了展示
    Goods.userStoreTpl = function(data) {
        var html = '', sortNumber = 0;
        if (data) {
            for (var i in data) {
                var item = data[i];
                sortNumber++;
                html += '<li><div class="pic">';
                html += '<a target="_blank" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_Favorites_'+sortNumber+'"><img onerror="this.src=\''+ item.errorimg +'\'" alt="'+ item.name +'" src="' + item.image + '"></a></div>';
                html += '<div class="pname"><a target="_blank" title="'+ item.name +'" href="'+ item.url +'#trackref=sfbest_item_'+_SF_CFG.number+'_Favorites_'+sortNumber+'">' + item.name + '</a></div>';
                html += '<div class="price"><span>￥'+ item.price +'</span></div></li>';
            }
            if (html) {
                html = '<div class="dt">收藏该商品的用户还收藏了</div><div class="dd"><ul class="item">' + html + '</ul></div></div>';
                $("#faved-also-fav-sf").html(html);
            }
        }

    }

    //饮食文化
    Goods.articleTpl = function(data){
        var html = '';
        for (var i = 0, len = data.data.length; i < len; i++) {
            var item = data.data[i];
            html += '<li><div class="pic"><a href="'+ item['url'] +'" target="_blank">';
            html += '<img alt="'+ item['title'] +'" onerror="this.src=\''+_SF_CFG.staticurl+'/images/150pic.jpg\'" src="'+ item['image'] +'">';
            html += '</a></div><div class="txt">';
            html += '<h3><a href="'+item['url']+'" target="_blank">'+ item['title'] +'</a></h3>';
            html += '<p><a href="'+ item['url'] +'" target="_blank">'+ item['description'] +'</a></p>';
            html += '</div></li>';
        }
        html = '<ul class="pCulture">' + html + '</ul>';
        $("#div-article").html(html);
    }

    //顺丰包邮标识
    Goods.productStamp = function() {
        if(4==_SF_CFG.businessModel || 5==_SF_CFG.businessModel || _SF_CFG.businessModel == 7){
                $("#productStamp").remove();
                return;
        }
        $("#productStamp").remove();
        if (_SF_CFG.presell || _SF_CFG.price >= 199) {
            $(".pItemsPrice").append('<div id="productStamp" class="productStamp"></div>');
        } else {
            //get weight
            var
                pWeightMatch = $(".pdetail").html().match(/重量：(.+)kg/),
                weight = pWeightMatch && pWeightMatch[1] ? pWeightMatch[1] * 1 : 0;
            if (weight <= 10) {
                $(".pItemsPrice").append('<div id="productStamp" class="productStamp_1"></div>');
            }
        }
    }

    //GOOGLE再营销
    Goods.GoogleTpl = function(){
        if(_SF_CFG.price){
           window.google_tag_params.ecomm_totalvalue = _SF_CFG.price;
        }
        if(_SF_CFG.warehouse && window.google_tag_params.ecomm_prodid.indexOf('-') < 0){
            window.google_tag_params.ecomm_prodid = _SF_CFG.warehouse+'-'+window.google_tag_params.ecomm_prodid;
        }
        if(_SF_CFG.price && _SF_CFG.warehouse && !isChange){
         window.google_trackConversion({
          google_conversion_id: 990764409,
          google_custom_params: window.google_tag_params,
          google_remarketing_only: true
         });
        }
    }
    window.Goods = Goods;
})();


//判断商品名称长度，大于指定长度后增加class
function changeGoodsNameClass(goodsName){
    //预售商品去除预售html标签
    if(_SF_CFG.presell){
        goodsName = goodsName.replace(/<span>(.*?)<\/strong>/gi,'【预售】');
        $("#base_name-sf").attr('title',goodsName);
    }
}

//服务保障icon
function poptipShow(){
    $(".has_poptip").hover(function(){
        var top = $(".points").offset().top + 85,left = $(".points").offset().left + 20,a_left = 26,i = $(this).index();
        if (0==i){a_left =145}else if(1==i){a_left=75}else{a_left=10}
        if ($(this).hasClass("attr3")){
            $("body").append("<div class='ui-poptip'><div class='ui-poptip-container'><div class='ui-poptip-arrow ui-poptip-arrow-11'><em></em><span></span></div><div class='ui-poptip-content'>本商品由顺丰速运承运<br />保障您享受高品质物流服务</div></div></div>");
        }else{
            $("body").append("<div class='ui-poptip'><div class='ui-poptip-container'><div class='ui-poptip-arrow ui-poptip-arrow-11'><em></em><span></span></div><div class='ui-poptip-content' style='white-space:nowrap;'>本商品经国际检测机构SGS<br />质量鉴定，保障您享受安全<br />高品质的商品</div></div></div>");
        }
        $(".ui-poptip").css({"top":top,"left":left});$(".ui-poptip-arrow-11").css("right",a_left);
    },function(){
        $(".ui-poptip").remove();
    });
}


//去除预售商品名称中html标签
function changeGoodsAdwordClass(adword){
    var goodsName = $("#base_name-sf").attr('title');
    if(goodsName.length>29 && adword){
        $("#base_name-sf").attr('class','title-long');
    }
    var goodsNameClass = $("#base_name-sf").attr('class');
    if('title-long'==goodsNameClass && adword.length>29){
        $("#adword-sf").attr("class","title-long");
    }
    $("#adword-sf").attr("title",adword);
    if('title-long'==goodsNameClass){
        $("#adword-sf").html(adword);
    }else{
        $("#adword-sf").html('&nbsp;&nbsp;'+adword);
    }
}

$(document).ready(function(){
    isChange = 0;
    //判断是否需要弹出评论提示框或跳转用户中心评论页
    var currentUrl = window.location.href;
    if(1==$.cookie('flagComment') && currentUrl.indexOf("html#flagComment")>=0){
        Goods.gotoPl();
    }
    //判断是否需要弹出收藏成功框
    if(1==$.cookie('flagAddFav') && currentUrl.indexOf("html?flagAddFav=1")>=0){
        var goodsAddFavObj = $("#goodsAddFav");
        Goods.addFav(goodsAddFavObj);
    }
    //为购买数量绑定事件
    $("#reduce-sell-num").click(function(){
        if(!$("#reduce-sell-num").hasClass('disable')){
            Goods.changeNum(1);
        }
    });
    $("#add-sell-num").click(function(){
        if(!$("#add-sell-num").hasClass('disable')){
            Goods.changeNum(2);
        }
    });
    $("#number_" + _SF_CFG.productId).blur(function(){
        Goods.changeNum(4);
    });

     //初始化购物数量
    $("#number_" + _SF_CFG.productId).val(_SF_CFG.minBuy);

   /* //处理预售、库存、价格
    if (_SF_CFG.presell) {
        Goods.preSell(_SF_CFG.productId, Goods.preSellTpl);
    } else {
        Goods.price(_SF_CFG.productId, Goods.priceTpl);
        Goods.stock(_SF_CFG.productId, Goods.stockTpl);
    }

    //获取地区
    Goods.getOldRegion(Goods.regionOldTpl);

    //获取父子商品
    Goods.fatherson(_SF_CFG.productId, _SF_CFG.parentId, document.location.href.split('.html')[0] + '.html', Goods.fathersonTpl);

    //获取右上角标签
    Goods.productIcon(_SF_CFG.productId, Goods.productIconTpl);

    //获取用户评论
    Goods.getPl(_SF_CFG.pid, _SF_CFG.commentPage, 10, Goods.commentTpl);

    //获取用户晒单
    Goods.getSd(_SF_CFG.productId, _SF_CFG.sdPage, 10, 0, Goods.sdTpl)

    //相关品牌
    Goods.brands(_SF_CFG.oneCategoryId, _SF_CFG.threeCategoryId, Goods.brandsTpl);

    //销售排行
    Goods.saleTop(_SF_CFG.threeCategoryId, Goods.saleTopTpl);

    //购买此商品顾客还购买了
    Goods.buyrebuy(_SF_CFG.productId, Goods.buyrebuyTpl);

    //浏览了还浏览了
    Goods.browserbrowse(_SF_CFG.productId, Goods.browserbrowseTpl);

    //获取相关商品
    if (_SF_CFG.zuheProducts) {
        Goods.zuheProduct(_SF_CFG.zuheProducts, Goods.zuheProductTpl);
    }

    //Goods.shipfee(_SF_CFG.productId, Goods.shipfeeTpl);

    //获取组合商品
    Goods.package(_SF_CFG.productId, Goods.packageTpl);

    //获取推荐商品
    Goods.recommendProduct(_SF_CFG.productId, Goods.recommendTpl);

    //逛
    Goods.getHistory();

    //写入History
    Goods.setHistory();

    //右侧浮动
    sfAddCart.init();*/

    //商品信息Tab切换
    $(".pTab li").click(function(){
        if($(".pDetail").hasClass("pFixed")){
            $(".pDetail").removeClass("pFixed");
            var pTabTop = $(".pTab").offset().top -50;
            $(document).scrollTop(pTabTop);
        }
        var $this = $(this);
        $this.addClass("curr").siblings().removeClass("curr");
        $(".pCont").hide();
        $('#' + $this.attr('pCont-target')).show();
        if ($this.attr('pCont-target') != 'div-shaidan' && $this.attr('pCont-target') != 'div-comment') {
            $("#div-comment").show();
            $("#div-shaidan").show();
        }
    });
    if($(".pDetail").length > 0){
        var pDetailFixed=function(){
            var pDetailTop = $("#flow-layer-sf").offset().top;
            var pDomTop = $(document).scrollTop();
            (pDomTop > pDetailTop) ? $(".pDetail").addClass("pFixed") : $(".pDetail").removeClass("pFixed");
            (pDomTop > pDetailTop) ? $(".pDetail").addClass("pFixed").find('.p-buy-phone').show() : $(".pDetail").removeClass("pFixed").find('.p-buy-phone').hide();
        };
        $(window).bind("scroll", pDetailFixed);
        pDetailFixed();
    }

    if($(".s-top").length > 0){
        $(".s-top").click(function() {
            $("html, body").scrollTop(0);
        });
        var bToTop = function() {
            var st = $(document).scrollTop();
            (st > 0) ? $(".s-top").css("display","block") : $(".s-top").css("display","none");
        };
        $(window).bind("scroll", bToTop);
        bToTop();
    }
    //手机扫描二维码
    $(".p-buy-phone").hover(function(){$(this).addClass("hover")},function(){$(this).removeClass("hover")});

    //兼容旧JS,修改地区后调用
    window.changeOpen = function() {
        changeGoodsAdwordClass("");//广告语清空
        provinceid = getCookie('provinceid');
        isChange = 1;//修改地区(用于区分头次加载或修改地区操作)
        if (_SF_CFG.presell) {
            Goods.preSell(_SF_CFG.productId, Goods.preSellTpl);
        } else {
            Goods.price(_SF_CFG.productId, Goods.priceTpl);
            Goods.stock(_SF_CFG.productId, Goods.stockTpl);
        }
        //获取组合商品
        Goods.package(_SF_CFG.productId, Goods.packageTpl);
        //获取相关商品
        if (_SF_CFG.zuheProducts) {
            Goods.zuheProduct(_SF_CFG.zuheProducts, Goods.zuheProductTpl);
        }
        //getPackage();
    getAllCity();
    $("#add-sell-num").removeClass('disable');
        //Goods.shipfee(_SF_CFG.productId, Goods.shipfeeTpl);
    }

    //本页面定位到评论位置
    window.ToCommentPosition = function() {
        $(".pTab li:eq("+ (_SF_CFG.businessModel == 3 ? 1: 2) +")").click();
        $("body,html").animate({ scrollTop : $("#comment-lists-sf").offset().top - 255}, 1000);
    }
    window.GetUserComment = function(page, type) {
        _SF_CFG.commentPage = page;
        Goods.getPl(_SF_CFG.pid, _SF_CFG.commentPage, 10, Goods.commentTpl);
        $("body,html").animate({ scrollTop : $("#comment-lists-sf").offset().top - 220}, 1000);
    }
    //按照分页刷新用户晒单
    window.GetUserSd = function(page) {
        _SF_CFG.sdPage = page;
        Goods.getSd(_SF_CFG.productId, _SF_CFG.sdPage, 10, 0, Goods.sdTpl)
    }
    //购买还购买了(购买弹层专用)
    window.BuyAlsoBuy = function(pid) {
        Goods.buyrebuy(pid, Goods.buyAlsoBuy);
    }

    $("#buy-zuhe-sf").click(function(){
        var gidstr = _SF_CFG.productId;
        $('.gbatch:checked').each(
            function (){
                gidstr += ',' + $(this).attr('value');
            }
        );
        cartAdd(gidstr, 0, 1, 2, 1, this, 3);
    });

    $("#comment-filter-sf a").click(function(){
        var $this = $(this),
            type = $this.attr('data-type');
        $("#comment-filter-sf h3").removeClass('curr');
        $this.parent().addClass('curr');
        _SF_CFG.commentType = type;
        _SF_CFG.commentPage = 1;
        Goods.getPl(_SF_CFG.pid, _SF_CFG.commentPage, 10, Goods.commentTpl);
    });

    var ScrollCommentAndClick
        = "var url = window.document.location.href,"
        + "comment = url.split('#').pop();"
        + "if (comment == 'comment') {"
        + "var commentTop = $(\"#flow-layer-sf\").offset().top;"
        + "$(\"body,html\").animate({ scrollTop : commentTop - 35}, 1000);"
        + "setTimeout('$(\".pTab li:eq("+ (_SF_CFG.businessModel == 3 ? 1: 2) +")\").click();', 800);"
        + "}";
    setTimeout(ScrollCommentAndClick, 1500);

    /*@@手机二维码 start*/
    $('.phone_client').click(function(event){
        event.stopPropagation();
        $(this).find('.phone_clientCode').show();
        $(this).removeClass('phone_border');
        $(".phone_clientCode").find(".p-logo").show();
        $(this).css('cursor','default');
        $(".chooseBtns").css('z-index',92);
    })
    $('.ac_phoneClose').click(function(event){
        event.stopPropagation();
        $(this).parent('.phone_clientCode').hide();
        $('.phone_client').addClass('phone_border');
        $(".phone_clientCode").find(".p-logo").hide();
        $('.phone_client').css('cursor','pointer');
        $('.chooseBtns').css('z-index',1);
    })
    $('.phone_client').hover(function(){
        },function(){
            $(this).find('.phone_clientCode').hide();
            $('.phone_client').addClass('phone_border');
            $('.phone_client').css('cursor','pointer');
            $(".chooseBtns").css('z-index',1);
    })
    $(document).click(function(){
        $('.phone_clientCode').hide();
        $('.phone_client').addClass('phone_border');
        $('.phone_client').css('cursor','pointer');
        $(".chooseBtns").css('z-index',1);
    })
    /*@@手机二维码 end*/

    //处理到货通知start
    $("#user_email").focus(function(){
        $("#emailDiv").removeClass('okBorder');
        $("#email_error").hide();
    });
    $("#user_mobile").focus(function(){
        $("#mobileDiv").removeClass('okBorder');
        $("#mobile_error").hide();
    });
    //处理到货通知end

    //右侧浮动广告位
    var index_win_w = $(window).width();
    if (index_win_w <= 1440) {$(".index_rfloat").addClass("index_side");}
    else {$(".index_rfloat").removeClass("index_side");}
    $(window).resize(function() {
        var index_win_width = $(window).width();
        if (index_win_width <= 1440) {$(".index_rfloat").addClass("index_side");}
        else {$(".index_rfloat").removeClass("index_side");}
    });
    //右侧浮动广告位end
});

function getUserBuyNum(product_id){
    var buyNum = $("#number_"+product_id).val();
    if(undefined==buyNum){
        buyNum=1
    }
    return buyNum;
}

//一键购买begin
//商品和礼包加入购物车
//@param product_id 商品id
//@param cart_type 购物类型 0 普通商品
//@param opencity_id 站点id
//@param flag 提示方式 0本页提示 1跳转购物车
//@param bs  加入时是否验证商品的礼品袋开关  1,是;0,否
//@param obj 加入按钮对象
//@param cfrom 从哪里点击的购物按钮
function oneKeyBuy(product_id,cart_type,opencity_id, flag,bs, obj, cfrom) {
	if (typeof(bs) == "undefined") { 
		bs = 1; 
	}
	if (typeof(cfrom) == "undefined") { 
		cfrom = 1; 
	}
  
	var alsoBuy = '';
	var web_url = cartHostUrl+'/cart/addCart/';
    var number = 1;
    if($("#number_"+product_id).length!=0){
      number = $("#number_"+product_id).val();
    }
    if(number > 1000){
      jAlert('对不起购买上限不能大于1000!!');
      return;
    }
    if(!checkRate(number)){
      jAlert('您输入的数量格式有误!!');
      return false;
    }
	var cartHostUrl = 'http://cart.'+domain;//购物车域名
	var requestUrl = cartHostUrl+'/cart/oneKeyBuy/';//请求URL
	var ownUrl = cartHostUrl+'/order/index/';//自营和商铺商品的订单页面
	var htUrl = cartHostUrl+'/orderHt/index/';//海淘商品的订单页面
	var imgTitle = $('div.hyzyIcon img').attr('title');
	$.ajax({
		url  : requestUrl,
		type : 'GET',
		dataType: "jsonp",  //返回json格式的数据   
		jsonp:"callback",
		data : {product_id:product_id,number:number,opencity_id:opencity_id,cart_type:cart_type,mes:bs},
		success: function(msg){			
			if(msg.error == -1)
			{
				SF.Widget.login();//登录成功后停留在商品详情页面							
			}
			else if(msg.error == 1)
			{				
				if(imgTitle ==1 || imgTitle ==2)//如果是海淘商品
				{
					location.href = htUrl;
				}
				else
				{
					location.href = ownUrl;
				}				
			}
			else if(msg.error == 2)
			{
				jConfirm(msg.info, '提示消息', function(r){
					if(r){
					  cartAdd(product_id,cart_type,opencity_id, flag,0, obj, cfrom)
					}
				})
			}	
			else
			{
				if(7 == flag){
					if(msg.info.indexOf("库存不足")>=0){
					  obj.parent().removeClass('p-btn');
					  obj.parent().addClass('outBtn');
					  obj.html('抱歉，该商品已售罄');
					  return;
					}
					if(msg.info.indexOf("无法送达")>=0){
					  obj.parent().removeClass('p-btn');
					  obj.parent().addClass('outBtn');
					  obj.html('抱歉，该商品无法送达');
					  return;
					}
					if(msg.info.indexOf("已经下架")>=0){
					  obj.parent().removeClass('p-btn');
					  obj.parent().addClass('outBtn');
					  obj.html('抱歉，该商品已售罄');
					  return;
					}
					if(msg.info.indexOf("已经售完")>=0){
					  obj.parent().removeClass('p-btn');
					  obj.parent().addClass('outBtn');
					  obj.html('抱歉，该商品已售罄');
					  return;
					}
					jAlert(msg.info);return;
				}
				if(13 == flag){
					if(msg.info.indexOf("库存不足")>=0){
					obj.parent().removeClass('p-btn');
					obj.parent().addClass('outBtn');
					obj.html('已售罄');
					return;
				}
				if(msg.info.indexOf("无法送达")>=0){
					obj.parent().removeClass('p-btn');
					obj.parent().addClass('outBtn');
					obj.html('无法送达');
					return;
				}
				if(msg.info.indexOf("已经下架")>=0){
					obj.parent().removeClass('p-btn');
					obj.parent().addClass('outBtn');
					obj.html('已售罄');
					return;
				}
				if(msg.info.indexOf("已经售完")>=0){
					obj.parent().removeClass('p-btn');
					obj.parent().addClass('outBtn');
					obj.html('已售罄');
					return;
				}
				jAlert(msg.info);return;
				}
				jAlert(msg.info);return;
			}			
		}
    });
}

//一键购买end
