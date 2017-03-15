
/*
	-- Ajax获取图片信息（url, width, height数组） -> 绘制
												-> 一行一行绘制，先固定高度(min-height)，水平图片相加，当图片超过刚刚超过水平时，按容器width在计算一遍此行图片的高度
												-> 如此一行一行添加
*/

var container = null;

function renderARowImages(imgs, height) {
	var rowContainer = document.createElement("div");
		rowContainer.className = "imgRow";
		rowContainer.style.height = height+"px";
		for (var i = 0; i < imgs.length; i++) {
			var imgBox = document.createElement("div");
			imgBox.className = "imgBox";
			var img = document.createElement("img");
			img.src = imgs[i].url;
			imgBox.appendChild(img);
			rowContainer.appendChild(imgBox);
		}
		container.appendChild(rowContainer);
}


function renderImg2Dom(imgs) {
	var containerWidth = container.getBoundingClientRect().width,
		leftRMargin = 3,
		minHeight = 320,
		num = 0, //当前行将绘制的图片数
		curWidth = 0,
		totalWidth = 0;

	//从imgs中取出图片
	while(1){

		//达到一行的要求，进行等比缩放
		if (totalWidth > containerWidth) {
			renderARowImages(imgs.splice(0, num), containerWidth * minHeight / totalWidth);
			num = 0;
			totalWidth = 0;
		}

		//图片已用完
		if (num >= imgs.length) {
			renderARowImages(imgs, minHeight);
			break;
		}

		curWidth = minHeight * imgs[num].width / imgs[num].height;
		totalWidth += curWidth;
		totalWidth += 2 * leftRMargin;
		num++;
	}

}

function requestImagesFromS(callback) {
	var request = new XMLHttpRequest();
	request.open("GET", "/getAllClipedImages");
	request.onreadystatechange = function () {
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            callback(JSON.parse(request.responseText));
        }
    };
    request.send();

}
function main() {
	container = document.querySelector(".barrelLayoutWrapper");
	requestImagesFromS(renderImg2Dom);
}
main();