var hostUrl = document.location.host;
var urlArr = hostUrl.split('.');
var domain = urlArr[1]+'.'+urlArr[2];
var SF_STATIC_BASE_URL='http://i.'+domain+'/com';
var SF_STATIC_HTML_URL='http://i.'+domain+'/html';
var SF_PASSPORT_URL = 'http://passport.'+domain;
var SF_HOME_URL = 'http://home.'+domain;
var SF_WWW_URL = 'http://www.'+domain;
var SF_COUPON_ERR_NUM = 0; //优惠券输入错误次数，超过三次显示验证码
$(function(){

  setCurr();
  hoverCurr('addresslist');
  hoverCurr('giveraddresslist');
  hoverCurr('inv_List');

  if ($(".orderAddrList .addrItem").length > 5){
    var t = $(".orderAddrList .addrItem:gt(4)");
    t.addClass("hide");
    $("#addresslist").find(".addrShow").html('<span class="open"><b></b>更多</span>').removeClass("hide");
    0 !==$(".pages").length && $(".pages").hide();
    show_hide(t,$("#addresslist"));

  }
  $(".orderForm .text").focus(function(){  
    var txt_value = $(this).val(),keywordVal = $(this).attr("def");   
    if(txt_value==keywordVal){ 
      $(this).val("");
      $(this).removeClass("inputTips");     
    } 
  });

  $(".orderForm .text").each(function(){  
    var txt_value = $(this).val(),keywordVal = $(this).attr("def");   
    if(txt_value==''){ 
      $(this).val(keywordVal);
      $(this).addClass("inputTips");     
    } 
  });

  $(".orderForm .text").blur(function(){
    var txt_value =  $(this).val(),keywordVal = $(this).attr("def");   
    if(txt_value==""){
      $(this).val(keywordVal);
      $(this).addClass("inputTips");
      //$(this).parent().parent().find(".fmError").removeClass("hide");
    }else{
      $(this).parent().parent().find(".fmError").addClass("hide");
    } 
  })

  $("#addrForm select").live("click",function(){  
    $(this).removeClass("inputTips");	
  });

  $("#addrGiverForm select").live("click",function(){  
    $(this).removeClass("inputTips");	
  });

  //确认收货地址
  $("#addrConfirm").click(function(){
	  if($(this).hasClass('yhmStop')) return false;
    var flag = true;
    var edit_addr_id = $("#edit_addr_id").val();
    var addr_id = $("#addr_id").val();
    var isReload = false;
    if(edit_addr_id || addr_id==''){
      var flag = saveAddr();
      isReload = true;
      if(!flag){
        return flag;
      }
    }
    if(addr_id){
      if(!check_address()){
        return false;
      }
      //去服务端验证地址
      var web_url = '/ajax/confirmAddr/';
      var time = (new Date()).valueOf();
      $.ajax({
        type: "POST",
        url: web_url+'?'+time,
        data: 'GusersAddr[addr_id]='+addr_id+'&GusersAddr[receiver_name]='+$('#consignee').val()+'&GusersAddr[province]='+$('#region_province').find('option:selected').val()+'&GusersAddr[city]='+$('#region_city').find('option:selected').val()+'&GusersAddr[district]='+$('#region_county').find('option:selected').val()+'&GusersAddr[area]='+$('#region_area').find('option:selected').val()+'&GusersAddr[addr]='+$("#address").val()+'&GusersAddr[mobile]='+$('#mobile').val()+'&GusersAddr[tel]='+$('#tel').val(),
        dataType:"text",
        async: false,
        success: function(msg){
          var msg = eval('('+msg+')');				
          if(msg.status != 0) {
            flag = false;
            return flag;
          } else if (msg.address != null) {
            var divOrderCurr = $('#userAddress');
            var divAddressList = $('#addresslist');
            var divUserAddrId = $('#userAddrId');
            var divPayDataId  = $('#payDataId');
            var liAddr = divOrderCurr.find('li');
            var mobile = '';
            if (msg.address.mobile != 'undefined ') { mobile = msg.address.mobile; }
            if (mobile == '' && msg.address.tel) { mobile = msg.address.tel; }
            var addrStr = msg.address.receiver_name+'&nbsp;&nbsp;&nbsp;&nbsp;'+mobile+"&nbsp;&nbsp;&nbsp;&nbsp;"+msg.address.city_name+"&nbsp;&nbsp;"+msg.address.district_name+"&nbsp;&nbsp;"+msg.address.area_name+"&nbsp;"+msg.address.addr;
            liAddr.html(addrStr);
            divOrderCurr.show();
            divAddressList.hide();
            divUserAddrId.removeClass('stepCurr');
            divUserAddrId.find('.addrAlter').show();
            divPayDataId.addClass('stepCurr');
            divPayDataId.find('h3.orderTitle').html('支付及配送方式：<span class="addrAlter hide">[修改]</span><span class="orderTip">由于您更改了收货地址，请重新确认配送方式</span>');
            divPayDataId.find('div.orderCurr').hide();
            divPayDataId.find('div.orderShow').show();
            divPayDataId.find('div.orderItem').show();
            hideShowEditHref();
          } else {
            isReload = true;
          }
        },
        error: function(msg){
          jAlert('网络异常,收货地址保存失败.');
          location.reload();
        }
      });
      if(!flag){
        return flag;
      }
    }
    if (isReload) {location.reload();}
  });
  giverCard();
  hideShowEditHref();
});
function giverCard(){
  var inputExp = "例：\n尊敬的王先生：\n我在这里祝您工作作顺利，身体健康！\n您的朋友：李响";
  var inputArea = $(".inputArea");
  inputArea.val(inputExp);
  inputArea.addClass("inputTips");
  inputArea.live("focus", function () {
    if (inputArea.val() == inputExp) {
      inputArea.removeClass("inputTips");
      inputArea.val("");
    }
  });
  inputArea.live("blur", function () {
    if (inputArea.val() == "") {
      inputArea.val(inputExp);
      inputArea.addClass("inputTips");
    }
  });
  $(".giverShow").live("mouseenter",function(){$(".giverItem").html(inputArea.val().replace(/\n/gi,"<br />")).show();}).live("mouseleave",function(){$(".giverItem").hide();})
}
function hoverCurr(t){
  $("#"+t+" .addrs").each(function(){
    var This = $(this);
    This.hover(function(){
      if(!This.find(".i").attr("checked")){
        timeout = setTimeout(function() {
          This.addClass("curr");
        }, 150);
      }
    },function(){
      if(!This.find(".i").attr("checked")){
        clearTimeout(timeout);
        This.removeClass("curr");
      }
    });
  });
}

function setCurr(){
  $(".orderAddr .addrs").each(function(){
    var This = $(this);
    This.find(".i").each(function() {
      var That = $(this);
      $(this).bind("change", function() {
        That.attr("checked", '');
        $(".orderAddr .addrs").removeClass("curr");
        $(this).attr("checked", "checked");
        This.addClass("curr");
      });
    });
  });
  $("#giveraddresslist .addrs").each(function(){
    var This = $(this);
    This.find(".i").each(function() {
      var That = $(this);
      $(this).bind("change", function() {
        That.attr("checked", '');
        $("#giveraddresslist .addrs").removeClass("curr");
        $(this).attr("checked", "checked");
        This.addClass("curr");
      });
    });
  });
  $("#inv_List .addrs").each(function(){
    var This = $(this);
    This.find(".i").each(function() {
      var That = $(this);
      $(this).bind("change", function() {
        That.attr("checked", '');
        $("#inv_List .addrs").removeClass("curr");
        $(this).attr("checked", "checked");
        This.addClass("curr");
      });
    });
  });

}

function show_hide(t,This){
  This.find(".addrShow").click(function() {
    if(t.is(":hidden")){
      t.removeClass("hide");
      $(this).html('<span class="close"><b></b>收起</span>');
      0 !==$(".pages").length && $(".pages").show();
    }else{
      t.addClass("hide");
      $(this).html('<span class="open"><b></b>更多</span>');
      0 !==$(".pages").length && $(".pages").hide();
    }
  })
}

function check_address(){
  //testzip = /^[0-9]{6,6}$/.test($('#zipcode').val());
  testmobile = /^1\d{10}$/.test($.trim($('#mobile').val()));
  testtel    = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/ .test($.trim($("#tel").val()));
  //testemail  = /^\w+((-\w+)|(\.\w+))*\@\w+((\.|-)\w+)*\.\w+$/.test($.trim($("#email").val()));

  var consignee = $.trim($("#consignee").val());
  var city_id = $("#region_city").val();
  var area_id = $("#region_county").val();
  var town_id = '0';
  if($("#region_area").length > 0 && $('#area').css('display') != 'none'){
    var town_id = $("#region_area").val();
  }
  var addr = $.trim($("#address").val());	
  var mobile = $.trim($("#mobile").val());
  var tel = $.trim($("#tel").val());
  if(!mobile && tel){
    mobile = tel;
  }

  if(consignee=='' || consignee==$('#consignee').attr("def")){
    $('#consignee').parent().parent().find(".fmError").removeClass("hide");
    //jAlert('收货人姓名不能为空');
    return false;	
  }else if(city_id==0){
    $('#region_province').parent().parent().parent().find(".fmError").removeClass("hide");
    //jAlert('请选择收货人城市');
    return false;	
  }else if(area_id==0){
    $('#region_province').parent().parent().parent().find(".fmError").removeClass("hide");
    //jAlert('请选择收货人区县');
    return false;	
  }else if($("#region_area").length > 0 && $('#area').css('display') != 'none' && town_id==0){
    $('#region_province').parent().parent().parent().find(".fmError").removeClass("hide");
    //jAlert('请选择收人货街道/镇');
    return false;	
  }else if(addr.length<5 || addr.length>40 || !isNaN(addr) || addr==$('#address').attr("def")){  
    $('#address').parent().parent().find(".fmError").removeClass("hide");
    //jAlert('请填写收货人详细地址，限5-40个字，不能全部为数字');
    return false;
  }else if(mobile==''){
    $('#mobile').parent().parent().find(".fmError").removeClass("hide");
    //jAlert('请填写收货人联系电话');
    return false;	
  }

  if($.trim($('#mobile').val()) !=''){
    if(!testmobile || $.trim($('#mobile').val()) == $('#mobile').attr("def")){
      $('#mobile').parent().parent().find(".fmError").removeClass("hide");
      //jAlert('请填写正确的手机号');
      return false;
    }
  }else{
    if($.trim($('#tel').val()) !=''){
      if($.trim($('#tel').val()) == $('#tel').attr("def")){
        $('#mobile').parent().parent().find(".fmError").removeClass("hide");
        //jAlert('请填写正确的座机号!');
        return false;
      }
    }
  }	
  if($.trim($('#tel').val()) !='' && $.trim($('#tel').val()) != $('#tel').attr("def")){
    if(!testtel){
      $('#mobile').parent().parent().find(".fmError").removeClass("hide");
      //jAlert('请填写正确的座机号');
      return false;
    }
  }

  if(addr.indexOf("&")>0 || addr.indexOf("#")>0){
    jAlert('详细收货人地址不能包含&#');
    return false;
  }
  return true;

}

//收货地址分页方法
function arrComm(page){
  page += 1;
  $.get("/ajax/addrdata/page/"+page,null,function(data){
    $('#addresslist .orderAddr').html(data);
    var t = $(".orderAddr .addrs:gt(4):not(:last)");
    show_hide(t,$(".orderAddr"));
    setCurr();
    hoverCurr('addresslist');
  },"html");


}
//删除收货地址
function delAddr(addr_id){
  jConfirm('您确定要删除该地址吗?', '消息确认', function(t) {
    if(t){
      $.get("/ajax/delAddr/addr_id/"+addr_id,null,function(data){
        if(data==1){
          jAlert("删除成功");
          arrComm(0);
          setCurr();
          hoverCurr('addresslist');

          $("#addr_id").val('');
          if(!$("#edit_addr_id").val()){
            $("#addrForm input").each(function(){$(this).val($(this).attr("def"))});
          }
        }
      },"html");
    }
  });
}
//修改收货地址
function editAddr(addr_id){
  $("input[name='useraddr']:[value="+addr_id+"]").change();
  $("#addrForm").show();
  $("#edit_addr_id").val(addr_id);
  ///$("#addrForm input").each(function(){$(this).val($(this).attr("def"))});
  $("#addrForm input").removeClass("inputTips");
  $("#addrForm select").removeClass("inputTips");
}

//选择市
$("#region_city").live('change',function(){
  if($(this).find("option:selected").val() == 0){
    $("#shi").html('');
  } else {
    $("#shi").html($(this).find("option:selected").html());
  }
});
//选择县
$("#region_county").live('change',function(){
  if($(this).find("option:selected").val()==0){
    $("#xian").html('');
  } else {
    $("#xian").html($(this).find("option:selected").html());
  }
});
//选择区域
$("#region_area").live('change',function(){
  if($(this).find("option:selected").val()==0){
    $("#areasp").html('');
  } else {
    $("#areasp").html($(this).find("option:selected").html());
  }
});

//选择地址
$("input[name=useraddr]").live('change',function(){
  $("input[name=useraddr2]").attr("checked",'');
  var addr_id = $(this).val();
  $("#addrForm").hide();
  //$("#addr_id").val(addr_id);
  $("#edit_addr_id").val('');

  var web_url = "/order/changeArea";
  $('#addrConfirm').css({'background-color':'#CCC','color':'#EEE','cursor':''}).addClass('yhmStop').text('地址切换中........');
  $.post(web_url,{addr_id:addr_id},function(msg){
    var msg = eval('('+msg+')');
    if(msg.tel == '-' || msg.tel == '--'){
      msg.tel = '';
    }		
    if(msg.succes==1){
      $("#addr_id").val(msg.addr_id);
      $("#consignee").val(msg.receiver_name);
      $("#address").val(msg.addr);
      $("#mobile").val(msg.mobile);
      $("#tel").val(msg.tel);
      //$("#email").val(msg.email);
      $("#region_county").val();

      $("#region_province option[value="+msg.province+"]").attr('selected',true);
      $("#region_province").change();
      $("#region_city option[value="+msg.city+"]").attr('selected',true);
      $("#region_city").change();
      $("#region_county option[value="+msg.district+"]").attr('selected',true);
      $("#region_county").change();
      $("#region_area option[value="+msg.area+"]").attr('selected',true);
      $("#region_area").change();
      $("#xian").html($("#region_county").find("option:selected").text());
      //$("#region_area").html(msg.option);
      $("#areasp").html($("#region_area").find("option:selected").text());

      $("#addresslist .orderAddrList").find(".addrTip").addClass("hide");
	  $('#addrConfirm').css({'background-color':'#6e9b0c','color':'#FFF','cursor':'pointer'}).removeClass('yhmStop').text('保存收货人信息');
      if(msg.status==1){
        $("input[name='useraddr']:[value="+addr_id+"]").parent().next().removeClass("hide").find("a").html(msg.info);
      }else if(msg.status==2){
        $("input[name='useraddr']:[value="+addr_id+"]").parent().next().removeClass("hide").html("<a href='/cart/'>"+msg.info+"</a>");
      }

      if(msg.unDeliverableProduct){

        for(var i in msg.unDeliverableProduct){
          $("div[pid="+msg.unDeliverableProduct[i]+"]").html("无法送达");
        }
      }else if(msg.outOfStockProduct){
        for(var i in msg.outOfStockProduct){
          $("div[pid="+msg.outOfStockProduct[i]+"]").html("缺货");
        }
      }else if(msg.offTheShelfProduct){
        for(var i in msg.offTheShelfProduct){
          $("div[pid="+msg.offTheShelfProduct[i]+"]").html("售完");
        }
      }else if(msg.preSalefProduct){
        for(var i in msg.preSalefProduct){
          $("div[pid="+msg.preSalefProduct[i]+"]").html("预售");
        }
      }

    } else {
      jAlert(msg.data);
    }
  });
});
function useNewAddr(){
  $("#addr_id").val('');
  $("#addrForm").show();
  $("input[name=useraddr]").attr("checked",'');	
  if(!$("#edit_addr_id").val()){
    $("#addrForm input").addClass("inputTips");
    //$("#addrForm select").addClass("inputTips");
    $("#addrForm input").each(function(){$(this).val($(this).attr("def"))});
  }
  //$("#addrForm select").each(function(){$(this).val('')});
}

//选择收货地址后执行自动保存
function autoSaveAddr() {
  if ($("#addr_id").val()) {
    $("#addrConfirm").click();
  } else {
    setTimeout(function(){
      autoSaveAddr();
    }, 500);
  }
}

//保存收货地址
function saveAddr(){
  clearTips();
  var addr_id = $("#addr_id").val();
  var flag = true;
  if(!check_address()){
    return false;
  }
  var web_url = '/ajax/addAddr/';
  $.ajax({
    type: "POST",
    url: web_url,
    data: 'GusersAddr[addr_id]='+addr_id+'&GusersAddr[receiver_name]='+$('#consignee').val()+'&GusersAddr[province]='+$('#region_province').find('option:selected').val()+'&GusersAddr[city]='+$('#region_city').find('option:selected').val()+'&GusersAddr[district]='+$('#region_county').find('option:selected').val()+'&GusersAddr[area]='+$('#region_area').find('option:selected').val()+'&GusersAddr[addr]='+$("#address").val()+'&GusersAddr[mobile]='+$('#mobile').val()+'&GusersAddr[tel]='+$('#tel').val()+'&add_from=2',
    dataType:"text",
    async: false,
    success: function(msg){
      var msg = eval('('+msg+')');
      if(msg.status == 0) {
        //arrComm(0);
      } else {
        if (msg.addr_id) {
          $("input[name='useraddr']:[value="+msg.addr_id+"]").change();
          autoSaveAddr();
        } else {
          jAlert(msg.info);
        }
        flag = false;
        return flag;
      }
    },
    error: function(msg){
      jAlert('网络异常,收货地址保存失败.');
    }
  });
  return flag;
}

$(function(){
  $(".bankers a").hover(function(){$(".showbanker").removeClass("hide")},function(){$(".showbanker").addClass("hide")})
  $(".spItem").each(function(){
    var goodsItem = $(this).find(".goodsItem").length;
    if(goodsItem > 3){$(this).css({"height":"100px","overflow-x":"hidden","overflow-y":"auto"})}
  })
/*支付及配送方式*/
$(".tSelect").click(function(){
  var $this = $(this),
$date = $(".datechange"),
left = $this.offset().left,
top = $this.offset().top;
$date.show();
$date.css({top:top + 45 , left:left + 237});
})
if ($(".shipZt").find(".cList").length > 4){
  var tt = $(".shipZt").find(".cList:gt(3)");
  tt.addClass("hide");
  $(".showMore").html('<div class="showExtra"><div>展开查看更多<b></b></div></div>').removeClass("hide");
  $(".showMore").toggle(function() {
    tt.removeClass("hide");
    $(this).html('<div class="showExtra close"><div>收起<b></b></div></div>');
  }, function() {
    tt.addClass("hide");
    $(this).html('<div class="showExtra"><div>展开查看更多<b></b></div></div>');
  })
}
if($(".tOrder").length > 0){
  $(".tOrder").each(function(){
    var id = $(this).attr("na");
    $(this).hover(function(){
      var pleft = $(this).offset().left-25,ptop = $(this).offset().top + 20;
      $("#"+id).css({"left":pleft,"top":ptop}).show();
    },function(){
      $("#"+id).hide();
    });
  })
  $(".shipProduct").each(function(){
    $(this).hover(function(){
      $(this).show();
    },function(){
      $(this).hide();
    });
  })
}

//选择支付方式
$("input[name='payment']").change(function(){
  var pay_id = $(this).val();
  if(pay_id==1){
    setDisplay('payImg','pay_z');
  } else if(pay_id==2 || pay_id==5) {		
    //setDisplay('pay_z','payImg');
  } else {
    $('#payImg').css({'display':'none'});//在线支付图片
    $('#pay_z').css({'display':'none'});//货到付款
  }
});
//确认支付方式
$("#payConfirm").click(function(){
  $("#giverAddrId").show();
  $(this).parent().parent().parent().prev().find(".addrAlter").show();
  $(this).parent().parent().parent().prev().find(".orderTip").hide();
  $(this).parent().parent().parent().parent().removeClass("stepCurr");
  var payment = $("input[name=payment]:checked").val();
  if(payment == 1){
    var str = '在线支付';
  }else if(payment == 2 || payment == 5){
    var str = '货到付款';
    $("#giverConfirm2").click();
    $("#giverAddrId").hide();
  }else if(payment == 3){
    var str = '银行转账';
  }else if(payment == 4){
    var str = '支票支付';
  }
  $(this).parent().parent().hide();
  $(this).parent().parent().parent().find(".orderCurr").show();
  //setCookie('payid',payment,'',"/order/");
  $("#payshow").html(str);

  var pay_id   = $("input[name='payment']:checked").val();
  $("#pay_id").val(pay_id);

  if($("#ylorder1").css("display")=='block'){
    $("#ylsorder1").removeClass('hide');
    $("#ylsorder2").addClass('hide');
  }else{

    $("#ylsorder2").removeClass('hide');
    $("#ylsorder1").addClass('hide');
    //$("#ylorder").html($("#ylorder2").html());
  }

  var together = $("input[name='together']:checked").val();
  var sendtime = $("input[name='sendtime']:checked").val();
  if($("input[name='sendtime']:checked").parent().text()){
    $(".shippingTime .cmshow").html($("input[name='sendtime']:checked").parent().text());
  }else{
    $(".shippingTime .cmshow").html($("input[name='sendtime']").parent().text());
  }
  var customer_time = $("#shipping_time_"+$('#best_time1').val()).attr("shipping_time_attr");
  var web_url = '/ajax/confirmPay/';
  $.ajax({
    type: "POST",
    url: web_url,
    data: 'pay[payid]='+pay_id+'&pay[together]='+together+'&pay[best_date]='+$('#best_date1').val()+'&pay[best_time]='+$('#best_time1').val()+'&pay[customer_time]='+customer_time+'&pay[sendtime]='+sendtime,
    dataType:"text",
    async: false,
    success: function(msg){
      /*
         var msg = eval('('+msg+')');	
         if(msg.error==1){	
         $("#userInvoiceId").addClass("stepCurr").find(".orderItem").removeClass("hide");
         $("#userInvoiceId").find(".orderTitle").removeClass("cfmPrev");
         $("#userInvoiceId").find(".orderTip").html('');
         if($("input[name=invoice]").length>0){
         $("#shipping").addClass("hide");
         }
         }*/
    },
    error: function(msg){
      jAlert('网络异常,支付方式保存失败.');
    }
  });
  confirmCheck();
});
//发票显示条数
if ($(".orderInv .addrItem").length > 4){
  var tInv = $(".orderInv .addrItem:gt(2):not(:last)");
  tInv.addClass("hide");
  $(".orderInv").find(".addrShow").html('<span class="open"><b></b>更多</span>').removeClass("hide");
  show_hide(tInv,$(".orderInv"));

}
//寄货人显示条数
if ($(".giverAddr .addrItem").length > 5){
  var tGiver = $(".giverAddr .addrItem:gt(4)");
  tGiver.addClass("hide");
  $(".giverorderAddr").find(".addrShow").html('<span class="open"><b></b>更多</span>').removeClass("hide");
  show_hide(tGiver,$(".giverorderAddr"));

}

//是否需要发票
$("input[name='fapiao']").change(function(){
  var pay_id = $(this).val();
  if(pay_id==1){
    //setCookie('fapiao',1);
    $('#shipping').removeClass('hide');
  } else {
    $('#shipping').addClass('hide');
    $('.invMsg').css({'display':'none'});
    //setCookie('fapiao',2);
  }
});

$("#shipping").css({
  //	'display': 'none'
});
$("#invMsg").css({
  //	'display': 'none'
});
$("#Invoice_inv_type_0").hide();
$("#Invoice_inv_type_0").next().hide();

//选择发票类型
$("input[name='Invoice[inv_type]']").change(function() {
  //使用新发票
  //$("input[name=invoice]").attr("checked",'');
  //$("input[name=invoice2]").change().click();
  //选择增值税发票
  if ($(this).val() == 2) {
    $("#inv").css({
      'display': 'block'
    });
    $("#inv_button").css({
      "display": "block"
    });
    $("#invMsg").css({
      'display': 'block'
    });
    setDisplay('inv_type_two', 'inv_type_one')
  }
  //普通
  else if ($(this).val() == 1) {
    $("#inv").css({
      'display': 'block'
    });
    $("#inv_button").css({
      "display": "block"
    });
    $("#invMsg").css({
      'display': 'block'
    });
    setDisplay('inv_type_one', 'inv_type_two')
  } else {
    $("#inv").css({
      'display': 'none'
    });
    $("#inv_type_one").css({
      'display': 'none'
    });
    $("#inv_type_two").css({
      'display': 'none'
    });
    $("#invMsg").css({
      'display': 'none'
    });
  }
});

//发票选择个人 公司 
$("input[name='Invoice[inv_title]']").change(function() {
  //公司
  if ($(this).val() == 1) {
    $("#company").css({
      'display': 'block'
    });
    $("#invmemory").css({
      'display': 'block'
    });
  } else {
    $("#company").css({
      'display': 'none'
    });
    $("#invmemory").css({
      'display': 'none'
    });
  }
});

//地址修改 支付方式修改 
$(".addrAlter").live("click",function(){
  if($(".orderCurr:hidden").length>0 && $(".orderCurr:hidden").parent().parent().css("display")!='none'){
    jAlert("请先保存其它未保存的模块");
    return false;
  }
  if($(this).parent().parent().attr("id")=='giverAddrId'){
    if($("#chaidanorder1").css("display")=='block'){
      var T = $("#chaidanorder1");
    }else{
      var T = $("#chaidanorder2");
    }

    var order = T.find("input[name='ecards']:[value='1']").parent().parent().prev().find("input[name='order_numbers']");
    var order_str = '';
    var i=0;
    order.each(function () {
      i++;
      if(i>3){
        return;
      }
      order_str += $(this).val() + " ";
    });
    //jAlert(order_str);
    $("#ordernumbers").html($.trim(order_str)+'的包裹将携带电子贺卡信息，扫描包裹二维码即可看到');
  }
  $(this).hide();
  $(this).parent().parent().find(".orderCurr").hide();
  $(this).parent().parent().find(".orderShow").show();
  $(this).parent().parent().addClass("stepCurr");
  confirmCheck();
});	

//选择常用单位名称
$('a.invBtn').toggle(function(){
  $(this).next('.inv_memory').show();
},function(){
  $(this).next('.inv_memory').hide();
});

//选择常用发票
$("input[name=invoice]").live('change',function(){
  $("#edit_invoice_id").val('');
  $("#shipping").addClass("hide");
  $("input[name=invoice2]").attr("checked","");
  var invoice_id=$(this).val();
  $.post('/order/getInvoice',{"id":invoice_id},function(msg){
    var msg = eval('('+msg+')');
    $("input[name='Invoice[inv_type]']:[value="+msg.invoice_type+"]").change();
    if(msg.invoice_type == 2){
      $("#Invoice_inv_type_2").click();
      $("#inv_type_two").find("input[name='Invoice[company]']").val(msg.company);
      $("input[name='Invoice[taxpayer_sn]']").val(msg.taxpayer_sn);
      $("input[name='Invoice[com_address]']").val(msg.com_address);
      $("input[name='Invoice[com_phone]']").val(msg.com_phone);
      $("input[name='Invoice[com_bank]']").val(msg.com_bank);
      $("input[name='Invoice[bank_account]']").val(msg.bank_account);
    }else{
      $("#Invoice_inv_type_1").click();
      if(msg.company){
        $("#inv_type_one").find("input[name='Invoice[company]']").val(msg.company);
        $("#Invoice_inv_title_0").change();
        $("#Invoice_inv_title_0").click();
        //$("#inv_type_one").find("input[name='Invoice[company]']").show();
      }else{
        //$("#inv_type_one").find("input[name='Invoice[company]']").hide();
        $("#Invoice_inv_title_1").change();
        $("#Invoice_inv_title_1").click();
      }
      $("input[name='Invoice[inv_content]']:[value="+msg.invoice_content+"]").change();
      $("input[name='Invoice[inv_content]']:[value="+msg.invoice_content+"]").click();

    }
    $("#shipping input[type='text']").each(function(){
      if($(this).val() == $(this).attr("def")){
        $(this).addClass("inputTips");
      }
    });

  });
});


//确认发票信息
$("input[name='invoice_button']").click(function(){
  if($("input[name='invoice2']:checked").length==0){
    if($("input[name='invoice']:checked").length==0){
      jAlert("请选择发票信息");
      return false;
    }
  }
  if(!checkInv()) return false;

  var p_inv_title = "";
  var p_inv_type = "";
  var p_inv_content = "";
  if($("#Invoice_inv_type_1").attr("checked")){
    p_inv_type += "普通发票";
    if($("#Invoice_inv_title_0").attr("checked")){
      var company = $.trim($("input[id='Invoice[company]']").val());
      if(company){
        p_inv_title += company;
      }else{
        jAlert("请填写单位名称");
        //$('#invoice_need').css({'display':'block'});
        $('#shipping').css({'display':'block'});
        return false;
      }

    }else{
      p_inv_title += "个人";
    }
    var content_id = $("input[name='Invoice[inv_content]']:checked").attr("id");
    if(!content_id){
      jAlert("请选择发票内容");
      ///$('#invoice_need').css({'display':'block'});
      $('#shipping').css({'display':'block'});
      return false;
    }
    p_inv_content += $("label[for='"+content_id+"']").html();	
  }else{
    p_inv_type += "增值税专用发票";

    var company = $.trim($("#zz_company").val());

    if(company){
      p_inv_title += company;
    }else{
      jAlert("请填写单位名称");
      //$('#invoice_need').css({'display':'block'});
      $('#shipping').css({'display':'block'});
      return false;
    }
    p_inv_content += '明细';

  }

  saveInvoice();

  $('#p_inv_title').html(p_inv_title);
  $('#p_inv_type').html(p_inv_type);
  $('#p_inv_content').html(p_inv_content);
});

//暂不需要发票
$("input[name='invoice_button2']").click(function(){
  $("input[name='invoice2']").attr("checked",'');
  $("input[name='fapiao']:[value=2]").change().click();
  //if(!checkInv()) return false;
  $("#invoice_edit").show();
  $("#invoice_edit").parent().parent().removeClass('stepCurr');
  $('#invoice_need').parent().css({'display':'none'});
  var p_inv_title = "";
  var p_inv_type = "暂不需要发票";
  var p_inv_content = "";
  $('.invMsg').css({'display':'block'});
  $('#p_inv_title').html(p_inv_title);
  $('#p_inv_type').html(p_inv_type);
  $('#p_inv_content').html(p_inv_content);
  $.ajax({
    type: "POST",
    url: '/ajax/noInvoice/',
    data: '',
    dataType:"text",
    async: false,
    success: function(msg){
      var msg = eval('('+msg+')'); 

      $("#userInvoiceId").find(".orderTitle").removeClass("cfmPrev").html('发票信息：<span onclick="invoice_edit()" id="invoice_edit" class="addrAlter">[修改]</span>');
      /*
         $("#giverAddrId").find(".orderItem").removeClass("hide");
         $("#giverAddrId").find(".orderTitle").removeClass("cfmPrev");
         $("#giverAddrId").find(".orderTip").html('');	

         if(msg.giver!=1 && msg.need!=2){
         $("#giverAddrId").addClass("stepCurr");
         }else{
         $("#giverAddrId .orderTitle").html('寄货信息：<span class="addrAlter">[修改]</span>');
         }*/

      confirmCheck();

    },
    error: function(msg){
    }
  });
});



});

//修改常用发票
function editInvoice(id){
  $("input[name='invoice']:[value="+id+"]").change();
  $("input[name='invoice']:[value="+id+"]").attr("checked","checked");
  $("#edit_invoice_id").val(id);
  $("#shipping").removeClass("hide");
  $("#shipping input[type='text']").removeClass("inputTips");
}

function useNewInvoice(){
  //$("#edit_invoice_id").val('');
  //$("#addrForm").show();
  $("#shipping").removeClass("hide");
  $("input[name=invoice]").attr("checked",'');	
  if(!$("#edit_invoice_id").val()){
    $("#shipping input[type='text']").addClass("inputTips");
    $("#shipping input[type='text']").each(function(){$(this).val($(this).attr("def"))});
  }
  //$("#addrForm select").each(function(){$(this).val('')});
}
//按钮保存发票信息
function saveInvoice(){
  var web_url = '/order/saveInvoice/';
  var flag = true;
  if(!checkInv()) return false;
  var id = $("input[name='invoice']:checked").val();
  var edit_invoice_id = $("#edit_invoice_id").val();
  if($("input[name='Invoice[inv_type]']:checked").val() == 1){		
    var inv_type = $("input[name='Invoice[inv_type]']:checked").val();
    var inv_title = $("input[name='Invoice[inv_title]']:checked").val();
    var company = $.trim(inv_title==1 ? $("#company").find("input[name='Invoice[company]']").val() : '');
    var inv_content = $("input[name='Invoice[inv_content]']:checked").val();
    //if($("input[name='Invoice[inv_title]']:checked").val() == 1){

    $.ajax({
      type: "POST",
      url: web_url,
      data: 'Invoice[id]='+id+'&Invoice[edit_invoice_id]='+edit_invoice_id+'&Invoice[inv_type]='+inv_type+'&Invoice[inv_title]='+inv_title+'&Invoice[company]='+company+'&Invoice[inv_content]='+inv_content,
      dataType:"text",
      async: false,
      success: function(msg){
        var msg = eval('('+msg+')');   
        if(msg.success==1){
          if(msg.data!='confirm'){
            $('#inv_List').html(msg.data);
            if ($(".orderInv .addrItem").length > 4){
              var tInv = $(".orderInv .addrItem:gt(2):not(:last)");
              tInv.addClass("hide");
              $(".orderInv").find(".addrShow").html('<span class="open"><b></b>更多</span>').removeClass("hide");
              show_hide(tInv,$(".orderInv"));

            }
            setCurr();
            hoverCurr('inv_List');
          }else{
            $("input[name='invoice']:[value="+msg.id+"]").change();
            $("input[name='invoice']:[value="+msg.id+"]").attr("checked","checked");
          }

          $("#userInvoiceId").find(".orderTitle").removeClass("cfmPrev").html('发票信息：<span onclick="invoice_edit()" id="invoice_edit" class="addrAlter">[修改]</span>');
          /*
             $("#giverAddrId").find(".orderItem").removeClass("hide");
             $("#giverAddrId").find(".orderTitle").removeClass("cfmPrev");
             $("#giverAddrId").find(".orderTip").html('');
             if(msg.giver!=1 && msg.need!=2){
             $("#giverAddrId").addClass("stepCurr");
             }else{
             $("#giverAddrId .orderTitle").html('寄货信息：<span class="addrAlter">[修改]</span>');
             }
             */

          $("#invoice_edit").show();
          $("#shipping").addClass('hide');
          $("#invoice_edit").parent().parent().removeClass('stepCurr');
          $('#invoice_need').parent().css({'display':'none'});
          $('.invMsg').css({'display':'block'});
          confirmCheck();
        }else{
          if(msg.data== 'nocompany'){
            jAlert('您输入的信息可能含有部分不当词汇，请修改后重新提交，如有疑问请联系客服');
            flag = false;
            return false;
          }else if(msg.data !=''){
            jAlert(msg.data);
            //invoice_edit();
            flag=false;
          }else{
            flag = false;
            jAlert('发票填写的信息未保存成功，请稍后重试');
          }
        }
      },
      error: function(msg){
        flag = false;
        jAlert('发票信息保存失败!!');
      }

    });

    //}

  } else if($("input[name='Invoice[inv_type]']:checked").val() == 2){		
    var inv_type = $("input[name='Invoice[inv_type]']:checked").val();
    var company = $.trim($("#inv_type_two").find("input[name='Invoice[company]']").val());
    var taxpayer_sn= $("input[name='Invoice[taxpayer_sn]']").val();
    var com_address= $("input[name='Invoice[com_address]']").val();
    var com_phone= $("input[name='Invoice[com_phone]']").val();
    var com_bank= $("input[name='Invoice[com_bank]']").val();
    var bank_account= $("input[name='Invoice[bank_account]']").val();
    var inv_content = $("input[name='mingxi']:checked").val();
    $("#company").find("input[name='Invoice[company]']").val(company);
    testtel = /^\d{7,}$/.test(com_phone);
    account = /^\d{12,}$/.test(bank_account);

    var inv_id=$("input[name='invoice2']:checked").val();//发票id
    $.ajax({
      type: "POST",
      url: web_url,
      data: 'Invoice[id]='+id+'&Invoice[edit_invoice_id]='+edit_invoice_id+'&Invoice[inv_type]='+inv_type+'&Invoice[company]='+company+'&Invoice[inv_content]='+inv_content+'&Invoice[taxpayer_sn]='+taxpayer_sn+'&Invoice[com_address]='+com_address+'&Invoice[com_phone]='+com_phone+'&Invoice[com_bank]='+com_bank+'&Invoice[bank_account]='+bank_account,
      dataType:"text",
      async: false,
      success: function(msg){
        var msg = eval('('+msg+')');         
        if(msg.success==1){
          if(msg.data!='confirm'){
            $('#inv_List').html(msg.data);
            if ($(".orderInv .addrItem").length > 4){
              var tInv = $(".orderInv .addrItem:gt(2):not(:last)");
              tInv.addClass("hide");
              $(".orderInv").find(".addrShow").html('<span class="open"><b></b>更多</span>').removeClass("hide");
              show_hide(tInv,$(".orderInv"));

            }
            setCurr();
            hoverCurr('inv_List');
          }else{
            $("input[name='invoice']:[value="+msg.id+"]").change();
            $("input[name='invoice']:[value="+msg.id+"]").attr("checked","checked");
          }

          $("#userInvoiceId").find(".orderTitle").removeClass("cfmPrev").html('发票信息：<span onclick="invoice_edit()" id="invoice_edit" class="addrAlter">[修改]</span>');
          /*
             $("#giverAddrId").find(".orderItem").removeClass("hide");
             $("#giverAddrId").find(".orderTitle").removeClass("cfmPrev");
             $("#giverAddrId").find(".orderTip").html('');

             if(msg.giver!=1 && msg.need!=2){
             $("#giverAddrId").addClass("stepCurr");
             }else{
             $("#giverAddrId .orderTitle").html('寄货信息：<span class="addrAlter">[修改]</span>');
             }
             */

          $("#invoice_edit").show();
          $("#shipping").addClass('hide');
          $("#invoice_edit").parent().parent().removeClass('stepCurr');
          $('#invoice_need').parent().css({'display':'none'});
          $('.invMsg').css({'display':'block'});
          confirmCheck();
        }else{
          if(msg.data== 'nocompany'){
            jAlert('您输入的信息可能含有部分不当词汇，请修改后重新提交，如有疑问请联系客服');
            flag = false;
            return false;
          }else if(msg.data !=''){
            jAlert(msg.data);
            //invoice_edit();
            flag=false;
          }else{
            flag = false;
            jAlert('发票填写的信息未保存成功，请稍后重试');
          }
        }
      },
      error: function(msg){
        flag = false;
        jAlert('发票信息保存失败!!');
      }
    });	
  }else{
    flag = false;
    jAlert('请选择发票类型');	
  }
  return flag;

}

//修改发票信息
function invoice_edit(){
  if($(".orderCurr:hidden").length>0 && $(".orderCurr:hidden").parent().parent().css("display")!='none'){
    //jAlert("请先保存其它未保存的模块");
    return;
  }
  //$("#invoice_edit").hide();
  $(".orderInv").removeClass('hide');
  var invoice_need = $("input[name='fapiao']:last").attr("checked");
  if(invoice_need){
    //	$('.invMsg').css({'display':'none'});
    $("input[name='fapiao']:first").attr("checked","checked");

  }else{
    ///	$('.invMsg').css({'display':'block'});
    //$("input[name='fapiao']:last").attr("checked","true");
  }
  //$('#invoice_need').css({'display':'block'});
  //$('#shipping').css({'display':'block'});
  $('#inv_List').css({'display':'block'});
  confirmCheck();
}

//删除发票地址
function delInvoice(id,inv_type){
  jConfirm('您确定要删除该发票信息吗?', '消息确认', function(t) {
    if (t){
      $.post('/order/delInvoice/', {"id":id,"inv_type":inv_type}, function(data){
        if(data!=0){
          $("input[name='invoice']:[value="+id+"]").parent().parent().remove();
          if(inv_type==1){
            $("#company").find("input[name='Invoice[company]']").val('');
          }
          if($('#inv_List').find("input[name='invoice']").length<3){
            $('#inv_List').find(".addrShow").addClass('hide');
          }
          if($('#inv_List').find("input[name='invoice']").length==0){
            $('#inv_List').html('<div class="addrItem addrNew"><div class="addrs"><input type="radio" id="radio" name="invoice2" class="i" onclick="useNewInvoice();"><input type="hidden"  id="edit_invoice_id" value=""><label for="" class="l">使用新的发票</label></div></div>');
          }

        }else{
          jAlert('删除失败', '提示消息',function(e){
            if(e){
              return;
            }
          });
        }
      });
    }else{
      return false;
    }
  });
}


//检查发票信息
function checkInv(){
  clearTips();
  var flag = true;
  //var invoiceCompany = new Array('北京宜立方电子商务有限公司', '宜立方电子商务', '宜立方电子商务有限公司', '宜立方商城', '北京宜立方电商有限公司');
  if($("input[name='Invoice[inv_type]']:checked").val() == 1){	
    var inv_type = $("input[name='Invoice[inv_type]']:checked").val();
    var inv_title = $("input[name='Invoice[inv_title]']:checked").val();
    var company = inv_title==1 ? $.trim($("#company").find("input[name='Invoice[company]']").val()) : '';
    var inv_content = $("input[name='Invoice[inv_content]']:checked").val();
    if(!inv_content){
      jAlert('请选择发票内容');
      return false;
    }
    var inv_id=$("input[name='invoice']:checked").val();//发票id   
    if($("input[name='Invoice[inv_title]']:checked").val() == 1){		
      if(company == '' || company==$("input[name='Invoice[company]']").attr('def')){
        //jAlert('请填写单位名称');
        $("#company .fmError").removeClass('hide');
        return false;
      }else if(company.length>25){
        $("#company .fmError").removeClass('hide').html('单位名称最多为25个汉字');
        //jAlert('单位名称最多为25个汉字');
        return false;
      }else{
        $("#inv_type_two").find("input[name='Invoice[company]']").val(company);
      }

    }

  } else if($("input[name='Invoice[inv_type]']:checked").val() == 2){

    var inv_type = $("input[name='Invoice[inv_type]']:checked").val();
    var company = $.trim($("#inv_type_two").find("input[name='Invoice[company]']").val());
    var taxpayer_sn= $.trim($("input[name='Invoice[taxpayer_sn]']").val());
    var com_address= $.trim($("input[name='Invoice[com_address]']").val());
    var com_phone= $.trim($("input[name='Invoice[com_phone]']").val());
    var com_bank= $.trim($("input[name='Invoice[com_bank]']").val());
    var bank_account= $.trim($("input[name='Invoice[bank_account]']").val());
    var inv_content = $("input[name='mingxi']:checked").val();
    $("#company").find("input[name='Invoice[company]']").val(company);
    testtel = /^\d{7,}$/.test(com_phone);
    account = /^\d{12,}$/.test(bank_account);

    var inv_id=$("input[name='invoice2']:checked").val();//发票id

    if(company == '' || company ==$("#zz_company").attr('def')){
      $('#zz_company').parent().parent().find(".fmError").removeClass("hide");
      //jAlert('请填写单位名称');
      return false;
    }else if(company.length>25){
      $('#zz_company').parent().parent().find(".fmError").removeClass("hide").html('单位名称最多为25个汉字');
      //jAlert('单位名称最多为25个汉字');
      return false;
    }else if(taxpayer_sn == ''){
      $("input[name='Invoice[taxpayer_sn]']").parent().parent().find(".fmError").removeClass("hide");
      //jAlert('请填写纳税人识别号');
      return false;
    }else if(com_address == ''){
      $("input[name='Invoice[com_address]']").parent().parent().find(".fmError").removeClass("hide");
      //jAlert('请填写公司地址');
      return false;
    }else if(!testtel){
      $("input[name='Invoice[com_phone]']").parent().parent().find(".fmError").removeClass("hide").html('请您填写正确的注册电话');
      //jAlert('请填写正确的联系电话');
      return false;
    }else if(com_bank == ''){
      $("input[name='Invoice[com_bank]']").parent().parent().find(".fmError").removeClass("hide");
      //jAlert('请填写开户银行');
      return false;
    }else if(!account){
      $("input[name='Invoice[bank_account]']").parent().parent().find(".fmError").removeClass("hide").html('请您填写正确的银行卡号');
      //jAlert('请填写正确的银行卡号');
      return false;
    }

  }
  return flag;
}

//检测发票
function isInvoice(price){
  if(price == 0){
    if($("#Invoice_inv_type_1").attr('checked') == true || $("#Invoice_inv_type_2").attr('checked') == true)
    {
      jAlert('您使用优选卡或优惠券支付了全部金额，不能再为您开具发票，请知晓');
      $("input[name='invoice_button2']").click();
    }
  }
}

//选择配送日期与时间
function dateclose(){
  $(".datechange").hide();	 
}

function besttime(){
  if ($(".datechange").is(":visible")) {
    $(".datechange").hide();		     
  }else {
    $(".datechange").show();
  }
  return false;
}

$(function(){
  $(".datetbl .available").click(function(){
    $(".datetbl .available").removeClass("cur");
    $(this).addClass("cur");
    //jAlert($(this).attr("date_id"));
    var date = $(this).attr("date_id");
    var time = $(this).attr("time_id");
    $("#best_date1").val(date);
    $("#best_time1").val(time);
    var d = new Date(date * 1000);
    //var commonTime = unixTimestamp.toDateString();
    //var d = new Date(commonTime);
    var week = {        
      "0" : "\u65e5",        
  "1" : "\u4e00",        
  "2" : "\u4e8c",        
  "3" : "\u4e09",        
  "4" : "\u56db",        
  "5" : "\u4e94",        
  "6" : "\u516d"       
    };

    var customer_time = $("#shipping_time_"+time).attr("shipping_time_attr");
    var str = '';
    if($("#chaidanorder2 div").length>0){
      str = '';
    }
    //str +=""+(d.getMonth()+1)+"月"+d.getDate()+"日,星期"+week[d.getDay()]+","+customer_time+"送达"; 
	str +=""+(d.getMonth()+1)+"月"+d.getDate()+"日,星期"+week[d.getDay()]+","+customer_time; 
    //var str_show = "商品预计于"+d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日,星期"+week[d.getDay()]+","+customer_time+"送达"; 
	var str_show = d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日,星期"+week[d.getDay()]+","+customer_time; 
	var input_time_show = "预计"+d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日,星期"+week[d.getDay()]+","+customer_time+"送达"
    $(".tSelect").html(str);
    $(".customer_time_show").html(str_show);
	$(".input_time_show").val(input_time_show);
    $(".tSelect").show();
    $(".datechange").hide();

  });

  //拆单控制
  $("#together1").click(function(){
    $("#chaidanorder2").hide();
    //$(".dateShow").hide();
    $("#chaidanorder1").show();
    $("#ylorder2").addClass('hide');
    $("#ylorder1").removeClass('hide');
    $("#zhigong1").removeClass('hide');
    $(".merchant1").removeClass('hide');
    $("#payDataId .orderCurr .zhigong").html($("#zhigong1").html());
    $("#zhigong2").addClass('hide');
    $(".merchant2").addClass('hide');
    $("#best_date1").val('');
    dateclose();
    $(".dateTbody").find(".available").removeClass("cur");
  });

  $("#together2").click(function(){
    $("#ylorder1").addClass('hide');
    $("#ylorder2").removeClass('hide');
    $("#zhigong1").addClass('hide');
    $(".merchant1").addClass('hide');
    $("#zhigong2").removeClass('hide');
    $(".merchant2").removeClass('hide');
    $("#payDataId .orderCurr .zhigong").html($("#zhigong2").html());
    $("#chaidanorder1").hide();
    $("#chaidanorder2").show();
    $("#customer_time").html('选择配送日期与时间');
    $("#customer_time").show();
    //$(".dateShow").show();
    $(".dateSelect").show();
  });

});
//寄货信息
$(function(){
  //确认寄货地址
  $("#giverConfirm").click(function(){
    if($("input[name='nogiver']:checked").length==0){
      if($("input[name='giveraddr']:checked").length==0 && $("input[name='giveraddr2']:checked").length==0){
        jAlert("请选择寄件人信息或选择不需要寄件人信息");
        return false;
      }
    }
    var flag = true;
    var edit_addr_id = $("#edit_giver_addr_id").val();
    var addr_id = $("#giver_addr_id").val();
    var nogiver = $("input[name=nogiver]").attr('checked');
    if((edit_addr_id || addr_id=='') && nogiver===false){
      var flag = saveGiverAddr();
      if(!flag){
        return flag;
      }
    }
    var is_list = $("input[name='is_list']:checked").val();
    if(addr_id || nogiver){
      if(!nogiver){
        if(!check_giver_address()){
          return false;
        }
        var no_giver = 0;
      }else{
        var no_giver = 1;
      }
      //去服务端验证地址
      var web_url = '/ajax/confirmGiverAddr/';
      $.ajax({
        type: "POST",
        url: web_url,
        data: 'giverOrder[no_giver]='+no_giver+'&giverOrder[is_list]='+is_list+'&giverOrder[addr_id]='+addr_id+'&giverOrder[giver_name]='+$('#giver_consignee').val()+'&giverOrder[province]='+$('#giver_region_province').find('option:selected').val()+'&giverOrder[city]='+$('#giver_region_city').find('option:selected').val()+'&giverOrder[district]='+$('#giver_region_county').find('option:selected').val()+'&giverOrder[area]='+$('#giver_region_area').find('option:selected').val()+'&giverOrder[addr]='+$("#giver_address").val()+'&giverOrder[mobile]='+$('#giver_mobile').val(),
        dataType:"text",
        async: false,
        success: function(msg){
          var msg = eval('('+msg+')');				
          if(msg.status != 0) {
            jAlert(msg.info);
            flag = false;
            return flag;
          }
          if(msg.no_giver==1){
            $("input[name='need_giver']").val('');
            var tips = "<li>购物清单显示金额</li>";
            if(msg.is_list !=1){
              var tips = "<li>购物清单不显示金额</li>";
            }
            $("#giverAddrId .orderItem").find("ul").html(tips);
          }
          $("input[name='giveraddr2']").attr("checked",'');
          $("#addrGiverForm").hide();
        },
        error: function(msg){
          jAlert('网络异常,寄货地址保存失败.');
        }
      });
      if(!flag){
        return flag;
      }
    }

    var consignee = $.trim($("#giver_consignee").val());
    var city_id = $("#giver_region_city").val();
    var city = $("#giver_region_city").find("option[value="+city_id+"]").text();
    var area_id = $("#giver_region_county").val();
    var area = $("#giver_region_county").find("option[value="+area_id+"]").text();
    var town_id = '0';
    var town = '';
    if($("#giver_region_area").length > 0 && $('#giver_region_area').css('display') != 'none'){
      var town_id = $("#giver_region_area").val();
      var town = $("#giver_region_area").find("option[value="+town_id+"]").text();
    }
    var addr = $.trim($("#giver_address").val());	
    var mobile = $.trim($("#giver_mobile").val());
    var is_show = '不显示';
    if(is_list==1){
      is_show = '显示';
    }

    $(this).parent().parent().parent().parent().find(".addrAlter").show();
    $(this).parent().parent().parent().find(".orderCurr").show();
    $(this).parent().parent().parent().find(".orderShow").hide();
    if(!nogiver){
      var str = '<ul><li><span>寄件人信息：</span>'+consignee+' '+mobile+' '+city+' '+area+' '+town+' '+addr+'</li>';
      str += '<li><span>购物清单'+is_show+'金额</span></li></ul>';
      $(this).parent().parent().parent().find(".orderCurr").html(str);
      $("input[name='need_giver']").val('1');
    }

    $(this).parent().parent().parent().parent().removeClass("stepCurr");
    var tip = $("#card_service").val();
    var tiphelp = '&nbsp;&nbsp;&nbsp;&nbsp;<span class="gTip"></span><div class="gCont" style="display:none;"><div class="dmItem"><div class="dt">您可以设置寄货人信息和选择购物清单上是否显示订单金额</div></div><div class="spArror"><span class="aBg"></span><span class="aCt"></span></div></div></span>';
    $(this).parent().parent().parent().parent().find(".orderTitle").removeClass("cfmPrev").html(tip+'：'+tiphelp+' <span class="addrAlter">[修改]</span>');
    $(".gTip").hover(function(){$(".gCont").show()},function(){$(".gCont").hide();})
      confirmCheck();

  });

  $("#giverConfirm2").click(function(){
    var web_url = '/ajax/confirm2GiverAddr/';
    $.ajax({
      type: "POST",
      url: web_url,
      data: '',
      dataType:"text",
      async: false,
      success: function(msg){
      },
      error: function(msg){
        jAlert('网络异常,寄货地址保存失败.');
      }
    });

    $(this).parent().parent().parent().find(".addrAlter").show();
    $(this).parent().parent().parent().find(".orderCurr").show();
    $(this).parent().parent().parent().find(".orderShow").hide();
    var str = '<ul><li>暂不需要设置寄货信息</li></ul>';
    $(this).parent().parent().parent().find(".orderCurr").html(str);
    $(this).parent().parent().parent().parent().removeClass("stepCurr");
    var tip = $("#card_service").val();
    var tiphelp = '&nbsp;&nbsp;&nbsp;&nbsp;<span class="gTip"></span><div class="gCont" style="display:none;"><div class="dmItem"><div class="dt">您可以设置寄货人信息和选择购物清单上是否显示订单金额</div></div><div class="spArror"><span class="aBg"></span><span class="aCt"></span></div></div></span>';
    $(this).parent().parent().parent().parent().find(".orderTitle").removeClass("cfmPrev").html(tip +'：'+ tiphelp + ' <span class="addrAlter">[修改]</span>');
    $(".gTip").hover(function(){$(".gCont").show()},function(){$(".gCont").hide();})
      $("input[name='is_list'][value='1']").change().click();
    $("input[name='need_giver']").val('2');
    confirmCheck();

  });

});

function check_giver_address(){
  testmobile = /^1\d{10}$/.test($.trim($('#giver_mobile').val()));		
  var consignee = $.trim($("#giver_consignee").val());
  var city_id = $("#giver_region_city").val();
  var area_id = $("#giver_region_county").val();
  var town_id = '0';
  if($("#giver_region_area").length > 0 && $('#giver_region_area').css('display') != 'none'){
    var town_id = $("#giver_region_area").val();
  }
  var addr = $.trim($("#giver_address").val());	
  var mobile = $.trim($("#giver_mobile").val());

  if(consignee=='' || consignee==$('#giver_consignee').attr("def")){
    $('#giver_consignee').parent().parent().find(".fmError").removeClass("hide");
    //jAlert('收货人姓名不能为空');
    return false;	
  }else if(city_id==0){
    $('#giver_region_province').parent().parent().parent().find(".fmError").removeClass("hide");
    //jAlert('请选择收货人城市');
    return false;	
  }else if(area_id==0){
    $('#giver_region_province').parent().parent().parent().find(".fmError").removeClass("hide");
    //jAlert('请选择收货人区县');
    return false;	
  }else if($("#giver_region_area").length > 0 && $('#giver_region_area').css('display') != 'none' && town_id==0){
    $('#giver_region_province').parent().parent().parent().find(".fmError").removeClass("hide");
    //jAlert('请选择收人货街道/镇');
    return false;	
  }else if(addr.length<5 || addr.length>40 || !isNaN(addr) || addr==$('#address').attr("def")){  
    $('#giver_address').parent().parent().find(".fmError").removeClass("hide");
    //jAlert('请填写收货人详细地址，限5-40个字，不能全部为数字');
    return false;
  }else if(mobile==''){
    $('#giver_mobile').parent().parent().find(".fmError").removeClass("hide");
    //jAlert('请填写收货人联系电话');
    return false;	
  }

  if($.trim($('#giver_mobile').val()) !=''){
    if(!testmobile || $.trim($('#giver_mobile').val()) == $('#giver_mobile').attr("def")){
      $('#giver_mobile').parent().parent().find(".fmError").removeClass("hide");
      //jAlert('请填写正确的手机号');
      return false;
    }
  }	


  if(addr.indexOf("&")>0 || addr.indexOf("#")>0){
    jAlert('详细寄货人地址不能包含&#等特殊字符');
    return false;
  }
  return true;

}

//收货地址分页方法
function arrGiverComm(page){
  page += 1;
  $.get("/ajax/giveraddrdata/page/"+page,null,function(data){
    $('#giveraddresslist .giverorderAddr').html(data);
    //var t = $(".giverorderAddr .addrs:gt(4):not(:last)");
    //show_hide(t,$(".giverorderAddr"));

    if ($(".giverAddr .addrItem").length > 5){
      var tGiver = $(".giverAddr .addrItem:gt(4)");
      tGiver.addClass("hide");
      $(".giverorderAddr").find(".addrShow").html('<span class="open"><b></b>更多</span>').removeClass("hide");
      show_hide(tGiver,$(".giverorderAddr"));

    }

    setCurr();
    hoverCurr('giveraddresslist');
  },"html");


}
//删除收货地址
function delGiverAddr(addr_id){
  jConfirm('您确定要删除该地址吗?', '消息确认', function(t) {
    if(t){
      $.get("/ajax/delGiverAddr/addr_id/"+addr_id,null,function(data){
        if(data==1){
          jAlert("删除成功");
          arrGiverComm(0);
          setCurr();
          hoverCurr('giveraddresslist');
        }
      },"html");
    }
  });	
}
//修改收货地址
function editGiverAddr(addr_id){
  $("input[name='giveraddr']:[value="+addr_id+"]").change();
  $("#addrGiverForm").show();
  $("#edit_giver_addr_id").val(addr_id);
  ///$("#addrGiverForm input").each(function(){$(this).val($(this).attr("def"))});
  $("#addrGiverForm input").removeClass("inputTips");
  $("#addrGiverForm select").removeClass("inputTips");
  //$("#addrGiverForm select").each(function(){$(this).removeClass("inputTips");});
}

//选择市
$("#giver_region_city").live('change',function(){
  if($(this).find("option:selected").val() == 0){
    $("#giver_shi").html('');
  } else {
    $("#giver_shi").html($(this).find("option:selected").html());
  }
});
//选择县
$("#giver_region_county").live('change',function(){
  if($(this).find("option:selected").val()==0){
    $("#giver_xian").html('');
  } else {
    $("#giver_xian").html($(this).find("option:selected").html());
  }
});
//选择区域
$("#giver_region_area").live('change',function(){
  if($(this).find("option:selected").val()==0){
    $("#giver_areasp").html('');
  } else {
    $("#giver_areasp").html($(this).find("option:selected").html());
  }
});

//选择地址
$("input[name=giveraddr]").live('change',function(){
  $("input[name=giveraddr2]").attr("checked",'');
  $("input[name=nogiver]").attr("checked",'');
  var addr_id = $(this).val();
  $("#addrGiverForm").hide();
  //$("#addr_id").val(addr_id);
  $("#edit_giver_addr_id").val('');

  var web_url = "/order/selectGiver";
  $.post(web_url,{addr_id:addr_id},function(msg){
    var msg = eval('('+msg+')');
    if(msg.tel == '-' || msg.tel == '--'){
      msg.tel = '';
    }		
    if(msg.succes==1){		
      $("#giver_addr_id").val(msg.addr_id);
      $("#giver_consignee").val(msg.giver_name);
      $("#giver_address").val(msg.addr);
      $("#giver_mobile").val(msg.mobile);
      $("#giver_region_county").val();

      $("#giver_region_province option[value="+msg.province+"]").attr('selected',true);
      $("#giver_region_province").change();
      $("#giver_region_city option[value="+msg.city+"]").attr('selected',true);
      $("#giver_region_city").change();
      $("#giver_region_county option[value="+msg.district+"]").attr('selected',true);
      $("#giver_region_county").change();
      $("#giver_region_area option[value="+msg.area+"]").attr('selected',true);
      $("#giver_region_area").change();
      $("#giver_xian").html($("#giver_region_county").find("option:selected").text());
      //$("#giver_region_area").html(msg.option);
      $("#giver_areasp").html($("#giver_region_area").find("option:selected").text());

      //location.href="/order/index/";
      //top.location.reload();

    } else {
      jAlert(msg.data);
    }
  });
});

//保存收货地址
function saveGiverAddr(){
  clearTips();
  var addr_id = $("#giver_addr_id").val();
  var is_list = $("input[name='is_list']:checked").val();
  var flag = true;
  if(!check_giver_address()){
    return false;
  }
  var web_url = '/ajax/addGiverAddr/';
  $.ajax({
    type: "POST",
    url: web_url,
    data: 'giverOrder[is_list]='+is_list+'&giverOrder[addr_id]='+addr_id+'&giverOrder[giver_name]='+$('#giver_consignee').val()+'&giverOrder[province]='+$('#giver_region_province').find('option:selected').val()+'&giverOrder[city]='+$('#giver_region_city').find('option:selected').val()+'&giverOrder[district]='+$('#giver_region_county').find('option:selected').val()+'&giverOrder[area]='+$('#giver_region_area').find('option:selected').val()+'&giverOrder[addr]='+$("#giver_address").val()+'&giverOrder[mobile]='+$('#giver_mobile').val()+'&giverOrder[add_from]=1',
    dataType:"text",
    async: false,
    success: function(msg){
      var msg = eval('('+msg+')');				
      if(msg.status == 0) {
        arrGiverComm(0);
        if(msg.addr_id){
          $("#giver_addr_id").val(msg.addr_id);
        }
      } else {
        jAlert(msg.info);
        flag = false;
        return flag;
      }
      $("input[name='nogiver']").attr("checked",'');
      $("input[name='giveraddr2']").attr("checked",'');
      $("#addrGiverForm").hide();
    },
    error: function(msg){
      jAlert('网络异常,寄货地址保存失败.');
    }
  });
  return flag;
}
//不需要填写寄件人
function noGiverAddr(){
  $("#giver_addr_id").val('');
  $("#addrGiverForm").hide();
  $("input[name=giveraddr]").attr("checked",'');	
  $("input[name=giveraddr2]").attr("checked",'');
  if(!$("#edit_giver_addr_id").val()){
    $("#addrGiverForm input").addClass("inputTips");
    //$("#addrGiverForm select").addClass("inputTips");
    $("#addrGiverForm input").each(function(){$(this).val($(this).attr("def"))});
  }
  $("#addrGiverForm select").each(function(){$(this).val('')});
}
//使用新寄货人地址
function useNewGiverAddr(){
  $("#giver_addr_id").val('');
  $("#addrGiverForm").show();
  $("input[name=giveraddr]").attr("checked",'');	
  $("input[name=nogiver]").attr("checked",'');
  if(!$("#edit_giver_addr_id").val()){
    $("#addrGiverForm input").addClass("inputTips");
    $("#addrGiverForm select").addClass("inputTips");
    $("#addrGiverForm input").each(function(){$(this).val($(this).attr("def"))});
  }
  $("#addrGiverForm select").each(function(){$(this).val('')});
  $("#giver_shi").html('');
  $("#giver_xian").html('');
  $("#giver_areasp").html('');
}

//公共函数
function setDisplay(name, none_name) {
  $("#" + name).css({
    "display": "block"
  });
  $("#" + none_name).css({
    "display": "none"
  });
}

//优选单优惠
function addDM(){
  //jAlert(best_time);
  var web_url = "/order/searchDM";
  var dm = $.trim($("#dm0").val());
  var dm_tips = $("#dm-tips");
  dm_tips.html('');
  if(dm.length==6){
    //	dm += "000000";
  }
  var is_manjian = $("#is_manjian").html();
  if(dm == ''){
    dm_tips.html('请输入优选单编码');
    return;
  }
  var dmcodes = $("#dms").html();
  var dm_head = dm.substring(0,6);
  if(dmcodes.indexOf(dm_head)>=0){
    dm_tips.html('您已使用过此优选单，不用重复使用');
    return;
  }
  if(dmcodes){
    dm_tips.html('您已使用过优选单，无需重复使用');
    $("#dm0").val('');
    return;
  }
  //var dms = dmcodes + dm;
  var dms = dmcodes;
  var together = 2;
  if($("input[name=together]").attr('checked')==true){
    together = 1;	
  }
  if($("#together1").val()==undefined){
    together = 0;	
  }

  $.post(web_url,{dm:dm,dmcodes:dms,together:together},function(msg){
    var json = eval('('+msg+')');
    if(msg==1){
      dm_tips.html('您输入的优选单不存在');		
      return;
    }
    if(msg==2){
      dm_tips.html('此优选单已使用过');
      return;
    }
    if(msg==3){
      dm_tips.html('优选单已过期');
      return;
    }
    if(msg==4){
      dm_tips.html('优选单已使用!!');
      return;
    }
    if(msg==5){
      dm_tips.html('您输入的优选单不存在');
      $("#dm0").val('');
      return;
    }
    if(msg==6){
      dm_tips.html('订单金额不满足优惠券使用条件');	
      return;
    }

    if(json.dm_price==0){
      dm_tips.html('用户您好，您购买优选单的促销商品已经是最低价，将不再享有折扣优惠');	
    }
    initialPayments();
    $("#dm_p").html(json.dm_price);

    $("#dm_redue_money").html(json.reducemoney-json.dm_price);

    $("#yingProce").html(json.total);

    if(json.is_manjian == 'usertype'){
      if(json.discount){
        //$("#discount").html("&nbsp;&nbsp;&nbsp;-已减：<strong>"+json.discount+"</strong>元");
      }else{
        $("#discount").hide();
      }
    }

    if(json.is_manjian != 'usertype'){
      if(json.discount){
        $("#discount").html(json.discount);
        $("#discount").parent().parent().show();
      }else{
        $("#discount").parent().parent().hide();
      }
    }
    if(json.shipping_fee){
      $("#shopping_price").html(json.shipping_fee);
      //$(".shipPrice span").html(json.shipping_fee+"元");
      $("#shopping_price").parent().parent().show();
    }else{
      //$(".shipPrice span").html("免运费");
      $("#shopping_price").parent().parent().hide();
    }
    //重新计算优选卡可用余额
    if ($("#jcard_price").length == 0) {
      if (json.jcard_price > 0) {
        $('#card_price_append').html('，商家商品不可使用优选卡支付，本次可使用<span id="jcard_price" class="red"></span>元');
        $("input[name=card_price_box]").attr("disabled", "");
        $("#jcard_price_max").html(json.jcard_price);
        $("#jcard_price_bak").html(json.jcard_price);
      }
    }
    var jcard_price = $("#jcard_price").html();
    if (jcard_price > json.jcard_price) {
      $("#jcard_price").html(json.jcard_price);
      $("#jcard_price_max").html(json.jcard_price);
      $("#jcard_price_bak").html(json.jcard_price);
    }

    var sf_points_price = yuan2fen($("#sf_points_price").html());
    var user_points_price = yuan2fen($("#user_points_price").html());
    var card_price = yuan2fen($("#card_price").html());
    var coupon = yuan2fen($("#coupon").html());
    var shopping_price = yuan2fen($("#shopping_price").html());
    if(sf_points_price || user_points_price || card_price || coupon){
      var t= fen2yuan(sf_points_price + user_points_price + card_price + coupon);
      $("#countPrice").html(json.count_price-t);
      //$("#countPrice").html(yuan2fen(fen2yuan(json.count_price-t)));
    }else{
      $("#countPrice").html(json.count_price);
    }
    //$("#countPrice").html(json.count_price-json.dm_price);
    countPirce();	

    /*if(balance>(yuan2fen(json.count_price)-card_price-coupon) && balance>0){
      $("#balance").html(fen2yuan(yuan2fen(json.count_price)-card_price-coupon));
    }*/

    //$("#producthtml").html(json.info);

    if($.trim(json.order_coupon)!=''){
      $("#ordercoupon").html('您已获得:'+json.order_coupon);
      $("#ordercoupon1").show();
      $("#ordercoupon").show();
    }
    //$("#prodcut_html").hide();
    //$("#prodcut_html1").show();

    //优惠券回显 123456789　1598746464　564646546546
    $("#dmcode").show();

    if(dmcodes != ''){
      dmcodes += "　";
    }
    $("#dms").html(dmcodes + dm);
    $("#dm").val(dm);
    $("#dmcodes").val(dmcodes + dm);
    $("#dm0").val('');
    $("#dm_p").parent().parent().show();
  });
}

function initialPayments(){
  if ($('.couponCL').length) {
    $('.couponCL').trigger('click');
  }
  if (true == $('input=[name=card_price_box]').attr('checked')) {
    $('input=[name=card_price_box]').click().change();
  }
  /*if (true == $('input=[name=user_balance_box]').attr('checked')) {
    $('input=[name=user_balance_box]').click().change();
  }*/
}

$(function(){
  //使用优惠券
  $("#getcoupon").click(function(){
    if($(this).next(".sfbtn_in").is(":visible")){

    }else{
      if($("#coupon_table1 input[name='user_coupon']:checked").length==0){
        //	getCoupon();
      }
    }
  });
  //使用优选单 优惠券  优选卡
  $(".sfbtn").each(function(){
    $(this).click(function(){
      if($(this).next(".sfbtn_in").is(":visible")){
        $(this).next(".sfbtn_in").hide();
        $(this).find("b").removeClass("close").addClass("open");
      }else{
        $(this).next(".sfbtn_in").show();
        $(this).find("b").removeClass("open").addClass("close");
      }
    });
  });
  $(".dmTip").hover(function(){$(".dmCont").show()},function(){$(".dmCont").hide();})
    $(".dmCont").hover(function(){$(".dmCont").show();},function(){$(".dmCont").hide();})
    $(".gTip").hover(function(){$(".gCont").show()},function(){$(".gCont").hide();})
    $(".gCont").hover(function(){$(".gCont").show();},function(){$(".gCont").hide();})
    $(".yeTip").hover(function(){
        $(".commPage").toggle();
    })
})
//切换可用与不可用优惠券
function coupon_tab(n){
  if(n==1){
    $("#coupon_div1").show(); 
    $("#coupon_tab1").addClass("on");
    $("#coupon_div2").hide(); 
    $("#coupon_tab2").removeClass("on");		
  }else{
    $("#coupon_div2").show(); 
    $("#coupon_tab2").addClass("on");
    $("#coupon_div1").hide(); 
    $("#coupon_tab1").removeClass("on");	
  }
  if($("#coupon_table1 input").length <4){
    $("#coupon_div1").height(""); 
  }
  if($("#coupon_table2 input").length <4){
    $("#coupon_div2").height(""); 
  }

}
//获取优惠券列表
function getCoupon(){
  var web_url = '/order/getCoupon/';
  var dm = $("#dm").val();
  var dmcodes = $("#dmcodes").val();
  $.ajax({
    type: "POST",
    url: web_url,
    data: 'dm='+dm+'&dmcodes='+dmcodes+'&v='+Math.random(),
    dataType:"text",
    async: false,
    success: function(data){
      var msg = eval('('+data+')');
      //jAlert(data);
      $("#mycoupons").html(msg);		
    }
  });
}

//优惠券使用详情查看
function brandshow(obj){
  This=$(obj);
  if(This.next().is(":visible")){
    This.next().hide();
  }else{
    $(".brandshow").hide();
    This.next().show(); 
    var coupon_id = This.attr('couponid');
    var id = This.attr('cp_id');
    getCouponDesc(coupon_id,id);
  }
}
function closeBrand(obj){
  $(".brandshow").hide();   
}
function getCouponDesc(coupon_id,id){
  var web_url = '/order/getCouponDesc/';
  $.ajax({
    type: "POST",
    url: web_url,
    data: 'coupon_id='+coupon_id+'&v='+Math.random(),
    dataType:"text",
    async: false,
    success: function(data){
      var msg = eval('('+data+')');
      $("#coupondesc"+id).html(msg);		
    }
  });
}

//取消使用优惠券
function cancelCoupon(value){
  var check = $("input[value='"+value+"']:checked");
  if(check){
    $("input[value='"+value+"']").attr("checked","");
    var coupon = yuan2fen($("#coupon").html());
    var total = yuan2fen($("#countPrice").html())+coupon;
    $("#coupon").html("0").parent().parent().hide();
    $("#coupon_used").html("");		
    $("#countPrice").html(fen2yuan(total));
    $("#jcard_price").html($("#jcard_price_bak").html());
    countPirce();
  }

}

//选中优惠劵
function couponChange(obj){		
  This = $(obj);
  var order_min   = yuan2fen(This.attr('order_min'));
  var order_max   = yuan2fen(This.attr('order_max'));
  var yingProce   = yuan2fen($("#yingProce").text());
  var user_coupon = This.attr('price');
  var coupon_type = This.attr('coupon_type');
  var coupon_sn = This.val();
  var cou_sn = $("input[name='user_coupon']:checked").val();//记录上一次使用的优惠券号
  $('#coupon_msg').hide();
  if(order_min <= yingProce){
    //if(((order_min <= yingProce) && (yingProce <= order_max)) || ((order_min <= yingProce) && (order_max == -1))){
    var shipping_money = $("#shopping_price").html();
    var coupon_money = $("#coupon").html();
	var sf_points_money = $("#sf_points_price").html();
	var user_points_money = $("#user_points_price").html();
    var card_money = $("#card_price").html();
    var dm = $("#dm").val();
    var dmcodes = $("#dmcodes").val();
    var tips = "";
    $.ajax({
      type: "POST",
      url: '/order/getCount/',
      data: 'coupon_sn='+coupon_sn+'&coupon_type='+coupon_type+'&user_coupon='+user_coupon+'&coupon_money='+coupon_money+'&shipping_money='+shipping_money+'&sf_points_money='+sf_points_money+'&user_points_money='+user_points_money+'&card_money='+card_money+'&dm='+dm+'&dmcodes='+dmcodes,
      dataType:"text",
      async: false,
      success: function(msg){

        var json = eval('('+msg+')');
        //jAlert(json.coupon);
        if(json.coupon.status>0){				
          //jAlert(json.coupon.tips); 直接在这提示会导致ie下出现两次请求
          tips = json.coupon.tips;
          This.attr("checked","");
          coupon_tab(2);	
          This.parent().parent().find("td:last").removeClass("hide");	
          var coupon_tr = "<tr>"+This.parent().parent().html()+"</tr>";
          $(coupon_tr).appendTo("#coupon_table2",null);
          if($("#nocoupon2").html()){
            $("#nocoupon2").remove();
          }
          This.parent().parent().remove();
          $("#coupon_table2").find("tr:last").find("td:first").html('<b class="fr couponDel"></b>');				
        }else{		
          This.attr("checked","checked");
          coupon_tab(1);
          var coupon_used_info = '<span class="couponUsed">您已经使用了优惠券'+fen2yuan(json.coupon.value)+'元</span>　　<a href="javascript:void(0);" onclick="cancelCoupon(\''+json.coupon.coupon_sn+'\');" class="couponCL">取消使用</a>';
          $("#coupon_used").html(coupon_used_info);
          if($("#nocoupon1").html()){
            $("#nocoupon1").remove();	
          }
          var card_remain = fen2yuan(yuan2fen($('#jcard_price_total').html()));//fen2yuan(json.coupon.count - json.coupon.coupon_value - json.coupon.couponCardnegativemoney);
          var jcard_price = parseFloat($('#jcard_price_max').html());
          if (card_remain < 0 ) {
            card_remain = 0;
          }
          if (json.coupon.couponCardnegativemoney) {
            if (jcard_price > (fen2yuan(json.coupon.coupon_value - json.coupon.couponCardnegativemoney))) {
              jcard_price = yuan2fen(jcard_price) - (json.coupon.coupon_value - json.coupon.couponCardnegativemoney);
              jcard_price = fen2yuan(jcard_price);
            } else {
              jcard_price = 0;
            }
          } else {
            if (jcard_price > fen2yuan(json.coupon.coupon_value)) {
              jcard_price = yuan2fen(jcard_price) - json.coupon.coupon_value;
              jcard_price = fen2yuan(jcard_price);
            } else {
              jcard_price = 0;
            }
          }
          if (card_remain > jcard_price) {
            $('#jcard_price').html(jcard_price);
          } else {
            $('#jcard_price').html(card_remain);
          }
          if (card_remain == 0 && !$(".payment-new0").hasClass("hide")) {
            $("input[name=pay_pwd]").val('');
            $(".payment-new0").addClass("hide");
            $("input[name=card_price_box]").attr('checked','');
          }
          //jAlert('发票开具的金额不包括优惠券支付部分，请知晓');
        }
        $("#priceitems").html(json.info);
        var total_price = json.count_price > 0 ? json.count_price :0;
        $("#countPrice").html(total_price);
        $("#allPrice").html(total_price);
        if($.trim(json.fav)!=''){
          $("#ordercoupon1").show();
          $("#ordercoupon").html("您已获得:"+json.fav);
        }else{
          $("#ordercoupon1").hide();
        }
        countPirce();

      },
      error: function(msg){
        //	jAlert('网络错误,支付方式保存失败.');
      }
    });	

    if(tips){
      jAlert(tips);
    }

  } else {
    var msg = '您的优惠券已经绑定到您的账户中，消费额满N'+fen2yuan(order_min)+'元时可以使用';
    This.attr("checked","");
    coupon_tab(2);

    This.parent().parent().find("td:last").removeClass("hide");	
    var coupon_tr = "<tr>"+This.parent().parent().html()+"</tr>";
    $(coupon_tr).appendTo("#coupon_table2",null);
    if($("#nocoupon2").html()){
      $("#nocoupon2").remove();
    }
    This.parent().parent().remove();
    $("#coupon_table2").find("tr:last").find("td:first").html('<b class="fr couponDel"></b>');	

    $("#coupon").html('0');
    countPirce();
    //$("#countPrice").html(fen2yuan(total));
    //jAlert(msg);
    return false;
  }
}

  //用于优惠劵相关操作
  var COUPON = {};

  //设置高度
  //paramId 对象ID
  COUPON.height = function (){
    var obj1 = $("#coupon_div1");
    var length1 = obj1.find('tr').length;
    if(length1 > 4){
      obj1.css({"height":"133px","overflow-y":"auto"});
    } else {
      obj1.css({"overflow-y":"visible"});
    }

    var obj2 = $("#coupon_div2");
    var length2 = obj2.find('tr').length;
    if(length2 > 4){
      obj2.css({"height":"133px","overflow-y":"auto"});
    } else {
      obj2.css({"overflow-y":"visible"});
    }
  };

  //失去焦点时触发检测优惠劵格式
  //paramId 对象ID
  COUPON.find = function (paramId){
    var obj = $("#"+paramId);
    var re = /\w{4}$/;
    if(!re.test(obj.val()) && obj.val().length > 0)
    {
      $('#coupon_msg').html('<span class="onError">请输入正确的优惠券编码</span>');
      $('#coupon_msg').show();
    } else {
      $('#coupon_msg').html('');
      $('#coupon_msg').hide();
    }
  };
  //粘贴过来时自动分成四个填写进去
  function autoInputCoupon(coupon_str){
    var length = coupon_str.length;
    if(length>4){	
      var re = /\w{4,5}-\w{4,5}-\w{4,5}-\w{4,5}$/;
      if(re.test(coupon_str)){
        var str= new Array(); 
        str = coupon_str.split("-");
        $("#coupon1").val(str[0]);
        $("#coupon2").val(str[1]);
        $("#coupon3").val(str[2]);
        $("#coupon4").val(str[3]);
      }else{
        $('#coupon_msg').html('<span class="onError">请输入正确的优惠券编码</span>');
        $('#coupon_msg').show();	
        return false;
      }
    }else if(length==4){
      if($("#coupon1").val().length<4){
        $("#coupon1").focus();
      }else if($("#coupon2").val().length<4){
        $("#coupon2").focus();
      }else if($("#coupon3").val().length<4){
        $("#coupon3").focus();
      }else if($("#coupon4").val().length<4){
        $("#coupon4").focus();
      }else{
        $("#coupon_code").focus();
      }	
    }

  }

  //检测验证码
  COUPON.code = function (){
    var url = '/ajax/code/';
    var coupon_code = $("#coupon_code").val();
    if(coupon_code.length > 0){
      $.post(url, {auth_code:coupon_code}, function(data){
        if(data==1){
          var okMsg = "<span class='onSuccess'><font color='blue'>输入正确.</font></span>";
          $('#coupon_msg').html(okMsg);
          $('#coupon_msg').show();
        }else{
          var errorMsg = "<span class='onError'>请输入正确的验证码</span>";
          $('#coupon_msg').html(errorMsg);
          $('#coupon_msg').show();
        }
      });
    }
  };

  function showCouponCodeImg() {
    if (SF_COUPON_ERR_NUM >= 3) {
      $(".coupon-code-img").show();
    }
  }

  //获取优惠劵信息
  COUPON.save = function (){
    var url = "/order/searchCoupon";
    var coupon_sn = $.trim($("#coupon1").val())+"-"+$.trim($("#coupon2").val())+"-"+$.trim($("#coupon3").val())+"-"+$.trim($("#coupon4").val());
    var coupon_code = $("#coupon_code").val();
    $('#coupon_msg').show();
    if($.trim($("#coupon1").val()).length!=4){
      var errorMsg = "<span class='onError'>请输入正确的优惠券编码</span>";
      $('#coupon_msg').html(errorMsg);
      $("#coupon1").focus();
      SF_COUPON_ERR_NUM++;
      showCouponCodeImg();
      return false;
    }
    if($.trim($("#coupon2").val()).length!=4){
      var errorMsg = "<span class='onError'>请输入正确的优惠券编码</span>";
      $('#coupon_msg').html(errorMsg);
      $("#coupon2").focus();
      SF_COUPON_ERR_NUM++;
      showCouponCodeImg();
      return false;
    }
    if($.trim($("#coupon3").val()).length!=4){
      var errorMsg = "<span class='onError'>请输入正确的优惠券编码</span>";
      $('#coupon_msg').html(errorMsg);
      $("#coupon3").focus();
      SF_COUPON_ERR_NUM++;
      showCouponCodeImg();
      return false;
    }
    if($.trim($("#coupon4").val()).length!=4){
      var errorMsg = "<span class='onError'>请输入正确的优惠券编码</span>";
      $('#coupon_msg').html(errorMsg);
      $("#coupon4").focus();
      SF_COUPON_ERR_NUM++;
      showCouponCodeImg();
      return false;
    }
    var code_url = '/ajax/code/';
    var coupon_code = $("#coupon_code").val();
    var re = false;
    if (SF_COUPON_ERR_NUM >= 3) {
      if($.trim(coupon_code) == ''){
        var errorMsg = "<span class='onError'>请输入正确的验证码</span>";
        $('#coupon_msg').html(errorMsg);
        SF_COUPON_ERR_NUM++;
        return false;
      }
      $.ajax({
        type:'POST',
        url:code_url,
        data:{auth_code: coupon_code},
        async:false,//设置同步
        success:function(da){
          //jAlert(da);
          if(da !=1){	
            re = true;
          }

        }
      });

      if(re){
        var errorMsg = "<span class='onError'>请输入正确的验证码</span>";
        $('#coupon_msg').html(errorMsg);
        return false;
      }
    }
    $("#coupon1").val('');
    $("#coupon2").val('');
    $("#coupon3").val('');
    $("#coupon4").val('');
    $("#coupon_code").val('');
    $("#coupon_code_img").click();
    if($("#coupon_table1 input").length>0){
      var is_cou = false;
      $("#coupon_table1 input").each(function(){
        if($(this).val()==coupon_sn){
          is_cou = true;
          couponChange(this);
          return;	
        }
      });
      if(is_cou == true){
        //jAlert('此券已存在!!');
        return;
      }
    }

    if($("#coupon_table2 input").length>0){
      var is_cou = false;
      $("#coupon_table2 input").each(function(){
        if($(this).val()==coupon_sn){
          is_cou = true;
          couponChange(this);
          return;	
        }
      });
      if(is_cou == true){
        //jAlert('此券已存在!!');
        return;
      }
    }
    $.ajax({
      type:'POST',
    url:url,
    data:{coupon: coupon_sn},
    async:false,//设置同步
    success:function(msg){
      try {
        if(msg==1){
          throw new Error('优惠券不存在');
        }
        if(msg==2){
          throw new Error('还未到优惠券的使用时间，请后续再使用');
        }
        if(msg==3){
          throw new Error('优惠券已过期!');
        }
        if(msg==4){
          throw new Error('优惠券已使用!');
        }
        if(msg==5){
          throw new Error('很抱歉，您的会员等级暂时无法享受该优惠');
        }
        if(msg==6){
          //throw new Error('订单金额不满足优惠券使用条件!');
        }
        var json = eval('('+msg+')');
        if (json.type==7) {
          throw new Error(json.msg);
        }

        var ra = '<input type="radio" onchange="couponChange(this)" coupon_type='+json.coupon_type+' order_min='+json.order_min+' order_max='+json.order_max+' price="'+json.coupon_value+'" name="user_coupon" value="'+json.coupon_sn+'">';
        var tr = '<tr>';
        tr+= '<td width="9%" style="text-align:right;">'+ra+'</td>';
        tr+= '<td width="42%">'+fen2yuan(json.coupon_value)+'元  ('+json.use_start_time+'至'+json.use_end_time+')</td>';
        tr+= '<td width="31%">最低消费额：'+json.order_min+'元</td>';
        tr+= '<td width="18%" class="hide"><a onclick="brandshow(this);" couponid="'+json.coupon_id+'" cp_id="'+json.coupon_id+'_'+json.id+'" class="linkshow" href="javascript:void(0);">查看详情&gt;&gt;</a><div style="display:none;margin-left:-240px;width:330px;" class="brandshow"><a onclick="closeBrand(this);" class="bClose">×</a><dl class="brandlist" id="coupondesc'+json.coupon_id+'_'+json.id+'"></dl></div></td>';
        tr+= '</tr>';
        $(tr).appendTo("#coupon_table1",null);
        //检测优惠劵是否需要滚动条
        COUPON.height();
        //清空内容
        //$("#coupon_sn").val('');
        $("#coupon1").val('');
        $("#coupon2").val('');
        $("#coupon3").val('');
        $("#coupon4").val('');
        $("#coupon_code").val('');
        $("#coupon_code_img").attr('src' , $("#coupon_code_img").attr('src')+'?new=' + Math.random());
        // couponChange($(tr).find("input"));
        // $("#coupon_table").find("input:last").click();
        $("#coupon_table1").find("input:last").change();
        //$("#coupon_table").find("input:last").attr("checked",true);
        $('#coupon_msg').hide();
      } catch (e) {
        var errorMsg = "<span class='onError'>"+e.message+"</span>";
        $('#coupon_msg').html(errorMsg);
        SF_COUPON_ERR_NUM++;
        showCouponCodeImg();
        return false;
      }
    }
    });
  };

  //元转换成分
  function yuan2fen(num){
    var num = new Number(num * 100);
    num = parseInt(num.toFixed(2));
    return num;
  }

  //分转换成元
  function fen2yuan(num){
    return num = parseFloat(num / 100);
  }
  $(function(){  
    //选择使用优选卡支付
    $("input[name=card_price_box]").change(function(){

      if($("input[name=card_price_box]").attr('checked')==true){
      //中广核白名单  
      $.ajax({
        type: "POST",
        url: '/order/checkWhitelistByOrder/',
        data: {'checkWhitelist':checkWhitelist},
        dataType:"json",
        async: false,
        success: function(msg){
          if(msg.code==0){
            //$(this).unbind("change");
            $("input[name=card_price_box]").attr('checked','');
            jAlert(msg.data);
            return false;
          }
        }
      });
      }

      if($("#jcard_price").html()==0){
        $("input[name=card_price_box]").attr('checked','');
        return false;
      }
      if($("#jcard_price").html()>0 && $("#jcard_price").parent().find(".new-color").length>0){
        $("input[name=card_price_box]").attr('checked','');
        jAlert('为了保障您的账户财产安全，请先开启支付密码再使用优选卡');
        return false;
      }
      if($("input[name=card_price_box]").attr('checked')==true){
        //如果优选卡的钱够全额支付，需要取消余额支付和取消开发票
        var countPrice = $("#countPrice").html();
        var jcard_price = yuan2fen($("#jcard_price").html());
        var sf_points_price = yuan2fen($("#sf_points_price").html());
        var user_points_price = yuan2fen($("#user_points_price").html());
        var points_price = sf_points_price+user_points_price;
        if(countPrice==0 && jcard_price>=points_price){
          $("input[name=points_price_box]").attr('checked','');
          isInvoice(0);
        }else if(jcard_price>0){
          jAlert('发票开具的金额不包括优选卡支付部分，请知晓');
        }	

      }
      countPirce();
    });

    //选择积分支付
    $("input[name=points_price_box]").change(function(){
	  checkPriceBox();
    });

	$('#sf_points_money').focus(function(){
	  $(this).css("color","#000");
	  $(this).val('');
	})
	$('#user_points_money').focus(function(){
	  $(this).css("color","#000");
	  $(this).val('');
	})
	var checkPointMoney = /^\d+(\.\d{2})?$/;	
	//验证输入的速运积分抵扣的金额
	$('#sf_points_money').blur(function(){
		$(this).css("color","#969696");
		var points_money_check = yuan2fen($("#points_money_check").html()); 
		var user_points_money = yuan2fen($("#user_points_money").val());
		var sf_points_money_check = points_money_check-user_points_money;
		var sf_price_total = yuan2fen($('#sf_price_total').html());
		sf_points_money_check = sf_points_money_check>sf_price_total?sf_price_total:sf_points_money_check;
		if(checkPointMoney.test(yuan2fen($(this).val())) === false || yuan2fen($(this).val())<0){
			$('#sf_points_money_check').parent().hide();
			$(this).focus();
		}else if(yuan2fen($(this).val())>sf_points_money_check){
			$('#sf_points_money_check').html(fen2yuan(sf_points_money_check));	
			$('#sf_points_money_check').parent().show();
			$(this).focus();
		}else{
			$('#sf_points_money_check').parent().hide();
			countPirce();	
		}
	})
	//验证输入的优选积分抵扣的金额
	$('#user_points_money').blur(function(){
		$(this).css("color","#969696");
		var points_money_check = yuan2fen($("#points_money_check").html()); 
		var sf_points_money = yuan2fen($("#sf_points_money").val());
		var user_points_money_check = points_money_check-sf_points_money;
		var user_price_total = yuan2fen($('#user_price_total').html());
		user_points_money_check = user_points_money_check>user_price_total?user_price_total:user_points_money_check;
		if(checkPointMoney.test(yuan2fen($(this).val())) === false || yuan2fen($(this).val())<0){
			$('#user_points_money_check').parent().hide();
			$(this).focus();
		}else if(yuan2fen($(this).val())>user_points_money_check){
			$('#user_points_money_check').html(fen2yuan(user_points_money_check));
			$('#user_points_money_check').parent().show();
			$(this).focus();
		}else{
			$('#user_points_money_check').parent().hide();
			countPirce();	
		}
	})

	//验证用户手机号
	$('#mobile_valid_mobile').blur(function(){
	  checkUserMobile();
	  if(checkM==1){
		$('#mobile_valid_get').removeClass('mask_go_on');
	  }else{
		$('#mobile_valid_get').addClass('mask_go_on');
	  }
	})
		
	//发送验证码
	$('#mobile_valid_get').click(function(){
	  var mobile = $('#mobile_valid_mobile').val();	
	  //先校验手机号
	  checkUserMobile();
	  if(checkM == 0){
	    return false;
	  }
	  //发送验证码
	  $.post('/ajax/sendSmsCode/', {'mobile':mobile}, function(data){
		if(data==0){  //已发送
		  countDown(10);
		  $('#mobile_valid_get').hide();
		  $('#mobile_valid_time').show();
		}else{  //发送失败
		  var errorMsg = "<span class='onError'>验证码输入不正确.</span>";
		  $('#code_error').html(errorMsg);
		}
	  });	
	})
	
	//验证验证码
	$('#mobile_valid_code').blur(function(){
	  checkSmsCode();
	  if(checkS==1){
		$('#mobile_valid_submit').removeClass('mask_go_default');
	  }else{
		$('#mobile_valid_submit').addClass('mask_go_default');
	  }
	})

	//绑定用户手机号
	$('#mobile_valid_submit').click(function(){
	  var mobile = $('#mobile_valid_mobile').val();
	  checkUserMobile();
	  checkSmsCode();
	  if(checkM == 1 && checkS == 1){

	    //if(checkSmsCode() == true){
	      /*$.post('/ajax/bindUserMobile/', {'mobile':mobile}, function(data){
		    if(data==0){  //绑定成功
		      $("#mask_con").hide();
		      $(".mask_box").hide();
		    }else{  //绑定失败

		    }
	      });*/ 
		  $.ajax({
			url:'/ajax/bindUserMobile/',
			data:{'mobile':mobile},
			type:'post',
			async:false,
			success : function(data) {
			  if(data==0){  //绑定成功
		        $("#mask_con").hide();
		        $(".mask_box").hide();
				$("input[name=points_price_box]").attr('checked',true);
				checkPriceBox();
			  }else{  //绑定失败
				$("#mobile_valid_check_submit").show();
			  }	
			}
		  });
		//}	
	  }
	  return false;
	})
  })

//倒计时  
var dowmTimer = null;
function countDown(cd){
	dowmTimer = setInterval("showTime()",1000);
}
function showTime(){
	var sec = parseInt($('#mobile_valid_time_box').html());
	if(sec>0){
		sec--;
		$('#mobile_valid_time_box').html(sec);
	}else{
		$('#mobile_valid_get').show();
		$('#mobile_valid_time').hide();	
		$('#mobile_valid_time_box').html(120);
		clearInterval(dowmTimer);
	}
}
var checkM = 0;
var checkS = 0;
//校验手机号
function checkUserMobile(){
  var mobile = $('#mobile_valid_mobile').val();	
  var mCheck = /^(13|14|15|17|18)[0-9]{9}$/;
  checkM = 0;
  if(mobile==''){
	$('#mobile_valid_check_mobile').html('手机号码不能为空');  
	$('#mobile_valid_check_mobile').show();
  }else if(mCheck.test(mobile)==false){
	$('#mobile_valid_check_mobile').html('手机号码输入错误，请重新输入');  
	$('#mobile_valid_check_mobile').show();
  }else{  
	$('#mobile_valid_check_mobile').hide();    
	checkM = 1;
  }
}
//校验验证码
function checkSmsCode(){
  var mobile = $('#mobile_valid_mobile').val();		
  var code = $('#mobile_valid_code').val();	
  checkS = 0;
  if(mobile==''){
    $('#mobile_valid_check_code').html('短信验证码不能为空'); 
	$('#mobile_valid_check_code').show();
  }else{
    $.ajax({
  	  url:'/ajax/checkSmsCode/',
	  data:{'mobile':mobile,'code':code},
	  async:false,
	  type:'post',
	  success : function(data){
	    if(data==0){  //校验成功
	      $('#mobile_valid_check_code').hide();
	      checkS = 1;
	    }else{  //校验失败
		  $('#mobile_valid_check_code').html('短信验证码输入错误，请重新输入'); 
	      $('#mobile_valid_check_code').show();
	    }	
	  }
    });
  }
  /*$.post('/ajax/checkSmsCode/', {'mobile':mobile,'code':code}, function(data){
	if(data==0){  //校验成功
	  $('#mobile_valid_check_code').hide();
	  return true;
	}else{  //校验失败
	  $('#mobile_valid_check_code').show();
	  return false;
	}
  });*/	
}

  //选择积分支付
  function checkPriceBox(){
      if($("input[name=points_price_box]").is(':checked')==true){
		//检测是否验证过手机
		$.ajax({
		  url:'/ajax/checkUserMobileValid/',
		  //data:{'mobile':mobile},
		  type:'post',
		  async:false,
		  success : function(data){
		    if(data==0){
			  showMask();
			  placeholder(".phone_div_phone");
			  placeholder(".message_div_input");
			  $("input[name=points_price_box]").attr('checked','');
			  $('#mobile_valid_check_mobile').hide();
			  $('#mobile_valid_check_code').hide();
		    }else{
			  setPointMoney();
			  $('#points_money_check').parent().show(); 
		    }
		  }
		});
	  }
	  countPirce();
      /*if($("#user_points_money").html()>0 && $("#user_points_money").parent().find(".new-color").length>0){
        $("input[name=points_price_box]").attr('checked','');
        jAlert('为了保障您的账户财产安全，请先开启支付密码再使用余额支付');
        return false;
      }*/	
  }

  //计算应付价钱
  function countPirce(){
    //var product_price = $("#product_price").html();
    var countPrice = yuan2fen($("#countPrice").html()) + yuan2fen($("#card_price").html()) + yuan2fen($("#sf_points_price").html()) + yuan2fen($("#user_points_price").html());
	var jcard_price = yuan2fen($("#jcard_price").html());
    //var sf_price_total = yuan2fen($("#sf_price_total").html());
	//var user_price_total = yuan2fen($("#user_price_total").html());
    var sf_points_money = yuan2fen($("#sf_points_money").val());
	
	var user_points_money = yuan2fen($("#user_points_money").val());
	var points_money_total = yuan2fen($('#points_money_total').html()); //用户积分余额
	var points_money_check = yuan2fen($('#points_money_check').html()); //当前可用的积分可抵用金额
    var jcard_price_total = yuan2fen($("#jcard_price_total").html());
    if (jcard_price_total > jcard_price) {
      $('#card_price_append').show();
    } else {
      $('#card_price_append').hide();
    }
    if($("input[name=card_price_box]").attr('checked')==true){
      var use_card_price = countPrice > jcard_price ? jcard_price:countPrice;
      countPrice -= use_card_price;
      $("#card_price").html(fen2yuan(use_card_price));
      $("#card_price").parent().parent().show();
      if(use_card_price==0){
        $("#card_price").parent().parent().hide();
      }
    }else{
      $("#card_price").html(0);
      $("#card_price").parent().parent().hide();
    }
    if($("input[name=points_price_box]").attr('checked')==true){
	  //设置积分最高可抵用金额
      points_money_check = countPrice>points_money_total?points_money_total:countPrice;
	  $("#points_money_check").html(fen2yuan(points_money_check));
	  
	  if(points_money_check==0){
        resetPoint();		  
	  }else{
		
	  //先计算速运积分	
      var sf_points_price = countPrice > sf_points_money ? sf_points_money:countPrice;			
      countPrice -= sf_points_price;
	  $("#sf_points_money").val(fen2yuan(sf_points_price));
      $("#sf_points_price").html(fen2yuan(sf_points_price));
      $("#sf_points_price").parent().parent().show();
      if(sf_points_price==0){
        $("#sf_points_price").parent().parent().hide();
      }
	  //再计算优选积分
      var user_points_price = countPrice > user_points_money ? user_points_money:countPrice;			
      countPrice -= user_points_price;
	  $("#user_points_money").val(fen2yuan(user_points_price));
      $("#user_points_price").html(fen2yuan(user_points_price));
      $("#user_points_price").parent().parent().show();
      if(user_points_price==0){
        $("#user_points_price").parent().parent().hide();
      }
	  
	  }
    }else{
	  resetPoint();
    }

    if($("input[name=card_price_box]").attr('checked')==true){
      $(".payment-new0").removeClass("hide");
    }else{
      $("input[name=pay_pwd]").val('');
      $(".payment-new0").addClass("hide");
    }

    countPrice = parseInt(countPrice) > 0 ? countPrice : 0;

    $("#countPrice").html(fen2yuan(countPrice));
    $("#allPrice").html(fen2yuan(countPrice));
  }

//初始化积分支付状态
function resetPoint(){
	$("input[name=points_price_box]").attr('checked', false);
	$('#points_money_check').parent().hide(); 
	$('#sf_points_money').attr("disabled", true);
	$('#user_points_money').attr("disabled", true);
	$("#sf_points_money").val('');
	$("#user_points_money").val('');
    $("#sf_points_price").html(0);
    $("#sf_points_price").parent().parent().hide();
    $("#user_points_price").html(0);
    $("#user_points_price").parent().parent().hide();
}

//勾选后设置积分支付最大金额，本次可用金额
function setPointMoney(){
	var countPrice = yuan2fen($("#countPrice").html());  //剩余可用金额
	var pointsMoneyTotal = yuan2fen($("#points_money_total").html());  //总余额
	var pointsMoneyCheck = countPrice>pointsMoneyTotal?pointsMoneyTotal:countPrice; //当前可用余额
	$("#points_money_check").html(fen2yuan(pointsMoneyCheck));

	var sfPriceTotal = yuan2fen($("#sf_price_total").html());  //速运余额
	var sfPriceMoneyCheck = sfPriceTotal>pointsMoneyCheck?pointsMoneyCheck:sfPriceTotal;  //当前可用速运余额
	//$("#sf_points_money_check").html(fen2yuan(sfPriceMoneyCheck));
	$("#sf_points_money").val(fen2yuan(sfPriceMoneyCheck));

	pointsMoneyCheck -= sfPriceMoneyCheck;  //去掉速运余额后的剩余可用余额

	var userPriceTotal = yuan2fen($("#user_price_total").html());  //优选余额
	var userPointsMoneyCheck = userPriceTotal>pointsMoneyCheck?pointsMoneyCheck:userPriceTotal;  //当前可用速运余额
	//$("#user_points_money_check").html(fen2yuan(userPointsMoneyCheck));
	$("#user_points_money").val(fen2yuan(userPointsMoneyCheck));
	
	$('#sf_points_money').attr("disabled", false);
	$('#user_points_money').attr("disabled", false);
}

  $(function(){    
    $('form :input').blur(function(){          
      var val = $.trim(this.value);
      //验证优选卡账号 88110 00000 00116 6
      if( $(this).is('#CardNo') ){
        if( val=="" ){
          var errorMsg = "<span class='onError'>优选卡卡号不能为空.</span>";
          $('#e_code').html(errorMsg);
        }else if( val.length != 16 ){
          var errorMsg = "<span class='onError'>优选卡账号格式不正确.</span>";
          $('#e_code').html(errorMsg);
        }else{
          $('#e_code').html('');
        }
      }

      //验证优选卡密码
      if( $(this).is('#CardCode') ){
        if( this.value=="" ){
          var errorMsg = "<span class='onError'>优选卡密码不能为空.</span>";
          $('#e_pass').html(errorMsg);
        }else{
          $('#e_pass').html('');
        }
      }

      //优选卡验证码验证
      if( $(this).is('#verification_code') ){
        var verification_code = $.trim($('#verification_code').val());
        if( verification_code.length!=0  && verification_code.length!=6){
          var errorMsg = "<span class='onError'>优选卡验证码格式错误.</span>";
          $('#e_vcode').html(errorMsg);
        }else{
          $('#e_vcode').html('');
        }
      }

      //验证码验证
      if( $(this).is('#auth_code') ){
        if( this.value=="" ){
          var errorMsg = "<span class='onError'>验证码不能为空.</span>";
          $('#code_error').html(errorMsg);
        }else{
          auth_code = $("#auth_code").val();
          $.post('/ajax/code/', {auth_code:auth_code}, function(data){
            if(data==1){
              var okMsg = "<span class='onSuccess'><font color='blue'>输入正确.</font></span>";
              $('#code_error').html(okMsg);
            }else{
              var errorMsg = "<span class='onError'>验证码输入不正确.</span>";
              $('#code_error').html(errorMsg);
            }
          });
        }
      }

    });

    $("#pSubmit").click(function(){
      $("#activate input").trigger('blur');
      var numError = $('#activate .onError').length;
      if(numError){
        return false;
      }

      number = $('#CardNo').val();	
      code = $('#CardCode').val();	
      auth_code =  $('#auth_code').val();           
      verification_code = $('#verification_code').val();

      $.post('/ajax/doBind/', {"code":code, "number":number, "auth_code":auth_code, "verification_code":verification_code}, function(data){
        if(data=='-1'){
          jAlert('为了您的账户安全请先<a href="'+SF_HOME_URL+'/prove/mobileindex/" target="_blank">绑定手机</a>后再激活优选卡','提示消息',function(e){
            if(e){
              _avFailTip();
            }
          });
        }else if(data=='2'){
          jAlert('优选卡不存在或已被使用!','提示消息',function(e){
            if(e){
              _avFailTip();
            }
          });
        }else if(data=='-2'){
          jAlert('为了保障您的账户财产安全，请先开启支付密码再使用优选卡','提示消息',function(e){
            if(e){
              _avFailTip();
            }
          });
        }                     
        if(data=='3'){
          jConfirm('绑定后其他账号将无法使用，是否绑定', '温馨提示',function(e){
            if(e){
              $.post('/ajax/bindCard/', {"code":code, "number":number, "auth_code":auth_code, "verification_code":verification_code}, function(ok){
                if(ok=='4'){
                  jAlert('恭喜你，激活成功!', '温馨提示',function(e){
					location.reload();
                    /*if(e){
                      $.post('/ajax/cardBalance/', {"code":code}, function(b){
                        if(b) {
                          c = parseFloat($("#jcard_price_max").html());  //可用优选卡支付的最大金额
                          if(c>b) 
                        $("#jcard_price").html(b);
                          else
                        $("#jcard_price").html(c);	//可用优选卡支付的实际金额
                      $("#jcard_price_total").html(b);  //优选卡余额
                      $("input[name=card_price_box]").attr("disabled","");
					  if($("#card_price_append").css("display")=='none'){
					  	$("#card_price_append").css("display","block");
					  }
                      if($("input[name=card_price_box]").attr("checked")==false){
                        $("input[name=card_price_box]").click().change();
                        $("#activate").parent().parent().find(".sfbtn").click();
                        $("#activate input[class=text]").val('');
                      }else{
						countPirce();
						}
                      //_activate('none');
                        }
                      });
                    }*/
                  }); 
                }
                if(ok=='-1'){
                  jAlert('为了您的账户安全请先<a href="'+SF_HOME_URL+'/prove/mobileindex/" target="_blank">绑定手机</a>后再激活优选卡','提示消息',function(e){
                    if(e){
                      _avFailTip();
                    }
                  });
                }
                if(ok=='5'){
                  jAlert('您输入的优选卡信息错误或优选卡已被冻结，请稍后重试', '温馨提示',function(e){
                    if(e){
                      _avFailTip();
                    }
                  });

                }

                if(ok=='6'){
                  jAlert('您输入的优选卡信息错误或优选卡已被冻结，请稍后重试', '温馨提示',function(e){
                    if(e){
                      _avFailTip();
                    }
                  });
                }
                if(ok=='-2'){
                  jAlert('为了保障您的账户财产安全，请先开启支付密码再使用优选卡', '温馨提示',function(e){
                    if(e){
                      _avFailTip();
                    }
                  });
                }
              });
            }else{
              return false ;
            }
          }); 

        }

      });		
      return false;

    });

  })
  //优选卡激活失败提示
  function _avFailTip(){
    $("#auth_code_img").attr("src", SF_WWW_URL+"/validate/?new="+Math.random()) ;
    $('#code_error').html("<span class='onError'>验证码输入不正确.</span>");
  }

  function vcodeshow(){
    var sn = $('#CardNo').val();
    var str2_2 = sn.substr(2,2);
    var str4_6 = sn.substr(4,6);
    if ($.trim(sn)){
      if ('11'==str2_2 || ('00'==str2_2 && parseInt(str4_6)<120816)){
        $('#vcode').css('display', 'none');	
      }else{
        $('#vcode').css('display', 'block');
      }
    }
  }
  function clearTips(){
    $("input").each(function(){
      $(this).removeClass("inputTips");
      if($(this).val() == $(this).attr("def")){
        $(this).val('');
      }
    });
  }

  function confirmCheck(){
    $("#orderSaveTip").removeClass("hide").html('');
    $(".orderSubmit").html('<input id="save" name="save" onclick="return orderSave();" class="submitBtn" value=" 提交订单 " type="button">');
    if($("#userAddrId .orderCurr").css("display")=='none'){
      $("#orderSaveTip").removeClass("hide").html('请先<a href="#userAddr">保存收货人信息</a>，再提交订单。');
      $(".orderSubmit").html('<input type="button" value=" 提交订单 " class="submitDisable" name="">');
    }else if($("#payDataId .orderCurr").css("display")=='none'){
      $("#orderSaveTip").removeClass("hide").html('请先<a href="#payData">保存支付及配送方式</a>，再提交订单。');
      $(".orderSubmit").html('<input type="button" value=" 提交订单 " class="submitDisable" name="">');
    }else if($("#userInvoiceId .orderCurr").css("display")=='none'){
      $("#orderSaveTip").removeClass("hide").html('请先<a href="#userInvoice">保存发票信息</a>，再提交订单。');
      $(".orderSubmit").html('<input type="button" value=" 提交订单 " class="submitDisable" name="">');
    }else if($("#giverAddrId .orderCurr").css("display")=='none'){
      $("#orderSaveTip").removeClass("hide").html('请先<a href="#giverAddr">保存寄货信息</a>，再提交订单。');
      $(".orderSubmit").html('<input type="button" value=" 提交订单 " class="submitDisable" name="">');
    }	
    hideShowEditHref();
  }
  //提交订单
  function orderSave(){
    clearTips();
    if($("#addresslist").is(":visible")){
      //$("#addrSave").click();
      //$("#addrConfirm").click();
      jAlert("请先确认收货地址");
      return;
    }

    if($("#yingProce").html() < 0){
      //jAlert('尊敬的顾客，您的商品总金额小于10元，请再选择其它商品后继续购物。');
      $(".mini-charge").removeClass("hide");
      return;
    }

    if(yuan2fen($("#countPrice").text()) >= 2000000 && $("input[name='payment']:checked").val() == 2){
      jAlert('很抱歉，订单应付总额超过2万元时不支持货到付款，请您选择其他支付方式');
      $("#paymentid").click();
      location.href="./#pay_ment";
      return;
    }

	//校验输入的积分
    if($("input[name=points_price_box]").attr('checked')==true){
      /*if($.trim($("input[name=pay_pwd]").val())==''){
        jAlert('请输入支付密码');
        return false;
      }*/
	  if($('#sf_points_money_check').parent().css('display')!='none' || $('#user_points_money_check').parent().css('display')!='none'){
        jAlert('积分金额输入有误');
        return false;  
	  }
    }
	
    //if(!savePay()) return false;
    if($("input[name='fapiao']:checked").val() == 1){
      if($('#Invoice_inv_type_0').attr('checked') != true){			
        if(!checkInv()) return false;
      }else{
        jAlert('请选择需要的发票类型');
        return false;
      }
    }

    $(".inputArea").focus();
    if($(".inputArea").val()){
      if($(".inputArea").val().length >140){
        jAlert("字数不能超过140");
        return false;
      }
    }

    //支付密码
    if($("input[name=card_price_box]").attr('checked')==true){
      //$(".payment-new0").removeClass("hide");
      if($.trim($("input[name=pay_pwd]").val())==''){
        jAlert('请输入支付密码');
        return false;
      }
    }else{
      $("input[name=pay_pwd]").val('');
    }

    var best_date = $("#best_date1").val();
    var best_time = $("#best_time1").val();
    if(best_time && !$(".dateSelect").is(":hidden")){
      if(!best_date){
        //	jAlert('请选择订单的配送日期与时间');
        //	return false;
      }
    }

    //检查支付密码
    if($("input[name=pay_pwd]").val()){
      var sp_status = 1;
      var info = '';
      $.ajax({
        type: "POST",
        url: "/order/checkPayPwd",
        data: 'pay_pwd='+$("input[name=pay_pwd]").val(),
        dataType:"text",
        async: false,
        success: function(da){	
          var msg = eval('('+da+')');
          if(msg.status==-1){
            sp_status = 0;
            info = msg.msg;
          }
        }
      });

      if(sp_status==0){
        jAlert(info);
        return false;
      }	
    }

    //检查赠品库存

    var web_url = '/order/checkGift/?ock='+$('#order_cache_key').val();
    var dm = $("#dm").val();
    $.ajax({
      type: "POST",
      url: web_url,
      data: 'dm='+dm,
      dataType:"text",
      async: false,
      success: function(data){
        var msg = eval('('+data+')');
        if(msg.status == 1){
          //jAlert(msg.info);
          jConfirm(msg.info, '提示消息', function(r){
            if(r){
              var stop_url = '/order/stopActive/';
              $.ajax({
                type: "POST",
                url: stop_url,
                data: 'act='+msg.act,
                dataType:"text",
                async: false,
                success: function(da){

                }});

              $("#save").attr('disabled',true);
              $("#save").val('正在提交中...');
              $("#save").addClass('submitting');
              $("#order-create").submit();
              return true;
            } else {
              return false;
            }
          });
        }else if(msg.status == 2){//礼品袋缺货 由用户决定是否放弃礼品袋继续购买
          jConfirm(msg.info, '提示消息', function(r){
            if(r){
              $("#save").attr('disabled',true);
              $("#save").val('正在提交中...');
              $("#save").addClass('submitting');
              $("#order-create").submit();
            } 
          });		
        }else{
          $("#save").attr('disabled',true);
          $("#save").val('正在提交中...');
          $("#save").addClass('submitting');
          $("#order-create").submit();				
        }		

      }
    });

    //jAlert("dd");
    //return false;


  }

  //控制显示/隐藏每个模块的编辑功能链接
  function hideShowEditHref() {
    if($(".orderCurr:hidden").length > 0 && $(".orderCurr:hidden").parent().parent().css("display") != 'none'){
      $(".addrAlter").each(function(){
        var $this = $(this);
        if ($this.css('display') != 'none') {
          $this.addClass("orderTip2")
        .removeClass('addrAlter')
        .html("如修改，请先保存" + $(".orderCurr:hidden").parent().parent().find(".orderTitle").html().split("：")[0]);
        }
      });
    } else {
      $(".orderTip2").each(function(){
        $(this).addClass("addrAlter")
        .removeClass('orderTip2')
        .html('[修改]');
      });
    }
  }
