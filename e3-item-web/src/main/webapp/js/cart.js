var hostUrl = document.location.host;
var urlArr = hostUrl.split('.');
var domain = urlArr[1]+'.'+urlArr[2];
var SF_STATIC_URL = 'http://i.'+domain;
var SF_STATIC_URL_HTML = 'http://i.'+domain+'/html/';
var cartHostUrl = 'http://cart.'+domain;
var wwwHostUrl  = 'http://www.'+domain;

var sfAddCart ={
  pid:null,
  init:function(){
    var win_w = $(window).width();
    if (win_w <= 1400) {$(".side-wrap").addClass("side_pos");}
    else {$(".side-wrap").removeClass("side_pos");}
    $(window).resize(function() {
      var win_width = $(window).width();
      if (win_width <= 1400) {$(".side-wrap").addClass("side_pos");}
      else {$(".side-wrap").removeClass("side_pos");}
    });
    sfAddCart.cartHover();
    $(".p-btn a,.rankBtn a,.rushBuy").live("click",function(){
      $(".listpic-mini").html("");
      This = $(this);
      //是否是首页商品添加购物车标识
      var indexFlag = This.attr("indexFlag");
	  //是否是生鲜频道页添加购物车标识
	  var freshFlag = This.attr("freshFlag");
      sfAddCart.pid = This.attr("pid");
      if(typeof(indexFlag) == "undefined"){
		if(typeof(freshFlag) == "undefined"){
			 //其它页面商品添加购物车
			setTimeout(function(){cartAdd(sfAddCart.pid, 0, 1, 5);},100);
		}else{
			//生鲜频道页商品添加购物车
			setTimeout(function(){cartAdd(sfAddCart.pid, 0, 1, 13,1,This);},100);
		}
       
      }else{
        //首页页商品添加购物车
        setTimeout(function(){cartAdd(sfAddCart.pid, 0, 1, 7,1,This);},100);
      }	
    });
  },
  cartHover:function(){
    $("#side_cart").bind("mouseenter",function(){
      clearTimeout(sfAddCart.cartHover.timer1);
      sfAddCart.cartHover.timer1 = setTimeout(function(){sfAddCart.cartList("show","1")},500);
    }).bind("mouseleave",function(){
      clearTimeout(sfAddCart.cartHover.timer1);
      sfAddCart.cartHover.timer1 = setTimeout(function(){sfAddCart.cartList("hide","1")},500);
    });
    $(".cart-list").live("mouseenter",function(){
      clearTimeout(sfAddCart.cartHover.timer1);
      sfAddCart.cartHover.timer1 = setTimeout(function(){sfAddCart.cartList("show","1")},500);
    }).live("mouseleave",function(){
      clearTimeout(sfAddCart.cartHover.timer1);
      sfAddCart.cartHover.timer1 = setTimeout(function(){sfAddCart.cartList("hide","1")},500);
    });
    $("#side_guang").bind("mouseenter",function(){
      clearTimeout(sfAddCart.cartHover.timer2);
      sfAddCart.cartHover.timer2 = setTimeout(function(){sfAddCart.cartList("show","2")},500);
    }).bind("mouseleave",function(){
      clearTimeout(sfAddCart.cartHover.timer2);
      sfAddCart.cartHover.timer2 = setTimeout(function(){sfAddCart.cartList("hide","2")},500);
    });
    $(".his-list").live("mouseenter",function(){
      clearTimeout(sfAddCart.cartHover.timer2);
      sfAddCart.cartHover.timer2 = setTimeout(function(){sfAddCart.cartList("show","2")},500);
    }).live("mouseleave",function(){
      clearTimeout(sfAddCart.cartHover.timer2);
      sfAddCart.cartHover.timer2 = setTimeout(function(){sfAddCart.cartList("hide","2")},500);
    });
    $("#side_app").bind("mouseenter",function(){
      clearTimeout(sfAddCart.cartHover.timer3);
      sfAddCart.cartHover.timer3 = setTimeout(function(){sfAddCart.cartList("show","3")},500);
    }).bind("mouseleave",function(){
      clearTimeout(sfAddCart.cartHover.timer3);
      sfAddCart.cartHover.timer3 = setTimeout(function(){sfAddCart.cartList("hide","3")},500);
    });
    $(".appDown").live("mouseenter",function(){
      clearTimeout(sfAddCart.cartHover.timer3);
      sfAddCart.cartHover.timer3 = setTimeout(function(){sfAddCart.cartList("show","3")},500);
    }).live("mouseleave",function(){
      clearTimeout(sfAddCart.cartHover.timer3);
      sfAddCart.cartHover.timer3 = setTimeout(function(){sfAddCart.cartList("hide","3")},500);
    });
  },
  cartList: function(type,i) {
    var right, time;
    if (type == "hide") {
      right = "-101%";
      time = 800
    } else {
      right = 0;
      time = 300;
      if ("1"==i){
        $(".cart-wrap").show()
      }else if("2"==i){
        $(".guang").show()
      }else if("3"==i){
        $(".appInfo").show()
      }
    }
    if ("1"==i){
      $(".cart-wrap").find(".cart-list").animate({
        "right": right
      }, time, function() {
        if (type == "hide") $(".cart-wrap").hide()
      })
    }else if ("2"==i){
      $(".guang").find(".his-list").animate({
        "right": right
      }, time, function() {
        if (type == "hide") $(".guang").hide();
      })
    }else if ("3"==i){
      $(".appInfo").find(".appItem").animate({
        "right": right
      }, time, function() {
        if (type == "hide") $(".appInfo").hide();
      })
    }
  },
  cartNumShow:function(){
    var addNum = $("#number_" + sfAddCart.pid).val();
    var tips_obj = $(".cart-list").find(".cart-num");
    $("#add-num").html(addNum);
    tips_obj.height(48).show();
    var addOne_timer = setTimeout(function() {
      tips_obj.animate({
        "height": 0
      }, 300, function() {
        tips_obj.hide();
        $("#side_cart").trigger("mouseleave");
      })
    }, 3E3);
  }	
};

/*
   逛商品加购物车
   */
function hisCartAdd(pid){
  cartAdd(pid,0,0,6);
  $.ajax({
    type: 'POST',
    async: false,
    dataType: 'json',
    url: "/product/delHistory/",
    data: {pid:pid},
    success: function(str){
      getHistory();	 
    }
  });
}
/**
  获了逛数据
  */
function getHistory(){
  $.post("/product/guang/",{},function(str){
    if(str){
      $("#history_con").html(str);
    }
  });
}

/*购物车删除单个商品
  @param  string value   活动类型-活动id-商品id  这三者组合
  */
function cartDel(value){
  $.ajax({
    url  : cartHostUrl+'/cart/delCartProduct/',
  type : 'GET',
  //dataType: 'json',
  dataType: "jsonp",  //返回json格式的数据   
  jsonp:"callback",
  data : {val : new Array(value)},
  success: function(msg){
    if(msg.error==1){
      if($('#'+msg.info.type).length > 0){
        $('#'+msg.info.type).html(msg.data);
        chmodeNum(msg.info.cart);
      }
      getCartList();//更新右上角的购物列表
      //changeCheckboxStats();
    }else{
      jAlert(msg.info);
    }
  }
  });
}

/**
  获取每个页面头部的购物列表的方法
  */
function getCartList(){
  $.ajax({
    url  : cartHostUrl+'/cart/headerCart/',
  type : 'GET',
  dataType: "jsonp",  //返回json格式的数据   
  jsonp:"callback",
  data : {},
  success: function(msg){
    if(msg.error==1){
      $('#cartNum').html(msg.info.num);
      $('#cart_lists').html(msg.data);
      if(msg.info.num>0){
        $("#topCart").find("s").addClass("setCart");
      }
      if($('#showcart').length > 0){
        $('#showcart').html('购物车共计'+msg.info.num+'件商品，合计 '+msg.info.price+'元');
      }
      if($('#list_cart').length > 0){
        //$('#list_cart').html(msg.data);
        $('#list_cart').html(msg.data1);
        $('.s-cart-num').html(msg.info.num);
        var numList = $("li","#list_cart").length;
        0 !== numList && $('.s-cart-num').addClass("s-cart-add");
        switch(numList)
        {
          case 0:
            $(".cart-shopping").css("bottom","152px");
            $(".cart-wrap .cart-arr").css("bottom","10px");
            $('.s-cart-num').removeClass("s-cart-add");
            $('.s-cart-num').hide();
            break;
          case 1:
            $(".cart-shopping").css("bottom","50px");
            $(".cart-wrap .cart-arr").css("bottom","110px");
            $('.s-cart-num').show();
            break;
          default:
            $(".cart-shopping").css("bottom",0);
            $(".cart-wrap .cart-arr").css("bottom","160px");
            $('.s-cart-num').show();
        }
      }
    }else{
      jAlert(msg.info);
    }
  }
  });
}


/*
   购买了还购买了
   */
function buyelse(pid){
  $.ajax({
    url  : wwwHostUrl+'/product/alsoBuy',
  type : 'GET',
  dataType: 'html',
  data : {pid:pid},
  success: function(htmlcode){
    //alsoBuy = htmlcode;
    if($('#elsebuy').length > 0){
      $('#elsebuy').html(htmlcode);
    }
  }
  })
}

//商品和礼包加入购物车
//@param product_id 商品id
//@param cart_type 购物类型 0 普通商品
//@param opencity_id 站点id
//@param flag 提示方式 0本页提示 1跳转购物车
//@param bs  加入时是否验证商品的礼品袋开关  1,是;0,否
//@param obj 加入按钮对象
//@param cfrom 从哪里点击的购物按钮
function cartAdd(product_id,cart_type,opencity_id, flag,bs, obj, cfrom){
    //取购物车商品数量
	var num = $("#number_" + product_id).val();
	//拼装url参数，做跳转
	location.href="http://localhost:8090/cart/add/"+product_id+".html?num=" + num;
}

//首页添加购物车
function cartIndex(obj,i,pid,bs){
  if (typeof(bs) == "undefined") { 
    bs = 1; 
  }
  $(".gWindow").remove();//删除所有弹出层
  var This = $(obj);
  var cartNum = $("#cartNum").html();
  var web_url = cartHostUrl+'/cart/addCart/';//'/cart/add/';
  var number = 1;
  $.ajax({
    url  : web_url,
    type : 'GET',
    dataType: "jsonp",  //返回json格式的数据   
    jsonp:"callback",
    data : {product_id:pid,number:number,opencity_id:1,cart_type:0},
    success: function(msg){
      $(".gWindow").remove();
      if(msg.error == 1){//成功
        var cartDiv = '<div class="gWindow"><div class="gCentent"><a onclick="closeCart(this);" class="gClose">×</a>';
        cartDiv+= '<div>该商品已成功放入购物车！</div>';
        cartDiv+= '<div id="showcart">加载中....</div>';
        cartDiv+= '<div><a onclick="closeCart(this);" class="gButton1" href="javascript:void(0);">继续购物 </a><a href="'+cartHostUrl+'/cart/index/" class="gButton2">去结算</a></div>';
        cartDiv+= '</div></div>';
        if (i==1 || i==0){
          $(cartDiv).appendTo("#cx_"+This.attr('eid'));
        }else{
          $(cartDiv).appendTo($("#cx_"+This.attr('eid')).parent());
        }
        getCartList();
        car_ie6hack();
        yibo('cart',pid,number);
      }else if(msg.error == 2){
        jConfirm(msg.info, '提示消息', function(r){
          if(r){
            cartIndex(obj,i,pid,0);
          }
        })
      }else{
        jAlert(msg.info);
      }

    }
  });

  if (i==1){
    This.animate({top:"141px"},300);
  }else if(i==0){
    This.animate({top:"184px"},300);
  }else{
    This.hide();
  }
}

//商品收藏添加购物车
function cartFav(pid ,is_sfv){
  var web_url = cartHostUrl+'/cart/addCart/';//'/cart/add/';
  var number = 1;
  $.ajax({
    url  : web_url,
    type : 'GET',
    dataType: "jsonp",  //返回json格式的数据   
    jsonp:"callback",
    data : {product_id:pid,number:number,opencity_id:1,cart_type:0,mes:0},
    success: function(msg){
      if(msg.error == 1){//成功
        jAlert('成功添加到购物车！');
        getCartList();
      }else{
        jAlert(msg.info);
      }

    }
  });
}

//添加预售商品
function addPresale(id){
  var web_url = wwwHostUrl+'/cart/presale/';
  var number = 1;

  if($("#number_"+id).length!=0){
    number = $("#number_"+id).val();
  }
  if(!checkRate(number)){
    jAlert('您输入的数量格式有误!!');
    return false;
  }
  var tourl = wwwHostUrl+'/order/presale/id/'+id+'/number/'+number;
  $.post(web_url,{product_id:id,number:number},function(msg){
    if(msg == -3){
      SF.Widget.login(tourl);
      return false;
    }else if(msg == -1){
      jAlert('无此商品信息!!');
      return false;
    } else if(msg == -2){
      jAlert('此商品已经结束预售!!');
      return false;
    } else if(msg == 0){
      jAlert('库存不足!!');
      return false;
    } else {
      location.href = tourl;
    }
  });
}

function yibo(type,product_id,product_num){
  var del = 0;
  //var _adwq = new Array();
  if(type=='delete'){
    del = 1;
  }
  _adwq.push([ '_setDataType',
      type  
      ]);
  $.ajax({
    url  : cartHostUrl+'/ajax/getproduct/',
    type : 'GET',
    dataType: "jsonp",  //返回json格式的数据   
    jsonp:"callback",
    data : {product_id : product_id,opencity_id : 1,del : del,t:Math.random()},
    async: false,
    success: function(msg){
      var json = msg;

      _adwq.push([ '_setCustomer',
        json.userid   //1234567是一个例子，请换成当前登陆用户ID或用户名
        ]);
      // 下面代码是商品组代码，根据订单中包括多少种商品来部署，每种商品部署一组
      //商品组一组开始
      var webtrekk = new Object(); 
      webtrekk.product = new Array();
      webtrekk.productCategory1 = new Array();
      webtrekk.productCategory2 = new Array();
      webtrekk.productCategory3 = new Array();
      webtrekk.productQuantity = new Array();
      webtrekk.productCost = new Array();
      if(json.info){
        $.each(json.info, function(i,val){
          if(val){
            var b = eval('('+val+')');
            _adwq.push(['_setItem',
              b.product_sn,    // 09890是一个例子，请填入商品编号  - 必填项
              b.product_name,       // 电视是一个例子，请填入商品名称  - 必填项
              b.product_price,    // 12.00是一个例子，请填入商品金额  - 必填项
              product_num,        // 1是一个例子，请填入商品数量  - 必填项
              b.category_id,     // A123是一个例子，请填入商品分类编号  - 必填项
              b.category_name        // 家电是一个例子，请填入商品分类名称  - 必填项
              ]);
          }
          webtrekk.product.push(b.product_sn);
          webtrekk.productCategory1.push(b.category_one);
          webtrekk.productCategory2.push(b.category_two);
          webtrekk.productCategory3.push(b.category_id);
          webtrekk.productQuantity.push(product_num);
          webtrekk.productCost.push(b.product_price*product_num);
        });
        webtrekkSend(webtrekk);
        // 下面是提交订单代码，此段代码必须放在以上代码后面 - 必填项
        _adwq.push([ '_trackTrans' ]);
      }
      //商品组一组结束
    }
  });


}

function webtrekkSend(webtrekk){
	var pageConfig = { 
		linkTrack :"link",  
		heatmap :"1"  
	}; 
	var wt = new webtrekkV3(pageConfig);
	wt.sendinfo({
		contentId:"WEB:购物车:加入购物车",
		contentGroup:{ 
			1 :"WEB:购物车",2 :"加入购物车",3 :"加入购物车" 
		}, 
		// 以下代码用来记录添加购物车时的商品信息
		product:webtrekk.product.join(";"), // 请填写商品 ID
		productCategory:{ 
			1 :webtrekk.productCategory1.join(";"), // 请填写商品一级类别名称
			2 :webtrekk.productCategory2.join(";"), // 请填写商品二级类别名称
			3 :webtrekk.productCategory3.join(";") // 请填写商品三级类别名称
		},
		productQuantity:webtrekk.productQuantity.join(";"), // 请填写用户加入购物车时的商品数量
		productCost:webtrekk.productCost.join(";"), // 请填写用户加入购物车时的商品总价值（单价×数量）
		productStatus:"add", // 固定值，请勿修改
		customEcommerceParameter:{  
			2 :"加入购物车" // 固定值，请勿修改
		} 
	});
}

//carwindow遮罩
function car_ie6hack(){
  if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
    var iframehide='<iframe id="car_iframe" style="width:340px;height:50px;z-index:99;position:absolute;left:0;top:200px;"></iframe>';
    $(iframehide).appendTo("#add-cart-box-sf");
  }
}

//判断正整数
function checkRate(input)
{
  var re = /^[0-9]*[1-9][0-9]*$/;    
  if (!re.test(input))
  {
    return false;
  } else {
    return true;
  }
}

//详情页面关闭carwindow
function car_close(){
  $("#carwindow").remove();
  $("#add-cart-box-sf").hide();
  if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
    $("#car_iframe").remove();
  }

}

//首页关闭
function closeCart(obj)
{
  var This = $(obj);
  $('.gWindow').remove();
  $(".gBtn").hide();

}
