/*
**event.scroll.js
**滾屏優化
**@Jones Ho
*/

define(function(require, exports) {
	
	var enableTimer = 0;

	window.addEventListener('scroll', function() {
		clearTimeout(enableTimer);
		removeHoverClass();

		enableTimer = setTimeout(addHoverClass, 700);
	}, false);

	function removeHoverClass() {
		document.body.classList.remove('noscroll');
	}

	
	function addHoverClass() {
		document.body.classList.add('noscroll');
	}

	addHoverClass();
});
