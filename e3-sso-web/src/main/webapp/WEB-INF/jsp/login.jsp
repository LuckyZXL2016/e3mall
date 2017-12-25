<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312"/>
    <title>登录淘淘</title>
       <link rel="stylesheet" type="text/css" href="/css/jquery.alerts.css" />
<link rel="stylesheet" type="text/css" href="/css/headerfooterindex.css" />
<link rel="stylesheet" type="text/css" href="/css/login.css" />
<script type="text/javascript" src="/js/jquery-1.5.1.min.js"></script>
<script type="text/javascript" src="/js/jquery.cookie.js"></script>
<script type="text/javascript" src="/js/jquery.alerts.js"></script>
<script type="text/javascript" src="/js/png.js"></script>
<script type="text/javascript" src="/js/cas.login.js"></script>
<script type="text/javascript" src="/js/capsLock.js"></script>
</head>
<body>
	<!-- header -->
	<div class="header">
		<a href="http://www.e3mall.cn"><img src="/images/logo.png" border="0"><span>欢迎登录</span></a>
	</div>
	<!-- login_main -->
	<div class="login_main clear">
		<div class="pic">
			<a href="http://www.e3mall.cn/html/activity/1472720729.html" target="_blank"><img src="/images/06f42c372620f92b40da77a8b23cdf7f.png"></a>
		</div>
		<!-- login -->
		<div class="login">
			<div class="login_header">
    	<span>您还未登录</span>
    	<a href="/page/register">免费注册</a>
    </div>

			<div class="login_box clear">
				<ul class="loginnav">
					<li class="curr" mark="sfbest"><em></em>优选账号</li>
				</ul>

				<div class="logincon">
					<ul>
					<form id="formlogin" method="post" >
						<div style="display:none;">
              					 
       						 </div>
						<li style="display:none;"><span class="title">BGCode</span>
						    <span class="border">
						     <input type="hidden" name="bgcode" id="bgcode" value="sfbest" class="loginText">
						        <em class="icon1" id="bgcode_em"></em>
							
							</span>
						    <span id="uNameErr"></span>
						</li>
						<li><span class="title">手机/验证邮箱/用户名<font style="padding-left:20px" class="error_line" color="#ff0000"></font></span>
						    <span class="border" style="position:relative">
						<input id="username" name="username" type="hidden" accesskey="n" value="" size="25" autocomplete="off">
						<input class="new-input1 new-color" tabindex="1" data-clear-btn="true" id="loginname" size="25" autocomplete="off" htmlescape="true" title="请输入用户名">
		
						
						     <em class="icon1" id="usernamelogo"></em>
						<span style="position: absolute; font-size: 14px; left: 5px; top: 9px;display:none;" class="sfbest_username_place">请输入手机号/邮箱/用户名</span>
							</span>
						    <span id="sfbestNameErr"></span>
							
							
						</li>
						
						<li class="m-t12">
							<span class="title">登录密码</span> 
							<span class="border" style="position:relative">
								<input id="password" name="password" class="required" tabindex="2" type="password" value="" autocomplete="off">
							    <em class="icon2" id="passwordlogo"></em>
						<span style="position: absolute; font-size: 14px; left: 5px; top: 9px;display:none;" class="sfbest_password_place">密码</span>
							</span> 
							<span id="sfbestPwdErr"></span>
						</li>
						<div class="clear"></div>
						<li>
							<div style="width: 65px; margin-left: 260px;">
								<a href="https://passport.e3mall.cn/reg/findpass/?returnUrl=http://www.e3mall.cn" class="forget-passWord">忘记密码?</a>
							</div>
						</li>
						<li class="m-t5" id="btn_sub">
							<input type="hidden" name="lt" value="LT-7055357-If097ZfAK0WqnrgGeScsi6SndWWZFv-sfbest">
							<input type="hidden" name="execution" value="2b2fc397-b952-4639-b3c3-4aecf3ab23b8_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">
							<input type="hidden" name="_eventId" value="submit">
							
							<a href="javascript:void(0)" id="login_sub" class="login_btn">登录</a>
						</li>
					<div>
</div></form>
					</ul>
				</div>


				<ul class="blink">
					<li class="p-f10">
						<h2 class="h2">合作网站账户登录：</h2>
						<div>
							<a href="http://api2.e3mall.cn/unionlogin/qq/oauth/qq_login.php?returnUrl=http://www.e3mall.cn/" class="link">QQ</a>&nbsp;|&nbsp; <a href="https://api.weibo.com/oauth2/authorize?client_id=1800908332&amp;redirect_uri=https%3A%2F%2Fpassport.e3mall.cn%2Fcallback%2Fsina&amp;response_type=code&amp;state=&amp;display=?returnUrl=http://www.e3mall.cn/" class="link">新浪微博</a> &nbsp;|&nbsp; <a href="https://open.t.qq.com/cgi-bin/oauth2/authorize?client_id=801198099&amp;redirect_uri=https%3A%2F%2Fpassport.e3mall.cn%2Fcallback%2Fqq&amp;response_type=code&amp;type=?returnUrl=http://www.e3mall.cn/" class="link">腾讯微博</a> &nbsp;|&nbsp; <a href="http://api2.e3mall.cn/unionlogin/alipay.php?returnUrl=http://www.e3mall.cn/" class="link">支付宝</a>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<!-- /login -->
	</div>
	<!-- /login_main -->
	<div class="footer">
		<span> <a href="http://www.e3mall.cn/www/379/5109.html" rel="nofollow" class="footerlink1">关于我们</a> | <a href="http://www.e3mall.cn/www/380/5116.html" rel="nofollow" class="footerlink1">联系我们</a> | <a href="http://www.e3mall.cn/www/381/5117.html" rel="nofollow" class="footerlink1">招聘人才</a> | <a href="http://www.e3mall.cn/www/330/2705.html" rel="nofollow" class="footerlink1">友情链接</a> | <a href="http://supplier.e3mall.cn/supplierApply" rel="nofollow" class="footerlink1">供应商申请</a>
		</span>
		<p>
			北京宜立方电子商务有限公司<br> 北京市公安局顺义分局备案11011302000890号|<a href="http://www.miibeian.gov.cn" target="_blank" rel="nofollow" class="footerlink1">京ICP备12011349号</a>|<a href="http://www.e3mall.cn/www/174/461.html" target="_blank" rel="nofollow" class="footerlink1">企业营业执照</a><br> Copyright© 宜立方商城
			e3mall.cn 版权所有<br>
		</p>
	</div>
	<!-- /footer -->
	<script type="text/javascript">
	var redirectUrl = "${redirect}";
	var LOGIN = {
			checkInput:function() {
				$("#sfbestNameErr").attr("class", "").html("").prev().attr("class", "border");
				$("#sfbestPwdErr").attr("class", "").html("").prev().attr("class", "border");
				
				if(!$("#formlogin #loginname").val()) {
					$("#sfbestNameErr").attr("class", "error").show().html("请输入用户名").prev().attr("class", "border-error");
					return false;
				}
				if(!$("#formlogin input[name='password']").val()) {
				    $("#sfbestPwdErr").attr("class", "error").show().html("请输入密码").prev().attr("class", "border-error");
			        return false;
				}
				$("#username").val($("#loginname").val());
				return true;
			},
			doLogin:function() {
				$.post("/user/login", $("#formlogin").serialize(),function(data){
					if (data.status == 200) {
						jAlert('登录成功！',"提示", function(){
							if (redirectUrl == "") {
								location.href = "http://localhost:8082";
							} else {
								location.href = redirectUrl;
							}
						});
						
					} else {
						jAlert("登录失败，原因是：" + data.msg,"失败");
					}
				});
			},
			login:function() {
				if (this.checkInput()) {
					this.doLogin();
				}
			}
		
	};
	$(function(){
		$("#login_sub").click(function(){
			LOGIN.login();
		});
	});
</script>

</html>