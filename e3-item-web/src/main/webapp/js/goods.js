/**
 * 商品页 js
 *
 * @author    wanglibing <toowind007@gmail.com>
 * @version    $Id: goods.js 5576 2013-09-04 01:45:51Z liweigang $
 */
function giftImg(obj){
		$(obj).children(".giftimg").show();
		$(obj).siblings().children(".giftimg").hide();
}
$(document).ready(function() {
    $(".pTab li").click(function(){
		var len = $(".pTab li").length;
	    $This=$(this).index();
		$(this).addClass("curr").siblings().removeClass("curr");
		$(".pCont").hide();
		$(".pCont:eq("+$This+")").show();
		if(len > 4){
			if ($This < 3){
				$(".pCont:gt(2)").show();
			}
		}else if(len > 3){
			if ($This < 2){
				$(".pCont:gt(1)").show();
			}
		}else{
			if ($This < 1){
				$(".pCont:gt(0)").show();
			}	
		}
	});	
	
	
	
			//显示隐藏元素
	function thisdisplay(id,tag){
		if(document.getElementById(id)){
			var oBox=document.getElementById(id);
			var aDiv=oBox.getElementsByTagName(tag)
			oBox.onmouseover=function(){
				aDiv[0].style.display="block"
			}
			oBox.onmouseout=function(){
				aDiv[0].style.display="none"
			}
	    }
	}
	thisdisplay('minisite','div');
})