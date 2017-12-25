<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="pragma" content="no-cache" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<meta name="format-detection" content="telephone=no" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta name="format-detection" content="telephone=no" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="/css/common.css?v=20160713" />
<link rel="stylesheet" type="text/css" href="/css/all.css?v=20160713" />
<link rel="stylesheet" type="text/css" href="/css/jquery.alerts.css" />
<title>出错了 -宜立方商城</title>
<jsp:include page="../commons/header.jsp" />
<jsp:include page="../commons/mainmenu.jsp" />
<body>
	<div id="main">
		<!----submenu------->
		<div class="pbox">
			<div class="error_cont">
				<div class="error_box">
					<img src="/images/error_img.jpg">
						<h2>HTTP错误 404 - 文件或目录未找到</h2>
						<p>
							<span id="totalSecond">2</span>秒后自动跳转到首页，如不自动跳转，请按<a
								href="http://www.e3mall.cn/">回到首页</a>
						</p>
						<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>
			<!----mainOver------>
			<div class="clear1"></div>
		</div>
	</div>
	<!-- footer start -->
	<jsp:include page="../commons/footer.jsp" />
	<!-- footer end -->
</body>
</html>