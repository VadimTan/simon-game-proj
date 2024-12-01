export class RequestsSender {
	constructor(url, callback, isAsync = false) {
		this.url = url;
		this.callback = callback;
		this.isAsync = isAsync;
	}

	httpGet(path = '', headers = {}) {
		var xmlHttp = new XMLHttpRequest();

		let callback = this.callback;
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4) callback(xmlHttp.responseText);
		};

		xmlHttp.open('GET', this.url + '/' + path, this.isAsync);

		for (let key in headers) xmlHttp.setRequestHeader(key, headers[key]);

		xmlHttp.send(null);
	}

	httpPost(data, path = '', headers = {}) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.withCredentials = true;

		let callback = this.callback;
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4) callback(xmlHttp.responseText);
		};

		xmlHttp.open('POST', this.url + '/' + path, this.isAsync);

		for (let key in headers) xmlHttp.setRequestHeader(key, headers[key]);

		xmlHttp.send(data);
	}

	httpPut(data, path = '', headers = {}) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.withCredentials = true;

		let callback = this.callback;
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4) callback(xmlHttp.responseText);
		};

		xmlHttp.open('PUT', this.url + '/' + path, this.isAsync);

		for (let key in headers) xmlHttp.setRequestHeader(key, headers[key]);

		xmlHttp.send(data);
	}
}

export function logCallback(text) {
	console.log(text);
}

export function alertCallback(text) {
	alert(text);
}

export const devApiURL = 'http://127.0.0.1:8000';
export const apiURL = 'https://d5dsv84kj5buag61adme.apigw.yandexcloud.net';
