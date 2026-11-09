function renderSiteComponents() {
  const headerHost = document.querySelector("[data-site-header]");

  if (headerHost) {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const clubPages = ["tea-guide.html", "tea-tools.html", "tea-history.html", "reviews.html", "contacts.html"];
    const clubIsActive = clubPages.includes(currentPage);
    const links = [
      ["index.html", "Главная"],
      ["catalog.html", "Каталог"],
      ["ceremony.html", "Церемонии"]
    ];

    headerHost.innerHTML = `
      <header class="site-header">
        <div class="site-header__inner">
          <a class="site-header__brand" href="index.html" aria-label="Чайный клуб — главная">
            ЧАЙНЫЙ КЛУБ
            <span class="site-header__tagline">ИСКУССТВО ЧАЯ</span>
          </a>
          <button class="site-header__menu-button" type="button"
                  aria-expanded="false" aria-controls="site-navigation">
            <span class="site-header__menu-lines" aria-hidden="true"><i></i><i></i></span>
            <span class="site-header__menu-label">МЕНЮ</span>
          </button>
          <nav class="site-header__nav" id="site-navigation" aria-label="Основная навигация">
            ${links.map(([url, label]) => `
              <a class="site-header__link${currentPage === url ? " site-header__link--active" : ""}"
                 href="${url}"${currentPage === url ? ' aria-current="page"' : ""}>${label}</a>
            `).join("")}
            <details class="site-header__dropdown">
              <summary class="site-header__dropdown-toggle${clubIsActive ? " site-header__link--active" : ""}">
                О клубе <span aria-hidden="true">⌄</span>
              </summary>
              <div class="site-header__dropdown-panel">
                <a href="tea-guide.html"${currentPage === "tea-guide.html" ? ' aria-current="page"' : ""}>Подбор чая</a>
                <a href="tea-tools.html"${currentPage === "tea-tools.html" ? ' aria-current="page"' : ""}>Чайные инструменты</a>
                <a href="tea-history.html"${currentPage === "tea-history.html" ? ' aria-current="page"' : ""}>История чая</a>
                <a href="reviews.html"${currentPage === "reviews.html" ? ' aria-current="page"' : ""}>Отзывы гостей</a>
                <a href="contacts.html"${currentPage === "contacts.html" ? ' aria-current="page"' : ""}>Контакты</a>
              </div>
            </details>
            <div class="site-header__utility-links">
              <a class="site-header__utility-link${currentPage === "cart.html" ? " site-header__link--active" : ""}" href="cart.html" aria-label="Корзина" title="Корзина">
                <svg class="site-header__cart-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M3 4h2l2.1 11.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L21 8H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="10" cy="20" r="1.35" fill="currentColor"/><circle cx="18" cy="20" r="1.35" fill="currentColor"/>
                </svg>
              </a>
            </div>
            <a class="site-header__booking" href="booking.html"${currentPage === "booking.html" ? ' aria-current="page"' : ""}>
              Забронировать <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </header>
    `;

    const menuButton = headerHost.querySelector(".site-header__menu-button");
    const navigation = headerHost.querySelector(".site-header__nav");
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("site-header__nav--open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.querySelector(".site-header__menu-label").textContent = isOpen ? "ЗАКРЫТЬ" : "МЕНЮ";
    });

    // On small screens the dropdown behaves like an ordinary expandable menu.
    const dropdown = headerHost.querySelector(".site-header__dropdown");
    dropdown.addEventListener("toggle", () => {
      if (window.matchMedia("(min-width: 761px)").matches) return;
      dropdown.classList.toggle("site-header__dropdown--expanded", dropdown.open);
    });

    if (currentPage !== "index.html") {
      const pageLabels = {
        "catalog.html": "Каталог", "product.html": "Товар", "cart.html": "Корзина",
        "order.html": "Оформление заказа", "ceremony.html": "Церемонии",
        "booking.html": "Бронирование", "tea-guide.html": "Подбор чая", "tea-tools.html": "Чайные инструменты",
        "tea-history.html": "История чая", "favorites.html": "Избранное",
        "reviews.html": "Отзывы", "contacts.html": "Контакты"
      };
      const breadcrumb = document.createElement("nav");
      breadcrumb.className = "site-breadcrumb";
      breadcrumb.setAttribute("aria-label", "Хлебные крошки");
      breadcrumb.innerHTML = `
        <a class="site-breadcrumb__link" href="index.html">Главная</a>
        <span class="site-breadcrumb__separator" aria-hidden="true">/</span>
        <span class="site-breadcrumb__current" aria-current="page">${pageLabels[currentPage] || "Раздел"}</span>
      `;
      headerHost.insertAdjacentElement("afterend", breadcrumb);
    }
  }

  renderUnifiedFooter();

  initTeaPourInteraction();
  initTeaTimer();
  initBackToTop();
}

function initBackToTop() {
  if (document.querySelector("[data-back-to-top]")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "site-back-to-top";
  button.setAttribute("data-back-to-top", "");
  button.setAttribute("aria-label", "Вернуться наверх");
  button.setAttribute("title", "Наверх");
  button.innerHTML = `
    <span class="site-back-to-top__steam" aria-hidden="true"><i></i><i></i></span>
    <svg class="site-back-to-top__cup" viewBox="0 0 48 40" aria-hidden="true">
      <path d="M7 11h27v13a9 9 0 0 1-9 9h-9a9 9 0 0 1-9-9V11Z" fill="none" stroke="currentColor" stroke-width="2.2"/>
      <path d="M34 15h4a6 6 0 0 1 0 12h-5" fill="none" stroke="currentColor" stroke-width="2.2"/>
      <path d="M4 36h39" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <span class="site-back-to-top__label">вверх</span>
  `;
  document.body.appendChild(button);

  const updateVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > 360);
  };
  window.addEventListener("scroll", updateVisibility, { passive: true });
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
  updateVisibility();
}

function initTeaPourInteraction() {
  const pourScene = document.querySelector("[data-pour-scene]");
  const cup = pourScene?.querySelector(".tea-pour-scene__cup");
  if (!pourScene || !cup) return;
  let pouring = false;
  const pour = () => {
    if (pouring) return;
    pouring = true;
    pourScene.classList.remove("tea-pour-scene--ready");
    void pourScene.offsetWidth;
    pourScene.classList.add("tea-pour-scene--pouring");
    window.setTimeout(() => {
      pourScene.classList.remove("tea-pour-scene--pouring");
      pourScene.classList.add("tea-pour-scene--ready");
      pouring = false;
    }, 2500);
  };
  cup.addEventListener("click", pour);
  pourScene.querySelector("[data-pour-trigger]")?.addEventListener("click", pour);
  cup.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); pour(); }
  });
}

function renderUnifiedFooter() {
  document.querySelectorAll("footer").forEach(footer => footer.remove());
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="site-footer__inner">
      <div class="site-footer__brand-block">
        <a class="site-footer__brand" href="index.html">ЧАЙНЫЙ КЛУБ</a>
        <span class="site-footer__tagline">ИСКУССТВО ЧАЯ</span>
        <p>Пространство чайной культуры, выразительных вкусов и особенных ритуалов.</p>
      </div>
      <div class="site-footer__column"><h2>Магазин</h2>
        <a href="catalog.html">Каталог</a><a href="product.html">Коллекция</a><a href="cart.html">Корзина</a><a href="favorites.html">Избранное</a><a href="order.html">Оформление заказа</a>
      </div>
      <div class="site-footer__column"><h2>Мир чая</h2>
        <a href="ceremony.html">Церемонии</a><a href="tea-guide.html">Подбор чая</a><a href="tea-tools.html">Чайные инструменты</a><a href="tea-history.html">История чая</a><a href="reviews.html">Отзывы гостей</a><a href="booking.html">Бронирование</a>
      </div>
      <div class="site-footer__column"><h2>Информация</h2>
        <a href="index.html#about">О клубе</a><a href="contacts.html">Контакты</a>
      </div>
    </div>
    <div class="site-footer__bottom"><span>© 2026 «Чайный клуб». Все права защищены. Названия, фотографии, шрифты и сторонние материалы принадлежат их правообладателям.</span><span>ИСКУССТВО ЧАЯ</span></div>
  `;
  const credits = document.querySelector("[data-site-credits]");
  if (credits) credits.insertAdjacentElement("beforebegin", footer);
  else document.body.appendChild(footer);
}

function initTeaTimer() {
  const timer = document.querySelector("[data-tea-timer]");
  if (!timer) return;

  const teaSelect = timer.querySelector("[data-tea-choice]");
  const display = timer.querySelector("[data-timer-display]");
  const temperature = timer.querySelector("[data-tea-temperature]");
  const startButton = timer.querySelector("[data-timer-start]");
  const resetButton = timer.querySelector("[data-timer-reset]");
  const message = timer.querySelector("[data-timer-message]");
  const presets = {
    sencha: { seconds: 120, temperature: "80°C", label: "Сенча" },
    black: { seconds: 180, temperature: "95°C", label: "Чёрный чай" },
    white: { seconds: 180, temperature: "80°C", label: "Белый чай" },
    oolong: { seconds: 180, temperature: "90°C", label: "Улун" }
  };

  let remaining = presets[teaSelect.value].seconds;
  let intervalId = null;
  let running = false;

  const render = () => {
    const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
    const seconds = (remaining % 60).toString().padStart(2, "0");
    display.textContent = `${minutes}:${seconds}`;
    display.setAttribute("aria-label", `${minutes} минут ${seconds} секунд`);
  };

  const stop = () => {
    if (intervalId !== null) window.clearInterval(intervalId);
    intervalId = null;
    running = false;
    startButton.textContent = remaining === 0 ? "Готово" : "Продолжить";
    startButton.disabled = remaining === 0;
  };

  const reset = () => {
    stop();
    remaining = presets[teaSelect.value].seconds;
    startButton.disabled = false;
    startButton.textContent = "Начать заваривание";
    message.textContent = "Выберите сорт и нажмите «Начать заваривание».";
    render();
  };

  teaSelect.addEventListener("change", () => {
    const preset = presets[teaSelect.value];
    temperature.textContent = preset.temperature;
    reset();
  });

  startButton.addEventListener("click", () => {
    if (running) {
      stop();
      message.textContent = "Таймер приостановлен.";
      return;
    }
    if (remaining <= 0) return;
    running = true;
    startButton.textContent = "Пауза";
    message.textContent = `Заваривается ${presets[teaSelect.value].label}…`;
    intervalId = window.setInterval(() => {
      remaining -= 1;
      render();
      if (remaining <= 0) {
        stop();
        startButton.textContent = "Готово";
        message.textContent = "Ваш чай готов. Приятного чаепития!";
        if ("vibrate" in navigator) navigator.vibrate(120);
      }
    }, 1000);
  });

  resetButton.addEventListener("click", reset);
  render();
}

document.addEventListener("DOMContentLoaded", renderSiteComponents);
