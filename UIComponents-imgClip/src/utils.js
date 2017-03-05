var TypeCheckUtil = TypeCheckUtil || {
	isElement: function (element) {
		return element instanceof Element;
	},
	isNode: function (node) {
		return node instanceof Node;
	},
	isFunction: function (func) {
		return typeof func === "function";
	}
}

var ElementClassNameUtil = ElementClassNameUtil || {
	addClassName: function (element, className) {
		if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError("params Error: except 2: element{Node}, className{String}");
		var oldClassName = element.className.trim();
		if (oldClassName.indexOf(className) >= 0) return false;
		className = oldClassName.length > 0 ? " " + className : className;
		element.className = oldClassName + className;
		return true;
	},
	removeClassName: function (element, className) {
		if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError("params Error: except 2: element{Node}, className{String}");
		var oldClassName = element.className.trim();
		if (oldClassName.indexOf(className) < 0) return false;
		element.className = oldClassName.replace(className, "");
		return true;
	},
	include: function (element, className) {
		if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError("params Error: except 2: element{Node}, className{String}");
		return element.className.indexOf(className) >= 0;
	}
}

export {TypeCheckUtil, ElementClassNameUtil};