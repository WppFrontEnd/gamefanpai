'use strict';
(function($){
	var objectOptions = {
		anmiObject:".film",
		index:0,
		clickImgList:[],
		clickTwo:[],
		imgList:null
	};
    
	var Init;
	Init =(function(){
		function Init(element, options){
			this.$settings = $.extend({}, $.fn.fanpai.defaults, options);
            this.$element = $(element);
            this.init(this.$settings, this.$element);
		}

		Init.prototype.init = function($settings, $element){
			//获取图片信息
			var getImgFrom = function(){
				connetWilddog($settings);
			}
			getImgFrom();
		}
		var fanpaiAnim = function(object,event){
			if(event.touches.length<=1){
				if($(object).hasClass("fanzhuan")){
					return;
				}
				$(object).addClass('fanzhuan');
				++objectOptions.index;
				// 获取alt值，判断图片是否相同
				var clickImg = {'objImg':object,'objAlt':getAltForImg(object)};
				if(objectOptions.index%2!=0){
					objectOptions.clickTwo.push(clickImg);
				}else if(objectOptions.index%2==0){
					objectOptions.clickTwo.push(clickImg);
				}
				if(objectOptions.clickTwo.length%2==0){
					objectOptions.clickImgList=objectOptions.clickTwo;
					judgeAlt();
				}
			}else{
				alert('多阳指');
			}
			
		};
		
		var getAltForImg = function(object){
			var alt;
			if($(object).find('img')){
				alt = $(object).find('img').attr('alt');
			}
			return alt;
		}
		var judgeAlt = function(){
			var img1 = objectOptions.clickImgList[0];
			var img2 = objectOptions.clickImgList[1];
			
				if(img1['objAlt']&&img2['objAlt']){
					if(img1['objAlt']==img2['objAlt']){
						$(img1['objImg']).off();
			            $(img2['objImg']).off();
					}else{
						setTimeout(function () { 
					        $(img1['objImg']).removeClass('fanzhuan');
			            	$(img2['objImg']).removeClass('fanzhuan');
					    }, 800);	
					}
					objectOptions.clickTwo.splice(0,2)
					objectOptions.clickImgList.splice(0,2);
				}
			
			
		}
		var connetWilddog = function($settings){
			var ref = new Wilddog("https://homeemail1234.wilddogio.com/fanpai");
				
			// 监听数据
			ref.on("value", function(snapshot) {
				writeDom(sortImg(snapshot.val().data),$settings);

			}, function (errorObject) {
				console.log("The read failed: " + errorObject.code);
			});
		}
		var sortImg = function(objectImg){
			if(objectImg){
				 var length = objectImg.length;
				  var shuffled = Array(length);
				  for (var index = 0, rand; index < length; index++) {
				    rand = ~~(Math.random() * (index + 1));
				    if (rand !== index) 
				      shuffled[index] = shuffled[rand];
				    shuffled[rand] = objectImg[index];
				  }
				return shuffled;
			}
		}
		var writeDom = function(imgList,$settings){
			// 获得一个数据库连接实例
			objectOptions.imgList = imgList;
			if(objectOptions.imgList){
				for(var i=0;i<objectOptions.imgList.length;i++){
					var divCon = document.createElement('div');
					divCon.setAttribute('class','qcontainer');
					$('.'+$settings.parentDiv).append(divCon);
					var divfilm = document.createElement('div');
					divfilm.setAttribute('class','film');
					$(divCon).append(divfilm);
					$(divfilm).on("touchend", function () {
						fanpaiAnim(this,event);
		             });
					var divfront = document.createElement('div');
					divfront.setAttribute('class',['face front']);
					$(divfront).text('翻我翻我');
					$(divfilm).append(divfront);
					var divback = document.createElement('div');
					divback.setAttribute('class',['face back']);
					$(divfilm).append(divback);
					var divimg = document.createElement('img');
					divimg.setAttribute('src','../images/'+objectOptions.imgList[i].url);
					divimg.setAttribute('alt',objectOptions.imgList[i].alt);
					$(divback).append(divimg);
				}
			}
			
		}
		return Init;
	})();
	
	$.fn.fanpai = function(options){
		$.fn.fanpai.defaults = {
			parentDiv:'fanpai-cont'
    	};
		if(options){
			$.extend(objectOptions, options);
		}
		this.each(function(){
			var $me = $(this);
			var instance = $me.data('fanpai');
			if(!instance){
				$me.data('fanpai', new Init(this, options));
			}
		});
	}
	
	
})(jQuery)

	

