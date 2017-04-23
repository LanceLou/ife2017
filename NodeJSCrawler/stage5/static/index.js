import socketApi from './serverSocket';

var totalNum = 0,
	timerCalc = null,
	curNum = 0;

function getTimeCalc() {
	var dom = document.querySelector('#search-time'),
		timer = null,
		time = Date.now();
	function updateTime() {
		dom.innerHTML = parseInt((Date.now() - time) / 1000) + 's';
		timer = setTimeout(updateTime, 1000);
	}
	function startCalc() {
		updateTime();
	}
	startCalc();
	return {
		stopCalc: function () {
			clearTimeout(timer);
		}
	}
}



var showInfos = document.querySelector('#resultShow').querySelectorAll('span'),
			resultC = document.querySelector('#searchResult');
function renderResult(data) {
	var tr = null,
		td = null,
		item = null,
		fragment = document.createDocumentFragment();
	curNum++;
	showInfos[0].innerHTML = '关键词: ' + data.word;
	showInfos[2].innerHTML = '进度: ' + curNum + "/" + totalNum;
	console.log(curNum);
	console.log(totalNum);
	if (curNum == totalNum) {
		console.log('over');
		timerCalc.stopCalc();
	}

	for (var i = 0; i < data.dataList.length; i++) {
		item = data.dataList[i];
		tr = document.createElement('tr');
		td = document.createElement('td');
		td.innerHTML = '<p title='+item.title+'>' + item.title + '</p>';
		tr.appendChild(td);
		td = document.createElement('td');
		td.innerHTML = '<p title='+item.info+'>' + item.info + '</p>';
		tr.appendChild(td);
		td = document.createElement('td');
		td.innerHTML = '<a href="'+item.link+'">'+item.link+'</a>';
		tr.appendChild(td);
		td = document.createElement('td');
		td.innerHTML = item.pic === 'no picture' ? 'none' : '<img src="'+item.pic+'" alt="pic" />';
		tr.appendChild(td);
		fragment.append(tr);
	}

	resultC.appendChild(fragment); 
}



// 绘制服务端返回的信息，如当前队列状态，是否受理请求等
function renderServerMsg(msg) {
	
}

function formSubmitHandler(formData) {
	timerCalc = timerCalc ? timerCalc : getTimeCalc();
	for(let key in formData){
		if (formData[key].trim() === '') return;
	}
	socketApi.emitSpiderRequest(formData, function (res) {
		console.log(res);
	});
	console.log(formData);
}

function initEventLis() {
	var form = document.querySelector('#spider-submit-form');
	form.addEventListener('submit', function (event) {
		totalNum = totalNum + (form.search_pageNum.value - 0);
		event.preventDefault();
		formSubmitHandler({
			keyWord: form.search_wd.value,
			pagenum: form.search_pageNum.value,
			media: form.search_mediaType.children[form.search_mediaType.selectedIndex].innerText
		});
	});

	socketApi.addServerUpdateEventHandler(null, function (data) {
		renderResult(data);
	})
}

function main() {
	initEventLis();
}

main();




/*
var showInfos = document.querySelector('#resultShow').querySelectorAll('span'),
			resultC = document.querySelector('#searchResult');
		function renderResult(responseText) {
			var data = JSON.parse(responseText),
				tr = null,
				td = null,
				item = null,
				fragment = document.createDocumentFragment();

			showInfos[0].innerHTML = '关键词: ' + data.word;
			showInfos[1].innerHTML = '搜索用时: ' + data.time;

			for (var i = 0; i < data.dataList.length; i++) {
				item = data.dataList[i];
				tr = document.createElement('tr');
				td = document.createElement('td');
				td.innerHTML = '<p title='+item.title+'>' + item.title + '</p>';
				tr.appendChild(td);
				td = document.createElement('td');
				td.innerHTML = '<p title='+item.info+'>' + item.info + '</p>';
				tr.appendChild(td);
				td = document.createElement('td');
				td.innerHTML = '<a href="'+item.link+'">'+item.link+'</a>';
				tr.appendChild(td);
				td = document.createElement('td');
				td.innerHTML = item.pic === 'no picture' ? 'none' : '<img src="'+item.pic+'" alt="pic" />';
				tr.appendChild(td);
				fragment.append(tr);
			}

			resultC.appendChild(fragment);

		}
		
		function queryResult(key) {
			var request = new XMLHttpRequest();
			request.open('POST', '/scrawler');
			request.onreadystatechange = function () {
				if (request.readyState === 4 && request.status === 200) {
					renderResult(request.responseText);
				}
			}
			request.setRequestHeader("Content-Type", 'application/json');
			var formData = new FormData();
			formData.append('wd', key);
			// formData.append('swd', 'opslcs');
			request.send(JSON.stringify({ss: 'cc', ww: 'the f line \r\n the s line', wd: "key worf"}));
		}		

		function init() {
			var value;
			document.querySelector('#submit-btn').addEventListener('click', function () {
				value = this.previousElementSibling.value;
				if (value && value.trim() !== '') queryResult(value);
			});
		}
		init();
*/