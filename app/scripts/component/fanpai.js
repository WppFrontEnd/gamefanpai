'use strict';
(function($){
	var objectOptions = {
		anmiObject:".film",
		index:0,
		clickTwo:[],
		imgList:null,
		anmiEndFlag: false,
		parentDiv:'fanpai-cont',
		anmitClass:'fanzhuan',
		getImgCount:8
	};
    
	var Init;
	Init =(function(){
		function Init(element, options){
            this.$element = $(element);
            this.init(this.$element);
		}

		Init.prototype.init = function($element){
			//获取图片信息
			var getImgFrom = function(){
				connetWilddog();					
			}
			getImgFrom();
		}
		var fanpaiAnim = function(object,event){
			if(event.touches.length<=1){
				if($(object).hasClass(objectOptions.anmitClass)){
					return;
				}
				if(objectOptions.index !=0){
					if(!objectOptions.anmiEndFlag)
					return;
				}
				$(object).addClass(objectOptions.anmitClass);
				objectOptions.anmiEndFlag = false;
				++objectOptions.index;
				// 获取alt值，判断图片是否相同
				var clickImg = {'objImg':object,'objAlt':getAltForImg(object)};
				if(objectOptions.index%2!=0){
					objectOptions.clickTwo.push(clickImg);
				}else if(objectOptions.index%2==0){
					objectOptions.clickTwo.push(clickImg);
					judgeAlt();
				}
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
			var img1 = objectOptions.clickTwo[0];
			var img2 = objectOptions.clickTwo[1];
			
				if(img1['objAlt']&&img2['objAlt']){
					if(img1['objAlt']==img2['objAlt']){
						$(img1['objImg']).off();
			            $(img2['objImg']).off();
					}else{
						setTimeout(function () { 
					        $(img1['objImg']).removeClass(objectOptions.anmitClass);
			            	$(img2['objImg']).removeClass(objectOptions.anmitClass);
					    }, 300);	
					}
					objectOptions.clickTwo.splice(0,2)
				}
			
			
		}
		var connetWilddog = function(){
			var ref = new Wilddog("https://homeemail1234.wilddogio.com/fanpai");
			var imgListWild = null;
			// 监听数据
			ref.on("value", function(snapshot) {
				imgListWild = (snapshot.val().data);
				//抽样
				if(imgListWild){
					var new_val = getRandom({'arry':imgListWild,'range':objectOptions.getImgCount});
					if(new_val){
						writeDom(sortImg(new_val.concat(new_val)));
					}
				}
			}, function (errorObject) {
				console.log("The read failed: " + errorObject.code);
			});
		}
		var getRandom = function(opt) {
		    var old_arry = opt.arry,
		        range = opt.range;
		        console.log(old_arry);
		    //防止超过数组的长度
		    range = range > old_arry.length?old_arry.length:range;
		    var newArray = [].concat(old_arry), //拷贝原数组进行操作就不会破坏原数组
		        valArray = [];
		    for (var n = 0; n < range; n++) {
		        var r = Math.floor(Math.random() * (newArray.length));
		        valArray.push(newArray[r]);
		        //在原数组删掉，然后在下轮循环中就可以避免重复获取
		        newArray.splice(r, 1);
		    }
		    return valArray;
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
		var writeDom = function(imgList){
			// 获得一个数据库连接实例
			objectOptions.imgList = imgList;
			if(objectOptions.imgList){
				for(var i=0;i<objectOptions.imgList.length;i++){
					var divCon = document.createElement('div');
					divCon.setAttribute('class','qcontainer');
					$('.'+objectOptions.parentDiv).append(divCon);
					var divfilm = document.createElement('div');
					divfilm.setAttribute('class','film');
					$(divCon).append(divfilm);
					$(divfilm).on("touchend", function () {
						fanpaiAnim(this,event);
		            }); 
		            divfilm.addEventListener("webkitTransitionEnd", function(){ //动画结束时事件 
						objectOptions.anmiEndFlag = true;
					}, false);
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

	

