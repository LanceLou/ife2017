import {TypeCheckUtil} from './utils.js'
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


class ElementMouseMove{
	constructor(wrapper, mouseTarget, moveTarget) {
		if (!TypeCheckUtil.isNode(wrapper) || !TypeCheckUtil.isNode(mouseTarget) || !TypeCheckUtil.isNode(moveTarget)) {
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
		this.mouseDownPoint = {x: 0, y: 0};

		//moveTaregt移动的回调函数
		this.moveCallbackList = [];

		this[_eventListenerInit]();
	}

	/**
	 * getTopLeft: 返回moveTarget元素距离wrapper元素的左上角的距离(正值)
	 * @return {Object} the topLeft delta(Width)
	 */
	getTopLeft() {
		var moveTargetRect = this.moveTarget.getBoundingClientRect();
		return {x: moveTargetRect.left, y: moveTargetRect.top};
	}

	/**
	 * addMoveListenerCallback: 添加移动事件的监听回调函数
	 * @param {Function} callback 移动监听回调函数
	 * @param {Object}   context  回调函数执行上下文
	 */
	addMoveListenerCallback(callback, context) {
		this.moveCallbackList.push({callback: callback, context: context});
	}

	/**
	 * _triggerMoveListener: 触发所有当前movetarget对象移动的监听器，将当前movetarget相对于wrapper的左上角的位置传给回调{x: , y: }
	 *
	 */
	[_triggerMoveListener](curPos) {
		this.moveCallbackList.map((item) => item.callback.apply(item.context));
	}

	[_checkInMoveTarget](position) {
		var moveTargetRect = this.moveTarget.getBoundingClientRect();
		if (position.x < moveTargetRect.left || position.x > moveTargetRect.left + moveTargetRect.width || position.y < moveTargetRect.top || position.y > moveTargetRect.top + moveTargetRect.height) 
			return false;
		return true;
	}

	/**
	 * _getMouseDeltaXY: 根据当前鼠标的位置计算鼠标自按下后移动的距离，可负值
	 * @return {Object} the detlaX and deltaY
	 */
	[_getMouseDeltaXY](curPostion) {
		var moveTargetRect = this.moveTarget.getBoundingClientRect(),
			delta = {};
		delta.x = curPostion.x - this.mouseDownPoint.x;
		delta.y = curPostion.y - this.mouseDownPoint.y;

		return delta;
	}

	[_moveTheTarget](delta) {
		var rect = this.moveTarget.getBoundingClientRect();
		this.moveTarget.style.left = rect.left + delta.x + "px";
		this.moveTarget.style.top = rect.top + delta.y + "px";
	}

	/**
	 * _eventListenerInit: 初始化事件监听
	 */
	[_eventListenerInit]() {
		var self = this;
		this.mouseTarget.addEventListener("mousedown", function (event) {
			if (self[_checkInMoveTarget]({x: event.clientX, y: event.clientY})) {
				self.isMoveDown = true;
				console.log("isTrue");
			}
			self.mouseDownPoint.x = event.clientX;
			self.mouseDownPoint.y = event.clientY;

		});

		//鼠标作用dom上的移动事件监听，注意是否跑出有效区域
		this.mouseTarget.addEventListener("mousemove", function (event) {
			if (!self[_checkInMoveTarget]({x: event.clientX, y: event.clientY})){  //跑出有效区域
				return;
			}
			if (!self.isMoveDown) return;
			var delta = self[_getMouseDeltaXY]({x: event.clientX, y: event.clientY});

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
}

export default ElementMouseMove;