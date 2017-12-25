/*
 * 地区联动菜单 
 * 
 * @author: zhangliping
 * 
 * 使用方法：
 * $.region({param:value});
 * 参数说明：
 * province: 初始化省，默认空
 * city: 初始化市，默认空
 * county: 初始化区县，默认空
 * returnProvince: 需要返回的省的表单名称，默认是province
 * returnCity: 需要返回的市的表单名称，默认是city
 * returnCounty: 需要返回的区县的表单名称，默认是conunty
 * container: 要插入的容器ID，默认是region
 * serverUrl: 服务器端的URL地址，默认是 /region/getRegion
 */
(function($){
	var region = {
	        version: '1.0.0',
	        defaults : {
				'province' 	: '',
				'city' 	: '',
				'county' 	: '',
				'returnProvince' 	: 'province',
				'returnCity' 	: 'city',
				'returnCounty' 	: 'county',
				'container' 	: 'region',
				'serverUrl'		: '/region/dynamicRegion',
				'beforeClose' 	: null
	        },
	        settings : {}
	    };

	$.extend({  
	    region: function(options){
		
			region.settings = $.extend({},region.defaults,options);
			
			var html = '<select name="'+region.settings.returnProvince+'" id="region_province"><option value="">请选择省</option></select>'+
				'<select name="'+region.settings.returnCity+'" id="region_city"><option value="">请选择市</option></select>'+
				'<select name="'+region.settings.returnCounty+'" id="region_county"><option value="">请选择县</option></select>';
			$('#'+region.settings.container).html(html);
			
			$('#region_province').change(function(){
				$.post(
					region.settings.serverUrl,
				  	{parent_id:$(this).val()},
				  	function(data){
					  	jQuery('#region_city').html('');
					  	jQuery('#region_city').append('<option value="">请选择市</option>');
					  	jQuery('#region_city').append(data);

					  	if(region.settings.city != ''){
					 		$('#region_city').val(region.settings.city);
					 		$('#region_city').change();
					 	}
				  	}
				);
			}); 
			$('#region_city').change(function(){
				$.post(
					region.settings.serverUrl,
				  	{parent_id:$(this).val()},
				  	function(data){
					  	jQuery('#region_county').html('');
					  	jQuery('#region_county').append('<option value="">请选择区县</option>');
					  	jQuery('#region_county').append(data);

					  	if(region.settings.county != ''){
					 		$('#region_county').val(region.settings.county);
					 	}
				  	}
				);
			});
			
			//获取省
			$.post(
				region.settings.serverUrl,
				{parent_id:1},
				function(data){
				 	jQuery('#region_province').html('');
				 	jQuery('#region_province').append('<option value="">请选择省</option>');
				 	jQuery('#region_province').append(data);
				 	
				 	if(region.settings.province != ''){
				 		$('#region_province').val(region.settings.province);
				 		$('#region_province').change();
				 	}
				}
			);			
		}
	});
})(jQuery);