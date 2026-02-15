alert('new fish1');
var o = document.createElement('div');
o.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.9);color:white;z-index:999999;padding:20px;font-size:24px';
o.innerText = 'INJECT VISIBLE';
document.documentElement.appendChild(o);
