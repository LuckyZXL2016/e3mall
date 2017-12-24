$(document).ready(function(){
	$("#div_topmenu li.li1,#div_topmenu li.li2,#div_topmenu li.li3").hover(
	  	function(){
	  		$(this).children(".dropdown").stop(true,true).fadeIn(500);
	  		
	  	},
		function(){
			$(".dropdown").hide();	
			refresh_header_cart_total_number();
		}
	 );
	 
	 $("#header-login-btn").click(function(){
	 	var user_name = $("#header-login-username").val();
	 	var password = $("#header-login-password").val();
	 	if (user_name == "") {
	 		$("#header-login-username").css("border-color", "red");
	 		$("#header-login-username").focus();
	 		return ;
	 	}
	 	else {
	 		$("#header-login-username").css("border-color", "#BBB");
	 	}
	 	if (password == "") {
	 		$("#header-login-password").css("border-color", "red");
	 		$("#header-login-password").focus();
	 		return ;
	 	}
	 	else {
	 		$("#header-login-password").css("border-color", "#BBB");
	 	}
	 	
	 	$.ajax({
	 		type: "GET",
	 		url: "/user.php",
			data: "act=ajax_login&username="+user_name+"&password="+password,
			beforeSend: function(XMLHttpRequest) {
				$("#login_form").show();
				$("#header-login-loading-img").show();
			},
			success: function(data){
				if (data == 1) {
					$("#login").html($("#header-login-success").html());
				}
				else {
					$("#header-login-username").css("border-color", "red");
					$("#header-login-password").css("border-color", "red");
					$("#header-login-loading-img").hide();
				}
			}
	 	});
	 	
	 	

	 });
	 
	 $("#cart a").hover(
	 	function(){
	 		refresh_header_cart();
	 		refresh_header_cart_total_number();
	 	},
	 	function(){
	 			
	 	}
	 );
	 
	 $(".goToTop").click(function(){
	 	/* $("body").scrollTop(0); */
	 	window.scrollTo(0,0);
	 });
	 
	 $("#keyword").focus(function(){
	 	$("#a_search_form").show(500);	
	 });
	 
	 $("#a_search").hover(function(){
	 	$("#a_search_form").show(500);	
	 });
	 
	 $("#search_close_btn").click(function(){
	 	$("#a_search_form").hide(500);		
	 });
  
});

function refresh_header_cart() {
	$.ajax({ 
		type: "GET",
		url: "/cart_goods_ajax.php", 
		data: "t=goods_list",
		beforeSend: function () {
			$("#header-cart-loading-img").show();	
		},
		success: function(data){
	    	$("#header-cart-loading-img").hide();
	    	$("#cart_form").html(data);
		}
	});	
}

function refresh_header_cart_total_number() {
	$.ajax({ 
		type: "GET",
		url: "/cart_goods_ajax.php", 
		data: "t=total_number",
		success: function(data){
			var data1 = parseInt(data);
	    	$("#top-cart-num").html(data1);
		}
	});	
}

function delete_cart_goods(recId) {
	if (recId > 0) {
		$.ajax({ 
			type: "GET",
			url: "/cart_goods_ajax.php", 
			data: "t=delete_goods&rec_id="+recId,
			success: function(data){
				refresh_header_cart();
			}
		});
	}
	else {
		alert("unknown error! Please try again later!");
		return ;	
	}
}
