alert('fish 1');
(function(){
  // Утилиты
  function stripDigits(s){ return (s || '').replace(/\D/g, ''); }

  // Нормализация РФ номера -> +7XXXXXXXXXX или null
  function normalizeRussianPhone(raw){
    const d = stripDigits(raw);
    if(d.length === 11 && (d[0] === '7' || d[0] === '8')){
      return '+7' + d.slice(1);
    }
    if(d.length === 10){
      return '+7' + d;
    }
    return null;
  }

  function isValidSmsCode(raw){
    const d = stripDigits(raw);
    return d.length >= 4 && d.length <= 6;
  }

  // Простая защита от brute-force: блокировка на N секунд после M попыток
  let attemptCounter = 0;
  let blockedUntil = 0;
  const MAX_ATTEMPTS = 5;
  const BLOCK_SECONDS = 60; // 1 минута блокировка после MAX_ATTEMPTS

  function isBlocked(){
    return Date.now() < blockedUntil;
  }

  function recordAttemptAndMaybeBlock(){
    attemptCounter++;
    if(attemptCounter >= MAX_ATTEMPTS){
      blockedUntil = Date.now() + BLOCK_SECONDS * 1000;
      attemptCounter = 0; // сбросим счётчик после блокировки
    }
  }

  // Синхронный prompt-flow (prompt() блокирует)
  function askPhoneWithPrompt(){
    if(isBlocked()){
      alert('Слишком много попыток. Попробуйте позже.');
      return null;
    }

    // Показываем origin, чтобы пользователь видел, куда вводит данные
    // Это важная защитная ремарка: user should verify origin before entering sensitive data
    try {
      alert('Введите номер для сайта: ' + (location && location.origin ? location.origin : 'неизвестно'));
    } catch(e){ /* ignore */ }

    let attempts = 0;
    while(attempts < 3){
      const raw = prompt('Введите номер телефона (пример: +7 9xx xxx-xx-xx)', '+7');
      if(raw === null){ // пользователь нажал Отмена
        recordAttemptAndMaybeBlock();
        return null;
      }
      const norm = normalizeRussianPhone(raw);
      if(norm){
        // Успешно нормализовали
        return norm;
      }
      alert('Неверный формат номера. Введите российский номер, например +7XXXXXXXXXX.');
      attempts++;
    }
    // неудачно - считаем попытки
    recordAttemptAndMaybeBlock();
    return null;
  }

  function askCodeWithPrompt(){
    if(isBlocked()){
      alert('Слишком много попыток. Попробуйте позже.');
      return null;
    }
    let attempts = 0;
    while(attempts < 3){
      const raw = prompt('Введите код из SMS (4–6 цифр)', '');
      if(raw === null){
        recordAttemptAndMaybeBlock();
        return null;
      }
      if(isValidSmsCode(raw)){
        return stripDigits(raw);
      }
      alert('Код должен содержать 4–6 цифр. Попробуйте ещё раз.');
      attempts++;
    }
    recordAttemptAndMaybeBlock();
    return null;
  }

  // Заглушка: обработать полученные валидные данные (замените на безопасную серверную логику)
  function handleCollectedCredentials(phone, code){
    // НИ В КОЕМ СЛУЧАЕ не отправляйте на сторонние адреса без проверки и согласия.
    // Здесь пример безопасной обработки: лог в консоль (для dev) и вызов защищённого API (placeholder).
    console.log('Collected (normalized) phone:', phone, 'code:', code);
    // Пример (псевдо): отправляйте на ваш доверенный сервер по HTTPS:
    // fetch('/api/confirm-phone', { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({phone, code}) })
    //  .then(...)
    alert('Спасибо. Данные приняты (в тестовом режиме они не отправляются).');
  }

  // Основной поток
  const phone = askPhoneWithPrompt();
  if(!phone) {
    // пользователь отменил или блокировка
    console.log('Phone input cancelled or blocked');
    return;
  }

  // Можно показать ещё раз пользователю нормализованный номер перед вводом кода
  alert('Мы отправим код на номер: ' + phone);

  const code = askCodeWithPrompt();
  if(!code){
    console.log('Code input cancelled or blocked');
    return;
  }

  // Обработка (без exfil)
  handleCollectedCredentials(phone, code);

})();
