测试题 by Jones Ho
=============================
介绍测试题所用工具及grunt任务

相关开发工具
-----------------------------
* Grunt
* LESS
* seajs
* jQuery

首页所体现css效果
-----------------------------
* 实行优雅降级策略，以支持css3为主，不支持的浏览器以不影响整体视觉效果为原则

首页所体现js功能
-----------------------------
* #fadePlayer
	- css3 transition
	- img lazyload(初始加载1、2图，自动播放时自动加载下一张img，mouseover到缩略图时加载相关该图及该图下一图)
	- mouseover时停止自动播放
* #collPlayer
	- 自动播放及mouseover时停止自动播放
* img.lazy(scorll按需加载)
* scorll时停止所有动画自动播放及高级浏览器停止所有css附带的:hover效果

Grunt功能
-----------------------------
* 监测LESS\css文件变动，并自动编译LESS->css
* 自动将所需的PNG图合成雪碧图，并制作相关的css文件
* 压缩css文件
* jshint代码检测

Grunt任务指令
-----------------------------
* grunt: - 默认工作流(开发调试向)
	- 清理旧dev目录
	- 雪碧图自动拼合
	- 添加雪碧图时间戳清理缓存
	- jshint检查
	- less文件编译
	- 所需文件移动到dev目录
	- watch(source目录所有文件的监视，jshint + less + sprites + 文件变动)
* grunt:all - 完整发布流
	- 清理旧发布目录
	- 雪碧图自动拼合
	- 添加雪碧图时间戳清理缓存
	- 清理tmp目录
	- less自动编译
	- css压缩
	- 所需文件移动到dist目录


项目目录结构
-----------------------------
###
	template
		├── lib									js库、框架
		│	├── jquery							jquery
		│   │	└── <version>
		│   └── seajs								seajs
		│   	└── <version> 							
		├── source 								源码目录
		│   ├── css									less源碼、sprites.css
		│   ├── images								不需要sprites的图片
		│   ├── js									js源码
		│   │	├──module								seajs module
		│   │	└──app									seajs app
		│   ├── slice								需要sprites的图片与css
		│   ├── data								测试所需数据及图片
		│   └── *.html 								html源码
		├── tmp									临时目录
		│   └── slice								sprites图片及css
		├── dev									开发调试目录
		│   ├── css									
		│   ├── images								
		│   ├── js									
		│   ├── slice								
		│   └── *.html 							
		├── dist								发布目录
		│   ├── css									
		│   ├── images								
		│   ├── js									
		│   ├── slice								
		│   └── *.html 							
		├── Gruntfile.js 							
		└── package.json 							
