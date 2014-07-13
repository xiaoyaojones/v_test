/*
**event.lazyimg.js
**FLazyImg 图片lazyload效果
**@Jones Ho
*/

define(function(require,exports) {
	function FLazyImg(selector,params) {
        if (typeof selector === 'undefined') return;

        if (!(selector.nodeType)) {
            if ($(selector).length === 0) return;
        }

        var _this = this;

        var defaults = {
        	dataSrc: 'data-original',		//緩存圖片地址
        	type: 'scroll',					//显示模式 scroll:滚屏区域显示  assign:指定显示模式
        	showType: 'show',				//圖片顯示效果 show、fadeIn
            speed: 300	                	//動畫間隔
        };

        params = params || {};
        for (var prop in defaults) {
            if (prop in params && typeof params[prop] === 'object') {
                for (var subProp in defaults[prop]) {
                    if (! (subProp in params[prop])) {
                        params[prop][subProp] = defaults[prop][subProp];
                    }
                }
            }
            else if (! (prop in params)) {
                params[prop] = defaults[prop];
            }
        }

        //定義所需變量 start
        _this.params = params;

        _this.selector = selector = $(selector);

        
        //定義所需變量 end


    }

    FLazyImg.prototype = {
    	constructor: FLazyImg,
    	//程序初始化
    	init: function () {
    		var _this = this,
    			_data = {};

    		_this.cache = [];

    		$.each(_this.selector,function (i) {
    			var _t = _this.selector.eq(i);

    			_data = {
    				obj: _t,
    				url: _t.attr(_this.params.dataSrc),
    				top: _t.offset().top,
    				height: _t.outerHeight(true)
    			};

    			_this.cache.push(_data);
    		});

    		if (_this.params.showType === 'fadeIn') {
    			_this.selector.hide();
    		}

    		var TIMER = null;

    		if (_this.params.type === 'scroll') {
    			$(window).scroll(function () {
    				if(!!TIMER){
    					clearTimeout(TIMER);
    					TIMER = null;
    				}
    				TIMER = setTimeout(function () {
    					_this.scrollToObj();
    				},20);
    				
    			});
                _this.scrollToObj();
    		}

    	},

        //設置img src
    	setImgSrc: function (index) {
    		if (!this.cache[index]) {return false;}

    		var _this = this,
    			_data = this.cache[index],
    			_item = _data.obj,
    			_src = _data.url;

    		if (!!_item) {
    			_item.attr('src', _src);
    		}else{
    			return false;
    		}

    		switch(_this.params.showType){
    			case 'fadeIn':
	    			_item.fadeIn(_this.params.speed);
		    		break;
		    	case 'show':
		    		_item.show();
		    		break;
		    	default:
		    		console.error('未定義行爲！');
    		}
    		
    	},

        //監測是否到達所需顯示的圖片位置
		scrollToObj: function () {
			var _this = this;

			var $win = $(window),
				winHeight = $win.height(),
				winSctop = $win.scrollTop();

            for (var i = 0, data = _this.cache, j = data.length; i < j; i++) {
                var _obj = data[i].obj || null,
                    _url = data[i].url,
                    _obj_pos,
                    _obj_pos_bt;

                if (!!_obj && !!_url) {
                    _obj_pos = data[i].top - winSctop;
                    _obj_pos_bt = _obj_pos + data[i].height;

                    if ((_obj_pos >= 0 && _obj_pos < winHeight) || (_obj_pos_bt >= 0 && _obj_pos_bt <= winHeight)) {
                        _this.setImgSrc(i);
                        data[i].obj = null;
                    }


                }
            }
			
		}


    };

    exports.FLazyImg = FLazyImg;

});