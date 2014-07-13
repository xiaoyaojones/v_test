/*
**event.animate.js
**FAnimateEvent slider/fade效果
**@Jones Ho
*/

define(function(require, exports) {
    function FAnimateEvent (selector,params) {
        if (typeof selector === 'undefined') return;

        if (!(selector.nodeType)) {
            if ($(selector).length === 0) return;
        }

        var _this = this;

        var defaults = {
            type: 0,                    //0->slide 1->fade
            eventType: 'click',         //click, mouseenter
            speed: 300,                 //動畫間隔
            wrapper: null,              //父元素
            item: null,                 //子元素
            itemNum: 1,                 //首屏圖片數量
            prev: null,                 //PREV id
            next: null,                 //NEXT id
            auto: 0,                    //自動播放，單位ms，不爲O則自動播放
            curr: null,                 //fade/slide模式:默認顯示的item，從0開始
            currClass: null,            //fade模式:最上層item所應用的className; slide模式，當前curr className.
            initCallback: null,         //初始化執行
            callback: null,             //動畫後執行
            thumbItem: null,
            thumbCurr: null,
            titleItem: null,
            titleCurr: null
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

        _this.wrapper = _this.selector.find('.' + params.wrapper);
        _this.box = _this.wrapper.find('.' + params.item);
        _this.boxLength = _this.box.length;
        _this.boxWidth = _this.box.outerWidth(true);
        _this.initPosLeft = -_this.boxWidth * params.itemNum;

        _this.thumbItem = null;
        _this.titleItem = null;

        _this.bIsAnimating = false;
        _this.bIsOnThumb = false;
        _this.currIndex = null;

        _this.bHasBtn = params.prev !== null && params.next !== null;
        _this.prevBtn = null;
        _this.nextBtn = null;

        _this.TIMER = null;
        _this.BUFFER = null;
        _this.enableTIMRE = null;
        //定義所需變量 end

    }

    FAnimateEvent.prototype = {
        constructor : FAnimateEvent,
        //程序初始化
        init: function () {
            var _this = this;

            switch(_this.params.type){
                case 0:
                    var $clone_first = [],
                        $clone_last = [],
                        $parent = _this.wrapper.parent(),
                        $clone_wrap = _this.wrapper.clone();

                    _this.wrapper.detach();

                    for (var i = 0, j = _this.box.length - 1; i < _this.params.itemNum; i++,j--) {
                        $clone_first.push(_this.box[i]);
                        $clone_last.unshift(_this.box[j]);
                    }

                    $clone_wrap.append($clone_first)
                        .prepend($clone_last);

                    _this.wrapper = $clone_wrap;

                    _this.box = _this.wrapper.find('.' + _this.params.item);
                    _this.boxLength = _this.box.length;

                    if (_this.params.curr === parseInt(_this.params.curr)) {
                        _this.box.eq(_this.params.curr + _this.params.itemNum).addClass(_this.params.currClass);
                    }

                    _this.wrapper.css({
                        width: _this.boxWidth * _this.boxLength,
                        left: _this.initPosLeft
                    });

                    $parent.append(_this.wrapper);
                    break;
                case 1:
                    _this.titleItem = !!_this.params.titleItem ? _this.selector.find('.' + _this.params.titleItem) : null;

                    if (!!_this.params.thumbItem) {
                        _this.thumbItem = _this.selector.find('.' + _this.params.thumbItem);
                        _this.setThumbEvent();
                    }

                    _this.currIndex = _this.params.curr;

                    _this.TIMER = 1;
                    _this.setAnimate(_this.currIndex);

                    break;
                default:
                    console.error('未定義動畫！');
            }

            if (typeof _this.params.initCallback === 'function') {
                _this.params.initCallback();
            }

            if (!!_this.bHasBtn) {
                _this.prevBtn = $('#' + _this.params.prev);
                _this.nextBtn = $('#' + _this.params.next);

                _this.prevBtn.show();
                _this.nextBtn.show();    
            }
              
            if (!!_this.params.auto){
                _this.autoPlay();
            }

            _this.setBtnEvent();
            _this.setItemHover();
            _this.setScrollEvent();
        },

        //定義動畫流程
        setAnimate: function (pos) {//pos:  0->prev, 1->next
            var _this = this;

            if (!!_this.bIsAnimating) { return false; }

            switch(_this.params.type){
                case 0:
                    var _nPos = Math.floor(_this.wrapper.position().left);

                    _this.bIsAnimating = !_this.bIsAnimating;

                    var _move = (pos === 1) ? _nPos - _this.boxWidth :  _nPos + _this.boxWidth;


                    _this.wrapper.animate(
                        { left: _move },
                        _this.params.speed,
                        function () {
                            if (_move === 0) {
                                $(this).css('left', -_this.boxWidth * (_this.boxLength - 2 * _this.params.itemNum));
                            }

                            if (_move === -_this.boxWidth * (_this.boxLength - _this.params.itemNum)) {
                                $(this).css('left', _this.initPosLeft);
                            }

                            if (!!_this.params.auto && !_this.TIMER) { _this.autoPlay(); }

                            _this.bIsAnimating = !_this.bIsAnimating;
                        });

                    break;
                case 1:

                    _this.setCurrent(pos);

                    if (typeof _this.params.callback === 'function') {
                        
                        _this.params.callback(pos + 1);
                    }
                    
                    if (!!_this.params.auto && !_this.TIMER && !this.bIsOnThumb) { _this.autoPlay(); }
                    break;
                default:
                    console.error('未定義動畫！');
            }
            
        },
        //設置縮略圖事件
        setThumbEvent: function () {
            var _this = this;

            _this.selector.delegate('.' + _this.params.thumbItem, 'mouseenter mouseleave', function (e) {
                var _t = $(this),
                    _index = _t.index();
                            
                if (e.type === 'mouseenter') {

                    //若有設置自動播放則停止
                    if (!!_this.params.auto && !!_this.TIMER) { _this.stopAutoPlay(); }

                    _this.bIsOnThumb = !this.bIsOnThumb;

                    if (!!_this.BUFFER) {
                        clearTimeout(_this.BUFFER);
                        _this.BUFFER = null;
                    }

                    _this.BUFFER = setTimeout(function () {
                        //存在currClass則運行
                        if (!!_this.params.currClass) {
                            _this.currIndex = _index;

                            if (typeof _this.params.callback === 'function') {
                                
                                _this.params.callback(_index);
                            }

                            _this.setAnimate(_index);

                        }
                        
                    },300);
                    
                }else{
                    _this.bIsOnThumb = !this.bIsOnThumb;

                    if (!!_this.params.auto && !_this.TIMER) { _this.autoPlay(); }

                    if (!!_this.BUFFER) {
                        clearTimeout(_this.BUFFER);
                        _this.BUFFER = null;
                    }
                }
            });
        },

        //設置有thumb的標題以及樣式
        setCurrent: function(n){
            var _this = this;

            _this.selector.find('.' + _this.params.currClass)
                    .removeClass(_this.params.currClass);

            _this.box.eq(n).addClass(_this.params.currClass);

            if (!!_this.params.thumbCurr) {
                _this.selector
                    .find('.' + _this.params.thumbCurr)
                        .removeClass(_this.params.thumbCurr);

                _this.thumbItem.eq(n).addClass(_this.params.thumbCurr);
            }

            if (!!_this.params.titleCurr) {
                _this.selector
                    .find('.' + _this.params.titleCurr)
                        .removeClass(_this.params.titleCurr);

                _this.titleItem.eq(n).addClass(_this.params.titleCurr);
            }

        },

        //綁定prev/next click事件
        setBtnEvent: function () {
            var _this = this;

            if (!!_this.bHasBtn) {
                this.bIsOnThumb = false;
                _this.prevBtn.on(_this.params.eventType, function (e) {
                    _this.stopAutoPlay();
                    switch(_this.params.type){
                        case 0:
                            _this.setAnimate(0);
                            break;
                        case 1:
                            _this.currIndex = (_this.currIndex > -1) ? --_this.currIndex : _this.boxLength - 1;

                            _this.setAnimate(_this.currIndex);
                            break;
                        default:
                            console.error('未定義動畫！');
                    }
                    
                });

                _this.nextBtn.on(_this.params.eventType, function (e) {
                    _this.stopAutoPlay();
                    switch(_this.params.type){
                        case 0:
                            _this.setAnimate(1);
                            break;
                        case 1:
                            _this.currIndex = (_this.currIndex < _this.boxLength - 1) ? ++_this.currIndex : 0;

                            _this.setAnimate(_this.currIndex);
                            break;
                        default:
                            console.error('未定義動畫！');
                    }
                });    
            }
        },
        
        //設定鼠標enter/leave item時行爲
        setItemHover: function () {
            var _this = this;

            _this.selector.delegate('.' + _this.params.wrapper, 'mouseenter mouseleave', function (e) {
                if (e.type === 'mouseenter') {
                    //若有設置自動播放則停止
                    clearTimeout(_this.enableTIMRE);
                    _this.enableTIMRE = null;
                    if (!!_this.params.auto && !!_this.TIMER) { _this.stopAutoPlay(); }
                }else{
                    //鼠標離開item則繼續自動播放
                    if (!!_this.params.auto && !_this.TIMER) { _this.autoPlay(); }
                }
            });
        },

        //設定scroll時停止自動播放
        setScrollEvent: function () {
            var _this = this;

            if (!!_this.params.auto) {
                
                //滾屏停止autoplay
                $(window).scroll(function () {
                    clearTimeout(_this.enableTIMRE);
                    _this.stopAutoPlay();

                    _this.enableTIMRE = setTimeout(function(){
                        _this.autoPlay();
                    },700);
                    
                });
                   
            }
        },

        //定義自動播放
        autoPlay: function () {
            var _this = this;
            
            switch(_this.params.type){
                case 0:
                    _this.TIMER = setInterval(function () {
                        _this.setAnimate(1);
                    },_this.params.auto);
                    
                    break;
                case 1:
                    _this.TIMER = setInterval(function () {
                        _this.currIndex = (_this.currIndex < _this.boxLength - 1) ? ++_this.currIndex : 0;

                        _this.setAnimate(_this.currIndex);
                    },_this.params.auto);
                    
                    break;
                default:
                    console.error('未定義動畫！');
            }
            
        },

        //暫停自動播放
        stopAutoPlay: function () {
            var _this = this;

            clearInterval(_this.TIMER);
            _this.TIMER = null;
        }


    };

    exports.FAnimateEvent = FAnimateEvent;
});




