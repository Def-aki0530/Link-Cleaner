let shortUrl;

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, tabs => {
	var longUrl = tabs[0].url;
	if( longUrl.indexOf('https://www.amazon.co.jp/') != -1) {
		shortUrl = shortenUrls(longUrl);
	} else {
		shortUrl = longUrl;
	}
});

document.getElementById("button").onclick = function() {
	copyUrl(shortUrl);
	var x = document.getElementById("message");
    x.innerHTML = "コピー<br>しました";

	setTimeout(() => {
		x.innerHTML = "";
	}, 2100);
};

function shortenUrls(url){
	var urls = url.replace(/http.?:\/\//g, 'https://').split('https://');
	urls = urls.filter(url => url !== '');
	urls = urls.map(url => shortenUrl('https://'+url));
	urls = urls.join('\n');
	return urls;
}

function shortenUrl(url) {
	const domain = getDomain(url);
	const asin = getAsin(url);
	if ((domain === null) || (asin === null)) {
		return null;
	} else {
		return domain + asin;
	} 
}

function getDomain(url) {
	var domain = url.match(/http.?:\/\/(www.)?amazon[\w\.]+\//g);
	if (domain !== null) {
		domain = domain[0].replace('www.', '').replace(/\/$/g, '');
	}  
	return domain;
}

function getAsin(url) {
	var url = url.replace(/\/gp\/product\//g, '/dp/').replace('/ASIN/', '/dp/');
	var asin = url.match(/\/dp\/[\d\w]+/g);
	if (asin !== null) {
		asin = asin[0];
		if (asin.search(/\/$/g) === -1) {
		asin += '/'; 
		}
	}
	return asin;
}

function copyUrl(text){
	navigator.clipboard.writeText(text);
}
