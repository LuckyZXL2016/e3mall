<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="Cache-Control" content="no-cache,must-revalidate">
    <title>注册-个人用户</title>
    <link rel="stylesheet" type="text/css" href="/css/headerfooter.css" />
<link rel="stylesheet" type="text/css" href="/css/jquery.alerts.css" />
<link rel="stylesheet" type="text/css" href="/css/headerfooterindex.css" />
<script type="text/javascript" src="/js/jquery-1.5.1.min.js"></script>
<script type="text/javascript" src="/js/jquery.cookie.js"></script>
<script type="text/javascript" src="/js/passport.common.js?v20140531"></script>
<script type="text/javascript" src="/js/jquery.alerts.js"></script>
<script type="text/javascript" src="/js/png.js?v20140521"></script>
</head>
<body>
		<!-- header -->
		<div class="header">
			<a href="http://www.e3mall.cn"><img src="/images/logo.png" border="0" /><span>欢迎注册</span></a>
		</div>

		<!--mainStart-->
						<link rel="stylesheet" type="text/css" href="/css/reg.css?v20140432" />
<script type="text/javascript" src="/js/allMail.js?v20140430"></script>
<script type="text/javascript" src="/js/reg.js?v20150122"></script>
<!-- reg_main -->
<div class="tabBox clear">
    <span class="reg_hide reg_show regMr5" id="regper">个人用户</span>
    <span class="reg_hide" id="regcom" style="">企业用户</span>    <div class="login">已有账号，立即 <a href="/page/login">登录</a></div>
</div>
<!--个人用户-->
<div class="reg_main reg_border regTab" id="perDiv">
    <ul class="individualUserBg">
        <form id="regForm_mod" name="regForm_mod" method="post"  >

            <li class="regMb30">
                <label><font>*</font> 账户名：</label>
            <span class="regM defaultBorder">
            	<input id="regName" name="username"  class="regInput" type="text" onkeyup="mail_div(event);" onfocus="showtip('regName','userMamErr',8);" onblur="ckmem();" autocomplete="off" maxlength="80"/>
				<em></em>
            </span>
                <span class="regInput" id="userMamErr"></span>
            </li>
            <div node-type="layer" class="accountSearch" style="display:none;" id="person_mail"></div>
            <li>
                <label><font>*</font> 登录密码：</label>
            <span class="regM defaultBorder">
            	<input id="pwd" name="password" class="regInput" autocomplete="off" type="password" onfocus="showPwdtip('password','passwordErr',2);"  onkeyup="ckpwd(0,1);" onblur="ckpwd(0,0);"/>
            	<em ></em>
            </span>
                <span class="regInput" id="passwordErr"></span>
            </li>
            <li class="safetyLayer regPl191" id="pwdStrong">
                <font style="font-size:12px;">安全程度：</font><em class="default">弱</em><em class="default">中</em><em class="default">强</em>
            </li>

            <li class="regMb30">
                <label><font>*</font> 确认密码：</label>
            <span class="regM defaultBorder">
            	<input id="pwdRepeat" name="password2" autocomplete="off" class="regInput" type="password" onfocus="showtip('password2','password2Err',3);" onblur="ckpwd2();"/>
            	<em></em>
            </span>
                <span class="regInput" id="password2Err"></span>
            </li>
            <li class="regMb30">
                <label><font>*</font> 验证手机：</label>
            <span class="regM defaultBorder">
            	<input id="phone" name="phone" autocomplete="off" class="regInput" type="text" maxlength="11" onfocus="showtip('phone','phoneErr',1);" onblur="$('#phoneErr').html('')"/>
            	<em></em>
            </span>
                <span class="regInput" id="phoneErr"></span>
            </li>

            

            <li class="regPl88">
			<span  class="regM" style="margin-left:29px">
				<input id="AgreeId" name="AgreeId" type="checkbox" checked="" onclick="ckAgree();">
				<a href="https://passport.e3mall.cn/xy.html" target="_blank"  class="checkTitle">我已阅读并同意<font style="font-size:12px;">《宜立方商城用户注册协议》</font></a>
			</span>
                <span  id="AgreeIdErr" ></span>
            </li>
            <li class="register regPl88 regMt10" id="sub_per" style="margin-left:29px">
                <input type="hidden" id="tjuid" name="tjuid" value="">
                <a href="javascript:void(0);" class="registerNow" id="reg_per_data" onclick="REGISTER.reg()">立即注册</a>
            </li>
            <br /><br />
        </form>
    </ul>
    <div class="ui-reg-tip"><a href="http://help.e3mall.cn/140/6788.html" target="_blank">了解更多>></a></div>
</div>

<!--mainOver-->

		<!--footerStart-->
		<div class="footer">
			<span>
				<a href="http://www.e3mall.cn/www/379/5109.html" rel="nofollow" class="footerlink1">关于我们</a> | 
				<a href="http://www.e3mall.cn/www/380/5116.html" rel="nofollow" class="footerlink1">联系我们</a> | 
				<a href="http://www.e3mall.cn/www/381/5117.html" rel="nofollow" class="footerlink1">招聘人才</a> | 
				<a href="http://www.e3mall.cn/www/330/2705.html" rel="nofollow" class="footerlink1">友情链接</a> | 
				<a href="http://supplier.e3mall.cn/supplierApply" rel="nofollow" class="footerlink1">供应商申请</a>
			</span>
			<p> 
				北京宜立方电子商务有限公司<br />
				北京市公安局顺义分局备案11011302000890号|<a href="http://www.miibeian.gov.cn" target="_blank" rel="nofollow" class="footerlink1">京ICP备12011349号</a>|<a href="http://www.e3mall.cn/www/174/461.html" target="_blank" rel="nofollow" class="footerlink1">企业营业执照</a><br />
				Copyright© 宜立方商城 e3mall.cn 版权所有<br /> 
			</p>
		</div>
		<!-- /footer -->
<script type="text/javascript">
	var REGISTER={
		param:{
			//单点登录系统的url
			surl:""
		},
		inputcheck:function(){
			var flag = true;
			//不能为空检查
			if ($("#regName").val() == "") {
				showError("regName","userMamErr",defaultArr[8]);
				flag = false;
			}
			if ($("#pwd").val() == "") {
				showError("pwd","passwordErr",pwdArr[0]);
				flag = false;
			}
			if ($("#phone").val() == "") {
				showError("phone","phoneErr",memArr[0]);
				flag = false;
			}
			//密码检查
			if ($("#pwd").val() != $("#pwdRepeat").val()) {
				showError("pwdRepeat","password2Err",pwd2Arr[1]);
				flag = false;
			}
			return flag;
		},
		beforeSubmit:function() {
				//检查用户是否已经被占用
				$.ajax({
	            	url : REGISTER.param.surl + "/user/check/"+escape($("#regName").val())+"/1?r=" + Math.random(),
	            	success : function(data) {
	            		if (data.data) {
	            			//检查手机号是否存在
	            			$.ajax({
	            				url : REGISTER.param.surl + "/user/check/"+$("#phone").val()+"/2?r=" + Math.random(),
				            	success : function(data) {
				            		if (data.data) {
					            		REGISTER.doSubmit();
				            		} else {
				            			showError("phone","phoneErr",defaultArr[9]);
				            		}
				            	}
	            			});
	            		} else {
	            			showError("regName","userMamErr",defaultArr[10]);
	            		}	
	            	}
				});
	            	
		},
		doSubmit:function() {
			$.post("/user/register",$("#regForm_mod").serialize(), function(data){
				if(data.status == 200){
					jAlert('用户注册成功，请登录！',"提示", function(){
						REGISTER.login();
					});
				} else {
					jAlert("注册失败！","提示");
				}
			});
		},
		login:function() {
			 location.href = "/page/login";
			 return false;
		},
		reg:function() {
			if (this.inputcheck()) {
				this.beforeSubmit();
			}
		}
	};
</script>
	</body>
</html>
