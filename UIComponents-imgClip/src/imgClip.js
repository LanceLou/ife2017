import {TypeCheckUtil} from './utils.js'

var _initEventListener = Symbol('initEventListener'), //实例方法
	_getClipUtilDramParams = Symbol('getClipUtilDramParams'),
	_drawClipResult = Symbol('drawClipResult'),
	_getOverlapArea = Symbol('getOverlapArea'),
	_mouseDragMoveHandler = Symbol('mouseDragMoveHandler'),
	_triggerAllClipUtilAdjustListener = Symbol('triggerAllClipUtilAdjustListener'),
	//实例属性
	_clipUtilRect = Symbol('clipUtilRect'),
	_curDragDot = Symbol('curDragDot'), //当前拖动缩放作用点(用于记录方向)
	_adjustListenerCallback = Symbol('adjustListenerCallback'),
	_isInit = Symbol('isInit'),
	_isMouseDown = Symbol('isDown');

class ImgClipUtil {
	/**
	 * 构造函数: 初始化剪切工具
	 * @param  {Element} clipUtil           剪切工具对象，暂时传入
	 * @param  {Element} clipTaregtWrapper 被剪切的图片的外部包裹Element，剪切工具的工作区域
	 * @param  {Object} canvasRect        指定画布的长宽，即clipUtil长宽
	 */
	constructor(clipUtil, clipTaregtWrapper, canvasRect) {
		if (!TypeCheckUtil.isNode(clipUtil) || !TypeCheckUtil.isNode(clipTaregtWrapper)) {
			throw new TypeError("param error: except 3 params and all param is Node or it's sub class");
		}
		var canvas = null;
		this.clipUtil = clipUtil;
		this.clipTaregtWrapper = clipTaregtWrapper;
		this.clipTaregt = null;

		//如果画布环境不存在则创建一个
		canvas = clipUtil.querySelector("canvas");
		if (!canvas) {
			canvas = document.createElement("canvas");
			clipUtil.appendChild(canvas);
		}

		//设置画布的长宽，默认恒定
		canvas.width = canvasRect.width;
		canvas.height = canvasRect.height;

		this.canvas = canvas;
		this.canvasCtx = canvas.getContext('2d');

		//utilRect: 获取******画布******的rect对象
		this[_clipUtilRect] = canvas.getBoundingClientRect();

		this[_isMouseDown] = false;
		this[_isInit] = false;
		this[_adjustListenerCallback] = [];

	} 

	setclipTaregtImage(clipTaregt) {
		this.clipTaregt = clipTaregt;

		var imgSrc = "";
		//背剪切图片的Image对象
		this.clipTaregtImage = new Image();
		imgSrc = clipTaregt.style.backgroundImage;
		this.clipTaregtImage.src = imgSrc.slice(imgSrc.indexOf('\"')+1, imgSrc.lastIndexOf('\"'));

		this.draw();
	}

	init(clipTaregt) {
		clipTaregt?this.setclipTaregtImage(clipTaregt):null;
		if (!this[_isInit]) {
			this[_initEventListener]();
			this[_isInit] = true;
		}
	}

	draw(error) {
		var drawParams = this[_getClipUtilDramParams]();
		if (drawParams) {
			this[_drawClipResult](drawParams);
		}else{
			console.log("图片不在剪切区域！！！");
			error?error("图片不在剪切区域！！！"):undefined;
		}
	}

	updateClipParamAndDraw(toWidth, toHeight, toTop, toLeft) {
		this.clipUtil.style.left = toLeft ? toLeft + "px" : undefined;
		this.clipUtil.style.top = toTop ? toTop + "px" : undefined;
		this.clipUtil.style.width = toWidth ? toWidth + "px": undefined;
		this.clipUtil.style.height = toHeight ? toHeight + "px" : undefined;
		this.canvas.width = toWidth ? toWidth : undefined;
		this.canvas.height = toHeight ? toHeight : undefined;
		this[_clipUtilRect] = this.canvas.getBoundingClientRect();
		this.draw();
	}

	addClipUtilAdjustListener(callback, context) {
		this[_adjustListenerCallback].push({callback: callback, context: context});
	}

	/**
	 * 将canvas转化为Blob，用于剪切完成的图片预览，以便上传
	 * @param  {Function} callback 回调函数: 将传入的参数，canvas转化成的画布
	 */
	getTheCanvasBlob(callback) {
		this.canvas.toBlob(callback);
	}

	[_mouseDragMoveHandler](direction, startPos, endPos) {
		var toWidth = this.canvas.width,
			toHeight = this.canvas.height,
			toLeft = this.clipUtil.style.left,
			toTop = this.clipUtil.style.top,
			deltaX = endPos.x - startPos.x,
			deltaY = endPos.y - startPos.y;
		toLeft = toLeft.slice(0, toLeft.lastIndexOf("px")) - 0;
		toTop = toTop.slice(0, toTop.lastIndexOf("px")) - 0;
		switch(direction){
		 	case "lt":
		 		toWidth = toWidth - deltaX;
		 		toHeight = toHeight - deltaY;
		 		toLeft = toLeft + deltaX;
		 		toTop = toTop + deltaY;
		 		break;
		 	case "mt":
		 		toHeight = toHeight - deltaY;
		 		toTop = toTop + deltaY;
		 		break;
		 	case "rt":
		 		toWidth = toWidth + deltaX;
		 		toHeight = toHeight - deltaY;
		 		toTop = toTop + deltaY;
		 		break;
		 	case "lm":
		 		toWidth = toWidth - deltaX;
		 		toLeft = toLeft + deltaX;
		 		break;
		 	case "rm":
		 		toWidth = toWidth + deltaX;
		 		break;
		 	case "lb":
		 		toWidth = toWidth - deltaX;
		 		toHeight = toHeight + deltaY;
		 		toLeft = toLeft + deltaX;
		 		break;
		 	case "mb":
		 		toHeight = toHeight + deltaY;
		 		break;
		 	case "rb":
		 		toWidth = toWidth + deltaX;
		 		toHeight = toHeight + deltaY;
		 		break;
		}
		if (toWidth <= 60 || toHeight <= 60) return;
		this.updateClipParamAndDraw(toWidth, toHeight, toTop, toLeft);
		this[_triggerAllClipUtilAdjustListener]({top: toTop, left: toLeft, width: toWidth, height: toHeight});
	}

	[_triggerAllClipUtilAdjustListener](pos) {
		this[_adjustListenerCallback].map(item => item.callback.call(item.context, pos));
	}

	[_initEventListener]() {
		var self = this,
			dragStartPos = {};

		this.clipUtil.addEventListener("mousedown", function (event) {
			var target = event.target,
				className = "";
			if (target.tagName !== "SPAN") return;
			className = target.className;
			self[_isMouseDown] = true;
			self[_curDragDot] = className.replace("dot ", "").trim();

			dragStartPos.x = event.clientX;
			dragStartPos.y = event.clientY;
			console.log(dragStartPos);
		});

		this.clipUtil.addEventListener("mouseup", function (event) {

			self[_isMouseDown] = false;
		});
		this.clipUtil.addEventListener("mouseleave", function (event) {
			console.log("leave");
			self[_isMouseDown] = false;
		});
		this.clipUtil.addEventListener("mousemove", function (event) {
			var target = event.target,
				className = "";
			if (!self[_isMouseDown]) return;
			self[_mouseDragMoveHandler](self[_curDragDot], dragStartPos, {x: event.clientX, y: event.clientY});
			dragStartPos.x = event.clientX;
			dragStartPos.y = event.clientY;
		});
	}

	
	[_getClipUtilDramParams]() {
		var clipTaregtRect = this.clipTaregt.getBoundingClientRect(),
			utilRect = this[_clipUtilRect],
			deltaX = 0,
			deltaY = 0,
			pos = {}; /*pos: 剪切工具绘制参数: 画布其起始cx,cy 图片起始ix,iy 图片绘制宽度width, height*/

		// 图片不在剪接区域
		if (clipTaregtRect.left >= utilRect.right || clipTaregtRect.right <= utilRect.left) 
			return false;
		if (clipTaregtRect.top >= utilRect.bottom || clipTaregtRect.bottom <= utilRect.top) 
			return false;

		//-----------》》》》》》下面是图片与剪切区域有交集的情况
		
		//剪切区域包裹图片
		if (utilRect.top <= clipTaregtRect.top && utilRect.bottom >= clipTaregtRect.bottom && utilRect.left <= clipTaregtRect.left && utilRect.right >= clipTaregtRect.right) {
			return {cx: clipTaregtRect.left - utilRect.left, cy: clipTaregtRect.top - utilRect.top,
				ix: 0, iy: 0, width: clipTaregtRect.width, height: clipTaregtRect.height};
		}
		
		//图片包裹剪切区域
		if (clipTaregtRect.top <= utilRect.top && clipTaregtRect.bottom >= utilRect.bottom && clipTaregtRect.left <= utilRect.left && clipTaregtRect.right >= utilRect.right) {
			return {cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: utilRect.width, height: utilRect.height};
		}

		//图片竖直穿过剪切区域
		if (clipTaregtRect.top <= utilRect.top && clipTaregtRect.bottom >= utilRect.bottom) {
			if (clipTaregtRect.left >= utilRect.left && clipTaregtRect.right <= utilRect.right) {
				//处在中间
				return {cx: clipTaregtRect.left - utilRect.left, cy: 0, ix: 0, iy: utilRect.top - clipTaregtRect.top, width: clipTaregtRect.width, height: utilRect.height};
			}else if (clipTaregtRect.left < utilRect.left) {
				//处在左边
				return {cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: clipTaregtRect.right - utilRect.left, height: utilRect.height};
			}else{
				//处在右边
				return {cx: clipTaregtRect.left - utilRect.left, cy: 0, ix: 0, iy: utilRect.top - clipTaregtRect.top, width: utilRect.right - clipTaregtRect.left, height: utilRect.height};
			}
		}

		//图片水平穿过剪切区域
		if (clipTaregtRect.left <= utilRect.left && clipTaregtRect.right >= utilRect.right) {
			if (clipTaregtRect.top >= utilRect.top && clipTaregtRect.bottom <= utilRect.bottom) {
				//处在中间
				return {cx: 0, cy: clipTaregtRect.top - utilRect.top, ix: utilRect.left - clipTaregtRect.left, iy: 0, width: utilRect.width, height: clipTaregtRect.height};
			}else if (clipTaregtRect.top < utilRect.top) {
				//处在上边
				return {cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: utilRect.width, height: clipTaregtRect.bottom - utilRect.top};
			}else{
				//处在下边
				return {cx: 0, cy: clipTaregtRect.top - utilRect.top, ix: utilRect.left - clipTaregtRect.left, iy: 0, width: utilRect.width, height: utilRect.bottom - clipTaregtRect.top};
			}
		}

		//左上
		if (clipTaregtRect.left < utilRect.left && clipTaregtRect.right > utilRect.left && clipTaregtRect.top < utilRect.top && clipTaregtRect.bottom > utilRect.top) {
			return {cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: clipTaregtRect.right - utilRect.left, height: clipTaregtRect.bottom - utilRect.top};
		}

		//左下
		if (clipTaregtRect.left < utilRect.left && clipTaregtRect.right > utilRect.left && clipTaregtRect.top < utilRect.bottom && clipTaregtRect.bottom > utilRect.bottom) {
			return {cx: 0, cy: clipTaregtRect.top - utilRect.top, ix: utilRect.left - clipTaregtRect.left, iy: 0, width: clipTaregtRect.right - utilRect.left, height: utilRect.bottom - clipTaregtRect.top};
		}

		//右上
		if (clipTaregtRect.left < utilRect.right && clipTaregtRect.right > utilRect.right && clipTaregtRect.top < utilRect.top && clipTaregtRect.bottom > utilRect.top) {
			return {cx: clipTaregtRect.left - utilRect.left, cy: 0, ix: 0, iy: utilRect.top - clipTaregtRect.top, width: utilRect.right - clipTaregtRect.left, height: clipTaregtRect.bottom - utilRect.top};
		}

		//右下
		if (clipTaregtRect.left < utilRect.right && clipTaregtRect.right > utilRect.right && clipTaregtRect.top < utilRect.bottom && clipTaregtRect.bottom > utilRect.bottom) {
			return {cx: clipTaregtRect.left - utilRect.left, cy: clipTaregtRect.top - utilRect.top, ix: 0, iy: 0, width: utilRect.right - clipTaregtRect.left, height: utilRect.bottom - clipTaregtRect.top};
		}
	}

	[_drawClipResult]({cx, cy, ix, iy, width, height}) {
		this.canvasCtx.save();
		this.canvasCtx.clearRect(0, 0, this[_clipUtilRect].width, this[_clipUtilRect].height);
		this.canvasCtx.drawImage(this.clipTaregtImage, ix, iy, width, height, cx, cy , width, height);
		this.canvasCtx.restore();
	}
}

export default ImgClipUtil;