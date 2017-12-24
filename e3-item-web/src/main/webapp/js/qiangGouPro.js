// JavaScript Document 商品详情页抢购倒计时
var nowtimes;	//当前时间戳
var startTime;	//开始时间
var stopTime;	//结束时间
var productid;	//商品ID
var isasync = (isasync == false) ? false : true;
/**
 * 当前页面时钟
 * @param _stoday 当前服务器时间戳
 */
function clockWeb(){
	nowtimes = Number(nowtimes) + 1000; //当前时间戳
	if(nowtimes>=startTime && nowtimes<=stopTime){
		clockRun = window.setTimeout("clockWeb()",1000);
	}else{
		qiangGou();
	}
}


/**
 * 修改剩余时间
 **/
function editOverplus(){
	var theDays = Number(stopTime);
	var seconds = (theDays - nowtimes)/1000;
	var minutes = Math.floor(seconds/60);
	var hours = Math.floor(minutes/60);
	var days = Math.floor(hours/24);
	var CDay= days;
	var CHour= hours % 24;
	var CMinute= minutes % 60;
	var CSecond= seconds % 60;
	
	if(CMinute < 10) {
		CMinute = "0" + CMinute;
	}
	if(CHour < 10) {
		CHour = "0" + CHour;
	}
	if(CSecond<10) {
		CSecond = "0" + CSecond;
	}
	//显示倒计时
	
	$("#showDays").html(CDay);
	$("#showHour").html(CHour);
    $("#showMin").html(CMinute);
    $("#showSencond").html(CSecond);
    
    if(CHour=='00' && CMinute=='00' && CSecond=='00') {
    	//时间到自动刷新页面
		qiangGou();
	}else{
		//如果剩余分钟零秒时检查是否抢完
		editRun = window.setTimeout("editOverplus()",1000);
	}
}


/**
 * 抢购
 */
function qiangGou(){
	$.ajax({
		type: "POST",
		async: isasync,
		dataType: "json",
		url: "/ajax/getQingGouByPid",
		data: "productid="+productid,
		success: function(str){
			if(str.status){
				nowtimes = Number(str.nowtimes + '000');
				startTime = Number(str.startTime + '000');
				stopTime = Number(str.stopTime + '000');
				clockWeb();
				htmlstr = '<li>抢购价：<font class="li_text3">￥</font><font id="price" class="li_text4"><font size="10" color="red">'+str.price+'</font>元</font>';
				htmlstr += '<span class="cp_qianggou">剩余时间：<font class="cp_qiangtime" id="showDays">00</font>天';
				htmlstr += '<font class="cp_qiangtime" id="showHour">00</font>小时<font class="cp_qiangtime" id="showMin">00</font>分';
				htmlstr += '<font class="cp_qiangtime" id="showSencond">00</font>秒</span></li>'
				htmlstr += '<li><font class="li_text5">优选价：￥'+str.sfprice+'</font> 元</li>';
				htmlstr += '<script language="javascript">editOverplus();</script>';
				//$("#adword").html("("+str.ad_word+")");
				$("#price").html(htmlstr);
			}else{
				str = '<li>优 选 价：<font class="li_text3">￥</font><font id="price" class="li_text4"><font size="10" color="red">'+str.sfprice+'</font>元</font></li>';
				$("#price").html(str);
			}
		}
	});
}