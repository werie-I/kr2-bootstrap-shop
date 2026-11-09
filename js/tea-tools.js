(() => {
  const teas = {
    sencha: { name: 'Зелёный чай Сенча', price: 450, origin: 'Япония', type: 'Зелёный', taste: 'Свежий, травянистый, лёгкая терпкость', caffeine: 'Умеренное', temp: 80, seconds: 120, dose: 2, image: 'https://images.unsplash.com/photo-1763617702099-d956f3fd8324?w=700', time: 'Утро или день' },
    assam: { name: 'Чёрный чай Ассам', price: 520, origin: 'Индия', type: 'Чёрный', taste: 'Насыщенный, солодовый, терпкий', caffeine: 'Выше среднего', temp: 95, seconds: 180, dose: 2, image: 'https://images.unsplash.com/photo-1759523710626-199a2da96085?w=700', time: 'Утро или день' },
    herbal: { name: 'Травяной сбор', price: 390, origin: 'Травяная коллекция', type: 'Травяной', taste: 'Мягкий, ароматный, травяной', caffeine: 'Не содержит кофеин', temp: 95, seconds: 300, dose: 2.5, image: 'https://images.unsplash.com/photo-1648455321715-e8ed86188c0e?w=700', time: 'Вечер' }
  };
  const $ = id => document.getElementById(id);
  const addToCart = tea => {
    try {
      const cart = JSON.parse(localStorage.getItem('teaCart') || '[]');
      const item = cart.find(entry => entry.name === tea.name);
      if (item) item.quantity = (Number(item.quantity) || 1) + 1;
      else cart.push({ name: tea.name, price: tea.price, image: tea.image, quantity: 1 });
      localStorage.setItem('teaCart', JSON.stringify(cart));
      return true;
    } catch (error) { return false; }
  };

  // 01. Guided tea finder
  $('finderForm').addEventListener('submit', event => {
    event.preventDefault();
    const taste = $('finderTaste').value, moment = $('finderMoment').value, goal = $('finderGoal').value;
    let key = taste === 'fresh' ? 'sencha' : taste === 'rich' ? 'assam' : 'herbal';
    if (goal === 'caffeine-free' || moment === 'evening') key = 'herbal';
    if (goal === 'energy' && moment === 'morning' && taste !== 'soft') key = 'assam';
    const tea = teas[key];
    const reasons = {
      sencha: 'Свежий растительный профиль и умеренная крепость хорошо подойдут для спокойного начала дня или дневной паузы.',
      assam: 'Выразительный вкус и более высокое содержание кофеина подойдут тем, кто любит насыщенный чай и хочет взбодриться.',
      herbal: 'Мягкий ароматный настой без кофеина — подходящий вариант для вечернего чаепития.'
    };
    $('finderResult').classList.remove('tool-result--empty');
    $('finderResult').innerHTML = `<span class="tools-kicker">ВАША РЕКОМЕНДАЦИЯ</span><h3>${tea.name}</h3><div class="recommendation-meta"><span>${tea.origin}</span><span>${tea.caffeine} кофеина</span><span>${tea.price} ₽</span></div><p>${reasons[key]}</p><a class="result-link" href="catalog.html">Посмотреть в каталоге ↗</a><button class="tool-button" id="finderAdd" type="button">Добавить в корзину <span>＋</span></button>`;
    $('finderAdd').addEventListener('click', () => { const ok = addToCart(tea); $('finderAdd').textContent = ok ? 'Добавлено в корзину ✓' : 'Не удалось добавить'; });
  });

  // 02. Brewing calculator and timer
  const presets = { sencha: { temp: 80, seconds: 120, dose: 2 }, assam: { temp: 95, seconds: 180, dose: 2 }, herbal: { temp: 95, seconds: 300, dose: 2.5 } };
  let remaining = 120, timerId = null, running = false;
  const formatTime = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  function renderBrew() {
    const key = $('brewTea').value, preset = presets[key], volume = Number($('brewVolume').value), strength = Number($('brewStrength').value);
    const grams = (volume / 100 * preset.dose * (strength === 1 ? .8 : strength === 3 ? 1.2 : 1));
    $('brewVolumeValue').textContent = `${volume} мл`;
    $('brewStrengthValue').textContent = ['Мягкая', 'Обычная', 'Крепкая'][strength - 1];
    $('brewGrams').textContent = `${Number(grams.toFixed(1))} г`;
    $('brewTemp').textContent = `${preset.temp}°C`;
    $('brewTime').textContent = formatTime(preset.seconds);
    if (!running) { remaining = preset.seconds; $('brewTimer').textContent = formatTime(remaining); $('timerStart').textContent = 'Начать'; $('timerStatus').textContent = 'Настройки готовы. Запустите таймер, когда зальёте чай водой.'; }
  }
  function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; running = false; }
  $('brewTea').addEventListener('change', () => { stopTimer(); renderBrew(); });
  $('brewVolume').addEventListener('input', renderBrew);
  $('brewStrength').addEventListener('input', renderBrew);
  $('timerStart').addEventListener('click', () => {
    if (running) { stopTimer(); $('timerStart').textContent = 'Продолжить'; $('timerStatus').textContent = 'Таймер приостановлен.'; return; }
    if (remaining <= 0) remaining = presets[$('brewTea').value].seconds;
    running = true; $('timerStart').textContent = 'Пауза'; $('timerStatus').textContent = 'Чай заваривается…';
    timerId = setInterval(() => { remaining--; $('brewTimer').textContent = formatTime(remaining); if (remaining <= 0) { stopTimer(); $('timerStart').textContent = 'Готово'; $('timerStatus').textContent = 'Время вышло — ваш чай готов. Приятного чаепития!'; } }, 1000);
  });
  $('timerReset').addEventListener('click', () => { stopTimer(); remaining = presets[$('brewTea').value].seconds; $('brewTimer').textContent = formatTime(remaining); $('timerStart').textContent = 'Начать'; $('timerStatus').textContent = 'Таймер сброшен. Можно начинать заново.'; });
  renderBrew();

  // 03. Side-by-side comparison
  const rows = [['Тип', 'type'], ['Происхождение', 'origin'], ['Вкус', 'taste'], ['Кофеин', 'caffeine'], ['Температура воды', 'temp'], ['Время заваривания', 'seconds'], ['Цена', 'price']];
  function renderCompare() {
    const keys = [$('compareOne').value, $('compareTwo').value, $('compareThree').value].filter((key, index, arr) => key !== 'none' && arr.indexOf(key) === index);
    $('compareHead').innerHTML = `<tr><th>Характеристика</th>${keys.map(key => `<th>${teas[key].name.replace('Зелёный чай ', '').replace('Чёрный чай ', '')}</th>`).join('')}</tr>`;
    $('compareBody').innerHTML = rows.map(([label, prop]) => `<tr><th>${label}</th>${keys.map(key => { let value = teas[key][prop]; if (prop === 'temp') value += '°C'; if (prop === 'seconds') value = `${Math.floor(value / 60)} мин ${value % 60 ? `${value % 60} сек` : ''}`; if (prop === 'price') value += ' ₽'; return `<td>${value}</td>`; }).join('')}</tr>`).join('');
  }
  ['compareOne', 'compareTwo', 'compareThree'].forEach(id => $(id).addEventListener('change', renderCompare)); renderCompare();

  // 04. Ceremony planner
  function renderCeremony() {
    const guests = Math.min(30, Math.max(1, Number($('guestCount').value) || 1));
    const cups = Math.min(8, Math.max(1, Number($('cupsPerGuest').value) || 1));
    const cupMl = Number($('cupSize').value), tea = teas[$('ceremonyTea').value];
    const totalMl = guests * cups * cupMl, water = totalMl * 1.1, grams = water / 100 * tea.dose;
    const totalCups = guests * cups, duration = Math.max(20, Math.ceil(totalCups / 4) * 8 + 15);
    $('ceremonyWater').textContent = `${(water / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} л`;
    $('ceremonyGrams').textContent = `${Math.ceil(grams)} г`;
    $('ceremonyCups').textContent = totalCups;
    $('ceremonyDuration').textContent = `${duration}–${duration + 10} мин`;
  }
  ['guestCount', 'cupsPerGuest', 'cupSize', 'ceremonyTea'].forEach(id => $(id).addEventListener('input', renderCeremony)); renderCeremony();

  // 05. Tea and dessert pairing
  const pairings = {
    chocolate: { tea: 'Чёрный чай Ассам', key: 'assam', why: 'Насыщенный солодовый вкус и лёгкая терпкость уравновешивают горечь тёмного шоколада и подчёркивают его какао-ноты.' },
    pastry: { tea: 'Чёрный чай Ассам', key: 'assam', why: 'Плотный настой хорошо сочетается со сливочным маслом и сладостью сдобной выпечки, не теряясь на фоне теста.' },
    fruit: { tea: 'Зелёный чай Сенча', key: 'sencha', why: 'Свежие травянистые ноты поддерживают естественную кислинку ягод и фруктов, не перегружая их вкус.' },
    cream: { tea: 'Зелёный чай Сенча', key: 'sencha', why: 'Лёгкая свежесть и деликатная терпкость создают приятный контраст с нежной сливочной текстурой десерта.' },
    cheese: { tea: 'Чёрный чай Ассам', key: 'assam', why: 'Выразительный настой подходит к насыщенному вкусу выдержанного сыра и помогает сбалансировать его жирность.' }
  };
  function renderPairing() {
    const pair = pairings[$('pairingChoice').value], tea = teas[pair.key];
    $('pairingResult').innerHTML = `<span class="tools-kicker">РЕКОМЕНДАЦИЯ К ЧАЮ</span><h3>${$('pairingChoice').selectedOptions[0].textContent} +</h3><div class="pairing-tea">${pair.tea}</div><p>${pair.why}</p><a class="result-link" href="catalog.html">Посмотреть чай в каталоге ↗</a><button class="tool-button" id="pairingAdd" type="button">Добавить чай в корзину <span>＋</span></button>`;
    $('pairingAdd').addEventListener('click', () => { const ok = addToCart(tea); $('pairingAdd').textContent = ok ? 'Добавлено в корзину ✓' : 'Не удалось добавить'; });
  }
  $('pairingButton').addEventListener('click', renderPairing);
})();
