var hostUrl = document.location.host;
var urlArr = hostUrl.split('.');
var domain = urlArr[1]+'.'+urlArr[2];
var SF_STATIC_URL = 'http://i.'+domain;
var cartHostUrl = 'http://cart.'+domain;
var wwwHostUrl  = 'http://www.'+domain;
var pp = new Array();//用于存放购物车中状态不适合的商品

$(document).ready(function(){
  $(".cartAddrPrice").slideDown(300,function(){setTimeout(function(){$(".cartAddrPrice").slideUp(300)},4000)});
})

//过滤删除某一员组数据
function remove(arrPerson,objPropery,objValue)
{
  return $.grep(arrPerson, function(cur,i){
    return cur[objPropery]!=objValue;
  });
}
/**
  获取加价购中的赠品列表
  @param	int	aid	活动id
  @param  int money 满money元
  @param  int addid  加价购阶梯活动id
  */
function getAddBuyZp(aid,money,addid){
  /*
     if($('#diaoajax'+aid+addid).length > 0){
     alert('1');
     $('.w').hide();//先隐藏所有
     $('#addProduct_'+aid+'_'+addid).show();//打开指定的
  //看看是否已经有用户选择的赠品
  if($('.ajaxchecked'+aid+addid).length > 0){
  $('.ajaxchecked'+aid+addid).each(function(){
  $('#jjg_check_'+aid+'_'+addid+'_'+$(this).val()).attr("checked",true);//被选中的框置为选中状态

  checkNum(aid,addid,$(this).val());
  })
  }
  }else{*/
  //alert('2');
  $.ajax({
    url  : cartHostUrl+'/cart/getAddBuyZp',
  type : 'POST',
  data : {activeid:aid,price:money,addid:addid},
  dataType : 'json',
  success: function(data){
    if(data.error == 1){
      $('#addProduct_'+aid+'_'+addid).html(data.data).show();
      //看看是否已经有用户选择的赠品
      if($('.ajaxchecked'+aid+addid).length > 0){
        $('.ajaxchecked'+aid+addid).each(function(){
          $('#jjg_check_'+aid+'_'+addid+'_'+$(this).val()).attr("checked",true);//被选中的框置为选中状态
          $('#jjg_amount_'+aid+'_'+addid+'_'+$(this).val()).val($(this).attr('id'));//
          checkNum(aid,addid,$(this).val());
        })
      }
    }else{
      jAlert(data.info);
    }
  }
  });
  //}
}


//加价购
function addBuy(act_id,add_id){
  var result = new Array();
  var data = new Array();
  $("#addProduct_"+act_id+"_"+add_id).find("input[name='jjg_check_'"+act_id+"_"+add_id+"]:checked").each(function(){ 
    result.push($(this).val()); 
  });
  var current_total_num = 0;
  for(var i in result){
    var pid = result[i];
    var current_number = $("#jjg_amount_"+act_id+"_"+add_id+"_"+pid).val();
    if(current_number<1){
      jAlert("您领取的换购品数量最小为1");
      return;
    }

    var everyorder_number = $("#everyorder_number_"+act_id+"_"+add_id+"_"+pid).val();
    var amount = pid+"_"+current_number;
    current_total_num += current_number*1;
    current_number = parseInt(current_number);
    everyorder_number = parseInt(everyorder_number);
    if(current_number>everyorder_number && everyorder_number>0){
      jAlert("您领取的换购品超过每单最大"+everyorder_number+"件限制");
      return;
    }
    data.push(amount); 
  }
  var total_num = $("#total_"+act_id+"_"+add_id).val();
  if(total_num<current_total_num){
    jAlert("您领取的换购品超过"+total_num+"件");
  }else{
    var product_str = data.join(",");

    $.ajax({
      url  : cartHostUrl+'/cart/addBuy/',
      type : 'POST',
      data : {activeid:act_id,add_id:add_id,product_str:product_str},
      dataType: 'json',
      success: function(msg){
        if(msg.error==1){
          $('#addbuyzp'+act_id).html(msg.data);//将赠品信息添加
          $('#addProduct_'+act_id+'_'+msg.info.addid).hide();//隐藏当前的选择赠品框
          chmodeNum(msg.info.cart);
          if($('.ljhg'+act_id).length>0){
            $('.ljhg'+act_id).html('立即换购');//初使化所有阶梯活动内容
            $('#change'+act_id+msg.info.addid).html('重新换购');//对用户被选中的那一阶梯活动内容改值
          }
          $('.jjg_check'+act_id).attr("checked",false);//将所有适合的阶梯活动中的商品前的多选框改为没被选中状态
          if($('#diaoajax'+act_id+add_id).length > 0){
            $('#diaoajax'+act_id+add_id).remove();
          }

        }else{
          jAlert(msg.info);
        }
      }
    });	
  }
}

//删除加价购商品
function delAddBuy(act_id,add_id,pid){
  $.ajax({
    url  : cartHostUrl+'/cart/delAddBuy/',
  type : 'POST',
  data : {activeid : act_id,add_id : add_id,pid : pid},
  dataType: 'json',
  success: function(msg){
    if(msg.error==1){
      $('#tr'+act_id+'_'+add_id+'_'+pid).remove();
      chmodeNum(msg.info.cart);
      if($('.ljhg'+act_id).length>0){
        $('.ljhg'+act_id).html('立即换购');//初使化所有阶梯活动内容
        if(msg.info.addid > 0){
          $('#change'+act_id+msg.info.addid).html('重新换购');//对用户被选中的那一阶梯活动内容改值
        }
      }
      $('.jjg_check'+act_id).attr("checked",false);//将所有适合的阶梯活动中的商品前的多选框改为没被选中状态
      if($('#diaoajax'+act_id+add_id).length > 0){
        $('#diaoajax'+act_id+add_id).remove();
      }
    }else{
      jAlert(msg.info);
    }
  }
  });	

}

//修改页面上的统计信息
function chmodeNum(array){
  $.each(array,function(key,val){
    if($('#'+key).length>0){
      $('#'+key).html(val);
    }
  })
}

//加号触发的事件
function jiaNum(obj,aid,addid,pid){
  var jiaobj = $('#jjg_amount_'+aid+'_'+addid+'_'+pid);
  var num	=	jiaobj.val()*1;
  jiaobj.val(++num);
  if(!checkNum(aid,addid,pid)){
    $('#jjg_check_'+aid+'_'+addid+'_'+pid).attr("checked",true);
    jiaobj.val(--num);
  }
}

//减号触发的事件
function jianNum(obj,aid,addid,pid){
  var jianobj = $('#jjg_amount_'+aid+'_'+addid+'_'+pid);
  var num	=	jianobj.val()*1;
  if(--num <= 0){
    return;
  }
  jianobj.val(num);
  var total_num = num = 0;
  var total = $("#total_"+aid+"_"+addid).val()*1;
  $("#table_"+aid+"_"+addid).find('input[type=checkbox]:checked').each(function(){
    var this_apid = $(this).attr("apid");
    num = $("#jjg_amount_"+this_apid).val()*1;
    total_num += num;
  });
  var hava_num = total-total_num;
  $("#add_id_"+aid+"_"+addid).html('换购品领取：(共可领取'+total+'件，已经选取了'+total_num+'件，还有'+hava_num+'件可领)');
}

/**
  被选中时的验证，验证每日件数，每单件数，活动中的总数量及组合件数
  @param  obj  obj  被选的多选择框
  @param  int  addid  活动中的阶梯id
  @param  int  pid    商品id
  */
function checkNum(aid,addid,pid){
  var id = aid+'_'+addid+'_'+pid;
  obj = '#jjg_check_'+id;
  if($(obj).attr("checked")){
    var max_buynumber	=	$('#max_buynumber_'+id).val()*1;
    var everyday_number		=	$('#everyday_number_'+id).val()*1;
    var everyorder_number	=	$('#everyorder_number_'+id).val()*1;
    var all_limit			=	$('#all_limit_'+id).val()*1;
    var day_limit			=	$('#day_limit_'+id).val()*1;
    var amount_num			=	$('#jjg_amount_'+id).val()*1;

    //每单数量校验
    if(amount_num>everyorder_number && everyorder_number>0){
      jAlert('此换购品每单最多可领取'+everyorder_number+'件');
      $(obj).attr("checked",false);
      return false;
    }
    //每日数量校验
    if(amount_num>day_limit && day_limit>=0 && everyday_number>0){
      jAlert('此换购品每日最多可领取'+day_limit+'件');
      $(obj).attr("checked",false);
      return false;
    }
    //活动时间内总数校验
    if(amount_num>all_limit && all_limit>=0 && max_buynumber>0){
      jAlert('此换购品数量超过总数量限制');
      $(obj).attr("checked",false);
      return false;
    }
  }
  /*
     $("#table_"+aid+'_'+addid).find('input[type=checkbox]:checked').each(function(){
     var this_apid = $(this).attr("apid");
     num = $("#jjg_amount_"+this_apid).val()*1;
     total_num += num;
     });
     */

  var total_num = num = 0;
  var total = $("#total_"+aid+'_'+addid).val()*1;
  $("#table_"+aid+'_'+addid).find('input[type=checkbox]:checked').each(function(){
    var this_apid = $(this).attr("apid");
    num = $("#jjg_amount_"+this_apid).val()*1;
    total_num += num;
  });

  if(total>=total_num){
    var hava_num = total-total_num;
    $("#add_id_"+aid+'_'+addid).html('换购品领取：(共可领取'+total+'件，已经选取了'+total_num+'件，还有'+hava_num+'件可领)');
    return true;
  }else{
    jAlert('您选取的换购品总件数不能超过'+total+'件');
    $(obj).attr("checked",false);
    return false;
  }
}

//点击选择框的事件
function changeCart(obj){
  var checked = '';
  if($(obj).attr('checked')){
    checked = 'checked';
  }
  var type = $(obj).attr('class');
  if(type=='haitao'){
    var ht='_ht';
  }else{
    var ht='';
  }
  //$('#'+$(obj).val()).parent().parent().html('正在加载.....');
  //return;
  $.ajax({
    url  : cartHostUrl+'/cart/changeCart/',
    type : 'POST',
    beforeSend: function(){
      var temp = $(obj).val().split("-");
      $('#'+temp[0]+'load'+ht).html('<img src="'+SF_STATIC_URL+'/com/images/loading32.gif">').show();
      $('#'+temp[0]+ht).hide();
    },
    data : {val : $(obj).val(),checked : checked},
    dataType: 'json',
    success: function(msg){
      //$('.currcart').each(function(){
      //	$(this).removeClass("currcart");
      //})
      if(msg.error==1){
        // if($('#'+msg.info.type).length > 0){
        // $('#'+msg.info.type).html(msg.data);
        // }
        if (msg.info.type.length > 0) {
          for(var t in msg.data){
            if($('#'+t).length > 0){
              if (msg.data[t] == 'none') {
                $('#'+t).remove();
              } else {
                $('#'+t).html(msg.data[t]);
              }
            } else {
              if (msg.data[t] != 'none') {
                var loadDiv = $("<div style='margin:20px;text-align:center;display:none;' id='"+t+"load'></div>");
                $("#all_"+type+" > div.cartOrderTotal").before(loadDiv);
                $("#all_"+type+" > div.cartOrderTotal").before("<div id='"+t+"'>"+msg.data[t]+"</div>");
              }
            }
          }
        }
        chmodeNum(msg.info.cart);
        changeCheckboxStats();
        //getCartList();//更新右上角的购物列表
      }else{
        jAlert(msg.info);
        //$(obj).attr('checked',false);
      }
      //$('#'+$(obj).val()).addClass('currcart');
    },
    complete: function(){
      var temp = $(obj).val().split("-");
      $('#'+temp[0]+'load'+ht).html('').hide();
      $('#'+temp[0]+ht).show();  
    }

  });
}

//改变全选框
function changeCheckboxStats(){
  if($("#Zpu").length>0){
    if($("input[type='checkbox'][class='putong']:not(:checked)").length <= 0){
      $("#Zpu").attr("checked",true);
    }else{
      $("#Zpu").attr("checked",false);
    }
    if($("input[type='checkbox'][class='putong']").length <= 0){
      //$('#all_putong').remove();
      //top.location.reload();
      top.location.href = cartHostUrl+'/cart/index/';
    }
  }
  if($("#Zsfv").length>0){
    if($("input[type='checkbox'][class='zhicai']:not(:checked)").length <= 0){
      $("#Zsfv").attr("checked",true);
    }else{
      $("#Zsfv").attr("checked",false);
    }
    if($("input[type='checkbox'][class='zhicai']").length <= 0){
      //$("#all_zhicai").remove();
      //top.location.reload();
      top.location.href = cartHostUrl+'/cart/index/';
    }
  }
  if($("#Zht").length>0){
    if($("input[type='checkbox'][class='haitao']:not(:checked)").length <= 0){
      $("#Zht").attr("checked",true);
    }else{
      $("#Zht").attr("checked",false);
    }
    if($("input[type='checkbox'][class='haitao']").length <= 0){
      //$('#all_putong').remove();
      //top.location.reload();
      top.location.href = cartHostUrl+'/cart/index/';
    }
  }  
  if($("input[type='checkbox'][name='cart_list']").length <= 0){
    top.location.href = cartHostUrl+'/cart/index/';
  }
  //if($("#Zsfv").length<=0){
  //top.location.href = cartHostUrl+'/cart/index/';
  //}
  //alert($("input[name^='cart_list']:not(:checked)").length);

  if($("input[name^='cart_list']:not(:checked)").length <= 0){
    $("#Zall").attr("checked",true);
  }else{
    $("#Zall").attr("checked",false);
  }
}

function changNum(num,value,isHt){
  //var type = $(obj).parent().parent().parent().find("input[type='checkbox']").attr('class');
  //alert(type);
  var selceobj = $("input[type='checkbox'][name='cart_list'][value='"+value+"']:not(:checked)");
  if(selceobj.length > 0){
    selceobj.attr("checked",true);
    changeCart(selceobj);
    return;
  }
  var count = 0;
  var jianobj = $('#amount'+value);
  var n	=	jianobj.val()*1;
  if(num == 1){//jian
    if(--n <= 0){
      return;
    }
    //jianobj.val(--n);
    count = -1;
  }
  if(num == 2){
    //jianobj.val(++n);
    count = 1;
  }
  changeCartNum(value,count,isHt);
}

function changCount(value,obj,isHt){
  //var type = $(obj).parent().parent().parent().find("input[type='checkbox']").attr('class');
  //alert(type);
  var selceobj = $("input[type='checkbox'][name='cart_list'][value='"+value+"']:not(:checked)");
  if(selceobj.length > 0){
    selceobj.attr("checked",true);
    changeCart(selceobj);
    return;
  }
  $count  =   0;
  $oldnum =	$('#amounts'+value).val()*1;
  $num	=	$(obj).val()*1;
  if(!checkRate($oldnum)){
    jAlert('非法操作！');
    return;
  }
  if(!checkRate($num)){
    jAlert('您输入的数量格式有误！');
    $(obj).val($oldnum);
    return;
  }
  if($num > 1000){
    $(obj).val($oldnum);
    jAlert('对不起购买上限不能大于1000!!');
    return;
  }
  $count = $num - $oldnum;
  changeCartNum(value,$count,isHt);
}

//点击商品数量
function changeCartNum(value,count,isHt,bs){
  if(isHt==1){
	var type='haitao';
	var ht='_ht';		
  }else{
	var type='putong';
	var ht='';	
  }
  if (typeof(bs) == "undefined") { 
    bs = 1; 
  }
  var hasDiv = new Array();
  $("#all_"+type).children().each(function(k, v){
    var divId = $(v).attr('id');
    if (divId != '' && divId.indexOf('load') < 0) {
      hasDiv.push(divId)
    }
  });
  bs = count>0 ? bs : 0;//加做验证，减不做
  $.ajax({
    url  : cartHostUrl+'/cart/changeCartNum/',
    beforeSend: function(){
      var temp = value.split("-");
      $('#'+temp[0]+'load'+ht).html('<img src="'+SF_STATIC_URL+'/com/images/loading32.gif">').show();
      $('#'+temp[0]+ht).hide();
      //$('#'+value).html('<img src="'+SF_STATIC_URL+'/com/images/loading32.gif">').show();
    },
    type : 'POST',
    data : {val:value, num:count, mes:bs, hasdiv:hasDiv, is_ht:isHt},
    dataType: 'json',
    success: function(msg){
      //$('.currcart').each(function(){
      //	$(this).removeClass("currcart");
      //})
      if(msg.error==1){
        if (msg.data == 'reload') {
          location.reload();
        }
        if (msg.info.type.length > 0) {
          for(var t in msg.data){
            if($('#'+t+ht).length > 0){
              $('#'+t+ht).remove();
            } 
            if($('#'+t+"load"+ht).length > 0){
              $('#'+t+"load"+ht).remove();
            } 
            if (msg.data[t] != 'none') {
              var loadDiv = $("<div style='margin:20px;text-align:center;display:none;' id='"+t+"load"+ht+"'></div>");
              $("#all_"+type).prepend(loadDiv);
              $("#all_"+type).prepend("<div id='"+t+ht+"'>"+msg.data[t]+"</div>");
            }
          }
        }
        chmodeNum(msg.info.cart);
        getCartList();//更新右上角的购物列表
      }else if(msg.error==2){
        jConfirm(msg.info, '提示消息', function(r){
          if(r){
            changeCartNum(value,count,type,0);
          }else{
            $('#amount'+value).val($('#amounts'+value).val()*1);
          }
        })
      }else{
        jAlert(msg.info);
        $('#amount'+value).val($('#amounts'+value).val()*1);
        //var n = $('#amount'+value).val()*1;
        //$('#amount'+value).val(--n);
      }
      //$('#'+value).addClass('currcart');
    },
    complete: function(){
      var temp = value.split("-");;
      $('#'+temp[0]+'load'+ht).html('').hide();
      $('#'+temp[0]+ht).show();
    }
  });
}


/*购物车删除单个商品
  @param  string value   活动类型-活动id-商品id  这三者组合
  */
function cartDel(value){
  jConfirm("确定删除此商品？", '提示消息', function(r){
    if (r){
      yibo('delete',value,1);
      $.ajax({
        url  : cartHostUrl+'/cart/delCartProduct/',
        type : 'POST',
        //dataType: 'json',
        dataType: "jsonp",  //返回json格式的数据   
        jsonp:"callback",
		async: false,
        data : {val : new Array(value)},
        success: function(msg){
          if(msg.error==1){
            if(msg.info.is_ht==true){
              var ht = '_ht';
            }else{
              var ht = '';
            }  
            if($('#'+msg.info.type+ht).length > 0){
              $('#'+msg.info.type+ht).html(msg.data);
              chmodeNum(msg.info.cart);
            }
            getCartList();//更新右上角的购物列表
            changeCheckboxStats();
          }else{
            jAlert(msg.info);
          }
        }
      });
    }else{
      return false;
    }	
  }
  );
}

//删除多个选择商品
function cartDelMore(){
  jConfirm("确定删除选中的商品？", '提示消息', function(r){
    if (r){
      var result = new Array();
      $("input[name='cart_list']:checked").each(function(){ 
        result.push($(this).val()); 
      });
      var ids = result.join(",");
      yibo('delete',ids,1);
      $.ajax({
        url  : cartHostUrl+'/cart/delCartProduct/',
        type : 'GET',
        data : {val : result},
        dataType: 'jsonp',
        jsonp:"callback",
        success: function(msg){
          if(msg.error==1){
            //top.location.reload();
            top.location.href = cartHostUrl+'/cart/index/';
          }else{
            jAlert(msg.info);
          }
        }
      });
    }else{
      return false;
    }
  });
}

/**
 * 清空购物车
 */
function delAll(huid)
{
  jConfirm("确定清空购物车中的全部商品？", '提示消息', function(r){
    if(r){
      yibo('delete','',1);
      $.ajax({
        url  : cartHostUrl+'/cart/delAll/',
        type : 'POST',
        data : {userid:huid},
        dataType: 'json',
        success: function(msg){
          if(msg.error==1){
            //top.location.reload();
            top.location.href = cartHostUrl+'/cart/index/';
          }else{
            jAlert(msg.info);
          }
        }
      });
    } else {
      jAlert(msg.info);
    }
  });
}

//最上部全选
function Zall(obj){
  var checked = '';
  $("input[name^='cart_list']").attr('checked',$(obj).attr('checked'))
    if($(obj).attr('checked')){
      checked = 'checked';
    }
  selectAll(checked,0);
}

//普通商品全选
function PutongAll(obj){
  var checked = '';
  $(".putong").attr('checked',$(obj).attr('checked'));
    if($(obj).attr('checked')){
      checked = 'checked';
    }
  selectAll(checked,1);
}
//直采商品全选
function SfvAll(obj){
  var checked = '';
  $(".zhicai").attr('checked',$(obj).attr('checked'));
    if($(obj).attr('checked')){
      checked = 'checked';
    }
  selectAll(checked,2);
}
//海淘商品全选
function HaitaoAll(obj){
  var checked = '';
  $(".haitao").attr('checked',$(obj).attr('checked'));
  if($(obj).attr('checked')){
    checked = 'checked';
  }
  selectAll(checked,3);
}
/*function HaitaoAll(obj){
  var checked = '';
  $(".haitao").find('input').each(function(){
	$(this).attr('checked',$(obj).attr('checked')); 
  })
  if($(obj).attr('checked')){
    checked = 'checked';
  }
  selectAll(checked,3);
}*/

/*处理全选的方法
  @parma string  checked  是否被选中的值
  @parma string  type    针对购物车中哪些数据操作(0,全部;1,普通;2,直采)
  */
function selectAll(checked,type){
  $.ajax({
    url  : cartHostUrl+'/cart/selectAll/',
  type : 'POST',
  data : {checked:checked,type:type},
  dataType: 'json',
  success: function(msg){
    if(msg.error==1){
      //top.location.reload();
      top.location.href = cartHostUrl+'/cart/index/';
    }else{
      jAlert(msg.info);
    }
  }
  });
}


//定义切换地址后要执行的方法
function cartList(){
  //top.location.href = '/cart/index/area/1';
  top.location.href = cartHostUrl+'/cart/index/';
}


//获取购物车商品数据与页面

function getCartNum(){
  $.ajax({
    url  : cartHostUrl+'/cart/countNum/',
  type : 'POST',
  data : {},
  dataType: 'json',
  success: function(msg){
    if(msg.error==1){
      $('#cartNum').html(msg.data);
    }else{
      jAlert(msg.info);
    }
  }
  });
}

function getCartList(){
  $.ajax({
    url  : cartHostUrl+'/cart/headerCart/',
  type : 'POST',
  //dataType: 'json',
  dataType: "jsonp",  //返回json格式的数据   
  jsonp:"callback",
  data : {},
  success: function(msg){
    if(msg.error==1){
      //$('#cat13').html(msg.data);
      $('#cartNum').html(msg.info.num);
      $('#cart_lists').html(msg.data);
      if($('#showcart').length > 0){
        $('#showcart').html('购物车共计'+msg.info.num+'件商品,合计 '+msg.info.price+'元');
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
function cartAdd(product_id,cart_type,opencity_id, flag){
  var cartNum = $("#cartNum").html();
  var alsoBuy = '';
  if (3==flag){
    addPresale(product_id);
  }else{
    //购买了还购买了
    //$.get(wwwHostUrl+'/product/alsoBuy',{pid:product_id},function(htmlcode){
    //alsoBuy = htmlcode;
    //})


    var web_url = cartHostUrl+'/cart/addCart/';
    var number = 1;
    if($("#number").length!=0){
      number = $("#number").val();
    }
    if(number > 1000){
      //This.val(trCart.find("#amounts").val());
      jAlert('对不起购买上限不能大于1000!!');
      return;
    }
    if(!checkRate(number)){
      jAlert('您输入的数量格式有误!!');
      return false;
    }

    $.ajax({
      url  : web_url,
      type : 'POST',
      //dataType: 'json',
      dataType: "jsonp",  //返回json格式的数据   
      jsonp:"callback",
      data : {product_id:product_id,number:number,opencity_id:opencity_id,cart_type:cart_type},
      success: function(msg){
        if(msg.error==1){//成功
          //jAlert(msg.succes);
          if (0==flag)
    {
      var cartDiv = '<div class="carwindownew" id="carwindow"><div class="content"><img src="'+SF_STATIC_URL+'/html/images/duihao.jpg"><ul>';
      cartDiv+= '<li>该商品已成功放入购物车！</li>';
      cartDiv+= '<li id="showcart">加载中....</li>';
      cartDiv+= '<li><a onclick="javascript:car_close();" href="javascript:void(0);">&lt;&lt; 继续购物 </a>   <a href="'+cartHostUrl+'/cart/index/" > 去结算&gt;&gt; </a></li></ul></div>';
      cartDiv+= '<div id="car_close" style="position:absolute;top:5px;left:290px;width:40px;height:18px;line-height:18px;cursor:pointer;background-color:#1b6147;color:#FFF;border:1px solid #dadada;overflow:hidden;" onclick="car_close();">X 关闭</div><div class="clear"></div>';
      cartDiv += '<div id="elsebuy">还购买了正在加载中...</div>';
      cartDiv += '</div>';			
      $(cartDiv).appendTo("#fatherson");
      $("#fatherson").show();
      buyelse(product_id);
      getCartList();
      car_ie6hack();
    }else if(2==flag){
      url = cartHostUrl+'/cart/index/';
      if(/MSIE (\d+\.\d+);/.test(navigator.userAgent) || /MSIE(\d+\.\d+);/.test(navigator.userAgent)){
        var referLink = document.createElement('a');
        referLink.href = url;
        document.body.appendChild(referLink);
        referLink.click();
      }else{  
        location.href = url;  
      }
    } else if(4==flag){
      return msg;
    }

    yibo('cart',product_id,number);
        }else{
          jAlert(msg.info);
        }
      }
    });
  }
}


function cartJump()
{
  if($("input[name='cart_list'][class='putong']:checked").length==0){
    jAlert("请至少选择一个商品");	
    return;
  }
  //$('.js2').attr('disabled',true);
  $('.jiesuan.youxuan').attr('disabled',true);
  $('.jiesuan.youxuan').val('正在提交...');
  if(pp.length>0){
    var cartids = new Array();
    $.each(pp,function(k,v){
      $('#'+v.id).css({ color: "#ff0011", background: "#F5F5DC" });
      cartids.push(v.cartid); 
    })
    var cids = cartids.join(",");
    jConfirm("购物车中存在无法购买的商品不能直接去结算，是否需要系统自动为您取消选择所有无法购买的商品？", '提示消息', function(r){
      if (r){
        $.ajax({
          url  : cartHostUrl+'/cart/goOutSys/',
          type : 'POST',
          data : {cartids:cids},
          dataType: 'json',
          success: function(msg){
            if(msg.error==1){
              top.location.href = cartHostUrl+'/cart/index/';
            }
          }
        });
      }else{
        //$('.js2').attr('disabled',false);
        $('.jiesuan.youxuan').attr('disabled',false);
        $('.jiesuan.youxuan').val('去结算');
      }
    });

  }else{
    if($("input[class='putong']:checked").length!=0 && $("input[class='zhicai']:checked").length!=0){
      href_url	=	cartHostUrl+'/cart/select/';
    }else if($("input[class='putong']:checked").length!=0 && $("input[class='zhicai']:checked").length==0){
      href_url	=	cartHostUrl+'/order/index/';
    }else if($("input[class='putong']:checked").length==0 && $("input[class='zhicai']:checked").length!=0){
      href_url	=	wwwHostUrl+'/sfvOrder/index/';
    }
    //SF.Widget.tbOpen('<strong>正在加载...</strong>', '正在加载...', 'scrolling=no');
    $.ajax({
      url  : cartHostUrl+'/cart/doSubmit/',
      type : 'POST',
      dataType: 'json',
      data : {gourl:href_url},
      success: function(msg){
        if(msg.error==1){
          top.location.href = href_url;
        }else{
          if(msg.data == 'login'){
            SF.Widget.login(href_url);
          }else{
            jAlert(msg.info);
          }
          //$('.js2').attr('disabled',false);
          $('.jiesuan.youxuan').attr('disabled',false);
          $('.jiesuan.youxuan').val('去结算');
        }
      }
    });
  }
}

function cartJumpHt(){
  if($("input[name='cart_list'][class='haitao']:checked").length==0){
    jAlert("请至少选择一个优选国际商品");	
    return;
  }
  //$('.js2').attr('disabled',true);
  $('.jiesuan.haitao').attr('disabled',true);
  $('.jiesuan.haitao').val('正在提交...');
  if(pp.length>0){
    var cartids = new Array();
    $.each(pp,function(k,v){
      $('#'+v.id).css({ color: "#ff0011", background: "#F5F5DC" });
      cartids.push(v.cartid); 
    })
    var cids = cartids.join(",");
    jConfirm("购物车中存在无法购买的商品不能直接去结算，是否需要系统自动为您取消选择所有无法购买的商品？", '提示消息', function(r){
      if (r){
        $.ajax({
          url  : cartHostUrl+'/cart/goOutSys/',
          type : 'POST',
          data : {cartids:cids},
          dataType: 'json',
          success: function(msg){
            if(msg.error==1){
              top.location.href = cartHostUrl+'/cart/index/';
            }
          }
        });
      }else{
        //$('.js2').attr('disabled',false);
        $('.jiesuan.haitao').attr('disabled',false);
        $('.jiesuan.haitao').val('去结算');
      }
    });

  }else{
	href_url	=	cartHostUrl+'/orderHt/index/';
    //SF.Widget.tbOpen('<strong>正在加载...</strong>', '正在加载...', 'scrolling=no');
    $.ajax({
      url  : cartHostUrl+'/orderHt/doSubmit/',
      type : 'POST',
      dataType: 'json',
      data : {gourl:href_url},
      success: function(msg){
        if(msg.error==1){
          top.location.href = href_url;
        }else{
          if(msg.data == 'login'){
            SF.Widget.login(href_url);
          }else{
            jAlert(msg.info);
          }
          //$('.js2').attr('disabled',false);
          $('.jiesuan.haitao').attr('disabled',false);
          $('.jiesuan.haitao').val('去优选国际结算');
        }
      }
    });
  }	
}

function gosubmit(){
  var href_url = ''
    var value = $("input[name='select_order']:checked").val();
  if(value == 1){
    href_url = cartHostUrl+'/order/index/';
  }else if(value == 2){
    href_url = wwwHostUrl+'/sfvOrder/index/';
  }
  $.ajax({
    url  : cartHostUrl+'/cart/doSubmit/',
    type : 'POST',
    dataType: 'json',
    data : {gourl:href_url},
    success: function(msg){
      if(msg.error==1){
        top.location.href = href_url;
      }else{
        if(msg.data == 'login'){
          SF.Widget.login(href_url);
        }else{
          jAlert(msg.info);
        }
      }
    }
  });
}

function gosubmitHt(){
  var href_url = ''
  var value = $("input[name='select_order']:checked").val();
  href_url = cartHostUrl+'/orderHt/index/';
  $.ajax({
    url  : cartHostUrl+'/orderHt/doSubmit/',
    type : 'POST',
    dataType: 'json',
    data : {gourl:href_url},
    success: function(msg){
      if(msg.error==1){
        top.location.href = href_url;
      }else{
        if(msg.data == 'login'){
          SF.Widget.login(href_url);
        }else{
          jAlert(msg.info);
        }
      }
    }
  });
}

//添加收藏
function favC(id){
  $.post(cartHostUrl+"/favorites/create/product_id/"+ id +"/",{ispresale:0},function(str){
    str = eval('('+str+')');
    if(str.status == 2){
      SF.Widget.login(cartHostUrl+'/cart/index/');
      return;
      //document.location.href = "https://passport.d.com?returnUrl=" + document.location.href;
    }else if(str.status == 1){
      $("#getfavok"+id).slideDown(300,function(){setTimeout(function(){$("#getfavok"+id).slideUp(300)},2000)});
      //	jAlert('该商品收藏成功');
    }else{
      jAlert('添加收藏失败：您已经收藏该商品！');
    }
  });
}

//添加收藏 n元m件商品
function favNM(id){
  $.post(cartHostUrl+"/favorites/create/product_id/"+ id +"/",{ispresale:0},function(str){
    str = eval('('+str+')');
    if(str.status == 2){
      SF.Widget.login(cartHostUrl+'/cart/index/');
      return;
      //document.location.href = "https://passport.d.com?returnUrl=" + document.location.href;
    }else if(str.status == 1){
      $("#getfavoknm"+id).slideDown(300,function(){setTimeout(function(){$("#getfavoknm"+id).slideUp(300)},2000)});
      //	jAlert('该商品收藏成功');
    }else{
      jAlert('添加收藏失败：您已经收藏该商品！');
    }
  });
}

//添加收藏 时令优选
function favC_sfv(id){
  $.post(cartHostUrl+"/favorites/create/product_id/"+ id +"/",{is_sfv:1},function(str){
    str = eval('('+str+')');
    if(str.status == 2){
      SF.Widget.login(cartHostUrl+'/cart/index/');
      return;
      //document.location.href = "https://passport.d.com?returnUrl=" + document.location.href;
    }else if(str.status == 1){
      $("#getsfvfavok"+id).slideDown(300,function(){setTimeout(function(){$("#getsfvfavok"+id).slideUp(300)},2000)});
      //	jAlert('该商品收藏成功');
    }else{
      jAlert('添加收藏失败：您已经收藏该商品！');
    }
  });
}

function yibo(type,product_id,product_num){
  //return;
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
      }

      //商品组一组结束


    }
  });
  // 下面是提交订单代码，此段代码必须放在以上代码后面 - 必填项
  _adwq.push([ '_trackTrans' ]);
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
    $(iframehide).appendTo("#fatherson");
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

//关闭carwindow
function car_close(){
  $("#carwindow").remove();
  $("#fatherson").hide();
  if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
    $("#car_iframe").remove();
  }
}
