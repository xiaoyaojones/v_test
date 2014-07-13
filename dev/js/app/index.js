/*
**index.js
**@Jones Ho
*/

define(function(require,exports) {
	var F = require('md/event.animate') || {},//加載首頁fade/slide所需模塊
		L = require('md/event.lazyimg') || {},//加載lazyimg模塊
		//不支持document.body.classList.add浏览器不加載scroll優化模塊
		S = ('classList' in document.documentElement) ? require('md/event.scroll') : {};

	//创建首页焦点框体lazyimg对象
	var fFadeImg = $('#fadePlayer').find('.fade_layer').find('img');
	var fFadePlayerLazy = new L.FLazyImg(fFadeImg,{
		type: 'assign'
	});
	fFadePlayerLazy.init();

	//創建首頁焦點框thumb list slide對象
	var fFadePlayer = new F.FAnimateEvent('#fadePlayer',{
		type: 1,
		wrapper: 'fade_layer',
		item: 'fade_layer_item',
		curr:0,
		currClass: 'fade_layer_curr',
		auto: 5000,
		prev: 'iconPrev_1',
		next: 'iconNext_1',
		thumbItem: 'fade_switch_item',
		thumbCurr: 'fade_switch_curr',
		titleItem: 'fade_title',
		titleCurr: 'fade_title_curr',
		callback:function (n) {
			fFadePlayerLazy.setImgSrc(n);
		},
		initCallback:function (n) {
			fFadePlayerLazy.setImgSrc(0);
		}
	});

	fFadePlayer.init();


	//創建專題slide動畫對象
	var fCollection = new F.FAnimateEvent('#collPlayer',{
		wrapper: 'collection_list',
		item: 'collection_list_item',
		itemNum: 5,
		prev: 'iconPrev_2',
		next: 'iconNext_2',
		auto: 3000
	});

	fCollection.init();

	//设置次屏图片lazyimg
	var fLazyImg = new L.FLazyImg('img.lazy',{
		showType: 'fadeIn'
	});

	fLazyImg.init();

});