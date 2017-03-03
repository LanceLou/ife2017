import {TypeCheckUtil} from './utils.js'

var _initEventListener = Symbol('initEventListener'), //实例方法
	_initContextEnv = Symbol('initContextEnv'),
	_getClipUtilDramParams = Symbol('getClipUtilDramParams'),
	_drawClipResult = Symbol('drawClipResult'),
	_getOverlapArea = Symbol('getOverlapArea'),
	//实例属性
	_clipUtilRect = Symbol('clipUtilRect'),
	_isMouseDown = Symbol('isDown');


class ImgClipUtil {
	/**
	 * 构造函数: 初始化剪切工具
	 * @param  {Element} clipUtil           剪切工具对象，暂时传入
	 * @param  {Element} clipTaregt        被剪切的图片/容器，长宽为图片实际长宽
	 * @param  {Element} clipTaregtWrapper 被剪切的图片的外部包裹Element，剪切工具的工作区域
	 */
	constructor(clipUtil, clipTaregt, clipTaregtWrapper) {
		if (!TypeCheckUtil.isNode(clipUtil) || !TypeCheckUtil.isNode(clipTaregt) || !TypeCheckUtil.isNode(clipTaregtWrapper)) {
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
		this.clipTaregtImage.src = imgSrc.slice(imgSrc.indexOf('\"')+1, imgSrc.lastIndexOf('\"'));

		//utilRect: 获取画布的rect对象
		var utilRect = canvas.getBoundingClientRect();
		this[_clipUtilRect] = utilRect;

		this[_isMouseDown] = false;
	} 
	init() {
		this[_initContextEnv]();
		this[_initEventListener]();

	}

	draw(error) {
		var drawParams = this[_getClipUtilDramParams]();
		if (drawParams) {
			console.log(drawParams);
			this[_drawClipResult](drawParams);
		}else{
			console.log("图片不在剪切区域！！！");
			error?error("图片不在剪切区域！！！"):undefined;
		}
	}

	[_initEventListener]() {

	}

	[_initContextEnv]() {
		
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