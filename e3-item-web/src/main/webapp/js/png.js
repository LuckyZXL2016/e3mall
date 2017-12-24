function correctPNG() // correctly handle PNG transparency in Win IE 5.5 & 6. 
{ 
    var arVersion = navigator.appVersion.split("MSIE") 
    var version = parseFloat(arVersion[1]) 
    if ((version == 6) && (document.body.filters)) 
    { 
       for(var j=0; j<document.images.length; j++) 
       { 
          var img = document.images[j] 
          var imgName = img.src.toUpperCase() 
          if (imgName.substring(imgName.length-3, imgName.length) == "PNG") 
          { 
             var imgID = (img.id) ? "id='" + img.id + "' " : "" 
             var imgClass = (img.className) ? "class='" + img.className + "' " : "" 
             var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
             var imgStyle = "display:inline-block;" + img.style.cssText 
             if (img.align == "left") imgStyle = "float:left;" + imgStyle 
             if (img.align == "right") imgStyle = "float:right;" + imgStyle 
             if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle 
             var strNewHTML = "<span " + imgID + imgClass + imgTitle 
             + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";" 
             + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" 
             + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>" 
             img.outerHTML = strNewHTML 
             j = j-1 
          } 
       } 
    }     
} 
if (window.addEventListener) {  
	window.addEventListener('DOMContentLoaded', correctPNG, false);   //firefox
	window.addEventListener('load', correctPNG, false);
} else if (window.attachEvent)  {
	window.attachEvent('onload', correctPNG);  //IE
} 

//图片延时加载
var fgm = {
	on: function(element, type, handler) {
		return element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent("on" + type, handler)
	},
	bind: function(object, handler) {
		return function() {
			return handler.apply(object, arguments)	
		}
	},
	pageX: function(element) {
		return element.offsetLeft + (element.offsetParent ? arguments.callee(element.offsetParent) : 0)
	},
	pageY: function(element) {
		return element.offsetTop + (element.offsetParent ? arguments.callee(element.offsetParent) : 0)	
	},
	hasClass: function(element, className) {
		return new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className)
	},
	attr: function(element, attr, value) {
		if(arguments.length == 2) {
			return element.attributes[attr] ? element.attributes[attr].nodeValue : undefined
		}
		else if(arguments.length == 3) {
			element.setAttribute(attr, value)
		}
	}
};
//延时加载
function LazyLoad(obj) {
	//this.lazy = typeof obj === "string" ? document.getElementById(obj) : obj;
	//this.aImg = this.lazy.getElementsByTagName("img");
	this.aImg = obj;
	this.fnLoad = fgm.bind(this, this.load);
	this.load();
	fgm.on(window, "scroll", this.fnLoad);
	fgm.on(window, "resize", this.fnLoad);
}
LazyLoad.prototype = {
	load: function() {
		var iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		var iClientHeight = document.documentElement.clientHeight + iScrollTop;
		var i = 0;
		var aParent = [];
		var oParent = null;
		var iTop = 0;
		var iBottom = 0;
		var aNotLoaded = this.loaded(0);
		if(this.loaded(1).length != this.aImg.length) {
			for(i = 0; i < aNotLoaded.length; i++) {
				oParent = aNotLoaded[i].parentElement || aNotLoaded[i].parentNode;
				iTop = fgm.pageY(oParent);
				iBottom = iTop + oParent.offsetHeight;
				if((iTop > iScrollTop && iTop < iClientHeight) || (iBottom > iScrollTop && iBottom < iClientHeight)) {
					aNotLoaded[i].src = fgm.attr(aNotLoaded[i], "data-img") || aNotLoaded[i].src;
					aNotLoaded[i].className = "loaded";
				}
			}
		}
	},
	loaded: function(status) {
		var array = [];
		var i = 0;
		for(i = 0; i < this.aImg.length; i++)
		eval("fgm.hasClass(this.aImg[i], \"loaded\")" + (!!status ? "&&" : "||") + "array.push(this.aImg[i])");
		return array
	}
};

