/*! This file is created by lancelou */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _fileOperate = __webpack_require__(1);

	var _fileOperate2 = _interopRequireDefault(_fileOperate);

	var _mouseDownMove = __webpack_require__(3);

	var _mouseDownMove2 = _interopRequireDefault(_mouseDownMove);

	var _imgClip = __webpack_require__(4);

	var _imgClip2 = _interopRequireDefault(_imgClip);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
		文件读取 -》 剪切  -》  生成  -》  上传
		
		文件读取:
			拖拽或者input输入 -》 将图片输入一个img标签中

		事件驱动(监听):  

	 */

	function initClipContext() {
		var srcImg = document.querySelector("#lance-imgClip-srcImg");
		srcImg.style.backgroundImage = "url(./imgs/test.png)";
		var mouseMove = new _mouseDownMove2.default(document.querySelector("#lance-imgClip-oriImgWrapper"), srcImg.previousElementSibling, srcImg);
		// console.log(ImgClipUtil);
		var clipUtil = new _imgClip2.default(document.querySelector(".clipUtil"), srcImg, srcImg.parentNode);
		mouseMove.addMoveListenerCallback(clipUtil.draw, clipUtil);
	}

	function initFileIn() {
		(0, _fileOperate2.default)({ dragTarget: document.querySelector("#lance-imgClip-operateArea"), selectBtn: document.querySelector("#lance-imgClip-imgIn") }, "png|jpg|gif|jpeg", function (files) {
			console.log(files);
		}, function (msg) {
			console.log(msg);
		});
	}

	function main() {
		initFileIn();
		initClipContext();
	}

	main();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _utils = __webpack_require__(2);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	//文件操作模块(尝试返回一个promise对象)
	/*
		
		输入: 文件输入DOM(可以是一个容器，或者是一个按钮，容器作为拖拽输入，按钮作为点击输入，两个都给就两个都监听){Object.dragTarget/selectBtn}, 文件类型限制{String}"type1|type2"，文件类型错误回调{Function}, 文件打开成功回调

		
		从传入的文件输入DOM触发文件输入，用户选择文件或拖入文件，类型错误，调用回调，打开错误或者浏览器不支持，reject。

	 */

	var inParams = {},
	    fileInput = null;

	function _fileFilter(files) {
		var fileType = "";
		//去掉不符合type的文件
		for (var i = 0; i < files.length; i++) {
			fileType = files[i].type;
			if (inParams.type.indexOf("|" + fileType.slice(fileType.lastIndexOf("/") + 1)) < 0) {
				files.splice(i, 1);
				i--;
			}
		}
	}

	function _initDragHandle(dragTarget) {
		dragTarget.addEventListener("dragenter", function (event) {
			return event.preventDefault();
		});
		dragTarget.addEventListener("dragover", function (event) {
			return event.preventDefault();
		});
		dragTarget.addEventListener("dragleave", function (event) {
			return event.preventDefault();
		});
		dragTarget.addEventListener("drop", function (event) {
			event.preventDefault();
			var dt = event.dataTransfer,
			    files = null;
			if (!dt) {
				inParams.errorCallback("浏览器不支持");
				return;
			}
			var files = [].concat(_toConsumableArray(dt.files));

			_fileFilter(files);

			if (files.length === 0) {
				inParams.errorCallback("输入失败，请重新输入且输入符合要求的文件类型");
				return;
			}
			inParams.sucCallBack(files);
		});
	}

	function _initButtonInHandle(selectBtn) {
		if (!fileInput) fileInput = document.createElement("input");
		var input = fileInput;
		input.type = "file";
		input.style.display = "hidden";
		document.body.appendChild(input);
		selectBtn.addEventListener("click", function (event) {
			return input.click();
		});
		input.addEventListener("change", function (event) {
			var files = [].concat(_toConsumableArray(input.files));

			_fileFilter(files);

			if (files.length === 0) {
				inParams.errorCallback("输入失败，请重新输入且输入符合要求的文件类型");
				return;
			}
			inParams.sucCallBack(files);
		});
	}

	function _initFileIn() {
		var dragTarget = inParams.fileInDom.dragTarget,
		    selectBtn = inParams.fileInDom.selectBtn;

		if (!_utils.TypeCheckUtil.isNode(dragTarget) && !_utils.TypeCheckUtil.isNode(selectBtn)) throw new TypeError("Params Error: firstParam(fileInDom) must have key dragTarget{Node} or selectBtn{Node} or both");

		if (_utils.TypeCheckUtil.isNode(dragTarget)) _initDragHandle(dragTarget);
		if (_utils.TypeCheckUtil.isNode(selectBtn)) _initButtonInHandle(selectBtn);
	}

	/**
	 * get the file from pc
	 * @param  {Object} fileInDom         文件输入DOM，容器或者输入按钮
	 * @param  {String} type              文件类型过滤，eg: "png|img"
	 * @param  {Function} sucCallBack 处理成功回调函数
	 * @param  {Function} errorCallback 处理错误回调函数
	 */
	function fileOperate(fileInDom, type, sucCallBack) {
		var errorCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

		if (!fileInDom || !_utils.TypeCheckUtil.isFunction(errorCallback) || !_utils.TypeCheckUtil.isFunction(sucCallBack)) throw new TypeError("Params Erroe: except 4 param, fileInDom{Object},type{String},sucCallBack{Function},errorCallback{Function}");
		inParams.fileInDom = fileInDom;
		inParams.type = "|" + type;
		inParams.sucCallBack = sucCallBack;
		inParams.errorCallback = errorCallback;
		_initFileIn();
	}

	exports.default = fileOperate;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var TypeCheckUtil = TypeCheckUtil || {
		isElement: function isElement(element) {
			return element instanceof Element;
		},
		isNode: function isNode(node) {
			return node instanceof Node;
		},
		isFunction: function isFunction(func) {
			return typeof func === "function";
		}
	};

	var ElementClassNameUtil = ElementClassNameUtil || {
		addClassName: function addClassName(element, className) {
			if (!ElementCheckUtil.isNode(element) || !className) throw new TypeError("params Error: except 2: element{Node}, className{String}");
			var oldClassName = element.className.trim();
			if (oldClassName.indexOf(className) >= 0) return false;
			element.className = oldClassName + className;
			return true;
		},
		removeClassName: function removeClassName(element, className) {
			if (!ElementCheckUtil.isNode(element) || !className) throw new TypeError("params Error: except 2: element{Node}, className{String}");
			var oldClassName = element.className.trim();
			if (oldClassName.indexOf(className) < 0) return false;
			element.className = oldClassName.replace(className, "");
			return true;
		},
		include: function include(element, className) {
			if (!ElementCheckUtil.isNode(element) || !className) throw new TypeError("params Error: except 2: element{Node}, className{String}");
			return element.className.indexOf(className) >= 0;
		}
	};

	exports.TypeCheckUtil = TypeCheckUtil;
	exports.ElementClassNameUtil = ElementClassNameUtil;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
		设置元素鼠标在其容器内拖动响应
			输入: 容器Wrapper(Element), 拖动目标mouseTarget(mouse作用目标), 移动目标moveTarget(在mouse作用下其position, 移动目标必须以其实际或者说完整大小出现，不要缩放)
			（注意: 其父容器的left， top， 当前被拖动的元素的左上角x与y(小于等于零)）
			
			输出: 通过暴漏函数(public func) 返回移动目标距离容器左上角的距离 为正值

			move事件的时候监听鼠标是否跑出有效区域
	 */

	/*
		鼠标是否按下 
	 */

	var _eventListenerInit = Symbol('eventListenerInit'),
	    _getMouseDeltaXY = Symbol('getMouseDeltaXY'),
	    _checkInMoveTarget = Symbol('checkInMoveTarget'),
	    _moveTheTarget = Symbol('moveTheTarget'),
	    _triggerMoveListener = Symbol('triggerMoveListener');

	var ElementMouseMove = function () {
		function ElementMouseMove(wrapper, mouseTarget, moveTarget) {
			_classCallCheck(this, ElementMouseMove);

			if (!_utils.TypeCheckUtil.isNode(wrapper) || !_utils.TypeCheckUtil.isNode(mouseTarget) || !_utils.TypeCheckUtil.isNode(moveTarget)) {
				throw new TypeError("param error: except 3 params and all param is Node or it's sub class");
			}
			this.wrapper = wrapper;
			this.mouseTarget = mouseTarget;
			this.moveTarget = moveTarget;

			//wrapper 属性 需要left，top  moveTarget的暂时不使用，因为这个rect是静态的
			this.wrapperRect = this.wrapper.getBoundingClientRect();

			//鼠标是否按下
			this.isMoveDown = false;

			//鼠标按下的位置，方便计算delta x 与 y
			this.mouseDownPoint = { x: 0, y: 0 };

			//moveTaregt移动的回调函数
			this.moveCallbackList = [];

			this[_eventListenerInit]();
		}

		/**
	  * getTopLeft: 返回moveTarget元素距离wrapper元素的左上角的距离(正值)
	  * @return {Object} the topLeft delta(Width)
	  */


		_createClass(ElementMouseMove, [{
			key: 'getTopLeft',
			value: function getTopLeft() {
				var moveTargetRect = this.moveTarget.getBoundingClientRect();
				return { x: moveTargetRect.left, y: moveTargetRect.top };
			}

			/**
	   * addMoveListenerCallback: 添加移动事件的监听回调函数
	   * @param {Function} callback 移动监听回调函数
	   * @param {Object}   context  回调函数执行上下文
	   */

		}, {
			key: 'addMoveListenerCallback',
			value: function addMoveListenerCallback(callback, context) {
				this.moveCallbackList.push({ callback: callback, context: context });
			}

			/**
	   * _triggerMoveListener: 触发所有当前movetarget对象移动的监听器，将当前movetarget相对于wrapper的左上角的位置传给回调{x: , y: }
	   *
	   */

		}, {
			key: _triggerMoveListener,
			value: function value(curPos) {
				this.moveCallbackList.map(function (item) {
					return item.callback.apply(item.context);
				});
			}
		}, {
			key: _checkInMoveTarget,
			value: function value(position) {
				var moveTargetRect = this.moveTarget.getBoundingClientRect();
				if (position.x < moveTargetRect.left || position.x > moveTargetRect.left + moveTargetRect.width || position.y < moveTargetRect.top || position.y > moveTargetRect.top + moveTargetRect.height) return false;
				return true;
			}

			/**
	   * _getMouseDeltaXY: 根据当前鼠标的位置计算鼠标自按下后移动的距离，可负值
	   * @return {Object} the detlaX and deltaY
	   */

		}, {
			key: _getMouseDeltaXY,
			value: function value(curPostion) {
				var moveTargetRect = this.moveTarget.getBoundingClientRect(),
				    delta = {};
				delta.x = curPostion.x - this.mouseDownPoint.x;
				delta.y = curPostion.y - this.mouseDownPoint.y;

				return delta;
			}
		}, {
			key: _moveTheTarget,
			value: function value(delta) {
				var rect = this.moveTarget.getBoundingClientRect();
				this.moveTarget.style.left = rect.left + delta.x + "px";
				this.moveTarget.style.top = rect.top + delta.y + "px";
			}

			/**
	   * _eventListenerInit: 初始化事件监听
	   */

		}, {
			key: _eventListenerInit,
			value: function value() {
				var self = this;
				this.mouseTarget.addEventListener("mousedown", function (event) {
					if (self[_checkInMoveTarget]({ x: event.clientX, y: event.clientY })) {
						self.isMoveDown = true;
						console.log("isTrue");
					}
					self.mouseDownPoint.x = event.clientX;
					self.mouseDownPoint.y = event.clientY;
				});

				//鼠标作用dom上的移动事件监听，注意是否跑出有效区域
				this.mouseTarget.addEventListener("mousemove", function (event) {
					if (!self[_checkInMoveTarget]({ x: event.clientX, y: event.clientY })) {
						//跑出有效区域
						return;
					}
					if (!self.isMoveDown) return;
					var delta = self[_getMouseDeltaXY]({ x: event.clientX, y: event.clientY });

					if (Math.abs(delta.x) <= 2 && Math.abs(delta.y) <= 2) return;
					// console.log(delta);
					self[_moveTheTarget](delta);

					self.mouseDownPoint.x = event.clientX;
					self.mouseDownPoint.y = event.clientY;

					self[_triggerMoveListener](self.getTopLeft());
				});

				//鼠标跑出mouseTarget区域，取消mousedowm
				this.mouseTarget.addEventListener("mouseout", function (event) {
					self.isMoveDown = false;
				});

				this.mouseTarget.addEventListener("mouseup", function (event) {
					self.isMoveDown = false;
				});
			}
		}]);

		return ElementMouseMove;
	}();

	exports.default = ElementMouseMove;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _initEventListener = Symbol('initEventListener'),
	    //实例方法
	_initContextEnv = Symbol('initContextEnv'),
	    _getClipUtilDramParams = Symbol('getClipUtilDramParams'),
	    _drawClipResult = Symbol('drawClipResult'),
	    _getOverlapArea = Symbol('getOverlapArea'),

	//实例属性
	_clipUtilRect = Symbol('clipUtilRect'),
	    _isDown = Symbol('isDown');

	var ImgClipUtil = function () {
		/**
	  * 构造函数: 初始化剪切工具
	  * @param  {Element} clipUtil           剪切工具对象，暂时传入
	  * @param  {Element} clipTaregt        被剪切的图片/容器，长宽为图片实际长宽
	  * @param  {Element} clipTaregtWrapper 被剪切的图片的外部包裹Element，剪切工具的工作区域
	  */
		function ImgClipUtil(clipUtil, clipTaregt, clipTaregtWrapper) {
			_classCallCheck(this, ImgClipUtil);

			if (!_utils.TypeCheckUtil.isNode(clipUtil) || !_utils.TypeCheckUtil.isNode(clipTaregt) || !_utils.TypeCheckUtil.isNode(clipTaregtWrapper)) {
				throw new TypeError("param error: except 3 params and all param is Node or it's sub class");
			}
			var canvas = null,
			    imgSrc = "";
			this.clipUtil = clipUtil;
			this.clipTaregt = clipTaregt;
			this.clipTaregtWrapper = clipTaregtWrapper;
			canvas = clipUtil.querySelector("canvas");
			if (!canvas) {
				canvas = document.createElement("canvas");
				clipUtil.appendChild(canvas);
			}

			//设置画布的长宽，默认恒定
			canvas.width = 400;
			canvas.height = 260;

			this.canvas = canvas;
			this.canvasCtx = canvas.getContext('2d');

			//背剪切图片的Image对象
			this.clipTaregtImage = new Image();
			imgSrc = clipTaregt.style.backgroundImage;
			this.clipTaregtImage.src = imgSrc.slice(imgSrc.indexOf('\"') + 1, imgSrc.lastIndexOf('\"'));

			var utilRect = canvas.getBoundingClientRect();
			this[_clipUtilRect] = utilRect;
			// //减掉border
			// this[_clipUtilRect].width = utilRect.width - 6;
			// this[_clipUtilRect].height = utilRect.height - 6;
			// this[_clipUtilRect].left = utilRect.left + 3;
			// this[_clipUtilRect].right = utilRect.right - 3;
			// this[_clipUtilRect].top = utilRect.top + 3;
			// this[_clipUtilRect].bottom = utilRect.bottom - 3;

			this[_isDown] = false;
		}

		_createClass(ImgClipUtil, [{
			key: 'init',
			value: function init() {
				this[_initContextEnv]();
				this[_initEventListener]();
			}
		}, {
			key: 'draw',
			value: function draw(error) {
				var drawParams = this[_getClipUtilDramParams]();
				if (drawParams) {
					console.log(drawParams);
					this[_drawClipResult](drawParams);
				} else {
					console.log("图片不在剪切区域！！！");
					error ? error("图片不在剪切区域！！！") : undefined;
				}
			}
		}, {
			key: _initEventListener,
			value: function value() {}
		}, {
			key: _initContextEnv,
			value: function value() {}
		}, {
			key: _getClipUtilDramParams,
			value: function value() {
				var clipTaregtRect = this.clipTaregt.getBoundingClientRect(),
				    utilRect = this[_clipUtilRect],
				    deltaX = 0,
				    deltaY = 0,
				    pos = {}; /*pos: 剪切工具绘制参数: 画布其起始cx,cy 图片起始ix,iy 图片绘制宽度width, height*/

				// 图片不在剪接区域
				if (clipTaregtRect.left >= utilRect.right || clipTaregtRect.right <= utilRect.left) return false;
				if (clipTaregtRect.top >= utilRect.bottom || clipTaregtRect.bottom <= utilRect.top) return false;

				//-----------》》》》》》下面是图片与剪切区域有交集的情况

				//剪切区域包裹图片
				if (utilRect.top <= clipTaregtRect.top && utilRect.bottom >= clipTaregtRect.bottom && utilRect.left <= clipTaregtRect.left && utilRect.right >= clipTaregtRect.right) {
					return { cx: clipTaregtRect.left - utilRect.left, cy: clipTaregtRect.top - utilRect.top,
						ix: 0, iy: 0, width: clipTaregtRect.width, height: clipTaregtRect.height };
				}

				//图片包裹剪切区域
				if (clipTaregtRect.top <= utilRect.top && clipTaregtRect.bottom >= utilRect.bottom && clipTaregtRect.left <= utilRect.left && clipTaregtRect.right >= utilRect.right) {
					return { cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: utilRect.width, height: utilRect.height };
				}

				//图片竖直穿过剪切区域
				if (clipTaregtRect.top <= utilRect.top && clipTaregtRect.bottom >= utilRect.bottom) {
					if (clipTaregtRect.left >= utilRect.left && clipTaregtRect.right <= utilRect.right) {
						//处在中间
						return { cx: clipTaregtRect.left - utilRect.left, cy: 0, ix: 0, iy: utilRect.top - clipTaregtRect.top, width: clipTaregtRect.width, height: utilRect.height };
					} else if (clipTaregtRect.left < utilRect.left) {
						//处在左边
						return { cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: clipTaregtRect.right - utilRect.left, height: utilRect.height };
					} else {
						//处在右边
						return { cx: clipTaregtRect.left - utilRect.left, cy: 0, ix: 0, iy: utilRect.top - clipTaregtRect.top, width: utilRect.right - clipTaregtRect.left, height: utilRect.height };
					}
				}

				//图片水平穿过剪切区域
				if (clipTaregtRect.left <= utilRect.left && clipTaregtRect.right >= utilRect.right) {
					if (clipTaregtRect.top >= utilRect.top && clipTaregtRect.bottom <= utilRect.bottom) {
						//处在中间
						return { cx: 0, cy: clipTaregtRect.top - utilRect.top, ix: utilRect.left - clipTaregtRect.left, iy: 0, width: utilRect.width, height: clipTaregtRect.height };
					} else if (clipTaregtRect.top < utilRect.top) {
						//处在上边
						return { cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: utilRect.width, height: clipTaregtRect.bottom - utilRect.top };
					} else {
						//处在下边
						return { cx: 0, cy: clipTaregtRect.top - utilRect.top, ix: utilRect.left - clipTaregtRect.left, iy: 0, width: utilRect.width, height: utilRect.bottom - clipTaregtRect.top };
					}
				}

				//左上
				if (clipTaregtRect.left < utilRect.left && clipTaregtRect.right > utilRect.left && clipTaregtRect.top < utilRect.top && clipTaregtRect.bottom > utilRect.top) {
					return { cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: clipTaregtRect.right - utilRect.left, height: clipTaregtRect.bottom - utilRect.top };
				}

				//左下
				if (clipTaregtRect.left < utilRect.left && clipTaregtRect.right > utilRect.left && clipTaregtRect.top < utilRect.bottom && clipTaregtRect.bottom > utilRect.bottom) {
					return { cx: 0, cy: clipTaregtRect.top - utilRect.top, ix: utilRect.left - clipTaregtRect.left, iy: 0, width: clipTaregtRect.right - utilRect.left, height: utilRect.bottom - clipTaregtRect.top };
				}

				//右上
				if (clipTaregtRect.left < utilRect.right && clipTaregtRect.right > utilRect.right && clipTaregtRect.top < utilRect.top && clipTaregtRect.bottom > utilRect.top) {
					return { cx: clipTaregtRect.left - utilRect.left, cy: 0, ix: 0, iy: utilRect.top - clipTaregtRect.top, width: utilRect.right - clipTaregtRect.left, height: clipTaregtRect.bottom - utilRect.top };
				}

				//右下
				if (clipTaregtRect.left < utilRect.right && clipTaregtRect.right > utilRect.right && clipTaregtRect.top < utilRect.bottom && clipTaregtRect.bottom > utilRect.bottom) {
					return { cx: clipTaregtRect.left - utilRect.left, cy: clipTaregtRect.top - utilRect.top, ix: 0, iy: 0, width: utilRect.right - clipTaregtRect.left, height: utilRect.bottom - clipTaregtRect.top };
				}
			}
		}, {
			key: _drawClipResult,
			value: function value(_ref) {
				var cx = _ref.cx,
				    cy = _ref.cy,
				    ix = _ref.ix,
				    iy = _ref.iy,
				    width = _ref.width,
				    height = _ref.height;

				this.canvasCtx.save();
				this.canvasCtx.clearRect(0, 0, this[_clipUtilRect].width, this[_clipUtilRect].height);
				this.canvasCtx.drawImage(this.clipTaregtImage, ix, iy, width, height, cx, cy, width, height);
				this.canvasCtx.restore();
			}
		}]);

		return ImgClipUtil;
	}();

	exports.default = ImgClipUtil;

/***/ }
/******/ ]);