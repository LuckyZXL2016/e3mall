<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
   <meta http-equiv="pragma" content="no-cache" />
   <meta http-equiv="cache-control" content="no-cache" />
   <meta http-equiv="expires" content="0" /> 
   <meta name="format-detection" content="telephone=no" />  
   <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" /> 
   <meta name="format-detection" content="telephone=no" />
   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
   <link rel="stylesheet" type="text/css" href="/css/jquery.alerts.css?v=20160713" />
<link rel="stylesheet" type="text/css" href="/css/head.css?v=20160713" />
<link rel="stylesheet" type="text/css" href="/css/newpay.css?v=20160713" />
<script type="text/javascript" src="/js/jquery-1.5.1.min.js?v=20160713"></script>
   <title>订单成功页面 - 宜立方商城</title>
</head> <body id="mainframe">
<!--shortcut start-->
<jsp:include page="commons/shortcut.jsp" />
<!--shortcut end-->
<div class="logoPay">
	<div class="logoPayBox"><a href="http://www.e3mall.cn"><img src="/images/logo.jpg" width="345" height="73" border="0"></a></div>
</div>
<div class="pay_main">
	<div class="pay_newbox">
    	<div class="pay_left">
            <span class="pay_word1">
                <i class="payOkicon"></i>订单提交成功，请您及时付款，以便尽快为您发货~
            </span>
            <span class="pay_word2">请您在提交订单后 <em>4小时</em> 内完成支付，超时订单会自动取消。    订单号：${orderId }</span>
        </div>
        <span class="pay_Rmoney">应付金额 : <em class="pay_price">￥
        <fmt:formatNumber value="${payment}" maxFractionDigits="2" minFractionDigits="2" groupingUsed="true"/>
        </em></span>
    </div>   
	<div class="pay_ment">
            	<div class="pay_name"><em class="floatleft">支付平台</em>
        	<a href="http://www.e3mall.cn/www/143/141.html" class="pay_lj" target="_blank"><i class="floatleft"></i><em class="floatleft">了解银行限额</em></a>
        </div>
        <div class="pay_ment_0 clearfix">
        	<ul>
                    	<li class="pay_posit ">
                	                    <a href="javascript:void(0)" class="border"><img src="/images/pay/pay0.jpg" alt="0"><div class="pay_tips1" style="display: none"></div></a>
                                    </li> 
                    	<li class="pay_posit ">
                	                    <a href="javascript:void(0)" class="borderOn"><img src="/images/pay/pay1.jpg" alt="1"><div class="pay_tips1" style="display: block"></div></a>
                                    </li> 
                    	<li class="pay_posit ">
                	                    <a href="javascript:void(0)" class="border"><img src="/images/pay/pay4.jpg" alt="4"><div class="pay_tips1" style="display: none"></div></a>
                                    </li> 
                    	<li class="pay_posit ">
                	                    <a href="javascript:void(0)" class="border"><img src="/images/pay/pay23.jpg" alt="23"><div class="pay_tips1" style="display: none"></div></a>
                                    </li> 
                    	<li class="pay_posit ">
                	                    <a href="javascript:void(0)" class="border"><img src="/images/pay/pay2.jpg" alt="2"><div class="pay_tips1" style="display: none"></div></a>
                                    </li> 
            
            	            </ul>
        </div>
                        <div class="pay_name pay_m1">支付网银</div>
        <div class="pay_ment_0 clearfix">
        	<ul>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay8.jpg" alt="8"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay9.jpg" alt="9"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay10.jpg" alt="10"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay11.jpg" alt="11"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay12.jpg" alt="12"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay13.jpg" alt="13"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay14.jpg" alt="14"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay15.jpg" alt="15"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay16.jpg" alt="16"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay17.jpg" alt="17"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay18.jpg" alt="18"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay19.jpg" alt="19"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h "><a href="javascript:void(0)" class="border"><img src="/images/pay/pay20.jpg" alt="20"><div class="pay_tips3" style="display: none"></div></a></li>
                        	<li class="pay_posit li_h hide" style="display: list-item;"><a href="javascript:void(0)" class="border"><img src="/images/pay/pay21.jpg" alt="21"><div class="pay_tips3" style="display: none"></div></a></li>
                       		<li class="pay_more" style="display: none;"><a href="javascript:void(0)" class="ac_pay_more">展开更多银行<i class="pay_moreIcon"></i></a></li> 
                        	<li class="pay_posit li_h hide" style="display: list-item;"><a href="javascript:void(0)" class="border"><img src="/images/pay/pay22.jpg" alt="22"><div class="pay_tips3" style="display: none"></div></a></li>
                        	            </ul>
        </div>
                <div class="pay_btn"><a href="javascript:void(0)" id="prompt_pay_submit">立即支付</a><span></span></div>
    </div>
</div>
<jsp:include page="commons/footer.jsp"></jsp:include>
<!-- footer end -->
     </body> 
</html>